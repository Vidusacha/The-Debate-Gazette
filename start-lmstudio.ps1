# Windows PowerShell Script to automatically locate LM Studio, load a model, and start the local API service.
# 
# Usage:
#   .\start-lmstudio.ps1
#   .\start-lmstudio.ps1 -ModelKey "your-model-key" -Port 1234
#
# Created by Antigravity CLI for EV.

param (
    [string]$ModelKey = "mistralai/ministral-3-14b-reasoning",
    [int]$Port = 1234,
    [int]$ContextLength = 4096,
    [string]$Gpu = "max" # "max", "off", or a float between 0.0 and 1.0
)

# Set output encoding to UTF8 for clean rendering
$OutputEncoding = [System.Text.Encoding]::UTF8

# 1. Colors & Layout Helpers
function Write-Header ($Text) {
    Write-Host "`n===============================================" -ForegroundColor Cyan
    Write-Host "   $Text" -ForegroundColor Cyan -NoNewline
    Write-Host "`n===============================================" -ForegroundColor Cyan
}

function Write-Success ($Text) {
    Write-Host "[+] $Text" -ForegroundColor Green
}

function Write-Info ($Text) {
    Write-Host "[i] $Text" -ForegroundColor White
}

function Write-Warn ($Text) {
    Write-Host "[!] $Text" -ForegroundColor Yellow
}

function Write-Err ($Text) {
    Write-Host "[x] $Text" -ForegroundColor Red
}

# 2. Locate LM Studio CLI (lms.exe)
$LmsPath = "lms"
$LmsFound = $false

Write-Header "LOCATING LM STUDIO CLI (lms)"

if (Get-Command $LmsPath -ErrorAction SilentlyContinue) {
    $LmsFound = $true
    Write-Success "lms is already available in your system PATH."
} else {
    # Check standard installation locations
    $CommonPaths = @(
        "$env:USERPROFILE\.lmstudio\bin\lms.exe",
        "D:\Program Files\LM Studio\resources\app\bin\lms.exe",
        "$env:USERPROFILE\.cache\lm-studio\bin\lms.exe",
        "C:\Program Files\LM Studio\resources\app\bin\lms.exe"
    )

    foreach ($Path in $CommonPaths) {
        if (Test-Path $Path) {
            $LmsPath = $Path
            $LmsFound = $true
            # Temporarily add directory to session PATH
            $BinDir = Split-Path $Path -Parent
            $env:PATH = "$BinDir;$env:PATH"
            Write-Success "Found lms.exe at: $Path"
            Write-Info "Temporarily added $BinDir to current session PATH."
            break
        }
    }

    if (-not $LmsFound) {
        Write-Warn "lms.exe not found in standard locations. Searching user profile (this may take a few seconds)..."
        $SearchResults = Get-ChildItem -Path $env:USERPROFILE -Filter lms.exe -Recurse -ErrorAction SilentlyContinue
        if ($SearchResults) {
            $LmsPath = $SearchResults[0].FullName
            $LmsFound = $true
            $BinDir = Split-Path $LmsPath -Parent
            $env:PATH = "$BinDir;$env:PATH"
            Write-Success "Located lms.exe at: $LmsPath"
        }
    }
}

if (-not $LmsFound) {
    Write-Err "Could not locate LM Studio CLI ('lms.exe')."
    Write-Info "Please verify that:"
    Write-Info "  1. LM Studio is installed on this machine."
    Write-Info "  2. You have launched the LM Studio GUI application at least once."
    Write-Info "  3. You can manually set `$LmsPath` in this script to your absolute path."
    Exit 1
}

# 3. Initialize/Bootstrap CLI if necessary
try {
    Write-Info "Verifying LM Studio CLI status..."
    & $LmsPath bootstrap | Out-Null
} catch {
    Write-Warn "Bootstrap verification warning (could be running for the first time or already initialized)."
}

# 4. Model Selection
Write-Header "SELECTING THE LANGUAGE MODEL"

$SelectedModel = $ModelKey

