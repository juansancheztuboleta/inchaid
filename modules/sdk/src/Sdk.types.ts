import type { ViewProps } from 'react-native';

export type SdkEnv = 'DEMO' | 'INT' | 'VAL' | 'PREPROD' | 'PROD';

export type SdkLanguage =
  | 'EN'
  | 'EN_US'
  | 'ES_ES'
  | 'ES_MX'
  | 'FR'
  | 'FR_CA'
  | 'PT_PT'
  | 'AR'
  | 'DE'
  | 'NL';

export type SdkWidget = 'home' | 'transferCenter' | 'deletedTicket' | 'resale' | 'support';

export type SdkInitializeOptions = {
  env: SdkEnv;
  appIds: { demo?: string; int?: string; val?: string; preProd?: string; prod?: string };
  language?: SdkLanguage;
  supportLanguages?: SdkLanguage[];
  debug?: boolean;
  renewalTokenTimeoutMs?: number;
  initializeTimeoutMs?: number;
};

export type SdkError = {
  code: number;
  message: string;
  userInfo?: Record<string, string>;
};

export type SdkModuleEvents = {
  onInitialized: (event: { isAuthenticated: boolean }) => void;
  onAuthStatusChanged: (event: { isAuthenticated: boolean }) => void;
  onTokenExpired: () => void;
  onDeviceRefused: () => void;
  onError: (event: SdkError) => void;
  onClosed: () => void;
  onFrozenModeChanged: (event: { isFrozen: boolean }) => void;
  onTrackEvent: (event: { name: string; data?: Record<string, string> }) => void;
};

export type SdkViewProps = ViewProps & {
  widget?: SdkWidget;
  onLoad?: (event: { nativeEvent: { widget: string } }) => void;
  onError?: (event: { nativeEvent: SdkError }) => void;
};
