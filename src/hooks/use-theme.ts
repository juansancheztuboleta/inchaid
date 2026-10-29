import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme() {
  const scheme = useColorScheme();
  const name = scheme === 'dark' ? 'dark' : 'light';

  return { colors: Colors[name], scheme: name } as const;
}
