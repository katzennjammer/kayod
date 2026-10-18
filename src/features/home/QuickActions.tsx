import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import type { Icon } from '@/components/icons';
import { AppText } from '@/components/AppText';
import { colors, radius, space } from '@/theme';

export type QuickAction = {
  key: string;
  label: string;
  icon: Icon;
  // Missing until that feature's milestone; the tile still shows so the
  // layout can be reviewed, but does nothing when tapped.
  onPress?: () => void;
};

// A row of square icon tiles with labels underneath, like the shortcut rows
// in GCash and Grab that Filipino users already know.
export function QuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {actions.map(({ key, label, icon: IconComponent, onPress }) => (
        <Pressable
          key={key}
          onPress={onPress}
          disabled={!onPress}
          accessibilityRole="button"
          accessibilityLabel={label}
          style={styles.item}
        >
          {({ pressed }) => (
            <>
              <View style={[styles.tile, pressed && styles.tilePressed]}>
                <IconComponent color={colors.primary} size={26} strokeWidth={2.25} />
              </View>
              <AppText variant="small" numberOfLines={2} style={styles.label}>
                {label}
              </AppText>
            </>
          )}
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: space.xl, gap: space.sm },
  item: { width: 88, alignItems: 'center', gap: space.sm },
  tile: {
    width: 62,
    height: 62,
    borderRadius: radius.md + 2,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tilePressed: { backgroundColor: colors.primaryContainer },
  label: { textAlign: 'center', color: colors.ink },
});
