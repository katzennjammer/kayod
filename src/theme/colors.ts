// Brand palette. Values are the brief's approximations; replace them with the
// exact values sampled from the final logo file when it arrives.
//
// Contrast notes (WCAG ratio, 4.5 is the minimum for normal text):
//   white on primary            8.3  - fine for buttons and headers
//   white on accent (orange)    2.7  - FAILS. Never put white text on orange.
//   ink on accent               5.7  - so orange buttons use ink text
//   inkMuted on every tint      4.9+ - subtitles are readable on all slides
// Orange is for fills and shapes only, never for text on a light background.
// Green is intentionally absent: it belongs to another brand.

export const colors = {
  primary: '#1B4F8A',
  primaryPressed: '#153E6C',
  accent: '#F47B20',
  accentPressed: '#D9691A',
  white: '#FFFFFF',

  ink: '#1E2430',
  inkMuted: '#5B6472',
  background: '#F4F6F8',
  surface: '#FFFFFF',
  border: '#DDE2E8',
  danger: '#B42318',

  tintOrange: '#FDEBDC',
  tintBlue: '#E3EDF8',
  tintYellow: '#FFF4CC',
  tintCoral: '#FDE3DD',

  // Slightly deeper versions of the tints, for decorative shapes behind mascots.
  shapeOrange: '#FAD3B3',
  shapeBlue: '#C9DBF0',
  shapeYellow: '#FFE89A',
  shapeCoral: '#F9C7BC',

  placeholder: '#E9EDF2',
} as const;

export type ColorName = keyof typeof colors;
