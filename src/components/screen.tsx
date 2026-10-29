import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/app-text';
import { MaxContentWidth, Spacing, TabBarGap, TabBarHeight } from '@/constants/theme';

type ScreenProps = {
  title: string;
  /** Lado derecho del título grande, p. ej. un botón de vidrio. */
  trailing?: ReactNode;
  children: ReactNode;
};

/** Pantalla de primer nivel: título grande que se desplaza con el contenido y espacio para la barra flotante. */
export function Screen({ title, trailing, children }: ScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.scroll}
      contentInsetAdjustmentBehavior="never"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + Spacing.three,
          paddingBottom: insets.bottom + TabBarHeight + TabBarGap + Spacing.five,
        },
      ]}>
      <View style={styles.header}>
        <AppText variant="display" accessibilityRole="header" style={styles.title}>
          {title}
        </AppText>
        {trailing}
      </View>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
    gap: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
    minHeight: 44,
  },
  title: { flexShrink: 1 },
});
