// src/lib/kpiEngine.ts

export interface RawProvinceData {
  Province: string;
  AverageHousePrice: number;
  AnnualHouseholdIncome: number;
  CurrentPropertyPrice: number;
  PreviousPropertyPrice: number;
  HomeOwners: number;
  TotalHouseholds: number;
  InterestRate: number;
  HousingBacklog: number;
  UrbanPopulationGrowth: number;
  NewHousingSupply: number;
  GDPPerCapita: number;
  InflationRate: number;
  PovertyRate: number;
  GiniIndex: number;
  UnemploymentRate: number;
  Population: number;
  StabilityScore: number;
}

export interface CalculatedKPIs {
  Province: string;
  AffordabilityIndex: number;
  PropertyPriceGrowth: number;
  OwnershipRate: number;
  HousingBacklog: number;
  MortgageScore: number;
  HousingIntelligenceScore: number;
  RiskLevel: "Critical" | "Warning" | "Moderate" | "Excellent";
  // Extra fields for charts
  AnnualHouseholdIncome: number;
  AverageHousePrice: number;
  Population: number;
  UrbanPopulationGrowth: number;
  NewHousingSupply: number;
  GDPPerCapita: number;
  InflationRate: number;
  InterestRate: number;
  PovertyRate: number;
}

export function normalize(value: number, min: number, max: number, inverse = false): number {
  if (max === min) return 50;
  let score = ((value - min) / (max - min)) * 100;
  if (inverse) {
    score = 100 - score;
  }
  return Math.max(0, Math.min(100, score));
}

export function calculateKPIs(data: RawProvinceData[]): CalculatedKPIs[] {
  // Find mins and maxes for normalization
  const affValues = data.map(d => d.AverageHousePrice / d.AnnualHouseholdIncome);
  const ownValues = data.map(d => (d.HomeOwners / d.TotalHouseholds) * 100);
  const interestValues = data.map(d => d.InterestRate);
  
  const minAff = Math.min(...affValues);
  const maxAff = Math.max(...affValues);
  const minOwn = Math.min(...ownValues);
  const maxOwn = Math.max(...ownValues);
  const minInt = Math.min(...interestValues);
  const maxInt = Math.max(...interestValues);

  return data.map(d => {
    // 1. Affordability Index (Higher = Less Affordable)
    const affordabilityIndex = d.AverageHousePrice / d.AnnualHouseholdIncome;
    
    // 2. Property Price Growth
    const propertyPriceGrowth = ((d.CurrentPropertyPrice - d.PreviousPropertyPrice) / d.PreviousPropertyPrice) * 100;
    
    // 3. Ownership Rate
    const ownershipRate = (d.HomeOwners / d.TotalHouseholds) * 100;
    
    // 4. Mortgage Accessibility Score
    const normAffordability = normalize(affordabilityIndex, minAff, maxAff, true); // Inverse: low aff is good
    const normInterest = normalize(d.InterestRate, minInt, maxInt, true); // Inverse: low interest is good
    const mortgageScore = (normAffordability * 0.5) + (normInterest * 0.5);
    
    // 5. Housing Intelligence Score
    const affScore = normAffordability;
    const ownScore = normalize(ownershipRate, minOwn, maxOwn);
    const mortScore = mortgageScore;
    const stabScore = d.StabilityScore; // Assuming already 0-100 from DB

    const intelligenceScore = 
      (0.40 * affScore) + 
      (0.20 * ownScore) + 
      (0.20 * mortScore) + 
      (0.20 * stabScore);

    // 6. Classification
    let riskLevel: "Critical" | "Warning" | "Moderate" | "Excellent" = "Moderate";
    if (intelligenceScore >= 80) riskLevel = "Excellent";
    else if (intelligenceScore >= 60) riskLevel = "Moderate";
    else if (intelligenceScore >= 40) riskLevel = "Warning";
    else riskLevel = "Critical";

    return {
      Province: d.Province,
      AffordabilityIndex: Number(affordabilityIndex.toFixed(1)),
      PropertyPriceGrowth: Number(propertyPriceGrowth.toFixed(1)),
      OwnershipRate: Number(ownershipRate.toFixed(1)),
      HousingBacklog: d.HousingBacklog,
      MortgageScore: Number(mortgageScore.toFixed(1)),
      HousingIntelligenceScore: Number(intelligenceScore.toFixed(1)),
      RiskLevel: riskLevel,
      AnnualHouseholdIncome: d.AnnualHouseholdIncome,
      AverageHousePrice: d.AverageHousePrice,
      Population: d.Population,
      UrbanPopulationGrowth: d.UrbanPopulationGrowth,
      NewHousingSupply: d.NewHousingSupply,
      GDPPerCapita: d.GDPPerCapita,
      InflationRate: d.InflationRate,
      InterestRate: d.InterestRate,
      PovertyRate: d.PovertyRate
    };
  });
}
