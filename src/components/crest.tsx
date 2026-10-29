import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { useTheme } from '@/hooks/use-theme';

type CrestProps = {
  initials: string;
  size?: number;
  /** `home` va en azul de marca; `away` en tinta. */
  side?: 'home' | 'away';
};

/** Escudo simple: disco con iniciales. Evita inventar una estrella u otro emblema de marca. */
export function Crest({ initials, size = 40, side = 'home' }: CrestProps) {
  const { colors } = useTheme();

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.disc,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: side === 'home' ? colors.primary : '#1a171b',
          borderColor: colors.glassBorder,
        },
      ]}>
      <AppText
        variant="label"
        color="onPrimary"
        style={{ fontSize: size * 0.34, lineHeight: size * 0.42, color: '#ffffff' }}>
        {initials}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  disc: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
});
