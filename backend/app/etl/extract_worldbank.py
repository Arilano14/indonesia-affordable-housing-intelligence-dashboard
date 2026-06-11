import json
import os
import logging
from app.services.worldbank_service import get_multiple_indicators

logger = logging.getLogger(__name__)

# Output directory
WB_RAW_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'raw', 'worldbank')

# Indicators to extract
INDICATORS = [
    "NY.GNP.PCAP.CD",    # GNI per capita
    "SI.POV.GINI",       # Gini Index
    "SP.URB.TOTL",       # Urban Population
    "SP.URB.GROW",       # Urban Population Growth
    "FR.INR.RINR",       # Real Interest Rate
    "NY.GNS.ICTR.ZS",    # Gross Savings (% GDP)
    "FS.AST.DOMS.GD.ZS", # Domestic Credit (% GDP)
    "SL.UEM.TOTL.ZS",    # Unemployment Rate
    "SL.TLF.CACT.ZS"     # Labor Force Participation
]

def run_extraction():
    """
    Extracts World Bank data and saves it to the raw folder as JSON.
    """
    logger.info("Starting World Bank data extraction...")
    
    # Ensure directory exists
    os.makedirs(WB_RAW_DIR, exist_ok=True)
    
    # Fetch data
    data = get_multiple_indicators(INDICATORS)
    
    # Save to file
    output_path = os.path.join(WB_RAW_DIR, "worldbank_raw.json")
    try:
        with open(output_path, "w") as f:
            json.dump(data, f, indent=4)
        logger.info(f"World Bank data saved to {output_path}")
    except Exception as e:
        logger.error(f"Failed to save World Bank data: {e}")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    run_extraction()
