package com.tanstackship.utm;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/**
 * UTM URL Parser for Java
 * 
 * @example
 * ```java
 * UtmParams params = UtmParser.parse("https://example.com?utm_source=google");
 * System.out.println(params.getSource()); // "google"
 * ```
 */
public class UtmParser {
    
    private static final Map<String, String> PLATFORM_CLICK_IDS = new HashMap<>();
    private static final String[] NON_STANDARD_SOURCE_PARAMS = {
        "ref", "referrer", "refer", "source", "via", "from", "origin", "src"
    };

    static {
        PLATFORM_CLICK_IDS.put("gclid", "google");
        PLATFORM_CLICK_IDS.put("fbclid", "facebook");
        PLATFORM_CLICK_IDS.put("msclkid", "bing");
        PLATFORM_CLICK_IDS.put("ttclid", "tiktok");
        PLATFORM_CLICK_IDS.put("li_fat_id", "linkedin");
    }

    /**
     * Parse UTM parameters from URL string
     */
    public static UtmParams parse(String urlString) {
        UtmParams params = new UtmParams();
        
        if (urlString == null || urlString.isEmpty()) {
            return params;
        }

        try {
            URI uri = URI.create(urlString);
            String query = uri.getQuery();
            
            if (query == null || query.isEmpty()) {
                return params;
            }

            Map<String, String> queryParams = parseQueryString(query);

            // Parse standard UTM params
            params.setSource(queryParams.get("utm_source"));
            params.setMedium(queryParams.get("utm_medium"));
            params.setCampaign(queryParams.get("utm_campaign"));
            params.setTerm(queryParams.get("utm_term"));
            params.setContent(queryParams.get("utm_content"));

            // If no utm_source, try platform click IDs
            if (params.getSource() == null) {
                for (Map.Entry<String, String> entry : PLATFORM_CLICK_IDS.entrySet()) {
                    if (queryParams.containsKey(entry.getKey())) {
                        params.setSource(entry.getValue());
                        params.setPlatform(entry.getValue());
                        break;
                    }
                }
            }

            // If still no source, try non-standard params
            if (params.getSource() == null) {
                for (String param : NON_STANDARD_SOURCE_PARAMS) {
                    if (queryParams.containsKey(param)) {
                        params.setSource(queryParams.get(param));
                        break;
                    }
                }
            }

        } catch (Exception e) {
            // Invalid URL, return empty params
        }

        return params;
    }

    private static Map<String, String> parseQueryString(String query) {
        Map<String, String> params = new HashMap<>();
        
        for (String pair : query.split("&")) {
            int idx = pair.indexOf("=");
            if (idx > 0) {
                String key = URLDecoder.decode(pair.substring(0, idx), StandardCharsets.UTF_8);
                String value = URLDecoder.decode(pair.substring(idx + 1), StandardCharsets.UTF_8);
                params.put(key, value);
            }
        }
        
        return params;
    }

    public static void main(String[] args) {
        UtmParams params = UtmParser.parse("https://example.com?utm_source=google&utm_campaign=spring");
        System.out.println("Source: " + params.getSource());
        System.out.println("Campaign: " + params.getCampaign());
    }
}
