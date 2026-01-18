/**
 * Stopwatch Logic - Precision Stopwatch with Lap Timing
 * Manages stopwatch functionality with lap recording
 */

import { Storage } from './storage';

export type StopwatchPrecision = 0 | 1 | 2 | 3; // 0=seconds, 1=deciseconds, 2=centiseconds, 3=milliseconds

export interface Lap {
  number: number;
  lapTime: number; // Time for this lap only (ms)
  totalTime: number; // Total time at lap end (ms)
  timestamp: number; // When the lap was recorded
}

export interface StopwatchState {
  elapsed: number; // Total elapsed time in milliseconds
  isRunning: boolean;
  laps: Lap[];
  precision: StopwatchPrecision;
  startTime: number | null;
  pausedTime: number;
}

export class Stopwatch {
  private state: StopwatchState;
  private tickInterval: number | null = null;
  private onTickCallback?: (elapsed: number) => void;
  private onLapCallback?: (lap: Lap) => void;
  private onStateChangeCallback?: (isRunning: boolean) => void;

  constructor() {
    this.state = this.loadFromStorage();
  }

  // Lifecycle methods
  start(): void {
    if (this.state.isRunning) return;

    const now = performance.now();

    if (this.state.elapsed === 0) {
      // Starting fresh
      this.state.startTime = now;
    } else {
      // Resuming from pause
      this.state.startTime = now - this.state.pausedTime;
    }

    this.state.isRunning = true;
    this.setState(true);
    this.startTicking();
    this.saveToStorage();
  }

  pause(): void {
    if (!this.state.isRunning) return;

    this.stopTicking();
    this.state.pausedTime = performance.now() - (this.state.startTime || 0);
    this.state.elapsed = this.state.pausedTime;
    this.state.isRunning = false;
    this.setState(false);
    this.saveToStorage();
  }

  reset(): void {
    this.stopTicking();
    this.state = {
      elapsed: 0,
      isRunning: false,
      laps: [],
      precision: this.state.precision,
      startTime: null,
      pausedTime: 0,
    };
    this.setState(false);
    this.saveToStorage();

    if (this.onTickCallback) {
      this.onTickCallback(0);
    }
  }

  lap(): Lap | null {
    if (!this.state.isRunning) return null;

    const totalTime = this.state.elapsed;
    const previousTotalTime = this.state.laps.length > 0
      ? this.state.laps[this.state.laps.length - 1].totalTime
      : 0;
    const lapTime = totalTime - previousTotalTime;

    const lap: Lap = {
      number: this.state.laps.length + 1,
      lapTime,
      totalTime,
      timestamp: Date.now(),
    };

    this.state.laps.push(lap);
    this.saveToStorage();

    if (this.onLapCallback) {
      this.onLapCallback(lap);
    }

    return lap;
  }

  deleteLap(lapNumber: number): boolean {
    const index = this.state.laps.findIndex(lap => lap.number === lapNumber);
    if (index === -1) return false;

    this.state.laps.splice(index, 1);

    // Renumber subsequent laps
    for (let i = index; i < this.state.laps.length; i++) {
      this.state.laps[i].number = i + 1;
    }

    this.saveToStorage();
    return true;
  }

  clearLaps(): void {
    this.state.laps = [];
    this.saveToStorage();
  }

  setPrecision(precision: StopwatchPrecision): void {
    this.state.precision = precision;
    this.saveToStorage();
  }

  // Private methods
  private startTicking(): void {
    this.stopTicking();

    // Tick rate based on precision
    const tickRate = this.state.precision === 3 ? 1 : // milliseconds
                     this.state.precision === 2 ? 10 : // centiseconds
                     this.state.precision === 1 ? 100 : // deciseconds
                     1000; // seconds

    this.tickInterval = window.setInterval(() => this.tick(), tickRate);
  }

  private stopTicking(): void {
    if (this.tickInterval !== null) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  private tick(): void {
    if (!this.state.isRunning || !this.state.startTime) return;

    const elapsed = performance.now() - this.state.startTime;
    this.state.elapsed = elapsed;

    if (this.onTickCallback) {
      this.onTickCallback(elapsed);
    }
  }

  private setState(isRunning: boolean): void {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(isRunning);
    }
  }

  // Storage
  private saveToStorage(): void {
    Storage.set('stopwatchState', {
      elapsed: this.state.elapsed,
      isRunning: false, // Never save as running
      laps: this.state.laps,
      precision: this.state.precision,
    });
  }

