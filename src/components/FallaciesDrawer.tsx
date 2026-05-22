import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, AlertTriangle } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import fallaciesList from '../config/fallacies.json';

export const FallaciesDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { debateLog, playerName } = useGameStore();

  // Calculate statistics of fallacies used in the active session
  const getFallacyStats = (fallacyId: string) => {
    let frankCount = 0;
    let felixCount = 0;
    let cassandraCount = 0;

    debateLog.forEach(msg => {
      if (msg.eval?.fallacies?.includes(fallacyId)) {
        if (msg.role === 'frank') frankCount++;
        else if (msg.role === 'felix') felixCount++;
        else if (msg.role === 'cassandra') cassandraCount++;
      }
    });

    return { frankCount, felixCount, cassandraCount };
  };

  return (
    <>
      {/* Drawer Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute top-4 left-4 z-40 p-3 bg-panel/90 border-2 border-accent-primary/50 text-accent-primary hover:text-white hover:border-accent-primary transition-all backdrop-blur-md shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] hover:scale-105 duration-300 rounded-lg cursor-pointer"
        title="Справочник Манипуляций"
      >
        <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
          <BookOpen size={18} className="animate-pulse" />
          <span className="hidden sm:inline">Бюро Манипуляций</span>
        </div>
      </button>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-[#0c0a09]/80 backdrop-blur-md z-50 transition-all duration-300"
            />
            
            {/* Drawer Panel */}
            <motion.div 
              initial={{ x: '-100%', opacity: 0.9 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0.9 }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="absolute top-0 left-0 h-full w-[450px] bg-[#161412]/95 border-r-2 border-accent-primary/80 z-50 p-6 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden font-mono text-text-primary"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6 border-b-2 border-accent-primary/30 pb-4 shrink-0">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="text-accent-primary animate-pulse" size={24} />
                  <div>
                    <h2 className="font-serif text-2xl text-accent-primary uppercase tracking-widest font-extrabold drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                      Fallacies Bureau
                    </h2>
                    <p className="text-xs text-text-muted uppercase tracking-wider mt-0.5">Логические Ловушки & Уловки</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 border border-text-muted/20 rounded-md text-text-muted hover:text-accent-primary hover:border-accent-primary transition-all duration-300 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Catalog Body */}
              <div className="flex-grow overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-accent-primary/40 scrollbar-track-base/20">
                <p className="text-xs text-text-muted leading-relaxed border-b border-text-muted/10 pb-3 mb-2 uppercase select-none">
                  Ниже приведен полный список манипуляций, которые Судья Соломон Бэланс выявляет в аргументах спикеров.
                </p>

                {fallaciesList.map((fallacy) => {
                  const { frankCount, felixCount, cassandraCount } = getFallacyStats(fallacy.id);

                  return (
                    <div 
                      key={fallacy.id}
                      className="bg-base/40 p-4 border-2 border-text-muted/15 rounded-lg hover:border-accent-primary/50 transition-colors duration-300"
                    >
                      {/* Name & ID */}
                      <div className="flex justify-between items-start gap-2 border-b border-text-muted/10 pb-1.5 mb-2">
                        <span className="font-mono text-sm font-bold text-accent-primary uppercase tracking-wide">
                          {fallacy.name}
                        </span>
                        <span className="text-[10px] text-text-muted bg-base/50 px-1.5 py-0.5 rounded font-mono select-none uppercase">
                          {fallacy.id}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-text-primary/90 leading-relaxed mb-2 font-mono">
                        {fallacy.description}
                      </p>

                      {/* Example */}
                      <div className="bg-[#1c1a17]/50 p-2.5 rounded border-l-2 border-accent-secondary/50 mb-3 select-all">
                        <span className="text-[10px] text-accent-secondary uppercase font-bold tracking-wider block mb-0.5">Пример манипуляции:</span>
                        <p className="font-serif text-sm italic text-text-primary/80 leading-relaxed">
                          {fallacy.example}
                        </p>
                      </div>

                      {/* Live Round Statistics */}
                      <div className="pt-2 border-t border-text-muted/10 flex justify-between items-center text-[10px] text-text-muted uppercase tracking-wider select-none font-bold">
                        <span>Зафиксировано за сессию:</span>
                        <div className="flex gap-3">
                          <span className={frankCount > 0 ? 'text-accent-secondary animate-pulse' : ''}>
                            {playerName.split(' ')[0]}: {frankCount}
                          </span>
                          <span className={felixCount > 0 ? 'text-accent-secondary animate-pulse' : ''}>
                            Феликс: {felixCount}
                          </span>
                          <span className={cassandraCount > 0 ? 'text-accent-primary animate-pulse' : ''}>
                            Кассандра: {cassandraCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="pt-4 border-t-2 border-accent-primary/30 shrink-0 font-mono text-xs text-text-muted/50 uppercase select-none flex justify-between">
                <span>The Debate Gazette // Audit</span>
                <span>16 уловок</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
