/**
 * Textos personalizables por equipo. Cada club puede reemplazar cualquiera desde la API
 * (`theme.copy`); lo que no envíe usa estos valores. Marcadores: `{short}` (nombre corto
 * del club), `{team}` (nombre completo).
 */
export type Copy = {
  tabs: { feed: string; wallet: string; settings: string };
  feed: { title: string; sectionTitle: string; buyTickets: string };
  wallet: {
    title: string;
    signInTitle: string;
    signInHint: string;
    signIn: string;
    errorTitle: string;
    retry: string;
    unavailable: string;
  };
  settings: { title: string; myTeam: string; changeTeam: string };
  teams: { title: string; intro: string; choose: string };
};

export const defaultCopy: Copy = {
  tabs: { feed: 'Feed', wallet: 'Billetera', settings: 'Ajustes' },
  feed: { title: '{short}', sectionTitle: 'Del club', buyTickets: 'Comprar boletas' },
  wallet: {
    title: 'Billetera',
    signInTitle: 'Tus boletas',
    signInHint: 'Inicia sesión para ver y transferir tus boletas.',
    signIn: 'Iniciar sesión',
    errorTitle: 'No pudimos abrir tus boletas',
    retry: 'Reintentar',
    unavailable: 'La billetera solo está disponible en la app de iOS y Android.',
  },
  settings: { title: 'Configuración', myTeam: 'Mi equipo', changeTeam: 'Cambiar de equipo' },
  teams: {
    title: 'Cambiar de equipo',
    intro: 'Toca un club para ver su ficha antes de decidir. Tu equipo actual es {team}.',
    choose: 'Elegir como mi equipo',
  },
};

export function fill(text: string, vars: { short?: string; team?: string }) {
  return text.replace(/\{(short|team)\}/g, (_, key: 'short' | 'team') => vars[key] ?? '');
}
