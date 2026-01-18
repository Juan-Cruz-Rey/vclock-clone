/**
 * Utility Functions
 * Funciones de utilidad generales para la aplicación
 */

/**
 * Formatea el tiempo en formato HH:MM:SS
 */
export function formatTime(hours: number, minutes: number, seconds: number, format24h: boolean = false): string {
  let h = hours;
  let meridian = '';

  if (!format24h) {
    meridian = h >= 12 ? ' PM' : ' AM';
    h = h % 12 || 12;
  }

  const hh = h.toString().padStart(2, '0');
  const mm = minutes.toString().padStart(2, '0');
  const ss = seconds.toString().padStart(2, '0');

  return `${hh}:${mm}:${ss}${meridian}`;
}

/**
 * Formatea milisegundos en formato HH:MM:SS.mmm
 */
export function formatMilliseconds(ms: number, precision: 3 | 2 | 1 | 0 = 3): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = ms % 1000;

  let result = '';

  if (hours > 0) {
    result += `${hours.toString().padStart(2, '0')}:`;
  }

  result += `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  if (precision > 0) {
    const msString = milliseconds.toString().padStart(3, '0');
    result += `.${msString.substring(0, precision)}`;
  }

  return result;
}

/**
 * Formatea una duración en días, horas, minutos, segundos
 */
export function formatDuration(totalSeconds: number): string {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(' ');
}

/**
 * Convierte 12h a 24h
 */
export function convertTo24Hour(hour: number, meridian: 'AM' | 'PM'): number {
  if (meridian === 'AM') {
    return hour === 12 ? 0 : hour;
  } else {
    return hour === 12 ? 12 : hour + 12;
  }
}

/**
 * Convierte 24h a 12h
 */
export function convertTo12Hour(hour: number): { hour: number; meridian: 'AM' | 'PM' } {
  const meridian = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return { hour: hour12, meridian };
}

/**
 * Calcula el tiempo restante hasta una fecha específica
 */
export function getTimeUntil(targetDate: Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
} {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, totalSeconds };
}

/**
 * Genera un ID único
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Copia texto al portapapeles
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Formatea una fecha en formato legible
 */
export function formatDate(date: Date, locale: string = 'en'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Obtiene la hora actual en una zona horaria específica
 */
export function getTimeInTimezone(timezone: string): Date {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const get = (type: string) => parts.find(p => p.type === type)?.value || '0';

  return new Date(
    parseInt(get('year')),
    parseInt(get('month')) - 1,
    parseInt(get('day')),
    parseInt(get('hour')),
    parseInt(get('minute')),
    parseInt(get('second'))
  );
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Verifica si es mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Solicita permisos de notificación
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof Notification === 'undefined') {
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return 'denied';
}

/**
 * Muestra una notificación del navegador
 */
export function showNotification(title: string, options?: NotificationOptions): void {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
    return;
  }

  new Notification(title, options);
}

/**
 * Reproduce vibración en dispositivos compatibles
 */
export function vibrate(pattern: number | number[]): boolean {
  if (typeof navigator === 'undefined' || !navigator.vibrate) {
    return false;
  }

  return navigator.vibrate(pattern);
}

/**
 * Slug generator (para URLs amigables)
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
