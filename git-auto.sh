#!/usr/bin/env bash
# File: git-auto.sh
# A premium, Gemini-driven Git Auto-Pilot pipeline.

# Terminal colors
RED='\033[1;31m'
GREEN='\033[1;32m'
CYAN='\033[1;36m'
GOLD='\033[1;33m'
RESET='\033[0m'
BOLD='\033[1m'

echo -e "${CYAN}==================================================${RESET}"
echo -e "${GOLD}   THE DEBATE GAZETTE // GIT AUTO-PILOT v1.3.0    ${RESET}"
echo -e "${CYAN}==================================================${RESET}"
echo -e "🚀 ${BOLD}Scanning differences and invoking Gemini...${RESET}"

# 1. Dynamically detect Node executable (works in standard Unix or WSL with Windows Node)
if command -v node >/dev/null 2>&1; then
  NODE_CMD="node"
elif command -v node.exe >/dev/null 2>&1; then
  NODE_CMD="node.exe"
else
  echo -e "\n${RED}❌ Error: Node.js was not found in your PATH.${RESET}"
  echo -e "Please install Node.js to use the Git Auto-Pilot tool."
  exit 1
fi

# Dynamically resolve absolute directory of this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

SCRIPT_PATH="$DIR/scripts/git-auto-pilot.js"
if [[ "$(which $NODE_CMD)" == *".exe"* ]]; then
  if command -v wslpath >/dev/null 2>&1; then
    SCRIPT_PATH=$(wslpath -w "$SCRIPT_PATH")
  fi
fi

# 2. Run Node analyzer with absolute path
COMMIT_MSG=$($NODE_CMD "$SCRIPT_PATH")
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo -e "\n${RED}❌ Git Auto-Pilot Failure${RESET}"
  echo -e "${RED}${COMMIT_MSG}${RESET}"
  exit 1
fi

# 3. Check if clean
if [ "$COMMIT_MSG" = "clean" ]; then
  echo -e "\n${GREEN}✨ Working tree clean. Nothing to commit.${RESET}"
  exit 0
fi

# 4. Extract first line as summary
SUMMARY=$(echo "$COMMIT_MSG" | head -n 1)

echo -e "\n${GREEN}✅ Delta Analysis & Documentation Complete!${RESET}"
echo -e "📊 ${BOLD}AI Commit Summary:${RESET} ${CYAN}${SUMMARY}${RESET}"
echo -e "💬 ${BOLD}Proposed Commit Message:${RESET}"
echo -e "${CYAN}--------------------------------------------------${RESET}"
echo -e "${COMMIT_MSG}"
echo -e "${CYAN}--------------------------------------------------${RESET}"

# 5. Stage and commit
echo -e "📦 ${BOLD}Staging files and creating commit...${RESET}"
git add -A

# Write commit message to temporary file to preserve line breaks correctly
TEMP_COMMIT_FILE=$(mktemp)
echo "$COMMIT_MSG" > "$TEMP_COMMIT_FILE"

git commit -F "$TEMP_COMMIT_FILE"
COMMIT_EXIT=$?
rm -f "$TEMP_COMMIT_FILE"

if [ $COMMIT_EXIT -ne 0 ]; then
  echo -e "${RED}❌ Git commit failed.${RESET}"
  exit 1
fi

# 6. Push changes
echo -e "⚡ ${BOLD}Pushing changes to remote repository...${RESET}"
git push
PUSH_EXIT=$?

if [ $PUSH_EXIT -eq 0 ]; then
  echo -e "\n${GREEN}🎉 SUCCESS! Your changes have been successfully committed and pushed.${RESET}"
  echo -e "${CYAN}==================================================${RESET}"
  exit 0
else
  echo -e "\n${RED}❌ Push failed. Please check your network or remote settings.${RESET}"
  exit 1
fi
