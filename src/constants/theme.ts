/**
 * Tokens de Payhub (DESIGN.md): Montserrat, Azul Tuboleta, amarillo solo para la acción principal.
 * El modo oscuro deriva de la misma paleta: tinta azulada de fondo y el azul de marca aclarado
 * para que el texto de acento conserve contraste.
 */

import { Platform } from 'react-native';

const brand = {
  blue: '#006eb7',
  blueDeep: '#00548c',
  blueTint50: '#eef6fb',
  blueTint100: '#b2d3e9',
  ink: '#1a171b',
  white: '#ffffff',
  surfaceGray: '#f1f4f7',
  lineGray: '#dee2e6',
  actionYellow: '#ffc107',
  actionAmber: '#f28f15',
  dangerRed: '#bd0a27',
  successGreen: '#198754',
} as const;

export const Colors = {
  light: {
    text: brand.ink,
    textSecondary: 'rgba(26, 23, 27, 0.72)',
    textTertiary: 'rgba(26, 23, 27, 0.56)',
    background: brand.blueTint50,
    backdropTop: brand.blueTint100,
    backdropBottom: brand.white,
    blobA: brand.blue,
    blobB: brand.blueDeep,
    blobC: brand.blueTint100,
    primary: brand.blue,
    primaryPressed: brand.blueDeep,
    onPrimary: brand.white,
    accentText: brand.blue,
    accentSoft: brand.blueTint50,
    action: brand.actionYellow,
    actionPressed: brand.actionAmber,
    onAction: brand.ink,
    danger: brand.dangerRed,
    success: brand.successGreen,
    line: 'rgba(26, 23, 27, 0.10)',
    glassFill: 'rgba(255, 255, 255, 0.55)',
    glassStrongFill: 'rgba(255, 255, 255, 0.82)',
    glassBorder: 'rgba(255, 255, 255, 0.7)',
    glassShadow: 'rgba(26, 23, 27, 0.3)',
    glassOpaque: 'rgba(255, 255, 255, 0.95)',
    switchOff: brand.lineGray,
  },
  dark: {
    text: brand.surfaceGray,
    textSecondary: 'rgba(241, 244, 247, 0.74)',
    textTertiary: 'rgba(241, 244, 247, 0.56)',
    background: '#071420',
    backdropTop: '#0a2a44',
    backdropBottom: '#071420',
    blobA: brand.blue,
    blobB: brand.blueDeep,
    blobC: '#1b6ea8',
    primary: brand.blue,
    primaryPressed: brand.blueDeep,
    onPrimary: brand.white,
    accentText: '#6db8ec',
    accentSoft: 'rgba(0, 110, 183, 0.28)',
    action: brand.actionYellow,
    actionPressed: brand.actionAmber,
    onAction: brand.ink,
    danger: '#ff6b81',
    success: '#4cc38a',
    line: 'rgba(241, 244, 247, 0.12)',
    glassFill: 'rgba(255, 255, 255, 0.09)',
    glassStrongFill: 'rgba(14, 34, 52, 0.72)',
    glassBorder: 'rgba(255, 255, 255, 0.18)',
    glassShadow: 'rgba(0, 0, 0, 0.5)',
    glassOpaque: 'rgba(14, 34, 52, 0.96)',
    switchOff: 'rgba(241, 244, 247, 0.22)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

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
