
import 'utm_params.dart';

/// UTM URL Parser for Dart
class UtmParser {
  static const Map<String, String> _platformClickIds = {
    'gclid': 'google',
    'fbclid': 'facebook',
    'msclkid': 'bing',
    'ttclid': 'tiktok',
    'li_fat_id': 'linkedin',
  };

  static const List<String> _nonStandardSourceParams = [
    'ref',
    'referrer',
    'refer',
    'source',
    'via',
    'from',
    'origin',
    'src',
  ];

  /// Parse UTM parameters from URL string
  ///
  /// @example
  /// ```dart
  /// final params = UtmParser.parse("https://example.com?utm_source=google");
  /// print(params.source); // "google"
  /// ```
  static UtmParams parse(String urlString) {
    if (urlString.isEmpty) {
      return const UtmParams();
    }

    try {
      final uri = Uri.parse(urlString);
      final queryParams = uri.queryParameters;

      String? source = queryParams['utm_source'];
      final medium = queryParams['utm_medium'];
      final campaign = queryParams['utm_campaign'];
      final term = queryParams['utm_term'];
      final content = queryParams['utm_content'];
      String? platform;

      // If no utm_source, try platform click IDs
      if (source == null) {
        for (final entry in _platformClickIds.entries) {
          if (queryParams.containsKey(entry.key)) {
            source = entry.value;
            platform = entry.value;
            break;
          }
        }
      }

      // If still no source, try non-standard params
      if (source == null) {
        for (final param in _nonStandardSourceParams) {
          final value = queryParams[param];
          if (value != null && value.isNotEmpty) {
            source = value;
            break;
          }
        }
      }

      return UtmParams(
        source: source,
        medium: medium,
        campaign: campaign,
        term: term,
        content: content,
        platform: platform,
      );
    } catch (e) {
      return const UtmParams();
    }
  }
}
