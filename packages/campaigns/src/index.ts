/**
 * Campaign System
 */

import { randomUUID } from 'crypto'

export interface Campaign {
  id: string
  name: string
  subject: string
  template: string
  status: 'draft' | 'scheduled' | 'sending' | 'sent'
  sentAt?: string
  stats: { sent: number; opens: number; clicks: number; bounces: number }
  createdAt: string
}

export interface CampaignSystem {
  createCampaign(data: { name: string; subject: string; template: string; segment?: string }): Promise<Campaign>
  sendToSegment(data: { campaignId: string; segment: string }): Promise<void>
  trackOpen(campaignId: string): Promise<void>
  trackClick(campaignId: string, link: string): Promise<void>
}

export function createCampaignSystem(): CampaignSystem {
  const campaigns: Map<string, Campaign> = new Map()

  return {
    async createCampaign({ name, subject, template, segment }) {
      const campaign: Campaign = {
        id: randomUUID(),
        name,
        subject,
        template,
        status: 'draft',
        stats: { sent: 0, opens: 0, clicks: 0, bounces: 0 },
        createdAt: new Date().toISOString(),
      }
      campaigns.set(campaign.id, campaign)
      return campaign
    },

    async sendToSegment({ campaignId, segment }) {
      const campaign = campaigns.get(campaignId)
      if (campaign) {
        campaign.status = 'sending'
        campaign.stats.sent += 100
        campaign.status = 'sent'
        campaign.sentAt = new Date().toISOString()
      }
    },

    async trackOpen(campaignId) {
      const campaign = campaigns.get(campaignId)
      if (campaign) campaign.stats.opens++
    },

    async trackClick(campaignId) {
      const campaign = campaigns.get(campaignId)
      if (campaign) campaign.stats.clicks++
    },
  }
}
