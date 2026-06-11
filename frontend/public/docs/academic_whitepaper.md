# Measuring Housing Resilience in Indonesia: A Data-Driven Approach to Affordable Housing Intelligence

**Abstract**
The housing deficit in Indonesia represents a critical intersection of macroeconomic constraints and socio-demographic pressures. This paper introduces the Indonesia Affordable Housing Intelligence Dashboard (IAHID) framework, a Business Intelligence model designed to quantify housing resilience across 38 provinces. By synthesizing Homeownership Rates, Decent Living Standards (RTLH), and macroeconomic indicators (GDP per capita, Inflation, Interest Rates), we formulate a composite *Housing Intelligence Score*. Utilizing a Random Forest Regressor for feature importance validation, this study reveals that regional economic capacity significantly outweighs monetary policy in determining long-term homeownership viability. The findings provide a targeted, data-driven foundation for spatial policy interventions.

---

## 1. Introduction & Problem Statement

Indonesia faces a persistent housing crisis. As of recent data, millions of households lack ownership of a home, while a significant percentage reside in uninhabitable conditions (*Rumah Tidak Layak Huni* / RTLH). Despite massive government interventions through subsidized mortgage liquidity facilities (FLPP) and public-private partnerships (KPBU), the backlog remains structurally difficult to eradicate.

The primary problem for policymakers is the asymmetry of information. National aggregate data obscures extreme regional disparities. A blanket monetary policy (e.g., lowering the national benchmark interest rate) may stimulate housing markets in industrialized provinces like DKI Jakarta or West Java, but fail to address the fundamental supply-side deficits in emerging provinces. 

This paper outlines the methodology behind a dynamic Business Intelligence architecture designed to disaggregate housing data and provide highly localized policy intelligence.

---

## 2. Data Sources

To ensure empirical validity, the framework ingests data exclusively from authoritative state institutions:
1. **Badan Pusat Statistik (BPS):** Provides primary socio-economic data through the National Socio-Economic Survey (*Susenas*). Key variables extracted include Homeownership Rates, RTLH percentages, Population Density, and Regional GDP per Capita (PDRB).
2. **Bank Indonesia (BI):** Provides the macroeconomic environment context, specifically the BI 7-Day Reverse Repo Rate (BI7DRR) and regional inflation indices.

All data is processed through a Python-based ETL (Extract, Transform, Load) pipeline, ensuring standard normalization before analytical computation.

---

## 3. Methodology & Index Formulation

The core of the IAHID framework relies on three proprietary indices calculated dynamically from the semantic data layer.

### 3.1 Total Housing Backlog
The absolute housing deficit is calculated by merging the ownership deficit and the quality deficit. To prevent analytical double-counting without microdata intersections, a conservative aggregate model is applied.

$$ TotalBacklog = (100 - OwnershipRate) + (100 - DecentHousingRate) $$

*Thresholds:* A backlog exceeding 30% indicates a severe supply crisis, whereas levels below 10% represent high regional housing resilience.

### 3.2 Mortgage Accessibility Index
This index measures the theoretical capacity of a median household to secure and service standard housing finance. It assumes that purchasing power (GDP per capita) acts as a driver, while inflation and interest rates act as constraints.

$$ AccessibilityIndex = \text{MinMaxNormalize} \left( \frac{GDP_{perCapita}}{1 + (0.6 \times InterestRate) + (0.4 \times Inflation)} \right) $$

*Interpretation:* An index score approaching 100 denotes an optimal financing environment, whereas a score near 0 indicates severe market exclusion for the median earner.

### 3.3 Housing Intelligence Score
A composite metric representing overall housing welfare, utilizing a weighted synthesis of ownership security, living standards, and financial feasibility.

$$ HousingScore = 0.4(Ownership) + 0.3(DecentHousing) + 0.3(Accessibility) $$

---

## 4. Analytical Findings

To validate the theoretical assumptions of the Housing Score, a Machine Learning component utilizing a Random Forest Regressor was deployed. The model regressed the Homeownership Rate against multiple independent variables (GDP, Interest Rate, Inflation, Population) to extract **Feature Importance Scores**.

### 4.1 Dominance of Regional GDP over Monetary Policy
Statistical modeling indicates that regional purchasing power (GDP per capita) exerts a substantially higher influence on homeownership outcomes than the national benchmark interest rate. 

* **Finding:** While subsidized interest rates (FLPP) are critical for the lower-income bracket, structural economic growth and localized income generation are the absolute prerequisites for resolving the housing backlog on a macroeconomic scale.

### 4.2 The Spatial Supply-Demand Mismatch
Geospatial mapping of the Housing Intelligence Score reveals a stark divide. Industrialized provinces exhibit high Mortgage Accessibility but suffer from severe Ownership Backlogs due to rapid urbanization and land scarcity. Conversely, remote provinces exhibit high Homeownership Rates but critically low Decent Housing (RTLH) scores.

---

## 5. Policy Implications

Based on the dynamic clustering of the BI Engine, the following policy interventions are recommended:

1. **For High-Backlog, High-Density Provinces (e.g., West Java, DKI Jakarta):**
   - Shift government focus entirely from demand-side subsidies to **supply-side interventions**.
   - Prioritize vertical affordable housing (Rusunawa/Rusunami) and transit-oriented development (TOD) to counteract land scarcity.

2. **For High-Ownership, Low-Quality Provinces (e.g., Eastern Indonesia):**
   - Traditional mortgage subsidies (FLPP) are ineffective here, as residents already own land/homes.
   - Budget allocation must be aggressively pivoted toward the **Bantuan Stimulan Perumahan Swadaya (BSPS)** program to upgrade existing RTLH structures into decent living conditions.

3. **Macroeconomic Level:**
   - The decoupling of national monetary policy from localized housing success suggests that regional governments must take a more proactive role in stimulating their specific economic sectors rather than waiting for central bank rate cuts.

---

## 6. Conclusion & Limitations

The Indonesia Affordable Housing Intelligence Dashboard successfully bridges the gap between raw statistical data and actionable policy directives. By proving that housing deficits are spatially heterogeneous, it argues against "one-size-fits-all" national housing policies.

**Limitations:** The current model relies on aggregated provincial data. Future iterations of this architecture should incorporate granular district-level (Kabupaten/Kota) data and integrate alternative economic variables such as the informal sector wage index to capture the realities of unbanked populations.
