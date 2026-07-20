// Package utm provides UTM parameter parsing and normalization.
package utm

import (
	"net/url"
	"strings"
)

// Platform click ID mappings
var platformClickIDs = map[string]string{
	"gclid":    "google",
	"fbclid":   "facebook",
	"msclkid":  "bing",
	"ttclid":   "tiktok",
	"li_fat_id": "linkedin",
}

// Non-standard source parameters (in priority order)
var nonStandardSourceParams = []string{
	"ref", "referrer", "refer", "source", "via",
	"from", "origin", "src", "channel", "aff", "affiliate", "partner",
}

// Params represents parsed UTM parameters.
type Params struct {
	Source   string // utm_source
	Medium   string // utm_medium
	Campaign string // utm_campaign
	Term     string // utm_term
	Content  string // utm_content
	Platform string // Detected platform from click ID
	RawParam string // Original non-standard param name
}

// IsEmpty returns true if no UTM params are set.
func (p *Params) IsEmpty() bool {
	return p.Source == "" && p.Medium == "" && p.Campaign == "" &&
		p.Term == "" && p.Content == ""
}

// Parse parses UTM parameters from a URL string.
func Parse(rawURL string) (*Params, error) {
	params := &Params{}
	if rawURL == "" {
		return params, nil
	}

	u, err := url.Parse(rawURL)
	if err != nil {
		return params, err
	}

	q := u.Query()

	// Parse standard UTM parameters
	params.Source = q.Get("utm_source")
	params.Medium = q.Get("utm_medium")
	params.Campaign = q.Get("utm_campaign")
	params.Term = q.Get("utm_term")
	params.Content = q.Get("utm_content")

	// If no utm_source, try platform click IDs
	if params.Source == "" {
		for param, platform := range platformClickIDs {
			if q.Get(param) != "" {
				params.Source = platform
				params.Platform = platform
				break
			}
		}
	}

	// If still no utm_source, try non-standard params
	if params.Source == "" {
		for _, nonStd := range nonStandardSourceParams {
			if val := q.Get(nonStd); val != "" {
				params.Source = val
				params.RawParam = nonStd
				break
			}
		}
	}

	return params, nil
}

// Normalize trims whitespace from all parameters.
func Normalize(params *Params) *Params {
	return &Params{
		Source:   strings.TrimSpace(params.Source),
		Medium:   strings.TrimSpace(params.Medium),
		Campaign: strings.TrimSpace(params.Campaign),
		Term:     strings.TrimSpace(params.Term),
		Content:  strings.TrimSpace(params.Content),
		Platform: params.Platform,
		RawParam: params.RawParam,
	}
}
