library utm_parse;

// Export everything from src
export 'src/utm_params.dart';
export 'src/utm_parser.dart';

// Import for internal use
import 'src/utm_params.dart';
import 'src/utm_parser.dart';

/// Parse UTM parameters from a URL
///
/// ```dart
/// import 'package:utm_parse/utm_parse.dart';
///
/// void main() {
///   final params = parseUrl("https://example.com?utm_source=google");
///   print(params.source); // google
/// }
/// ```
UtmParams parseUrl(String url) => UtmParser.parse(url);
