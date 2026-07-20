<?php
/**
 * Plugin Name: UTM Tracker
 * Plugin URI: https://tanstackship.com
 * Description: Track and store UTM parameters in WordPress
 * Version: 1.0.0
 * Author: Huifer
 * Author URI: https://tanstackship.com/about
 * License: MIT
 * Text Domain: utm-tracker
 */

namespace TanStackShip\UtmTracker;

class UTM_Tracker {
    
    const COOKIE_NAME = '_utm';
    const COOKIE_EXPIRY = 2592000; // 30 days
    
    private static ?UTM_Tracker $instance = null;
    
    public static function get_instance(): UTM_Tracker {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        add_action('init', [$this, 'capture_utm']);
        add_shortcode('utm_source', [$this, 'shortcode_utm_source']);
    }
    
    /**
     * Capture UTM parameters from URL
     */
    public function capture_utm(): void {
        if (!isset($_GET['utm_source']) && !isset($_GET['utm_medium'])) {
            return;
        }
        
        $utm = [
            'utm_source' => isset($_GET['utm_source']) ? sanitize_text_field($_GET['utm_source']) : null,
            'utm_medium' => isset($_GET['utm_medium']) ? sanitize_text_field($_GET['utm_medium']) : null,
            'utm_campaign' => isset($_GET['utm_campaign']) ? sanitize_text_field($_GET['utm_campaign']) : null,
            'utm_term' => isset($_GET['utm_term']) ? sanitize_text_field($_GET['utm_term']) : null,
            'utm_content' => isset($_GET['utm_content']) ? sanitize_text_field($_GET['utm_content']) : null,
            'referrer' => isset($_SERVER['HTTP_REFERER']) ? esc_url($_SERVER['HTTP_REFERER']) : null,
            'captured_at' => current_time('c'),
        ];
        
        // Set cookie if not already set
        if (!isset($_COOKIE[self::COOKIE_NAME])) {
            setcookie(self::COOKIE_NAME, json_encode($utm), time() + self::COOKIE_EXPIRY, '/');
        }
    }
    
    /**
     * Get stored UTM data
     */
    public function get_utm(): array {
        if (isset($_COOKIE[self::COOKIE_NAME])) {
            return json_decode(stripslashes($_COOKIE[self::COOKIE_NAME]), true);
        }
        return [];
    }
    
    /**
     * Shortcode to display UTM source
     */
    public function shortcode_utm_source($atts): string {
        $utm = $this->get_utm();
        $default = $atts['default'] ?? '';
        return $utm['utm_source'] ?? $default;
    }
}

// Initialize
add_action('plugins_loaded', function() {
    UTM_Tracker::get_instance();
});
