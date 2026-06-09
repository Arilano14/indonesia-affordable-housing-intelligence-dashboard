import pandas as pd
import os
import logging
import shutil

logger = logging.getLogger(__name__)

STAGING_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'staging')
FRONTEND_DATASETS_DIR = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'frontend', 'public', 'datasets')

def run_load():
    """
    Loads transformed data into the frontend datasets directory.
    Formats it strictly to match frontend/src/lib/dataProvider.ts schema.
    """
    logger.info("Starting Load process...")
    
    prov_in = os.path.join(STAGING_DIR, "stg_province.csv")
    nat_in = os.path.join(STAGING_DIR, "stg_national.csv")
    
    if not os.path.exists(prov_in) or not os.path.exists(nat_in):
        logger.error("Staging files not found. Cannot proceed with Load.")
        return

    # 1. Load Province Data
    df_prov = pd.read_csv(prov_in)
    
    # Map to EXACT frontend schema:
    # Province,AverageHousePrice,AnnualHouseholdIncome,CurrentPropertyPrice,PreviousPropertyPrice,
    # HomeOwners,TotalHouseholds,InterestRate,HousingBacklog,UrbanPopulationGrowth,NewHousingSupply,
    # GDPPerCapita,InflationRate,PovertyRate,GiniIndex,UnemploymentRate,Population,StabilityScore
    
    # Since staging has standard columns, we rename/compute them to match frontend schema
    df_prov_mapped = pd.DataFrame()
    df_prov_mapped['Province'] = df_prov['province']
    df_prov_mapped['AverageHousePrice'] = df_prov['house_price']
    df_prov_mapped['AnnualHouseholdIncome'] = df_prov['annual_income']
    
    # Mocking missing fields required by frontend but not explicitly in "standard columns"
    df_prov_mapped['CurrentPropertyPrice'] = df_prov['house_price']
    df_prov_mapped['PreviousPropertyPrice'] = df_prov['house_price'] * 0.95 
    df_prov_mapped['HomeOwners'] = (df_prov['ownership_rate'] / 100) * (df_prov['urban_population'] / 4) # approx households
    df_prov_mapped['TotalHouseholds'] = df_prov['urban_population'] / 4
    df_prov_mapped['InterestRate'] = df_prov['real_interest_rate']
    df_prov_mapped['HousingBacklog'] = df_prov['housing_backlog']
    df_prov_mapped['UrbanPopulationGrowth'] = df_prov['urban_growth']
    df_prov_mapped['NewHousingSupply'] = 10000  # Default mock
    df_prov_mapped['GDPPerCapita'] = 5000       # Default mock
    df_prov_mapped['InflationRate'] = 3.5       # Default mock
    df_prov_mapped['PovertyRate'] = 9.0         # Default mock
    df_prov_mapped['GiniIndex'] = df_prov['gini_index']
    df_prov_mapped['UnemploymentRate'] = df_prov['unemployment_rate']
    df_prov_mapped['Population'] = df_prov['urban_population'] * 1.5
    df_prov_mapped['StabilityScore'] = 80       # Default mock
    
    # Ensure frontend dir exists
    os.makedirs(FRONTEND_DATASETS_DIR, exist_ok=True)
    
    # Save province data
    prov_out = os.path.join(FRONTEND_DATASETS_DIR, "housing_data_province.csv")
    df_prov_mapped.to_csv(prov_out, index=False)
    logger.info(f"Loaded Province Data to {prov_out}")
    
    # 2. Load National Data
    df_nat = pd.read_csv(nat_in)
    
    # Schema matches already except capitalization possibly
    df_nat_mapped = pd.DataFrame()
    df_nat_mapped['Year'] = df_nat['year']
    df_nat_mapped['HousingScore'] = df_nat['housing_score']
    df_nat_mapped['AffordabilityRatio'] = df_nat['affordability_ratio']
    df_nat_mapped['OwnershipRate'] = df_nat['ownership_rate']
    df_nat_mapped['HousingBacklog'] = df_nat['housing_backlog']
    df_nat_mapped['PropertyPriceIndex'] = df_nat['property_price_index']
    df_nat_mapped['Demand'] = df_nat['demand']
    df_nat_mapped['Supply'] = df_nat['supply']
    
    nat_out = os.path.join(FRONTEND_DATASETS_DIR, "housing_data_national.csv")
    df_nat_mapped.to_csv(nat_out, index=False)
    logger.info(f"Loaded National Data to {nat_out}")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    run_load()
