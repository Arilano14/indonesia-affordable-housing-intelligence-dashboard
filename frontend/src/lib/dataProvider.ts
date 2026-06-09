// src/lib/dataProvider.ts
import Papa from 'papaparse';
import { MergedProvinceData, CalculatedKPIs, calculateKPIs } from './kpiEngine';

async function fetchCsv<T>(url: string): Promise<T[]> {
  const response = await fetch(url);
  const csvText = await response.text();
  return new Promise((resolve, reject) => {
    Papa.parse<T>(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (error: Error) => reject(error)
    });
  });
}

export async function fetchProvinceData(): Promise<CalculatedKPIs[]> {
  try {
    const [prov, backlog, wb, kpi] = await Promise.all([
      fetchCsv<any>('/datasets/housing_province.csv'),
      fetchCsv<any>('/datasets/housing_backlog.csv'),
      fetchCsv<any>('/datasets/housing_worldbank.csv'),
      fetchCsv<any>('/datasets/housing_kpi.csv')
    ]);

    // Merge by Province
    const mergedMap = new Map<string, MergedProvinceData>();
    
    prov.forEach(p => mergedMap.set(p.Province, { ...p }));
    
    backlog.forEach(b => {
      if (mergedMap.has(b.Province)) {
        mergedMap.set(b.Province, { ...mergedMap.get(b.Province), ...b });
      }
    });

    wb.forEach(w => {
      if (mergedMap.has(w.Province)) {
        mergedMap.set(w.Province, { ...mergedMap.get(w.Province), ...w });
      }
    });

    kpi.forEach(k => {
      if (mergedMap.has(k.Province)) {
        mergedMap.set(k.Province, { ...mergedMap.get(k.Province), ...k });
      }
    });

    const mergedData = Array.from(mergedMap.values());
    return calculateKPIs(mergedData);
  } catch (err) {
    console.error("Error fetching or merging province data:", err);
    return [];
  }
}

export interface NationalTrendData {
  Year: number;
  Population: number;
  Households: number;
  HousingScore: number;
  OwnershipRate: number;
  TotalBacklogPercent: number;
  InterestRate: number;
  InflationRate: number;
}

export async function fetchNationalData(): Promise<NationalTrendData[]> {
  return fetchCsv<NationalTrendData>('/datasets/housing_national.csv');
}

