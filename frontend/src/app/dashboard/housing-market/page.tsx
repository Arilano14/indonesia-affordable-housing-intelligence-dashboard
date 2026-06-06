"use client";

import React, { useState } from 'react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ZAxis,
  LineChart, Line, BarChart, Bar, ComposedChart, Legend
} from 'recharts';
import { ArrowRight, Info } from 'lucide-react';

const scatterData = [
  { province: 'DKI Jakarta', income: 120, price: 950, affordability: 7.9 },
  { province: 'Jawa Barat', income: 65, price: 420, affordability: 6.4 },
  { province: 'Banten', income: 70, price: 480, affordability: 6.8 },
  { province: 'DI Yogyakarta', income: 45, price: 380, affordability: 8.4 },
  { province: 'Jawa Timur', income: 55, price: 310, affordability: 5.6 },
  { province: 'Jawa Tengah', income: 40, price: 180, affordability: 4.5 },
  { province: 'Bali', income: 60, price: 650, affordability: 10.8 },
  { province: 'Sumatera Utara', income: 50, price: 250, affordability: 5.0 },
  { province: 'Sulawesi Selatan', income: 48, price: 220, affordability: 4.5 },
  { province: 'Kalimantan Timur', income: 85, price: 400, affordability: 4.7 },
];

const trendData = [
  { year: '2015', index: 100 }, { year: '2016', index: 104 }, { year: '2017', index: 109 },
  { year: '2018', index: 112 }, { year: '2019', index: 116 }, { year: '2020', index: 118 },
  { year: '2021', index: 120 }, { year: '2022', index: 126 }, { year: '2023', index: 131 },
  { year: '2024', index: 135 }, { year: '2025', index: 139 },
];

const growthData = [
  { quarter: 'Q1 24', growth: 1.2 }, { quarter: 'Q2 24', growth: 1.5 },
  { quarter: 'Q3 24', growth: 0.8 }, { quarter: 'Q4 24', growth: 2.1 },
  { quarter: 'Q1 25', growth: 1.8 }, { quarter: 'Q2 25', growth: 1.4 },
];

const supplyDemandData = [
  { year: '2019', demand: 850, supply: 620 },
  { year: '2020', demand: 880, supply: 550 },
  { year: '2021', demand: 910, supply: 590 },
  { year: '2022', demand: 940, supply: 710 },
  { year: '2023', demand: 980, supply: 750 },
  { year: '2024', demand: 1020, supply: 810 },
  { year: '2025', demand: 1080, supply: 840 },
];

