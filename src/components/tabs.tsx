import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';
import type { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Icon as LucideIcon } from '@/components/icons';
import { colors, fonts } from '@/theme';

type TabOptions = NonNullable<ComponentProps<typeof Tabs>['screenOptions']>;

const BAR_HEIGHT = 64; // taller than the default so icons and labels are easy to hit

// Shared look for the worker and employer tab bars. The phone's own
// navigation bar (bottom inset) is added on top of BAR_HEIGHT.
export function useTabScreenOptions(): TabOptions {
  const insets = useSafeAreaInsets();
  return {
    headerShown: false,
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.inkMuted,
    tabBarStyle: {
      backgroundColor: colors.surface,
      borderTopColor: colors.border,
      height: BAR_HEIGHT + insets.bottom,
      paddingTop: 6,
      paddingBottom: insets.bottom + 6,
    },
    tabBarLabelStyle: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 18 },
    sceneStyle: { backgroundColor: colors.background },
  };
}

export function tabIcon(Icon: LucideIcon) {
  return function TabIcon({ color }: { color: ColorValue }) {
    return <Icon color={color} size={26} strokeWidth={2.25} />;
  };
}
