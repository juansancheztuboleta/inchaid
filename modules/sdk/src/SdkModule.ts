import { NativeModule, requireOptionalNativeModule } from 'expo';

import type { SdkInitializeOptions, SdkModuleEvents, SdkWidget } from './Sdk.types';

declare class SdkModule extends NativeModule<SdkModuleEvents> {
  initialize(options: SdkInitializeOptions): Promise<boolean>;
  updateToken(token: string): Promise<void>;
  signOut(): Promise<void>;
  getAuthStatus(): Promise<boolean>;
  open(widget?: SdkWidget): Promise<void>;
}

export default requireOptionalNativeModule<SdkModule>('Sdk');
