import type { TextStyle } from 'react-native';

// Two families, both SIL Open Font License (free for commercial use):
//   Baloo 2 - rounded and chunky, for headlines; gives Kayod its voice
//   Nunito  - rounded and very readable, for everything else
// Only the weights below are loaded, so the app carries no unused font files.
export const fonts = {
  regular: 'Nunito_400Regular',
  semibold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extrabold: 'Nunito_800ExtraBold',
  display: 'Baloo2_800ExtraBold',
  displayBold: 'Baloo2_700Bold',
} as const;

// The smallest reading size is 16, as the brief requires. Baloo 2 sits high in
// its line box, so its line heights are tighter than Nunito's.
export const textVariants = {
  display: { fontFamily: fonts.display, fontSize: 36, lineHeight: 40 },
  headline: { fontFamily: fonts.display, fontSize: 28, lineHeight: 32 },
  title: { fontFamily: fonts.displayBold, fontSize: 22, lineHeight: 26 },
  cardTitle: { fontFamily: fonts.extrabold, fontSize: 18, lineHeight: 24 },
  bodyLarge: { fontFamily: fonts.regular, fontSize: 18, lineHeight: 26 },
  body: { fontFamily: fonts.regular, fontSize: 17, lineHeight: 24 },
  bodyStrong: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 24 },
  label: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 22 },
  caption: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22 },
  // Only for the tab bar and chip labels, where Material's own size is 14.
  small: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 18 },
} satisfies Record<string, TextStyle>;

export type TextVariant = keyof typeof textVariants;

// Respect the phone's text-size setting, but cap it so layouts do not break
// on very large settings.
export const MAX_FONT_SCALE = 1.6;
