import { saveThemeMode, loadThemeMode } from '../src/utils/themeStorage';

// Mock AsyncStorage is already set up in jest.setup.js

describe('Theme Storage', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('should save and load theme mode', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    
    // Test saving theme mode
    await saveThemeMode('dark');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('theme_mode', 'dark');

    // Test loading theme mode
    AsyncStorage.getItem.mockResolvedValue('dark');
    const result = await loadThemeMode();
    expect(result).toBe('dark');
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('theme_mode');
  });

  test('should return default "auto" when no saved mode', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    AsyncStorage.getItem.mockResolvedValue(null);

    const result = await loadThemeMode();
    expect(result).toBe('auto');
  });
});