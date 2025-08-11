import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'auto' | 'light' | 'dark';

const THEME_MODE_KEY = 'theme_mode';

export const saveThemeMode = async (mode: ThemeMode): Promise<void> => {
  try {
    await AsyncStorage.setItem(THEME_MODE_KEY, mode);
  } catch (error) {
    console.error('Error saving theme mode:', error);
  }
};

export const loadThemeMode = async (): Promise<ThemeMode> => {
  try {
    const mode = await AsyncStorage.getItem(THEME_MODE_KEY);
    return (mode as ThemeMode) || 'auto';
  } catch (error) {
    console.error('Error loading theme mode:', error);
    return 'auto';
  }
};

export const clearThemeMode = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(THEME_MODE_KEY);
  } catch (error) {
    console.error('Error clearing theme mode:', error);
  }
};
