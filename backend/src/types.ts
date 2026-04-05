//This file defines the type for all the interpreted data from csv files and is the blueprint of data passed to frontend
export interface Deal {
  deal_id: string
  created_date: Date
  closed_date: Date | null
  stage: 'Lead' | 'Qualified' | 'Proposal' | 'Closed Won' | 'Closed Lost'
  deal_value: number
  region: 'US' | 'EU' | 'APAC'
  source: 'Inbound' | 'Outbound' | 'Partner'
}

export type Region = 'US' | 'EU' | 'APAC'

export interface RegionMetrics {
  conversionRate: number
  avgDealSize: number
}

export interface BaselineMetrics {
  byRegion: Record<Region, RegionMetrics>
  avgSalesCycleDays: number
}

export interface SimulationParameters {
  conversionRateDelta: number  
  avgDealSizeDelta: number     
  salesCycleDelta: number   
}

export interface SimulationResult {
  baseline: {
    weeklyRevenue: number[]
    totalRevenue: number
  }
  scenario: {
    weeklyRevenue: number[]
    totalRevenue: number
  }
  impact: {
    absolute: number
    percentage: number
  }
  drivers: string[]
}