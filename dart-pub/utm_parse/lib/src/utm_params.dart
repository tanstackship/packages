/// UTM Parameters container
class UtmParams {
  final String? source;
  final String? medium;
  final String? campaign;
  final String? term;
  final String? content;
  final String? platform;

  const UtmParams({
    this.source,
    this.medium,
    this.campaign,
    this.term,
    this.content,
    this.platform,
  });

  bool get isEmpty =>
      source == null &&
      medium == null &&
      campaign == null &&
      term == null &&
      content == null;

  @override
  String toString() =>
      'UtmParams(source: $source, medium: $medium, campaign: $campaign)';

  Map<String, dynamic> toMap() {
    return {
      if (source != null) 'source': source,
      if (medium != null) 'medium': medium,
      if (campaign != null) 'campaign': campaign,
      if (term != null) 'term': term,
      if (content != null) 'content': content,
      if (platform != null) 'platform': platform,
    };
  }
}
