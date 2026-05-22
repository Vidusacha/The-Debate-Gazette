import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, X, BarChart2, AlertTriangle } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import fallaciesList from '../config/fallacies.json';

interface SpeakerStats {
  statements: number;
  logicSum: number;
  veracitySum: number;
  chaosSum: number;
  respectSum: number;
  cynicismSum: number;
  evalCount: number;
  fallaciesCount: number;
  fallaciesMap: Record<string, number>;
}

export const ScoreboardDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { debateLog, playerName, maxRounds, turnCount, cassandraConviction, cassandraSideSwitched } = useGameStore();


  // Process stats for each speaker
  const getStats = () => {
    const stats: Record<'frank' | 'felix' | 'cassandra', SpeakerStats> = {
      frank: { statements: 0, logicSum: 0, veracitySum: 0, chaosSum: 0, respectSum: 0, cynicismSum: 0, evalCount: 0, fallaciesCount: 0, fallaciesMap: {} },
      felix: { statements: 0, logicSum: 0, veracitySum: 0, chaosSum: 0, respectSum: 0, cynicismSum: 0, evalCount: 0, fallaciesCount: 0, fallaciesMap: {} },
      cassandra: { statements: 0, logicSum: 0, veracitySum: 0, chaosSum: 0, respectSum: 0, cynicismSum: 0, evalCount: 0, fallaciesCount: 0, fallaciesMap: {} },
    };

    debateLog.forEach(msg => {
      const role = msg.role;
      if (role === 'frank' || role === 'felix' || role === 'cassandra') {
        stats[role].statements++;
        if (msg.eval) {
          stats[role].logicSum += msg.eval.x;
          stats[role].chaosSum += msg.eval.y;
          stats[role].veracitySum += msg.eval.z;
          stats[role].respectSum += msg.eval.w;
          stats[role].cynicismSum += msg.eval.v;
          stats[role].evalCount++;

          if (msg.eval.fallacies && msg.eval.fallacies.length > 0) {
            stats[role].fallaciesCount += msg.eval.fallacies.length;
            msg.eval.fallacies.forEach(fId => {
              stats[role].fallaciesMap[fId] = (stats[role].fallaciesMap[fId] || 0) + 1;
            });
          }
        }
      }
    });

    return stats;
  };

  const stats = getStats();

  // Helper to get fallacy name by ID
  const getFallacyName = (id: string) => {
    return fallaciesList.find(f => f.id === id)?.name || id;
  };

  // Helper to render metric slider/bar from -1.0 to +1.0
  const renderMetricBar = (label: string, value: number, leftLabel: string, rightLabel: string, colorClass: string) => {
    // value is from -1.0 to 1.0, convert to percentage 0% to 100%
    const percentage = ((value + 1) / 2) * 100;
    
    return (
      <div className="space-y-1 text-xs">
        <div className="flex justify-between font-bold text-[10px] text-text-muted uppercase">
          <span>{label}</span>
          <span className={colorClass}>{(value >= 0 ? '+' : '') + value.toFixed(2)}</span>
        </div>
        <div className="relative w-full h-3 bg-base border border-text-muted/20 rounded overflow-hidden">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-text-muted/30 z-10" />
          {/* Active bar */}
          <div 
            className={`absolute top-0 bottom-0 transition-all duration-500 ${colorClass === 'text-accent-secondary' ? 'bg-accent-secondary/45' : 'bg-accent-primary/45'}`}
            style={{ 
              left: percentage >= 50 ? '50%' : `${percentage}%`, 
              right: percentage >= 50 ? `${100 - percentage}%` : '50%' 
            }}
          />
          {/* Marker dot */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-text-primary z-20 transition-all duration-500 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{ left: `calc(${percentage}% - 4px)` }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-text-muted/50 font-bold select-none uppercase">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Drawer Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute top-4 right-18 z-40 p-3 bg-panel/90 border-2 border-accent-secondary/50 text-accent-secondary hover:text-white hover:border-accent-secondary transition-all backdrop-blur-md shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] hover:scale-105 duration-300 rounded-lg cursor-pointer"
        title="Табло Общего Счета"
      >
        <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
          <Award size={18} className="animate-pulse" />
          <span className="hidden sm:inline">Общий Счет</span>
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
              initial={{ x: '100%', opacity: 0.9 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.9 }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="absolute top-0 right-0 h-full w-[480px] bg-[#161412]/95 border-l-2 border-accent-secondary/80 z-50 p-6 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden font-mono text-text-primary"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6 border-b-2 border-accent-secondary/30 pb-4 shrink-0">
                <div className="flex items-center gap-3">
                  <BarChart2 className="text-accent-secondary animate-pulse" size={24} />
                  <div>
                    <h2 className="font-serif text-2xl text-accent-secondary uppercase tracking-widest font-extrabold drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                      Scoreboard Feed
                    </h2>
                    <p className="text-xs text-text-muted uppercase tracking-wider mt-0.5">Аналитическое Табло Общего Счета</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 border border-text-muted/20 rounded-md text-text-muted hover:text-accent-secondary hover:border-accent-secondary transition-all duration-300 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Session Summary Bar */}
              <div className="mb-6 p-4 bg-base/50 border border-text-muted/20 rounded-lg flex justify-between items-center text-xs shrink-0 select-none">
                <div>
                  <span className="text-text-muted uppercase tracking-wider block">Текущий прогресс:</span>
                  <span className="text-accent-secondary font-bold text-sm">РАУНД {turnCount - 1} ИЗ {maxRounds}</span>
                </div>
                <div className="text-right">
                  <span className="text-text-muted uppercase tracking-wider block">Оппонент Кассандра:</span>
                  <span className={`font-bold text-sm ${cassandraSideSwitched ? 'text-accent-secondary' : 'text-accent-primary'}`}>
                    {cassandraSideSwitched ? 'СЛОМЛЕНА (Победа!)' : `${cassandraConviction}% УПРЯМСТВА`}
                  </span>
                </div>
              </div>

              {/* Scoreboard Body */}
              <div className="flex-grow overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-accent-secondary/40 scrollbar-track-base/20">
                
                {/* Loop over speakers */}
                {(['frank', 'felix', 'cassandra'] as const).map(role => {
                  const speakerStat = stats[role];
                  const hasEvals = speakerStat.evalCount > 0;
                  
                  // Compute averages
                  const avgLogic = hasEvals ? speakerStat.logicSum / speakerStat.evalCount : 0;
                  const avgChaos = hasEvals ? speakerStat.chaosSum / speakerStat.evalCount : 0;
                  const avgVeracity = hasEvals ? speakerStat.veracitySum / speakerStat.evalCount : 0;
                  const avgRespect = hasEvals ? speakerStat.respectSum / speakerStat.evalCount : 0;
                  const avgCynicism = hasEvals ? speakerStat.cynicismSum / speakerStat.evalCount : 0;

                  // Rendered names and colors
                  const name = role === 'frank' ? playerName : role === 'felix' ? 'Д-р Феликс Сикофант' : 'Кассандра Циник';
                  const title = role === 'frank' ? 'ГЛАВНЫЙ РЕДАКТОР // ИГРОК' : role === 'felix' ? 'ИИ-АДВОКАТ // СОЮЗНИК' : 'ЛОКАЛЬНЫЙ АНАЛИТИК // ОППОНЕНТ';
                  
                  const isPlayer = role === 'frank';
                  const isOpponent = role === 'cassandra';
                  
                  const borderClass = isPlayer 
                    ? 'border-accent-secondary/40 hover:border-accent-secondary/70' 
                    : isOpponent 
                      ? 'border-accent-primary/40 hover:border-accent-primary/70' 
                      : 'border-text-muted/20 hover:border-text-muted/50';

                  const textAccentClass = isOpponent ? 'text-accent-primary' : 'text-accent-secondary';

                  // Top 3 fallacies triggered
                  const sortedFallacies = Object.entries(speakerStat.fallaciesMap)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3);

                  return (
                    <div 
                      key={role}
                      className={`bg-base/30 p-5 border-2 rounded-lg transition-all duration-300 ${borderClass}`}
                    >
                      {/* Speaker header */}
                      <div className="flex justify-between items-start border-b border-text-muted/10 pb-2 mb-4">
                        <div>
                          <h3 className={`font-serif text-lg font-bold uppercase tracking-wide ${textAccentClass}`}>
                            {name}
                          </h3>
                          <span className="text-[9px] text-text-muted font-bold tracking-widest uppercase block mt-0.5">
                            {title}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-text-muted uppercase block font-bold">Реплик:</span>
                          <span className="text-lg font-bold text-text-primary">{speakerStat.statements}</span>
                        </div>
                      </div>

                      {/* Fallacy Counter Badge */}
                      <div className="mb-4 flex items-center justify-between p-2.5 bg-black/30 border border-text-muted/10 rounded">
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={14} className={speakerStat.fallaciesCount > 0 ? 'text-accent-primary animate-pulse' : 'text-text-muted'} />
                          <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Всего логических уловок:</span>
                        </div>
                        <span className={`text-sm font-bold ${speakerStat.fallaciesCount > 0 ? 'text-accent-primary' : 'text-text-muted'}`}>
                          {speakerStat.fallaciesCount}
                        </span>
                      </div>

                      {/* Logical Veracity & Tone Gauges */}
                      {hasEvals ? (
                        <div className="space-y-4">
                          {renderMetricBar('Логика / Эмоции [X]', avgLogic, 'Эмоции', 'Логика', textAccentClass)}
                          {renderMetricBar('Честность / Спин [Z]', avgVeracity, 'Спин', 'Честность', textAccentClass)}
                          {renderMetricBar('Уважение / Враждебность [W]', avgRespect, 'Враждебность', 'Уважение', textAccentClass)}
                          {renderMetricBar('Подача / Цинизм [V]', avgCynicism, 'Цинизм', 'Академизм', textAccentClass)}
                          {renderMetricBar('Порядок / Хаос [Y]', avgChaos, 'Хаос', 'Порядок', textAccentClass)}

                          {/* Top Fallacies List */}
                          {sortedFallacies.length > 0 && (
                            <div className="pt-3 border-t border-text-muted/10">
                              <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider block mb-2">Топ частых манипуляций:</span>
                              <div className="space-y-1.5">
                                {sortedFallacies.map(([fId, count]) => (
                                  <div key={fId} className="flex justify-between items-center text-xs bg-black/25 p-1.5 px-2 rounded border-l-2 border-accent-primary/60">
                                    <span className="font-semibold text-text-primary text-[11px] truncate max-w-[280px]">
                                      {getFallacyName(fId)}
                                    </span>
                                    <span className="text-[10px] font-bold text-accent-primary bg-accent-primary/10 px-2 py-0.5 rounded shrink-0">
                                      {count} раз(а)
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="py-6 text-center text-xs text-text-muted/60 uppercase select-none italic">
                          [ Статистика оценок еще не накоплена ]
                        </div>
                      )}
                    </div>
                  );
                })}

              </div>

              {/* Footer */}
              <div className="pt-4 border-t-2 border-accent-secondary/30 shrink-0 font-mono text-xs text-text-muted/50 uppercase select-none flex justify-between">
                <span>The Debate Gazette // Audit Board</span>
                <span>{debateLog.length} реплик всего</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
