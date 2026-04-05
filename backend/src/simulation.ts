import { Deal, Region, BaselineMetrics, SimulationParameters, SimulationResult } from './types';
import { stageProgress } from './metrics';

const Q3_START = new Date('2025-07-01');
const Q3_END   = new Date('2025-09-30');

//figuring out which week of the quater it is
function getWeekIndex(date: Date): number | null {
  const diff = date.getTime() - Q3_START.getTime();
  if (diff < 0) return null;

  const week = Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
  if (week >= 0 && week <= 12) {
    return week;
  }
  return null;
}


//calculating expected close date by making use of 'STAGES' declared in assumption 3
function getExpectedCloseDate(deal: Deal, avgCycle: number, delta: number): Date {
  let progress = 0.10;
  if (stageProgress[deal.stage]) {
    progress = stageProgress[deal.stage];
  }

  const remaining = avgCycle * (1 - progress);
  let finalDays = remaining + delta;
  if (finalDays < 1) {
    finalDays = 1;
  }

  const closeDate = new Date(deal.created_date);
  closeDate.setDate(closeDate.getDate() + Math.round(finalDays));
  return closeDate;
}

//Calculate revenue for each week in the quater and store in an array
//Assumption 8: Each week's revenue is the total deal value from deals closed in that week (mentioned in assumptions)
function runRevenueCalc(
  deals: Deal[], 
  metrics: BaselineMetrics, 
  cDelta: number, 
  sDelta: number, 
  cyDelta: number
) {
  const weeklyRevenue = new Array(13).fill(0);
  let totalRevenue = 0;

  for (const deal of deals) {
    const region = deal.region as Region;
    const regionMetrics = metrics.byRegion[region];

    //assumption 7: capping input (mentioned in assumptions)
    let convRate = regionMetrics.conversionRate * (1 + cDelta / 100);
    if (convRate > 1) {
      convRate = 1;
    }
    const dealSize = regionMetrics.avgDealSize * (1 + sDelta / 100);

    const closeDate = getExpectedCloseDate(deal, metrics.avgSalesCycleDays, cyDelta);

    if (closeDate <= Q3_END) {
      const week = getWeekIndex(closeDate);
      if (week !== null) {
        const expectedValue = convRate * dealSize;
        weeklyRevenue[week] += expectedValue;
        totalRevenue += expectedValue;
      }
    }
  }

  return { weeklyRevenue, totalRevenue };
}

//Creating the driver message based on user given parameters
function getDriversList(params: SimulationParameters): string[] {
  const drivers: string[] = [];

  if (params.conversionRateDelta > 0) {
    drivers.push("Increased conversion rate by " + params.conversionRateDelta + "%");
  } else if (params.conversionRateDelta < 0) {
    drivers.push("Decreased conversion rate by " + Math.abs(params.conversionRateDelta) + "%");
  }

  if (params.avgDealSizeDelta > 0) {
    drivers.push("Increased average deal size by " + params.avgDealSizeDelta + "%");
  } else if (params.avgDealSizeDelta < 0) {
    drivers.push("Decreased average deal size by " + Math.abs(params.avgDealSizeDelta) + "%");
  }

  if (params.salesCycleDelta > 0) {
    drivers.push("Extended sales cycle by " + params.salesCycleDelta + " days — shifting close dates later");
  } else if (params.salesCycleDelta < 0) {
    drivers.push("Reduced sales cycle by " + Math.abs(params.salesCycleDelta) + " days — shifting close dates earlier");
  }

  return drivers;
}

//running the simulation
export function runSimulation(
  q3Deals: Deal[],
  metrics: BaselineMetrics,
  params: SimulationParameters
): SimulationResult {
  const baseline = runRevenueCalc(q3Deals, metrics, 0, 0, 0);
  const scenario = runRevenueCalc(
    q3Deals, 
    metrics,
    params.conversionRateDelta,
    params.avgDealSizeDelta,
    params.salesCycleDelta
  );

  const diff = scenario.totalRevenue - baseline.totalRevenue;
  let percent = 0;
  if (baseline.totalRevenue !== 0) {
    percent = (diff / baseline.totalRevenue) * 100;
  }

  return {
    baseline,
    scenario,
    impact: {
      absolute: Math.round(diff),
      percentage: Math.round(percent * 10) / 10
    },
    drivers: getDriversList(params)
  };
}