package utm

import (
	"testing"
)

func TestParse_Standard(t *testing.T) {
	params, err := Parse("https://example.com?utm_source=google&utm_campaign=spring")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if params.Source != "google" {
		t.Errorf("expected source 'google', got '%s'", params.Source)
	}
	if params.Campaign != "spring" {
		t.Errorf("expected campaign 'spring', got '%s'", params.Campaign)
	}
}

func TestParse_PlatformClickID(t *testing.T) {
	params, err := Parse("https://example.com?fbclid=abc123")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if params.Source != "facebook" {
		t.Errorf("expected source 'facebook', got '%s'", params.Source)
	}
	if params.Platform != "facebook" {
		t.Errorf("expected platform 'facebook', got '%s'", params.Platform)
	}
}

func TestParse_NonStandard(t *testing.T) {
	params, err := Parse("https://example.com?ref=producthunt")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if params.Source != "producthunt" {
		t.Errorf("expected source 'producthunt', got '%s'", params.Source)
	}
	if params.RawParam != "ref" {
		t.Errorf("expected raw_param 'ref', got '%s'", params.RawParam)
	}
}

func TestParse_Empty(t *testing.T) {
	params, err := Parse("")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !params.IsEmpty() {
		t.Error("expected empty params")
	}
}

func TestNormalize(t *testing.T) {
	params := &Params{
		Source:   "  google  ",
		Campaign: "spring  ",
	}
	normalized := Normalize(params)
	if normalized.Source != "google" {
		t.Errorf("expected 'google', got '%s'", normalized.Source)
	}
}
