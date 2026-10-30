import { mockTeamDtos } from '@/data/mock-teams';
import { toTeam } from '@/services/team-mapper';
import type { Team, TeamDto } from '@/types/team';

/**
 * Base de la API de equipos. Define `EXPO_PUBLIC_TEAMS_API_URL` (p. ej. en `.env`) para usarla;
 * sin ella la app trabaja con `data/mock-teams.ts`, que tiene la misma forma. El contrato
 * está descrito en `types/team.ts`.
 */
const BASE_URL = process.env.EXPO_PUBLIC_TEAMS_API_URL?.replace(/\/+$/, '');
const TIMEOUT_MS = 10_000;

export const usingMockTeams = !BASE_URL;

export class TeamsApiError extends Error {}

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const timeout = new AbortController();
  const timer = setTimeout(() => timeout.abort(), TIMEOUT_MS);
  signal?.addEventListener('abort', () => timeout.abort());

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { Accept: 'application/json' },
      signal: timeout.signal,
    });
    if (!res.ok) throw new TeamsApiError(`La API respondió ${res.status}`);
    return (await res.json()) as T;
  } catch (e) {
    if (e instanceof TeamsApiError) throw e;
    if (signal?.aborted) throw e;
    throw new TeamsApiError('No se pudo conectar con el servidor de equipos');
  } finally {
    clearTimeout(timer);
  }
}

/** Latencia simulada para que los estados de carga se vean también con datos locales. */
const mockDelay = () => new Promise((resolve) => setTimeout(resolve, 350));

export async function fetchTeams(signal?: AbortSignal): Promise<Team[]> {
  if (usingMockTeams) {
    await mockDelay();
    return mockTeamDtos.map(toTeam);
  }
  const body = await getJson<TeamDto[] | { teams: TeamDto[] }>('/teams', signal);
  const list = Array.isArray(body) ? body : body.teams;
  return list.map(toTeam);
}

export async function fetchTeam(id: string, signal?: AbortSignal): Promise<Team | null> {
  if (usingMockTeams) {
    await mockDelay();
    const dto = mockTeamDtos.find((t) => t.id === id);
    return dto ? toTeam(dto) : null;
  }
  return toTeam(await getJson<TeamDto>(`/teams/${encodeURIComponent(id)}`, signal));
}
