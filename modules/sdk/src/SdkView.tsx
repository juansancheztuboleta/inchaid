import { requireNativeView } from 'expo';
import { Platform, View } from 'react-native';

import type { SdkViewProps } from './Sdk.types';

const NativeView =
  Platform.OS === 'android' ? requireNativeView<SdkViewProps>('Sdk') : null;

/**
 * Pinta una pantalla del SDK de TIXNGO embebida. Monta la vista solo después
 * de que `Sdk.initialize()` resuelva; si no, el SDK responde con el error 10000.
 */
export default function SdkView(props: SdkViewProps) {
  if (!NativeView) {
    return <View style={props.style} />;
  }
  return <NativeView {...props} />;
}
