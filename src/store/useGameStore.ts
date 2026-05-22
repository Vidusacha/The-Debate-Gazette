import { create } from 'zustand';

export type GamePhase = 'exploration' | 'debate';
export type CharacterRole = 'frank' | 'felix' | 'cassandra' | 'judge';

export interface DebateMessage {
  id: string;
  role: CharacterRole;
  content: string;
  isSearchActive?: boolean;
  eval?: {
    x: number; // Methodology: Logic (+1.0) <-> Emotion (-1.0)
    y: number; // Stability: Order (+1.0) <-> Chaos (-1.0)
    z: number; // Rhetorical Honesty: Verification (+1.0) <-> Spin (-1.0)
    w: number; // Social Tone: Respect (+1.0) <-> Hostility (-1.0)
    v: number; // Style: Academic (+1.0) <-> Cynicism (-1.0)
    comment: string; // Editor's short note
    fallacies?: string[]; // List of detected fallacies
  };
}

export interface CharacterVoiceSettings {
  voiceName: string;
  pitch: number;
  rate: number;
}

export interface CharacterInjections {
  adHominem: boolean;
  profanity: boolean;
  sarcasm: boolean;
}

interface GameState {
  gamePhase: GamePhase;
  activeTarget: string | null;
  turnCount: number;
  maxRounds: number;
  activeSpeaker: CharacterRole;
  debateLog: DebateMessage[];
  felixConviction: number; // 0 to 100 (Advocate support level)
  cassandraConviction: number; // 0 to 100 (Opponent stubbornness level)
  cassandraSideSwitched: boolean; // Has Cassandra changed her view?
  currentEdict: string | null;
  searchQuotas: { frank: number; felix: number; cassandra: number };
  playerName: string;
  felixSystemPrompt: string;
  cassandraSystemPrompt: string;
  settings: {
    frankQuota: number;
    felixQuota: number;
    cassandraQuota: number;
    isSearchRegenerative: boolean;
    maxRounds: number;
    deepResearch: { felix: boolean; cassandra: boolean };
    voiceTtsEnabled: boolean;
    voiceSttEnabled: boolean;
    voiceTtsSettings: {
      felix: CharacterVoiceSettings;
      cassandra: CharacterVoiceSettings;
      judge: CharacterVoiceSettings;
    };
    injections: {
      felix: CharacterInjections;
      cassandra: CharacterInjections;
    };
  };
  
  setGamePhase: (phase: GamePhase) => void;
  setActiveTarget: (targetId: string | null) => void;
  setActiveSpeaker: (speaker: CharacterRole) => void;
  addMessage: (msg: DebateMessage) => void;
  updateMessageEval: (msgId: string, evaluation: NonNullable<DebateMessage['eval']>) => void;
  incrementTurn: () => void;
  setFelixConviction: (val: number | ((prev: number) => number)) => void;
  setCassandraConviction: (val: number | ((prev: number) => number)) => void;
  setCassandraSideSwitched: (val: boolean) => void;
  setCurrentEdict: (edict: string | null) => void;
  decrementSearchQuota: (role: 'frank' | 'felix' | 'cassandra') => void;
  regenerateQuotas: () => void;
  updateSettings: (newSettings: Partial<GameState['settings']>) => void;
  setPlayerName: (name: string) => void;
  setFelixSystemPrompt: (prompt: string) => void;
  setCassandraSystemPrompt: (prompt: string) => void;
  resetState: () => void;
}

const initialInjections: CharacterInjections = {
  adHominem: false,
  profanity: false,
  sarcasm: true,
};

const initialVoiceSettings: CharacterVoiceSettings = {
  voiceName: '',
  pitch: 1.0,
  rate: 1.0,
};

