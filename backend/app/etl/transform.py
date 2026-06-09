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
    df_stg['BacklogOwnershipPercent'] = df['Backlog_Kepemilikan_Persen'].apply(clean_numeric)
    df_stg['BacklogRTLHPercent'] = df['Backlog_RTLH_Persen'].apply(clean_numeric)
    df_stg['TotalBacklogPercent'] = df['Total_Backlog_Persen'].apply(clean_numeric)
    df_stg['OwnershipRate'] = 100.0 - df_stg['BacklogOwnershipPercent'] # Based on ownership backlog
    df_stg['GDPPerCapita'] = df['Produk Domestik Regional Bruto per Kapita Atas Dasar Harga Berlaku (Ribu Rp)'].apply(clean_numeric) * 1000
    df_stg['PovertyRate'] = df['Persentase Penduduk Miskin - September'].apply(clean_numeric)

    # National Constants
    NATIONAL_INTEREST_RATE = 6.0
    NATIONAL_INFLATION_RATE = 2.5
    
    df_stg['InterestRate'] = NATIONAL_INTEREST_RATE
    df_stg['InflationRate'] = NATIONAL_INFLATION_RATE

    # Calculate Derivations (Proxy for FLPP Units)
    # Assumption: MBR (bankable but low-income) needing homes. Proxy = 5% of households facing ownership backlog.
    df_stg['EstimatedFLPPUnits'] = df_stg['Households'] * (df_stg['BacklogOwnershipPercent'] / 100.0) * 0.05
    df_stg['FLPP_Penetration'] = (df_stg['EstimatedFLPPUnits'] / df_stg['Households']) * 1000.0

    # Step 1: Normalization
    gdp_score = normalize(df_stg['GDPPerCapita'])
    own_score = normalize(df_stg['OwnershipRate'])
    pov_score = normalize(df_stg['PovertyRate'])
    backlog_score = normalize(df_stg['TotalBacklogPercent'])
    flpp_score = normalize(df_stg['FLPP_Penetration'])
    
    # Step 2: Inverse Scores for Negative Variables
    pov_inv = 100.0 - pov_score
    backlog_inv = 100.0 - backlog_score
    
    # BI Rate Inverse (Assuming range 3.0 to 9.0)
    bi_rate_score = ((NATIONAL_INTEREST_RATE - 3.0) / (9.0 - 3.0)) * 100.0
    ir_inv = 100.0 - bi_rate_score

    # Step 3: Accessibility Index
    df_stg['AccessibilityIndex'] = (0.30 * gdp_score) + (0.30 * own_score) + (0.20 * pov_inv) + (0.20 * backlog_inv)
    
    # Mortgage Accessibility Score
    df_stg['MortgageAccessibility'] = (0.40 * ir_inv) + (0.30 * flpp_score) + (0.30 * df_stg['AccessibilityIndex'])
    
    # Housing Supply Score
    raw_supply = 100.0 - ((0.60 * df_stg['TotalBacklogPercent']) + (0.40 * df_stg['BacklogRTLHPercent']))
    df_stg['SupplyIndex'] = normalize(raw_supply)
    
    # Housing Intelligence Score
    df_stg['HousingScore'] = (0.40 * df_stg['AccessibilityIndex']) + (0.20 * own_score) + (0.20 * df_stg['MortgageAccessibility']) + (0.20 * df_stg['SupplyIndex'])
    
    # Keep DemandIndex logic based on population & poverty (normalized)
    pop_score = normalize(df_stg['Population'])
    hh_score = normalize(df_stg['Households'])
    df_stg['DemandIndex'] = normalize((0.50 * pop_score) + (0.30 * hh_score) + (0.20 * pov_score))

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
        "InterestRate": NATIONAL_INTEREST_RATE,
        "InflationRate": NATIONAL_INFLATION_RATE
    }])
    nat_out = os.path.join(STAGING_DIR, "stg_national.csv")
    df_nat.to_csv(nat_out, index=False)
    
    logger.info(f"Transformation complete. Data saved to {STAGING_DIR}")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    run_transform()

