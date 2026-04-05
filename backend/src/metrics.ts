import { Deal, Region, BaselineMetrics, RegionMetrics } from './types';

const REGIONS: Region[] = ['US', 'EU', 'APAC'];

//assumption 3: stage specific cycle time (mentioned in my assumptions)
export const stageProgress: Record<string, number> = {
  'Lead': 0.10,
  'Qualified': 0.35,
  'Proposal': 0.65
};

/// assumption 5: calculating region specific metrics for more accurate results
function getRegionMetrics(q1Deals: Deal[], q2Deals: Deal[], region: Region): RegionMetrics {
  const q1 = q1Deals.filter(d => d.region === region);
  const q2 = q2Deals.filter(d => d.region === region);

  const calculateConv = (deals: Deal[]) => {
    const won = deals.filter(d => d.stage === 'Closed Won').length;
    const lost = deals.filter(d => d.stage === 'Closed Lost').length;
    const total = won + lost;
    if (total === 0) return 0;
    return won / total;
  };

  const calculateAvgSize = (deals: Deal[]) => {
    const wonDeals = deals.filter(d => d.stage === 'Closed Won');
    if (wonDeals.length === 0) return 0;
    
    let sum = 0;
    for (const d of wonDeals) {
      sum += d.deal_value;
    }
    return sum / wonDeals.length;
  };

  //Assumption 2: Quater 2 is weighted more heavily because it is more recent data
  const q1Weight = 0.4;
  const q2Weight = 0.6;

  const conversionRate = (calculateConv(q1) * q1Weight) + (calculateConv(q2) * q2Weight);
  const avgDealSize = (calculateAvgSize(q1) * q1Weight) + (calculateAvgSize(q2) * q2Weight);

  return { conversionRate, avgDealSize };
}

// average sales cycle time (this is not region specific)
function getAvgSalesCycle(q1: Deal[], q2: Deal[]): number {
  const allClosed = [...q1, ...q2].filter(d => d.closed_date);
  
  if (allClosed.length === 0) return 0;

  let totalDays = 0;
  for (const d of allClosed) {
    const diff = d.closed_date!.getTime() - d.created_date.getTime();
    totalDays += diff / (1000 * 60 * 60 * 24);
  }

  return totalDays / allClosed.length;
}

//computing baseline metrics for all regions
export function computeBaseline(q1: Deal[], q2: Deal[]): BaselineMetrics {
  const byRegion = {} as Record<Region, RegionMetrics>;

  for (const region of REGIONS) {
    byRegion[region] = getRegionMetrics(q1, q2, region);
  }

  return {
    byRegion,
    avgSalesCycleDays: getAvgSalesCycle(q1, q2)
  };
}