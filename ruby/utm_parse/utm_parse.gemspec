Gem::Specification.new do |spec|
  spec.name          = 'utm_parse'
  spec.version       = '0.1.0'
  spec.authors       = ['Huifer']
  spec.email         = ['about@tanstackship.com']
  spec.summary       = 'Fast UTM parameter parsing library'
  spec.description   = 'Parse and normalize UTM parameters from URLs in Ruby'
  spec.homepage      = 'https://tanstackship.com'
  spec.license       = 'MIT'
  spec.files         = ['lib/utm_parse.rb', 'lib/utm_parse/version.rb']
  spec.require_paths = ['lib']

  spec.required_ruby_version = '>= 2.7'

  spec.metadata = {
    'homepage_uri' => 'https://tanstackship.com',
    'source_code_uri' => 'https://github.com/orgs/tanstackship',
    'documentation_uri' => 'https://github.com/orgs/tanstackship'
  }
end
