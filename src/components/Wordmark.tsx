import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme';

// The brand name is a logo, not UI copy, so it is the same in every language.
export const BRAND_NAME = 'Kayod';

type Props = {
  size?: number;
  tone?: 'brand' | 'onPrimary'; // blue letters on light screens, white on the blue header
};

// PLACEHOLDER wordmark, built from text until the final SVG logo arrives:
// "Kayod" in a bold rounded face with the "o" drawn as an orange ring, as the
// brief describes. Swap this component's insides for the SVG; callers stay.
export function Wordmark({ size = 28, tone = 'brand' }: Props) {
  const letter = { fontFamily: fonts.display, fontSize: size, lineHeight: size * 1.15 };
  const color = tone === 'brand' ? colors.primary : colors.white;
  const ring = size * 0.5;

  return (
    <View style={styles.row} accessible accessibilityRole="image" accessibilityLabel={BRAND_NAME}>
      <Text style={[letter, { color }]} allowFontScaling={false}>
        Kay
      </Text>
      <View
        style={{
          width: ring,
          height: ring,
          borderRadius: ring / 2,
          borderWidth: ring * 0.3,
          borderColor: colors.accent,
          marginHorizontal: size * 0.04,
          marginBottom: size * 0.2,
        }}
      />
      <Text style={[letter, { color }]} allowFontScaling={false}>
        d
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end' },
});
