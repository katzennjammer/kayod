import type { TextStyle } from 'react-native';

// Nunito (SIL Open Font License, free for commercial use). Only the weights
// below are loaded, so the app does not carry font files it never uses.
export const fonts = {
  regular: 'Nunito_400Regular',
  semibold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extrabold: 'Nunito_800ExtraBold',
  black: 'Nunito_900Black',
} as const;

// The smallest size is 16, as the brief requires for body text. Users can
// still enlarge text in Android settings; see MAX_FONT_SCALE.
export const textVariants = {
  display: { fontFamily: fonts.black, fontSize: 34, lineHeight: 40 },
  headline: { fontFamily: fonts.extrabold, fontSize: 26, lineHeight: 32 },
  title: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 26 },
  bodyLarge: { fontFamily: fonts.regular, fontSize: 18, lineHeight: 26 },
  body: { fontFamily: fonts.regular, fontSize: 17, lineHeight: 25 },
  bodyStrong: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 25 },
  label: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 22 },
  caption: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22 },
} satisfies Record<string, TextStyle>;

export type TextVariant = keyof typeof textVariants;

// Respect the phone's text-size setting, but cap it so layouts do not break
// on very large settings.
export const MAX_FONT_SCALE = 1.6;
