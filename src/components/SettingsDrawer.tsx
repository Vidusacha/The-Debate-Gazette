import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Lock, Terminal, Edit3 } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

export const SettingsDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const { 
    settings, 
    updateSettings, 
    gamePhase,
    playerName,
    setPlayerName,
    felixSystemPrompt,
    setFelixSystemPrompt,
    cassandraSystemPrompt,
    setCassandraSystemPrompt
  } = useGameStore();

  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      // Chrome/Safari asynchronously populate getVoices(), let's fetch them
      setAvailableVoices(window.speechSynthesis.getVoices());
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const updateCharacterVoice = (
    role: 'felix' | 'cassandra' | 'judge',
    key: 'voiceName' | 'pitch' | 'rate',
    value: string | number
  ) => {
    const currentSettings = settings.voiceTtsSettings || {
      felix: { voiceName: '', pitch: 1.15, rate: 1.05 },
      cassandra: { voiceName: '', pitch: 0.8, rate: 0.85 },
      judge: { voiceName: '', pitch: 0.6, rate: 0.95 },
    };
    updateSettings({
      voiceTtsSettings: {
        ...currentSettings,
        [role]: {
          ...currentSettings[role],
          [key]: value
        }
      }
    });
  };

  const voiceSettings = settings.voiceTtsSettings || {
    felix: { voiceName: '', pitch: 1.15, rate: 1.05 },
    cassandra: { voiceName: '', pitch: 0.8, rate: 0.85 },
    judge: { voiceName: '', pitch: 0.6, rate: 0.95 },
  };

  const handleQuotaChange = (role: 'frankQuota' | 'felixQuota' | 'cassandraQuota', value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0 && num <= 99) {
      updateSettings({ [role]: num });
    }
  };

  const handleRoundChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1 && num <= 99) {
      updateSettings({ maxRounds: num });
    }
  };

  const toggleRegenerative = () => {
    updateSettings({ isSearchRegenerative: !settings.isSearchRegenerative });
  };

  const toggleDeepResearch = (char: 'felix' | 'cassandra') => {
    updateSettings({
      deepResearch: {
        ...settings.deepResearch,
        [char]: !settings.deepResearch[char]
      }
    });
  };

  const toggleInjection = (char: 'felix' | 'cassandra', field: 'adHominem' | 'profanity' | 'sarcasm') => {
    updateSettings({
      injections: {
        ...settings.injections,
        [char]: {
          ...settings.injections[char],
          [field]: !settings.injections[char][field]
        }
      }
    });
  };

  const isLocked = gamePhase === 'debate';

  return (
    <>
      {/* Settings Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute top-4 right-4 z-40 p-3 bg-panel/90 border-2 border-accent-secondary/50 text-accent-secondary hover:text-white hover:border-accent-secondary transition-all backdrop-blur-md shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] hover:rotate-90 duration-500 rounded-lg cursor-pointer"
        title="Системные Настройки"
      >
        <Settings size={22} className="animate-pulse" />
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
              className="absolute top-0 right-0 h-full w-[450px] bg-[#161412]/95 border-l-2 border-accent-secondary/80 z-50 p-6 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden font-mono text-text-primary"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6 border-b-2 border-accent-secondary/30 pb-4 shrink-0">
                <div className="flex items-center gap-3">
                  <Terminal className="text-accent-secondary animate-pulse" size={24} />
                  <div>
                    <h2 className="font-serif text-2xl text-accent-secondary uppercase tracking-widest font-extrabold drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                      System Control
                    </h2>
                    <p className="text-xs text-text-muted uppercase tracking-wider mt-0.5">Trialogue Cyber-Noir Engine</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 border border-text-muted/20 rounded-md text-text-muted hover:text-accent-primary hover:border-accent-primary transition-all duration-300 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Locked Warning */}
              {isLocked && (
                <div className="mb-6 p-4 bg-accent-primary/20 border-2 border-accent-primary/50 text-accent-primary flex items-center gap-3 animate-pulse text-xs font-bold uppercase rounded-md shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                  <Lock size={18} />
                  <span>Параметры заблокированы — идет выпуск газеты</span>
                </div>
              )}

              {/* Configuration Body */}
              <div className="flex-grow overflow-y-auto pr-2 space-y-6 select-none scrollbar-thin scrollbar-thumb-accent-secondary/40 scrollbar-track-base/20">
                
                {/* 0. PLAYER PROFILE (Frank Schreiber Customization) */}
                <section className="bg-base/40 p-4 border-2 border-text-muted/20 rounded-lg hover:border-accent-secondary/40 transition-colors duration-300">
                  <h3 className="font-mono text-sm font-bold text-accent-secondary uppercase tracking-widest mb-3 border-b border-text-muted/10 pb-1.5 flex items-center gap-2">
                    <Edit3 size={16} /> Профиль Репортера
                  </h3>
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">Имя Главного Героя (Игрока):</label>
                    <input 
                      type="text" 
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      disabled={isLocked}
                      placeholder="Имя репортера..."
                      className="w-full bg-base border border-text-muted/40 hover:border-accent-secondary focus:border-accent-secondary text-text-primary p-2.5 rounded focus:outline-none font-mono text-sm uppercase transition-colors duration-300 disabled:opacity-50"
                    />
                  </div>
                </section>

                {/* 1. SESSION CONFIG */}
                <section className="bg-base/40 p-4 border-2 border-text-muted/20 rounded-lg hover:border-accent-secondary/40 transition-colors duration-300">
                  <h3 className="font-mono text-sm font-bold text-text-primary uppercase tracking-widest mb-3 border-b border-text-muted/10 pb-1.5">Длительность сессии</h3>
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Лимит раундов (1-99)</label>
                    <input 
                      type="number" 
                      min="1" max="99"
                      value={settings.maxRounds}
                      onChange={(e) => handleRoundChange(e.target.value)}
                      disabled={isLocked}
                      className="w-20 bg-base border border-text-muted/40 text-text-primary p-1.5 rounded text-center focus:outline-none focus:border-accent-secondary font-mono text-sm font-bold disabled:opacity-50"
                    />
                  </div>
                </section>

                {/* 1.5. VOICE INTEGRATION */}
                <section className="bg-base/40 p-4 border-2 border-text-muted/20 rounded-lg hover:border-accent-secondary/40 transition-colors duration-300">
                  <h3 className="font-mono text-sm font-bold text-accent-secondary uppercase tracking-widest mb-3 border-b border-text-muted/10 pb-1.5">
                    Голос и Озвучка
                  </h3>
                  
                  <div className="space-y-4">
                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="text-xs font-bold text-text-muted uppercase tracking-wider group-hover:text-accent-secondary transition-colors">
                        Озвучка персонажей (TTS)
                      </span>
                      <input 
                        type="checkbox" 
                        checked={settings.voiceTtsEnabled} 
                        onChange={() => updateSettings({ voiceTtsEnabled: !settings.voiceTtsEnabled })} 
                        className="accent-accent-secondary w-5 h-5 cursor-pointer"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="text-xs font-bold text-text-muted uppercase tracking-wider group-hover:text-accent-secondary transition-colors">
                        Голосовой ввод игрока (STT)
                      </span>
                      <input 
                        type="checkbox" 
                        checked={settings.voiceSttEnabled} 
                        onChange={() => updateSettings({ voiceSttEnabled: !settings.voiceSttEnabled })} 
                        className="accent-accent-secondary w-5 h-5 cursor-pointer"
                      />
                    </label>

                    {settings.voiceTtsEnabled && (
                      <div className="mt-4 pt-4 border-t border-text-muted/10 space-y-4">
                        <h4 className="text-xs font-bold text-text-primary uppercase tracking-widest mb-2">
                          Настройка Тембров Героев:
                        </h4>
                        
                        {(['felix', 'cassandra', 'judge'] as const).map((role) => {
                          const charName = role === 'felix' 
                            ? 'Доктор Феликс (Защитник)' 
                            : role === 'cassandra' 
                              ? 'Кассандра (Оппонент)' 
                              : 'Судья Соломон (Редакция)';
                          
                          const charSubtitle = role === 'felix'
                            ? 'Слащавый, высокий, быстрый темп'
                            : role === 'cassandra'
                              ? 'Нуарный, хриплый, низкий темп'
                              : 'Величественный, басистый, размеренный';

                          const accentColor = role === 'felix' 
                            ? 'border-accent-secondary/30 text-accent-secondary' 
                            : role === 'cassandra' 
                              ? 'border-accent-primary/30 text-accent-primary' 
                              : 'border-text-muted/30 text-text-primary';

                          const sliderAccent = role === 'felix' 
                            ? 'accent-accent-secondary' 
                            : role === 'cassandra' 
                              ? 'accent-accent-primary' 
                              : 'accent-text-primary';

                          const config = voiceSettings[role];

                          return (
                            <div key={role} className={`p-3 bg-[#110f0e] border-l-2 ${accentColor} rounded-r space-y-3`}>
                              <div>
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-bold uppercase tracking-wider">{charName}</span>
                                </div>
                                <span className="text-[10px] text-text-muted/60 block">{charSubtitle}</span>
                              </div>

                              {/* Voice Selector */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
                                  Системный Голос:
                                </label>
                                <select
                                  value={config.voiceName}
                                  onChange={(e) => updateCharacterVoice(role, 'voiceName', e.target.value)}
                                  disabled={isLocked}
                                  className="w-full bg-[#1c1a17] border border-text-muted/30 text-text-primary text-xs p-1.5 rounded focus:outline-none focus:border-accent-secondary transition-colors"
                                >
                                  <option value="">-- По умолчанию (Русский системный) --</option>
                                  {availableVoices.map((voice) => (
                                    <option key={voice.name} value={voice.name}>
                                      {voice.name} ({voice.lang})
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Pitch & Rate sliders */}
                              <div className="grid grid-cols-2 gap-3">
                                {/* Speed (rate) */}
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                                    <span>Скорость:</span>
                                    <span className="font-bold">{config.rate.toFixed(2)}x</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="0.5"
                                    max="2.0"
                                    step="0.05"
                                    value={config.rate}
                                    onChange={(e) => updateCharacterVoice(role, 'rate', parseFloat(e.target.value))}
                                    disabled={isLocked}
                                    className={`w-full ${sliderAccent} h-1 bg-text-muted/20 rounded-lg cursor-pointer disabled:opacity-50`}
                                  />
                                </div>

                                {/* Height (pitch) */}
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                                    <span>Высота (Тон):</span>
                                    <span className="font-bold">{config.pitch.toFixed(2)}x</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="0.5"
                                    max="2.0"
                                    step="0.05"
                                    value={config.pitch}
                                    onChange={(e) => updateCharacterVoice(role, 'pitch', parseFloat(e.target.value))}
                                    disabled={isLocked}
                                    className={`w-full ${sliderAccent} h-1 bg-text-muted/20 rounded-lg cursor-pointer disabled:opacity-50`}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </section>

                {/* 2. SEARCH QUOTAS */}
                <section className="bg-base/40 p-4 border-2 border-text-muted/20 rounded-lg hover:border-accent-secondary/40 transition-colors duration-300">
                  <h3 className="font-mono text-sm font-bold text-text-primary uppercase tracking-widest mb-3 border-b border-text-muted/10 pb-1.5">Заряды поиска (Quota)</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Заряды игрока ({playerName})</label>
                      <input 
                        type="number" 
                        min="0" max="99"
                        value={settings.frankQuota}
                        onChange={(e) => handleQuotaChange('frankQuota', e.target.value)}
                        disabled={isLocked}
                        className="w-20 bg-base border border-text-muted/40 text-text-primary p-1.5 rounded text-center focus:outline-none focus:border-accent-secondary font-mono text-sm font-bold disabled:opacity-50"
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Д-р Феликс (Защитник)</label>
                      <input 
                        type="number" 
                        min="0" max="99"
                        value={settings.felixQuota}
                        onChange={(e) => handleQuotaChange('felixQuota', e.target.value)}
                        disabled={isLocked}
                        className="w-20 bg-base border border-text-muted/40 text-text-primary p-1.5 rounded text-center focus:outline-none focus:border-accent-secondary font-mono text-sm font-bold disabled:opacity-50"
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Кассандра (Оппонент)</label>
                      <input 
                        type="number" 
                        min="0" max="99"
                        value={settings.cassandraQuota}
                        onChange={(e) => handleQuotaChange('cassandraQuota', e.target.value)}
                        disabled={isLocked}
                        className="w-20 bg-base border border-text-muted/40 text-text-primary p-1.5 rounded text-center focus:outline-none focus:border-accent-secondary font-mono text-sm font-bold disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="border-t-2 border-text-muted/10 pt-4 mt-4">
                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="text-xs font-bold text-text-muted uppercase tracking-wider group-hover:text-accent-secondary transition-colors">
                        Регенерация поиска
                      </span>
                      <input 
                        type="checkbox" 
                        checked={settings.isSearchRegenerative} 
                        onChange={toggleRegenerative} 
                        disabled={isLocked}
                        className="accent-accent-secondary w-5 h-5 cursor-pointer disabled:opacity-50"
                      />
                    </label>
                    <p className="text-xs text-text-muted/60 mt-1.5 leading-relaxed">
                      Агенты восстанавливают 1 заряд поиска каждые 3 хода (при издании Эдикта).
                    </p>
                  </div>
                </section>

                {/* 3. SYSTEM PROMPTS (CUSTOM BEHAVIOR EDITORS) */}
                <section className="bg-base/40 p-4 border-2 border-text-muted/20 rounded-lg hover:border-accent-secondary/40 transition-colors duration-300">
                  <h3 className="font-mono text-sm font-bold text-accent-secondary uppercase tracking-widest mb-3 border-b border-text-muted/10 pb-1.5 flex items-center gap-2">
                    <Terminal size={16} /> Настройка AI Инструкций
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Dr. Felix prompt */}
                    <div>
                      <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-1.5 flex justify-between">
                        <span>Промпт доктора Феликса:</span>
                        <span className="text-accent-secondary font-normal">[Cloud AI]</span>
                      </label>
                      <textarea
                        value={felixSystemPrompt}
                        onChange={(e) => setFelixSystemPrompt(e.target.value)}
                        disabled={isLocked}
                        rows={4}
                        placeholder="Системные инструкции Феликса..."
                        className="w-full bg-base border border-text-muted/40 hover:border-accent-secondary focus:border-accent-secondary text-text-primary p-2.5 rounded focus:outline-none font-mono text-xs leading-relaxed transition-colors duration-300 disabled:opacity-50 resize-y"
                      />
                    </div>

                    {/* Cassandra prompt */}
                    <div>
                      <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-1.5 flex justify-between">
                        <span>Промпт Кассандры:</span>
                        <span className="text-accent-primary font-normal">[Local AI]</span>
                      </label>
                      <textarea
                        value={cassandraSystemPrompt}
                        onChange={(e) => setCassandraSystemPrompt(e.target.value)}
                        disabled={isLocked}
                        rows={4}
                        placeholder="Системные инструкции Кассандры..."
                        className="w-full bg-base border border-text-muted/40 hover:border-accent-secondary focus:border-accent-secondary text-text-primary p-2.5 rounded focus:outline-none font-mono text-xs leading-relaxed transition-colors duration-300 disabled:opacity-50 resize-y"
                      />
                    </div>
                  </div>
                </section>

                {/* 4. GEMINI DEEP RESEARCH */}
                <section className="bg-base/40 p-4 border-2 border-text-muted/20 rounded-lg hover:border-accent-secondary/40 transition-colors duration-300">
                  <h3 className="font-mono text-sm font-bold text-text-primary uppercase tracking-widest mb-3 border-b border-text-muted/10 pb-1.5">Gemini Deep Research</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="text-xs font-semibold text-text-muted uppercase tracking-wider group-hover:text-accent-secondary transition-colors">Д-р Феликс</span>
                      <input 
                        type="checkbox" 
                        checked={settings.deepResearch.felix} 
                        onChange={() => toggleDeepResearch('felix')}
                        disabled={isLocked}
                        className="accent-accent-secondary w-5 h-5 cursor-pointer disabled:opacity-50"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="text-xs font-semibold text-text-muted uppercase tracking-wider group-hover:text-accent-primary transition-colors">Кассандра</span>
                      <input 
                        type="checkbox" 
                        checked={settings.deepResearch.cassandra} 
                        onChange={() => toggleDeepResearch('cassandra')}
                        disabled={isLocked}
                        className="accent-accent-secondary w-5 h-5 cursor-pointer disabled:opacity-50"
                      />
                    </label>
                  </div>
                </section>

                {/* 5. PROMPT INJECTIONS */}
                <section className="bg-base/40 p-4 border-2 border-text-muted/20 rounded-lg hover:border-accent-secondary/40 transition-colors duration-300">
                  <h3 className="font-mono text-sm font-bold text-accent-secondary uppercase tracking-widest mb-3 border-b border-accent-secondary/30 pb-1.5">Prompt Injections</h3>
                  
                  {/* Felix Injections */}
                  <div className="mb-4">
                    <h4 className="text-xs text-text-primary uppercase mb-2 font-bold tracking-wider">Д-р Феликс (Защитник):</h4>
                    <div className="space-y-2 pl-3 border-l-2 border-accent-secondary/40">
                      <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-xs text-text-muted uppercase group-hover:text-accent-secondary transition-colors">Атака Ad Hominem</span>
                        <input 
                          type="checkbox" 
                          checked={settings.injections.felix.adHominem} 
                          onChange={() => toggleInjection('felix', 'adHominem')}
                          disabled={isLocked}
                          className="accent-accent-secondary w-4 h-4 cursor-pointer disabled:opacity-50"
                        />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-xs text-text-muted uppercase group-hover:text-accent-secondary transition-colors">Сленг & Мат</span>
                        <input 
                          type="checkbox" 
                          checked={settings.injections.felix.profanity} 
                          onChange={() => toggleInjection('felix', 'profanity')}
                          disabled={isLocked}
                          className="accent-accent-secondary w-4 h-4 cursor-pointer disabled:opacity-50"
                        />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-xs text-text-muted uppercase group-hover:text-accent-secondary transition-colors">Едкий Сарказм</span>
                        <input 
                          type="checkbox" 
                          checked={settings.injections.felix.sarcasm} 
                          onChange={() => toggleInjection('felix', 'sarcasm')}
                          disabled={isLocked}
                          className="accent-accent-secondary w-4 h-4 cursor-pointer disabled:opacity-50"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Cassandra Injections */}
                  <div>
                    <h4 className="text-xs text-text-primary uppercase mb-2 font-bold tracking-wider">Кассандра (Оппонент):</h4>
                    <div className="space-y-2 pl-3 border-l-2 border-accent-primary/40">
                      <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-xs text-text-muted uppercase group-hover:text-accent-primary transition-colors">Атака Ad Hominem</span>
                        <input 
                          type="checkbox" 
                          checked={settings.injections.cassandra.adHominem} 
                          onChange={() => toggleInjection('cassandra', 'adHominem')}
                          disabled={isLocked}
                          className="accent-accent-secondary w-4 h-4 cursor-pointer disabled:opacity-50"
                        />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-xs text-text-muted uppercase group-hover:text-accent-primary transition-colors">Сленг & Мат</span>
                        <input 
                          type="checkbox" 
                          checked={settings.injections.cassandra.profanity} 
                          onChange={() => toggleInjection('cassandra', 'profanity')}
                          disabled={isLocked}
                          className="accent-accent-secondary w-4 h-4 cursor-pointer disabled:opacity-50"
                        />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-xs text-text-muted uppercase group-hover:text-accent-primary transition-colors">Едкий Сарказм</span>
                        <input 
                          type="checkbox" 
                          checked={settings.injections.cassandra.sarcasm} 
                          onChange={() => toggleInjection('cassandra', 'sarcasm')}
                          disabled={isLocked}
                          className="accent-accent-secondary w-4 h-4 cursor-pointer disabled:opacity-50"
                        />
                      </label>
                    </div>
                  </div>
                </section>

              </div>
              
              {/* Footer */}
              <div className="pt-4 border-t-2 border-accent-secondary/30 shrink-0 font-mono text-xs text-text-muted/50 uppercase select-none flex justify-between">
                <span>The Debate Gazette</span>
                <span>v1.1.0</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
