"use client";

// Cyberpunk Sound System using Web Audio API
// All sounds are procedurally generated for premium, responsive audio

class SoundSystem {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private _volume: number = 0.3;
  private _muted: boolean = false;
  private initialized: boolean = false;

  get volume() {
    return this._volume;
  }

  get muted() {
    return this._muted;
  }

  private init() {
    if (this.initialized || typeof window === 'undefined') return;
    
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = this._volume;
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  private ensureContext() {
    if (!this.initialized) this.init();
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  setVolume(value: number) {
    this._volume = Math.max(0, Math.min(1, value));
    if (this.masterGain) {
      this.masterGain.gain.value = this._muted ? 0 : this._volume;
    }
  }

  toggleMute() {
    this._muted = !this._muted;
    if (this.masterGain) {
      this.masterGain.gain.value = this._muted ? 0 : this._volume;
    }
    return this._muted;
  }

  setMuted(muted: boolean) {
    this._muted = muted;
    if (this.masterGain) {
      this.masterGain.gain.value = this._muted ? 0 : this._volume;
    }
  }

  // Soft click sound - for buttons and small interactions
  playClick() {
    this.ensureContext();
    if (!this.audioContext || !this.masterGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.frequency.setValueAtTime(800, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.05);
    osc.type = 'sine';
    
    gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);
    
    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + 0.05);
  }

  // Hover sound - subtle digital blip
  playHover() {
    this.ensureContext();
    if (!this.audioContext || !this.masterGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.frequency.setValueAtTime(1200, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.03);
    osc.type = 'sine';
    
    gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.03);
    
    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + 0.03);
  }

  // Neon swoosh - for section transitions and large elements
  playSwoosh() {
    this.ensureContext();
    if (!this.audioContext || !this.masterGain) return;

    const osc = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.3);
    
    osc.frequency.setValueAtTime(150, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.3);
    osc.type = 'sawtooth';
    
    osc2.frequency.setValueAtTime(155, this.audioContext.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(52, this.audioContext.currentTime + 0.3);
    osc2.type = 'sawtooth';
    
    gain.gain.setValueAtTime(0.15, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
    
    osc.start(this.audioContext.currentTime);
    osc2.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + 0.3);
    osc2.stop(this.audioContext.currentTime + 0.3);
  }

  // Digital beep - for notifications and confirmations
  playBeep() {
    this.ensureContext();
    if (!this.audioContext || !this.masterGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.frequency.setValueAtTime(880, this.audioContext.currentTime);
    osc.type = 'square';
    
    gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gain.gain.setValueAtTime(0.1, this.audioContext.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
    
    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + 0.1);
  }

  // Hologram activate - ethereal digital sound
  playHologram() {
    this.ensureContext();
    if (!this.audioContext || !this.masterGain) return;

    const osc1 = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();
    const osc3 = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc1.connect(gain);
    osc2.connect(gain);
    osc3.connect(gain);
    gain.connect(this.masterGain);
    
    osc1.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
    osc2.frequency.setValueAtTime(659.25, this.audioContext.currentTime); // E5
    osc3.frequency.setValueAtTime(783.99, this.audioContext.currentTime); // G5
    
    osc1.type = 'sine';
    osc2.type = 'sine';
    osc3.type = 'sine';
    
    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.4);
    
    osc1.start(this.audioContext.currentTime);
    osc2.start(this.audioContext.currentTime + 0.02);
    osc3.start(this.audioContext.currentTime + 0.04);
    osc1.stop(this.audioContext.currentTime + 0.4);
    osc2.stop(this.audioContext.currentTime + 0.4);
    osc3.stop(this.audioContext.currentTime + 0.4);
  }

