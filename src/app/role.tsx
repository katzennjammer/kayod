import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { ClipboardList, Search, type Icon as LucideIcon } from '@/components/icons';
import { AppText } from '@/components/AppText';
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
        icon={Search}
        title={t('role.workerTitle')}
        body={t('role.workerBody')}
        tint="tintOrange"
        onPress={() => choose('worker')}
      />
      <RoleCard
        icon={ClipboardList}
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
  icon: LucideIcon;
  title: string;
  body: string;
  tint: 'tintOrange' | 'tintBlue';
  onPress: () => void;
};

function RoleCard({ icon: Icon, title, body, tint, onPress }: CardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${body}`}
      style={({ pressed }) => [styles.card, { backgroundColor: colors[tint] }, pressed && styles.pressed]}
    >
      <View style={styles.iconWrap}>
        <Icon color={colors.primary} size={32} strokeWidth={2.5} />
      </View>
      <View style={styles.cardText}>
        <AppText variant="title">{title}</AppText>
        <AppText color="inkMuted">{body}</AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: space.xxxl },
  header: { gap: space.sm, marginBottom: space.md },
  card: {
    borderRadius: radius.lg,
    padding: space.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
    minHeight: 120,
  },
  pressed: { opacity: 0.85 },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: { flex: 1, gap: space.xs },
  note: { marginTop: space.md },
});
