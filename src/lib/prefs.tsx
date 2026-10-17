import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import i18n, { isLanguage, type Language } from '@/i18n';

// Settings kept on the phone only. Nothing here is private: it is the same
// for a guest and for a signed-in user, and it must work before sign-in.
export type Role = 'worker' | 'employer';

type Prefs = {
  language: Language | null; // null until the user has picked one
  onboardingDone: boolean;
  role: Role | null;
};

type PrefsContext = Prefs & {
  ready: boolean;
  setLanguage: (language: Language) => void;
  setOnboardingDone: () => void;
  setRole: (role: Role) => void;
};

const KEY = 'kayod.prefs.v1';
const DEFAULTS: Prefs = { language: null, onboardingDone: false, role: null };

const Ctx = createContext<PrefsContext | null>(null);

function parse(raw: string | null): Prefs {
  if (!raw) return DEFAULTS;
  try {
    const value = JSON.parse(raw) as Partial<Prefs>;
    return {
      language: isLanguage(value.language) ? value.language : null,
      onboardingDone: value.onboardingDone === true,
      role: value.role === 'worker' || value.role === 'employer' ? value.role : null,
    };
  } catch {
    return DEFAULTS; // a corrupt value just means starting fresh
  }
}

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .catch(() => null)
      .then((raw) => {
        const loaded = parse(raw);
        if (loaded.language) i18n.changeLanguage(loaded.language);
        setPrefs(loaded);
        setReady(true);
      });
  }, []);

  const update = useCallback((patch: Partial<Prefs>) => {
    setPrefs((current) => {
      const next = { ...current, ...patch };
      // Saving can fail (full storage); the app keeps working for this session.
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const value = useMemo<PrefsContext>(
    () => ({
      ...prefs,
      ready,
      setLanguage: (language) => {
        i18n.changeLanguage(language);
        update({ language });
      },
      setOnboardingDone: () => update({ onboardingDone: true }),
      setRole: (role) => update({ role }),
    }),
    [prefs, ready, update],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePrefs() {
  const value = useContext(Ctx);
  if (!value) throw new Error('usePrefs must be used inside <PrefsProvider>');
  return value;
}