  // Card hover - soft electric hum
  playCardHover() {
    this.ensureContext();
    if (!this.audioContext || !this.masterGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
    filter.Q.setValueAtTime(10, this.audioContext.currentTime);
    
    osc.frequency.setValueAtTime(100, this.audioContext.currentTime);
    osc.type = 'sawtooth';
    
    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, this.audioContext.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);
    
    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + 0.15);
  }

  // Navigation click - crisp digital tap
  playNavClick() {
    this.ensureContext();
    if (!this.audioContext || !this.masterGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.frequency.setValueAtTime(600, this.audioContext.currentTime);
    osc.frequency.setValueAtTime(900, this.audioContext.currentTime + 0.02);
    osc.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.08);
    osc.type = 'triangle';
    
    gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.08);
    
    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + 0.08);
  }

  // Project card select - energetic activation
  playProjectSelect() {
    this.ensureContext();
    if (!this.audioContext || !this.masterGain) return;

    const osc1 = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);
    
    osc1.frequency.setValueAtTime(400, this.audioContext.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.1);
    osc1.type = 'sine';
    
    osc2.frequency.setValueAtTime(600, this.audioContext.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);
    osc2.type = 'sine';
    
    gain.gain.setValueAtTime(0.15, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);
    
    osc1.start(this.audioContext.currentTime);
    osc2.start(this.audioContext.currentTime);
    osc1.stop(this.audioContext.currentTime + 0.15);
    osc2.stop(this.audioContext.currentTime + 0.15);
  }

  // Glitch effect - digital distortion
  playGlitch() {
    this.ensureContext();
    if (!this.audioContext || !this.masterGain) return;

    const bufferSize = this.audioContext.sampleRate * 0.1;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    
    const noise = this.audioContext.createBufferSource();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    noise.buffer = buffer;
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
    filter.Q.setValueAtTime(5, this.audioContext.currentTime);
    
    gain.gain.setValueAtTime(0.15, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
    
    noise.start(this.audioContext.currentTime);
  }

  // Power up - section enter
  playPowerUp() {
    this.ensureContext();
    if (!this.audioContext || !this.masterGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.frequency.setValueAtTime(100, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.2);
    osc.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.4);
    osc.type = 'sine';
    
    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.4);
    
    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + 0.4);
  }

  // Soft ping - subtle notification
  playPing() {
    this.ensureContext();
    if (!this.audioContext || !this.masterGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.frequency.setValueAtTime(1400, this.audioContext.currentTime);
    osc.type = 'sine';
    
    gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
    
    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + 0.2);
  }

  // Whoosh - fast transition
  playWhoosh() {
    this.ensureContext();
    if (!this.audioContext || !this.masterGain) return;

    const bufferSize = this.audioContext.sampleRate * 0.2;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      const t = i / bufferSize;
      data[i] = (Math.random() * 2 - 1) * Math.sin(t * Math.PI) * 0.5;
    }
    
    const noise = this.audioContext.createBufferSource();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    noise.buffer = buffer;
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(500, this.audioContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(3000, this.audioContext.currentTime + 0.1);
    filter.frequency.exponentialRampToValueAtTime(500, this.audioContext.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    
    noise.start(this.audioContext.currentTime);
  }
}

// Singleton instance
export const soundSystem = new SoundSystem();

// React hook for sound system
import { useState, useEffect, useCallback } from 'react';

export function useSound() {
  const [volume, setVolumeState] = useState(0.3);
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    // Load saved preferences
    if (typeof window !== 'undefined') {
      const savedVolume = localStorage.getItem('soundVolume');
      const savedMuted = localStorage.getItem('soundMuted');
      
      if (savedVolume) {
        const vol = parseFloat(savedVolume);
        setVolumeState(vol);
        soundSystem.setVolume(vol);
      }
      
      if (savedMuted) {
        const isMuted = savedMuted === 'true';
        setMutedState(isMuted);
        soundSystem.setMuted(isMuted);
      }
    }
  }, []);

  const setVolume = useCallback((value: number) => {
    setVolumeState(value);
    soundSystem.setVolume(value);
    localStorage.setItem('soundVolume', value.toString());
  }, []);

  const toggleMute = useCallback(() => {
    const newMuted = soundSystem.toggleMute();
    setMutedState(newMuted);
    localStorage.setItem('soundMuted', newMuted.toString());
    return newMuted;
  }, []);

  return {
    volume,
    muted,
    setVolume,
    toggleMute,
    playClick: () => soundSystem.playClick(),
    playHover: () => soundSystem.playHover(),
    playSwoosh: () => soundSystem.playSwoosh(),
    playBeep: () => soundSystem.playBeep(),
    playHologram: () => soundSystem.playHologram(),
    playCardHover: () => soundSystem.playCardHover(),
    playNavClick: () => soundSystem.playNavClick(),
    playProjectSelect: () => soundSystem.playProjectSelect(),
    playGlitch: () => soundSystem.playGlitch(),
    playPowerUp: () => soundSystem.playPowerUp(),
    playPing: () => soundSystem.playPing(),
    playWhoosh: () => soundSystem.playWhoosh(),
  };
}
