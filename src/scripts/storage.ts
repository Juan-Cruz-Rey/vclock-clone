/**
 * Storage Manager
 * Maneja la persistencia de datos en localStorage
 */

// Interfaces para los diferentes tipos de datos
export interface VisualSettings {
  fontFamily: string;
  textColor: string;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  timeFormat: 12 | 24;
  showDate: boolean;
}

export interface AlarmSettings {
  hour: number;
  minute: number;
  meridian: 'AM' | 'PM';
  sound: string;
  repeat: boolean;
  title: string;
  isActive: boolean;
}

export interface TimerSettings {
  mode: 'duration' | 'date';
  hours: number;
  minutes: number;
  seconds: number;
  targetDate?: Date;
  sound: string;
  title: string;
  autoStart: boolean;
}

export interface TimerData {
  state: 'idle' | 'running' | 'paused' | 'finished';
  remainingMs: number;
  totalMs: number;
  startTime: number | null;
  pausedTime: number;
}

export interface StopwatchState {
  elapsed: number; // milisegundos
  isRunning: boolean;
  laps: Array<{
    number: number;
    lapTime: number;
    totalTime: number;
  }>;
  precision: 3 | 2 | 1 | 0;
}

export interface ClockSettings {
  cities: Array<{
    id: string;
    name: string;
    timezone: string;
    order: number;
  }>;
}

export interface RecentItem {
  id: string;
  timestamp: number;
  data: any;
}

export interface StorageData {
  theme: 'light' | 'dark';
  visualSettings: VisualSettings;
  alarmSettings: AlarmSettings;
  timerSettings: TimerSettings;
  timerData: TimerData;
  stopwatchState: StopwatchState;
  clockSettings: ClockSettings;
  recentAlarms: RecentItem[];
  recentTimers: RecentItem[];
}

export class Storage {
  private static readonly PREFIX = 'vclock_';
  private static readonly MAX_RECENT = 5;

  /**
   * Obtiene un valor del localStorage
   */
  static get<K extends keyof StorageData>(key: K): StorageData[K] | null {
    if (typeof window === 'undefined') return null;

    try {
      const item = localStorage.getItem(`${this.PREFIX}${key}`);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading ${key} from storage:`, error);
      return null;
    }
  }

  /**
   * Guarda un valor en localStorage
   */
  static set<K extends keyof StorageData>(key: K, value: StorageData[K]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(`${this.PREFIX}${key}`, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
    }
  }

  /**
   * Elimina un valor del localStorage
   */
  static remove(key: keyof StorageData): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(`${this.PREFIX}${key}`);
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
    }
  }

  /**
   * Limpia todo el localStorage de la aplicación
   */
  static clear(): void {
    if (typeof window === 'undefined') return;

    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(this.PREFIX))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  /**
   * Obtiene las configuraciones visuales o valores por defecto
   */
  static getVisualSettings(): VisualSettings {
    return this.get('visualSettings') || {
      fontFamily: 'Digital-7',
      textColor: '#3b82f6',
      fontSize: 'lg',
      timeFormat: 12,
      showDate: true,
    };
  }

  /**
   * Obtiene las configuraciones de alarma o valores por defecto
   */
  static getAlarmSettings(): AlarmSettings {
    return this.get('alarmSettings') || {
      hour: 7,
      minute: 0,
      meridian: 'AM',
      sound: 'buzzer.mp3',
      repeat: false,
      title: '',
      isActive: false,
    };
  }

  /**
   * Obtiene las configuraciones de timer o valores por defecto
   */
  static getTimerSettings(): TimerSettings {
    return this.get('timerSettings') || {
      mode: 'duration',
      hours: 0,
      minutes: 5,
      seconds: 0,
      sound: 'bell.mp3',
      title: 'Timer',
      autoStart: false,
    };
  }

  /**
   * Obtiene los datos del timer o valores por defecto
   */
  static getTimerData(): TimerData {
    return this.get('timerData') || {
      state: 'idle',
      remainingMs: 0,
      totalMs: 0,
      startTime: null,
      pausedTime: 0,
    };
  }

  /**
   * Obtiene el estado del stopwatch o valores por defecto
   */
  static getStopwatchState(): StopwatchState {
    return this.get('stopwatchState') || {
      elapsed: 0,
      isRunning: false,
      laps: [],
      precision: 3,
    };
  }

  /**
   * Obtiene las configuraciones de reloj mundial o valores por defecto
   */
  static getClockSettings(): ClockSettings {
    return this.get('clockSettings') || {
      cities: [],
    };
  }

  /**
   * Añade un item a la lista de recent items (alarmas o timers recientes)
   */
  static addRecentItem(type: 'recentAlarms' | 'recentTimers', data: any): void {
    const recent = this.get(type) || [];
    const newItem: RecentItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      data,
    };

    // Añadir al principio y mantener solo MAX_RECENT items
    recent.unshift(newItem);
    if (recent.length > this.MAX_RECENT) {
      recent.pop();
    }

    this.set(type, recent);
  }

  /**
   * Obtiene la lista de alarmas recientes
   */
  static getRecentAlarms(): RecentItem[] {
    return this.get('recentAlarms') || [];
  }

  /**
   * Obtiene la lista de timers recientes
   */
  static getRecentTimers(): RecentItem[] {
    return this.get('recentTimers') || [];
  }

  /**
   * Verifica si hay espacio disponible en localStorage
   */
  static hasSpaceAvailable(): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const testKey = `${this.PREFIX}test`;
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtiene el tamaño aproximado usado en localStorage (en bytes)
   */
  static getUsedSpace(): number {
    if (typeof window === 'undefined') return 0;

    let total = 0;
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.PREFIX))
      .forEach(key => {
        const value = localStorage.getItem(key) || '';
        total += key.length + value.length;
      });

    return total;
  }

  /**
   * Exporta todos los datos como JSON
   */
  static exportData(): string {
    if (typeof window === 'undefined') return '{}';

    const data: any = {};
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.PREFIX))
      .forEach(key => {
        const cleanKey = key.replace(this.PREFIX, '');
        data[cleanKey] = JSON.parse(localStorage.getItem(key) || 'null');
      });

    return JSON.stringify(data, null, 2);
  }

  /**
   * Importa datos desde JSON
   */
  static importData(jsonString: string): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const data = JSON.parse(jsonString);
      Object.keys(data).forEach(key => {
        localStorage.setItem(`${this.PREFIX}${key}`, JSON.stringify(data[key]));
      });
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}
