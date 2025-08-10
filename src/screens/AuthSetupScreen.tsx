import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import {saveAuthSetup} from '../utils/storage';

interface Props {
  onAuthSetup: () => void;
}

export default function AuthSetupScreen({onAuthSetup}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSetupAuth = async () => {
    setIsLoading(true);

    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert(
          'Simulator Mode',
          'Biometric authentication is not available on simulator. Proceeding with demo mode.',
          [
            {text: 'OK', onPress: async () => {
              await saveAuthSetup(true);
              onAuthSetup();
            }},
          ]
        );
        setIsLoading(false);
        return;
      }

      // Check what authentication methods are available
      const supportedAuthTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

      if (supportedAuthTypes.length === 0) {
        Alert.alert(
          'Setup Required',
          'No authentication methods available on this device. Please set up device security first, or continue in demo mode.',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Demo Mode', onPress: async () => {
              await saveAuthSetup(true);
              onAuthSetup();
            }},
          ]
        );
        setIsLoading(false);
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Setup authentication for secure access',
        fallbackLabel: 'Use Passcode',
        disableDeviceFallback: false, // Allow device credentials as fallback
      });

      if (result.success) {
        await saveAuthSetup(true);
        Alert.alert('Success', 'Authentication has been set up successfully!', [
          {text: 'OK', onPress: onAuthSetup},
        ]);
      } else {
        Alert.alert('Authentication Failed', 'Please try again.');
      }
    } catch (error) {
      console.error('Auth setup error:', error);
      Alert.alert(
        'Error',
        'Failed to setup authentication. Continue in demo mode?',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Demo Mode', onPress: async () => {
            await saveAuthSetup(true);
            onAuthSetup();
          }},
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to PdTest</Text>
        <Text style={styles.subtitle}>
          Set up biometric authentication to secure your todos
        </Text>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSetupAuth}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Setup Biometric Auth</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
