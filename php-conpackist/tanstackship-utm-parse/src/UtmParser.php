<?php

declare(strict_types=1);

namespace TanStackShip\UtmParse;

/**
 * UTM URL Parser for PHP
 */
final class UtmParser
{
    private const PLATFORM_CLICK_IDS = [
        'gclid' => 'google',
        'fbclid' => 'facebook',
        'msclkid' => 'bing',
        'ttclid' => 'tiktok',
        'li_fat_id' => 'linkedin',
    ];

    private const NON_STANDARD_SOURCE_PARAMS = [
        'ref',
        'referrer',
        'refer',
        'source',
        'via',
        'from',
        'origin',
        'src',
    ];

    /**
     * Parse UTM parameters from URL string
     *
     * @param string|null $urlString URL to parse
     * @return Params UTM params
     *
     * @example
     * ```php
     * $params = UtmParser::parse("https://example.com?utm_source=google");
     * echo $params->source; // "google"
     * ```
     */
    public static function parse(?string $urlString): Params
    {
        $params = new Params();

        if ($urlString === null || $urlString === '') {
            return $params;
        }

        $parsed = parse_url($urlString);

        if (!isset($parsed['query'])) {
            return $params;
        }

        parse_str($parsed['query'], $query);

        // Parse standard UTM params
        $params->source = $query['utm_source'] ?? null;
        $params->medium = $query['utm_medium'] ?? null;
        $params->campaign = $query['utm_campaign'] ?? null;
        $params->term = $query['utm_term'] ?? null;
        $params->content = $query['utm_content'] ?? null;

        // If no utm_source, try platform click IDs
        if ($params->source === null) {
            foreach (self::PLATFORM_CLICK_IDS as $clickId => $platform) {
                if (isset($query[$clickId])) {
                    $params->source = $platform;
                    $params->platform = $platform;
                    break;
                }
            }
        }

        // If still no source, try non-standard params
        if ($params->source === null) {
            foreach (self::NON_STANDARD_SOURCE_PARAMS as $param) {
                if (isset($query[$param])) {
                    $params->source = $query[$param];
                    break;
                }
            }
        }

        return $params;
    }
}
