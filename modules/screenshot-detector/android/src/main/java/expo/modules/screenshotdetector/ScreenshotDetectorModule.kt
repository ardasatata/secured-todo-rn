package expo.modules.screenshotdetector

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise
import android.content.Context
import android.database.ContentObserver
import android.net.Uri
import android.os.Handler
import android.os.Looper
import android.provider.MediaStore
import android.util.Log

class ScreenshotDetectorModule : Module() {
  private var contentObserver: ContentObserver? = null
  private var isDetecting = false
  private val handler = Handler(Looper.getMainLooper())

  override fun definition() = ModuleDefinition {
    Name("ScreenshotDetector")
    
    Events("onScreenshotDetected")
    
    AsyncFunction("isScreenshotDetectionAvailable") { promise: Promise ->
      promise.resolve(true)
    }
    
    Function("startScreenshotDetection") {
      startDetection()
    }
    
    Function("stopScreenshotDetection") {
      stopDetection()
    }
  }

  private fun startDetection() {
    if (isDetecting) return
    
    isDetecting = true
    
    contentObserver = object : ContentObserver(handler) {
      override fun onChange(selfChange: Boolean, uri: Uri?) {
        super.onChange(selfChange, uri)
        uri?.let { checkForScreenshot(it) }
      }
    }
    
    val context = appContext.reactContext ?: return
    
    context.contentResolver.registerContentObserver(
      MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
      true,
      contentObserver!!
    )
  }
  
  private fun stopDetection() {
    if (!isDetecting) return
    
    isDetecting = false
    contentObserver?.let { observer ->
      val context = appContext.reactContext
      context?.contentResolver?.unregisterContentObserver(observer)
      contentObserver = null
    }
  }
  
  private fun checkForScreenshot(uri: Uri) {
    val context = appContext.reactContext ?: return
    
    try {
      val cursor = context.contentResolver.query(
        uri,
        arrayOf(
          MediaStore.Images.Media.DATA,
          MediaStore.Images.Media.DATE_ADDED
        ),
        null,
        null,
        MediaStore.Images.Media.DATE_ADDED + " DESC"
      )
      
      cursor?.use { c ->
        if (c.moveToFirst()) {
          val dataIndex = c.getColumnIndex(MediaStore.Images.Media.DATA)
          val dateIndex = c.getColumnIndex(MediaStore.Images.Media.DATE_ADDED)
          
          if (dataIndex >= 0 && dateIndex >= 0) {
            val path = c.getString(dataIndex)
            val dateAdded = c.getLong(dateIndex)
            
            // Check if the image was added recently (within last 2 seconds) and is likely a screenshot
            val currentTime = System.currentTimeMillis() / 1000
            if (currentTime - dateAdded < 2 && isLikelyScreenshot(path)) {
              sendEvent("onScreenshotDetected", mapOf(
                "timestamp" to (dateAdded * 1000), // Convert to milliseconds
                "path" to path
              ))
            }
          }
        }
      }
    } catch (e: Exception) {
      Log.e("ScreenshotDetector", "Error checking for screenshot", e)
    }
  }
  
  private fun isLikelyScreenshot(path: String): Boolean {
    val lowercasePath = path.lowercase()
    return lowercasePath.contains("screenshot") || 
           lowercasePath.contains("screen_") ||
           lowercasePath.contains("screencap")
  }
}