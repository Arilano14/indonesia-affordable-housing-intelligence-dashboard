"use client";

import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { ArrowRight, Info, Map, Calendar, ChevronDown } from 'lucide-react';
import ChoroplethMap from '@/components/charts/ChoroplethMap';
import { fetchProvinceData } from '@/lib/dataProvider';
import { CalculatedKPIs } from '@/lib/kpiEngine';

// Helpers for Traffic Light Colors (Mean-based)
const getPositiveColor = (value: number, mean: number) => {
  if (value >= mean + 5) return 'bg-[#16A34A] text-white font-bold'; // Green (Lumayan jauh di atas rata-rata)
  if (value >= mean - 5) return 'bg-[#FBBF24] text-gray-900 font-bold'; // Yellow (Dekat dengan rata-rata)
  return 'bg-[#DC2626] text-white font-bold'; // Red (Di bawah rata-rata)
};

const getNegativeColor = (value: number, mean: number) => {
  // For negative indicators (like Backlog), lower is better. 
  // So if value is far below mean, it's green.
  if (value <= mean - 5) return 'bg-[#16A34A] text-white font-bold'; // Green (Lumayan jauh di bawah rata-rata)
  if (value <= mean + 5) return 'bg-[#FBBF24] text-gray-900 font-bold'; // Yellow (Dekat dengan rata-rata)
  return 'bg-[#DC2626] text-white font-bold'; // Red (Di atas rata-rata)
};

const YEARS = ["2026", "2025", "2024"];

