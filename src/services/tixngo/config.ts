import type { SdkInitializeOptions } from '../../../modules/sdk';

export const sdkOptions: SdkInitializeOptions = {
  env: 'VAL',
  appIds: { val: 'io.tixngo.app.sdk', preProd: 'io.tixngo.app.sdk' },
  customDomains: { val: 'https://val5-api.tixngo.io', preProd: 'https://pp5-api.tixngo.io' },
  deeplinkPathPrefix: 'sdk',
  deeplinkHost: 'https://r.tixngo.io',
  language: 'ES_ES',
  supportLanguages: ['ES_ES', 'EN'],
  debug: __DEV__,
};

export const ssoConfig = {
  clientId: '2s99n930g6jakdcj2nc0tu9rij',
  authorizationEndpoint: 'https://val5-tixngo-sso-io-sdk.auth.eu-west-1.amazoncognito.com/oauth2/authorize',
  tokenEndpoint: 'https://val5-tixngo-sso-io-sdk.auth.eu-west-1.amazoncognito.com/oauth2/token',
  scopes: ['openid', 'email', 'profile', 'phone'],
  redirectUri: 'tixngo://auth',
};
