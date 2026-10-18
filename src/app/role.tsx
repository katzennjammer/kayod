import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { ArrowRight } from '@/components/icons';
import { AppText } from '@/components/AppText';
import { Mascot } from '@/components/mascot/Mascot';
import type { MascotId } from '@/components/mascot/registry';
import { Screen } from '@/components/Screen';
import { usePrefs, type Role } from '@/lib/prefs';
import { colors, radius, space } from '@/theme';

// Choose worker or employer. No account is needed yet: the user browses as a
// guest and is asked for a phone number only when they apply, post or message.
export default function RoleScreen() {
  const { t } = useTranslation();
  const { setRole } = usePrefs();

  const choose = (role: Role) => {
    setRole(role);
    router.replace(role === 'worker' ? '/worker' : '/employer');
  };

  return (
    <Screen scroll contentStyle={styles.content}>
      <View style={styles.header}>
        <AppText variant="display" color="primary" accessibilityRole="header">
          {t('role.title')}
        </AppText>
        <AppText variant="bodyLarge" color="inkMuted">
          {t('role.subtitle')}
        </AppText>
      </View>

      <RoleCard
        mascot="male_construction_hammer"
        title={t('role.workerTitle')}
        body={t('role.workerBody')}
        tint="tintOrange"
        onPress={() => choose('worker')}
      />
      <RoleCard
        mascot="female_neutral_phone"
        title={t('role.employerTitle')}
        body={t('role.employerBody')}
        tint="tintBlue"
        onPress={() => choose('employer')}
      />

      <AppText color="inkMuted" style={styles.note}>
        {t('role.guestNote')}
      </AppText>
    </Screen>
  );
}

type CardProps = {
  mascot: MascotId;
  title: string;
  body: string;
  tint: 'tintOrange' | 'tintBlue';
  onPress: () => void;
};

function RoleCard({ mascot, title, body, tint, onPress }: CardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${body}`}
      style={({ pressed }) => [styles.card, { backgroundColor: colors[tint] }, pressed && styles.pressed]}
    >
      <Mascot id={mascot} crop="portrait" style={styles.avatar} />
      <View style={styles.cardText}>
        <AppText variant="title">{title}</AppText>
        <AppText color="inkMuted">{body}</AppText>
      </View>
      <View style={styles.go}>
        <ArrowRight color={colors.white} size={22} strokeWidth={2.75} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: space.xxxl },
  header: { gap: space.sm, marginBottom: space.md },
  card: {
    borderRadius: radius.lg,
    padding: space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    minHeight: 120,
  },
  pressed: { opacity: 0.85 },
  avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.white },
  go: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: { flex: 1, gap: space.xs },
  note: { marginTop: space.md },
});
