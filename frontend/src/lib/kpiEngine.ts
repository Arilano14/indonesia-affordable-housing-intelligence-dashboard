// src/lib/kpiEngine.ts

export interface MergedProvinceData {
  Province: string;
  Year: number;
  Population: number;
  Households: number;
  OwnershipRate: number;
  BacklogOwnershipPercent: number;
  BacklogRTLHPercent: number;
  TotalBacklogPercent: number;
  GDPPerCapita: number;
  PovertyRate: number;
  UrbanPopulation: number;
  InterestRate: number;
  GiniIndex: number;
  DemandIndex: number;
  SupplyIndex: number;
  AccessibilityIndex: number;
  MortgageAccessibility: number;
  HousingScore: number;
}

export interface CalculatedKPIs extends MergedProvinceData {
  RiskLevel: "Critical" | "High Risk" | "Moderate" | "Low Risk";
  HOGIScore: number;
  HOGICategory: "Low Gap" | "Moderate Gap" | "High Gap" | "Severe Gap";
  ArchetypeCluster: "A - Emerging Housing Markets" | "B - High Growth Housing Stress" | "C - Social Vulnerability Zone" | "D - Balanced Housing Region" | "E - Unclassified";
}

export const getTrafficLightColor = (value: number, inverse = false) => {
  if (inverse) {
    return value >= 30 ? '#DC2626' : value >= 15 ? '#D97706' : '#16A34A'; 
  }
  return value >= 75 ? '#16A34A' : value >= 50 ? '#D97706' : '#DC2626'; 
};

export function calculateKPIs(data: MergedProvinceData[]): CalculatedKPIs[] {
  if (!data || data.length === 0) return [];

  const avgGDP = data.reduce((acc, curr) => acc + curr.GDPPerCapita, 0) / data.length;
  const avgBacklog = data.reduce((acc, curr) => acc + curr.TotalBacklogPercent, 0) / data.length;
  const avgPoverty = data.reduce((acc, curr) => acc + curr.PovertyRate, 0) / data.length;
  const avgOwnership = data.reduce((acc, curr) => acc + curr.OwnershipRate, 0) / data.length;

  return data.map(d => {
    // Risk Classification (White Paper Logic)
    let riskLevel: "Critical" | "High Risk" | "Moderate" | "Low Risk" = "Moderate";
    if (d.HousingScore >= 80) riskLevel = "Low Risk";
    else if (d.HousingScore >= 60) riskLevel = "Moderate";
    else if (d.HousingScore >= 40) riskLevel = "High Risk";
    else riskLevel = "Critical";

    // Housing Opportunity Gap Index (HOGI)
    // 0.35*BacklogScore + 0.25*PovertyScore + 0.20*OwnershipGap + 0.20*AccessibilityGap
    const backlogScore = Math.min(d.TotalBacklogPercent * 2, 100); // normalize slightly
    const povertyScore = Math.min(d.PovertyRate * 5, 100); // typical poverty is < 20%
    const ownershipGap = Math.max(0, 100 - d.OwnershipRate);
    const accessibilityGap = Math.max(0, 100 - (d.MortgageAccessibility || 50));
    
    let hogi = (0.35 * backlogScore) + (0.25 * povertyScore) + (0.20 * ownershipGap) + (0.20 * accessibilityGap);
    hogi = Math.min(Math.max(hogi, 0), 100);

    let hogiCat: "Low Gap" | "Moderate Gap" | "High Gap" | "Severe Gap" = "Low Gap";
    if (hogi > 75) hogiCat = "Severe Gap";
    else if (hogi > 50) hogiCat = "High Gap";
    else if (hogi > 25) hogiCat = "Moderate Gap";

    // Archetype Clustering
    let archetype: CalculatedKPIs["ArchetypeCluster"] = "E - Unclassified";
    
    const isHighGDP = d.GDPPerCapita > avgGDP;
    const isHighBacklog = d.TotalBacklogPercent > avgBacklog;
    const isHighPoverty = d.PovertyRate > avgPoverty;
    const isLowOwnership = d.OwnershipRate < avgOwnership;
    const isHighScore = d.HousingScore >= 60;

    if (isHighGDP && !isHighBacklog) {
      archetype = "A - Emerging Housing Markets";
    } else if (isHighGDP && isHighBacklog) {
      archetype = "B - High Growth Housing Stress";
    } else if (isHighPoverty && isLowOwnership) {
      archetype = "C - Social Vulnerability Zone";
    } else if (isHighScore && !isHighBacklog) {
      archetype = "D - Balanced Housing Region";
    } else {
      // Fallbacks
      if (isHighBacklog) archetype = "B - High Growth Housing Stress";
      else archetype = "A - Emerging Housing Markets";
    }

    return {
      ...d,
      RiskLevel: riskLevel,
      HOGIScore: hogi,
      HOGICategory: hogiCat,
      ArchetypeCluster: archetype
    };
  });
}

// Pearson Correlation
export function pearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  if (n === 0) return 0;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumX2 = x.reduce((a, b) => a + b * b, 0);
  const sumY2 = y.reduce((a, b) => a + b * b, 0);
  const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  if (denominator === 0) return 0;
  return numerator / denominator;
}

// Scenario Simulations
export function simulateScenarios(nationalData: any) {
  // nationalData is the aggregated metrics
  const currentScore = nationalData.HousingScore || 65;
  const currentBacklog = nationalData.TotalBacklogPercent || 15;
  const currentPoverty = nationalData.PovertyRate || 10;
  const currentAccess = nationalData.MortgageAccessibility || 50;

  // Simplified simulation model logic:
  // Backlog -10% => Score improves by +5 points
  const sim1_score = Math.min(100, currentScore + 5.2);
  
  // Poverty -5% => Score improves by +3 points
  const sim2_score = Math.min(100, currentScore + 3.1);

  // Accessibility +15% => Score improves by +7 points
  const sim3_score = Math.min(100, currentScore + 7.5);

  return {
    scenario1: { name: "Backlog Reduction (10%)", newScore: sim1_score, diff: sim1_score - currentScore },
    scenario2: { name: "Poverty Reduction (5%)", newScore: sim2_score, diff: sim2_score - currentScore },
    scenario3: { name: "Accessibility Improvement (15%)", newScore: sim3_score, diff: sim3_score - currentScore }
  };
}
