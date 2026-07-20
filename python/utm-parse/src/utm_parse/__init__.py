"""
utm_parse - Fast UTM parameter parsing library

A Python port of the utm-parse Rust library.
"""

__version__ = "0.1.0"

from .parser import parse_utm_from_url, normalize, UtmParams

__all__ = ["parse_utm_from_url", "normalize", "UtmParams", "__version__"]
