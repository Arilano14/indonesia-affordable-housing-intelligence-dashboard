# Housing Supply Index Methodology

## Purpose
To evaluate the adequacy of housing stock availability relative to the population's basic shelter needs.

## Data Sources
- **Source A**: `IAHID_Master_Dataset.xlsx` (Total Backlog Percent, Backlog RTLH Percent via BPS)
- **Source B**: PKP Dashboard

## Formula
`Supply Index = 100 - [(0.60 × TotalBacklogPercent) + (0.40 × BacklogRTLHPercent)]`
*The formula penalizes regions with high housing deficits (backlog) and inadequate housing quality (RTLH - Rumah Tidak Layak Huni).*

## Interpretation
A score approaching 100 indicates near-complete fulfillment of housing supply needs, with minimal backlog and high-quality dwelling structures. A lower score signifies a severe supply shortage or poor housing quality.

## Limitations
This index measures the *deficit* of supply rather than the absolute volume of new construction (housing starts). It does not differentiate between urban and rural supply dynamics.

## Academic Justification
Housing supply in emerging economies is best measured by the deficit (backlog) rather than surplus inventory. The heavier weight (60%) on pure quantitative backlog reflects the immediate urgency of shelter, while the 40% weight on RTLH accounts for qualitative adequacy (UN-Habitat, 2018).