if ([string]::IsNullOrWhiteSpace($SelectedModel)) {
    Write-Info "Querying downloaded models from LM Studio..."
    
    # Try fetching via JSON first for robust parsing
    $JsonOutput = & $LmsPath ls --llm --json 2>$null
    $Models = @()
    
    if ($JsonOutput) {
        try {
            $Parsed = ConvertFrom-Json $JsonOutput
            if ($Parsed.GetType().Name -eq "Object[]" -or $Parsed.GetType().Name -eq "ArrayList") {
                $Models = $Parsed
            } elseif ($Parsed.models) {
                $Models = $Parsed.models
            } elseif ($Parsed.llms) {
                $Models = $Parsed.llms
            } else {
                $Models = $Parsed
            }
        } catch {
            Write-Warn "Could not parse JSON. Falling back to plain-text listing."
        }
    }

    # Extract model keys
    $ModelList = @()
    if ($Models.Count -gt 0) {
        foreach ($M in $Models) {
            $Key = $M.path
            if (-not $Key) { $Key = $M.id }
            if (-not $Key) { $Key = $M.modelKey }
            if (-not $Key) { $Key = $M.name }
            if ($Key) { $ModelList += $Key }
        }
    }

    # If JSON parsing failed or found nothing, parse plain text
    if ($ModelList.Count -eq 0) {
        Write-Info "Parsing plain text models list..."
        $RawList = & $LmsPath ls --llm
        # Find lines that look like model paths (containing slashes or GGUF names)
        # and do not contain headers/summary texts
        foreach ($Line in ($RawList -split "`r?`n")) {
            $CleanLine = $Line.Trim()
            if ($CleanLine -and -not ($CleanLine -match "models, taking up") -and -not ($CleanLine -match "LLMs") -and -not ($CleanLine -match "PARAMS\s+ARCHITECTURE")) {
                # Grab the first token of the line (usually the model key)
                $Tokens = $CleanLine -split "\s+"
                if ($Tokens[0] -and ($Tokens[0] -match "/" -or $Tokens[0] -match "\.gguf")) {
                    $ModelList += $Tokens[0]
                }
            }
        }
    }

    # Display selection menu
    if ($ModelList.Count -gt 0) {
        Write-Host "`nAvailable models found:" -ForegroundColor Yellow
        $Idx = 1
        foreach ($M in $ModelList) {
            Write-Host "  [$Idx] $M" -ForegroundColor Cyan
            $Idx++
        }
        Write-Host "  [C] Enter custom model key manually" -ForegroundColor Yellow

        $Choice = Read-Host "`nSelect a model number [1-$($ModelList.Count)] or 'C'"
        $Choice = $Choice.Trim()

        if ($Choice -eq 'C' -or $Choice -eq 'c') {
            $SelectedModel = Read-Host "Enter the exact model key (e.g. lmstudio-community/meta-llama-3-8b-instruct)"
        } else {
            if ([int]::TryParse($Choice, [ref]$SelIdx)) {
                if ($SelIdx -ge 1 -and $SelIdx -le $ModelList.Count) {
                    $SelectedModel = $ModelList[$SelIdx - 1]
                }
            }
        }
    }

    # Ultimate fallback if no model selected or found
    if ([string]::IsNullOrWhiteSpace($SelectedModel)) {
        Write-Warn "No model selected from the list."
        $SelectedModel = Read-Host "Enter the exact model key/path you want to load"
    }
}

if ([string]::IsNullOrWhiteSpace($SelectedModel)) {
    Write-Err "No model key specified. Cannot proceed."
    Exit 1
}

$SelectedModel = $SelectedModel.Trim()
Write-Success "Target Model Selected: $SelectedModel"

# 5. Start LM Studio Server
Write-Header "STARTING LOCAL API SERVER"

$Status = & $LmsPath status 2>$null
$ServerRunning = $false

if ($Status -match "Local Server:\s+ON" -or $Status -match "server is running") {
    $ServerRunning = $true
    Write-Success "LM Studio server is already running."
} else {
    Write-Info "Launching LM Studio local server on port $Port (CORS enabled)..."
    & $LmsPath server start --port $Port --cors
    
    # Pause briefly for startup
    Start-Sleep -Seconds 2
    
    $StatusCheck = & $LmsPath status 2>$null
    if ($StatusCheck -match "Local Server:\s+ON" -or $StatusCheck -match "server is running" -or $LASTEXITCODE -eq 0) {
        $ServerRunning = $true
        Write-Success "LM Studio server started successfully on port $Port."
    } else {
        Write-Warn "LM Studio server launch status is unclear. Will attempt to proceed."
    }
}

# 6. Load Model
Write-Header "LOADING THE MODEL INTO MEMORY"

# Check if model is already loaded
$LoadedModels = & $LmsPath ps 2>$null
$IsLoaded = $false

foreach ($Line in ($LoadedModels -split "`r?`n")) {
    if ($Line -match [regex]::Escape($SelectedModel)) {
        $IsLoaded = $true
        break
    }
}

if ($IsLoaded) {
    Write-Success "Model '$SelectedModel' is already loaded in memory."
} else {
    Write-Info "Loading model '$SelectedModel' (GPU configuration: $Gpu, Context Length: $ContextLength)..."
    & $LmsPath load $SelectedModel --gpu=$Gpu --context-length $ContextLength
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Model '$SelectedModel' loaded successfully!"
    } else {
        Write-Err "Failed to load model. Check your model key or LM Studio desktop log."
        Exit 1
    }
}

# 7. Summary & Next Steps
Write-Header "LM STUDIO SERVICE RUNNING"
Write-Host "All systems are operational!" -ForegroundColor Green
Write-Host "`nLocal Endpoint:" -ForegroundColor White -NoNewline
Write-Host "  http://localhost:$Port/v1" -ForegroundColor Green
Write-Host "Base Model    :" -ForegroundColor White -NoNewline
Write-Host "  $SelectedModel" -ForegroundColor Yellow
Write-Host "Context Length:" -ForegroundColor White -NoNewline
Write-Host "  $ContextLength" -ForegroundColor Yellow
Write-Host "GPU Allocation:" -ForegroundColor White -NoNewline
Write-Host "  $Gpu" -ForegroundColor Yellow

Write-Host "`nUsage Example in Python / JS (OpenAI compatible):" -ForegroundColor Cyan
Write-Host "  client = OpenAI(base_url='http://localhost:$Port/v1', api_key='lm-studio')" -ForegroundColor Gray
Write-Host "`nTo check status manually, run:" -ForegroundColor White
Write-Host "  lms status" -ForegroundColor Cyan
Write-Host "  lms ps" -ForegroundColor Cyan

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
