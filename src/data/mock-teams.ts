import data from '@/data/teams.json';
import type { TeamDto } from '@/types/team';

/**
 * Respuesta de ejemplo con la forma exacta de la API (`GET /teams`), incluidos los tokens de tema
 * y los textos de cada club. Se usa mientras no exista `EXPO_PUBLIC_TEAMS_API_URL`.
 */
export const mockTeamDtos = data.teams as unknown as TeamDto[];
