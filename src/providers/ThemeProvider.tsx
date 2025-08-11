import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { lightColors } from '../theme/lightColors';
import { darkColors } from '../theme/darkColors';
import { ThemeMode, loadThemeMode, saveThemeMode } from '../utils/themeStorage';

export interface Theme {
  colors: typeof lightColors | typeof darkColors;
  spacing: typeof spacing;
  typography: typeof typography;
}

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');

  // Determine if we should use dark theme
  const shouldUseDark = themeMode === 'dark' || (themeMode === 'auto' && systemColorScheme === 'dark');

  // Create theme object
  const theme: Theme = {
    colors: shouldUseDark ? darkColors : lightColors,
    spacing,
    typography,
  };

  // Load theme mode on mount
  useEffect(() => {
    const initializeTheme = async () => {
      const savedMode = await loadThemeMode();
      setThemeModeState(savedMode);
    };

    initializeTheme();
  }, []);

  // Handle theme mode changes
  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    await saveThemeMode(mode);
  };

  const value: ThemeContextType = {
    theme,
    isDark: shouldUseDark,
    themeMode,
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
