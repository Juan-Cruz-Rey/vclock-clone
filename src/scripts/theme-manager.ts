/**
 * Theme Manager
 * Maneja el tema (light/dark) de la aplicación con persistencia en localStorage
 */

export type Theme = 'light' | 'dark';

export class ThemeManager {
  private static readonly STORAGE_KEY = 'dark-theme';
  private static readonly DARK_CLASS = 'dark';

  /**
   * Inicializa el tema al cargar la página
   * Detecta preferencia guardada o usa la preferencia del sistema
   */
  static init(): void {
    if (typeof window === 'undefined') return;

    const savedTheme = this.getSavedTheme();

    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      // Detectar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light');
    }

    // Escuchar cambios en la preferencia del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!this.getSavedTheme()) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  /**
   * Obtiene el tema guardado en localStorage
   */
  static getSavedTheme(): Theme | null {
    if (typeof window === 'undefined') return null;

    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved === 'dark' || saved === 'light' ? saved : null;
  }

  /**
   * Obtiene el tema actual
   */
  static getCurrentTheme(): Theme {
    if (typeof window === 'undefined') return 'light';

    return document.documentElement.classList.contains(this.DARK_CLASS) ? 'dark' : 'light';
  }

  /**
   * Establece el tema
   */
  static setTheme(theme: Theme): void {
    if (typeof window === 'undefined') return;

    if (theme === 'dark') {
      document.documentElement.classList.add(this.DARK_CLASS);
    } else {
      document.documentElement.classList.remove(this.DARK_CLASS);
    }

    localStorage.setItem(this.STORAGE_KEY, theme);

    // Disparar evento personalizado para que los componentes puedan reaccionar
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  /**
   * Alterna entre light y dark mode
   */
  static toggle(): void {
    const current = this.getCurrentTheme();
    const newTheme: Theme = current === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  /**
   * Verifica si está en dark mode
   */
  static isDark(): boolean {
    return this.getCurrentTheme() === 'dark';
  }

  /**
   * Verifica si está en light mode
   */
  static isLight(): boolean {
    return this.getCurrentTheme() === 'light';
  }
}

// Auto-inicializar cuando se importa en el navegador
if (typeof window !== 'undefined') {
  // Usar DOMContentLoaded para asegurar que el DOM está listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('[ThemeManager] Initializing...');
      ThemeManager.init();
    });
  } else {
    console.log('[ThemeManager] Initializing immediately...');
    ThemeManager.init();
  }
}
