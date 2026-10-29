import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { defaultTeam, type Team } from '@/data/mock';

type TeamContextValue = {
  team: Team;
  setTeam: (team: Team) => void;
};

const TeamContext = createContext<TeamContextValue>({ team: defaultTeam, setTeam: () => {} });

export function TeamProvider({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<Team>(defaultTeam);
  const value = useMemo(() => ({ team, setTeam }), [team]);

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

export function useTeam() {
  return useContext(TeamContext);
}
