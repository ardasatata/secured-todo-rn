import ScreenshotDetectorModule from './ScreenshotDetectorModule';

export type ScreenshotEvent = {
  timestamp: number;
  path?: string;
};

export type ScreenshotListener = (event: ScreenshotEvent) => void;

export function startScreenshotDetection(): void {
  return ScreenshotDetectorModule.startScreenshotDetection();
}

export function stopScreenshotDetection(): void {
  return ScreenshotDetectorModule.stopScreenshotDetection();
}

export function addScreenshotListener(listener: ScreenshotListener): void {
  return ScreenshotDetectorModule.addListener('onScreenshotDetected', listener);
}

export function removeScreenshotListener(listener: ScreenshotListener): void {
  return ScreenshotDetectorModule.removeListener('onScreenshotDetected', listener);
}

export function isScreenshotDetectionAvailable(): Promise<boolean> {
  return ScreenshotDetectorModule.isScreenshotDetectionAvailable();
}

export { ScreenshotDetectorModule };
