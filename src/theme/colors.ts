export const colors = {
  // Primary colors
  primary: '#000000',
  primaryLight: '#333333',
  primaryDark: '#000000',

  // Secondary colors
  secondary: '#666666',
  secondaryLight: '#888888',
  secondaryDark: '#333333',

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#999999',
  gray600: '#666666',
  gray700: '#424242',
  gray800: '#333333',
  gray900: '#212121',

  // Status colors
  success: '#333333',
  warning: '#666666',
  error: '#000000',
  info: '#666666',

  // Background colors
  background: '#FFFFFF',
  surface: '#FAFAFA',
  surfaceVariant: '#F5F5F5',

  // Text colors
  onBackground: '#000000',
  onSurface: '#000000',
  onPrimary: '#FFFFFF',
  onSecondary: '#FFFFFF',
  textSecondary: '#666666',
  textDisabled: '#BDBDBD',

  // Border colors
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  borderDark: '#CCCCCC',

  // Special states
  disabled: '#BDBDBD',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.3)',

  // Todo-specific colors
  todoCompleted: '#999999',
  todoEditing: '#F5F5F5',
  todoEditingBorder: '#000000',
} as const;

export type ColorName = keyof typeof colors;
