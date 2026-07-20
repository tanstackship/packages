Pod::Spec.new do |s|
  s.name             = 'UtmParse'
  s.version          = '0.1.0'
  s.summary          = 'Fast UTM parameter parsing library'
  s.description      = <<-DESC
    Parse and normalize UTM parameters from URLs in Swift/Objective-C.
    Supports standard UTM parameters and auto-detection of click IDs (Google GCLID, Facebook FBCLID).
  DESC
  s.homepage         = 'https://tanstackship.com'
  s.license          = { :type => 'MIT', :file => 'LICENSE' }
  s.author           = { 'Huifer' => 'about@tanstackship.com' }
  s.source           = { :git => 'https://github.com/tanstackship/packages.git', :tag => s.version.to_s }

  s.ios.deployment_target = '13.0'
  s.osx.deployment_target = '10.15'

  s.source_files = 'Sources/**/*.{swift,h,m}'
  s.swift_version = '5.0'
end
