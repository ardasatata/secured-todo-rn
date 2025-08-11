import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import {saveAuthSetup, loadAuthSetup} from '../utils/authStorage';

export default function SettingsScreen() {
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('None');
  const [hasHardware, setHasHardware] = useState(false);

  useEffect(() => {
    initializeSettings();
  }, []);

  const initializeSettings = async () => {
    try {
      // Check current auth setup status
      const authEnabled = await loadAuthSetup();
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
        await saveAuthSetup(true);
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
          await saveAuthSetup(false);
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
            />
          </View>


          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Authentication Type</Text>
              <Text style={styles.settingDescription}>{biometricType}</Text>
            </View>
          </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  dangerText: {
    color: '#ff4444',
  },
});
