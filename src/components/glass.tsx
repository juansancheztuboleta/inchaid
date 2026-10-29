import { BlurView } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { useEffect, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type GlassProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  radius?: number;
  /** `strong` se usa donde el contenido debe leerse sobre cualquier fondo. */
  strength?: 'regular' | 'strong';
  /** Color de marca que tiñe el vidrio. */
  tint?: string;
  interactive?: boolean;
};

function useReduceTransparency() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceTransparencyEnabled?.().then(setReduced).catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceTransparencyChanged', setReduced);
    return () => sub.remove();
  }, []);

  return reduced;
}

export const nativeGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();

/**
 * Superficie de vidrio. En iOS 26 usa Liquid Glass nativo; en el resto, vidrio esmerilado con
 * relleno translúcido y borde de luz. Con "reducir transparencia" degrada a casi opaco.
 */
export function Glass({
  children,
  style,
  radius = Radius.panel,
  strength = 'regular',
  tint,
  interactive,
}: GlassProps) {
  const { colors, scheme } = useTheme();
  const reduced = useReduceTransparency();
  const shape = { borderRadius: radius };

  if (reduced) {
    return (
      <View
        style={[
          shape,
          styles.base,
          { backgroundColor: tint ?? colors.glassOpaque, borderColor: colors.line },
          style,
        ]}>
        {children}
      </View>
    );
  }

  if (nativeGlass) {
    return (
      <GlassView
        glassEffectStyle="regular"
        tintColor={tint}
        isInteractive={interactive}
        colorScheme={scheme}
        style={[shape, styles.nativeShadow, { shadowColor: colors.glassShadow }, style]}>
        {children}
      </GlassView>
    );
  }

  return (
    <View
      style={[
        shape,
        styles.base,
        styles.nativeShadow,
        { shadowColor: colors.glassShadow, borderColor: colors.glassBorder },
        style,
      ]}>
      <BlurView
        intensity={strength === 'strong' ? 60 : 38}
        tint={scheme === 'dark' ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: tint ?? (strength === 'strong' ? colors.glassStrongFill : colors.glassFill) },
        ]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  nativeShadow: {
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
  },
});
