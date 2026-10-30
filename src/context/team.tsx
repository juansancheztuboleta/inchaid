import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { defaultTeam } from '@/data/mock';
import type { Team } from '@/types/team';

type TeamContextValue = {
  team: Team;
  setTeam: (team: Team) => void;
  /** Club que se está explorando: tiñe temporalmente toda la app sin cambiar el equipo elegido. */
  preview: Team | null;
  setPreview: (team: Team | null) => void;
};

const TeamContext = createContext<TeamContextValue>({
  team: defaultTeam,
  setTeam: () => {},
  preview: null,
  setPreview: () => {},
});

/**
 * Equipo del usuario. Arranca con el club por defecto; cuando haya sesión, inicializa el estado
 * con el equipo guardado en el perfil (o en almacenamiento local) y persiste en `setTeam`.
 */
export function TeamProvider({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<Team>(defaultTeam);
  const [preview, setPreview] = useState<Team | null>(null);
  const value = useMemo(() => ({ team, setTeam, preview, setPreview }), [team, preview]);

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

export function useTeam() {
  return useContext(TeamContext);
}
