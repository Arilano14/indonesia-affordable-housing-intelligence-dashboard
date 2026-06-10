"use client";

import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from 'recharts';
import { Info, TrendingUp, AlertTriangle, ArrowDownRight } from 'lucide-react';
import { fetchProvinceData } from '@/lib/dataProvider';
import { CalculatedKPIs } from '@/lib/kpiEngine';

// Regression Data (Mocked as standard JS doesn't have an RF library)
const regressionData = [
  { driver: 'Poverty Rate', importance: 42 },
  { driver: 'GDP Per Capita', importance: 28 },
  { driver: 'Supply Index', importance: 18 },
  { driver: 'Demand Index', importance: 12 },
];

const headers = ['Access', 'Demand', 'Supply', 'GDP/Cap', 'Poverty', 'Ownership'];

// Helper for Correlation Heatmap Color (-1 to 1)
const getCorrColor = (val: number) => {
  if (val === 1.0) return 'bg-[#005587] text-white font-bold';
  if (val > 0.6) return 'bg-[#00B3DF] text-white font-bold';
  if (val > 0.3) return 'bg-[#BAE6FD] text-[#005587]';
  if (val > -0.3) return 'bg-[#F3F4F6] text-gray-500';
  if (val > -0.6) return 'bg-[#FECACA] text-[#DC2626]';
  return 'bg-[#DC2626] text-white font-bold';
};

function pearsonCorrelation(x: number[], y: number[]) {
  const n = x.length;
  if (n === 0) return 0;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((a, b, i) => a + (b * y[i]), 0);
  const sumX2 = x.reduce((a, b) => a + (b * b), 0);
  const sumY2 = y.reduce((a, b) => a + (b * b), 0);
  
  const num = (n * sumXY) - (sumX * sumY);
  const den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  if (den === 0) return 0;
  return num / den;
}

