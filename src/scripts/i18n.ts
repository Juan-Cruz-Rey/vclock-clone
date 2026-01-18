/**
 * i18n Helper
 * Funciones de ayuda para internacionalización
 */

import enTranslations from '../data/translations/en.json';
import esTranslations from '../data/translations/es.json';
import itTranslations from '../data/translations/it.json';

export type Locale = 'en' | 'es' | 'it';

type TranslationKey = string;
type Translations = typeof enTranslations;

const translations: Record<Locale, Translations> = {
  en: enTranslations,
  es: esTranslations,
  it: itTranslations,
};

/**
 * Obtiene una traducción por clave
 * Soporta claves anidadas como "alarm.title"
 * Soporta interpolación con {variable}
 */
export function t(
  locale: Locale,
  key: TranslationKey,
  params?: Record<string, string | number>
): string {
  const keys = key.split('.');
  let value: any = translations[locale];

  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      console.warn(`Translation missing: ${key} for locale ${locale}`);
      return key;
    }
  }

  if (typeof value !== 'string') {
    console.warn(`Translation is not a string: ${key}`);
    return key;
  }

  // Interpolación de parámetros
  if (params) {
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey]?.toString() || match;
    });
  }

  return value;
}

/**
 * Rutas localizadas para cada idioma
 */
export const routes: Record<Locale, {
  home: string;
  timer: string;
  stopwatch: string;
  clock: string;
  holidays: string;
  privacy: string;
  terms: string;
  contact: string;
}> = {
  en: {
    home: '/',
    timer: '/timer/',
    stopwatch: '/stopwatch/',
    clock: '/world-clock/',
    holidays: '/holidays/',
    privacy: '/privacy/',
    terms: '/terms/',
    contact: '/contact/',
  },
  es: {
    home: '/es/',
    timer: '/es/temporizador/',
    stopwatch: '/es/cronometro/',
    clock: '/es/reloj-mundial/',
    holidays: '/es/festivos/',
    privacy: '/es/privacidad/',
    terms: '/es/terminos/',
    contact: '/es/contacto/',
  },
  it: {
    home: '/it/',
    timer: '/it/timer/',
    stopwatch: '/it/cronometro/',
    clock: '/it/orologio-mondiale/',
    holidays: '/it/festivita/',
    privacy: '/it/privacy/',
    terms: '/it/termini/',
    contact: '/it/contatto/',
  },
};

/**
 * Obtiene la ruta localizada
 */
export function getRoute(locale: Locale, routeKey: keyof typeof routes.en): string {
  return routes[locale][routeKey];
}

/**
 * Información de idiomas disponibles
 */
export const languages: Record<Locale, { name: string; flag: string; nativeName: string }> = {
  en: { name: 'English', flag: '🇺🇸', nativeName: 'English' },
  es: { name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  it: { name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },
};

/**
 * Detecta el locale desde la URL
 */
export function getLocaleFromPath(pathname: string): Locale {
  if (pathname.startsWith('/es')) return 'es';
  if (pathname.startsWith('/it')) return 'it';
  return 'en';
}

/**
 * Convierte una ruta del idioma actual a otro idioma
 */
export function switchLocale(currentPath: string, targetLocale: Locale): string {
  const currentLocale = getLocaleFromPath(currentPath);

  // Si ya estamos en el idioma objetivo, no hacer nada
  if (currentLocale === targetLocale) return currentPath;

  // Remover el prefijo del idioma actual si existe
  let pathWithoutLocale = currentPath;
  if (currentLocale === 'es') {
    pathWithoutLocale = currentPath.replace(/^\/es/, '');
  } else if (currentLocale === 'it') {
    pathWithoutLocale = currentPath.replace(/^\/it/, '');
  }

  // Si está vacío, es la home
  if (!pathWithoutLocale || pathWithoutLocale === '/') {
    return routes[targetLocale].home;
  }

  // Mapear rutas conocidas
  const routeMapping: Record<string, keyof typeof routes.en> = {
    '/timer': 'timer',
    '/temporizador': 'timer',
    '/stopwatch': 'stopwatch',
    '/cronometro': 'stopwatch',
    '/world-clock': 'clock',
    '/reloj-mundial': 'clock',
    '/orologio-mondiale': 'clock',
    '/time': 'clock',
    '/hora': 'clock',
    '/ora': 'clock',
    '/holidays': 'holidays',
    '/festivos': 'holidays',
    '/festivita': 'holidays',
    '/privacy': 'privacy',
    '/privacidad': 'privacy',
    '/terms': 'terms',
    '/terminos': 'terms',
    '/termini': 'terms',
    '/contact': 'contact',
    '/contacto': 'contact',
    '/contatto': 'contact',
  };

  // Buscar si la ruta corresponde a alguna ruta conocida
  for (const [path, routeKey] of Object.entries(routeMapping)) {
    if (pathWithoutLocale.startsWith(path)) {
      return routes[targetLocale][routeKey];
    }
  }

  // Si no se encuentra mapeo, intentar agregar el prefijo del idioma objetivo
  if (targetLocale === 'en') {
    return pathWithoutLocale;
  } else {
    return `/${targetLocale}${pathWithoutLocale}`;
  }
}

/**
 * Obtiene todos los locales disponibles
 */
export function getAllLocales(): Locale[] {
  return ['en', 'es', 'it'];
}

/**
 * Verifica si un locale es válido
 */
export function isValidLocale(locale: string): locale is Locale {
  return ['en', 'es', 'it'].includes(locale);
}
