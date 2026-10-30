import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';

import { ssoConfig } from './config';

const REFRESH_TOKEN_KEY = 'tixngo.refreshToken';

const discovery: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: ssoConfig.authorizationEndpoint,
  tokenEndpoint: ssoConfig.tokenEndpoint,
};

function idTokenOf(response: AuthSession.TokenResponse) {
  if (!response.idToken) throw new Error('El IDP no devolvió id_token');
  return response.idToken;
}

export async function signIn(): Promise<string | null> {
  const request = new AuthSession.AuthRequest({
    clientId: ssoConfig.clientId,
    redirectUri: ssoConfig.redirectUri,
    scopes: ssoConfig.scopes,
    usePKCE: true,
  });

  const result = await request.promptAsync(discovery);
  if (result.type === 'cancel' || result.type === 'dismiss') return null;
  if (result.type !== 'success') {
    throw new Error(result.type === 'error' ? (result.error?.message ?? 'Error de login') : 'Error de login');
  }

  const tokens = await AuthSession.exchangeCodeAsync(
    {
      clientId: ssoConfig.clientId,
      code: result.params.code,
      redirectUri: ssoConfig.redirectUri,
      extraParams: { code_verifier: request.codeVerifier ?? '' },
    },
    discovery,
  );
  if (tokens.refreshToken) await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);
  return idTokenOf(tokens);
}

export async function refreshIdToken(): Promise<string | null> {
  const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  if (!refreshToken) return null;

  const tokens = await AuthSession.refreshAsync({ clientId: ssoConfig.clientId, refreshToken }, discovery);
  if (tokens.refreshToken) await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);
  return idTokenOf(tokens);
}

export function clearSession() {
  return SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}
