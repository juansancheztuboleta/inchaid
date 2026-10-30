import { contrast, ensureContrast, INK, mix, PAPER, readableOn, withAlpha } from '../lib/color';
import type { ColorScheme, ThemeTokens } from './tokens';

export type TeamPalette = { primary: string; secondary: string; accent: string | null };

/**
 * Deriva el juego completo de tokens a partir de los colores del club, cuidando el contraste:
 * texto de acento ≥ 4.5:1 sobre el fondo, y el botón de acción elegido entre los colores del
 * club que se distingan del fondo (≥ 3:1).
 */
export function deriveTokens({ primary: P, secondary: S, accent: A }: TeamPalette, scheme: ColorScheme): ThemeTokens {
  const dark = scheme === 'dark';

  const base = dark ? mix(P, '#000000', 0.88) : mix(P, '#ffffff', 0.93);
  const top = dark ? mix(P, '#000000', 0.62) : mix(P, '#ffffff', 0.8);
  const bottom = dark ? mix(P, '#000000', 0.9) : mix(P, '#ffffff', 0.97);
  const readerBg = dark ? mix(P, '#000000', 0.8) : '#ffffff';

  const action =
    [S, A, P].filter((c): c is string => !!c).find((c) => contrast(c, base) >= 3) ??
    ensureContrast(P, base, 3, dark ? 'lighter' : 'darker');
  const onPanel = readableOn(P);

  return {
    background: {
      base,
      top,
      bottom,
      blobA: P,
      blobB: mix(P, '#000000', dark ? 0.3 : 0.35),
      blobC: dark ? mix(P, '#ffffff', 0.25) : '#ffffff',
    },
    text: {
      primary: dark ? PAPER : INK,
      secondary: withAlpha(dark ? PAPER : INK, dark ? 0.74 : 0.72),
      tertiary: withAlpha(dark ? PAPER : INK, 0.56),
      accent: ensureContrast(P, readerBg, 4.5, dark ? 'lighter' : 'darker'),
      onBrand: readableOn(P),
      onAction: readableOn(action),
      onPanel,
      onPanelSoft: withAlpha(onPanel, 0.85),
    },
    surface: {
      glass: dark ? 'rgba(255, 255, 255, 0.09)' : 'rgba(255, 255, 255, 0.55)',
      glassStrong: dark ? withAlpha(mix(P, '#000000', 0.8), 0.72) : 'rgba(255, 255, 255, 0.82)',
      glassBorder: dark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.7)',
      glassShadow: dark ? 'rgba(0, 0, 0, 0.5)' : withAlpha(INK, 0.3),
      glassOpaque: dark ? withAlpha(mix(P, '#000000', 0.8), 0.96) : 'rgba(255, 255, 255, 0.95)',
      line: withAlpha(dark ? PAPER : INK, dark ? 0.12 : 0.1),
      accentSoft: withAlpha(P, dark ? 0.3 : 0.12),
      switchOff: dark ? 'rgba(241, 244, 247, 0.22)' : '#dee2e6',
    },
    brand: {
      primary: P,
      primaryPressed: mix(P, '#000000', 0.25),
      action,
      actionPressed: mix(action, '#000000', 0.2),
    },
    tabBar: {
      activeBackground: P,
      activeContent: readableOn(P),
      inactiveContent: withAlpha(dark ? PAPER : INK, dark ? 0.74 : 0.72),
    },
    panel: { tint: withAlpha(P, 0.9) },
    feedback: {
      danger: dark ? '#ff6b81' : '#bd0a27',
      success: dark ? '#4cc38a' : '#198754',
    },
  };
}
