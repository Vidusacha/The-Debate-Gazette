import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { generateDebateResponse } from '../services/llmService';
import { TypewriterText } from '../components/TypewriterText';

export const ComicCanvas: React.FC = () => {
  const { gamePhase, activeTarget, setGamePhase, setActiveTarget, resetState } = useGameStore();
  const [playerInput, setPlayerInput] = useState('');
  const [opponentResponse, setOpponentResponse] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async () => {
    if (!playerInput.trim() || isTyping) return;
    
    setIsTyping(true);
    setOpponentResponse(null);
    
    const response = await generateDebateResponse(playerInput);
    
    setOpponentResponse(response);
    setIsTyping(false);
    setPlayerInput('');
  };

  const handleClose = () => {
    setPlayerInput('');
    setOpponentResponse(null);
    setIsTyping(false);
    resetState();
  };

  const startDebate = () => {
    setGamePhase('debate');
    setActiveTarget('The Adversary');
  };

  const panelVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.25, 0.1, 0.25, 1]
      } 
    }
  };

  return (
    <div className="flex w-full h-full p-4 gap-4 bg-base">
      
      {/* Left Panel: NPC Visuals */}
      <motion.div 
        className="w-1/2 h-full border border-text-muted relative overflow-hidden group cursor-pointer"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        onClick={gamePhase === 'exploration' ? startDebate : undefined}
      >
        {/* Placeholder Noir Graphic for NPC */}
        <div className="absolute inset-0 bg-gradient-to-t from-accent-primary to-base opacity-80 mix-blend-multiply pointer-events-none group-hover:from-accent-secondary transition-all duration-500"></div>
        
        {/* Subtle CSS Noise */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiAvPgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIiAvPgo8L3N2Zz4=')] pointer-events-none"></div>

        <div className="absolute bottom-4 left-4 p-4 bg-panel/90 backdrop-blur border border-text-muted">
          <h2 className="font-serif text-2xl text-text-primary uppercase tracking-widest">
            {gamePhase === 'debate' ? activeTarget : 'Unknown Entity'}
          </h2>
          <p className="font-mono text-sm text-text-muted mt-1">
            {gamePhase === 'debate' ? 'Neural Link Active' : 'Click to Initiate Debate Protocol'}
          </p>
        </div>
      </motion.div>

      {/* Right Panel: Player Terminal */}
      <motion.div 
        className="w-1/2 h-full border border-text-muted bg-panel/50 backdrop-blur-sm p-6 flex flex-col"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        {gamePhase === 'exploration' ? (
          <div className="flex-grow flex items-center justify-center text-text-muted font-mono animate-pulse">
            [ STANDBY - AWAITING TARGET ENGAGEMENT ]
          </div>
        ) : (
          <div className="flex-grow flex flex-col h-full">
            <h2 className="text-xl font-serif text-accent-secondary uppercase tracking-widest border-b border-text-muted pb-2 shrink-0 flex gap-2">
              <TypewriterText text="[ CONNECTION ESTABLISHED ]" delay={1100} speed={40} />
              {activeTarget && (
                <TypewriterText text={`:: ${activeTarget}`} delay={2100} speed={50} className="text-text-primary" />
              )}
            </h2>
            
            <div className="flex-grow overflow-y-auto py-4 space-y-6">
              {/* NPC Response Box */}
              {opponentResponse ? (
                <div className="text-accent-secondary border-l-2 border-accent-secondary pl-4 italic font-serif text-lg bg-base/50 p-4">
                  "{opponentResponse}"
                </div>
              ) : (
                <div className="text-text-primary text-sm font-mono opacity-50">
                  Awaiting analytical input...
                </div>
              )}
              
              {isTyping && (
                <div className="text-accent-primary animate-pulse tracking-widest uppercase font-mono text-sm border-l-2 border-accent-primary pl-4">
                  AWAITING NEURAL RESPONSE...
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="shrink-0 mt-4 border-t border-text-muted pt-4">
              <textarea 
                value={playerInput}
                onChange={(e) => setPlayerInput(e.target.value)}
                disabled={isTyping}
                placeholder="Type your argument..."
                className="w-full bg-base/50 border border-text-muted text-text-primary p-3 focus:outline-none focus:border-accent-secondary resize-none font-mono h-32"
              />
              
              <div className="flex justify-between mt-4">
                <button 
                  onClick={handleSubmit}
                  disabled={isTyping || !playerInput.trim()}
                  className="px-6 py-2 bg-transparent border border-accent-secondary text-accent-secondary hover:bg-accent-secondary hover:text-base transition-colors duration-150 uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Argument
                </button>
                <button 
                  onClick={handleClose}
                  className="px-6 py-2 bg-transparent border border-text-muted text-text-muted hover:bg-text-muted hover:text-base transition-colors duration-150 uppercase tracking-widest text-sm"
                >
                  Close Link
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

    </div>
  );
};
