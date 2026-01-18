/**
 * Audio Manager
 * Maneja la reproducción de sonidos de alarma y timer
 */

export interface AudioOptions {
  loop?: boolean;
  volume?: number;
}

export class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private currentSound: string | null = null;

  /**
   * Reproduce un sonido
   */
  play(soundFile: string, options: AudioOptions = {}): void {
    this.stop();

    const { loop = false, volume = 1.0 } = options;

    try {
      this.audio = new Audio(`/sounds/${soundFile}`);
      this.audio.loop = loop;
      this.audio.volume = Math.max(0, Math.min(1, volume));
      this.currentSound = soundFile;

      this.audio.play().catch(err => {
        console.error('Audio play failed:', err);
        // Fallback: intentar reproducir después de interacción del usuario
        this.handleAutoplayError();
      });
    } catch (error) {
      console.error('Error creating audio:', error);
    }
  }

  /**
   * Detiene el sonido actual
   */
  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
      this.currentSound = null;
    }
  }

  /**
   * Pausa el sonido actual
   */
  pause(): void {
    if (this.audio) {
      this.audio.pause();
    }
  }

  /**
   * Resume el sonido pausado
   */
  resume(): void {
    if (this.audio) {
      this.audio.play().catch(err => console.error('Resume failed:', err));
    }
  }

  /**
   * Ajusta el volumen (0.0 a 1.0)
   */
  setVolume(volume: number): void {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Obtiene el volumen actual
   */
  getVolume(): number {
    return this.audio?.volume ?? 1.0;
  }

  /**
   * Verifica si está reproduciendo
   */
  isPlaying(): boolean {
    return this.audio !== null && !this.audio.paused;
  }

  /**
   * Obtiene el sonido actual
   */
  getCurrentSound(): string | null {
    return this.currentSound;
  }

  /**
   * Reproduce un sonido de prueba por una duración específica
   */
  test(soundFile: string, duration: number = 3000): void {
    this.play(soundFile, { loop: false, volume: 0.7 });

    setTimeout(() => {
      this.stop();
    }, duration);
  }

  /**
   * Pre-carga un sonido para reproducción más rápida
   */
  preload(soundFile: string): void {
    try {
      const audio = new Audio(`/sounds/${soundFile}`);
      audio.preload = 'auto';
    } catch (error) {
      console.error('Error preloading audio:', error);
    }
  }

  /**
   * Pre-carga múltiples sonidos
   */
  preloadAll(soundFiles: string[]): void {
    soundFiles.forEach(file => this.preload(file));
  }

  /**
   * Maneja errores de autoplay (navegadores modernos requieren interacción del usuario)
   */
  private handleAutoplayError(): void {
    // Mostrar notificación al usuario para que interactúe
    console.warn('Autoplay blocked. User interaction required.');

    // Agregar listener para la próxima interacción
    const playOnInteraction = () => {
      if (this.audio && this.currentSound) {
        this.audio.play().catch(err => console.error('Playback still failed:', err));
      }
      // Remover listener después de usarlo
      document.removeEventListener('click', playOnInteraction);
      document.removeEventListener('touchstart', playOnInteraction);
    };

    document.addEventListener('click', playOnInteraction, { once: true });
    document.addEventListener('touchstart', playOnInteraction, { once: true });
  }

  /**
   * Verifica si el navegador soporta audio
   */
  static isAudioSupported(): boolean {
    return typeof Audio !== 'undefined';
  }

  /**
   * Lista de sonidos disponibles por defecto
   */
  static getAvailableSounds(): Array<{ id: string; name: string; file: string }> {
    return [
      { id: 'alarm-1', name: 'Classic Alarm', file: 'alarm-1.mp3' },
      { id: 'alarm-2', name: 'Beep Beep', file: 'alarm-2.mp3' },
      { id: 'alarm-3', name: 'Rooster', file: 'alarm-3.mp3' },
      { id: 'alarm-4', name: 'Bell', file: 'alarm-4.mp3' },
      { id: 'alarm-5', name: 'Chime', file: 'alarm-5.mp3' },
      { id: 'alarm-6', name: 'Digital', file: 'alarm-6.mp3' },
    ];
  }
}

// Instancia singleton global
let audioManagerInstance: AudioManager | null = null;

export function getAudioManager(): AudioManager {
  if (!audioManagerInstance) {
    audioManagerInstance = new AudioManager();
  }
  return audioManagerInstance;
}
