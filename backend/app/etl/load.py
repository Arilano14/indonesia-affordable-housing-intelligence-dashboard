import pandas as pd
import os
import logging

logger = logging.getLogger(__name__)

STAGING_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'staging')
FRONTEND_DATASETS_DIR = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'frontend', 'public', 'datasets')

def run_load():
    """
    Loads transformed data into the frontend datasets directory.
    Formats it strictly to match frontend requirements without fabricating missing data.
    """
    logger.info("Starting Load process...")
    
    prov_in = os.path.join(STAGING_DIR, "stg_province.csv")
    nat_in = os.path.join(STAGING_DIR, "stg_national.csv")
    
    if not os.path.exists(prov_in) or not os.path.exists(nat_in):
        logger.error("Staging files not found. Cannot proceed with Load.")
        return

    df_prov = pd.read_csv(prov_in)
    df_nat = pd.read_csv(nat_in)
    
    os.makedirs(FRONTEND_DATASETS_DIR, exist_ok=True)
    
    # 1. housing_province.csv (Core Demographics & Ownership)
    df_prov_core = df_prov[['Province', 'Year', 'Population', 'Households', 'OwnershipRate']].copy()
    df_prov_core.to_csv(os.path.join(FRONTEND_DATASETS_DIR, "housing_province.csv"), index=False)
    
    # 2. housing_national.csv
    df_nat.to_csv(os.path.join(FRONTEND_DATASETS_DIR, "housing_national.csv"), index=False)
    
    # 3. housing_backlog.csv
    df_backlog = df_prov[['Province', 'Year', 'BacklogOwnershipPercent', 'BacklogRTLHPercent', 'TotalBacklogPercent']].copy()
    df_backlog.to_csv(os.path.join(FRONTEND_DATASETS_DIR, "housing_backlog.csv"), index=False)
    
    # 4. housing_worldbank.csv
    df_wb = df_prov[['Province', 'Year', 'GDPPerCapita', 'PovertyRate', 'InterestRate']].copy()
    df_wb.to_csv(os.path.join(FRONTEND_DATASETS_DIR, "housing_worldbank.csv"), index=False)
    
    # 5. housing_kpi.csv (The strict derived indices)
    df_kpi = df_prov[['Province', 'Year', 'DemandIndex', 'SupplyIndex', 'AccessibilityIndex', 'MortgageAccessibility', 'HousingScore']].copy()
    df_kpi.to_csv(os.path.join(FRONTEND_DATASETS_DIR, "housing_kpi.csv"), index=False)
    
    # 6. FLPP Data removed to adhere to Strict Credibility rules (no dummy data)
    flpp_path = os.path.join(FRONTEND_DATASETS_DIR, "housing_flpp.csv")
    if os.path.exists(flpp_path):
        os.remove(flpp_path)

    logger.info(f"Load complete. 6 datasets generated in {FRONTEND_DATASETS_DIR}")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    run_load()

