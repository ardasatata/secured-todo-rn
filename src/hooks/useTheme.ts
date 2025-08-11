import { useTheme as useThemeFromProvider } from '../providers/ThemeProvider';

export const useTheme = () => {
  const { theme } = useThemeFromProvider();
  return theme;
};
