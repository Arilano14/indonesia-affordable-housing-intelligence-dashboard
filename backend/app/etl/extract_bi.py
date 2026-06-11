import json
import os
import logging
from app.services.bi_service import get_bi_rate, get_rppi, get_property_price_growth

logger = logging.getLogger(__name__)

BI_RAW_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'raw', 'bi')

def run_extraction():
    """
    Extracts Bank Indonesia data and saves it to the raw folder as JSON.
    """
    logger.info("Starting Bank Indonesia data extraction...")
    
    # Ensure directory exists
    os.makedirs(BI_RAW_DIR, exist_ok=True)
    
    # Fetch data
    data = {
        "bi_rate": get_bi_rate(),
        "rppi": get_rppi(),
        "property_price_growth": get_property_price_growth()
    }
    
    # Save to file
    output_path = os.path.join(BI_RAW_DIR, "bi_raw.json")
    try:
        with open(output_path, "w") as f:
            json.dump(data, f, indent=4)
        logger.info(f"Bank Indonesia data saved to {output_path}")
    except Exception as e:
        logger.error(f"Failed to save Bank Indonesia data: {e}")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    run_extraction()
