import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react-native';

import { useTheme } from '@/hooks/use-theme';
import { type ThemeColor } from '@/theme/tokens';

type IconProps = {
  icon: IconSvgElement;
  size?: number;
  color?: ThemeColor | (string & {});
  strokeWidth?: number;
};

/** Hugeicons en trazo de línea, un único grosor para toda la app. */
export function Icon({ icon, size = 22, color = 'text', strokeWidth = 1.7 }: IconProps) {
  const { colors } = useTheme();
  const resolved = color in colors ? colors[color as ThemeColor] : color;

  return <HugeiconsIcon icon={icon} size={size} color={resolved} strokeWidth={strokeWidth} />;
}
