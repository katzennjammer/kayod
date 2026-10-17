import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors, space, type ColorName } from '@/theme';

type Props = {
  children: ReactNode;
  background?: ColorName;
  scroll?: boolean;
  // Tab screens leave out the bottom edge: the tab bar already handles it.
  edges?: Edge[];
  contentStyle?: StyleProp<ViewStyle>;
};

export function Screen({ children, background = 'background', scroll, edges = ['top', 'bottom'], contentStyle }: Props) {
  const bg = { backgroundColor: colors[background] };
  return (
    <SafeAreaView style={[styles.fill, bg]} edges={edges}>
      {scroll ? (
        <ScrollView contentContainerStyle={[styles.content, contentStyle]}>{children}</ScrollView>
      ) : (
        <View style={[styles.fill, styles.content, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { padding: space.xl, gap: space.lg, flexGrow: 1 },
});
