import { type IconSvgElement } from '@hugeicons/react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Glass } from '@/components/glass';
import { Icon } from '@/components/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ActionButtonProps = {
  label: string;
  icon?: IconSvgElement;
  onPress?: () => void;
  /** `action` es el amarillo de acción principal; `solid` el azul de marca. */
  tone?: 'action' | 'solid';
  fullWidth?: boolean;
};

/** Botón principal. El amarillo se reserva a una sola acción por pantalla. */
export function ActionButton({ label, icon, onPress, tone = 'action', fullWidth }: ActionButtonProps) {
  const { colors } = useTheme();
  const solid = tone === 'solid';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        fullWidth && styles.fullWidth,
        {
          backgroundColor: solid
            ? pressed ? colors.primaryPressed : colors.primary
            : pressed ? colors.actionPressed : colors.action,
        },
      ]}>
      {icon ? <Icon icon={icon} size={20} color={solid ? 'onPrimary' : 'onAction'} /> : null}
      <AppText variant="title" color={solid ? 'onPrimary' : 'onAction'}>
        {label}
      </AppText>
    </Pressable>
  );
}

type GlassIconButtonProps = {
  icon: IconSvgElement;
  label: string;
  onPress?: () => void;
  /** Punto de aviso sobre el icono. */
  badge?: boolean;
};

/** Botón circular de vidrio de 44pt, el objetivo táctil mínimo de iOS. */
export function GlassIconButton({ icon, label, onPress, badge }: GlassIconButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}>
      <Glass radius={Radius.full} interactive style={styles.iconButton}>
        <View style={styles.center}>
          <Icon icon={icon} size={22} />
          {badge ? <View style={[styles.badge, { backgroundColor: colors.danger }]} /> : null}
        </View>
      </Glass>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  action: {
    minHeight: 52,
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    borderRadius: Radius.control,
  },
  fullWidth: { alignSelf: 'stretch' },
  pressed: { opacity: 0.7 },
  iconButton: { width: 44, height: 44 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    top: 11,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
