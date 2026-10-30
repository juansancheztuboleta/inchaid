import { useEffect, useState } from 'react';

import { clearSession, refreshIdToken, signIn } from '@/services/tixngo/auth';
import { sdkOptions } from '@/services/tixngo/config';
import Sdk from '../../modules/sdk';

export type TixngoStatus =
  | { kind: 'unavailable' }
  | { kind: 'loading' }
  | { kind: 'signedOut' }
  | { kind: 'ready' }
  | { kind: 'error'; message: string };

let initPromise: Promise<boolean> | null = null;

function initialize() {
  if (!Sdk) return Promise.reject(new Error('SDK no disponible'));
  initPromise ??= Sdk.initialize(sdkOptions).catch((error) => {
    initPromise = null;
    throw error;
  });
  return initPromise;
}

function messageOf(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export function useTixngo() {
  const [status, setStatus] = useState<TixngoStatus>(Sdk ? { kind: 'loading' } : { kind: 'unavailable' });

  useEffect(() => {
    if (!Sdk) return;
    const sdk = Sdk;
    let active = true;
    const update = (next: TixngoStatus) => {
      if (active) setStatus(next);
    };

    const expired = sdk.addListener('onTokenExpired', async () => {
      try {
        const token = await refreshIdToken();
        if (token) {
          await sdk.updateToken(token);
          return;
        }
      } catch {}
      update({ kind: 'signedOut' });
    });

    (async () => {
      try {
        const isAuthenticated = await initialize();
        let token: string | null = null;
        try {
          token = await refreshIdToken();
        } catch {
          await clearSession();
        }
        if (token) {
          await sdk.updateToken(token);
          update({ kind: 'ready' });
        } else {
          update({ kind: isAuthenticated ? 'ready' : 'signedOut' });
        }
      } catch (error) {
        update({ kind: 'error', message: messageOf(error) });
      }
    })();

    return () => {
      active = false;
      expired.remove();
    };
  }, []);

  async function login() {
    if (!Sdk) return;
    setStatus({ kind: 'loading' });
    try {
      await initialize();
      const token = await signIn();
      if (!token) {
        setStatus({ kind: 'signedOut' });
        return;
      }
      await Sdk.updateToken(token);
      setStatus({ kind: 'ready' });
    } catch (error) {
      setStatus({ kind: 'error', message: messageOf(error) });
    }
  }

  return { status, login };
}
