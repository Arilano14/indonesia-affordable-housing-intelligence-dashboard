import pandas as pd
import os
import logging

logger = logging.getLogger(__name__)

BPS_RAW_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'raw', 'bps')

def read_bps_data(filename: str):
    """
    Reads a CSV or Excel file downloaded from BPS.
    """
    filepath = os.path.join(BPS_RAW_DIR, filename)
    if not os.path.exists(filepath):
        logger.error(f"BPS raw file not found: {filepath}")
        return None
    
    try:
        if filepath.endswith('.csv'):
            return pd.read_csv(filepath)
        elif filepath.endswith('.xlsx'):
            return pd.read_excel(filepath)
    except Exception as e:
        logger.error(f"Error reading BPS file {filename}: {e}")
        return None

def get_housing_ownership_rate():
    """
    Extracts housing ownership rate from BPS data.
    """
    # In a real scenario, you parse the specific BPS file.
    # Here we simulate reading a standard formatted BPS CSV.
    df = read_bps_data('housing_ownership.csv')
    if df is not None:
        return df.to_dict('records')
    return []

def get_housing_backlog():
    """
    Extracts housing backlog from BPS data.
    """
    df = read_bps_data('housing_backlog.csv')
    if df is not None:
        return df.to_dict('records')
    return []

def get_average_household_income():
    """
    Extracts average household income from BPS data.
    """
    df = read_bps_data('household_income.csv')
    if df is not None:
        return df.to_dict('records')
    return []
