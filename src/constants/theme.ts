/**
 * Tokens que no cambian con el equipo: tipografía, espaciado y radios. Los colores viven en
 * `theme/` y se resuelven por equipo (ver `hooks/use-theme.ts`).
 */

import { Platform } from 'react-native';

/** Una sola familia; el escalón lo marca el peso. En nativo el peso se elige por familia. */
export const Fonts = {
  regular: 'Montserrat_400Regular',
  semibold: 'Montserrat_600SemiBold',
  bold: 'Montserrat_700Bold',
  extrabold: 'Montserrat_800ExtraBold',
} as const;

export const Spacing = {
  half: 4,
  one: 8,
  two: 12,
  three: 16,
  four: 24,
  five: 32,
  six: 40,
  seven: 56,
} as const;

export const Radius = {
  control: 6,
  card: 12,
  panel: 16,
  sheet: 24,
  full: 9999,
} as const;

export const MaxContentWidth = 640;
export const TabBarHeight = 68;
export const TabBarGap = Platform.select({ ios: 4, default: 12 });
