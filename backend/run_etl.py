import sys
import os
import logging

# Ensure the 'backend' directory is in the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.etl.scheduler import run_full_etl

if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    logger = logging.getLogger("run_etl")
    logger.info("Manually triggering ETL pipeline via CLI...")
    run_full_etl()
