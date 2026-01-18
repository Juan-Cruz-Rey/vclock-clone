/**
 * Timer Logic - Countdown Timer with Presets and Date Mode
 * Manages countdown timers with various modes and callbacks
 */

import { Storage } from './storage';
import { getAudioManager } from './audio-manager';
import { showNotification, vibrate } from './utils';

export type TimerMode = 'duration' | 'date';

export interface TimerSettings {
  mode: TimerMode;
  // Duration mode
  hours: number;
  minutes: number;
  seconds: number;
  // Date mode
  targetDate?: Date;
  // Common
  sound: string;
  title: string;
  autoStart: boolean;
}

export type TimerState = 'idle' | 'running' | 'paused' | 'finished';

export interface TimerData {
  state: TimerState;
  remainingMs: number;
  totalMs: number;
  startTime: number | null;
  pausedTime: number;
}

export class Timer {
  private settings: TimerSettings;
  private data: TimerData;
  private tickInterval: number | null = null;
  private onTickCallback?: (remainingMs: number) => void;
  private onFinishCallback?: () => void;
  private onStateChangeCallback?: (state: TimerState) => void;

  constructor(settings: Partial<TimerSettings> = {}) {
    this.settings = {
      mode: 'duration',
      hours: 0,
      minutes: 5,
      seconds: 0,
      sound: 'classic-bell.mp3',
      title: 'Timer',
      autoStart: false,
      ...settings,
    };

    const totalMs = this.calculateTotalMs();
    this.data = {
      state: 'idle',
      remainingMs: totalMs,
      totalMs: totalMs,
      startTime: null,
      pausedTime: 0,
    };

    this.loadFromStorage();
  }

  private calculateTotalMs(): number {
    if (this.settings.mode === 'date' && this.settings.targetDate) {
      const now = Date.now();
      const target = new Date(this.settings.targetDate).getTime();
      return Math.max(0, target - now);
    } else {
      // Duration mode
      return (
        this.settings.hours * 3600000 +
        this.settings.minutes * 60000 +
        this.settings.seconds * 1000
      );
    }
  }

  // Lifecycle methods
  start(): void {
    if (this.data.state === 'running') return;

    const now = Date.now();

    if (this.data.state === 'idle') {
      this.data.totalMs = this.calculateTotalMs();
      this.data.remainingMs = this.data.totalMs;
      this.data.startTime = now;
    } else if (this.data.state === 'paused') {
      // Resume from pause
      this.data.startTime = now - this.data.pausedTime;
    }

    this.data.state = 'running';
    this.setState('running');
    this.startTicking();
    this.saveToStorage();
  }

  pause(): void {
    if (this.data.state !== 'running') return;

    this.stopTicking();
    this.data.pausedTime = Date.now() - (this.data.startTime || 0);
    this.data.state = 'paused';
    this.setState('paused');
    this.saveToStorage();
  }

  resume(): void {
    if (this.data.state !== 'paused') return;
    this.start();
  }

  stop(): void {
    this.stopTicking();
    this.data.state = 'idle';
    this.data.remainingMs = this.data.totalMs;
    this.data.startTime = null;
    this.data.pausedTime = 0;
    this.setState('idle');
    this.saveToStorage();
  }

  reset(): void {
    this.stop();
    if (this.onTickCallback) {
      this.onTickCallback(this.data.totalMs);
    }
  }

  addTime(seconds: number): void {
    this.data.totalMs += seconds * 1000;
    this.data.remainingMs += seconds * 1000;

    if (this.data.state === 'running' && this.data.startTime) {
      this.data.startTime -= seconds * 1000;
    }

    this.saveToStorage();
    if (this.onTickCallback) {
      this.onTickCallback(this.data.remainingMs);
    }
  }

  // Preset management
  setDuration(hours: number, minutes: number, seconds: number): void {
    this.settings.mode = 'duration';
    this.settings.hours = hours;
    this.settings.minutes = minutes;
    this.settings.seconds = seconds;

    const totalMs = this.calculateTotalMs();
    this.data.totalMs = totalMs;
    this.data.remainingMs = totalMs;

    this.saveToStorage();
    if (this.onTickCallback) {
      this.onTickCallback(this.data.remainingMs);
    }
  }

  setTargetDate(date: Date): void {
    this.settings.mode = 'date';
    this.settings.targetDate = date;

    const totalMs = this.calculateTotalMs();
    this.data.totalMs = totalMs;
    this.data.remainingMs = totalMs;

    this.saveToStorage();
    if (this.onTickCallback) {
      this.onTickCallback(this.data.remainingMs);
    }
  }

