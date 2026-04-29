import { create } from 'zustand';

export type GamePhase = 'exploration' | 'debate';

interface GameState {
  gamePhase: GamePhase;
  activeTarget: string | null;
  setGamePhase: (phase: GamePhase) => void;
  setActiveTarget: (targetId: string | null) => void;
  resetState: () => void;
}

const initialState = {
  gamePhase: 'exploration' as GamePhase,
  activeTarget: null,
};

export const useGameStore = create<GameState>((set) => ({
  ...initialState,
  
  setGamePhase: (phase) => set({ gamePhase: phase }),
  
  setActiveTarget: (targetId) => set({ activeTarget: targetId }),
  
  resetState: () => set(initialState),
}));
