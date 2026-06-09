import json
import os
import logging
from app.services.bps_service import get_housing_ownership_rate, get_housing_backlog, get_average_household_income

logger = logging.getLogger(__name__)

BPS_RAW_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'raw', 'bps')

def run_extraction():
    """
    Extracts BPS data (from local raw files) and consolidates it into a JSON structure for transformation.
    """
    logger.info("Starting BPS data extraction...")
    
    # Ensure directory exists
    os.makedirs(BPS_RAW_DIR, exist_ok=True)
    
    # Fetch data
    data = {
        "housing_ownership_rate": get_housing_ownership_rate(),
        "housing_backlog": get_housing_backlog(),
        "average_household_income": get_average_household_income()
    }
    
    # Save to file (consolidated raw)
    output_path = os.path.join(BPS_RAW_DIR, "bps_consolidated_raw.json")
    try:
        with open(output_path, "w") as f:
            json.dump(data, f, indent=4)
        logger.info(f"BPS consolidated data saved to {output_path}")
    except Exception as e:
        logger.error(f"Failed to save BPS data: {e}")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    run_extraction()
