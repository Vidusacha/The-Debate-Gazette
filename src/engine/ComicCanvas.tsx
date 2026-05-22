import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { useDebateOrchestrator } from '../hooks/useDebateOrchestrator';
import { AlertTriangle, Wifi, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import fallaciesList from '../config/fallacies.json';
import { speakText, stopSpeech } from '../services/speechService';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export const ComicCanvas: React.FC = () => {
  const store = useGameStore();
  const {
    gamePhase,
    setGamePhase,
    resetState,
    debateLog,
    felixConviction,
    cassandraConviction,
    cassandraSideSwitched,
    currentEdict,
    searchQuotas,
    activeSpeaker,
    settings,
    turnCount,
    maxRounds,
    playerName,
  } = store;

  const [playerInput, setPlayerInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [userHandle, setUserHandle] = useState('@ABOCb');
  const [useSearchCharge, setUseSearchCharge] = useState(false);
  
  const articleEndRef = useRef<HTMLDivElement>(null);
  const { processTurn } = useDebateOrchestrator(setStatusMessage, userHandle);

  // Speech Recognition (STT) Hook
  const {
    isListening,
    toggleListening,
    isSupported: isSttSupported,
  } = useSpeechRecognition({
    onResult: (transcript) => {
      setPlayerInput((prev) => {
        const space = prev && !prev.endsWith(' ') ? ' ' : '';
        return prev + space + transcript;
      });
    },
    lang: 'ru-RU',
  });

  // Voicing character lines when added to the debate log (TTS)
  const prevLogLengthRef = useRef(0);
  useEffect(() => {
    if (gamePhase === 'debate' && settings.voiceTtsEnabled) {
      if (debateLog.length > prevLogLengthRef.current) {
        const latestMsg = debateLog[debateLog.length - 1];
        // Do not voice the player themselves ('frank')
        if (latestMsg.role !== 'frank') {
          const roleKey = latestMsg.role as Exclude<typeof latestMsg.role, 'frank'>;
          speakText(
            latestMsg.content,
            roleKey,
            settings.voiceTtsSettings?.[roleKey]
          );
        }
      }
    }
    prevLogLengthRef.current = debateLog.length;
  }, [debateLog, settings.voiceTtsEnabled, settings.voiceTtsSettings, gamePhase]);

  // Stop voicing when resetting or if log is cleared
  useEffect(() => {
    if (debateLog.length === 0) {
      prevLogLengthRef.current = 0;
      stopSpeech();
    }
  }, [debateLog]);

  // Clean up voice synthesis on phase change or unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [gamePhase]);

  // Auto-scroll to the bottom of the newspaper article
  useEffect(() => {
    if (articleEndRef.current) {
      articleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [debateLog, isTyping]);

  const handleSubmit = async () => {
    if (!playerInput.trim() || isTyping) return;
    
    setIsTyping(true);
    await processTurn(playerInput, useSearchCharge);
    setIsTyping(false);
    setPlayerInput('');
    setUseSearchCharge(false); // Reset charge usage
  };

  const handleClose = () => {
    setPlayerInput('');
    setIsTyping(false);
    resetState();
  };

  const startDebate = () => {
    setGamePhase('debate');
  };

  // Halftone/Paper background CSS helper
  const paperTextureClass = "bg-[#ECE7E1] bg-[radial-gradient(#C4BFB9_1px,transparent_1px)] [background-size:12px_12px] text-[#1C1A17]";

  // Helper to resolve fallacy name by ID
  const getFallacyDetails = (id: string) => {
    return fallaciesList.find(f => f.id === id);
  };

  // Swearing search phrase animations helper
  const getSearchAnimationText = (speaker: string) => {
    if (speaker === 'felix') {
      return ["*СУДОРОЖНО ЛИСТАЕТ АРХИВЫ*", "*ВЫТИРАЕТ ПОТ С ЛИЦА ВЕРТУАЛЬНЫМ ПЛАТКОМ*", "*ИЩЕТ СПРАВОЧНИКИ ПО ЛОГИКЕ*"][turnCount % 3];
    }
    if (speaker === 'cassandra') {
      return ["*КОПАЕТСЯ В СОЦСЕТЯХ ПОД АНОНИМАЙЗЕРОМ*", "*ЗЛОБНО КУРИТ И ШУРШИТ АРХИВАМИ*", "*ИЩЕТ ДЕРЬМО И ФАКТЫ НА ОППОНЕНТА*"][turnCount % 3];
    }
    return "*СКАНИРОВАНИЕ УПЛИНКА...*";
  };

  return (
    <div className="flex flex-col w-full h-full gap-4 bg-base overflow-hidden">
      
      {gamePhase === 'exploration' ? (
        // ==========================================
        // STAGE 0: EXPLORATION (START SCREEN & SETTINGS SUMMARY)
        // ==========================================
        <motion.div 
          className="flex-grow flex flex-col items-center justify-center p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Main Title Panel - Max Payne Comic Frame */}
          <div className="max-w-4xl w-full border-4 border-text-primary bg-panel p-8 shadow-2xl relative">
            {/* Halftone diagonal comic slice effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-secondary opacity-15 clip-path-polygon pointer-events-none"></div>

            <div className="text-center border-b-2 border-text-muted pb-6 mb-8">
              <h1 className="text-5xl font-serif tracking-widest text-accent-secondary uppercase font-bold">
                THE DEBATE GAZETTE
              </h1>
              <p className="text-sm font-mono text-text-muted tracking-widest uppercase mt-2">
                Циничные риторические баталии // Сессия Выпуска №1
              </p>
            </div>

            {/* Injections & Settings Summary Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              
              {/* Card 1: Frank */}
              <div className="border border-text-muted/30 p-4 bg-base/50 relative">
                <div className="absolute top-2 right-2 text-text-muted/40 font-bold">#01</div>
                <h3 className="font-serif text-lg text-text-primary uppercase border-b border-text-muted/20 pb-1 mb-3">
                  {playerName}
                </h3>
                <p className="text-xs text-text-muted uppercase font-mono space-y-1">
                  <div>Роль: Игрок (Свободный ввод)</div>
                  <div className="text-accent-secondary">Поисковые заряды: {settings.frankQuota}</div>
                </p>
              </div>

              {/* Card 2: Felix */}
              <div className="border border-accent-secondary/30 p-4 bg-base/50 relative">
                <div className="absolute top-2 right-2 text-accent-secondary/30 font-bold">#02</div>
                <h3 className="font-serif text-lg text-accent-secondary uppercase border-b border-accent-secondary/20 pb-1 mb-3">
                  Dr. Felix
                </h3>
                <div className="text-xs text-text-muted uppercase font-mono space-y-1">
                  <div>Роль: Облачный Защитник</div>
                  <div>Поисковые заряды: {settings.felixQuota}</div>
                  <div>Deep Research: {settings.deepResearch.felix ? 'АКТИВЕН' : 'ВЫКЛ'}</div>
                  <div className="text-xs text-accent-secondary border-t border-text-muted/10 pt-1 mt-1">
                    Специи: {Object.entries(settings.injections.felix)
                      .filter(([_, v]) => v)
                      .map(([k]) => k === 'adHominem' ? 'AdHom' : k === 'profanity' ? 'Мат' : 'Сарказм')
                      .join(', ') || 'Нет'}
                  </div>
                </div>
              </div>

              {/* Card 3: Cassandra */}
              <div className="border border-accent-primary/30 p-4 bg-base/50 relative">
                <div className="absolute top-2 right-2 text-accent-primary/30 font-bold">#03</div>
                <h3 className="font-serif text-lg text-accent-primary uppercase border-b border-accent-primary/20 pb-1 mb-3">
                  Cassandra
                </h3>
                <div className="text-xs text-text-muted uppercase font-mono space-y-1">
                  <div>Роль: Локальный Оппонент</div>
                  <div>Модель: Mistral (LM Studio)</div>
                  <div>Поисковые заряды: {settings.cassandraQuota}</div>
                  <div>Deep Research: {settings.deepResearch.cassandra ? 'АКТИВЕН' : 'ВЫКЛ'}</div>
                  <div className="text-xs text-accent-primary border-t border-text-muted/10 pt-1 mt-1">
                    Специи: {Object.entries(settings.injections.cassandra)
                      .filter(([_, v]) => v)
                      .map(([k]) => k === 'adHominem' ? 'AdHom' : k === 'profanity' ? 'Мат' : 'Сарказм')
                      .join(', ') || 'Нет'}
                  </div>
                </div>
              </div>

            </div>

            {/* Launch Button */}
            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={startDebate}
                className="w-full max-w-sm py-4 bg-transparent border-2 border-accent-secondary text-accent-secondary hover:bg-accent-secondary hover:text-base font-serif text-xl font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] cursor-pointer"
              >
                Начать выпуск газеты
              </button>
              <span className="text-xs text-text-muted uppercase tracking-widest animate-pulse">
                [ Параметры дебатов будут жестко зафиксированы в коде ]
              </span>
            </div>
          </div>
        </motion.div>
      ) : (
        // ==========================================
        // STAGE 1: THE DEBATE & THE GAZETTE COLUMN
        // ==========================================
        <div className="flex-grow flex flex-col h-full overflow-hidden gap-4">
          
          {/* SECTION A: THE DEBATE GAZETTE PAPER (Newspaper column) */}
          <div className={`flex-grow border-4 border-text-primary rounded-sm shadow-xl p-4 flex flex-col overflow-hidden relative ${paperTextureClass}`}>
            
            {/* Newspaper Masthead */}
            <div className="border-b-4 border-double border-[#1C1A17] pb-3 mb-4 shrink-0 flex justify-between items-center select-none gap-2">
              <span className="font-serif text-sm font-bold uppercase tracking-wider">Выпуск №1 // Раунд {turnCount} из {maxRounds}</span>
              <h2 className="font-serif text-3xl font-extrabold uppercase tracking-widest text-[#1C1A17] text-center flex-grow hidden md:block">
                THE DEBATE GAZETTE
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => store.updateSettings({ voiceTtsEnabled: !settings.voiceTtsEnabled })}
                  className="p-1 border border-[#1C1A17] rounded text-[#1C1A17] hover:bg-[#1C1A17]/10 transition-colors cursor-pointer flex items-center justify-center"
                  title={settings.voiceTtsEnabled ? "Отключить озвучку реплик" : "Включить озвучку реплик"}
                >
                  {settings.voiceTtsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
                <span className="font-mono text-sm uppercase tracking-wider border border-[#1C1A17] px-2 py-0.5">ВЕРСТКА ОНЛАЙН</span>
              </div>
            </div>

            {/* Active Edict Display */}
            {currentEdict && (
              <div className="shrink-0 mb-4 p-3 bg-red-800/10 border-y-2 border-red-800 text-red-900 font-serif italic text-base text-center animate-pulse select-none">
                [АКТИВНОЕ ПРАВИЛО РЕАЛЬНОСТИ]: {currentEdict}
              </div>
            )}

            {/* Newspaper Scrollable Content */}
            <div className="flex-grow overflow-y-auto space-y-6 pr-2 font-serif text-base leading-relaxed scrollbar-thin scrollbar-thumb-text-muted/40">
              
              {debateLog.length === 0 ? (
                <div className="h-full flex items-center justify-center text-text-muted font-mono text-sm uppercase tracking-widest select-none animate-pulse">
                  [ ОЖИДАНИЕ ТЕЗИСА РЕДАКТОРА ФРАНКА ШРАЙБЕРА ]
                </div>
              ) : (
                debateLog.map((msg) => {
                  const isCassandra = msg.role === 'cassandra';
                  const isJudge = msg.role === 'judge';

                  if (isJudge) {
                    // System Edict announcement in newspaper
                    return (
                      <motion.div 
                        key={msg.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="my-6 border-y border-[#1C1A17] py-3 text-center bg-[#C4BFB9]/20"
                      >
                        <p className="font-mono text-xs text-[#8B0000] uppercase tracking-widest font-bold">СПЕЦИАЛЬНЫЙ ТЕЛЕГРАФНЫЙ ВЫПУСК</p>
                        <p className="font-serif font-extrabold text-lg mt-1 italic text-[#1C1A17]">{msg.content}</p>
                      </motion.div>
                    );
                  }

                  const nameMap = {
                    frank: `${playerName.toUpperCase()} (РЕПОРТЕР)`,
                    felix: 'Д-Р ФЕЛИКС СИКОФАНТ (АДВОКАТ)',
                    cassandra: 'КАССАНДРА ЦИНИК (ОППОНЕНТ)'
                  };

                  return (
                    <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-b border-[#1C1A17]/30 pb-6 last:border-b-0"
                    >
                      {/* Column Header */}
                      <div className="flex justify-between items-center mb-2 select-none">
                        <span className="font-mono text-sm font-extrabold tracking-widest text-[#1C1A17]">
                          {nameMap[msg.role as 'frank' | 'felix' | 'cassandra'] || msg.role.toUpperCase()}
                        </span>
                        {msg.isSearchActive && (
                          <span className="flex items-center gap-1 font-mono text-xs bg-[#1C1A17] text-[#ECE7E1] px-1.5 py-0.5 uppercase">
                            <Wifi size={12} /> СЕТЬ
                          </span>
                        )}
                      </div>

                      {/* Main prose */}
                      <p className={`font-serif text-xl leading-relaxed text-[#1C1A17] whitespace-pre-line ${isCassandra ? 'italic' : ''}`}>
                        {msg.content}
                      </p>

                      {/* RED MARKER: JUDGE EVALUATION AND REDACTOR COMMENTS */}
                      {msg.eval && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-3 p-3 bg-red-950/5 border-l-4 border-red-800 font-mono text-sm text-red-900 space-y-2 select-none"
                        >
                          {/* Mini gauges */}
                          <div className="flex flex-wrap gap-x-4 gap-y-1 font-bold text-xs text-red-800">
                            <span>LOGIC/EMOTION [X]: {(msg.eval.x >= 0 ? '+' : '') + msg.eval.x.toFixed(1)}</span>
                            <span>ORDER/CHAOS [Y]: {(msg.eval.y >= 0 ? '+' : '') + msg.eval.y.toFixed(1)}</span>
                            <span>VERACITY [Z]: {(msg.eval.z >= 0 ? '+' : '') + msg.eval.z.toFixed(1)}</span>
                            <span>RESPECT [W]: {(msg.eval.w >= 0 ? '+' : '') + msg.eval.w.toFixed(1)}</span>
                            <span>TONE [V]: {(msg.eval.v >= 0 ? '+' : '') + msg.eval.v.toFixed(1)}</span>
                          </div>

                          {/* Fallacies detected */}
                          {msg.eval.fallacies && msg.eval.fallacies.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {msg.eval.fallacies.map(fId => {
                                const details = getFallacyDetails(fId);
                                return (
                                  <span key={fId} className="flex items-center gap-1 px-2 py-0.5 bg-red-800 text-white rounded-sm font-bold text-xs uppercase tracking-wider">
                                    <AlertTriangle size={12} />
                                    {details ? details.name : fId}
                                  </span>
                                );
                              })}
                            </div>
                          )}

                          {/* Editor's handwritten margins comment */}
                          <div className="font-serif text-base font-bold italic text-red-900 border-t border-red-800/10 pt-1 mt-1 pl-1">
                            « {msg.eval.comment} »
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })
              )}

              {/* Sweat searching animation overlay */}
              {isTyping && (
                <div className="py-4 text-[#8B0000] font-mono text-sm animate-pulse tracking-widest uppercase border-l-2 border-[#8B0000] pl-4 italic">
                  {statusMessage ? statusMessage : getSearchAnimationText(activeSpeaker)}
                </div>
              )}
              <div ref={articleEndRef} />
            </div>

          </div>

          {/* SECTION B: THE ROUND TABLE & SILHOUETTES (Bottom controls) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0 max-h-72">
            
            {/* Panel 1: Player (Frank Schreiber) */}
            <div className={`border-2 p-3 flex flex-col justify-between h-40 bg-panel/75 ${activeSpeaker === 'frank' ? 'border-accent-secondary' : 'border-text-muted/30'}`}>
              <div className="flex justify-between items-start">
                <span className="font-mono text-sm font-bold text-text-primary uppercase tracking-wider">{playerName}</span>
                <span className="font-mono text-xs text-text-muted">[ИГРОК]</span>
              </div>

              {/* Silhouette SVG drawing */}
              <div className="h-20 flex items-center justify-center my-1 select-none">
                <svg viewBox="0 0 100 100" className={`h-full w-auto transition-all duration-300 ${activeSpeaker === 'frank' ? 'scale-105 filter drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]' : 'opacity-65'}`}>
                  <defs>
                    <linearGradient id="frankGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FFF" />
                      <stop offset="60%" stopColor="#A89A84" />
                      <stop offset="100%" stopColor="#5C554A" />
                    </linearGradient>
                    <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#FFE8A3" />
                      <stop offset="100%" stopColor="#D4AF37" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="45" fill="#2A2621" stroke="#3A342D" strokeWidth="1.5" />
                  <path d="M25 80 C 25 60, 32 50, 40 48 C 35 48, 30 52, 28 60 C 26 70, 25 80, 25 80 Z" fill="#1C1A17" opacity="0.4" />
                  <path d="M15 90 C 15 72, 28 60, 42 58 L 45 68 L 50 64 L 55 68 L 58 56 C 72 58, 85 70, 85 90 Z" fill="url(#frankGrad)" />
                  <path d="M42 56 L 48 72 L 50 64 Z" fill="#1C1A17" />
                  <path d="M58 56 L 52 72 L 50 64 Z" fill="#1C1A17" />
                  <path d="M48 64 L 52 64 L 54 85 L 50 89 L 46 85 Z" fill="url(#goldGrad)" opacity={activeSpeaker === 'frank' ? 1 : 0.7} />
                  <path d="M34 32 C 34 32, 33 52, 50 54 C 67 54, 66 32, 66 32 Z" fill="#D2C8BC" />
                  <path d="M34 32 C 34 32, 40 48, 50 48 C 60 48, 66 32, 66 32 Z" fill="#A89A84" opacity="0.6" />
                  <path d="M32 30 C 38 35, 62 35, 68 30 C 65 36, 35 36, 32 30 Z" fill="#1C1A17" opacity="0.8" />
                  <path d="M20 28 C 30 26, 70 26, 80 28 C 85 29, 85 32, 80 32 C 70 32, 30 32, 20 32 C 15 32, 15 29, 20 28 Z" fill="#1C1A17" />
                  <path d="M28 28 C 28 15, 38 12, 50 15 C 62 12, 72 15, 72 28 Z" fill="url(#frankGrad)" />
                  <path d="M28 25 C 38 23, 62 23, 72 25 L 72 28 C 62 26, 38 26, 28 28 Z" fill="url(#goldGrad)" />
                </svg>
              </div>

              {/* Player stats */}
              <div className="font-mono text-xs text-text-muted uppercase mt-1 flex justify-between">
                <span>Заряды поиска: {searchQuotas.frank}</span>
                {searchQuotas.frank > 0 && (
                  <label className="flex items-center gap-1 hover:text-accent-secondary cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={useSearchCharge} 
                      onChange={(e) => setUseSearchCharge(e.target.checked)} 
                      disabled={isTyping}
                      className="w-3 h-3 accent-accent-secondary cursor-pointer"
                    />
                    <span>СЕТЬ</span>
                  </label>
                )}
              </div>
            </div>

            {/* Panel 2: Advocate (Dr. Felix Sycophant) */}
            <div className={`border-2 p-3 flex flex-col justify-between h-40 bg-panel/75 ${activeSpeaker === 'felix' ? 'border-accent-secondary' : 'border-text-muted/30'}`}>
              <div className="flex justify-between items-start">
                <span className="font-mono text-sm font-bold text-accent-secondary uppercase tracking-wider">Dr. Felix</span>
                <span className="font-mono text-xs text-text-muted">[ЗАЩИТНИК]</span>
              </div>

              {/* Advocate Silhouette SVG */}
              <div className="h-20 flex items-center justify-center my-1 select-none">
                <svg viewBox="0 0 100 100" className={`h-full w-auto transition-all duration-300 ${activeSpeaker === 'felix' ? 'scale-105 filter drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]' : 'opacity-65'}`}>
                  <defs>
                    <linearGradient id="felixGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FFEFA6" />
                      <stop offset="50%" stopColor="#D4AF37" />
                      <stop offset="100%" stopColor="#8A6B0E" />
                    </linearGradient>
                    <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2E281F" />
                      <stop offset="100%" stopColor="#1C1A17" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="45" fill="#2A2621" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3 2" />
                  <ellipse cx="50" cy="80" rx="30" ry="8" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.3" />
                  <ellipse cx="50" cy="84" rx="22" ry="6" fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.5" />
                  <path d="M40 76 L 60 76 L 56 86 L 44 86 Z" fill="url(#felixGrad)" />
                  <path d="M45 68 L 55 68 L 53 77 L 47 77 Z" fill="#1C1A17" />
                  <rect x="24" y="22" width="52" height="46" rx="10" fill="url(#felixGrad)" stroke="#1C1A17" strokeWidth="2" />
                  <line x1="50" y1="22" x2="50" y2="12" stroke="#D4AF37" strokeWidth="2.5" />
                  <circle cx="50" cy="10" r="4" fill="#D4AF37" />
                  <path d="M42 6 C 45 4, 55 4, 58 6" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.7" />
                  <path d="M38 2 C 43 -2, 57 -2, 62 2" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.4" />
                  <rect x="29" y="27" width="42" height="34" rx="6" fill="url(#screenGrad)" stroke="#D4AF37" strokeWidth="1.5" />
                  <circle cx="41" cy="38" r="3.5" fill="#FFEFA6" className="animate-pulse" />
                  <circle cx="59" cy="38" r="3.5" fill="#FFEFA6" className="animate-pulse" />
                  <path d="M36 33 Q 41 31, 46 34" fill="none" stroke="#FFEFA6" strokeWidth="1.5" />
                  <path d="M64 33 Q 59 31, 54 34" fill="none" stroke="#FFEFA6" strokeWidth="1.5" />
                  <path d="M38 48 Q 50 56, 62 48" fill="none" stroke="#FFEFA6" strokeWidth="3" strokeLinecap="round" className="drop-shadow-[0_0_4px_#D4AF37]" />
                  <circle cx="38" cy="48" r="1.5" fill="#FFEFA6" />
                  <circle cx="62" cy="48" r="1.5" fill="#FFEFA6" />
                </svg>
              </div>

              {/* Conviction gauge */}
              <div className="mt-1">
                <div className="flex justify-between font-mono text-xs text-text-muted uppercase">
                  <span>Убежденность:</span>
                  <span className="font-bold text-accent-secondary">{felixConviction}%</span>
                </div>
                <div className="w-full h-1.5 bg-base border border-text-muted/20 rounded-sm mt-0.5 overflow-hidden">
                  <div 
                    className="h-full bg-accent-secondary transition-all duration-1000"
                    style={{ width: `${felixConviction}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Panel 3: Opponent (Cassandra Cynic) */}
            <div className={`border-2 p-3 flex flex-col justify-between h-40 bg-panel/75 ${activeSpeaker === 'cassandra' ? 'border-accent-secondary' : 'border-text-muted/30'}`}>
              <div className="flex justify-between items-start">
                <span className="font-mono text-sm font-bold text-accent-primary uppercase tracking-wider">Cassandra</span>
                <span className="font-mono text-xs text-text-muted">[ОППОНЕНТ]</span>
              </div>

              {/* Opponent Silhouette SVG */}
              <div className="h-20 flex items-center justify-center my-1 select-none">
                <svg viewBox="0 0 100 100" className={`h-full w-auto transition-all duration-300 ${activeSpeaker === 'cassandra' ? 'scale-105 filter drop-shadow-[0_0_8px_rgba(224,49,49,0.4)]' : 'opacity-65'}`}>
                  <defs>
                    <linearGradient id="cassGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FFE3E3" />
                      <stop offset="40%" stopColor="#E03131" />
                      <stop offset="100%" stopColor="#5C1616" />
                    </linearGradient>
                    <linearGradient id="hairGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#301A1A" />
                      <stop offset="100%" stopColor="#120A0A" />
                    </linearGradient>
                    <linearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E03131" />
                      <stop offset="100%" stopColor="#1C1A17" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="45" fill="#1C1515" stroke="#E03131" strokeWidth="1" />
                  <path d="M22 45 C 22 25, 30 14, 50 14 C 70 14, 78 25, 78 45 L 75 70 C 75 70, 68 78, 50 78 C 32 78, 25 70, 25 70 Z" fill="url(#hairGrad)" />
                  <path d="M15 90 C 15 72, 28 60, 40 58 L 43 72 L 50 67 L 57 72 L 60 58 C 72 60, 85 72, 85 90 Z" fill="url(#cassGrad)" />
                  <path d="M28 58 L 42 74 L 40 58 Z" fill="#3D1111" />
                  <path d="M72 58 L 58 74 L 60 58 Z" fill="#3D1111" />
                  <path d="M34 32 C 34 32, 33 52, 50 54 C 67 54, 66 32, 66 32 Z" fill="#E8D1D1" />
                  <path d="M34 32 C 34 32, 40 48, 50 48 C 60 48, 66 32, 66 32 Z" fill="#C99E9E" opacity="0.6" />
                  <path d="M32 32 C 38 31, 48 31, 49 33 C 49 37, 44 41, 38 41 C 33 41, 32 37, 32 32 Z" fill="url(#glassGrad)" stroke="#FFE3E3" strokeWidth="0.8" />
                  <path d="M68 32 C 62 31, 52 31, 51 33 C 51 37, 56 41, 62 41 C 67 41, 68 37, 68 32 Z" fill="url(#glassGrad)" stroke="#FFE3E3" strokeWidth="0.8" />
                  <line x1="49" y1="33" x2="51" y2="33" stroke="#FFE3E3" strokeWidth="1.5" />
                  <path d="M35 34 L 43 34 L 38 39 Z" fill="#FFFFFF" opacity="0.4" />
                  <path d="M53 34 L 61 34 L 56 39 Z" fill="#FFFFFF" opacity="0.4" />
                  <path d="M44 48 Q 50 51, 56 48" fill="none" stroke="#5C1616" strokeWidth="2" strokeLinecap="round" />
                  <path d="M32 16 C 45 10, 68 18, 70 30 C 65 24, 45 22, 36 28 Z" fill="url(#hairGrad)" />
                  <path d="M26 30 C 26 30, 24 50, 31 52 C 28 42, 28 34, 30 30 Z" fill="url(#hairGrad)" />
                  <path d="M72 82 Q 78 68, 74 54 T 78 30 T 70 12" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.25" className="animate-pulse" />
                  <path d="M74 82 Q 79 70, 76 58 T 80 34" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.4" className="animate-pulse" />
                </svg>
              </div>

              {/* Conviction gauge */}
              <div className="mt-1">
                <div className="flex justify-between font-mono text-xs text-text-muted uppercase">
                  <span>Упрямство:</span>
                  <span className={`font-bold ${cassandraSideSwitched ? 'text-accent-secondary' : 'text-accent-primary'}`}>
                    {cassandraSideSwitched ? 'Сломлен!' : `${cassandraConviction}%`}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-base border border-text-muted/20 rounded-sm mt-0.5 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${cassandraSideSwitched ? 'bg-accent-secondary' : 'bg-accent-primary'}`}
                    style={{ width: `${cassandraSideSwitched ? 100 : cassandraConviction}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Panel 4: Judge Solomon Balance (Editor) */}
            <div className={`border-2 p-3 flex flex-col justify-between h-40 bg-panel/75 ${activeSpeaker === 'judge' ? 'border-accent-secondary' : 'border-text-muted/30'}`}>
              <div className="flex justify-between items-start">
                <span className="font-mono text-sm font-bold text-text-primary uppercase tracking-wider">Solomon Balance</span>
                <span className="font-mono text-xs text-text-muted">[СУДЬЯ]</span>
              </div>

              {/* Scales of Justice Silhouette SVG */}
              <div className="h-20 flex items-center justify-center my-1 select-none">
                <svg viewBox="0 0 100 100" className={`h-full w-auto transition-all duration-300 ${activeSpeaker === 'judge' ? 'scale-105 filter drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]' : 'opacity-65'}`}>
                  <defs>
                    <linearGradient id="metalGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="50%" stopColor="#9C9993" />
                      <stop offset="100%" stopColor="#383633" />
                    </linearGradient>
                    <linearGradient id="eyeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF4D4D" />
                      <stop offset="100%" stopColor="#990000" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="45" fill="#1C1A17" stroke="#9C9993" strokeWidth="1.5" />
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#2D2A26" strokeWidth="1" />
                  <circle cx="50" cy="50" r="22" fill="none" stroke="#2D2A26" strokeWidth="1" />
                  <line x1="50" y1="5" x2="50" y2="95" stroke="#2D2A26" strokeWidth="0.8" />
                  <line x1="5" y1="50" x2="95" y2="50" stroke="#2D2A26" strokeWidth="0.8" />
                  <rect x="47" y="18" width="6" height="52" fill="url(#metalGrad)" stroke="#1C1A17" strokeWidth="1" />
                  <path d="M40 70 L 60 70 L 64 82 L 36 82 Z" fill="url(#metalGrad)" stroke="#1C1A17" strokeWidth="1.5" />
                  <rect x="42" y="74" width="16" height="2" fill="#D4AF37" />
                  <rect x="45" y="78" width="10" height="2" fill="#D4AF37" />
                  <path d="M15 26 L 85 26 L 85 30 L 15 30 Z" fill="url(#metalGrad)" stroke="#1C1A17" strokeWidth="1" />
                  <circle cx="50" cy="28" r="3.5" fill="#D4AF37" />
                  <circle cx="18" cy="28" r="2" fill="#D4AF37" />
                  <circle cx="82" cy="28" r="2" fill="#D4AF37" />
                  <line x1="18" y1="28" x2="10" y2="48" stroke="#9C9993" strokeWidth="1" />
                  <line x1="18" y1="28" x2="26" y2="48" stroke="#9C9993" strokeWidth="1" />
                  <path d="M8 48 L 28 48 L 26 50 L 10 50 Z" fill="#D4AF37" />
                  <line x1="82" y1="28" x2="74" y2="48" stroke="#9C9993" strokeWidth="1" />
                  <line x1="82" y1="28" x2="90" y2="48" stroke="#9C9993" strokeWidth="1" />
                  <path d="M72 48 L 92 48 L 90 50 L 74 50 Z" fill="#D4AF37" />
                  <polygon points="50,33 65,45 50,57 35,45" fill="#1C1A17" stroke="url(#metalGrad)" strokeWidth="1.5" />
                  <circle cx="50" cy="45" r="7" fill="url(#eyeGrad)" stroke="#FF4D4D" strokeWidth="1.5" className="animate-pulse" />
                  <circle cx="50" cy="45" r="2" fill="#FFFFFF" />
                  <path d="M50 52 L 32 90 L 68 90 Z" fill="url(#eyeGrad)" opacity="0.12" />
                  <rect x="15" y="8" width="6" height="4" fill="#00FF00" opacity="0.8" />
                  <rect x="79" y="8" width="6" height="4" fill="#FF0000" opacity="0.8" />
                </svg>
              </div>

              {/* Status information */}
              <div className="font-mono text-xs text-text-muted uppercase text-right mt-1">
                <div>Раунды: {turnCount} / {maxRounds}</div>
                {cassandraSideSwitched && <div className="text-accent-secondary font-bold animate-pulse">Оппонент сдался!</div>}
              </div>
            </div>

          </div>

          {/* SECTION C: INPUT DIALOGUE BOX (Bottom-most section) */}
          <div className="shrink-0 border-t border-text-muted pt-3 flex flex-col md:flex-row gap-4 items-end bg-panel/30 p-3">
            <div className="flex-grow w-full space-y-2">
              <div className="flex gap-4 items-center">
                <input 
                  type="text"
                  value={userHandle}
                  onChange={(e) => setUserHandle(e.target.value)}
                  disabled={isTyping}
                  placeholder="Никнейм в X (Twitter)"
                  className="w-1/2 bg-base/50 border border-text-muted text-text-primary p-2 focus:outline-none focus:border-accent-secondary font-mono text-sm uppercase"
                />
                <span className="text-xs text-text-muted uppercase font-mono">
                  [ Лимит поиска: {searchQuotas.frank} зарядов осталось ]
                </span>
              </div>
              <div className="relative w-full">
                <textarea 
                  value={playerInput}
                  onChange={(e) => setPlayerInput(e.target.value)}
                  disabled={isTyping || turnCount > maxRounds}
                  placeholder={turnCount > maxRounds ? "Игра завершена. Закройте сессию." : "Введите свой логический тезис или новость для обсуждения..."}
                  className="w-full bg-base/50 border border-text-muted text-text-primary p-3 pr-12 focus:outline-none focus:border-accent-secondary resize-none font-mono text-base h-20 scrollbar-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
                {settings.voiceSttEnabled && isSttSupported && (
                  <button
                    type="button"
                    onClick={toggleListening}
                    disabled={isTyping || turnCount > maxRounds}
                    className={`absolute right-3 bottom-3 p-2 rounded-full cursor-pointer transition-all duration-300 ${
                      isListening 
                        ? 'bg-red-800 text-[#ECE7E1] shadow-[0_0_15px_rgba(153,27,27,0.7)] animate-pulse' 
                        : 'bg-base/80 text-text-muted hover:text-accent-secondary border border-text-muted/30 hover:border-accent-secondary'
                    }`}
                    title={isListening ? 'Идет запись... Нажмите, чтобы остановить' : 'Голосовой ввод (нажмите для записи)'}
                  >
                    {isListening ? <Mic size={18} /> : <MicOff size={18} />}
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto justify-end">
              <button 
                onClick={handleSubmit}
                disabled={isTyping || !playerInput.trim() || turnCount > maxRounds}
                className="px-6 py-3 bg-transparent border-2 border-accent-secondary text-accent-secondary hover:bg-accent-secondary hover:text-base transition-colors duration-150 uppercase tracking-widest text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-1/2 md:w-auto"
              >
                Опубликовать
              </button>
              <button 
                onClick={handleClose}
                className="px-6 py-3 bg-transparent border border-text-muted text-text-muted hover:bg-text-muted hover:text-base transition-colors duration-150 uppercase tracking-widest text-sm w-1/2 md:w-auto cursor-pointer"
              >
                Закрыть
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
