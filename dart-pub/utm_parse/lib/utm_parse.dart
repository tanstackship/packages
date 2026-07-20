/// UTM Parse - Fast UTM parameter parsing for Dart and Flutter
library utm_parse;

export 'src/utm_params.dart';
export 'src/utm_parser.dart';

/// Parse UTM parameters from a URL
///
/// ```dart
/// import 'package:utm_parse/utm_parse.dart';
///
/// void main() {
///   final params = parseUrl("https://example.com?utm_source=google&utm_campaign=spring");
///   print(params.source); // google
/// }
/// ```
UtmParams parseUrl(String url) {
  return UtmParser.parse(url);
}
