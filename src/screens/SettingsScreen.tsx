import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Switch,
  Alert,
  ScrollView, Platform,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import {saveAuthSetup, loadAuthSetup, saveAuthEnabled, loadAuthEnabled} from '../utils/authStorage';
import {useTheme, useThemeContext} from '../hooks/useTheme';
import {ThemeMode} from '../utils/themeStorage';

export default function SettingsScreen() {
  const theme = useTheme();
  const { isDark, themeMode, setThemeMode } = useThemeContext();
  const styles = createStyles(theme);

  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('None');
  const [hasHardware, setHasHardware] = useState(false);

  useEffect(() => {
    initializeSettings();
  }, []);

  const initializeSettings = async () => {
    try {
      // Check current auth enabled status (not setup status)
      const authEnabled = await loadAuthEnabled();
      setBiometricEnabled(authEnabled);

      // Check device capabilities
      const hardwareAvailable = await LocalAuthentication.hasHardwareAsync();
      setHasHardware(hardwareAvailable);

      if (hardwareAvailable) {
        // Get supported authentication types
        const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

        if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('Face ID');
        } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('Touch ID');
        } else {
          setBiometricType('Passcode');
        }
      }
    } catch (error) {
      console.error('Error initializing settings:', error);
    }
  };

  const toggleBiometric = async (value: boolean) => {
    // Store the current state in case we need to revert
    const currentState = biometricEnabled;

    if (value) {
      // Enable biometric authentication - no auth required
      if (!hasHardware) {
        Alert.alert('Not Available', 'Biometric authentication is not available on this device');
        return;
      }

      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (supportedTypes.length === 0) {
        Alert.alert(
          'Setup Required',
          'No authentication methods available. Please set up device security first.'
        );
        return;
      }

      try {
        await saveAuthEnabled(true);
        setBiometricEnabled(true);
        Alert.alert('Success', 'Authentication enabled!');
      } catch (error) {
        console.error('Error enabling authentication:', error);
        Alert.alert('Error', 'Failed to enable authentication');
        setBiometricEnabled(currentState);
      }
    } else {
      // Disable biometric authentication - require authentication
      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate to disable security',
          disableDeviceFallback: false,
        });

        if (result.success) {
          await saveAuthEnabled(false);
          setBiometricEnabled(false);
          Alert.alert('Success', 'Authentication disabled');
        } else {
          // Authentication failed or cancelled, revert switch state
          setBiometricEnabled(currentState);
        }
      } catch (error) {
        console.error('Error disabling authentication:', error);
        Alert.alert('Error', 'Failed to disable authentication');
        // Revert switch state on error
        setBiometricEnabled(currentState);
      }
    }
  };


  const handleThemeModeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  const getThemeModeText = () => {
    switch (themeMode) {
      case 'auto':
        return `Auto (${isDark ? 'Dark' : 'Light'})`;
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      default:
        return 'Auto';
    }
  };

  const showThemeOptions = () => {
    Alert.alert(
      'Theme',
      'Choose your preferred theme',
      [
        {
          text: 'Auto (Follow System)',
          onPress: () => handleThemeModeChange('auto'),
        },
        {
          text: 'Light',
          onPress: () => handleThemeModeChange('light'),
        },
        {
          text: 'Dark',
          onPress: () => handleThemeModeChange('dark'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const resetSettings = async () => {
    Alert.alert(
      'Reset Settings',
      'This will disable biometric authentication and reset all settings. Continue?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await saveAuthSetup(false);
            await saveAuthEnabled(false);
            setBiometricEnabled(false);
            Alert.alert('Reset Complete', 'All settings have been reset');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Biometric Authentication Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Biometric Authentication</Text>
              <Text style={styles.settingDescription}>
                Use {biometricType} to secure your todos
              </Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={toggleBiometric}
              disabled={!hasHardware}
              trackColor={{false: Platform.OS === 'android' ? theme.colors.switchTrack : theme.colors.surface, true: Platform.OS === 'android' ? theme.colors.switchTrack : theme.colors.primary}}
              thumbColor={Platform.OS === 'android' ? theme.colors.switchThumb : theme.colors.surface}
            />
          </View>


          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Authentication Type</Text>
              <Text style={styles.settingDescription}>{biometricType}</Text>
            </View>
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>

          <TouchableOpacity style={styles.settingItem} onPress={showThemeOptions} testID="theme-selector">
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Theme</Text>
              <Text style={styles.settingDescription}>{getThemeModeText()}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* General Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>

          <TouchableOpacity style={styles.settingItem} onPress={resetSettings}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, styles.dangerText]}>Reset Settings</Text>
              <Text style={styles.settingDescription}>
                Reset all authentication settings
              </Text>
            </View>
          </TouchableOpacity>
        </View>


        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>App Name</Text>
              <Text style={styles.settingDescription}>PdTest</Text>
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Version</Text>
              <Text style={styles.settingDescription}>1.0.0</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.componentPadding,
    paddingBottom: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.xxxl,
  },
  sectionTitle: {
    ...theme.typography.subtitle,
    color: theme.colors.onBackground,
    marginBottom: theme.spacing.listItemPadding,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.listItemPadding,
    borderRadius: theme.spacing.borderRadius.sm,
    marginBottom: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    ...theme.typography.body,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.xs,
  },
  settingDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  dangerText: {
    color: theme.colors.error,
  },
});
