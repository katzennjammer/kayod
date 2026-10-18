import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Plus } from '@/components/icons';
import { AppText } from './AppText';
import { colors, fonts, radius, space } from '@/theme';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

const BAR_HEIGHT = 68;
const GAP_BELOW = 12;

export type TabBarAction = { label: string; onPress: () => void };

// A floating bottom bar: a white pill holding the tabs, the current tab
// highlighted, and an optional round action button beside it (employers get
// "Post a job"). Labels are always shown: research on low-literacy users
// finds icon-only navigation hard to learn.
export function TabBar({ state, descriptors, navigation, action }: TabBarProps & { action?: TabBarAction }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { bottom: insets.bottom + GAP_BELOW }]} pointerEvents="box-none">
      <View style={styles.bar} accessibilityRole="tablist">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const label = options.title ?? route.name;
          const color = focused ? colors.primary : colors.inkMuted;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={label}
              style={[styles.item, focused && styles.itemActive]}
            >
              {options.tabBarIcon?.({ focused, color, size: 24 })}
              <AppText
                variant="small"
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
                style={[styles.label, { color, fontFamily: focused ? fonts.extrabold : fonts.semibold }]}
              >
                {label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {action && (
        <Pressable
          onPress={action.onPress}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          style={({ pressed }) => [styles.action, pressed && { backgroundColor: colors.accentPressed }]}
        >
          <Plus color={colors.ink} size={30} strokeWidth={2.75} />
        </Pressable>
      )}
    </View>
  );
}

// Space a scrolling tab screen must leave at its bottom so the last item can
// scroll clear of the floating bar.
export function useTabBarClearance() {
  const insets = useSafeAreaInsets();
  return insets.bottom + GAP_BELOW + BAR_HEIGHT + space.xl;
}

const lift = {
  shadowColor: '#1E2430',
  shadowOpacity: 0.12,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 6 },
  elevation: 6,
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: space.lg,
    right: space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  bar: {
    flex: 1,
    height: BAR_HEIGHT,
    flexDirection: 'row',
    padding: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    ...lift,
  },
  item: {
    flex: 1,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: 2,
  },
  itemActive: { backgroundColor: colors.primaryContainer },
  label: { textAlign: 'center' },
  action: {
    width: BAR_HEIGHT,
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...lift,
  },
});
