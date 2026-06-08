// src/lib/dataProvider.ts
import Papa from 'papaparse';
import { RawProvinceData, CalculatedKPIs, calculateKPIs } from './kpiEngine';

export async function fetchProvinceData(): Promise<CalculatedKPIs[]> {
  const response = await fetch('/datasets/housing_data_province.csv');
  const csvText = await response.text();
  
  return new Promise((resolve, reject) => {
    Papa.parse<RawProvinceData>(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length) {
          console.error("CSV Parse Errors:", results.errors);
        }
        const kpis = calculateKPIs(results.data);
        resolve(kpis);
      },
      error: (error: Error) => {
        reject(error);
      }
    });
  });
}

export interface NationalTrendData {
  Year: number;
  HousingScore: number;
  AffordabilityRatio: number;
  OwnershipRate: number;
  HousingBacklog: number;
  PropertyPriceIndex: number;
  Demand: number;
  Supply: number;
}

export async function fetchNationalData(): Promise<NationalTrendData[]> {
  const response = await fetch('/datasets/housing_data_national.csv');
  const csvText = await response.text();
  
  return new Promise((resolve, reject) => {
    Papa.parse<NationalTrendData>(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error: Error) => {
        reject(error);
      }
    });
  });
}
