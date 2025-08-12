// Authentication prompt messages
export const AUTH_MESSAGES = {
  ADD_TODO: 'Authenticate to add todo',
  UPDATE_TODO: 'Authenticate to update todo',
  DELETE_TODO: 'Authenticate to delete todo',
  TOGGLE_TODO: 'Authenticate to toggle todo completion',
  DISABLE_SECURITY: 'Authenticate to disable security',
  SETUP_AUTH: 'Setup authentication for secure access',
  ACCESS_TODOS: 'Authenticate to access your todos',
} as const;

// Alert messages
export const ALERT_MESSAGES = {
  ERROR_TITLE: 'Error',
  SUCCESS_TITLE: 'Success',
  DELETE_TITLE: 'Delete Todo',
  DELETE_CONFIRM: 'Are you sure you want to delete this todo?',
  EMPTY_TODO_ERROR: 'Please enter a todo item',
  AUTH_ENABLED: 'Authentication enabled!',
  AUTH_DISABLED: 'Authentication disabled',
  AUTH_SETUP_SUCCESS: 'Authentication has been set up successfully!',
  AUTH_FAILED: 'Authentication Failed',
  AUTH_FAILED_MESSAGE: 'Please try again',
  AUTH_CANCELLED: 'Cancelled',
  AUTH_CANCELLED_MESSAGE: 'Authentication setup was cancelled.',
  NOT_AVAILABLE: 'Not Available',
  BIOMETRIC_NOT_AVAILABLE: 'Biometric authentication is not available on this device',
  SETUP_REQUIRED: 'Setup Required',
  NO_AUTH_METHODS: 'No authentication methods available. Please set up device security first.',
  SIMULATOR_MODE: 'Simulator Mode',
  SIMULATOR_MESSAGE: 'Biometric authentication is not available on simulator. Proceeding with demo mode.',
} as const;

// Button labels
export const BUTTON_LABELS = {
  OK: 'OK',
  CANCEL: 'Cancel',
  DELETE: 'Delete',
  DEMO_MODE: 'Demo Mode',
} as const;
