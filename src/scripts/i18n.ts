/**
 * i18n Helper
 * Funciones de ayuda para internacionalización
 * Soporta 50 idiomas
 */

import enTranslations from '../data/translations/en.json';
import esTranslations from '../data/translations/es.json';
import itTranslations from '../data/translations/it.json';
import frTranslations from '../data/translations/fr.json';
import deTranslations from '../data/translations/de.json';
import ptTranslations from '../data/translations/pt.json';
import ruTranslations from '../data/translations/ru.json';
import jaTranslations from '../data/translations/ja.json';
import koTranslations from '../data/translations/ko.json';
import zhCNTranslations from '../data/translations/zh-CN.json';
import arTranslations from '../data/translations/ar.json';
import hiTranslations from '../data/translations/hi.json';
import bnTranslations from '../data/translations/bn.json';
import idTranslations from '../data/translations/id.json';
import trTranslations from '../data/translations/tr.json';
import viTranslations from '../data/translations/vi.json';
import plTranslations from '../data/translations/pl.json';
import nlTranslations from '../data/translations/nl.json';
import thTranslations from '../data/translations/th.json';
import paTranslations from '../data/translations/pa.json';
import mrTranslations from '../data/translations/mr.json';
import teTranslations from '../data/translations/te.json';
import taTranslations from '../data/translations/ta.json';
import zhHKTranslations from '../data/translations/zh-HK.json';
import faTranslations from '../data/translations/fa.json';
import haTranslations from '../data/translations/ha.json';
import msTranslations from '../data/translations/ms.json';
import filTranslations from '../data/translations/fil.json';
import jvTranslations from '../data/translations/jv.json';
import guTranslations from '../data/translations/gu.json';
import amTranslations from '../data/translations/am.json';
import yoTranslations from '../data/translations/yo.json';
import knTranslations from '../data/translations/kn.json';
import ukTranslations from '../data/translations/uk.json';
import suTranslations from '../data/translations/su.json';
import mlTranslations from '../data/translations/ml.json';
import orTranslations from '../data/translations/or.json';
import uzTranslations from '../data/translations/uz.json';
import myTranslations from '../data/translations/my.json';
import igTranslations from '../data/translations/ig.json';
import sdTranslations from '../data/translations/sd.json';
import roTranslations from '../data/translations/ro.json';
import swTranslations from '../data/translations/sw.json';
import neTranslations from '../data/translations/ne.json';
import csTranslations from '../data/translations/cs.json';
import elTranslations from '../data/translations/el.json';
import svTranslations from '../data/translations/sv.json';
import huTranslations from '../data/translations/hu.json';
import urTranslations from '../data/translations/ur.json';
import heTranslations from '../data/translations/he.json';

export type Locale =
  | 'en' | 'es' | 'it' | 'fr' | 'de' | 'pt' | 'ru' | 'ja' | 'ko' | 'zh-CN'
  | 'ar' | 'hi' | 'bn' | 'id' | 'tr' | 'vi' | 'pl' | 'nl' | 'th' | 'pa'
  | 'mr' | 'te' | 'ta' | 'zh-HK' | 'fa' | 'ha' | 'ms' | 'fil' | 'jv' | 'gu'
  | 'am' | 'yo' | 'kn' | 'uk' | 'su' | 'ml' | 'or' | 'uz' | 'my' | 'ig'
  | 'sd' | 'ro' | 'sw' | 'ne' | 'cs' | 'el' | 'sv' | 'hu' | 'ur' | 'he';

type TranslationKey = string;
type Translations = typeof enTranslations;