export default function RegionalAnalysisPage() {
  const [provinces, setProvinces] = useState<CalculatedKPIs[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("2024");
  const [yearOpen, setYearOpen] = useState(false);

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
  }, [selectedYear]); // Re-fetch if year changes (in real app)

  const displayProvinces = React.useMemo(() => {
    if (selectedYear === "2024") return provinces;
    
    // Simulate historical/future data changes based on year selection for interactive UI demonstration
    const m = selectedYear === "2025" ? 1.05 : selectedYear === "2026" ? 1.1 : 0.95;
    const invM = 1 / m;
    
    return provinces.map(p => ({
      ...p,
      HousingScore: Math.min(95, p.HousingScore * m),
      DemandIndex: Math.min(95, p.DemandIndex * invM),
      SupplyIndex: Math.min(95, p.SupplyIndex * m),
      MortgageAccessibility: Math.min(95, p.MortgageAccessibility * m),
      TotalBacklogPercent: Math.max(0, p.TotalBacklogPercent * invM),
      OwnershipRate: Math.min(100, p.OwnershipRate * m),
      AccessibilityIndex: Math.min(95, p.AccessibilityIndex * m),
    }));
  }, [provinces, selectedYear]);

  const means = React.useMemo(() => {
    const len = displayProvinces.length || 1;
    return {
      HousingScore: displayProvinces.reduce((acc, p) => acc + p.HousingScore, 0) / len,
      DemandIndex: displayProvinces.reduce((acc, p) => acc + p.DemandIndex, 0) / len,
      SupplyIndex: displayProvinces.reduce((acc, p) => acc + p.SupplyIndex, 0) / len,
      MortgageAccessibility: displayProvinces.reduce((acc, p) => acc + p.MortgageAccessibility, 0) / len,
      TotalBacklogPercent: displayProvinces.reduce((acc, p) => acc + p.TotalBacklogPercent, 0) / len,
    };
  }, [displayProvinces]);

  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center font-bold text-primary">Loading Data...</div>;
  }

  const sortedByScore = [...displayProvinces].sort((a, b) => b.HousingScore - a.HousingScore);
  const topProvinces = sortedByScore.slice(0, 5).map(p => ({ name: p.Province, score: p.HousingScore }));
  const bottomProvinces = sortedByScore.slice(-5).map(p => ({ name: p.Province, score: p.HousingScore }));

  const mapData = displayProvinces.map(p => ({
    province: p.Province,
    score: p.HousingScore
  }));

  // Find Jakarta and Jogja for Radar Comparison
  const jkt = displayProvinces.find(p => p.Province.includes("Jakarta")) || displayProvinces[0] || {} as CalculatedKPIs;
  const jog = displayProvinces.find(p => p.Province.includes("Yogyakarta")) || displayProvinces[1] || displayProvinces[0] || {} as CalculatedKPIs;

  const radarData = [
    { subject: 'Accessibility', A: jkt.AccessibilityIndex, B: jog.AccessibilityIndex, fullMark: 100 },
    { subject: 'Ownership', A: jkt.OwnershipRate, B: jog.OwnershipRate, fullMark: 100 },
    { subject: 'Supply Index', A: jkt.SupplyIndex, B: jog.SupplyIndex, fullMark: 100 },
    { subject: 'Mortgage Access', A: jkt.MortgageAccessibility, B: jog.MortgageAccessibility, fullMark: 100 },
    { subject: 'Demand Index', A: jkt.DemandIndex, B: jog.DemandIndex, fullMark: 100 },
  ];

  return (
    <div className="w-full bg-white font-sans text-gray-900 pb-24 min-h-screen">
      
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
                &quot;Eastern Indonesia shows <span className="text-[#DC2626]">lower intelligence scores</span> and suffers from a <span className="text-[#DC2626]">significantly higher backlog</span> compared to Java, driven by infrastructure deficits.&quot;
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 mb-16">
            
            {/* Choropleth Map */}
            <div className="lg:col-span-12 bg-white p-8 border border-gray-200 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex justify-between items-end mb-8 border-b-2 border-gray-100 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                    <Map size={24} className="text-primary"/> Indonesia Housing Landscape
                  </h3>
                  <p className="text-[13px] text-gray-500 mt-1 uppercase tracking-widest">Housing Intelligence Score (Choropleth Map)</p>
                </div>
              </div>
              <div className="w-full relative min-h-[400px]">
                <ChoroplethMap data={mapData} meanScore={means.HousingScore} />
              </div>
            </div>

            {/* Radar Chart Comparison */}
            <div className="lg:col-span-4 bg-white p-8 border border-gray-200 flex flex-col justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="mb-8 border-b-2 border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Regional Benchmark</h3>
                <p className="text-[13px] text-gray-500 mt-1 uppercase tracking-widest">Jakarta vs Yogyakarta</p>
              </div>
              <div className="relative w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6B7280' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Jakarta" dataKey="A" stroke="#00B3DF" fill="#00B3DF" fillOpacity={0.5} />
                    <Radar name="Yogyakarta" dataKey="B" stroke="#16A34A" fill="#16A34A" fillOpacity={0.5} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D1D5DB', borderRadius: 0, fontWeight: 600 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top 5 Provinces */}
            <div className="lg:col-span-4 bg-white p-8 border border-gray-200 hover:shadow-sm transition-shadow animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="mb-8 border-b-2 border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Top 5 Provinces</h3>
                <p className="text-[13px] text-gray-500 mt-1 uppercase tracking-widest">Highest Housing Intelligence Score</p>
              </div>
              <div className="relative w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProvinces} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#4B5563' }} domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" axisLine={{stroke: '#D1D5DB'}} tickLine={false} tick={{ fontSize: 13, fill: '#111827', fontWeight: 600 }} />
                    <RechartsTooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D1D5DB', borderRadius: 0, fontWeight: 600 }} />
                    <Bar dataKey="score" fill="#16A34A" barSize={24} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom 5 Provinces */}
            <div className="lg:col-span-4 bg-white p-8 border border-gray-200 hover:shadow-sm transition-shadow animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="mb-8 border-b-2 border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Bottom 5 Provinces</h3>
                <p className="text-[13px] text-gray-500 mt-1 uppercase tracking-widest">Lowest Housing Intelligence Score</p>
              </div>
              <div className="relative w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bottomProvinces.reverse()} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#4B5563' }} domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" axisLine={{stroke: '#D1D5DB'}} tickLine={false} tick={{ fontSize: 13, fill: '#111827', fontWeight: 600 }} />
                    <RechartsTooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D1D5DB', borderRadius: 0, fontWeight: 600 }} />
                    <Bar dataKey="score" fill="#DC2626" barSize={24} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Benchmark Matrix (Heatmap) for ALL Provinces with Year Selector */}
            <div className="lg:col-span-12 bg-white border border-gray-200 overflow-hidden flex flex-col hover:shadow-sm transition-shadow animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="p-8 border-b-2 border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">Complete Province Benchmark Data</h3>
                  <p className="text-[13px] text-gray-500 mt-1 uppercase tracking-widest">Housing Demand vs Supply & Mortgage Accessibility (All Provinces)</p>
                </div>
                
                {/* Embedded Year Filter for this Specific Card */}
                <div className="relative z-20">
                  <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1"><Calendar size={12}/> Timeframe</span>
                  <button 
                    onClick={() => setYearOpen(!yearOpen)}
                    className={`flex items-center justify-between min-w-[120px] bg-white text-gray-900 font-bold px-3 py-2 border border-gray-200 rounded-md focus:outline-none hover:border-primary transition-colors ${yearOpen ? 'ring-2 ring-primary/20 border-primary' : ''}`}
                  >
                    <span>{selectedYear}</span>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${yearOpen ? 'rotate-180 text-primary' : ''}`} />
                  </button>
                  {yearOpen && (
                    <div className="absolute top-full right-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
                      {YEARS.map(yr => (
                        <button 
                          key={yr} 
                          onClick={() => { setSelectedYear(yr); setYearOpen(false); }}
                          className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors ${selectedYear === yr ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'}`}
                        >
                          {yr}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1 p-8 overflow-x-auto">
                <div className="max-h-[600px] overflow-y-auto custom-scrollbar border border-gray-100 rounded-md">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm">
                      <tr>
                        <th className="py-4 px-6 text-[12px] font-bold text-gray-500 uppercase tracking-widest bg-gray-50">Province</th>
                        <th className="py-4 px-4 text-[12px] font-bold text-gray-500 uppercase tracking-widest text-center bg-gray-50">Housing Intelligence Score</th>
                        <th className="py-4 px-4 text-[12px] font-bold text-gray-500 uppercase tracking-widest text-center bg-gray-50">Demand Index</th>
                        <th className="py-4 px-4 text-[12px] font-bold text-gray-500 uppercase tracking-widest text-center bg-gray-50">Supply Index</th>
                        <th className="py-4 px-4 text-[12px] font-bold text-gray-500 uppercase tracking-widest text-center bg-gray-50">Mortgage Access</th>
                        <th className="py-4 px-4 text-[12px] font-bold text-gray-500 uppercase tracking-widest text-center bg-gray-50">Total Backlog (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {sortedByScore.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-6 font-bold text-gray-900">{row.Province}</td>
                          <td className="py-2 px-4">
                            <div className={`w-full py-1.5 rounded flex justify-center text-[13px] ${getPositiveColor(row.HousingScore, means.HousingScore)}`}>{row.HousingScore?.toFixed(1)}</div>
                          </td>
                          <td className="py-2 px-4">
                            {/* Demand index pressure (High demand -> High pressure/worse) */}
                            <div className={`w-full py-1.5 rounded flex justify-center text-[13px] ${getPositiveColor(100 - row.DemandIndex, 100 - means.DemandIndex)}`}>{row.DemandIndex?.toFixed(1)}</div>
                          </td>
                          <td className="py-2 px-4">
                            <div className={`w-full py-1.5 rounded flex justify-center text-[13px] ${getPositiveColor(row.SupplyIndex, means.SupplyIndex)}`}>{row.SupplyIndex?.toFixed(1)}</div>
                          </td>
                          <td className="py-2 px-4">
                            <div className={`w-full py-1.5 rounded flex justify-center text-[13px] ${getPositiveColor(row.MortgageAccessibility, means.MortgageAccessibility)}`}>{row.MortgageAccessibility?.toFixed(1)}</div>
                          </td>
                          <td className="py-2 px-4">
                            <div className={`w-full py-1.5 rounded flex justify-center text-[13px] ${getNegativeColor(row.TotalBacklogPercent, means.TotalBacklogPercent)}`}>{row.TotalBacklogPercent?.toFixed(1)}%</div>
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
      </div>
    </div>
  );
}
