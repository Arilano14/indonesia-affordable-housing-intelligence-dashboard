import pandas as pd
import numpy as np
import os
import logging
import re

logger = logging.getLogger(__name__)

RAW_BPS = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'raw', 'bps', 'fact_housing_province.csv')
STAGING_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'staging')

def clean_numeric(val):
    if pd.isna(val):
        return 0.0
    if isinstance(val, str):
        # Remove asterisks and commas
        val = re.sub(r'[^\d.]', '', val)
        if not val:
            return 0.0
    return float(val)

def normalize(series):
    """Standard Min-Max normalization 0-100."""
    s_min = series.min()
    s_max = series.max()
    if s_max == s_min:
        return pd.Series([50.0] * len(series))
    return ((series - s_min) / (s_max - s_min)) * 100.0

def run_transform():
    """
    Transforms raw BPS data and calculates Derived Indicators (0-100) exactly per requirements.
    """
    logger.info("Starting Transformation process...")
    os.makedirs(STAGING_DIR, exist_ok=True)
    
    if not os.path.exists(RAW_BPS):
        logger.error(f"Raw BPS file not found: {RAW_BPS}")
        return

    df = pd.read_csv(RAW_BPS)

    # 1. Standardize Field Names
    df_stg = pd.DataFrame()
    df_stg['Province'] = df['Provinsi']
    df_stg['Year'] = 2024
    df_stg['Population'] = df['Jumlah Penduduk (Ribu)'].apply(clean_numeric) * 1000
    df_stg['Households'] = df['Jumlah_Keluarga'].apply(clean_numeric)
    df_stg['Density'] = df['Kepadatan Penduduk per km persegi (Km2)'].apply(clean_numeric)
    df_stg['BacklogOwnershipPercent'] = df['Backlog_Kepemilikan_Persen'].apply(clean_numeric)
    df_stg['BacklogRTLHPercent'] = df['Backlog_RTLH_Persen'].apply(clean_numeric)
    df_stg['TotalBacklogPercent'] = df['Total_Backlog_Persen'].apply(clean_numeric)
    df_stg['OwnershipRate'] = 100.0 - df_stg['BacklogOwnershipPercent'] # Based on ownership backlog
    df_stg['GDPPerCapita'] = df['Produk Domestik Regional Bruto per Kapita Atas Dasar Harga Berlaku (Ribu Rp)'].apply(clean_numeric) * 1000
    df_stg['PovertyRate'] = df['Persentase Penduduk Miskin - September'].apply(clean_numeric)

    # Fetch Real Interest Rate from BI API data
    import json
    bi_raw_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'raw', 'bi', 'bi_raw.json')
    national_interest_rate = 6.0 # Fallback
    try:
        with open(bi_raw_path, 'r') as f:
            bi_data = json.load(f)
            # Get latest year's bi_rate
            latest_bi = sorted(bi_data.get('bi_rate', []), key=lambda x: x['year'], reverse=True)[0]
            national_interest_rate = float(latest_bi['value'])
            logger.info(f"Loaded BI Rate: {national_interest_rate}%")
    except Exception as e:
        logger.warning(f"Could not load BI rate, using fallback. Error: {e}")
        
    df_stg['InterestRate'] = national_interest_rate

    # Step 1: Normalization
    gdp_score = normalize(df_stg['GDPPerCapita'])
    own_score = normalize(df_stg['OwnershipRate'])
    pov_score = normalize(df_stg['PovertyRate'])
    backlog_score = normalize(df_stg['TotalBacklogPercent'])
    pop_score = normalize(df_stg['Population'])
    hh_score = normalize(df_stg['Households'])
    density_score = normalize(df_stg['Density']) # Proxy for Urbanization
    
    # Step 2: Inverse Scores for Negative Variables
    pov_inv = 100.0 - pov_score
    backlog_inv = 100.0 - backlog_score
    
    # BI Rate Inverse (Assuming range 3.0 to 9.0)
    bi_rate_score = ((national_interest_rate - 3.0) / (9.0 - 3.0)) * 100.0
    ir_inv = 100.0 - bi_rate_score

    # Step 3: Accessibility Index
    df_stg['AccessibilityIndex'] = (0.30 * gdp_score) + (0.30 * own_score) + (0.20 * pov_inv) + (0.20 * backlog_inv)
    
    # Step 4: Mortgage Accessibility Score (No FLPP proxy)
    df_stg['MortgageAccessibility'] = (0.60 * df_stg['AccessibilityIndex']) + (0.40 * ir_inv)
    
    # Step 5: Housing Supply Index
    # Supply = 100 - (0.60 Backlog + 0.40 RTLH)
    raw_supply = 100.0 - ((0.60 * df_stg['BacklogOwnershipPercent']) + (0.40 * df_stg['BacklogRTLHPercent']))
    df_stg['SupplyIndex'] = normalize(raw_supply)
    
    # Step 6: Housing Demand Index
    # Demand = Normalized Population * Normalized Households * Normalized Urbanization (Proxy: Density)
    # Using weighted addition (composite index) to prevent severe zero-skewing from extreme values (like Java's population)
    raw_demand = (0.40 * pop_score) + (0.40 * hh_score) + (0.20 * density_score)
    df_stg['DemandIndex'] = normalize(raw_demand)
    
    # Step 7: Housing Intelligence Score
    df_stg['HousingScore'] = (0.40 * df_stg['AccessibilityIndex']) + (0.20 * own_score) + (0.20 * df_stg['MortgageAccessibility']) + (0.20 * df_stg['SupplyIndex'])

    # Save to staging
    prov_out = os.path.join(STAGING_DIR, "stg_province.csv")
    df_stg.to_csv(prov_out, index=False)
    
    # Aggregate National
    df_nat = pd.DataFrame([{
        "Year": 2024,
        "Population": df_stg['Population'].sum(),
        "Households": df_stg['Households'].sum(),
        "HousingScore": df_stg['HousingScore'].mean(),
        "OwnershipRate": df_stg['OwnershipRate'].mean(),
        "TotalBacklogPercent": df_stg['TotalBacklogPercent'].mean(),
        "InterestRate": national_interest_rate,
        "DemandIndex": df_stg['DemandIndex'].mean(),
        "SupplyIndex": df_stg['SupplyIndex'].mean(),
        "AccessibilityIndex": df_stg['AccessibilityIndex'].mean(),
        "MortgageAccessibility": df_stg['MortgageAccessibility'].mean()
    }])
    nat_out = os.path.join(STAGING_DIR, "stg_national.csv")
    df_nat.to_csv(nat_out, index=False)
    
    logger.info(f"Transformation complete. Data saved to {STAGING_DIR}")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    run_transform()