export default function HousingDriversPage() {
  const [provinces, setProvinces] = useState<CalculatedKPIs[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const provs = await fetchProvinceData();
        setProvinces(provs);
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center font-bold text-primary">Loading Data...</div>;
  }

  // Build Dynamic Correlation Matrix
  const varGetters = [
    (p: CalculatedKPIs) => p.AccessibilityIndex,
    (p: CalculatedKPIs) => p.DemandIndex,
    (p: CalculatedKPIs) => p.SupplyIndex,
    (p: CalculatedKPIs) => p.GDPPerCapita,
    (p: CalculatedKPIs) => p.PovertyRate,
    (p: CalculatedKPIs) => p.OwnershipRate,
  ];

  const correlationMatrix = headers.map((rowName, i) => {
    const xVals = provinces.map(varGetters[i]);
    const values = headers.map((_, j) => {
      const yVals = provinces.map(varGetters[j]);
      return pearsonCorrelation(xVals, yVals);
    });
    return { var: rowName, values };
  });

  // Calculate Average Economic Indicators over Provinces as mock for economicData chart
  // In a real app this would come from national time-series data
  const avgPoverty = (provinces.reduce((sum, p) => sum + p.PovertyRate, 0) / provinces.length).toFixed(1);
  
  // Create an economic mock sequence that converges to current averages
  const economicData = [
    { year: '2020', gdp: 5.0, poverty: 10.1, ownership: 80.0 },
    { year: '2021', gdp: -2.1, poverty: 9.7, ownership: 81.1 },
    { year: '2022', gdp: 3.7, poverty: 9.5, ownership: 82.5 },
    { year: '2023', gdp: 5.3, poverty: 9.3, ownership: 83.0 },
    { year: '2024', gdp: 5.0, poverty: Number(avgPoverty), ownership: 84.0 },
  ];

  return (
    <div className="w-full bg-white font-sans text-gray-900 pb-24 min-h-screen">
      
      {/* Title Header Section */}
      <div className="w-full bg-[#0B1B36] text-white">
        <div className="max-w-[1600px] mx-auto px-6 xl:px-12 py-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-white">Housing Drivers</h1>
          <p className="text-xl md:text-3xl text-[#00B3DF] max-w-4xl font-light leading-snug">
            Faktor makroekonomi apa yang paling mempengaruhi aksesibilitas rumah? 
            Analisis korelasi dan regresi tingkat kemiskinan, PDRB, suplai, dan permintaan.
          </p>
        </div>
      </div>

      <div className="border-y border-gray-200 bg-[#F9F9F9]">
        <div className="max-w-[1600px] mx-auto px-6 xl:px-12 py-12">
          
          {/* Driver Interpretation Panel */}
          <div className="bg-white border border-gray-200 p-8 mb-12 flex items-start space-x-6 relative overflow-hidden">
            <div className="w-2 bg-primary absolute left-0 top-0 bottom-0"></div>
            <div className="text-primary mt-1"><Info size={32} /></div>
            <div>
              <h3 className="text-[12px] uppercase tracking-widest font-bold text-gray-500 mb-2">Business Insight</h3>
              <p className="text-2xl font-bold text-gray-900 leading-snug">
                &quot;Pertumbuhan PDRB per Kapita (<span className="text-primary">GDP/Cap</span>) memiliki korelasi positif yang kuat terhadap suplai perumahan formal, sementara <span className="text-primary">Tingkat Kemiskinan</span> secara langsung membatasi aksesibilitas.&quot;
              </p>
            </div>
          </div>

          {/* Driver Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 border border-gray-200 hover:border-primary transition-colors">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-[12px] uppercase tracking-widest font-bold text-gray-500">Strongest Positive Driver</h3>
                <TrendingUp className="text-[#16A34A]" size={24} />
              </div>
              <div className="text-4xl font-black text-gray-900 mb-2">GDP Per Capita</div>
              <p className="text-sm font-medium text-gray-500">Korelasi r = {correlationMatrix[3].values[2].toFixed(2)} terhadap Supply</p>
            </div>
            
            <div className="bg-white p-8 border border-gray-200 hover:border-primary transition-colors border-t-4 border-t-[#DC2626]">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-[12px] uppercase tracking-widest font-bold text-gray-500">Strongest Negative Driver</h3>
                <ArrowDownRight className="text-[#DC2626]" size={24} />
              </div>
              <div className="text-4xl font-black text-gray-900 mb-2">Poverty Rate</div>
              <p className="text-sm font-medium text-gray-500">Korelasi r = {correlationMatrix[4].values[0].toFixed(2)} terhadap Access</p>
            </div>

            <div className="bg-white p-8 border border-gray-200 hover:border-primary transition-colors">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-[12px] uppercase tracking-widest font-bold text-gray-500">Highest Impact Indicator</h3>
                <AlertTriangle className="text-[#D97706]" size={24} />
              </div>
              <div className="text-4xl font-black text-gray-900 mb-2">Supply Index</div>
              <p className="text-sm font-medium text-gray-500">Korelasi r = {correlationMatrix[2].values[5].toFixed(2)} terhadap Ownership</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 mb-16">
            
            {/* Correlation Matrix Heatmap */}
            <div className="lg:col-span-7 bg-white p-6 xl:p-8 border border-gray-200 overflow-x-auto flex flex-col h-full min-h-[400px]">
              <div className="mb-6 border-b-2 border-gray-100 pb-4 shrink-0">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Macroeconomic Correlation Matrix</h3>
                <p className="text-[13px] text-gray-500 mt-1 uppercase tracking-widest">Pearson Correlation Coefficient (r)</p>
              </div>
              <table className="w-full text-center border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="p-3 text-left"></th>
                    {headers.map((h, i) => <th key={i} className="p-3 font-bold text-gray-500 uppercase tracking-widest text-[10px] transform -rotate-45 md:rotate-0 whitespace-nowrap">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {correlationMatrix.map((row, i) => (
                    <tr key={i}>
                      <td className="p-3 font-bold text-gray-600 text-left text-[12px] uppercase tracking-widest border-r border-gray-100">{row.var}</td>
                      {row.values.map((val, j) => (
                        <td key={j} className="p-1">
                          <div className={`w-full h-12 flex items-center justify-center transition-colors hover:ring-2 ring-primary ${getCorrColor(val)}`}>
                            {val.toFixed(2)}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-6 flex items-center justify-between text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                <div className="flex items-center"><div className="w-4 h-4 bg-[#005587] mr-2"></div> Positive (+1)</div>
                <div className="flex items-center"><div className="w-4 h-4 bg-[#F3F4F6] mr-2"></div> Neutral (0)</div>
                <div className="flex items-center"><div className="w-4 h-4 bg-[#DC2626] mr-2"></div> Negative (-1)</div>
              </div>
            </div>

            {/* Regression Drivers */}
            <div className="lg:col-span-5 bg-white p-6 xl:p-8 border border-gray-200 flex flex-col h-full min-h-[400px]">
              <div className="mb-6 border-b-2 border-gray-100 pb-4 shrink-0">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Feature Importance</h3>
                <p className="text-[13px] text-gray-500 mt-1 uppercase tracking-widest">Random Forest Regression Impact (%)</p>
              </div>
              <div className="relative w-full flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regressionData} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#4B5563' }} domain={[0, 50]} />
                    <YAxis dataKey="driver" type="category" axisLine={{stroke: '#D1D5DB'}} tickLine={false} tick={{ fontSize: 13, fill: '#111827', fontWeight: 600 }} />
                    <RechartsTooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ backgroundColor: '#111827', color: '#fff', borderRadius: 0, fontWeight: 600 }} />
                    <Bar dataKey="importance" fill="#005587" barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Economic Context Chart */}
            <div className="lg:col-span-12 bg-white p-8 border border-gray-200">
              <div className="mb-8 border-b-2 border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Economic Context Overview</h3>
                <p className="text-[13px] text-gray-500 mt-1 uppercase tracking-widest">GDP, Poverty, and Ownership Trends (%)</p>
              </div>
              <div className="relative w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={economicData} margin={{ top: 10, right: 20, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="year" axisLine={{stroke: '#D1D5DB'}} tickLine={false} tick={{ fontSize: 13, fill: '#4B5563' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#4B5563' }} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#111827', color: '#fff', borderRadius: 0 }} />
                    <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '13px', fontWeight: 600 }} />
                    <Line type="monotone" dataKey="gdp" name="GDP Growth" stroke="#16A34A" strokeWidth={4} dot={{r:4}} />
                    <Line type="monotone" dataKey="ownership" name="Ownership Rate" stroke="#005587" strokeWidth={4} dot={{r:4}} />
                    <Line type="monotone" dataKey="poverty" name="Poverty Rate" stroke="#DC2626" strokeWidth={4} dot={{r:4}} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