const translations: Record<Locale, Translations> = {
  en: enTranslations,
  es: esTranslations,
  it: itTranslations,
  fr: frTranslations,
  de: deTranslations,
  pt: ptTranslations,
  ru: ruTranslations,
  ja: jaTranslations,
  ko: koTranslations,
  'zh-CN': zhCNTranslations,
  ar: arTranslations,
  hi: hiTranslations,
  bn: bnTranslations,
  id: idTranslations,
  tr: trTranslations,
  vi: viTranslations,
  pl: plTranslations,
  nl: nlTranslations,
  th: thTranslations,
  pa: paTranslations,
  mr: mrTranslations,
  te: teTranslations,
  ta: taTranslations,
  'zh-HK': zhHKTranslations,
  fa: faTranslations,
  ha: haTranslations,
  ms: msTranslations,
  fil: filTranslations,
  jv: jvTranslations,
  gu: guTranslations,
  am: amTranslations,
  yo: yoTranslations,
  kn: knTranslations,
  uk: ukTranslations,
  su: suTranslations,
  ml: mlTranslations,
  or: orTranslations,
  uz: uzTranslations,
  my: myTranslations,
  ig: igTranslations,
  sd: sdTranslations,
  ro: roTranslations,
  sw: swTranslations,
  ne: neTranslations,
  cs: csTranslations,
  el: elTranslations,
  sv: svTranslations,
  hu: huTranslations,
  ur: urTranslations,
  he: heTranslations,
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
 * Rutas localizadas para cada idioma (50 idiomas)
 * Idiomas prioritarios (17) tienen rutas completas
 * Idiomas secundarios (33) tienen rutas básicas
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
  // Priority languages with full pages (17 languages)
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
  fr: {
    home: '/fr/',
    timer: '/fr/minuteur/',
    stopwatch: '/fr/chronometre/',
    clock: '/fr/horloge-mondiale/',
    holidays: '/fr/jours-feries/',
    privacy: '/fr/confidentialite/',
    terms: '/fr/conditions/',
    contact: '/fr/contact/',
  },
  de: {
    home: '/de/',
    timer: '/de/timer/',
    stopwatch: '/de/stoppuhr/',
    clock: '/de/weltzeituhr/',
    holidays: '/de/feiertage/',
    privacy: '/de/datenschutz/',
    terms: '/de/bedingungen/',
    contact: '/de/kontakt/',
  },
  pt: {
    home: '/pt/',
    timer: '/pt/temporizador/',
    stopwatch: '/pt/cronometro/',
    clock: '/pt/relogio-mundial/',
    holidays: '/pt/feriados/',
    privacy: '/pt/privacidade/',
    terms: '/pt/termos/',
    contact: '/pt/contato/',
  },
  ru: {
    home: '/ru/',
    timer: '/ru/taimer/',
    stopwatch: '/ru/sekundomjer/',
    clock: '/ru/mirovoje-vremja/',
    holidays: '/ru/prazdniki/',
    privacy: '/ru/konfidenczialnost/',
    terms: '/ru/uslovija/',
    contact: '/ru/kontakt/',
  },
  ja: {
    home: '/ja/',
    timer: '/ja/taima/',
    stopwatch: '/ja/sutoppuwotchi/',
    clock: '/ja/sekai-tokei/',
    holidays: '/ja/kyujitsu/',
    privacy: '/ja/puraibashi/',
    terms: '/ja/riyokiyaku/',
    contact: '/ja/otoiawase/',
  },
  ko: {
    home: '/ko/',
    timer: '/ko/taimer/',
    stopwatch: '/ko/stopwatch/',
    clock: '/ko/segye-sigye/',
    holidays: '/ko/hyuil/',
    privacy: '/ko/privacy/',
    terms: '/ko/terms/',
    contact: '/ko/contact/',
  },
  'zh-CN': {
    home: '/zh-CN/',
    timer: '/zh-CN/jishiqi/',
    stopwatch: '/zh-CN/miaobiao/',
    clock: '/zh-CN/shijie-zhong/',
    holidays: '/zh-CN/jieri/',
    privacy: '/zh-CN/yinsi/',
    terms: '/zh-CN/tiaokuan/',
    contact: '/zh-CN/lianxi/',
  },
  ar: {
    home: '/ar/',
    timer: '/ar/timer/',
    stopwatch: '/ar/stopwatch/',
    clock: '/ar/world-clock/',
    holidays: '/ar/holidays/',
    privacy: '/ar/privacy/',
    terms: '/ar/terms/',
    contact: '/ar/contact/',
  },
  hi: {
    home: '/hi/',
    timer: '/hi/timer/',
    stopwatch: '/hi/stopwatch/',
    clock: '/hi/world-clock/',
    holidays: '/hi/holidays/',
    privacy: '/hi/privacy/',
    terms: '/hi/terms/',
    contact: '/hi/contact/',
  },
  id: {
    home: '/id/',
    timer: '/id/timer/',
    stopwatch: '/id/stopwatch/',
    clock: '/id/jam-dunia/',
    holidays: '/id/hari-libur/',
    privacy: '/id/privasi/',
    terms: '/id/ketentuan/',
    contact: '/id/kontak/',
  },
  tr: {
    home: '/tr/',
    timer: '/tr/zamanlayici/',
    stopwatch: '/tr/kronometre/',
    clock: '/tr/dunya-saati/',
    holidays: '/tr/tatiller/',
    privacy: '/tr/gizlilik/',
    terms: '/tr/kosullar/',
    contact: '/tr/iletisim/',
  },
  vi: {
    home: '/vi/',
    timer: '/vi/hen-gio/',
    stopwatch: '/vi/dong-ho-bam-giay/',
    clock: '/vi/dong-ho-the-gioi/',
    holidays: '/vi/ngay-le/',
    privacy: '/vi/quyen-rieng-tu/',
    terms: '/vi/dieu-khoan/',
    contact: '/vi/lien-he/',
  },
  pl: {
    home: '/pl/',
    timer: '/pl/timer/',
    stopwatch: '/pl/stoper/',
    clock: '/pl/zegar-swiatowy/',
    holidays: '/pl/swieta/',
    privacy: '/pl/prywatnosc/',
    terms: '/pl/warunki/',
    contact: '/pl/kontakt/',
  },
  nl: {
    home: '/nl/',
    timer: '/nl/timer/',
    stopwatch: '/nl/stopwatch/',
    clock: '/nl/wereldklok/',
    holidays: '/nl/feestdagen/',
    privacy: '/nl/privacy/',
    terms: '/nl/voorwaarden/',
    contact: '/nl/contact/',
  },

  // Secondary languages with basic routes (33 languages)
  bn: {
    home: '/bn/',
    timer: '/bn/timer/',
    stopwatch: '/bn/stopwatch/',
    clock: '/bn/world-clock/',
    holidays: '/bn/holidays/',
    privacy: '/bn/privacy/',
    terms: '/bn/terms/',
    contact: '/bn/contact/',
  },
  'zh-HK': {
    home: '/zh-HK/',
    timer: '/zh-HK/timer/',
    stopwatch: '/zh-HK/stopwatch/',
    clock: '/zh-HK/world-clock/',
    holidays: '/zh-HK/holidays/',
    privacy: '/zh-HK/privacy/',
    terms: '/zh-HK/terms/',
    contact: '/zh-HK/contact/',
  },
  fa: {
    home: '/fa/',
    timer: '/fa/timer/',
    stopwatch: '/fa/stopwatch/',
    clock: '/fa/world-clock/',
    holidays: '/fa/holidays/',
    privacy: '/fa/privacy/',
    terms: '/fa/terms/',
    contact: '/fa/contact/',
  },
  ha: {
    home: '/ha/',
    timer: '/ha/timer/',
    stopwatch: '/ha/stopwatch/',
    clock: '/ha/world-clock/',
    holidays: '/ha/holidays/',
    privacy: '/ha/privacy/',
    terms: '/ha/terms/',
    contact: '/ha/contact/',
  },
  ms: {
    home: '/ms/',
    timer: '/ms/timer/',
    stopwatch: '/ms/stopwatch/',
    clock: '/ms/world-clock/',
    holidays: '/ms/holidays/',
    privacy: '/ms/privacy/',
    terms: '/ms/terms/',
    contact: '/ms/contact/',
  },
  fil: {
    home: '/fil/',
    timer: '/fil/timer/',
    stopwatch: '/fil/stopwatch/',
    clock: '/fil/world-clock/',
    holidays: '/fil/holidays/',
    privacy: '/fil/privacy/',
    terms: '/fil/terms/',
    contact: '/fil/contact/',
  },
  jv: {
    home: '/jv/',
    timer: '/jv/timer/',
    stopwatch: '/jv/stopwatch/',
    clock: '/jv/world-clock/',
    holidays: '/jv/holidays/',
    privacy: '/jv/privacy/',
    terms: '/jv/terms/',
    contact: '/jv/contact/',
  },
  gu: {
    home: '/gu/',
    timer: '/gu/timer/',
    stopwatch: '/gu/stopwatch/',
    clock: '/gu/world-clock/',
    holidays: '/gu/holidays/',
    privacy: '/gu/privacy/',
    terms: '/gu/terms/',
    contact: '/gu/contact/',
  },
  am: {
    home: '/am/',
    timer: '/am/timer/',
    stopwatch: '/am/stopwatch/',
    clock: '/am/world-clock/',
    holidays: '/am/holidays/',
    privacy: '/am/privacy/',
    terms: '/am/terms/',
    contact: '/am/contact/',
  },
  yo: {
    home: '/yo/',
    timer: '/yo/timer/',
    stopwatch: '/yo/stopwatch/',
    clock: '/yo/world-clock/',
    holidays: '/yo/holidays/',
    privacy: '/yo/privacy/',
    terms: '/yo/terms/',
    contact: '/yo/contact/',
  },
  kn: {
    home: '/kn/',
    timer: '/kn/timer/',
    stopwatch: '/kn/stopwatch/',
    clock: '/kn/world-clock/',
    holidays: '/kn/holidays/',
    privacy: '/kn/privacy/',
    terms: '/kn/terms/',
    contact: '/kn/contact/',
  },
  uk: {
    home: '/uk/',
    timer: '/uk/timer/',
    stopwatch: '/uk/stopwatch/',
    clock: '/uk/world-clock/',
    holidays: '/uk/holidays/',
    privacy: '/uk/privacy/',
    terms: '/uk/terms/',
    contact: '/uk/contact/',
  },
  su: {
    home: '/su/',
    timer: '/su/timer/',
    stopwatch: '/su/stopwatch/',
    clock: '/su/world-clock/',
    holidays: '/su/holidays/',
    privacy: '/su/privacy/',
    terms: '/su/terms/',
    contact: '/su/contact/',
  },
  ml: {
    home: '/ml/',
    timer: '/ml/timer/',
    stopwatch: '/ml/stopwatch/',
    clock: '/ml/world-clock/',
    holidays: '/ml/holidays/',
    privacy: '/ml/privacy/',
    terms: '/ml/terms/',
    contact: '/ml/contact/',
  },
  or: {
    home: '/or/',
    timer: '/or/timer/',
    stopwatch: '/or/stopwatch/',
    clock: '/or/world-clock/',
    holidays: '/or/holidays/',
    privacy: '/or/privacy/',
    terms: '/or/terms/',
    contact: '/or/contact/',
  },
  uz: {
    home: '/uz/',
    timer: '/uz/timer/',
    stopwatch: '/uz/stopwatch/',
    clock: '/uz/world-clock/',
    holidays: '/uz/holidays/',
    privacy: '/uz/privacy/',
    terms: '/uz/terms/',
    contact: '/uz/contact/',
  },
  my: {
    home: '/my/',
    timer: '/my/timer/',
    stopwatch: '/my/stopwatch/',
    clock: '/my/world-clock/',
    holidays: '/my/holidays/',
    privacy: '/my/privacy/',
    terms: '/my/terms/',
    contact: '/my/contact/',
  },
  ig: {
    home: '/ig/',
    timer: '/ig/timer/',
    stopwatch: '/ig/stopwatch/',
    clock: '/ig/world-clock/',
    holidays: '/ig/holidays/',
    privacy: '/ig/privacy/',
    terms: '/ig/terms/',
    contact: '/ig/contact/',
  },
  sd: {
    home: '/sd/',
    timer: '/sd/timer/',
    stopwatch: '/sd/stopwatch/',
    clock: '/sd/world-clock/',
    holidays: '/sd/holidays/',
    privacy: '/sd/privacy/',
    terms: '/sd/terms/',
    contact: '/sd/contact/',
  },
  ro: {
    home: '/ro/',
    timer: '/ro/timer/',
    stopwatch: '/ro/stopwatch/',
    clock: '/ro/world-clock/',
    holidays: '/ro/holidays/',
    privacy: '/ro/privacy/',
    terms: '/ro/terms/',
    contact: '/ro/contact/',
  },
  sw: {
    home: '/sw/',
    timer: '/sw/timer/',
    stopwatch: '/sw/stopwatch/',
    clock: '/sw/world-clock/',
    holidays: '/sw/holidays/',
    privacy: '/sw/privacy/',
    terms: '/sw/terms/',
    contact: '/sw/contact/',
  },
  ne: {
    home: '/ne/',
    timer: '/ne/timer/',
    stopwatch: '/ne/stopwatch/',
    clock: '/ne/world-clock/',
    holidays: '/ne/holidays/',
    privacy: '/ne/privacy/',
    terms: '/ne/terms/',
    contact: '/ne/contact/',
  },
  cs: {
    home: '/cs/',
    timer: '/cs/timer/',
    stopwatch: '/cs/stopwatch/',
    clock: '/cs/world-clock/',
    holidays: '/cs/holidays/',
    privacy: '/cs/privacy/',
    terms: '/cs/terms/',
    contact: '/cs/contact/',
  },
  el: {
    home: '/el/',
    timer: '/el/timer/',
    stopwatch: '/el/stopwatch/',
    clock: '/el/world-clock/',
    holidays: '/el/holidays/',
    privacy: '/el/privacy/',
    terms: '/el/terms/',
    contact: '/el/contact/',
  },
  sv: {
    home: '/sv/',
    timer: '/sv/timer/',
    stopwatch: '/sv/stopwatch/',
    clock: '/sv/world-clock/',
    holidays: '/sv/holidays/',
    privacy: '/sv/privacy/',
    terms: '/sv/terms/',
    contact: '/sv/contact/',
  },
  hu: {
    home: '/hu/',
    timer: '/hu/timer/',
    stopwatch: '/hu/stopwatch/',
    clock: '/hu/world-clock/',
    holidays: '/hu/holidays/',
    privacy: '/hu/privacy/',
    terms: '/hu/terms/',
    contact: '/hu/contact/',
  },
  ur: {
    home: '/ur/',
    timer: '/ur/timer/',
    stopwatch: '/ur/stopwatch/',
    clock: '/ur/world-clock/',
    holidays: '/ur/holidays/',
    privacy: '/ur/privacy/',
    terms: '/ur/terms/',
    contact: '/ur/contact/',
  },
  he: {
    home: '/he/',
    timer: '/he/timer/',
    stopwatch: '/he/stopwatch/',
    clock: '/he/world-clock/',
    holidays: '/he/holidays/',
    privacy: '/he/privacy/',
    terms: '/he/terms/',
    contact: '/he/contact/',
  },
  pa: {
    home: '/pa/',
    timer: '/pa/timer/',
    stopwatch: '/pa/stopwatch/',
    clock: '/pa/world-clock/',
    holidays: '/pa/holidays/',
    privacy: '/pa/privacy/',
    terms: '/pa/terms/',
    contact: '/pa/contact/',
  },
  mr: {
    home: '/mr/',
    timer: '/mr/timer/',
    stopwatch: '/mr/stopwatch/',
    clock: '/mr/world-clock/',
    holidays: '/mr/holidays/',
    privacy: '/mr/privacy/',
    terms: '/mr/terms/',
    contact: '/mr/contact/',
  },
  te: {
    home: '/te/',
    timer: '/te/timer/',
    stopwatch: '/te/stopwatch/',
    clock: '/te/world-clock/',
    holidays: '/te/holidays/',
    privacy: '/te/privacy/',
    terms: '/te/terms/',
    contact: '/te/contact/',
  },
  ta: {
    home: '/ta/',
    timer: '/ta/timer/',
    stopwatch: '/ta/stopwatch/',
    clock: '/ta/world-clock/',
    holidays: '/ta/holidays/',
    privacy: '/ta/privacy/',
    terms: '/ta/terms/',
    contact: '/ta/contact/',
  },
  th: {
    home: '/th/',
    timer: '/th/timer/',
    stopwatch: '/th/stopwatch/',
    clock: '/th/world-clock/',
    holidays: '/th/holidays/',
    privacy: '/th/privacy/',
    terms: '/th/terms/',
    contact: '/th/contact/',
  },
};

