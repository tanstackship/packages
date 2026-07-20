using System.Web;

namespace TanStackShip.UtmParse;

/// <summary>
/// UTM URL Parser for .NET
/// </summary>
public static class UtmParser
{
    private static readonly Dictionary<string, string> PlatformClickIds = new()
    {
        ["gclid"] = "google",
        ["fbclid"] = "facebook",
        ["msclkid"] = "bing",
        ["ttclid"] = "tiktok",
        ["li_fat_id"] = "linkedin"
    };

    private static readonly string[] NonStandardSourceParams = 
    {
        "ref", "referrer", "refer", "source", "via", "from", "origin", "src"
    };

    /// <summary>
    /// Parse UTM parameters from URL string
    /// </summary>
    /// <param name="urlString">URL to parse</param>
    /// <returns>UtmParams object</returns>
    /// <example>
    /// ```csharp
    /// var params = UtmParser.Parse("https://example.com?utm_source=google");
    /// Console.WriteLine(params.Source); // "google"
    /// ```
    /// </example>
    public static UtmParams Parse(string urlString)
    {
        var result = new UtmParams();

        if (string.IsNullOrEmpty(urlString))
            return result;

        try
        {
            var uri = new Uri(urlString);
            var query = HttpUtility.ParseQueryString(uri.Query);

            // Parse standard UTM params
            result.Source = query["utm_source"];
            result.Medium = query["utm_medium"];
            result.Campaign = query["utm_campaign"];
            result.Term = query["utm_term"];
            result.Content = query["utm_content"];

            // If no utm_source, try platform click IDs
            if (string.IsNullOrEmpty(result.Source))
            {
                foreach (var (param, platform) in PlatformClickIds)
                {
                    if (!string.IsNullOrEmpty(query[param]))
                    {
                        result.Source = platform;
                        result.Platform = platform;
                        break;
                    }
                }
            }

            // If still no source, try non-standard params
            if (string.IsNullOrEmpty(result.Source))
            {
                foreach (var param in NonStandardSourceParams)
                {
                    if (!string.IsNullOrEmpty(query[param]))
                    {
                        result.Source = query[param];
                        break;
                    }
                }
            }
        }
        catch
        {
            // Invalid URL, return empty params
        }

        return result;
    }
}
