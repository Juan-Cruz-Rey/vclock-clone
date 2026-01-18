/**
 * World Clock Logic
 * Manages multiple timezone clocks with city management
 */

import { Storage } from './storage';
import timezonesData from '../data/timezones.json';

export interface City {
  id: string;
  name: string;
  country: string;
  timezone: string;
  utcOffset: string;
  continent: string;
}

export interface UserCity {
  id: string;
  cityId: string;
  order: number;
  addedAt: number;
}

export class WorldClock {
  private userCities: UserCity[] = [];
  private tickInterval: number | null = null;
  private onTickCallback?: (times: Map<string, Date>) => void;

  constructor() {
    this.loadUserCities();
  }

  // City Management
  addCity(cityId: string): boolean {
    const city = this.getCityData(cityId);
    if (!city) return false;

    // Check if already added
    if (this.userCities.some(uc => uc.cityId === cityId)) {
      return false;
    }

    const userCity: UserCity = {
      id: crypto.randomUUID(),
      cityId,
      order: this.userCities.length,
      addedAt: Date.now(),
    };

    this.userCities.push(userCity);
    this.saveUserCities();
    return true;
  }

  removeCity(userCityId: string): boolean {
    const index = this.userCities.findIndex(uc => uc.id === userCityId);
    if (index === -1) return false;

    this.userCities.splice(index, 1);

    // Reorder remaining cities
    this.userCities.forEach((uc, i) => {
      uc.order = i;
    });

    this.saveUserCities();
    return true;
  }

  moveCity(userCityId: string, newOrder: number): boolean {
    const cityIndex = this.userCities.findIndex(uc => uc.id === userCityId);
    if (cityIndex === -1) return false;

    const [city] = this.userCities.splice(cityIndex, 1);
    this.userCities.splice(newOrder, 0, city);

    // Reorder all cities
    this.userCities.forEach((uc, i) => {
      uc.order = i;
    });

    this.saveUserCities();
    return true;
  }

  clearAllCities(): void {
    this.userCities = [];
    this.saveUserCities();
  }

  // Data Access
  getUserCities(): UserCity[] {
    return [...this.userCities].sort((a, b) => a.order - b.order);
  }

  getCityData(cityId: string): City | null {
    const city = timezonesData.find(tz => tz.id === cityId);
    return city || null;
  }

  getAllAvailableCities(): City[] {
    return timezonesData as City[];
  }

  getCitiesByContinent(continent: string): City[] {
    return timezonesData.filter(tz => tz.continent === continent) as City[];
  }

  searchCities(query: string): City[] {
    const lowerQuery = query.toLowerCase();
    return timezonesData.filter(tz =>
      tz.name.toLowerCase().includes(lowerQuery) ||
      tz.country.toLowerCase().includes(lowerQuery)
    ) as City[];
  }

  // Time Calculation
  getTimeInTimezone(timezone: string): Date {
    return new Date(new Date().toLocaleString('en-US', { timeZone: timezone }));
  }

  getAllTimes(): Map<string, Date> {
    const times = new Map<string, Date>();

    for (const userCity of this.userCities) {
      const city = this.getCityData(userCity.cityId);
      if (city) {
        times.set(userCity.id, this.getTimeInTimezone(city.timezone));
      }
    }

    return times;
  }

  getTimeDifference(timezone1: string, timezone2: string): number {
    const time1 = this.getTimeInTimezone(timezone1);
    const time2 = this.getTimeInTimezone(timezone2);
    return time1.getTime() - time2.getTime();
  }

  getOffsetFromLocal(timezone: string): string {
    const localDate = new Date();
    const tzDate = this.getTimeInTimezone(timezone);

    const diffMinutes = Math.round((tzDate.getTime() - localDate.getTime()) / 60000);
    const hours = Math.floor(Math.abs(diffMinutes) / 60);
    const minutes = Math.abs(diffMinutes) % 60;

    const sign = diffMinutes >= 0 ? '+' : '-';
    return `${sign}${hours}${minutes > 0 ? `:${minutes.toString().padStart(2, '0')}` : ''}h`;
  }

  // Ticking
  startTicking(): void {
    this.stopTicking();
    this.tick(); // Initial tick
    this.tickInterval = window.setInterval(() => this.tick(), 1000);
  }

