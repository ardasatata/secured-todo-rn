import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_SETUP_KEY = '@auth_setup';

export const saveAuthSetup = async (isSetup: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(AUTH_SETUP_KEY, JSON.stringify(isSetup));
  } catch (e) {
    console.error('Error saving auth setup status:', e);
  }
};

export const loadAuthSetup = async (): Promise<boolean> => {
  try {
    const jsonValue = await AsyncStorage.getItem(AUTH_SETUP_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : true;
  } catch (e) {
    console.error('Error loading auth setup status:', e);
    return true;
  }
};
