import { useEffect, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import { loadScreenshotDetection } from '../utils/storage';

// Type definitions for screenshot detection
export interface ScreenshotEvent {
  timestamp: number;
  path?: string;
}

export const useScreenshotDetection = () => {
  const handleScreenshot = useCallback((event?: ScreenshotEvent) => {
    Alert.alert(
      'Screenshot Detected',
      'A screenshot was taken of this secure app. This action has been logged.',
      [
        {
          text: 'OK',
          style: 'default',
        },
      ]
    );

    console.warn('Screenshot detected:', {
      timestamp: event?.timestamp ? new Date(event.timestamp).toISOString() : new Date().toISOString(),
      path: event?.path,
      platform: Platform.OS,
    });
  }, []);

  const startDetection = useCallback(async () => {
    try {
      const isEnabled = await loadScreenshotDetection();
      if (!isEnabled) {
        console.log('Screenshot detection is disabled');
        return;
      }

      // For now, we'll demonstrate the integration without the native module
      console.log('Screenshot detection would be started here');

      // TODO: Implement actual native screenshot detection
      // This would integrate with our custom Expo module when properly configured
    } catch (error) {
      console.error('Error starting screenshot detection:', error);
    }
  }, []);

  const stopDetection = useCallback(() => {
    try {
      console.log('Screenshot detection would be stopped here');
      // TODO: Implement actual native screenshot detection stop
    } catch (error) {
      console.error('Error stopping screenshot detection:', error);
    }
  }, []);

  useEffect(() => {
    startDetection();

    return () => {
      stopDetection();
    };
  }, [startDetection, stopDetection]);

  return {
    startDetection,
    stopDetection,
    triggerTestScreenshot: handleScreenshot, // For testing purposes
  };
};
