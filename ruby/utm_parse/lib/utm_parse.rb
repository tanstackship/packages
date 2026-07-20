# frozen_string_literal: true

require 'uri'
require 'cgi'

module UtmParse
  # Platform click IDs
  PLATFORM_CLICK_IDS = {
    'gclid' => 'google',
    'fbclid' => 'facebook',
    'msclkid' => 'bing',
    'ttclid' => 'tiktok',
    'li_fat_id' => 'linkedin'
  }.freeze

  # Non-standard source parameters
  NON_STANDARD_SOURCE_PARAMS = %w[
    ref referrer refer source via from origin src
  ].freeze

  # Struct for UTM params
  class Params
    attr_accessor :source, :medium, :campaign, :term, :content, :platform

    def initialize
      @source = nil
      @medium = nil
      @campaign = nil
      @term = nil
      @content = nil
      @platform = nil
    end

    def empty?
      source.nil? && medium.nil? && campaign.nil? && term.nil? && content.nil?
    end

    def to_h
      {
        source: source,
        medium: medium,
        campaign: campaign,
        term: term,
        content: content,
        platform: platform
      }.compact
    end
  end

  class << self
    # Parse UTM parameters from URL string
    #
    # @param url_string [String] URL to parse
    # @return [Params] UTM params
    #
    # @example
    #   params = UtmParse.parse("https://example.com?utm_source=google")
    #   params.source # => "google"
    def parse(url_string)
      params = Params.new
      return params if url_string.nil? || url_string.empty?

      uri = URI.parse(url_string)
      return params unless uri.query

      query_params = CGI.parse(uri.query)

      # Parse standard UTM params
      params.source = query_params['utm_source']&.first
      params.medium = query_params['utm_medium']&.first
      params.campaign = query_params['utm_campaign']&.first
      params.term = query_params['utm_term']&.first
      params.content = query_params['utm_content']&.first

      # If no utm_source, try platform click IDs
      if params.source.nil?
        PLATFORM_CLICK_IDS.each do |click_id, platform|
          if query_params.key?(click_id)
            params.source = platform
            params.platform = platform
            break
          end
        end
      end

      # If still no source, try non-standard params
      if params.source.nil?
        NON_STANDARD_SOURCE_PARAMS.each do |param|
          if query_params.key?(param)
            params.source = query_params[param].first
            break
          end
        end
      end

      params
    end
  end
end
