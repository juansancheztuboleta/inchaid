import { useCallback, useEffect, useState } from 'react';

import { fetchTeam, fetchTeams } from '@/services/teams-api';
import type { Team } from '@/types/team';

type Remote<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: T };

function useRemote<T>(load: (signal: AbortSignal) => Promise<T>, key: string) {
  const [state, setState] = useState<Remote<T>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal)
      .then((data) => setState({ status: 'ready', data }))
      .catch((e: unknown) => {
        if (controller.signal.aborted) return;
        setState({ status: 'error', message: e instanceof Error ? e.message : 'Algo salió mal' });
      });
    return () => controller.abort();
    // `load` se recrea en cada render; la identidad de la consulta es `key` + `attempt`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, attempt]);

  const reload = useCallback(() => {
    setState({ status: 'loading' });
    setAttempt((n) => n + 1);
  }, []);

  return { state, reload };
}

export function useTeams() {
  return useRemote<Team[]>((signal) => fetchTeams(signal), 'teams');
}

/** `data` es `null` cuando el servidor no conoce ese id. */
export function useTeamDetail(id: string) {
  return useRemote<Team | null>((signal) => fetchTeam(id, signal), `team:${id}`);
}
