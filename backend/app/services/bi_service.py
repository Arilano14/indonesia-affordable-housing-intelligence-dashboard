import requests
import logging

logger = logging.getLogger(__name__)

def get_bi_rate():
    """
    Fetch Bank Indonesia Rate.
    Note: Since Bank Indonesia's official API often requires specific access tokens 
    or Web Scraping, this is a placeholder for the actual API call.
    In a real scenario, you'd integrate the official BI API or scrape the data.
    """
    # Mocked data based on recent BI rates
    return [
        {"year": 2024, "value": 6.25},
        {"year": 2023, "value": 6.00},
        {"year": 2022, "value": 5.50},
        {"year": 2021, "value": 3.50},
        {"year": 2020, "value": 3.75},
        {"year": 2019, "value": 5.00},
        {"year": 2018, "value": 6.00},
        {"year": 2017, "value": 4.25},
        {"year": 2016, "value": 4.75},
        {"year": 2015, "value": 7.50},
    ]

def get_rppi():
    """
    Fetch Residential Property Price Index (RPPI) from Bank Indonesia.
    """
    # Mocked data for RPPI
    return [
        {"year": 2024, "value": 135.0},
        {"year": 2023, "value": 131.0},
        {"year": 2022, "value": 126.0},
        {"year": 2021, "value": 120.0},
        {"year": 2020, "value": 118.0},
    ]

def get_property_price_growth():
    """
    Fetch Property Price Growth from Bank Indonesia.
    """
    # Mocked data
    return [
        {"year": 2024, "value": 1.5},
        {"year": 2023, "value": 1.8},
        {"year": 2022, "value": 1.4},
        {"year": 2021, "value": 1.2},
        {"year": 2020, "value": 1.3},
    ]
