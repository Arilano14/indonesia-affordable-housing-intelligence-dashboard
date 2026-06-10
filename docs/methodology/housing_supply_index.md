# Housing Supply Index Methodology

## Overview
The **Housing Supply Index** measures the adequacy and quality of housing supply in a given province. It is derived inversely from the housing backlog data, operating on the premise that a higher backlog indicates a severe deficit in supply.

## Calculation Methodology
The calculation penalizes both the lack of homeownership and the prevalence of substandard housing (RTLH - Rumah Tidak Layak Huni).

### 1. Raw Supply Formula
```text
RawSupply = 100.0 - ((0.60 * BacklogOwnershipPercent) + 
                     (0.40 * BacklogRTLHPercent))
```

### Components
- **BacklogOwnershipPercent (60% Weight)**: The percentage of households that do not own a home. This is given the majority weight as it represents absolute lack of housing units.
- **BacklogRTLHPercent (40% Weight)**: The percentage of households living in substandard housing. This represents qualitative supply deficits.

### 2. Final Normalization
```text
SupplyIndex = Normalize(RawSupply)
```
*Note: `Normalize()` represents Min-Max Normalization from 0 to 100.*

## Rationale
By establishing the index inversely from the backlog metrics, a score closer to 100 indicates optimal supply (low backlog), while a score closer to 0 indicates severe supply shortages (high backlog).
