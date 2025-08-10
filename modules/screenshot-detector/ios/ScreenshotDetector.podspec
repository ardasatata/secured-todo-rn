Pod::Spec.new do |s|
  s.name           = 'ScreenshotDetector'
  s.version        = '1.0.0'
  s.summary        = 'A native module for detecting screenshots'
  s.description    = 'A React Native Expo module for detecting when the user takes a screenshot'
  s.author         = ''
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = { :ios => '13.4', :tvos => '13.4' }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.ios.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
  s.tvos.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end