import * as LocalAuthentication from 'expo-local-authentication';
import { IAuthenticationService } from '../interfaces/IAuthService';
import { DeviceCapabilities, AuthResult, AuthError } from '../types/Auth';
import { AuthRepository, IAuthRepository } from '../repositories/AuthRepository';

export class AuthService implements IAuthenticationService {
  private authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository = new AuthRepository()) {
    this.authRepository = authRepository;
  }

  async authenticate(promptMessage: string = 'Please authenticate'): Promise<boolean> {
    try {
      const isAuthEnabled = await this.authRepository.loadAuthSetup();
      if (!isAuthEnabled) {
        return true;
      }

      const capabilities = await this.checkDeviceCapabilities();
      if (!capabilities.hasHardware) {
        return true;
      }

      if (capabilities.supportedAuthTypes.length === 0) {
        return false;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel: 'Use Passcode',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      return result.success;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  }

  async checkDeviceCapabilities(): Promise<DeviceCapabilities> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedAuthTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

      return {
        hasHardware,
        isEnrolled,
        supportedAuthTypes,
      };
    } catch (error) {
      console.error('Error checking device capabilities:', error);
      return {
        hasHardware: false,
        isEnrolled: false,
        supportedAuthTypes: [],
      };
    }
  }

  async setupAuthentication(promptMessage: string = 'Setup authentication for secure access'): Promise<AuthResult> {
    try {
      const capabilities = await this.checkDeviceCapabilities();

      if (!capabilities.hasHardware) {
        return { success: true };
      }

      if (capabilities.supportedAuthTypes.length === 0) {
        return { success: false, error: AuthError.NOT_ENROLLED };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel: 'Use Passcode',
        disableDeviceFallback: false,
      });

      if (result.success) {
        return { success: true };
      } else {
        const error = result.error === 'user_cancel' ? AuthError.USER_CANCEL : AuthError.AUTH_FAILED;
        return { success: false, error };
      }
    } catch (error) {
      console.error('Auth setup error:', error);
      return { success: false, error: AuthError.UNKNOWN_ERROR };
    }
  }
}
