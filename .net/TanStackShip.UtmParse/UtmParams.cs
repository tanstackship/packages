namespace TanStackShip.UtmParse;

/// <summary>
/// UTM Parameters container
/// </summary>
public class UtmParams
{
    /// <summary>utm_source - the referrer</summary>
    public string? Source { get; set; }

    /// <summary>utm_medium - marketing medium</summary>
    public string? Medium { get; set; }

    /// <summary>utm_campaign - campaign name</summary>
    public string? Campaign { get; set; }

    /// <summary>utm_term - paid search keyword</summary>
    public string? Term { get; set; }

    /// <summary>utm_content - ad content</summary>
    public string? Content { get; set; }

    /// <summary>Detected platform from click ID</summary>
    public string? Platform { get; set; }

    /// <summary>Check if all UTM params are empty</summary>
    public bool IsEmpty => 
        Source == null && 
        Medium == null && 
        Campaign == null && 
        Term == null && 
        Content == null;

    public override string ToString() =>
        $"UtmParams(Source={Source}, Medium={Medium}, Campaign={Campaign})";
}
