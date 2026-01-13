import { useColorScheme } from 'react-native';
import { LightColors, DarkColors } from './colors';

export const useTheme = () => {
  const scheme = useColorScheme(); // 'light' | 'dark'
  const isDark = scheme === 'dark';

  return {
    isDark,
    colors: isDark ? DarkColors : LightColors,
  };
};
