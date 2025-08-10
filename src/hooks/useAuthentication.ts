import { useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';
import { loadAuthSetup } from '../utils/storage';

// Custom hook for handling biometric authentication
// Returns authenticate function and loading state
export const useAuthentication = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Main authentication function
  // Returns true if authentication successful, false otherwise
  const authenticate = async (promptMessage: string = 'Please authenticate'): Promise<boolean> => {
    setIsAuthenticating(true);

    try {
      // First check if biometric authentication is enabled in settings
      const isAuthEnabled = await loadAuthSetup();
      if (!isAuthEnabled) {
        // Authentication is disabled in settings, allow access
        setIsAuthenticating(false);
        return true;
      }

      // Check if device has biometric hardware
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        // For simulator/devices without biometric hardware
        // In production, you might want to handle this differently
        Alert.alert(
          'Authentication',
          'Biometric authentication not available. Proceeding in demo mode.'
        );
        setIsAuthenticating(false);
        return true; // Allow access in demo mode
      }

      // Check if user has enrolled biometric data
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert(
          'No Biometrics',
          'No biometric data found. Please set up biometrics in device settings.'
        );
        setIsAuthenticating(false);
        return false;
      }

      // Perform the actual authentication
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel: 'Use Passcode',
        cancelLabel: 'Cancel',
      });

      setIsAuthenticating(false);

      if (!result.success) {
        // User cancelled or authentication failed
        if (result.error !== 'user_cancel') {
          Alert.alert('Authentication Failed', 'Please try again');
        }
      }

      return result.success;
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
