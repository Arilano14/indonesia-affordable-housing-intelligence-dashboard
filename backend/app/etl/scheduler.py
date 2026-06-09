import logging
from apscheduler.schedulers.background import BackgroundScheduler
import time

from app.etl import extract_worldbank, extract_bi, extract_bps, transform, load

logger = logging.getLogger(__name__)

def run_full_etl():
    """
    Executes the full ETL pipeline: Extract -> Transform -> Load
    """
    logger.info("--- Starting Full ETL Pipeline ---")
    
    # 1. Extract
    try:
        extract_worldbank.run_extraction()
        extract_bi.run_extraction()
        extract_bps.run_extraction()
        logger.info("Extraction phase completed successfully.")
    except Exception as e:
        logger.error(f"Extraction phase failed: {e}")
        return

    # 2. Transform
    try:
        transform.run_transform()
        logger.info("Transformation phase completed successfully.")
    except Exception as e:
        logger.error(f"Transformation phase failed: {e}")
        return

    # 3. Load
    try:
        load.run_load()
        logger.info("Load phase completed successfully.")
    except Exception as e:
        logger.error(f"Load phase failed: {e}")
        return

    logger.info("--- Full ETL Pipeline Finished ---")

def start_scheduler():
    """
    Starts the APScheduler to run the ETL quarterly.
    """
    scheduler = BackgroundScheduler()
    # Mocking quarterly run - e.g., run on the 1st day of Jan, Apr, Jul, Oct at 00:00
    scheduler.add_job(run_full_etl, 'cron', month='1,4,7,10', day='1', hour='0', minute='0')
    scheduler.start()
    logger.info("ETL Scheduler started (Runs quarterly).")
    
    try:
        # This keeps the scheduler alive if run as a standalone script
        while True:
            time.sleep(2)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
        logger.info("ETL Scheduler shut down.")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    start_scheduler()
