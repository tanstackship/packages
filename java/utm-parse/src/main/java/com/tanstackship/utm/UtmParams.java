package com.tanstackship.utm;

/**
 * UTM Parameters container
 */
public class UtmParams {
    private String source;
    private String medium;
    private String campaign;
    private String term;
    private String content;
    private String platform;

    public UtmParams() {}

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getMedium() { return medium; }
    public void setMedium(String medium) { this.medium = medium; }

    public String getCampaign() { return campaign; }
    public void setCampaign(String campaign) { this.campaign = campaign; }

    public String getTerm() { return term; }
    public void setTerm(String term) { this.term = term; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }

    public boolean isEmpty() {
        return source == null && medium == null && campaign == null 
            && term == null && content == null;
    }

    @Override
    public String toString() {
        return "UtmParams{source=" + source + ", medium=" + medium + 
               ", campaign=" + campaign + ", term=" + term + 
               ", content=" + content + "}";
    }
}
