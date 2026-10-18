import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { Bell, Settings, X } from '@/components/icons';
import { AppText } from '@/components/AppText';
import { Mascot } from '@/components/mascot/Mascot';
import type { MascotId } from '@/components/mascot/registry';
import { Wordmark } from '@/components/Wordmark';
import { isLanguage } from '@/i18n';
import { formatLongDate, greetingKey } from '@/features/jobs/format';
import { TAP_MIN, colors, radius, space } from '@/theme';

type Props = {
  mascot: MascotId;
  // One short, useful message tied to something real, or null for none.
  // The brief: never nag, and show nothing when there is nothing to say.
  message: string | null;
};

// Top of both home screens: brand row, date, greeting, and the guide mascot
// with its speech bubble, over a soft painted landscape.
export function HomeHero({ mascot, message }: Props) {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const [dismissed, setDismissed] = useState(false);
  const language = isLanguage(i18n.language) ? i18n.language : 'en';
  const showBubble = message !== null && !dismissed;

  return (
    <View style={[styles.hero, { paddingTop: insets.top + space.sm }]}>
      <Landscape />

      <View style={styles.topRow}>
        <Wordmark size={30} />
        <View style={styles.iconGroup}>
          {/* Notifications arrive with milestone 4; the bell is in place for the layout. */}
          <RoundIcon label={t('a11y.notifications')} onPress={() => {}}>
            <Bell color={colors.ink} size={22} strokeWidth={2.25} />
          </RoundIcon>
          <RoundIcon label={t('a11y.settings')} onPress={() => router.push('/settings')}>
            <Settings color={colors.ink} size={22} strokeWidth={2.25} />
          </RoundIcon>
        </View>
      </View>

      <View style={styles.greeting}>
        <AppText variant="label" color="inkMuted" style={styles.date}>
          {formatLongDate(language, new Date()).toUpperCase()}
        </AppText>
        <AppText variant="display" color="ink" accessibilityRole="header">
          {t(greetingKey())}
        </AppText>
      </View>

      <View style={styles.guideRow}>
        <Mascot id={mascot} crop="portrait" style={styles.mascot} />
        {showBubble && (
          <View style={styles.bubble} accessibilityLiveRegion="polite">
            <View style={styles.tail} />
            <AppText variant="bodyStrong" style={styles.bubbleText}>
              {message}
            </AppText>
            <Pressable
              onPress={() => setDismissed(true)}
              accessibilityRole="button"
              accessibilityLabel={t('home.dismiss')}
              hitSlop={12}
              style={styles.close}
            >
              <X color={colors.inkMuted} size={18} strokeWidth={2.5} />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

function RoundIcon({ label, onPress, children }: { label: string; onPress: () => void; children: React.ReactNode }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.roundIcon, pressed && styles.roundIconPressed]}
    >
      {children}
    </Pressable>
  );
}

// Rolling hills and a morning sun in brand tints: a nod to the Cebu
// countryside without needing a separate illustration file.
function Landscape() {
  return (
    <Svg style={styles.landscape} viewBox="0 0 360 200" preserveAspectRatio="none">
      <Circle cx="300" cy="70" r="34" fill={colors.shapeOrange} />
      <Path d="M0 120 C 70 80, 140 90, 210 115 S 320 95, 360 85 L 360 200 L 0 200 Z" fill={colors.shapeBlue} />
      <Path d="M0 160 C 90 120, 170 140, 250 150 S 330 130, 360 135 L 360 200 L 0 200 Z" fill={colors.primaryContainer} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.tintBlue,
    paddingHorizontal: space.xl,
    overflow: 'hidden',
  },
  landscape: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 200 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconGroup: {
    flexDirection: 'row',
    gap: space.xs,
    padding: space.xs,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  roundIcon: {
    width: TAP_MIN,
    height: TAP_MIN,
    borderRadius: TAP_MIN / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundIconPressed: { backgroundColor: colors.white },
  greeting: { marginTop: space.xl, gap: space.xs },
  date: { letterSpacing: 0.8 },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: space.md,
    // the sheet below overlaps the hero by 28; leave room so the bubble stays clear
    paddingBottom: 28 + space.md,
    minHeight: 170,
  },
  mascot: { width: 132, height: 158, marginLeft: -space.md, marginBottom: -(28 + space.md) },
  bubble: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: space.lg,
    paddingLeft: space.lg,
    paddingRight: space.xxl,
    marginBottom: space.lg,
  },
  tail: {
    position: 'absolute',
    left: -7,
    bottom: 22,
    width: 16,
    height: 16,
    backgroundColor: colors.surface,
    transform: [{ rotate: '45deg' }],
    borderRadius: 3,
  },
  bubbleText: { fontSize: 16, lineHeight: 22 },
  close: { position: 'absolute', top: space.md, right: space.md },
});
