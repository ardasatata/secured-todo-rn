import { useState } from 'react';
import { Alert } from 'react-native';
import { IAuthenticationService } from '../interfaces/IAuthService';
import { AuthService } from '../services/AuthService';

export const useAuthentication = (authService: IAuthenticationService = new AuthService()) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authenticate = async (promptMessage: string = 'Please authenticate'): Promise<boolean> => {
    setIsAuthenticating(true);

    try {
      const capabilities = await authService.checkDeviceCapabilities();
      if (!capabilities.hasHardware) {
        Alert.alert(
          'Authentication',
          'Biometric authentication not available. Proceeding in demo mode.'
        );
        setIsAuthenticating(false);
        return true;
      }

      if (capabilities.supportedAuthTypes.length === 0) {
        Alert.alert(
          'No Authentication Available',
          'No authentication methods found on this device. Please set up device security.'
        );
        setIsAuthenticating(false);
        return false;
      }

      const result = await authService.authenticate(promptMessage);
      setIsAuthenticating(false);

      if (!result) {
        Alert.alert('Authentication Failed', 'Please try again');
      }

      return result;
    } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert('Error', 'An error occurred during authentication');
      setIsAuthenticating(false);
      return false;
    }
  };

  return {
    authenticate,
    isAuthenticating,
  };
};