  // Private methods
  private startTicking(): void {
    this.stopTicking();
    this.tickInterval = window.setInterval(() => this.tick(), 100);
  }

  private stopTicking(): void {
    if (this.tickInterval !== null) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  private tick(): void {
    if (this.data.state !== 'running' || !this.data.startTime) return;

    const elapsed = Date.now() - this.data.startTime;
    this.data.remainingMs = Math.max(0, this.data.totalMs - elapsed);

    if (this.onTickCallback) {
      this.onTickCallback(this.data.remainingMs);
    }

    if (this.data.remainingMs <= 0) {
      this.finish();
    }
  }

  private finish(): void {
    this.stopTicking();
    this.data.state = 'finished';
    this.data.remainingMs = 0;
    this.setState('finished');

    // Play sound
    getAudioManager().play(this.settings.sound, { loop: false });

    // Show notification
    showNotification(this.settings.title || 'Timer Finished', {
      body: 'Your timer has finished!',
      icon: '/icon-timer.png',
      tag: 'timer-finished',
    });

    // Vibrate
    vibrate([300, 100, 300, 100, 300]);

    // Callback
    if (this.onFinishCallback) {
      this.onFinishCallback();
    }

    this.saveToStorage();
  }

  private setState(state: TimerState): void {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(state);
    }
  }

  // Storage
  private saveToStorage(): void {
    Storage.set('timerSettings', this.settings);
    Storage.set('timerData', {
      ...this.data,
      // Don't save callbacks
    });
  }

  private loadFromStorage(): void {
    const savedSettings = Storage.get('timerSettings');
    const savedData = Storage.get('timerData');

    if (savedSettings) {
      this.settings = { ...this.settings, ...savedSettings };
    }

    if (savedData) {
      this.data = { ...this.data, ...savedData };

      // If timer was running, resume or mark as paused
      if (this.data.state === 'running') {
        this.data.state = 'paused';
      }
    }
  }

  // Callbacks
  onTick(callback: (remainingMs: number) => void): void {
    this.onTickCallback = callback;
  }

  onFinish(callback: () => void): void {
    this.onFinishCallback = callback;
  }

  onStateChange(callback: (state: TimerState) => void): void {
    this.onStateChangeCallback = callback;
  }

  // Getters
  getState(): TimerState {
    return this.data.state;
  }

  getRemainingMs(): number {
    return this.data.remainingMs;
  }

  getTotalMs(): number {
    return this.data.totalMs;
  }

  getProgress(): number {
    if (this.data.totalMs === 0) return 0;
    return ((this.data.totalMs - this.data.remainingMs) / this.data.totalMs) * 100;
  }

  getSettings(): TimerSettings {
    return { ...this.settings };
  }

  updateSettings(settings: Partial<TimerSettings>): void {
    this.settings = { ...this.settings, ...settings };
    this.saveToStorage();
  }

  // Cleanup
  destroy(): void {
    this.stopTicking();
    this.onTickCallback = undefined;
    this.onFinishCallback = undefined;
    this.onStateChangeCallback = undefined;
  }
}

// Preset durations (in seconds)
export const TIMER_PRESETS = [
  { label: '1 min', seconds: 60 },
  { label: '3 min', seconds: 180 },
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
  { label: '15 min', seconds: 900 },
  { label: '20 min', seconds: 1200 },
  { label: '30 min', seconds: 1800 },
  { label: '45 min', seconds: 2700 },
  { label: '1 hour', seconds: 3600 },
  { label: '2 hours', seconds: 7200 },
  { label: '3 hours', seconds: 10800 },
  { label: '4 hours', seconds: 14400 },
] as const;

// Utility functions
export function formatTimerDisplay(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}

export function parseTimerInput(input: string): { hours: number; minutes: number; seconds: number } | null {
  // Parse formats like: "5:30", "1:30:00", "90" (seconds)
  const parts = input.trim().split(':').map(p => parseInt(p, 10));

  if (parts.some(p => isNaN(p))) return null;

  if (parts.length === 1) {
    // Just seconds
    return { hours: 0, minutes: 0, seconds: parts[0] };
  } else if (parts.length === 2) {
    // Minutes:seconds
    return { hours: 0, minutes: parts[0], seconds: parts[1] };
  } else if (parts.length === 3) {
    // Hours:minutes:seconds
    return { hours: parts[0], minutes: parts[1], seconds: parts[2] };
  }

  return null;
}
