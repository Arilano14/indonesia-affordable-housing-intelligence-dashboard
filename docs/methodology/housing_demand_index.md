# Housing Demand Index Methodology

## Overview
The **Housing Demand Index** quantifies the relative pressure of housing demand across different provinces. Instead of purely reflecting absolute population numbers—which would heavily skew the index toward Java—the index uses a composite weighted approach of normalized demographic metrics.

## Calculation Methodology
The Demand Index is generated in a two-step process: calculating a raw demand composite, followed by a final Min-Max normalization.

### 1. Raw Demand Composite Formula
```text
RawDemand = (0.40 * PopulationScore) + 
            (0.40 * HouseholdScore) + 
            (0.20 * DensityScore)
```

### Components
- **PopulationScore (40%)**: Min-Max normalized value of the province's total population.
- **HouseholdScore (40%)**: Min-Max normalized value of the province's total number of families/households.
- **DensityScore (20%)**: Min-Max normalized value of population density (km²), which acts as a reliable proxy for urbanization and urban housing pressure.

### 2. Final Normalization
```text
DemandIndex = Normalize(RawDemand)
```
*Note: `Normalize()` represents Min-Max Normalization from 0 to 100.*

## Rationale
Using a weighted composite of normalized demographic indicators prevents severe zero-skewing. If raw population was used directly, extreme outliers (like West Java or East Java) would compress all other provinces (like Gorontalo or Maluku) to near-zero scores. By normalizing each indicator first, we maintain the structural relationships and relative demographic pressures of smaller provinces.
