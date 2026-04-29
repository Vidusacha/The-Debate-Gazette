import React from 'react';
import { ComicCanvas } from '../engine/ComicCanvas';

export const GameLayout: React.FC = () => {
  return (
    <div className="h-screen bg-base p-4 flex flex-col font-mono text-text-primary overflow-hidden">
      {/* Header framing */}
      <header className="border-b border-text-muted pb-2 mb-4 flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-xl font-serif tracking-widest text-text-primary">THE DEBATE GAZETTE</h1>
          <p className="text-xs text-text-muted mt-1 uppercase">Monitor Feed // Active Session</p>
        </div>
        <div className="text-right text-xs text-text-muted flex flex-col items-end">
          <span>REC <span className="inline-block w-2 h-2 bg-accent-primary rounded-full animate-pulse ml-1"></span></span>
          <span className="mt-1">SEC-001</span>
        </div>
      </header>

      {/* Main Content Area - Comic Layout Frame */}
      <main className="flex-grow flex flex-col relative bg-base overflow-hidden">
        {/* Comic Canvas handles the two-panel animated layout */}
        <div className="absolute inset-0">
          <ComicCanvas />
        </div>
        
        {/* Overlay scanning line effect (optional) */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-10"></div>
      </main>

      {/* Footer framing */}
      <footer className="mt-4 pt-2 border-t border-text-muted flex justify-between text-xs text-text-muted shrink-0">
        <span>SYS.ONLINE</span>
        <span>AWAITING INPUT...</span>
      </footer>
    </div>
  );
};
