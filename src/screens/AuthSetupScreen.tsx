import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import {saveAuthSetup, saveAuthEnabled} from '../utils/authStorage';
import {authService} from '../services/AuthService';
import { AuthError } from '../types/Auth';
import {useTheme} from '../hooks/useTheme';

interface Props {
  onAuthSetup: () => void;
}

export default function AuthSetupScreen({onAuthSetup}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const styles = createStyles(theme);

  const handleSetupAuth = async () => {
    setIsLoading(true);

    try {
      const capabilities = await authService.checkDeviceCapabilities();
      if (!capabilities.hasHardware) {
        Alert.alert(
          'Simulator Mode',
          'Biometric authentication is not available on simulator. Proceeding with demo mode.',
          [
            {text: 'OK', onPress: async () => {
              await saveAuthSetup(true);
              await saveAuthEnabled(true);
              onAuthSetup();
            }},
          ]
        );
        setIsLoading(false);
        return;
      }

      if (capabilities.supportedAuthTypes.length === 0) {
        Alert.alert(
          'Setup Required',
          'No authentication methods available on this device. Please set up device security first, or continue in demo mode.',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Demo Mode', onPress: async () => {
              await saveAuthSetup(true);
              await saveAuthEnabled(true);
              onAuthSetup();
            }},
          ]
        );
        setIsLoading(false);
        return;
      }

      const result = await authService.setupAuthentication();

      if (result.success) {
        await saveAuthSetup(true);
        await saveAuthEnabled(true);
        Alert.alert('Success', 'Authentication has been set up successfully!', [
          {text: 'OK', onPress: onAuthSetup},
        ]);
      } else if (result.error === AuthError.USER_CANCEL) {
        Alert.alert('Cancelled', 'Authentication setup was cancelled.');
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
            await saveAuthEnabled(true);
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
        <MaterialIcons
          name="fingerprint"
          size={80}
          color={theme.colors.primary}
          style={styles.icon}
        />
        <Text style={styles.title}>Secure Todo</Text>
        <Text style={styles.subtitle}>
          Set up biometric authentication to secure your todos
        </Text>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSetupAuth}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.colors.onPrimary} />
          ) : (
            <Text style={styles.buttonText}>Setup Biometric Auth</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.componentPadding,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  icon: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.onBackground,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xxxl,
    lineHeight: theme.typography.lineHeight.relaxed,
  },
  button: {
    marginTop: theme.spacing.xxxl,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xxxl,
    paddingVertical: theme.spacing.listItemPadding,
    borderRadius: theme.spacing.borderRadius.sm,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: theme.colors.disabled,
  },
  buttonText: {
    color: theme.colors.onPrimary,
    ...theme.typography.button,
  },
});
