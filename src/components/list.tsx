import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { type IconSvgElement } from '@hugeicons/react-native';
import { Children, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Glass } from '@/components/glass';
import { Icon } from '@/components/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Grupo inset al estilo iOS: título fuera, filas dentro de una sola lámina de vidrio. */
export function Group({ title, children }: { title?: string; children: ReactNode }) {
  const { colors } = useTheme();
  const rows = Children.toArray(children);

  return (
    <View style={styles.group}>
      {title ? (
        <AppText variant="label" color="textSecondary" accessibilityRole="header" style={styles.groupTitle}>
          {title}
        </AppText>
      ) : null}
      <Glass radius={Radius.panel} strength="strong">
        {rows.map((row, i) => (
          <View
            key={i}
            style={i > 0 && { borderTopColor: colors.line, borderTopWidth: StyleSheet.hairlineWidth }}>
            {row}
          </View>
        ))}
      </Glass>
    </View>
  );
}

type RowProps = {
  /** Icono de línea en medallón; ignorado si se pasa `leading`. */
  icon?: IconSvgElement;
  /** Contenido propio a la izquierda, p. ej. un escudo. */
  leading?: ReactNode;
  label: string;
  /** Línea secundaria bajo la etiqueta. */
  detail?: string;
  value?: string;
  /** Control a la derecha (interruptor, etc.). Sin él, la fila con `onPress` muestra un chevron. */
  trailing?: ReactNode;
  onPress?: () => void;
  danger?: boolean;
};

export function Row({ icon, leading, label, detail, value, trailing, onPress, danger }: RowProps) {
  const { colors } = useTheme();
  const content = (pressed: boolean) => (
    <View style={[styles.row, pressed && { backgroundColor: colors.accentSoft }]}>
      {leading ??
        (icon ? (
          <View style={[styles.disc, { backgroundColor: danger ? 'transparent' : colors.accentSoft }]}>
            <Icon icon={icon} size={20} color={danger ? 'danger' : 'accentText'} />
          </View>
        ) : null)}
      <View style={styles.text}>
        <AppText variant="body" color={danger ? 'danger' : 'text'}>
          {label}
        </AppText>
        {detail ? (
          <AppText variant="caption" color="textSecondary">
            {detail}
          </AppText>
        ) : null}
      </View>
      {value ? (
        <AppText variant="body" color="textSecondary">
          {value}
        </AppText>
      ) : null}
      {trailing ?? (onPress && !danger ? <Icon icon={ArrowRight01Icon} size={18} color="textTertiary" /> : null)}
    </View>
  );

  if (!onPress) return content(false);

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}>
      {({ pressed }) => content(pressed)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  group: { gap: Spacing.one },
  groupTitle: { paddingHorizontal: Spacing.one },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    minHeight: 56,
  },
  disc: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: 1 },
});
