/** Contenido de muestra del feed. Cuando exista API de feed, sustituye estas funciones. */

import { mockTeamDtos } from '@/data/mock-teams';
import { toTeam } from '@/services/team-mapper';
import type { Team } from '@/types/team';

const pool = mockTeamDtos.map(toTeam);

export const defaultTeam = pool[0];

/** Primer rival declarado que esté en el grupo; si no, el siguiente club de la lista. */
function rivalOf(team: Team) {
  const named = team.rivals.map((name) => pool.find((t) => t.name === name)).find(Boolean);
  if (named) return named;
  const i = pool.findIndex((t) => t.id === team.id);
  return pool[(Math.max(i, 0) + 1) % pool.length];
}

function otherOpponent(team: Team, avoid: Team) {
  return pool.find((t) => t.id !== team.id && t.id !== avoid.id) ?? avoid;
}

export function nextMatchOf(team: Team) {
  return {
    competition: `${team.league || 'Liga'} · Fecha 12`,
    home: team,
    away: rivalOf(team),
    date: 'Sáb 1 nov · 7:30 p. m.',
    venue: [team.stadium.name, team.city].filter(Boolean).join(', '),
  };
}

export type Post =
  | { id: string; kind: 'result'; time: string; likes: number; comments: number; text: string; score: { home: number; away: number }; rival: string; scorers: string }
  | { id: string; kind: 'news'; time: string; likes: number; comments: number; title: string; text: string }
  | { id: string; kind: 'lineup'; time: string; likes: number; comments: number; title: string; lines: { role: string; names: string }[] };

export function postsOf(team: Team): Post[] {
  const rival = rivalOf(team);
  const lastRival = otherOpponent(team, rival);

  return [
    {
      id: 'p1',
      kind: 'result',
      time: 'Hace 2 h',
      likes: 1284,
      comments: 96,
      text: team.stadium.name ? `Tres puntos en casa. ${team.stadium.name} sigue siendo nuestro.` : 'Tres puntos en casa.',
      score: { home: 2, away: 1 },
      rival: lastRival.name,
      scorers: 'Ríos 34’ · Cadavid 78’',
    },
    {
      id: 'p2',
      kind: 'news',
      time: 'Hace 5 h',
      likes: 862,
      comments: 41,
      title: 'Mateo Ríos renueva hasta 2028',
      text: `El delantero de 23 años firmó su nuevo contrato y seguirá vistiendo la 9 de ${team.shortName}.`,
    },
    {
      id: 'p3',
      kind: 'lineup',
      time: 'Ayer',
      likes: 540,
      comments: 63,
      title: `Alineación probable vs. ${rival.shortName}`,
      lines: [
        { role: 'Arquero', names: 'Salcedo' },
        { role: 'Defensa', names: 'Pardo, Quintero, Mejía, Lozano' },
        { role: 'Medio', names: 'Cadavid, Beltrán, Ospina' },
        { role: 'Ataque', names: 'Ríos, Duarte, Vélez' },
      ],
    },
    {
      id: 'p4',
      kind: 'news',
      time: 'Ayer',
      likes: 312,
      comments: 18,
      title: 'Entrenamiento abierto el jueves',
      text: 'Las puertas de la sede deportiva abren a las 4:00 p. m. para socios con boleta vigente.',
    },
  ];
}
