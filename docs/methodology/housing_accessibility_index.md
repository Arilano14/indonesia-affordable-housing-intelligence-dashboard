# Accessibility Index Methodology

## Overview
The **Accessibility Index** acts as the foundational metric for regional economic purchasing power and structural capability to access the housing market. It balances positive economic drivers against negative societal frictions.

## Calculation Methodology

### Formula
```text
AccessibilityIndex = (0.30 * GDPScore) + 
                     (0.30 * OwnershipScore) + 
                     (0.20 * PovertyInverseScore) + 
                     (0.20 * BacklogInverseScore)
```

### Components & Normalization
All inputs are subjected to Min-Max Normalization (`Normalize(x)`) across all provinces to achieve a 0-100 scale:
- **GDPScore (30%)**: `Normalize(GDP Per Capita)`
- **OwnershipScore (30%)**: `Normalize(OwnershipRate)`
- **PovertyInverseScore (20%)**: `100.0 - Normalize(Poverty Rate)`. Lower poverty yields a higher positive score.
- **BacklogInverseScore (20%)**: `100.0 - Normalize(Total Backlog Percent)`. Lower backlog yields a higher positive score.

## Rationale
By pairing GDP and current Ownership Rates (positive drivers) against Poverty and Backlogs (frictions), the Accessibility Index effectively ranks which regional economies are most structurally prepared to absorb new formal housing developments.
