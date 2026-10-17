import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import en from './locales/en.json';
import tl from './locales/tl.json';
import ceb from './locales/ceb.json';

export const LANGUAGES = ['en', 'tl', 'ceb'] as const;
export type Language = (typeof LANGUAGES)[number];

// Each language is shown by its own name, so people can find theirs whatever
// the app is currently set to. These are names, not UI copy, so they are not
// translated and do not live in the locale files.
export const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  tl: 'Tagalog',
  ceb: 'Cebuano (Bisaya)',
};

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (LANGUAGES as readonly string[]).includes(value);
}

// Android reports Filipino as "fil" and sometimes Tagalog as "tl".
// Cebuano is "ceb" where the phone supports it, which many do not.
export function deviceLanguage(): Language {
  const code = getLocales()[0]?.languageCode ?? 'en';
  if (code === 'fil' || code === 'tl') return 'tl';
  if (code === 'ceb') return 'ceb';
  return 'en';
}

export const resources = {
  en: { translation: en },
  tl: { translation: tl },
  ceb: { translation: ceb },
} as const;

const i18n = createInstance();

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLanguage(),
  fallbackLng: 'en',
  supportedLngs: LANGUAGES,
  interpolation: { escapeValue: false }, // React already escapes text
  returnNull: false,
  initAsync: false, // resources are bundled, so set up right away, before the first render
});

export default i18n;
