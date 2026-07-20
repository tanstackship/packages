"""
UTM URL Parser

Parse and normalize UTM parameters from URLs.
"""

from dataclasses import dataclass, field
from typing import Optional
from urllib.parse import urlparse, parse_qs, unquote_plus

# Platform click ID mappings
PLATFORM_CLICK_IDS = {
    "gclid": "google",
    "fbclid": "facebook",
    "msclkid": "bing",
    "ttclid": "tiktok",
    "li_fat_id": "linkedin",
}

# Non-standard source parameters (in priority order)
NON_STANDARD_SOURCE_PARAMS = [
    "ref",
    "referrer",
    "refer",
    "source",
    "via",
    "from",
    "origin",
    "src",
    "channel",
    "aff",
    "affiliate",
    "partner",
]


@dataclass
class UtmParams:
    """UTM parameters container."""
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    utm_term: Optional[str] = None
    utm_content: Optional[str] = None
    referrer: Optional[str] = None
    platform: Optional[str] = None
    raw_param: Optional[str] = None

    def is_empty(self) -> bool:
        """Check if all UTM params are None."""
        return all(
            v is None
            for v in [
                self.utm_source,
                self.utm_medium,
                self.utm_campaign,
                self.utm_term,
                self.utm_content,
            ]
        )

    def to_dict(self) -> dict:
        """Convert to dictionary."""
        return {
            "utm_source": self.utm_source,
            "utm_medium": self.utm_medium,
            "utm_campaign": self.utm_campaign,
            "utm_term": self.utm_term,
            "utm_content": self.utm_content,
            "referrer": self.referrer,
            "platform": self.platform,
        }


def parse_utm_from_url(url: str) -> UtmParams:
    """
    Parse UTM parameters from a URL string.

    Args:
        url: URL string to parse

    Returns:
        UtmParams object with parsed values

    Example:
        >>> params = parse_utm_from_url("https://example.com?utm_source=google")
        >>> params.utm_source
        'google'
    """
    if not url:
        return UtmParams()

    params = UtmParams()

    try:
        parsed = urlparse(url)
        query_params = parse_qs(parsed.query)
    except Exception:
        return UtmParams()

    # Parse standard UTM parameters
    for key in ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]:
        values = query_params.get(key, [])
        if values:
            setattr(params, key, unquote_plus(values[0]))

    # If no utm_source, try platform click IDs
    if not params.utm_source:
        for param, source in PLATFORM_CLICK_IDS.items():
            if param in query_params:
                params.utm_source = source
                params.platform = source
                break

    # If still no utm_source, try non-standard params
    if not params.utm_source:
        for non_std in NON_STANDARD_SOURCE_PARAMS:
            values = query_params.get(non_std, [])
            if values:
                params.utm_source = unquote_plus(values[0])
                params.raw_param = non_std
                break

    return params


def normalize(params: UtmParams) -> UtmParams:
    """
    Normalize UTM params by trimming whitespace.

    Args:
        params: UtmParams object to normalize

    Returns:
        Normalized UtmParams object
    """
    def trim(val: Optional[str]) -> Optional[str]:
        if val is None:
            return None
        trimmed = val.strip()
        return trimmed if trimmed else None

    return UtmParams(
        utm_source=trim(params.utm_source),
        utm_medium=trim(params.utm_medium),
        utm_campaign=trim(params.utm_campaign),
        utm_term=trim(params.utm_term),
        utm_content=trim(params.utm_content),
        referrer=trim(params.referrer),
        platform=params.platform,
        raw_param=params.raw_param,
    )
