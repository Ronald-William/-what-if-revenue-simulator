export type Region = 'US' | 'EU' | 'APAC'

export interface RegionMetrics {
  conversionRate: number
  avgDealSize: number
}

export interface BaselineMetrics {
  byRegion: Record<Region, RegionMetrics>
  avgSalesCycleDays: number
}

export interface WeeklyData {
  weeklyRevenue: number[]
  totalRevenue: number
}

export interface SimulationResult {
  baseline: WeeklyData
  scenario: WeeklyData
  impact: {
    absolute: number
    percentage: number
  }
  drivers: string[]
}

export interface BaselineResponse extends SimulationResult {
  metrics: BaselineMetrics
}

export interface SimulationParams {
  conversionRateDelta: number
  avgDealSizeDelta: number
  salesCycleDelta: number
}