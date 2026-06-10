# Data Inventory and Architecture

## 1. Raw Data Extraction
Data is sourced from authoritative national bodies:
- **BPS (Badan Pusat Statistik)**: Provides census, demographic, housing backlog, poverty, and GDP metrics.
- **Bank Indonesia (BI)**: Provides macroeconomic indicators, primarily the BI 7-Day Reverse Repo Rate.

Raw extracted datasets are housed in the `backend/data/raw/` directory structure.

## 2. ETL Transformation Layer
The data is processed via Python scripts (`backend/app/etl/`).
- **`transform.py`**: Executes all data cleansing, type conversions, normalizations, and index calculations (Housing Score, Demand Index, Supply Index, etc.).
- The output of the transformation process is cached temporarily in the `backend/data/staging/` directory.

## 3. Production Datasets (Frontend)
After successful staging, the ETL pipeline writes the finalized production-ready CSV files directly to the frontend's public directory (`frontend/public/datasets/`). 

The active files powering the dashboard are:
1. `housing_kpi.csv` - Top-level dashboard aggregations.
2. `housing_national.csv` - Time-series trend data for the National overview.
3. `housing_province.csv` - Core geographic mapping and spatial analytics data.
4. `housing_backlog.csv` - Specific backlog composition data.
5. `housing_worldbank.csv` - Global benchmarking data.

These files are dynamically requested by `frontend/src/lib/dataProvider.ts` using client-side `fetch()` operations during the React application lifecycle.
