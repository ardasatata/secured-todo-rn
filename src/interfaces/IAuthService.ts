import { DeviceCapabilities, AuthResult } from '../types/Auth';

export interface IAuthenticationService {
  authenticate(promptMessage?: string): Promise<boolean>;
  checkDeviceCapabilities(): Promise<DeviceCapabilities>;
  setupAuthentication(promptMessage?: string): Promise<AuthResult>;
}
