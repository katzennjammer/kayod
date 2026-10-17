import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { Icon as LucideIcon } from '@/components/icons';
import { AppText } from './AppText';
import { BUTTON_HEIGHT, TAP_MIN, colors, radius, space, type ColorName } from '@/theme';

type Variant = 'primary' | 'accent' | 'secondary';

// Orange buttons use dark text: white on orange fails the contrast check.
const look: Record<Variant, { bg: ColorName; pressed: ColorName; text: ColorName }> = {
  primary: { bg: 'primary', pressed: 'primaryPressed', text: 'white' },
  accent: { bg: 'accent', pressed: 'accentPressed', text: 'ink' },
  secondary: { bg: 'surface', pressed: 'background', text: 'primary' },
};

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: LucideIcon;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({ label, onPress, variant = 'primary', icon: Icon, loading, disabled, style }: ButtonProps) {
  const v = look[variant];
  const inactive = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors[pressed ? v.pressed : v.bg], opacity: disabled ? 0.5 : 1 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors[v.text]} />
      ) : (
        <View style={styles.row}>
          {Icon && <Icon color={colors[v.text]} size={22} strokeWidth={2.5} />}
          <AppText variant="label" color={v.text} style={styles.label}>
            {label}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

type IconButtonProps = {
  icon: LucideIcon;
  label: string; // read by screen readers, since there is no visible text
  onPress: () => void;
  variant?: Variant;
  size?: number;
};

export function IconButton({ icon: Icon, label, onPress, variant = 'primary', size = 60 }: IconButtonProps) {
  const v = look[variant];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={Math.max(0, (TAP_MIN - size) / 2)}
      style={({ pressed }) => [
        styles.round,
        { width: size, height: size, backgroundColor: colors[pressed ? v.pressed : v.bg] },
      ]}
    >
      <Icon color={colors[v.text]} size={size * 0.45} strokeWidth={2.75} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: BUTTON_HEIGHT,
    borderRadius: radius.pill,
    paddingHorizontal: space.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  label: { fontSize: 18 },
  round: { borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
});
