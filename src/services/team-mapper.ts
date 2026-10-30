import { isHexColor } from '@/lib/color';
import type { ColorSwatch, Team, TeamDto } from '@/types/team';

const FALLBACK_PRIMARY = '#006eb7';
const FALLBACK_SECONDARY = '#ffffff';

function initialsOf(name: string) {
  const words = name.split(/\s+/).filter((w) => w.length > 2);
  const letters = (words.length >= 2 ? words : name.split(/\s+/)).map((w) => w[0]);
  return letters.slice(0, 2).join('').toUpperCase();
}

function slug(text: string) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function swatch(raw: { name?: string; hex?: string } | null | undefined, fallback: string): ColorSwatch {
  return isHexColor(raw?.hex) ? { name: raw?.name ?? '', hex: raw.hex } : { name: '', hex: fallback };
}

function yearOf(value: TeamDto['founded']) {
  if (typeof value === 'number') return value;
  const year = parseInt(String(value ?? '').slice(0, 4), 10);
  return Number.isFinite(year) ? year : null;
}

/** Convierte lo que responda la API en un `Team` seguro de pintar: nunca lanza por campos ausentes. */
export function toTeam(dto: TeamDto): Team {
  return {
    id: dto.id ?? slug(dto.name),
    rank: dto.rank ?? null,
    name: dto.name,
    fullName: dto.full_name ?? dto.name,
    shortName: dto.short_name?.trim() || dto.name,
    initials: initialsOf(dto.short_name?.trim() || dto.name),
    city: dto.city ?? '',
    department: dto.department ?? '',
    founded: yearOf(dto.founded),
    stadium: {
      name: dto.stadium?.name ?? '',
      capacity: dto.stadium?.capacity ?? null,
      location: dto.stadium?.location ?? null,
    },
    nicknames: dto.nicknames ?? [],
    colors: {
      primary: swatch(dto.colors?.primary, FALLBACK_PRIMARY),
      secondary: swatch(dto.colors?.secondary, FALLBACK_SECONDARY),
      accent: isHexColor(dto.colors?.accent?.hex) ? swatch(dto.colors?.accent, FALLBACK_SECONDARY) : null,
    },
    crestUrl: dto.crest_url?.startsWith('http') ? dto.crest_url : null,
    website: dto.website ?? null,
    rivals: dto.main_rivals ?? [],
    league: dto.league ?? '',
    theme: dto.theme ?? {},
  };
}
