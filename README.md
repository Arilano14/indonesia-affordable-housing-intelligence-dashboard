# Indonesia Affordable Housing Intelligence Dashboard (IAHID)

## Overview

Indonesia Affordable Housing Intelligence Dashboard (IAHID) is a Business Intelligence and Decision Support System designed to analyze housing affordability, housing supply, property market conditions, and regional housing disparities across Indonesia.

The platform integrates public datasets from government institutions and international organizations into a centralized analytics environment, enabling evidence-based policy analysis and strategic decision-making.

This project was developed as an end-to-end Business Intelligence portfolio demonstrating competencies in:

* Data Collection
* ETL Pipeline Development
* Data Warehousing
* KPI Framework Design
* Statistical Analytics
* Data Visualization
* Decision Support Systems
* Executive Dashboard Development

---

## Project Objectives

IAHID aims to answer key policy and business questions:

* How affordable is housing across Indonesian provinces?
* Which regions face the largest housing backlog?
* What economic factors influence housing affordability?
* How does property market performance vary across regions?
* Which provinces should be prioritized for housing policy interventions?

The platform provides analytical insights through interactive dashboards, KPI monitoring, regional benchmarking, and driver analysis.

---

## Key Features

### Executive Overview

Provides a national-level snapshot of housing conditions, including:

* Housing Intelligence Score
* Housing Affordability Index
* Housing Ownership Rate
* Housing Backlog
* National Housing Trends

### Housing Market Analysis

Analyzes housing market performance through:

* House Price vs Income Analysis
* Residential Property Price Index
* Property Price Growth
* Housing Demand and Supply Indicators

### Regional Analysis

Compares housing conditions across provinces using:

* Provincial Rankings
* Housing Score Benchmarking
* Geographic Heatmaps
* Top and Bottom Performing Provinces

### Housing Drivers

Identifies factors influencing housing affordability through:

* Correlation Analysis
* Regression Analysis
* Economic Driver Evaluation
* Housing Market Risk Indicators

### Policy Insights

Transforms analytical findings into decision support outputs:

* Risk Assessment
* Priority Province Identification
* Policy Recommendation Engine
* Strategic Intervention Suggestions

---

## Technology Stack

### Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS v4
* Shadcn UI
* Recharts

### Backend

* FastAPI
* Python 3.12
* SQLAlchemy
* APScheduler
* Pandas
* NumPy
* SciPy
* Statsmodels

### Database

* Supabase PostgreSQL

### Deployment

* Frontend: Vercel
* Backend: Railway / Render
* Database: Supabase

---

## System Architecture

```text
External Data Sources
        │
        ▼
ETL Pipeline
(Extract • Transform • Load)
        │
        ▼
PostgreSQL Data Warehouse
        │
        ▼
Analytics Engine
        │
        ▼
REST API Layer
        │
        ▼
Interactive Dashboard
```

---

## Project Structure

```text
iahid/

├── frontend/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── analytics/
│   │   ├── etl/
│   │   ├── services/
│   │   ├── models/
│   │   └── schemas/
│
├── datasets/
│
├── docs/
│   ├── architecture/
│   ├── erd/
│   └── methodology/
│
└── database/
```

---

## Data Sources

The platform integrates publicly available datasets from:

### Statistics Indonesia (BPS)

* Housing Ownership Rate
* Household Income
* Housing Backlog Indicators

### Bank Indonesia

* Residential Property Price Index (RPPI)
* Property Market Indicators
* BI Rate

### World Bank

* GDP per Capita
* Inflation Rate
* Population Statistics

### Open Government and Public Datasets

Additional housing and socio-economic indicators used for benchmarking and regional analysis.

---

## Core KPIs

### Housing Affordability Index

```text
Average House Price
÷
Annual Household Income
```

### Property Price Growth

```text
(Current Price - Previous Price)
÷ Previous Price
```

### Housing Ownership Rate

```text
Households Owning Homes
÷
Total Households
```

### Housing Backlog

Direct measurement of unmet housing demand.

### Housing Intelligence Score

Composite score based on:

* Housing Affordability
* Housing Supply
* Mortgage Accessibility
* Market Stability

All indicators are normalized to a 0–100 scale.

---

## Analytics Components

### Descriptive Analytics

* Trend Analysis
* Growth Analysis
* Regional Comparison

### Correlation Analysis

Examines relationships between:

* Inflation and Housing Affordability
* Income and Housing Affordability
* GDP and Ownership Rate
* Interest Rate and Property Prices

### Regression Analysis

Evaluates the impact of:

* GDP per Capita
* Household Income
* Inflation
* Interest Rates

on Housing Affordability Index.

---

## Local Development

### Backend

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend will be available at:

```text
http://localhost:8000
```

---

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend will be available at:

```text
http://localhost:3000
```

---

## Portfolio Value

This project demonstrates practical skills in:

* Business Intelligence
* Data Analytics
* Data Engineering
* ETL Development
* Data Warehousing
* Dashboard Development
* Decision Support Systems
* Public Policy Analytics

---

## Author

**Arilano Excelovell Pinem**

Business Intelligence Portfolio Project

Information Systems Student

Indonesia

GitHub: https://github.com/Arilano14

LinkedIn: https://www.linkedin.com/in/arilano-pinem/
