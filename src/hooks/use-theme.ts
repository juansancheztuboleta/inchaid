import { useMemo } from 'react';

import { useTeam } from '@/context/team';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { resolveCopy, resolveTheme } from '@/theme/resolve';

/**
 * Colores del equipo activo. Mientras se explora un club (`preview`) la app entera adopta su
 * tema; al salir de la vista vuelve al del equipo elegido.
 */
export function useTheme() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const { team, preview } = useTeam();
  const active = preview ?? team;
  const colors = useMemo(() => resolveTheme(active, scheme), [active, scheme]);

  return { colors, scheme } as const;
}

/** Textos del equipo elegido (los de la API sobre los predeterminados). */
export function useCopy() {
  const { team } = useTeam();
  return useMemo(() => resolveCopy(team), [team]);
}
