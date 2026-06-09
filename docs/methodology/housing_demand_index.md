# Housing Demand Index Methodology

## Purpose
To quantify the pressure and demographic necessity for housing units across different provinces.

## Data Sources
- **Source A**: `IAHID_Master_Dataset.xlsx` (Population, Households, Poverty Rate via BPS)
- **Source C**: World Bank API (Urban Population)

## Formula
`Demand Index = (0.40 × PopulationScore) + (0.30 × HouseholdScore) + (0.20 × UrbanPopulationScore) + (0.10 × PovertyScore)`
*All variables are normalized (0-100).*

## Interpretation
A higher score indicates immense demographic pressure and a structural need for housing expansion, driven by population mass, household formation, and urbanization.

## Limitations
The index measures *latent* demand (demographic need) rather than *effective* demand (the financial ability to purchase). Effective demand is modeled separately via the Accessibility Index.

## Academic Justification
Population and household formation rates are the primary fundamental drivers of housing demand. Urbanization creates localized pressure points, justifying its 20% weight, while poverty indicates the necessity for subsidized/social housing intervention rather than pure commercial demand.
