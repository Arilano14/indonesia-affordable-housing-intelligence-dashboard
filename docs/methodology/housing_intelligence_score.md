# Housing Intelligence Score (HIS) Methodology

## Overview
The **Housing Intelligence Score (HIS)** is the core aggregate metric of the Indonesian Affordable Housing Intelligence Dashboard (IAHID). It provides a holistic evaluation of the housing landscape for each province by combining key dimensions of the housing market.

## Calculation Methodology
The HIS is a composite index constructed using weighted linear aggregation of four normalized foundational pillars.

### Formula
```text
HousingScore = (0.40 * AccessibilityIndex) + 
               (0.20 * OwnershipScore) + 
               (0.20 * MortgageAccessibility) + 
               (0.20 * SupplyIndex)
```

### Components
1. **Accessibility Index (40%)**: Reflects the baseline economic capacity of the population to access housing (incorporating GDP per capita, poverty rates, and existing backlog).
2. **Ownership Score (20%)**: The min-max normalized rate of homeownership (`100.0 - BacklogOwnershipPercent`), acting as a proxy for existing market success.
3. **Mortgage Accessibility (20%)**: Measures how conducive the macroeconomic environment (specifically the BI 7-Day Reverse Repo Rate) is for housing finance, combined with the baseline accessibility.
4. **Supply Index (20%)**: Measures the adequacy of housing supply by inversely penalizing ownership and RTLH (Rumah Tidak Layak Huni) backlogs.

## Normalization Process
All raw inputs that are not strictly bounded between 0 and 100 are transformed using **Min-Max Normalization**:
`Score = ((Value - Min) / (Max - Min)) * 100`
This ensures all metrics are directly comparable before applying weights.

## Risk Classification
Based on the final HIS, provinces are categorized under strict Data Governance rules:
- **Healthy**: `HIS >= 80`
- **Moderate**: `60 <= HIS < 80`
- **Warning**: `40 <= HIS < 60`
- **Critical**: `HIS < 40`
