import type { DeepPartial, ThemeTokens } from '@/theme/tokens';
import type { Copy } from '@/theme/copy';

export type ColorSwatch = { name: string; hex: string };

export type TeamColors = {
  primary: ColorSwatch;
  secondary: ColorSwatch;
  accent: ColorSwatch | null;
};

/** Personalización de tema que envía la API. Todo es opcional; lo que falte se deriva de `colors`. */
export type TeamTheme = {
  light?: DeepPartial<ThemeTokens>;
  dark?: DeepPartial<ThemeTokens>;
  copy?: DeepPartial<Copy>;
};

/** Modelo de dominio de un equipo, ya normalizado (ver `services/team-mapper.ts`). */
export type Team = {
  id: string;
  rank: number | null;
  name: string;
  fullName: string;
  /** Nombre corto para titulares y textos. */
  shortName: string;
  initials: string;
  city: string;
  department: string;
  /** Año de fundación. */
  founded: number | null;
  stadium: { name: string; capacity: number | null; location: string | null };
  nicknames: string[];
  colors: TeamColors;
  /** URL del escudo; si falta o falla la carga se dibuja un escudo con las iniciales. */
  crestUrl: string | null;
  website: string | null;
  rivals: string[];
  /** Nombre de la liga, si la API lo envía. */
  league: string;
  theme: TeamTheme;
};

type DtoSwatch = { name?: string; hex?: string };

/**
 * Contrato de la API (JSON en snake_case). Ejemplo completo en `data/teams.json`; la guía está
 * en `docs/team-theme-api.md`. Solo `name` y `colors.primary.hex` son imprescindibles.
 *
 *   GET {EXPO_PUBLIC_TEAMS_API_URL}/teams        → { "teams": TeamDto[] }  (o TeamDto[])
 *   GET {EXPO_PUBLIC_TEAMS_API_URL}/teams/:id    → TeamDto
 */
export type TeamDto = {
  id?: string;
  rank?: number;
  name: string;
  full_name?: string;
  short_name?: string;
  city?: string;
  department?: string;
  /** Fecha ISO (`1947-03-07`) o solo el año. */
  founded?: string | number;
  stadium?: { name?: string; capacity?: number; location?: string };
  nicknames?: string[];
  colors?: { primary?: DtoSwatch; secondary?: DtoSwatch; accent?: DtoSwatch | null };
  crest_url?: string | null;
  website?: string | null;
  main_rivals?: string[];
  league?: string;
  theme?: TeamTheme;
};
