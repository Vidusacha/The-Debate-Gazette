import React from 'react';

export const StyleGuide: React.FC = () => {
  return (
    <div className="min-h-screen text-text-primary p-8 space-y-12">
      <header className="border-b border-text-muted pb-4">
        <h1 className="text-4xl font-serif text-text-primary">"The Debate Gazette" - Style Guide</h1>
        <p className="text-text-muted mt-2">Visual Sandbox & UI Guidelines</p>
      </header>

      {/* Color Palette */}
      <section>
        <h2 className="text-2xl font-serif mb-6 text-text-primary">1. Color Palette</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Base Background */}
          <div className="border border-text-muted p-4">
            <div className="h-24 bg-base border border-text-muted mb-2"></div>
            <p className="font-bold">Base Background</p>
            <p className="text-text-muted text-sm">#0A0A0C / bg-base</p>
          </div>
          
          {/* Panel/Menu Background */}
          <div className="border border-text-muted p-4 relative overflow-hidden">
            {/* Background pattern to show opacity */}
            <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiAvPgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIiAvPgo8L3N2Zz4=')]"></div>
            <div className="h-24 bg-panel/80 backdrop-blur-sm border border-text-muted mb-2 relative z-10 flex items-center justify-center">
              <span className="text-xs text-text-muted">80% Opacity</span>
            </div>
            <p className="font-bold relative z-10">Panel Background</p>
            <p className="text-text-muted text-sm relative z-10">#16161D / bg-panel</p>
          </div>

          {/* Primary Text */}
          <div className="border border-text-muted p-4 bg-panel">
            <div className="h-24 flex items-center justify-center mb-2 border border-text-muted bg-base">
              <span className="text-3xl text-text-primary font-serif">Ag</span>
            </div>
            <p className="font-bold text-text-primary">Primary Text</p>
            <p className="text-text-muted text-sm">#E0E0E0 / text-text-primary</p>
          </div>

          {/* Muted Text */}
          <div className="border border-text-muted p-4 bg-panel">
            <div className="h-24 flex items-center justify-center mb-2 border border-text-muted bg-base">
              <span className="text-3xl text-text-muted font-mono">Ag</span>
            </div>
            <p className="font-bold text-text-muted">Muted Text</p>
            <p className="text-text-muted text-sm">#6B7280 / text-text-muted</p>
          </div>

          {/* Primary Accent */}
          <div className="border border-accent-primary p-4">
            <div className="h-24 bg-accent-primary mb-2"></div>
            <p className="font-bold text-accent-primary">Gazette Red</p>
            <p className="text-text-muted text-sm">#8B0000 / bg-accent-primary</p>
          </div>

          {/* Secondary Accent */}
          <div className="border border-accent-secondary p-4">
            <div className="h-24 bg-accent-secondary mb-2"></div>
            <p className="font-bold text-accent-secondary">Typewriter Gold</p>
            <p className="text-text-muted text-sm">#D4AF37 / bg-accent-secondary</p>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 className="text-2xl font-serif mb-6 text-text-primary">2. Typography</h2>
        <div className="space-y-6 border border-text-muted p-6 bg-panel/80">
          <div>
            <p className="text-text-muted text-sm mb-2">Headings (Serif)</p>
            <h1 className="text-4xl font-serif">The Quick Brown Fox Jumps Over The Lazy Dog</h1>
            <p className="text-xs text-text-muted mt-2 font-mono">font-serif ('Playfair Display', 'Merriweather', serif)</p>
          </div>
          <div className="border-t border-text-muted pt-6">
            <p className="text-text-muted text-sm mb-2">Body & UI (Monospace)</p>
            <p className="text-base font-mono">The quick brown fox jumps over the lazy dog. 0123456789</p>
            <p className="text-xs text-text-muted mt-2 font-mono">font-mono ('Courier New', 'Roboto Mono', monospace)</p>
          </div>
        </div>
      </section>

      {/* Buttons & UI Components */}
      <section>
        <h2 className="text-2xl font-serif mb-6 text-text-primary">3. Buttons & Hover States</h2>
        <div className="border border-text-muted p-8 bg-panel/80 space-y-8">
          
          <div>
            <p className="text-text-muted mb-4 font-mono text-sm">Standard Buttons (Secondary Accent Border)</p>
            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-2 bg-transparent border border-accent-secondary text-text-primary rounded-none transition-all duration-150 ease-in-out hover:bg-accent-secondary hover:text-base font-mono">
                Default Action
              </button>
              <button className="px-4 py-2 bg-transparent border border-accent-secondary text-accent-secondary rounded-none transition-all duration-150 ease-in-out hover:bg-accent-secondary hover:text-base font-mono">
                Active State
              </button>
            </div>
          </div>

          <div>
            <p className="text-text-muted mb-4 font-mono text-sm">Destructive / Critical Buttons (Primary Accent Border)</p>
            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-2 bg-transparent border border-accent-primary text-text-primary rounded-none transition-all duration-150 ease-in-out hover:bg-accent-primary hover:text-base font-mono">
                Reject Argument
              </button>
              <button className="px-4 py-2 bg-transparent border border-accent-primary text-accent-primary rounded-none transition-all duration-150 ease-in-out hover:bg-accent-primary hover:text-base font-mono">
                Critical Alert
              </button>
            </div>
          </div>
          
          <div>
            <p className="text-text-muted mb-4 font-mono text-sm">Muted Buttons (Muted Text Border)</p>
            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-2 bg-transparent border border-text-muted text-text-muted rounded-none transition-all duration-150 ease-in-out hover:bg-text-muted hover:text-base font-mono">
                Cancel
              </button>
            </div>
          </div>

        </div>
      </section>
      
      {/* Example Panel */}
      <section>
        <h2 className="text-2xl font-serif mb-6 text-text-primary">4. UI Panel Example</h2>
        <div className="max-w-md bg-panel/80 border border-accent-secondary p-6 rounded-none backdrop-blur-sm">
          <h3 className="text-xl font-serif text-text-primary mb-4 border-b border-text-muted pb-2">Investigator's Notes</h3>
          <p className="font-mono text-text-primary text-sm mb-6">
            The evidence doesn't add up. The suspect claims they were at the <span className="text-accent-secondary">warehouse</span>, but the timestamps indicate otherwise.
          </p>
          <div className="flex justify-end gap-4">
            <button className="px-4 py-2 bg-transparent border border-text-muted text-text-muted rounded-none transition-all duration-150 ease-in-out hover:bg-text-muted hover:text-base font-mono text-sm">
              Dismiss
            </button>
            <button className="px-4 py-2 bg-transparent border border-accent-secondary text-text-primary rounded-none transition-all duration-150 ease-in-out hover:bg-accent-secondary hover:text-base font-mono text-sm">
              File Evidence
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
