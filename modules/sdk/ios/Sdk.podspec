Pod::Spec.new do |s|
  s.name           = 'Sdk'
  s.version        = '0.1.0'
  s.summary        = 'Wrapper del SDK Tixngo'
  s.description    = 'Wrapper del SDK Tixngo para Expo'
  s.author         = ''
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = { :ios => '17.6' }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  s.dependency 'Tixngo'

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end