  stopTicking(): void {
    if (this.tickInterval !== null) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  private tick(): void {
    if (this.onTickCallback) {
      this.onTickCallback(this.getAllTimes());
    }
  }

  onTick(callback: (times: Map<string, Date>) => void): void {
    this.onTickCallback = callback;
  }

  // Storage
  private saveUserCities(): void {
    Storage.set('clockSettings', {
      cities: this.userCities.map(uc => ({
        id: uc.id,
        name: this.getCityData(uc.cityId)?.name || '',
        timezone: this.getCityData(uc.cityId)?.timezone || '',
        order: uc.order,
      })),
    });
  }

  private loadUserCities(): void {
    const saved = Storage.getClockSettings();

    if (saved.cities && saved.cities.length > 0) {
      // Convert old format to new format
      this.userCities = saved.cities.map((city, index) => {
        // Find city by timezone
        const cityData = timezonesData.find(tz => tz.timezone === city.timezone);

        return {
          id: city.id,
          cityId: cityData?.id || '',
          order: city.order ?? index,
          addedAt: Date.now(),
        };
      }).filter(uc => uc.cityId !== '');
    } else {
      // Add default cities
      this.addDefaultCities();
    }
  }

  private addDefaultCities(): void {
    const defaultCities = ['new-york', 'london', 'tokyo', 'sydney'];

    for (const cityId of defaultCities) {
      this.addCity(cityId);
    }
  }

  // Utility
  isDaytime(timezone: string): boolean {
    const date = this.getTimeInTimezone(timezone);
    const hours = date.getHours();
    return hours >= 6 && hours < 18;
  }

  getRelativeTimeDescription(timezone: string, locale: string = 'en'): string {
    const date = this.getTimeInTimezone(timezone);
    const hours = date.getHours();

    const descriptions: Record<string, Record<number, string>> = {
      en: {
        0: 'Midnight',
        1: 'Late Night',
        2: 'Late Night',
        3: 'Late Night',
        4: 'Early Morning',
        5: 'Early Morning',
        6: 'Morning',
        7: 'Morning',
        8: 'Morning',
        9: 'Morning',
        10: 'Late Morning',
        11: 'Late Morning',
        12: 'Noon',
        13: 'Afternoon',
        14: 'Afternoon',
        15: 'Afternoon',
        16: 'Late Afternoon',
        17: 'Late Afternoon',
        18: 'Evening',
        19: 'Evening',
        20: 'Night',
        21: 'Night',
        22: 'Night',
        23: 'Late Night',
      },
      es: {
        0: 'Medianoche',
        1: 'Madrugada',
        2: 'Madrugada',
        3: 'Madrugada',
        4: 'Madrugada',
        5: 'Madrugada',
        6: 'Mañana',
        7: 'Mañana',
        8: 'Mañana',
        9: 'Mañana',
        10: 'Media Mañana',
        11: 'Media Mañana',
        12: 'Mediodía',
        13: 'Tarde',
        14: 'Tarde',
        15: 'Tarde',
        16: 'Tarde',
        17: 'Tarde',
        18: 'Noche',
        19: 'Noche',
        20: 'Noche',
        21: 'Noche',
        22: 'Noche',
        23: 'Noche',
      },
      it: {
        0: 'Mezzanotte',
        1: 'Notte Fonda',
        2: 'Notte Fonda',
        3: 'Notte Fonda',
        4: 'Prima Mattina',
        5: 'Prima Mattina',
        6: 'Mattina',
        7: 'Mattina',
        8: 'Mattina',
        9: 'Mattina',
        10: 'Tarda Mattina',
        11: 'Tarda Mattina',
        12: 'Mezzogiorno',
        13: 'Pomeriggio',
        14: 'Pomeriggio',
        15: 'Pomeriggio',
        16: 'Tardo Pomeriggio',
        17: 'Tardo Pomeriggio',
        18: 'Sera',
        19: 'Sera',
        20: 'Notte',
        21: 'Notte',
        22: 'Notte',
        23: 'Notte',
      },
    };

    return descriptions[locale]?.[hours] || descriptions['en'][hours];
  }

  // Cleanup
  destroy(): void {
    this.stopTicking();
    this.onTickCallback = undefined;
  }
}

// Utility functions
export function formatTime(date: Date, format: 12 | 24 = 12): string {
  if (format === 24) {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } else {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }
}

export function formatDate(date: Date, locale: string = 'en'): string {
  return date.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getTimezoneOffset(timezone: string): string {
  const date = new Date();
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));

  const offsetMinutes = Math.round((tzDate.getTime() - utcDate.getTime()) / 60000);
  const hours = Math.floor(Math.abs(offsetMinutes) / 60);
  const minutes = Math.abs(offsetMinutes) % 60;

  const sign = offsetMinutes >= 0 ? '+' : '-';
  return `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function getContinents(): string[] {
  const continents = new Set(timezonesData.map(tz => tz.continent));
  return Array.from(continents).sort();
}
