# Mortgage Accessibility Score Methodology

## Overview
The **Mortgage Accessibility Score** evaluates how favorable the macroeconomic and regional financial environment is for securing a housing mortgage (KPR).

## Calculation Methodology
The score combines the baseline economic capability of a region's population with the macroeconomic borrowing cost (interest rate).

### Formula
```text
MortgageAccessibility = (0.60 * AccessibilityIndex) + 
                        (0.40 * InterestRateInverseScore)
```

### Components
1. **Accessibility Index (60%)**: Represents the regional purchasing power and baseline economic strength.
2. **InterestRateInverseScore (40%)**: The inverse normalization of the national Bank Indonesia (BI) 7-Day Reverse Repo Rate.
   
#### Calculating InterestRateInverseScore
Assuming a historical target range of 3.0% to 9.0% for the BI Rate:
```text
BiRateScore = ((NationalInterestRate - 3.0) / (9.0 - 3.0)) * 100.0
InterestRateInverseScore = 100.0 - BiRateScore
```

## Rationale
A lower interest rate significantly boosts the `InterestRateInverseScore`, thereby increasing the overall Mortgage Accessibility. The 60/40 split ensures that even in low-interest-rate environments, a province with severe poverty and low GDP (low Accessibility Index) will still correctly reflect a lower likelihood of successful mortgage penetration.
