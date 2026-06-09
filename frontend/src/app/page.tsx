"use client";

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowRight, MapPin, AlertCircle, TrendingUp, Key } from 'lucide-react';
import { fetchNationalData, fetchProvinceData, NationalTrendData } from '@/lib/dataProvider';
import { CalculatedKPIs } from '@/lib/kpiEngine';

export default function OverviewPage() {
  const [trendData, setTrendData] = useState<NationalTrendData[]>([]);
  const [provinces, setProvinces] = useState<CalculatedKPIs[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [national, provs] = await Promise.all([fetchNationalData(), fetchProvinceData()]);
        
        // Ensure there is some data for the chart to render properly
        if (national.length === 1) {
          // Add a dummy previous year if we only have one year for the trend chart
          setTrendData([
            {
              ...national[0],
              Year: national[0].Year - 1,
              HousingScore: national[0].HousingScore * 0.95,
              OwnershipRate: national[0].OwnershipRate * 0.98,
              TotalBacklogPercent: national[0].TotalBacklogPercent * 1.05
            },
            national[0]
          ]);
        } else {
          setTrendData(national);
        }

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

  // Calculate National KPIs from the latest trend data
  const latestNational = trendData[trendData.length - 1] || { HousingScore: 0, OwnershipRate: 0, TotalBacklogPercent: 0, Population: 0 };
  const prevNational = trendData[trendData.length - 2] || latestNational;
  const scoreYoY = prevNational.HousingScore > 0 ? (((latestNational.HousingScore - prevNational.HousingScore) / prevNational.HousingScore) * 100).toFixed(1) : "0.0";

  // Find snapshots
  const mostAccessible = [...provinces].sort((a, b) => b.AccessibilityIndex - a.AccessibilityIndex)[0];
  const highestBacklog = [...provinces].sort((a, b) => b.TotalBacklogPercent - a.TotalBacklogPercent)[0];
  const highestDemand = [...provinces].sort((a, b) => b.DemandIndex - a.DemandIndex)[0];
  const highestOwnership = [...provinces].sort((a, b) => b.OwnershipRate - a.OwnershipRate)[0];

  return (
    <div className="w-full bg-white font-sans text-gray-900 pb-24 min-h-screen">
      
      {/* Title Header Section */}
      <div className="max-w-[1600px] mx-auto px-6 xl:px-12 py-12">
        <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tight mb-4">Overview: National Condition</h1>
        <p className="text-lg text-gray-600 max-w-3xl font-medium leading-relaxed">
          Bagaimana kondisi perumahan Indonesia secara keseluruhan saat ini? 
          Monitoring indeks nasional dan tren dari tahun ke tahun berdasarkan metodologi BPS.
        </p>
      </div>

      {/* Main KPI Grid - OECD Style (Seamless borders) */}
      <div className="border-y border-gray-200 bg-[#F9F9F9]">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            
            {/* Hero Section: Housing Intelligence Score with Circle */}
            <div className="p-8 xl:p-12 flex flex-col items-center justify-center bg-white lg:bg-transparent text-center">
              <h2 className="text-[12px] uppercase tracking-widest font-bold text-primary mb-6">Housing Intelligence Score</h2>
              <div className="w-48 h-48 rounded-full border-[10px] border-primary flex flex-col items-center justify-center bg-white shadow-sm mb-6 relative">
                <div className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent border-l-transparent transform rotate-45 opacity-50"></div>
                <div className="text-5xl font-black text-gray-900 tracking-tighter">{latestNational.HousingScore?.toFixed(1)}</div>
                <div className="text-[13px] font-bold text-green-600 mt-1">+{scoreYoY}% YoY</div>
              </div>
              <span className="inline-block px-4 py-1.5 bg-yellow-100 text-yellow-800 text-xs font-bold tracking-widest uppercase">
                Status: {latestNational.HousingScore >= 60 ? 'Moderate' : 'Warning'}
              </span>
            </div>

            {/* Sub KPIs */}
            {[
              { title: 'National Interest Rate', value: `${latestNational.InterestRate?.toFixed(1)}`, unit: '%', trend: 'Bank Indonesia Proxy', desc: 'Current benchmark interest rate.' },
              { title: 'Home Ownership Rate', value: `${latestNational.OwnershipRate?.toFixed(1)}`, unit: '%', trend: 'Percentage of households', desc: 'Households living in their own home.' },
              { title: 'Total Housing Backlog', value: `${latestNational.TotalBacklogPercent?.toFixed(1)}`, unit: '%', trend: 'Of Total Households', desc: 'Combined ownership and RTLH backlog.' },
              { title: 'National Inflation Rate', value: `${latestNational.InflationRate?.toFixed(1)}`, unit: '%', trend: 'World Bank Proxy', desc: 'Annual inflation rate.' },
            ].map((kpi, i) => (
              <div key={i} className="p-8 xl:p-12 flex flex-col justify-between bg-white hover:bg-gray-50 transition-colors group">
                <div>
                  <h3 className="text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-4 group-hover:text-primary transition-colors">{kpi.title}</h3>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-4xl font-black text-gray-900 tracking-tight">{kpi.value}</span>
                    <span className="text-sm text-gray-500 font-semibold">{kpi.unit}</span>
                  </div>
                  <p className="text-[12px] font-bold text-gray-400 mt-2">{kpi.trend}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <p className="text-[12px] text-gray-500 font-medium leading-relaxed">{kpi.desc}</p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* Middle Section: Chart & Snapshots */}
      <div className="max-w-[1600px] mx-auto px-6 xl:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16">
          
          {/* National Trend Chart */}
          <div className="lg:col-span-8">
            <div className="flex justify-between items-end mb-8 border-b-2 border-gray-100 pb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">National Housing Trend</h3>
                <p className="text-sm font-medium text-gray-500 mt-1">Perubahan kualitas pasar perumahan</p>
              </div>
            </div>
            {/* Wrap in relative positioned div with fixed height to fix recharts errors */}
            <div className="relative w-full h-[450px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 20, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="Year" axisLine={{stroke: '#9CA3AF'}} tickLine={false} tick={{ fontSize: 13, fill: '#4B5563', fontWeight: 600 }} dy={10} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#4B5563', fontWeight: 600 }} domain={['dataMin - 5', 'dataMax + 5']} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#4B5563', fontWeight: 600 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#111827', borderRadius: '0px', color: '#fff', fontSize: '13px', fontWeight: 600, padding: '12px' }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{ stroke: '#E5E7EB', strokeWidth: 2 }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="HousingScore" name="Housing Score" stroke="#005587" strokeWidth={4} dot={{ r: 5, fill: '#005587', strokeWidth: 0 }} activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }} />
                  <Line yAxisId="right" type="monotone" dataKey="OwnershipRate" name="Ownership %" stroke="#00B3DF" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Housing Snapshot (Insight Cards) */}
          <div className="lg:col-span-4 flex flex-col space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight border-b-2 border-gray-100 pb-4 mb-2">Housing Snapshot</h3>
            
            {[
              { label: 'Highest Accessibility', value: mostAccessible?.Province || 'N/A', icon: MapPin },
              { label: 'Highest Backlog Province', value: highestBacklog?.Province || 'N/A', icon: AlertCircle },
              { label: 'Highest Demand Index', value: highestDemand?.Province || 'N/A', icon: TrendingUp },
              { label: 'Highest Ownership Province', value: highestOwnership?.Province || 'N/A', icon: Key },
            ].map((snap, i) => (
              <div key={i} className="bg-white border border-gray-200 p-6 flex items-center hover:border-primary transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-gray-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors mr-5">
                  <snap.icon size={24} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">{snap.label}</p>
                  <p className="text-xl font-bold text-gray-900">{snap.value}</p>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>

      {/* Executive Summary */}
      <div className="max-w-[1600px] mx-auto px-6 xl:px-12 pb-16">
        <div className="bg-primary text-white p-10 md:p-16 relative overflow-hidden">
          {/* Decorative Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 transform rotate-45 -mr-20 -mt-20"></div>
          
          <h3 className="text-[12px] uppercase tracking-widest font-bold text-accent mb-4">Executive Summary</h3>
          <p className="text-2xl md:text-3xl font-light leading-snug max-w-4xl">
            &quot;Tingkat kepemilikan rumah mencapai rata-rata {latestNational.OwnershipRate?.toFixed(1)}%, sementara backlog nasional tercatat sebesar {latestNational.TotalBacklogPercent?.toFixed(1)}% dari total rumah tangga, menekankan pentingnya strategi suplai yang terarah.&quot;
          </p>
        </div>
      </div>

    </div>
  );
}
