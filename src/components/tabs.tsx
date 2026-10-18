import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';
import type { Tabs } from 'expo-router';

import type { Icon as LucideIcon } from '@/components/icons';
import { TabBar, type TabBarAction } from './TabBar';
import { colors } from '@/theme';

type TabsProps = ComponentProps<typeof Tabs>;

// Shared setup for the worker and employer tabs. `action` adds the round
// button beside the bar.
export function tabsProps(action?: TabBarAction): Pick<TabsProps, 'tabBar' | 'screenOptions'> {
  return {
    tabBar: (props) => <TabBar {...props} action={action} />,
    screenOptions: {
      headerShown: false,
      sceneStyle: { backgroundColor: colors.background },
    },
  };
}

export function tabIcon(Icon: LucideIcon) {
  return function TabIcon({ color, focused }: { color: ColorValue; focused: boolean }) {
    return <Icon color={color} size={24} strokeWidth={focused ? 2.5 : 2} />;
  };
}