export default function HousingMarketPage() {
  const [sortField, setSortField] = useState('affordability');

  const sortedTableData = [...scatterData].sort((a, b) => {
    return b[sortField as keyof typeof b] > a[sortField as keyof typeof a] ? 1 : -1;
  });

  return (
    <div className="w-full bg-white font-sans text-gray-900 pb-24">
      
      {/* Title Header Section */}
      <div className="max-w-[1600px] mx-auto px-6 xl:px-12 py-12">
        <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tight mb-4">Housing Market</h1>
        <p className="text-lg text-gray-600 max-w-3xl font-medium leading-relaxed">
          Apakah rumah semakin terjangkau atau semakin mahal? Analisis tren harga properti, 
          keseimbangan suplai dan permintaan, serta rasio keterjangkauan di tingkat provinsi.
        </p>
      </div>

      <div className="border-y border-gray-200 bg-[#F9F9F9]">
        <div className="max-w-[1600px] mx-auto px-6 xl:px-12 py-12">
          
          {/* Key Insight Panel */}
          <div className="bg-primary text-white p-8 mb-12 relative overflow-hidden border-l-8 border-accent">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Info size={120} />
            </div>
            <h3 className="text-[12px] uppercase tracking-widest font-bold text-accent mb-3">Key Insight</h3>
            <p className="text-2xl font-light leading-snug max-w-4xl">
              "Kesenjangan keterjangkauan ekstrem di <span className="font-bold">Bali (10.8x)</span> dan <span className="font-bold">DI Yogyakarta (8.4x)</span> didorong oleh tingginya harga properti yang tidak seimbang dengan UMP regional, jauh melampaui DKI Jakarta."
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 mb-16">
            
            {/* Scatter Plot */}
            <div className="bg-white p-8 border border-gray-200">
              <div className="mb-8 border-b-2 border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">House Price vs Income</h3>
                <p className="text-[13px] text-gray-500 mt-1 uppercase tracking-widest">Provincial Gap Analysis</p>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis type="number" dataKey="income" name="Annual Income" unit="M" axisLine={{stroke: '#D1D5DB'}} tickLine={false} tick={{ fontSize: 13, fill: '#4B5563' }} />
                    <YAxis type="number" dataKey="price" name="Avg House Price" unit="M" axisLine={{stroke: '#D1D5DB'}} tickLine={false} tick={{ fontSize: 13, fill: '#4B5563' }} />
                    <ZAxis type="category" dataKey="province" name="Province" />
                    <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#111827', color: '#fff', borderRadius: 0, fontWeight: 600 }} itemStyle={{ color: '#00B3DF' }} />
                    <Scatter name="Provinces" data={scatterData} fill="#005587" shape="circle" line={false}>
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Dual Axis Chart (Supply vs Demand) */}
            <div className="bg-white p-8 border border-gray-200">
              <div className="mb-8 border-b-2 border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Housing Demand vs Supply</h3>
                <p className="text-[13px] text-gray-500 mt-1 uppercase tracking-widest">National Volume ('000 Units)</p>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={supplyDemandData} margin={{ top: 20, right: 20, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="year" axisLine={{stroke: '#D1D5DB'}} tickLine={false} tick={{ fontSize: 13, fill: '#4B5563' }} dy={10}/>
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#4B5563' }} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#4B5563' }} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#111827', color: '#fff', borderRadius: 0 }} />
                    <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '13px', fontWeight: 600 }} />
                    <Bar yAxisId="left" dataKey="supply" name="New Supply" fill="#00B3DF" barSize={32} />
                    <Line yAxisId="right" type="monotone" dataKey="demand" name="Market Demand" stroke="#005587" strokeWidth={4} dot={{ r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trend Chart */}
            <div className="bg-white p-8 border border-gray-200">
              <div className="mb-8 border-b-2 border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Property Price Trend</h3>
                <p className="text-[13px] text-gray-500 mt-1 uppercase tracking-widest">Residential Price Index (2015-2025)</p>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 10, right: 20, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="year" axisLine={{stroke: '#D1D5DB'}} tickLine={false} tick={{ fontSize: 13, fill: '#4B5563' }} dy={10} />
                    <YAxis domain={['dataMin - 10', 'dataMax + 10']} axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#4B5563' }} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#111827', color: '#fff', borderRadius: 0 }} />
                    <Line type="monotone" dataKey="index" stroke="#D97706" strokeWidth={4} dot={false} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Column Chart */}
            <div className="bg-white p-8 border border-gray-200">
              <div className="mb-8 border-b-2 border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Quarterly Property Growth</h3>
                <p className="text-[13px] text-gray-500 mt-1 uppercase tracking-widest">% Growth (QoQ)</p>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={growthData} margin={{ top: 10, right: 20, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="quarter" axisLine={{stroke: '#D1D5DB'}} tickLine={false} tick={{ fontSize: 13, fill: '#4B5563' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#4B5563' }} />
                    <RechartsTooltip cursor={{fill: '#F9FAFB'}} contentStyle={{ backgroundColor: '#111827', color: '#fff', borderRadius: 0 }} />
                    <Bar dataKey="growth" fill="#16A34A" barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 overflow-hidden">
            <div className="p-8 border-b-2 border-gray-100 flex justify-between items-end">
              <div>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Affordability Ranking</h3>
                <p className="text-[13px] text-gray-500 mt-1 uppercase tracking-widest">Ratio House Price to Annual Income</p>
              </div>
              <button className="group flex items-center space-x-2 text-primary font-bold text-[13px] tracking-widest uppercase overflow-hidden">
                <span className="relative z-10 transition-transform duration-300 group-hover:-translate-x-1">Download CSV</span>
                <ArrowRight size={16} className="relative z-10 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-4 px-8 text-[12px] font-bold text-gray-500 uppercase tracking-widest">Rank</th>
                    <th className="py-4 px-8 text-[12px] font-bold text-gray-500 uppercase tracking-widest cursor-pointer hover:text-primary" onClick={() => setSortField('province')}>Province</th>
                    <th className="py-4 px-8 text-[12px] font-bold text-gray-500 uppercase tracking-widest cursor-pointer hover:text-primary" onClick={() => setSortField('price')}>Avg Price (Rp Juta)</th>
                    <th className="py-4 px-8 text-[12px] font-bold text-gray-500 uppercase tracking-widest cursor-pointer hover:text-primary" onClick={() => setSortField('income')}>Annual Income (Rp Juta)</th>
                    <th className="py-4 px-8 text-[12px] font-bold text-gray-500 uppercase tracking-widest cursor-pointer hover:text-primary" onClick={() => setSortField('affordability')}>Affordability Index (x)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedTableData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                      <td className="py-4 px-8 font-bold text-gray-900">{idx + 1}</td>
                      <td className="py-4 px-8 font-bold text-primary">{row.province}</td>
                      <td className="py-4 px-8 text-gray-600 font-medium">{row.price}</td>
                      <td className="py-4 px-8 text-gray-600 font-medium">{row.income}</td>
                      <td className="py-4 px-8">
                        <span className={`inline-flex items-center justify-center px-3 py-1 font-bold text-xs ${row.affordability > 6 ? 'bg-red-100 text-red-700' : row.affordability > 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                          {row.affordability}x
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
