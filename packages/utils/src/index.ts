// ==========================================
// Korea Car Import — Shared Utilities
// ==========================================

import { CountryCode } from '@kci/types';

// ---------- Currency ----------

const KRW_TO_USD_RATE = 0.00073; // Approximate rate, should be fetched dynamically

export function krwToUsd(krw: number): number {
  return Math.round(krw * KRW_TO_USD_RATE * 100) / 100;
}

export function usdToKrw(usd: number): number {
  return Math.round(usd / KRW_TO_USD_RATE);
}

export function formatCurrency(amount: number, currency: 'USD' | 'KRW' | 'UZS' = 'USD'): string {
  const formatters: Record<string, Intl.NumberFormat> = {
    USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
    KRW: new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }),
    UZS: new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }),
  };
  return formatters[currency]?.format(amount) ?? `${amount}`;
}

// ---------- Country Helpers ----------

export const COUNTRY_NAMES: Record<CountryCode, string> = {
  [CountryCode.UZ]: "O'zbekiston",
  [CountryCode.KZ]: 'Qozog\'iston',
  [CountryCode.KG]: 'Qirg\'iziston',
  [CountryCode.TJ]: 'Tojikiston',
  [CountryCode.RU]: 'Rossiya',
  [CountryCode.AE]: 'Dubay (BAA)',
};

export function getCountryName(code: CountryCode): string {
  return COUNTRY_NAMES[code] ?? code;
}

// ---------- Car Helpers ----------

export const POPULAR_BRANDS = [
  'Hyundai', 'Kia', 'Genesis', 'Samsung (Renault)', 'SsangYong',
  'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Porsche',
  'Toyota', 'Lexus', 'Honda', 'Nissan', 'Mazda',
  'Chevrolet', 'Ford', 'Tesla', 'Volvo', 'Land Rover',
];

export function getCarTitle(brand: string, model: string, year: number): string {
  return `${year} ${brand} ${model}`;
}

export function formatMileage(km: number): string {
  if (km >= 10000) {
    return `${Math.round(km / 1000)}K km`;
  }
  return `${km.toLocaleString()} km`;
}

export function formatEngineCc(cc: number): string {
  return `${(cc / 1000).toFixed(1)}L`;
}

// ---------- Validation ----------

export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function isValidPhone(phone: string): boolean {
  const re = /^\+?[\d\s-]{9,15}$/;
  return re.test(phone);
}

// ---------- Date Helpers ----------

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function timeAgo(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return 'hozirgina';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} daqiqa oldin`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} soat oldin`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} kun oldin`;
  return formatDate(d);
}

// ---------- Slug / ID Helpers ----------

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ---------- Pagination ----------

export function calculatePagination(total: number, page: number, limit: number) {
  const totalPages = Math.ceil(total / limit);
  const skip = (page - 1) * limit;
  return { totalPages, skip, take: limit };
}
