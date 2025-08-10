import ExpoModulesCore
import UIKit

public class ScreenshotDetectorModule: Module {
  private var isDetecting = false
  
  public func definition() -> ModuleDefinition {
    Name("ScreenshotDetector")
    
    Events("onScreenshotDetected")
    
    AsyncFunction("isScreenshotDetectionAvailable") { () -> Bool in
      return true
    }
    
    Function("startScreenshotDetection") {
      startDetection()
    }
    
    Function("stopScreenshotDetection") {
      stopDetection()
    }
  }
  
  private func startDetection() {
    guard !isDetecting else { return }
    
    isDetecting = true
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(screenshotTaken),
      name: UIApplication.userDidTakeScreenshotNotification,
      object: nil
    )
  }
  
  private func stopDetection() {
    guard isDetecting else { return }
    
    isDetecting = false
    NotificationCenter.default.removeObserver(
      self,
      name: UIApplication.userDidTakeScreenshotNotification,
      object: nil
    )
  }
  
  @objc private func screenshotTaken() {
    let timestamp = Date().timeIntervalSince1970 * 1000 // Convert to milliseconds
    
    sendEvent("onScreenshotDetected", [
      "timestamp": timestamp
    ])
  }
  
  deinit {
    stopDetection()
  }
}