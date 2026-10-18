import type { TFunction } from 'i18next';

import type { Language } from '@/i18n';
import type { PayUnit } from './types';

// Locale codes for dates. Phones may not have Cebuano date names; then the
// date falls back to English, which most Cebuano speakers read daily anyway.
const DATE_LOCALE: Record<Language, string[]> = {
  en: ['en-PH'],
  tl: ['fil-PH', 'en-PH'],
  ceb: ['ceb-PH', 'en-PH'],
};

function format(language: Language, date: Date, options: Intl.DateTimeFormatOptions): string {
  try {
    return new Intl.DateTimeFormat(DATE_LOCALE[language], options).format(date);
  } catch {
    return new Intl.DateTimeFormat('en-PH', options).format(date);
  }
}

export const formatLongDate = (language: Language, date: Date) =>
  format(language, date, { weekday: 'long', month: 'long', day: 'numeric' });

export const formatMonthShort = (language: Language, date: Date) =>
  format(language, date, { month: 'short' }).replace('.', '');

// Times stay in the familiar "8:00 AM" form in every language.
export const formatTime = (date: Date) =>
  new Intl.DateTimeFormat('en-PH', { hour: 'numeric', minute: '2-digit' }).format(date);

export function formatPay(amount: number, unit: PayUnit, t: TFunction): string {
  const unitLabel = unit === 'per_day' ? t('job.perDay') : unit === 'per_hour' ? t('job.perHour') : t('job.perJob');
  return `₱${amount.toLocaleString('en-PH')}${unitLabel}`;
}

export function dayLabel(date: Date, t: TFunction, language: Language): string {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  if (date.toDateString() === today.toDateString()) return t('job.today');
  if (date.toDateString() === tomorrow.toDateString()) return t('job.tomorrow');
  return format(language, date, { weekday: 'short' });
}

export function greetingKey(now = new Date()) {
  const h = now.getHours();
  if (h < 12) return 'home.greetingMorning' as const;
  if (h < 18) return 'home.greetingAfternoon' as const;
  return 'home.greetingEvening' as const;
}
