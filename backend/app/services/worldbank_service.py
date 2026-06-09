import requests
import logging

logger = logging.getLogger(__name__)

BASE_URL = "https://api.worldbank.org/v2"
COUNTRY_CODE = "IDN"
FORMAT = "json"

def get_indicator(indicator_code: str):
    """
    Fetch an indicator from the World Bank API for Indonesia.
    """
    url = f"{BASE_URL}/country/{COUNTRY_CODE}/indicator/{indicator_code}?format={FORMAT}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        if len(data) > 1 and isinstance(data[1], list):
            results = []
            for item in data[1]:
                if item.get("value") is not None:
                    results.append({
                        "year": int(item.get("date")),
                        "value": float(item.get("value"))
                    })
            return results
        return []
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching World Bank indicator {indicator_code}: {e}")
        return []

def get_multiple_indicators(indicator_codes: list):
    """
    Fetch multiple indicators from the World Bank API.
    """
    results = {}
    for code in indicator_codes:
        results[code] = get_indicator(code)
    return results

def get_country_metadata():
    """
    Fetch basic country metadata for Indonesia.
    """
    url = f"{BASE_URL}/country/{COUNTRY_CODE}?format={FORMAT}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        if len(data) > 1 and isinstance(data[1], list):
            return data[1][0]
        return {}
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching World Bank metadata: {e}")
        return {}
