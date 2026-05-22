// Text-to-Speech (TTS) service for The Debate Gazette characters.
// Built using Web Speech API (SpeechSynthesis) with custom queuing.
// Code and comments in English.

import { useGameStore } from '../store/useGameStore';
import type { CharacterRole, CharacterVoiceSettings } from '../store/useGameStore';

export interface VoiceConfig {
  pitch: number;
  rate: number;
  volume: number;
}

const characterVoiceConfigs: Record<Exclude<CharacterRole, 'frank'>, VoiceConfig> = {
  felix: {
    pitch: 1.15,   // Higher pitch, sycophantic and polite
    rate: 1.05,    // Highly articulate, slightly fast
    volume: 1.0,
  },
  cassandra: {
    pitch: 0.8,    // Lower, deep noir voice
    rate: 0.85,    // Slower, dramatic and cynical
    volume: 1.0,
  },
  judge: {
    pitch: 0.6,    // Very deep, monotone
    rate: 0.95,    // Steady and measured
    volume: 1.0,
  },
};

interface QueueItem {
  id: string;
  text: string;
  role: Exclude<CharacterRole, 'frank'>;
  settings?: CharacterVoiceSettings;
}

let speechQueue: QueueItem[] = [];
let currentUtterance: SpeechSynthesisUtterance | null = null;

const processNextQueueItem = (): void => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  if (speechQueue.length === 0) {
    useGameStore.getState().setCurrentlySpeakingId(null);
    useGameStore.getState().setQueuedSpeechIds([]);
    return;
  }

  const nextItem = speechQueue.shift()!;
  useGameStore.getState().setCurrentlySpeakingId(nextItem.id);
  useGameStore.getState().setQueuedSpeechIds(speechQueue.map((item) => item.id));

  const utterance = new SpeechSynthesisUtterance(nextItem.text);
  currentUtterance = utterance;

  const defaultConfig = characterVoiceConfigs[nextItem.role] || { pitch: 1.0, rate: 1.0, volume: 1.0 };

  // Apply pitch and rate (favoring custom user settings)
  utterance.pitch = nextItem.settings ? nextItem.settings.pitch : defaultConfig.pitch;
  utterance.rate = nextItem.settings ? nextItem.settings.rate : defaultConfig.rate;
  utterance.volume = defaultConfig.volume;

  // Retrieve all available voices
  const voices = window.speechSynthesis.getVoices();
  let assignedVoice: SpeechSynthesisVoice | undefined;

  // 1. If custom voice is specified, try to find it by name
  if (nextItem.settings && nextItem.settings.voiceName) {
    assignedVoice = voices.find((v) => v.name === nextItem.settings.voiceName);
  }

  // 2. Fallback to finding Russian voice if custom voice is not specified or not found
  if (!assignedVoice) {
    assignedVoice = voices.find(
      (voice) => voice.lang.startsWith('ru') || voice.lang.includes('ru-RU')
    );
  }

  if (assignedVoice) {
    utterance.voice = assignedVoice;
    utterance.lang = assignedVoice.lang;
  } else {
    // Set fallback language to Russian
    utterance.lang = 'ru-RU';
  }

  utterance.onend = () => {
    currentUtterance = null;
    useGameStore.getState().setCurrentlySpeakingId(null);
    // Process next item after a brief delay for natural timing
    setTimeout(() => {
      processNextQueueItem();
    }, 100);
  };

  utterance.onerror = (e) => {
    console.error('Speech synthesis error:', e);
    currentUtterance = null;
    useGameStore.getState().setCurrentlySpeakingId(null);
    processNextQueueItem();
  };

  window.speechSynthesis.speak(utterance);
};

/**
 * Stops all currently active speech synthesis utterances and empties the queue.
 */
export const stopSpeech = (): void => {
  speechQueue = [];
  useGameStore.getState().setQueuedSpeechIds([]);
  if (currentUtterance) {
    currentUtterance.onend = null;
    currentUtterance.onerror = null;
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
  useGameStore.getState().setCurrentlySpeakingId(null);
};

/**
 * Skips speech for a specific message. If it is currently playing, it terminates it
 * and proceeds to the next in the queue. If it is in the queue, it is removed.
 */
export const skipMessageSpeech = (messageId: string): void => {
  const currentlySpeakingId = useGameStore.getState().currentlySpeakingId;
  if (currentlySpeakingId === messageId) {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      if (currentUtterance) {
        currentUtterance.onend = null;
        currentUtterance.onerror = null;
      }
      window.speechSynthesis.cancel();
    }
    currentUtterance = null;
    useGameStore.getState().setCurrentlySpeakingId(null);
    setTimeout(() => {
      processNextQueueItem();
    }, 100);
  } else {
    // If it's in the queue, remove it from the queue
    speechQueue = speechQueue.filter((item) => item.id !== messageId);
    useGameStore.getState().setQueuedSpeechIds(speechQueue.map((item) => item.id));
  }
};

/**
 * Speaks a given text with a custom voice profile suited for each character.
 */
export const speakText = (
  text: string,
  role: Exclude<CharacterRole, 'frank'>,
  customSettings?: CharacterVoiceSettings,
  messageId?: string
): void => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn('Speech synthesis is not supported in this browser.');
    return;
  }

  // Create utterance. Strip any system tags like [REAL_WORLD_INTEL] or [SOCIAL_PULSE] if needed
  let cleanText = text.replace(/\[REAL_WORLD_INTEL\][\s\S]*?\[\/REAL_WORLD_INTEL\]/gi, '');
  cleanText = cleanText.replace(/\[SOCIAL_PULSE\][\s\S]*?\[\/SOCIAL_PULSE\]/gi, '');
  
  // Strip actions, thoughts and italicized context inside asterisks (*action*) and underscores (_action_)
  cleanText = cleanText.replace(/\*[\s\S]*?\*/g, '');
  cleanText = cleanText.replace(/_[\s\S]*?_/g, '');
  cleanText = cleanText.replace(/[\`]/g, ''); // Strip backticks
  cleanText = cleanText.replace(/\s+/g, ' ').trim(); // Clean up extra spaces/newlines

  // If there is no actual dialogue left to speak (e.g. only actions occurred), do not queue anything
  if (!cleanText) {
    return;
  }

  const id = messageId || Math.random().toString(36).substring(2, 9);

  // Push to local queue
  speechQueue.push({
    id,
    text: cleanText,
    role,
    settings: customSettings,
  });
  useGameStore.getState().setQueuedSpeechIds(speechQueue.map((item) => item.id));

  // If nothing is currently speaking, start playing
  if (useGameStore.getState().currentlySpeakingId === null) {
    processNextQueueItem();
  }
};
