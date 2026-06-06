"use client";

import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Treemap
} from 'recharts';
import { ArrowRight, Info, Map } from 'lucide-react';

const topProvinces = [
  { name: 'DKI Jakarta', score: 85 },
  { name: 'DI Yogyakarta', score: 83 },
  { name: 'Jawa Timur', score: 82 },
  { name: 'Bali', score: 80 },
  { name: 'Jawa Barat', score: 79 },
];

const bottomProvinces = [
  { name: 'Papua', score: 52 },
  { name: 'Maluku', score: 55 },
  { name: 'NTT', score: 58 },
  { name: 'Sulawesi Barat', score: 60 },
  { name: 'Papua Barat', score: 61 },
];

const radarData = [
  { subject: 'Affordability', A: 85, B: 65, fullMark: 100 },
  { subject: 'Ownership', A: 60, B: 90, fullMark: 100 },
  { subject: 'Infrastructure', A: 95, B: 70, fullMark: 100 },
  { subject: 'Price Stability', A: 75, B: 85, fullMark: 100 },
  { subject: 'Supply Growth', A: 80, B: 60, fullMark: 100 },
];

const benchmarkData = [
  { province: 'DKI Jakarta', affordability: 3, ownership: 2, backlog: 5, priceGrowth: 4 },
  { province: 'Jawa Barat', affordability: 4, ownership: 3, backlog: 4, priceGrowth: 3 },
  { province: 'Jawa Timur', affordability: 4, ownership: 4, backlog: 3, priceGrowth: 3 },
  { province: 'DI Yogyakarta', affordability: 2, ownership: 5, backlog: 2, priceGrowth: 5 },
  { province: 'Bali', affordability: 1, ownership: 4, backlog: 2, priceGrowth: 5 },
];

const treemapData = [
  { name: 'Java', children: [
      { name: 'DKI Jakarta', size: 85 }, { name: 'Jawa Barat', size: 79 }, { name: 'Jawa Timur', size: 82 }
  ]},
  { name: 'Sumatra', children: [
      { name: 'Sumatera Utara', size: 72 }, { name: 'Riau', size: 68 }, { name: 'Sumatera Selatan', size: 65 }
  ]},
  { name: 'Kalimantan', children: [
      { name: 'Kalimantan Timur', size: 75 }, { name: 'Kalimantan Barat', size: 66 }
  ]},
  { name: 'Sulawesi & East', children: [
      { name: 'Sulawesi Selatan', size: 71 }, { name: 'Bali', size: 80 }, { name: 'Papua', size: 52 }
  ]}
];

// Helper to render heatmap colors
const getHeatmapColor = (value: number) => {
  if (value >= 5) return 'bg-[#005587] text-white'; // High / Excellent (OECD Blue)
  if (value === 4) return 'bg-[#00B3DF] text-white'; // Good (Cyan)
  if (value === 3) return 'bg-[#E5E7EB] text-gray-800'; // Average (Gray)
  if (value === 2) return 'bg-[#FBBF24] text-gray-900'; // Poor (Yellow)
  return 'bg-[#DC2626] text-white'; // Very Poor (Red)
};

