# Housing Accessibility Index Methodology

## Purpose
To measure the financial reachability of housing for the average household, compensating for the lack of a standardized provincial house price dataset.

## Data Sources
- **Source A**: `IAHID_Master_Dataset.xlsx` (Poverty Rate, GDP Per Capita via BPS)
- **Source C**: World Bank API (Real Interest Rate)

## Formula
`Accessibility Index = (0.50 × GDPScore) + (0.30 × PovertyScoreInverse) + (0.20 × InterestRateScoreInverse)`
*Scores are min-max normalized to 0-100. Inverse scores mean lower original values (e.g., poverty, interest rates) yield higher normalized scores.*

## Interpretation
A higher index score indicates greater housing affordability and economic capacity for the population to engage in the housing market.

## Limitations
This index acts as a proxy for the standard Price-to-Income ratio. It does not capture localized property market bubbles or speculative price inflations that decouple from regional GDP.

## Academic Justification
In the absence of granular property transaction prices, regional GDP per capita and poverty headcounts serve as robust proxies for purchasing power. High real interest rates constrain affordability universally, thus warranting the 20% penalty weight (OECD Housing Dynamics, 2022).
