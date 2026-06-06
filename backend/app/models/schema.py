from sqlmodel import SQLModel, Field
from typing import Optional

class DimProvince(SQLModel, table=True):
    province_id: Optional[int] = Field(default=None, primary_key=True)
    province_name: str
    island_group: str

class DimDate(SQLModel, table=True):
    date_id: Optional[int] = Field(default=None, primary_key=True)
    year: int
    quarter: int

class DimEconomy(SQLModel, table=True):
    economy_id: Optional[int] = Field(default=None, primary_key=True)
    gdp_per_capita: float
    inflation_rate: float
    interest_rate: float

class FactHousing(SQLModel, table=True):
    housing_id: Optional[int] = Field(default=None, primary_key=True)
    province_id: int = Field(foreign_key="dimprovince.province_id")
    date_id: int = Field(foreign_key="dimdate.date_id")
    economy_id: int = Field(foreign_key="dimeconomy.economy_id")
    
    average_house_price: float
    average_income: float
    ownership_rate: float
    backlog_units: int
    
    # Calculated KPIs
    housing_affordability_index: Optional[float] = None
    housing_intelligence_score: Optional[float] = None