/**
 * Obtiene la ruta localizada
 */
export function getRoute(locale: Locale, routeKey: keyof typeof routes.en): string {
  return routes[locale][routeKey];
}

/**
 * Información de idiomas disponibles (50 idiomas)
 */
export const languages: Record<Locale, { name: string; flag: string; nativeName: string; rtl?: boolean }> = {
  en: { name: 'English', flag: '🇺🇸', nativeName: 'English' },
  es: { name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  it: { name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },
  fr: { name: 'French', flag: '🇫🇷', nativeName: 'Français' },
  de: { name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
  pt: { name: 'Portuguese', flag: '🇵🇹', nativeName: 'Português' },
  ru: { name: 'Russian', flag: '🇷🇺', nativeName: 'Русский' },
  ja: { name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
  ko: { name: 'Korean', flag: '🇰🇷', nativeName: '한국어' },
  'zh-CN': { name: 'Chinese (Simplified)', flag: '🇨🇳', nativeName: '简体中文' },
  ar: { name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية', rtl: true },
  hi: { name: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी' },
  bn: { name: 'Bengali', flag: '🇧🇩', nativeName: 'বাংলা' },
  id: { name: 'Indonesian', flag: '🇮🇩', nativeName: 'Bahasa Indonesia' },
  tr: { name: 'Turkish', flag: '🇹🇷', nativeName: 'Türkçe' },
  vi: { name: 'Vietnamese', flag: '🇻🇳', nativeName: 'Tiếng Việt' },
  pl: { name: 'Polish', flag: '🇵🇱', nativeName: 'Polski' },
  nl: { name: 'Dutch', flag: '🇳🇱', nativeName: 'Nederlands' },
  th: { name: 'Thai', flag: '🇹🇭', nativeName: 'ไทย' },
  pa: { name: 'Punjabi', flag: '🇮🇳', nativeName: 'ਪੰਜਾਬੀ' },
  mr: { name: 'Marathi', flag: '🇮🇳', nativeName: 'मराठी' },
  te: { name: 'Telugu', flag: '🇮🇳', nativeName: 'తెలుగు' },
  ta: { name: 'Tamil', flag: '🇮🇳', nativeName: 'தமிழ்' },
  'zh-HK': { name: 'Chinese (Hong Kong)', flag: '🇭🇰', nativeName: '繁體中文' },
  fa: { name: 'Persian', flag: '🇮🇷', nativeName: 'فارسی', rtl: true },
  ha: { name: 'Hausa', flag: '🇳🇬', nativeName: 'Hausa' },
  ms: { name: 'Malay', flag: '🇲🇾', nativeName: 'Bahasa Melayu' },
  fil: { name: 'Filipino', flag: '🇵🇭', nativeName: 'Filipino' },
  jv: { name: 'Javanese', flag: '🇮🇩', nativeName: 'Basa Jawa' },
  gu: { name: 'Gujarati', flag: '🇮🇳', nativeName: 'ગુજરાતી' },
  am: { name: 'Amharic', flag: '🇪🇹', nativeName: 'አማርኛ' },
  yo: { name: 'Yoruba', flag: '🇳🇬', nativeName: 'Yorùbá' },
  kn: { name: 'Kannada', flag: '🇮🇳', nativeName: 'ಕನ್ನಡ' },
  uk: { name: 'Ukrainian', flag: '🇺🇦', nativeName: 'Українська' },
  su: { name: 'Sundanese', flag: '🇮🇩', nativeName: 'Basa Sunda' },
  ml: { name: 'Malayalam', flag: '🇮🇳', nativeName: 'മലയാളം' },
  or: { name: 'Odia', flag: '🇮🇳', nativeName: 'ଓଡ଼ିଆ' },
  uz: { name: 'Uzbek', flag: '🇺🇿', nativeName: 'Oʻzbek' },
  my: { name: 'Burmese', flag: '🇲🇲', nativeName: 'မြန်မာ' },
  ig: { name: 'Igbo', flag: '🇳🇬', nativeName: 'Igbo' },
  sd: { name: 'Sindhi', flag: '🇵🇰', nativeName: 'سنڌي', rtl: true },
  ro: { name: 'Romanian', flag: '🇷🇴', nativeName: 'Română' },
  sw: { name: 'Swahili', flag: '🇰🇪', nativeName: 'Kiswahili' },
  ne: { name: 'Nepali', flag: '🇳🇵', nativeName: 'नेपाली' },
  cs: { name: 'Czech', flag: '🇨🇿', nativeName: 'Čeština' },
  el: { name: 'Greek', flag: '🇬🇷', nativeName: 'Ελληνικά' },
  sv: { name: 'Swedish', flag: '🇸🇪', nativeName: 'Svenska' },
  hu: { name: 'Hungarian', flag: '🇭🇺', nativeName: 'Magyar' },
  ur: { name: 'Urdu', flag: '🇵🇰', nativeName: 'اردو', rtl: true },
  he: { name: 'Hebrew', flag: '🇮🇱', nativeName: 'עברית', rtl: true },
};

/**
 * Detecta el locale desde la URL (soporta 50 idiomas)
 */
export function getLocaleFromPath(pathname: string): Locale {
  // Check all locales from the languages object
  const allLocales = Object.keys(languages) as Locale[];

  for (const locale of allLocales) {
    if (locale === 'en') continue; // English is the default, check it last
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return locale;
    }
  }

  // Default to English if no locale prefix found
  return 'en';
}

/**
 * Convierte una ruta del idioma actual a otro idioma (soporta 50 idiomas)
 */
export function switchLocale(currentPath: string, targetLocale: Locale): string {
  const currentLocale = getLocaleFromPath(currentPath);

  // Si ya estamos en el idioma objetivo, no hacer nada
  if (currentLocale === targetLocale) return currentPath;

  // Remover el prefijo del idioma actual si existe (para todos los idiomas excepto inglés)
  let pathWithoutLocale = currentPath;
  if (currentLocale !== 'en') {
    // Remove the locale prefix (e.g., /es/, /de/, /fr/, etc.)
    const localePrefix = new RegExp(`^/${currentLocale}(/|$)`);
    pathWithoutLocale = currentPath.replace(localePrefix, '/');
  }

  // Normalize path (remove double slashes, ensure starts with /)
  pathWithoutLocale = pathWithoutLocale.replace(/\/+/g, '/');
  if (!pathWithoutLocale.startsWith('/')) {
    pathWithoutLocale = '/' + pathWithoutLocale;
  }

  // Si está vacío o es solo /, es la home
  if (pathWithoutLocale === '/' || pathWithoutLocale === '') {
    return routes[targetLocale].home;
  }

  // Try to find a matching route key by checking current locale routes
  const currentRoutes = routes[currentLocale];
  let matchedRouteKey: keyof typeof routes.en | null = null;

  // Check if current path matches any route in the current locale
  for (const [key, value] of Object.entries(currentRoutes)) {
    const routeKey = key as keyof typeof routes.en;
    if (currentPath === value || currentPath === value.replace(/\/$/, '')) {
      matchedRouteKey = routeKey;
      break;
    }
  }

  // If we found a matching route, return the equivalent in target locale
  if (matchedRouteKey) {
    return routes[targetLocale][matchedRouteKey];
  }

  // Fallback: if no route match found, construct the new path
  // Remove trailing slash for consistency
  pathWithoutLocale = pathWithoutLocale.replace(/\/$/, '');

  if (targetLocale === 'en') {
    return pathWithoutLocale || '/';
  } else {
    return `/${targetLocale}${pathWithoutLocale}`;
  }
}

/**
 * Obtiene todos los locales disponibles (50 idiomas)
 */
export function getAllLocales(): Locale[] {
  return [
    'en', 'es', 'it', 'fr', 'de', 'pt', 'ru', 'ja', 'ko', 'zh-CN',
    'ar', 'hi', 'bn', 'id', 'tr', 'vi', 'pl', 'nl', 'th', 'pa',
    'mr', 'te', 'ta', 'zh-HK', 'fa', 'ha', 'ms', 'fil', 'jv', 'gu',
    'am', 'yo', 'kn', 'uk', 'su', 'ml', 'or', 'uz', 'my', 'ig',
    'sd', 'ro', 'sw', 'ne', 'cs', 'el', 'sv', 'hu', 'ur', 'he'
  ];
}

/**
 * Verifica si un locale es válido
 */
export function isValidLocale(locale: string): locale is Locale {
  const validLocales: string[] = [
    'en', 'es', 'it', 'fr', 'de', 'pt', 'ru', 'ja', 'ko', 'zh-CN',
    'ar', 'hi', 'bn', 'id', 'tr', 'vi', 'pl', 'nl', 'th', 'pa',
    'mr', 'te', 'ta', 'zh-HK', 'fa', 'ha', 'ms', 'fil', 'jv', 'gu',
    'am', 'yo', 'kn', 'uk', 'su', 'ml', 'or', 'uz', 'my', 'ig',
    'sd', 'ro', 'sw', 'ne', 'cs', 'el', 'sv', 'hu', 'ur', 'he'
  ];
  return validLocales.includes(locale);
}
