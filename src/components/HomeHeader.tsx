import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Settings } from '@/components/icons';
import { AppText } from './AppText';
import { TAP_MIN, colors, radius } from '@/theme';

// Greeting row at the top of both home screens. The notifications bell is
// added in the milestone that builds notifications.
export function HomeHeader() {
  const { t } = useTranslation();
  return (
    <View style={styles.row}>
      <AppText variant="headline" color="primary" accessibilityRole="header">
        {t('home.greeting')}
      </AppText>
      <Pressable
        onPress={() => router.push('/settings')}
        accessibilityRole="button"
        accessibilityLabel={t('a11y.settings')}
        style={({ pressed }) => [styles.icon, pressed && styles.pressed]}
      >
        <Settings color={colors.ink} size={26} strokeWidth={2.25} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  icon: {
    width: TAP_MIN + 4,
    height: TAP_MIN + 4,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  pressed: { backgroundColor: colors.tintBlue },
});