  private loadFromStorage(): StopwatchState {
    const saved = Storage.getStopwatchState();

    return {
      elapsed: saved.elapsed || 0,
      isRunning: false,
      laps: saved.laps || [],
      precision: saved.precision || 2,
      startTime: null,
      pausedTime: saved.elapsed || 0,
    };
  }

  // Callbacks
  onTick(callback: (elapsed: number) => void): void {
    this.onTickCallback = callback;
  }

  onLap(callback: (lap: Lap) => void): void {
    this.onLapCallback = callback;
  }

  onStateChange(callback: (isRunning: boolean) => void): void {
    this.onStateChangeCallback = callback;
  }

  // Getters
  getElapsed(): number {
    return this.state.elapsed;
  }

  isRunning(): boolean {
    return this.state.isRunning;
  }

  getLaps(): Lap[] {
    return [...this.state.laps];
  }

  getPrecision(): StopwatchPrecision {
    return this.state.precision;
  }

  getState(): StopwatchState {
    return { ...this.state };
  }

  // Statistics
  getFastestLap(): Lap | null {
    if (this.state.laps.length === 0) return null;
    return this.state.laps.reduce((fastest, lap) =>
      lap.lapTime < fastest.lapTime ? lap : fastest
    );
  }

  getSlowestLap(): Lap | null {
    if (this.state.laps.length === 0) return null;
    return this.state.laps.reduce((slowest, lap) =>
      lap.lapTime > slowest.lapTime ? lap : slowest
    );
  }

  getAverageLapTime(): number {
    if (this.state.laps.length === 0) return 0;
    const total = this.state.laps.reduce((sum, lap) => sum + lap.lapTime, 0);
    return total / this.state.laps.length;
  }

  // Cleanup
  destroy(): void {
    this.stopTicking();
    this.onTickCallback = undefined;
    this.onLapCallback = undefined;
    this.onStateChangeCallback = undefined;
  }
}

// Utility functions
export function formatStopwatchTime(ms: number, precision: StopwatchPrecision = 2): string {
  const totalMilliseconds = Math.floor(ms);
  const hours = Math.floor(totalMilliseconds / 3600000);
  const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);
  const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
  const milliseconds = totalMilliseconds % 1000;

  const pad = (n: number, width: number = 2) => n.toString().padStart(width, '0');

  let formatted = '';

  if (hours > 0) {
    formatted = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  } else {
    formatted = `${pad(minutes)}:${pad(seconds)}`;
  }

  // Add decimal precision
  if (precision === 3) {
    // Milliseconds (3 digits)
    formatted += `.${pad(milliseconds, 3)}`;
  } else if (precision === 2) {
    // Centiseconds (2 digits)
    formatted += `.${pad(Math.floor(milliseconds / 10), 2)}`;
  } else if (precision === 1) {
    // Deciseconds (1 digit)
    formatted += `.${Math.floor(milliseconds / 100)}`;
  }
  // precision === 0: no decimals

  return formatted;
}

export function parseLapTime(formatted: string): number {
  // Parse formats like "1:23.45" or "01:23:45.678"
  const parts = formatted.split(':');
  const lastPart = parts[parts.length - 1];
  const [secondsPart, decimalPart] = lastPart.split('.');

  let ms = 0;

  if (parts.length === 3) {
    // HH:MM:SS
    ms += parseInt(parts[0]) * 3600000;
    ms += parseInt(parts[1]) * 60000;
    ms += parseInt(secondsPart) * 1000;
  } else if (parts.length === 2) {
    // MM:SS
    ms += parseInt(parts[0]) * 60000;
    ms += parseInt(secondsPart) * 1000;
  } else {
    // SS
    ms += parseInt(secondsPart) * 1000;
  }

  // Add decimal part
  if (decimalPart) {
    if (decimalPart.length === 1) {
      ms += parseInt(decimalPart) * 100; // Deciseconds
    } else if (decimalPart.length === 2) {
      ms += parseInt(decimalPart) * 10; // Centiseconds
    } else if (decimalPart.length === 3) {
      ms += parseInt(decimalPart); // Milliseconds
    }
  }

  return ms;
}

export function formatLapDifference(lapTime: number, comparisonTime: number): string {
  const diff = lapTime - comparisonTime;
  const sign = diff >= 0 ? '+' : '';
  return `${sign}${formatStopwatchTime(Math.abs(diff), 2)}`;
}

export function exportLapsToCSV(laps: Lap[]): string {
  const headers = ['Lap', 'Lap Time', 'Total Time', 'Timestamp'];
  const rows = laps.map(lap => [
    lap.number.toString(),
    formatStopwatchTime(lap.lapTime, 3),
    formatStopwatchTime(lap.totalTime, 3),
    new Date(lap.timestamp).toISOString(),
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');
}
