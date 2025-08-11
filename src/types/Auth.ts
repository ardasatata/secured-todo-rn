export interface DeviceCapabilities {
  hasHardware: boolean;
  isEnrolled: boolean;
  supportedAuthTypes: number[];
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

export enum AuthError {
  NO_HARDWARE = 'no_hardware',
  NOT_ENROLLED = 'not_enrolled',
  USER_CANCEL = 'user_cancel',
  AUTH_FAILED = 'auth_failed',
  UNKNOWN_ERROR = 'unknown_error',
}
