# Indonesia Affordable Housing Intelligence Dashboard (IAHID)

## Overview

**Indonesia Affordable Housing Intelligence Dashboard (IAHID)** is a Business Intelligence and Decision Support System developed to analyze housing affordability, housing supply, property market performance, and housing-related socio-economic indicators across Indonesia.

The project demonstrates an end-to-end Business Intelligence workflow, transforming publicly available data into actionable insights through data integration, KPI development, analytics, and interactive dashboards.

Rather than functioning as a real estate marketplace, IAHID focuses on supporting evidence-based decision-making for policymakers, researchers, development organizations, and business intelligence practitioners.

---

## Project Objectives

This project was developed as an academic and professional portfolio to demonstrate competencies in:

* Business Intelligence
* Data Analytics
* Data Visualization
* KPI Framework Design
* Decision Support Systems
* Data-Driven Policy Analysis
* Dashboard Development
* ETL Pipeline Development
* Data Warehousing Concepts

## Key Questions Addressed

IAHID is designed to answer questions such as:

* Which provinces have the most affordable housing conditions?
* How do housing prices compare with household income levels?
* Which regions face the largest housing backlog?
* What economic factors most influence housing affordability?
* How do inflation and interest rates impact housing accessibility?
* Which provinces should be prioritized for housing policy intervention?

---

## Business Intelligence Framework

The system follows a standard Business Intelligence architecture:

```text
External Data Sources
        │
        ▼
ETL Pipeline
        │
        ▼
Data Warehouse
        │
        ▼
Analytics Engine
        │
        ▼
REST API
        │
        ▼
Interactive Dashboard
```

### Data Sources

The platform integrates public datasets from:

* Statistics Indonesia (BPS)
* Bank Indonesia (BI)
* World Bank Open Data
* Public Housing and Socio-Economic Datasets

### Core Business Intelligence Components

* Data Collection
* Data Cleaning & Transformation
* KPI Calculation
* Statistical Analysis
* Correlation Analysis
* Regression Analysis
* Decision Support Recommendations
* Executive Reporting

---

## Main Indicators

### Housing Intelligence Score

Composite indicator designed to measure overall housing sector performance.

Components include:

* Housing Affordability
* Housing Ownership
* Housing Supply
* Mortgage Accessibility
* Market Stability

### Housing Affordability Index

Measures the relationship between housing prices and household income.

Formula:

```text
Average House Price ÷ Annual Household Income
```

### Housing Ownership Rate

Measures the proportion of households owning residential property.

### Housing Backlog

Represents estimated housing shortages.

### Property Price Growth

Tracks residential property market performance over time.

## Dashboard Modules

### 1. Overview

Provides a national-level summary of Indonesia's housing conditions.

Contents:

* Housing Intelligence Score
* Housing Affordability Index
* Housing Ownership Rate
* Housing Backlog
* National Trend Analysis

---

### 2. Housing Market

Analyzes affordability and property market performance.

Contents:

* House Price vs Income
* Property Price Index
* Property Price Growth
* Housing Demand Indicators
* Housing Supply Indicators

---

### 3. Regional Analysis

Compares housing performance across provinces.

Contents:

* Provincial Rankings
* Housing Score Comparison
* Affordability Comparison
* Housing Heatmaps
* Regional Performance Insights

---

### 4. Housing Drivers

Examines factors influencing housing affordability.

Contents:

* Correlation Analysis
* Regression Analysis
* GDP Impact
* Inflation Impact
* Interest Rate Impact
* Income Impact

---

### 5. Policy Insights

Transforms analytics into decision-support recommendations.

Contents:

* Housing Risk Assessment
* Policy Priorities
* Recommended Actions
* Priority Provinces

---

### 6. Research Findings

Summarizes major findings generated from the analysis.

Contents:

* Executive Summary
* Key Findings
* Regional Challenges
* Strategic Recommendations

---

## Technology Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Shadcn UI
* Recharts

### Backend

* FastAPI
* Python
* Pandas
* NumPy
* SciPy
* Statsmodels

### Database

* PostgreSQL

### Deployment

* Vercel (Frontend)
* Railway (Backend)
* Neon PostgreSQL (Database)

---

## Repository Structure

```text
iahid/

├── frontend/
│
│   ├── src/
│   │
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── hooks/
│   └── types/
│
│
├── backend/
│
│   ├── app/
│   │
│   ├── api/
│   ├── analytics/
│   ├── etl/
│   ├── services/
│   ├── models/
│   └── schemas/
│
│
├── datasets/
│
├── docs/
│
└── README.md
```

---

## Running the Project

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Application:

```text
http://localhost:3000
```

---

### Backend

```bash
cd backend

python -m venv venv

source venv/bin/activate
```

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run API:

```bash
uvicorn app.main:app --reload
```

API Documentation:

```text
http://localhost:8000/docs
```

---

## ETL Pipeline

The backend contains ETL modules responsible for:

### Extract

Collecting data from public sources.

### Transform

* Data Cleaning
* Standardization
* Feature Engineering
* KPI Calculation

### Load

Loading processed data into analytics-ready datasets and database tables.

Typical workflow:

```text
Raw Data
    │
    ▼
Extract
    │
    ▼
Transform
    │
    ▼
KPI Engine
    │
    ▼
Analytics Dataset
    │
    ▼
Dashboard
```

---

## Executive Reporting

IAHID includes an automated Executive Report generation feature.

Generated reports include:

* Executive Summary
* Housing Market Performance
* Regional Analysis
* Driver Analysis
* Policy Recommendations

Output formats:

* PDF Report
* PNG Export
* CSV Dataset Export

---

## Design Principles

The platform is intentionally designed to resemble professional policy intelligence systems rather than startup dashboards.

Design inspirations include:

* World Bank Data Portal
* OECD Data Explorer
* IMF Data Dashboard
* UN Data Platform

The emphasis is placed on:

* Clarity
* Interpretability
* Decision Support
* Analytical Storytelling

---

---

## License

This project is developed for educational, research, and portfolio purposes.

All datasets remain subject to their respective providers' licensing terms and usage policies.
