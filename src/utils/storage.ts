import AsyncStorage from '@react-native-async-storage/async-storage';
import {Todo} from '../types/Todo';

const TODOS_KEY = '@todos';
const AUTH_SETUP_KEY = '@auth_setup';

export const saveTodos = async (todos: Todo[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(todos);
    await AsyncStorage.setItem(TODOS_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving todos:', e);
  }
};

export const loadTodos = async (): Promise<Todo[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(TODOS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue).map((todo: any) => ({
      ...todo,
      createdAt: new Date(todo.createdAt),
    })) : [];
  } catch (e) {
    console.error('Error loading todos:', e);
    return [];
  }
};

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
    // Default to true (authentication enabled) when no setting is stored
    return jsonValue != null ? JSON.parse(jsonValue) : true;
  } catch (e) {
    console.error('Error loading auth setup status:', e);
    // Default to true on error to maintain security
    return true;
  }
};
