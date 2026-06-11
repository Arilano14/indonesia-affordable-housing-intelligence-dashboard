from fastapi import APIRouter, BackgroundTasks
from app.etl.scheduler import run_full_etl
import os
import json

router = APIRouter(prefix="/api", tags=["ETL"])

def trigger_etl_task():
    run_full_etl()

@router.get("/data/worldbank")
def get_worldbank_data():
    """
    Returns the raw World Bank data for debugging.
    """
    path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'raw', 'worldbank', 'worldbank_raw.json')
    if os.path.exists(path):
        with open(path, "r") as f:
            return json.load(f)
    return {"message": "World Bank data not found. Run ETL first."}

@router.get("/data/bi")
def get_bi_data():
    """
    Returns the raw Bank Indonesia data for debugging.
    """
    path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'raw', 'bi', 'bi_raw.json')
    if os.path.exists(path):
        with open(path, "r") as f:
            return json.load(f)
    return {"message": "BI data not found. Run ETL first."}

@router.get("/data/bps")
def get_bps_data():
    """
    Returns the raw BPS data for debugging.
    """
    path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'raw', 'bps', 'bps_consolidated_raw.json')
    if os.path.exists(path):
        with open(path, "r") as f:
            return json.load(f)
    return {"message": "BPS data not found. Run ETL first."}

@router.post("/etl/run")
def run_etl(background_tasks: BackgroundTasks):
    """
    Triggers the ETL pipeline asynchronously.
    """
    background_tasks.add_task(trigger_etl_task)
    return {"message": "ETL process started in the background."}

@router.get("/etl/status")
def get_etl_status():
    """
    Simple status check endpoint.
    """
    # A real system might check DB logs or memory state for true status.
    return {"status": "ok", "message": "ETL endpoints are responsive."}
