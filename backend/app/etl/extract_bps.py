import pandas as pd
import os
import logging

logger = logging.getLogger(__name__)

BPS_RAW_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'raw', 'bps')
MASTER_DATASET = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'datasets', 'IAHID_Master_Dataset.xlsx')

def run_extraction():
    """
    Extracts data from the IAHID_Master_Dataset.xlsx file.
    """
    logger.info("Starting Master Dataset extraction...")
    os.makedirs(BPS_RAW_DIR, exist_ok=True)
    
    if not os.path.exists(MASTER_DATASET):
        logger.error(f"Master dataset not found at {MASTER_DATASET}")
        return
        
    try:
        xl = pd.ExcelFile(MASTER_DATASET)
        for sheet in xl.sheet_names:
            df = pd.read_excel(MASTER_DATASET, sheet_name=sheet)
            output_path = os.path.join(BPS_RAW_DIR, f"{sheet}.csv")
            df.to_csv(output_path, index=False)
            logger.info(f"Extracted sheet {sheet} to {output_path}")
    except Exception as e:
        logger.error(f"Failed to extract master dataset: {e}")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    run_extraction()

