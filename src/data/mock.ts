/** Contenido de muestra: todos los clubes son inventados. */

export type Team = {
  id: string;
  name: string;
  /** Nombre corto para titulares y textos. */
  short: string;
  initials: string;
  city: string;
  venue: string;
};

export const teams: Team[] = [
  { id: 'meridiano', name: 'Atlético Meridiano', short: 'Meridiano', initials: 'AM', city: 'Bogotá', venue: 'Estadio La Cumbre' },
  { id: 'altamar', name: 'Deportivo Altamar', short: 'Altamar', initials: 'DA', city: 'Cartagena', venue: 'Estadio Muralla' },
  { id: 'paramo', name: 'Real Páramo', short: 'Páramo', initials: 'RP', city: 'Tunja', venue: 'Estadio El Frailejón' },
  { id: 'cafetera', name: 'Unión Cafetera', short: 'Cafetera', initials: 'UC', city: 'Manizales', venue: 'Estadio Los Cafetales' },
  { id: 'orilla', name: 'Club Orilla del Sol', short: 'Orilla', initials: 'OS', city: 'Barranquilla', venue: 'Estadio Malecón' },
  { id: 'fenix', name: 'Fénix Andino', short: 'Fénix', initials: 'FA', city: 'Pasto', venue: 'Estadio Volcán' },
  { id: 'valleverde', name: 'Racing Valle Verde', short: 'Valle Verde', initials: 'RV', city: 'Cali', venue: 'Estadio Cañaveral' },
  { id: 'llanero', name: 'Sporting Llanero', short: 'Llanero', initials: 'SL', city: 'Villavicencio', venue: 'Estadio La Sabana' },
];

export const defaultTeam = teams[0];

/** El rival es siempre el siguiente club de la lista, para que cambie con el equipo elegido. */
export function rivalOf(team: Team) {
  const i = teams.findIndex((t) => t.id === team.id);
  return teams[(i + 1) % teams.length];
}

export function nextMatchOf(team: Team) {
  return {
    competition: 'Liga Cumbre · Fecha 12',
    home: team,
    away: rivalOf(team),
    date: 'Sáb 1 nov · 7:30 p. m.',
    venue: `${team.venue}, ${team.city}`,
  };
}

export type Post =
  | { id: string; kind: 'result'; time: string; likes: number; comments: number; text: string; score: { home: number; away: number }; rival: string; scorers: string }
  | { id: string; kind: 'news'; time: string; likes: number; comments: number; title: string; text: string }
  | { id: string; kind: 'lineup'; time: string; likes: number; comments: number; title: string; lines: { role: string; names: string }[] };

export function postsOf(team: Team): Post[] {
  const rival = rivalOf(team);
  const lastRival = teams[(teams.findIndex((t) => t.id === team.id) + 2) % teams.length];

  return [
    {
      id: 'p1',
      kind: 'result',
      time: 'Hace 2 h',
      likes: 1284,
      comments: 96,
      text: `Tres puntos en casa. ${team.venue} sigue siendo nuestro.`,
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
      text: `El delantero de 23 años firmó su nuevo contrato y seguirá vistiendo la 9 de ${team.short}.`,
    },
    {
      id: 'p3',
      kind: 'lineup',
      time: 'Ayer',
      likes: 540,
      comments: 63,
      title: `Alineación probable vs. ${rival.short}`,
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
