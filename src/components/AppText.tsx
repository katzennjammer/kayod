import { Text, type TextProps } from 'react-native';

import { colors, textVariants, MAX_FONT_SCALE, type ColorName, type TextVariant } from '@/theme';

type Props = TextProps & {
  variant?: TextVariant;
  color?: ColorName;
};

// Use this instead of <Text> so every string gets the brand font, a size
// from the type scale and the font-scale cap.
export function AppText({ variant = 'body', color = 'ink', style, ...rest }: Props) {
  return (
    <Text
      maxFontSizeMultiplier={MAX_FONT_SCALE}
      style={[textVariants[variant], { color: colors[color] }, style]}
      {...rest}
    />
  );
}
