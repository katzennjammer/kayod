# Kayod

**Kayod para sa pamilya.** A mobile app that connects parents who need income
with people who need work done. Pilot area: Lapu-Lapu City and Cebu.

Android first. Expo SDK 57, React Native, TypeScript, Expo Router.
Backend (coming): Supabase.

## Run it

Needs Node 22.13 or newer.

```bash
npm install
npx expo start          # then press "a" for Android, or scan the QR code with Expo Go
npx expo start --web    # quick look in a browser (not the target platform)
```

## Checks (run before every commit)

```bash
npm run typecheck   # TypeScript, including every t('...') translation key
npm run lint
npm run check:i18n  # en, tl and ceb have the same keys and placeholders
```

## Where things are

```
src/
  app/                 screens; the folder layout is the navigation (Expo Router)
    index.tsx          decides where the app opens: language -> intro -> role -> tabs
    language.tsx       first-launch language picker
    intro.tsx          the five onboarding slides (also "Replay intro" in Settings)
    role.tsx           worker or employer
    worker/            worker tabs: Home, Jobs, Chat, Profile
    employer/          employer tabs: Home, My posts, Chat, Profile
    settings.tsx       language, switch role, replay intro
  components/          shared UI: AppText, Button, Screen, StateView, icons
  components/mascot/   <Mascot id="..."> and the list of mascot images
  features/            code for one feature (onboarding so far)
  i18n/                translations: locales/en.json, tl.json, ceb.json
  lib/prefs.tsx        settings saved on the phone (language, intro done, role)
  theme/               colors, fonts, spacing; the only place for these values
assets/mascots/        mascot images (see the README there)
```

## Rules for this codebase

- **No text in code.** Every string a user sees goes in `src/i18n/locales/*.json`.
  Add the key to all three files. `tl` and `ceb` need native-speaker review;
  list anything uncertain in `src/i18n/REVIEW.md`.
- **No emojis.** Icons come from `src/components/icons.ts` (lucide). Import
  them from there, never from `lucide-react-native` directly: that pulls every
  icon into the app and adds about 2 MB.
- **Colors, sizes and fonts come from `src/theme`.** Never put white text on
  orange (it fails the contrast check outdoors); orange buttons use dark text.
- **Every screen that loads data shows loading, empty and error states** with
  `<StateView>`.
- **Install packages with `npx expo install`**, not `npm install <pkg>`, so
  versions match the Expo SDK.
- **No secrets in the app.** Anything with `EXPO_PUBLIC_` ends up inside the APK.
