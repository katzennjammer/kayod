import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ChevronRight } from '@/components/icons';
import { AppText } from '@/components/AppText';
import { colors, space } from '@/theme';

type Props = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: { label: string; onPress: () => void };
  children: ReactNode;
};

// A titled block on the home screen, with an optional "See all" link.
export function Section({ title, subtitle, icon, action, children }: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        {icon}
        <View style={styles.titles}>
          <AppText variant="title" accessibilityRole="header">
            {title}
          </AppText>
          {subtitle && (
            <AppText variant="caption" color="inkMuted">
              {subtitle}
            </AppText>
          )}
        </View>
        {action && (
          <Pressable onPress={action.onPress} accessibilityRole="link" hitSlop={10} style={styles.action}>
            <AppText variant="label" color="primary">
              {action.label}
            </AppText>
            <ChevronRight color={colors.primary} size={18} strokeWidth={2.5} />
          </Pressable>
        )}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: space.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.xl },
  titles: { flex: 1 },
  action: { flexDirection: 'row', alignItems: 'center', minHeight: 44 },
});
