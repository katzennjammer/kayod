// Makes t('some.key') type-checked against the English file, so a typo or a
// missing key fails `npm run typecheck` instead of showing a raw key on screen.
import 'i18next';
import type en from './locales/en.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: { translation: typeof en };
  }
}
