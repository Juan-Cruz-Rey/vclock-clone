/**
 * Alarm Logic
 * Lógica principal para el funcionamiento del reloj despertador
 */

import { Storage, type AlarmSettings } from './storage';
import { getAudioManager } from './audio-manager';
import { convertTo24Hour, showNotification, vibrate } from './utils';

export class AlarmClock {
  private settings: AlarmSettings;
  private checkInterval: number | null = null;
  private alarmTriggered: boolean = false;
  private onAlarmCallback: (() => void) | null = null;
  private onTickCallback: ((time: string) => void) | null = null;

  constructor() {
    this.settings = Storage.getAlarmSettings();
    this.initializeFromStorage();
  }

  /**
   * Inicializa desde localStorage
   */
  private initializeFromStorage(): void {
    const saved = Storage.getAlarmSettings();
    if (saved) {
      this.settings = saved;
      if (this.settings.isActive) {
        this.start();
      }
    }
  }

  /**
   * Obtiene las configuraciones actuales
   */
  getSettings(): AlarmSettings {
    return { ...this.settings };
  }

  /**
   * Actualiza las configuraciones
   */
  updateSettings(newSettings: Partial<AlarmSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    Storage.set('alarmSettings', this.settings);
  }

  /**
   * Configura la alarma
   */
  setAlarm(hour: number, minute: number, meridian: 'AM' | 'PM', options?: {
    sound?: string;
    repeat?: boolean;
    title?: string;
  }): void {
    this.settings = {
      hour,
      minute,
      meridian,
      sound: options?.sound || this.settings.sound,
      repeat: options?.repeat ?? this.settings.repeat,
      title: options?.title || this.settings.title,
      isActive: false,
    };

    Storage.set('alarmSettings', this.settings);

    // Agregar a recent alarms
    Storage.addRecentItem('recentAlarms', {
      hour,
      minute,
      meridian,
      sound: this.settings.sound,
      title: this.settings.title,
    });
  }

  /**
   * Activa la alarma
   */
  start(): void {
    if (this.settings.isActive) return;

    this.settings.isActive = true;
    Storage.set('alarmSettings', this.settings);
    this.alarmTriggered = false;

    // Comenzar a verificar cada segundo
    this.checkInterval = window.setInterval(() => {
      this.checkAlarm();
    }, 1000);

    // Primera verificación inmediata
    this.checkAlarm();
  }

  /**
   * Detiene la alarma
   */
  stop(): void {
    this.settings.isActive = false;
    Storage.set('alarmSettings', this.settings);

    if (this.checkInterval !== null) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    // Detener sonido si está reproduciendo
    getAudioManager().stop();
    this.alarmTriggered = false;
  }

  /**
   * Verifica si es hora de activar la alarma
   */
  private checkAlarm(): void {
    if (!this.settings.isActive || this.alarmTriggered) return;

    const now = new Date();
    const currentHour24 = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();

    // Convertir la hora de la alarma a formato 24h
    const alarmHour24 = convertTo24Hour(this.settings.hour, this.settings.meridian);

    // Verificar si coincide (solo comparar hora y minuto)
    if (currentHour24 === alarmHour24 && currentMinute === this.settings.minute) {
      // Solo activar en el segundo 0 para evitar múltiples activaciones
      if (currentSecond === 0) {
        this.trigger();
      }
    }

    // Notificar el tick actual (para actualizar UI)
    if (this.onTickCallback) {
      const timeString = this.getCurrentTimeString();
      this.onTickCallback(timeString);
    }
  }

  /**
   * Activa la alarma (sonido, notificación, etc.)
   */
  private trigger(): void {
    this.alarmTriggered = true;

    // Reproducir sonido
    const audioManager = getAudioManager();
    audioManager.play(this.settings.sound, {
      loop: this.settings.repeat,
      volume: 1.0,
    });

    // Mostrar notificación del navegador
    const notificationTitle = this.settings.title || 'Alarm Clock';
    const notificationBody = `It's ${this.settings.hour}:${this.settings.minute.toString().padStart(2, '0')} ${this.settings.meridian}`;
    showNotification(notificationTitle, {
      body: notificationBody,
      icon: '/favicon.svg',
      requireInteraction: true,
    });

    // Vibración en dispositivos móviles
    vibrate([200, 100, 200, 100, 200]);

    // Callback personalizado
    if (this.onAlarmCallback) {
      this.onAlarmCallback();
    }

    // Si no es repetitivo, detener después de un tiempo
    if (!this.settings.repeat) {
      // Detener automáticamente después de 1 minuto
      setTimeout(() => {
        this.stop();
      }, 60000);
    }
  }

  /**
   * Obtiene la hora actual como string formateado
   */
  getCurrentTimeString(): string {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Formato 12h o 24h según configuración del usuario
    const visualSettings = Storage.getVisualSettings();
    const is24h = visualSettings.timeFormat === 24;

    if (!is24h) {
      const meridian = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${meridian}`;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Obtiene el tiempo hasta la próxima alarma
   */
  getTimeUntilAlarm(): { hours: number; minutes: number; seconds: number } | null {
    if (!this.settings.isActive) return null;

    const now = new Date();
    const alarmHour24 = convertTo24Hour(this.settings.hour, this.settings.meridian);

    // Crear fecha de la alarma
    const alarmDate = new Date();
    alarmDate.setHours(alarmHour24);
    alarmDate.setMinutes(this.settings.minute);
    alarmDate.setSeconds(0);
    alarmDate.setMilliseconds(0);

    // Si la alarma es para hoy pero ya pasó, es para mañana
    if (alarmDate.getTime() <= now.getTime()) {
      alarmDate.setDate(alarmDate.getDate() + 1);
    }

    const diff = alarmDate.getTime() - now.getTime();
    const totalSeconds = Math.floor(diff / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { hours, minutes, seconds };
  }

  /**
   * Verifica si la alarma está activa
   */
  isActive(): boolean {
    return this.settings.isActive;
  }

  /**
   * Verifica si la alarma está sonando
   */
  isTriggered(): boolean {
    return this.alarmTriggered;
  }

  /**
   * Registra un callback para cuando suene la alarma
   */
  onAlarm(callback: () => void): void {
    this.onAlarmCallback = callback;
  }

  /**
   * Registra un callback para cada tick (segundo)
   */
  onTick(callback: (time: string) => void): void {
    this.onTickCallback = callback;
  }

  /**
   * Prueba el sonido seleccionado
   */
  testSound(soundFile?: string): void {
    const audioManager = getAudioManager();
    audioManager.test(soundFile || this.settings.sound, 3000);
  }

  /**
   * Limpia recursos
   */
  destroy(): void {
    this.stop();
    this.onAlarmCallback = null;
    this.onTickCallback = null;
  }
}

// Instancia singleton
let alarmClockInstance: AlarmClock | null = null;

export function getAlarmClock(): AlarmClock {
  if (!alarmClockInstance) {
    alarmClockInstance = new AlarmClock();
  }
  return alarmClockInstance;
}