export default function RegionalAnalysisPage() {
  return (
    <div className="w-full bg-white font-sans text-gray-900 pb-24">
      
      {/* Title Header Section */}
      <div className="max-w-[1600px] mx-auto px-6 xl:px-12 py-12">
        <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tight mb-4">Regional Analysis</h1>
        <p className="text-lg text-gray-600 max-w-3xl font-medium leading-relaxed">
          Provinsi mana yang memiliki kondisi perumahan terbaik dan terburuk? Analisis spasial 
          dan perbandingan metrik kunci antar wilayah di Indonesia.
        </p>
      </div>

      <div className="border-y border-gray-200 bg-[#F9F9F9]">
        <div className="max-w-[1600px] mx-auto px-6 xl:px-12 py-12">
          
          {/* Key Insight Panel */}
          <div className="bg-white border border-gray-200 p-8 mb-12 flex items-start space-x-6 relative overflow-hidden">
            <div className="w-2 bg-[#00B3DF] absolute left-0 top-0 bottom-0"></div>
            <div className="text-[#00B3DF] mt-1"><Info size={32} /></div>
            <div>
              <h3 className="text-[12px] uppercase tracking-widest font-bold text-gray-500 mb-2">Regional Insight</h3>
              <p className="text-2xl font-bold text-gray-900 leading-snug">
                "Eastern Indonesia shows <span className="text-[#DC2626]">lower prices</span> but suffers from a <span className="text-[#DC2626]">significantly higher backlog</span> compared to Java, driven by infrastructure deficits."
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 mb-16">
            
            {/* Regional Treemap (Map Proxy) */}
            <div className="lg:col-span-12 bg-white p-8 border border-gray-200">
              <div className="flex justify-between items-end mb-8 border-b-2 border-gray-100 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                    <Map size={24} className="text-primary"/> Indonesia Housing Landscape
                  </h3>
                  <p className="text-[13px] text-gray-500 mt-1 uppercase tracking-widest">Regional grouping by Score Intensity (Treemap)</p>
                </div>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <Treemap
                    data={treemapData}
                    dataKey="size"
                    aspectRatio={4 / 3}
                    stroke="#fff"
                    fill="#005587"
                  />
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top 10 Provinces */}
            <div className="lg:col-span-6 bg-white p-8 border border-gray-200">
              <div className="mb-8 border-b-2 border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Top 5 Provinces</h3>
                <p className="text-[13px] text-gray-500 mt-1 uppercase tracking-widest">Highest Intelligence Score</p>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProvinces} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#4B5563' }} domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" axisLine={{stroke: '#D1D5DB'}} tickLine={false} tick={{ fontSize: 13, fill: '#111827', fontWeight: 600 }} />
                    <RechartsTooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D1D5DB', borderRadius: 0, fontWeight: 600 }} />
                    <Bar dataKey="score" fill="#16A34A" barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom 10 Provinces */}
            <div className="lg:col-span-6 bg-white p-8 border border-gray-200">
              <div className="mb-8 border-b-2 border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Bottom 5 Provinces</h3>
                <p className="text-[13px] text-gray-500 mt-1 uppercase tracking-widest">Lowest Intelligence Score</p>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bottomProvinces} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#4B5563' }} domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" axisLine={{stroke: '#D1D5DB'}} tickLine={false} tick={{ fontSize: 13, fill: '#111827', fontWeight: 600 }} />
                    <RechartsTooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D1D5DB', borderRadius: 0, fontWeight: 600 }} />
                    <Bar dataKey="score" fill="#DC2626" barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Radar Chart Comparison */}
            <div className="lg:col-span-4 bg-white p-8 border border-gray-200 flex flex-col justify-center">
              <div className="mb-4 border-b-2 border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Province Comparison</h3>
                <p className="text-[13px] text-gray-500 mt-1 uppercase tracking-widest">DKI Jakarta vs DI Yogyakarta</p>
              </div>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#4B5563', fontSize: 12, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="DKI Jakarta" dataKey="A" stroke="#005587" fill="#005587" fillOpacity={0.4} />
                    <Radar name="DI Yogyakarta" dataKey="B" stroke="#00B3DF" fill="#00B3DF" fillOpacity={0.4} />
                    <RechartsTooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-[#005587]"></div><span className="text-xs font-bold text-gray-600">DKI Jakarta</span></div>
                <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-[#00B3DF]"></div><span className="text-xs font-bold text-gray-600">DI Yogyakarta</span></div>
              </div>
            </div>

            {/* Benchmark Matrix (Heatmap) */}
            <div className="lg:col-span-8 bg-white border border-gray-200 overflow-hidden flex flex-col">
              <div className="p-8 border-b-2 border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Province Benchmark Matrix</h3>
                <p className="text-[13px] text-gray-500 mt-1 uppercase tracking-widest">Performance Heatmap (1=Poor, 5=Excellent)</p>
              </div>
              
              <div className="flex-1 p-8 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-[12px] font-bold text-gray-500 uppercase tracking-widest w-1/3">Province</th>
                      <th className="py-3 px-4 text-[12px] font-bold text-gray-500 uppercase tracking-widest text-center">Affordability</th>
                      <th className="py-3 px-4 text-[12px] font-bold text-gray-500 uppercase tracking-widest text-center">Ownership</th>
                      <th className="py-3 px-4 text-[12px] font-bold text-gray-500 uppercase tracking-widest text-center">Backlog</th>
                      <th className="py-3 px-4 text-[12px] font-bold text-gray-500 uppercase tracking-widest text-center">Price Growth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {benchmarkData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 font-bold text-primary">{row.province}</td>
                        <td className="py-2 px-2">
                          <div className={`w-full py-2 flex justify-center font-bold text-sm ${getHeatmapColor(row.affordability)}`}>{row.affordability}</div>
                        </td>
                        <td className="py-2 px-2">
                          <div className={`w-full py-2 flex justify-center font-bold text-sm ${getHeatmapColor(row.ownership)}`}>{row.ownership}</div>
                        </td>
                        <td className="py-2 px-2">
                          <div className={`w-full py-2 flex justify-center font-bold text-sm ${getHeatmapColor(row.backlog)}`}>{row.backlog}</div>
                        </td>
                        <td className="py-2 px-2">
                          <div className={`w-full py-2 flex justify-center font-bold text-sm ${getHeatmapColor(row.priceGrowth)}`}>{row.priceGrowth}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Heatmap Legend */}
                <div className="mt-8 flex items-center space-x-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  <span>Legend:</span>
                  <div className="flex space-x-1">
                    <div className="w-6 h-6 bg-[#005587] flex items-center justify-center text-white">5</div>
                    <div className="w-6 h-6 bg-[#00B3DF] flex items-center justify-center text-white">4</div>
                    <div className="w-6 h-6 bg-[#E5E7EB] flex items-center justify-center text-gray-800">3</div>
                    <div className="w-6 h-6 bg-[#FBBF24] flex items-center justify-center text-gray-900">2</div>
                    <div className="w-6 h-6 bg-[#DC2626] flex items-center justify-center text-white">1</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