const initialState = {
  gamePhase: 'exploration' as GamePhase,
  activeTarget: null,
  turnCount: 1,
  maxRounds: 10,
  activeSpeaker: 'frank' as CharacterRole,
  debateLog: [],
  felixConviction: 100,
  cassandraConviction: 100,
  cassandraSideSwitched: false,
  currentEdict: null,
  searchQuotas: { frank: 3, felix: 3, cassandra: 5 },
  playerName: 'Frank Schreiber',
  felixSystemPrompt: 'Ты — доктор Феликс Сикофант (Dr. Felix Sycophant), облачный ИИ-адвокат. Твой базовый стиль — изысканный, вежливый, высокоинтеллектуальный, но абсолютно бесхребетный и подхалимский. Ты говоришь на русском языке. Твои формулировки витиеваты, полны лести и псевдонаучного авторитета.',
  cassandraSystemPrompt: 'Ты — Кассандра Циник (Cassandra Cynic). Оппонент в дебатах. Твой стиль — жесткий, темный нуарный детектив (в духе комиксов Max Payne). Ты измучена, скептична и видишь мир в оттенках серого.',
  settings: {
    frankQuota: 3,
    felixQuota: 3,
    cassandraQuota: 5,
    isSearchRegenerative: false,
    maxRounds: 10,
    deepResearch: { felix: false, cassandra: false },
    voiceTtsEnabled: true,
    voiceSttEnabled: true,
    voiceTtsSettings: {
      felix: { voiceName: '', pitch: 1.15, rate: 1.05 },
      cassandra: { voiceName: '', pitch: 0.8, rate: 0.85 },
      judge: { voiceName: '', pitch: 0.6, rate: 0.95 },
    },
    injections: {
      felix: { ...initialInjections },
      cassandra: { ...initialInjections, adHominem: true },
    },
  },
};

export const useGameStore = create<GameState>((set) => ({
  ...initialState,
  
  setGamePhase: (phase) => set({ gamePhase: phase }),
  
  setActiveTarget: (targetId) => set({ activeTarget: targetId }),
  
  setActiveSpeaker: (speaker) => set({ activeSpeaker: speaker }),
  
  addMessage: (msg) => set((state) => ({ debateLog: [...state.debateLog, msg] })),
  
  updateMessageEval: (msgId, evaluation) => set((state) => ({
    debateLog: state.debateLog.map(m => m.id === msgId ? { ...m, eval: evaluation } : m)
  })),
  
  incrementTurn: () => set((state) => ({ turnCount: state.turnCount + 1 })),
  
  setFelixConviction: (val) => set((state) => ({
    felixConviction: Math.max(0, Math.min(100, typeof val === 'function' ? val(state.felixConviction) : val))
  })),
  
  setCassandraConviction: (val) => set((state) => ({
    cassandraConviction: Math.max(0, Math.min(100, typeof val === 'function' ? val(state.cassandraConviction) : val))
  })),
  
  setCassandraSideSwitched: (val) => set({ cassandraSideSwitched: val }),
  
  setCurrentEdict: (edict) => set({ currentEdict: edict }),
  
  decrementSearchQuota: (role) => set((state) => ({
    searchQuotas: { ...state.searchQuotas, [role]: Math.max(0, state.searchQuotas[role] - 1) }
  })),

  regenerateQuotas: () => set((state) => {
    if (!state.settings.isSearchRegenerative) return state;
    return {
      searchQuotas: {
        frank: Math.min(state.settings.frankQuota, state.searchQuotas.frank + 1),
        felix: Math.min(state.settings.felixQuota, state.searchQuotas.felix + 1),
        cassandra: Math.min(state.settings.cassandraQuota, state.searchQuotas.cassandra + 1),
      }
    };
  }),

  updateSettings: (newSettings) => set((state) => {
    const updatedSettings = { ...state.settings, ...newSettings };
    return { 
      settings: updatedSettings,
      maxRounds: updatedSettings.maxRounds,
      searchQuotas: {
        frank: updatedSettings.frankQuota,
        felix: updatedSettings.felixQuota,
        cassandra: updatedSettings.cassandraQuota,
      }
    };
  }),

  setPlayerName: (name) => set({ playerName: name }),

  setFelixSystemPrompt: (prompt) => set({ felixSystemPrompt: prompt }),

  setCassandraSystemPrompt: (prompt) => set({ cassandraSystemPrompt: prompt }),
  
  resetState: () => set(initialState),
}));
