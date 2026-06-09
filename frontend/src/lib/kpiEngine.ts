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
  InflationRate: number;
  GiniIndex: number;
  DemandIndex: number;
  SupplyIndex: number;
  AccessibilityIndex: number;
  MortgageAccessibility: number;
  HousingScore: number;
}

export interface CalculatedKPIs extends MergedProvinceData {
  RiskLevel: "Critical" | "Warning" | "Moderate" | "Healthy";
}

export function calculateKPIs(data: MergedProvinceData[]): CalculatedKPIs[] {
  return data.map(d => {
    // 6. Classification (as per strict Data Governance rules)
    let riskLevel: "Critical" | "Warning" | "Moderate" | "Healthy" = "Moderate";
    if (d.HousingScore >= 80) riskLevel = "Healthy";
    else if (d.HousingScore >= 60) riskLevel = "Moderate";
    else if (d.HousingScore >= 40) riskLevel = "Warning";
    else riskLevel = "Critical";

    return {
      ...d,
      RiskLevel: riskLevel
    };
  });
}

