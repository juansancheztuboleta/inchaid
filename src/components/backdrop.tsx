import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop, Circle } from 'react-native-svg';

import { useTheme } from '@/hooks/use-theme';

/**
 * Campo de color que vive detrás de toda la app: degradado azul claro con manchas de la paleta.
 * El vidrio no tiene nada que mostrar sobre blanco plano; este campo es lo que refracta.
 */
export function Backdrop() {
  const { colors, scheme } = useTheme();
  const { width, height } = useWindowDimensions();
  const dark = scheme === 'dark';

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]} pointerEvents="none">
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="field" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.backdropTop} />
            <Stop offset="1" stopColor={colors.backdropBottom} />
          </LinearGradient>
          <RadialGradient id="blobA">
            <Stop offset="0" stopColor={colors.blobA} stopOpacity={dark ? 0.55 : 0.34} />
            <Stop offset="1" stopColor={colors.blobA} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="blobB">
            <Stop offset="0" stopColor={colors.blobB} stopOpacity={dark ? 0.6 : 0.24} />
            <Stop offset="1" stopColor={colors.blobB} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="blobC">
            <Stop offset="0" stopColor={dark ? colors.blobC : '#ffffff'} stopOpacity={dark ? 0.35 : 0.9} />
            <Stop offset="1" stopColor={dark ? colors.blobC : '#ffffff'} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width={width} height={height} fill="url(#field)" />
        <Circle cx={width * 0.1} cy={height * 0.16} r={width * 0.85} fill="url(#blobA)" />
        <Circle cx={width * 0.95} cy={height * 0.5} r={width * 0.75} fill="url(#blobB)" />
        <Circle cx={width * 0.35} cy={height * 0.92} r={width * 0.8} fill="url(#blobC)" />
      </Svg>
    </View>
  );
}
