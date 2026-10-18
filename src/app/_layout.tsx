import '@/i18n'; // sets up translations before any screen renders

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useFonts } from 'expo-font';
// One import per weight: the packages' main entry would bundle every weight
// and italic (22 font files, several MB) instead of the 6 the app uses.
import { Nunito_400Regular } from '@expo-google-fonts/nunito/400Regular';
import { Nunito_600SemiBold } from '@expo-google-fonts/nunito/600SemiBold';
import { Nunito_700Bold } from '@expo-google-fonts/nunito/700Bold';
import { Nunito_800ExtraBold } from '@expo-google-fonts/nunito/800ExtraBold';
import { Baloo2_700Bold } from '@expo-google-fonts/baloo-2/700Bold';
import { Baloo2_800ExtraBold } from '@expo-google-fonts/baloo-2/800ExtraBold';

import { PrefsProvider, usePrefs } from '@/lib/prefs';
import { colors, fonts } from '@/theme';

// Keep the splash screen up until fonts and saved settings are loaded, so
// the first screen never flashes in the wrong language or font.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Fonts load at runtime so they also work in Expo Go during development.
  // If a font fails to load the app falls back to the system font.
  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Baloo2_700Bold,
    Baloo2_800ExtraBold,
  });

  return (
    <SafeAreaProvider>
      <PrefsProvider>
        <StatusBar style="dark" />
        <AppStack fontsReady={fontsLoaded || !!fontError} />
      </PrefsProvider>
    </SafeAreaProvider>
  );
}

function AppStack({ fontsReady }: { fontsReady: boolean }) {
  const { ready } = usePrefs();
  const { t } = useTranslation();
  const loaded = fontsReady && ready;

  useEffect(() => {
    if (loaded) SplashScreen.hide();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        headerTitleStyle: { fontFamily: fonts.displayBold, fontSize: 22, color: colors.ink },
        headerTintColor: colors.primary,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="intro" options={{ animation: 'fade' }} />
      <Stack.Screen name="settings" options={{ headerShown: true, title: t('settings.title') }} />
    </Stack>
  );
}
