import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type TextVariant = 'display' | 'headline' | 'title' | 'body' | 'label' | 'caption' | 'amount';

export type AppTextProps = TextProps & {
  variant?: TextVariant;
  color?: ThemeColor;
};

export function AppText({ style, variant = 'body', color = 'text', ...rest }: AppTextProps) {
  const { colors } = useTheme();

  return <Text style={[{ color: colors[color] }, styles[variant], style]} {...rest} />;
}

const styles = StyleSheet.create({
  display: {
    fontFamily: Fonts.extrabold,
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: -0.8,
  },
  headline: {
    fontFamily: Fonts.bold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 17,
    lineHeight: 22,
  },
  body: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  label: {
    fontFamily: Fonts.semibold,
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontFamily: Fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
  },
  amount: {
    fontFamily: Fonts.extrabold,
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -1,
    fontVariant: ['tabular-nums', 'lining-nums'],
  },
});
