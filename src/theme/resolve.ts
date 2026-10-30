import { deriveTokens } from './derive';
import { defaultCopy, type Copy } from './copy';
import { flattenTokens, mergeTokens, type ColorScheme, type ThemeColors } from './tokens';
import type { Team } from '@/types/team';

const cache = new WeakMap<Team, Partial<Record<ColorScheme, ThemeColors>>>();

/**
 * Tokens del equipo para un esquema: lo que derive de sus colores, con encima lo que la API
 * haya enviado en `theme.light` / `theme.dark`. El resultado se memoriza por equipo.
 */
export function resolveTheme(team: Team, scheme: ColorScheme): ThemeColors {
  const entry = cache.get(team) ?? {};
  const hit = entry[scheme];
  if (hit) return hit;

  const { primary, secondary, accent } = team.colors;
  const derived = deriveTokens(
    { primary: primary.hex, secondary: secondary.hex, accent: accent?.hex ?? null },
    scheme
  );
  const colors = flattenTokens(mergeTokens(derived, team.theme[scheme]));

  cache.set(team, { ...entry, [scheme]: colors });
  return colors;
}

export function resolveCopy(team: Team): Copy {
  return mergeTokens(defaultCopy, team.theme.copy);
}
