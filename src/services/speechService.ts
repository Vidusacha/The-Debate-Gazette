// Text-to-Speech (TTS) service for The Debate Gazette characters.
// Built using Web Speech API (SpeechSynthesis).
// Code and comments in English.

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

/**
 * Stops all currently active speech synthesis utterances.
 */
export const stopSpeech = (): void => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Speaks a given text with a custom voice profile suited for each character.
 */
export const speakText = (
  text: string,
  role: Exclude<CharacterRole, 'frank'>,
  customSettings?: CharacterVoiceSettings
): void => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn('Speech synthesis is not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech first to prevent overlap
  stopSpeech();

  // Create utterance. Strip any system tags like [REAL_WORLD_INTEL] or [SOCIAL_PULSE] if needed, 
  // or clean up [ЭДИКТ РЕДАКЦИИ]: for Zero.
  let cleanText = text.replace(/\[REAL_WORLD_INTEL\][\s\S]*?\[\/REAL_WORLD_INTEL\]/gi, '');
  cleanText = cleanText.replace(/\[SOCIAL_PULSE\][\s\S]*?\[\/SOCIAL_PULSE\]/gi, '');
  cleanText = cleanText.replace(/[\*\_\`]/g, ''); // Strip markdown formatting symbols

  const utterance = new SpeechSynthesisUtterance(cleanText);
  const defaultConfig = characterVoiceConfigs[role] || { pitch: 1.0, rate: 1.0, volume: 1.0 };

  // Apply pitch and rate (favoring custom user settings)
  utterance.pitch = customSettings ? customSettings.pitch : defaultConfig.pitch;
  utterance.rate = customSettings ? customSettings.rate : defaultConfig.rate;
  utterance.volume = defaultConfig.volume;

  // Retrieve all available voices
  const voices = window.speechSynthesis.getVoices();
  let assignedVoice: SpeechSynthesisVoice | undefined;

  // 1. If custom voice is specified, try to find it by name
  if (customSettings && customSettings.voiceName) {
    assignedVoice = voices.find((v) => v.name === customSettings.voiceName);
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

  window.speechSynthesis.speak(utterance);
};
