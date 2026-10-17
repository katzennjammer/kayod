import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { LanguageOptions } from '@/components/LanguageOptions';
import { Screen } from '@/components/Screen';
import i18n, { isLanguage, deviceLanguage, type Language } from '@/i18n';
import { usePrefs } from '@/lib/prefs';
import { space } from '@/theme';

// The very first screen. It starts on the phone's language when that is one
// of ours, and switches the whole screen live as you tap, so you can see
// the choice before you confirm it.
export default function LanguageScreen() {
  const { t } = useTranslation();
  const { setLanguage } = usePrefs();
  const [choice, setChoice] = useState<Language>(isLanguage(i18n.language) ? i18n.language : deviceLanguage());

  const preview = (lang: Language) => {
    setChoice(lang);
    i18n.changeLanguage(lang);
  };

  const confirm = () => {
    setLanguage(choice);
    router.replace('/intro');
  };

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.header}>
        <AppText variant="display" color="primary">
          {t('language.title')}
        </AppText>
        <AppText variant="bodyLarge" color="inkMuted">
          {t('language.subtitle')}
        </AppText>
      </View>
      <LanguageOptions value={choice} onChange={preview} />
      <View style={styles.spacer} />
      <Button label={t('common.continue')} onPress={confirm} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: space.xxxl },
  header: { gap: space.sm, marginBottom: space.lg },
  spacer: { flex: 1 },
});
