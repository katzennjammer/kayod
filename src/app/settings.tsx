import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Repeat, RotateCcw } from '@/components/icons';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { LanguageOptions } from '@/components/LanguageOptions';
import { Screen } from '@/components/Screen';
import { isLanguage } from '@/i18n';
import { usePrefs } from '@/lib/prefs';
import { space } from '@/theme';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { role, setLanguage, setRole } = usePrefs();

  const current = isLanguage(i18n.language) ? i18n.language : 'en';
  const other = role === 'employer' ? 'worker' : 'employer';
  const roleName = (r: 'worker' | 'employer') => (r === 'worker' ? t('settings.roleWorker') : t('settings.roleEmployer'));

  const switchRole = () => {
    setRole(other);
    router.dismissAll();
    router.replace(other === 'worker' ? '/worker' : '/employer');
  };

  return (
    <Screen scroll edges={['bottom']}>
      <Section title={t('settings.language')}>
        <LanguageOptions value={current} onChange={setLanguage} />
      </Section>

      {role && (
        <Section title={t('settings.role')}>
          <AppText variant="title" color="primary">
            {roleName(role)}
          </AppText>
          <Button
            label={t('settings.switchTo', { role: roleName(other) })}
            icon={Repeat}
            variant="secondary"
            onPress={switchRole}
          />
        </Section>
      )}

      <Button
        label={t('settings.replayIntro')}
        icon={RotateCcw}
        variant="secondary"
        onPress={() => router.push({ pathname: '/intro', params: { replay: '1' } })}
      />
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText variant="label" color="inkMuted" accessibilityRole="header">
        {title}
      </AppText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: space.md, marginBottom: space.lg },
});
