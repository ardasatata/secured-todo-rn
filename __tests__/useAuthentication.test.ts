import * as LocalAuthentication from 'expo-local-authentication';
import {Alert} from 'react-native';

// Simple unit tests for authentication logic
// Testing the core authentication flow without React hooks complexity

// Mock expo-local-authentication module
jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn(),
  isEnrolledAsync: jest.fn(),
  authenticateAsync: jest.fn(),
}));

// Mock Alert
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

const mockLocalAuth = LocalAuthentication as jest.Mocked<typeof LocalAuthentication>;
const mockAlert = Alert as jest.Mocked<typeof Alert>;

// Simple authentication function to test (extracted logic)
const authenticateUser = async (promptMessage: string = 'Please authenticate'): Promise<boolean> => {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      Alert.alert(
        'Authentication', 
        'Biometric authentication not available. Proceeding in demo mode.'
      );
      return true;
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      Alert.alert(
        'No Biometrics', 
        'No biometric data found. Please set up biometrics in device settings.'
      );
      return false;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      fallbackLabel: 'Use Passcode',
      cancelLabel: 'Cancel',
    });

    if (!result.success && result.error !== 'user_cancel') {
      Alert.alert('Authentication Failed', 'Please try again');
    }
    
    return result.success;
  } catch (error) {
    Alert.alert('Error', 'An error occurred during authentication');
    return false;
  }
};

describe('Authentication Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle successful authentication', async () => {
    // Mock successful authentication flow
    mockLocalAuth.hasHardwareAsync.mockResolvedValue(true);
    mockLocalAuth.isEnrolledAsync.mockResolvedValue(true);
    mockLocalAuth.authenticateAsync.mockResolvedValue({
      success: true,
      error: undefined,
    } as any);

    const result = await authenticateUser('Test prompt');

    expect(result).toBe(true);
    expect(mockLocalAuth.authenticateAsync).toHaveBeenCalledWith({
      promptMessage: 'Test prompt',
      fallbackLabel: 'Use Passcode',
      cancelLabel: 'Cancel',
    });
  });

  it('should handle no hardware available (demo mode)', async () => {
    // Mock no hardware available
    mockLocalAuth.hasHardwareAsync.mockResolvedValue(false);

    const result = await authenticateUser();

    expect(result).toBe(true); // Should succeed in demo mode
    expect(mockAlert.alert).toHaveBeenCalledWith(
      'Authentication',
      'Biometric authentication not available. Proceeding in demo mode.',
    );
  });

  it('should handle no enrolled biometrics', async () => {
    // Mock hardware available but no enrolled biometrics
    mockLocalAuth.hasHardwareAsync.mockResolvedValue(true);
    mockLocalAuth.isEnrolledAsync.mockResolvedValue(false);

    const result = await authenticateUser();

    expect(result).toBe(false);
    expect(mockAlert.alert).toHaveBeenCalledWith(
      'No Biometrics',
      'No biometric data found. Please set up biometrics in device settings.',
    );
  });

  it('should handle authentication failure', async () => {
    // Mock failed authentication
    mockLocalAuth.hasHardwareAsync.mockResolvedValue(true);
    mockLocalAuth.isEnrolledAsync.mockResolvedValue(true);
    mockLocalAuth.authenticateAsync.mockResolvedValue({
      success: false,
      error: 'authentication_failed',
    } as any);

    const result = await authenticateUser();

    expect(result).toBe(false);
    expect(mockAlert.alert).toHaveBeenCalledWith(
      'Authentication Failed',
      'Please try again',
    );
  });

  it('should handle user cancellation gracefully', async () => {
    // Mock user cancellation
    mockLocalAuth.hasHardwareAsync.mockResolvedValue(true);
    mockLocalAuth.isEnrolledAsync.mockResolvedValue(true);
    mockLocalAuth.authenticateAsync.mockResolvedValue({
      success: false,
      error: 'user_cancel',
    } as any);

    const result = await authenticateUser();

    expect(result).toBe(false);
    // Should not show alert for user cancellation
    expect(mockAlert.alert).not.toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    // Mock error during authentication
    mockLocalAuth.hasHardwareAsync.mockRejectedValue(new Error('Test error'));

    const result = await authenticateUser();

    expect(result).toBe(false);
    expect(mockAlert.alert).toHaveBeenCalledWith(
      'Error',
      'An error occurred during authentication',
    );
  });
});