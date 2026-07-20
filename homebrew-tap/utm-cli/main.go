package main

import (
	"fmt"
	"os"

	"github.com/tanstackship/go-utm-parse"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: utm <url>")
		fmt.Println("Example: utm https://example.com?utm_source=google&utm_campaign=spring")
		os.Exit(1)
	}

	url := os.Args[1]
	params, err := utm.Parse(url)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("UTM Parameters:")
	fmt.Printf("  Source:   %s\n", params.Source)
	fmt.Printf("  Medium:   %s\n", params.Medium)
	fmt.Printf("  Campaign: %s\n", params.Campaign)
	fmt.Printf("  Term:     %s\n", params.Term)
	fmt.Printf("  Content:  %s\n", params.Content)

	if params.Platform != "" {
		fmt.Printf("  Platform: %s\n", params.Platform)
	}
}
