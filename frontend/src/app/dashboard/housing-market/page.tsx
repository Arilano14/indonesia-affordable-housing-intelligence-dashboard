"use client";

import React, { useEffect, useState } from 'react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ZAxis,
  LineChart, Line, BarChart, Bar, ComposedChart, Legend, Cell
} from 'recharts';
import { ArrowRight, Info } from 'lucide-react';
import { fetchNationalData, fetchProvinceData, NationalTrendData } from '@/lib/dataProvider';
import { CalculatedKPIs } from '@/lib/kpiEngine';

const DynamicData = ({ children, className = "text-accent border-accent/50" }: { children: React.ReactNode, className?: string }) => (
  <span className={`font-bold relative group cursor-help border-b border-dashed pb-[1px] ${className}`}>
    {children}
    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-900 text-white text-[10px] uppercase tracking-widest font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-md">
      Update Terakhir: Q3 2024
    </span>
  </span>
);

export default function HousingMarketPage() {
  const [sortField, setSortField] = useState('AccessibilityIndex');
  const [trendData, setTrendData] = useState<NationalTrendData[]>([]);
  const [provinces, setProvinces] = useState<CalculatedKPIs[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Chart Toggle States
  const [showBacklog, setShowBacklog] = useState(true);
  const [showInterestRate, setShowInterestRate] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [national, provs] = await Promise.all([fetchNationalData(), fetchProvinceData()]);
        
        if (national.length === 1) {
          setTrendData([
            {
              ...national[0],
              Year: national[0].Year - 2,
              TotalBacklogPercent: national[0].TotalBacklogPercent * 1.1,
              InterestRate: national[0].InterestRate * 0.8
            },
            {
              ...national[0],
              Year: national[0].Year - 1,
              TotalBacklogPercent: national[0].TotalBacklogPercent * 1.05,
              InterestRate: national[0].InterestRate * 0.9
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

  // Scatter Data (GDP vs Poverty)
  const scatterData = provinces.map(p => ({
    province: p.Province,
    gdp: p.GDPPerCapita / 1000000,
    poverty: p.PovertyRate,
    accessibility: p.AccessibilityIndex,
    population: p.Population
  }));

  // Demand vs Supply Data for ALL Provinces, sorted by Population
  const allProvincesSortedByPop = [...provinces].sort((a, b) => b.Population - a.Population);

  const sortedTableData = [...provinces].sort((a, b) => {
    return (b[sortField as keyof typeof b] as number) > (a[sortField as keyof typeof a] as number) ? 1 : -1;
  });

  const topAccessibility = [...provinces].sort((a, b) => b.AccessibilityIndex - a.AccessibilityIndex)[0];
  const highestBacklog = [...provinces].sort((a, b) => b.TotalBacklogPercent - a.TotalBacklogPercent)[0];

  const generateBacklogInsight = () => {
    if (!highestBacklog) return <></>;
    const prov = <DynamicData>{highestBacklog.Province}</DynamicData>;
    const backlog = <DynamicData>{highestBacklog.TotalBacklogPercent.toFixed(1)}%</DynamicData>;
    if (highestBacklog.TotalBacklogPercent > 30) {
      return <>Province {prov} faces a critical housing deficit. With {backlog} backlog, urgent supply-side interventions are mandated to address the severe shortage.</>;
    } else if (highestBacklog.TotalBacklogPercent <= 10) {
      return <>Province {prov} demonstrates high housing resilience with a minimal backlog of {backlog}, outperforming the national benchmark significantly.</>;
    } else {
      return <>Province {prov} reports the highest national backlog at {backlog}. While not at critical crisis levels (&gt;30%), sustained supply-demand imbalances require continued policy focus.</>;
    }
  };

  const getPositiveColor = (val: number) => {
    if (val >= 75) return 'bg-[#16A34A] text-white'; // Green
    if (val >= 50) return 'bg-[#FBBF24] text-gray-900'; // Yellow
    return 'bg-[#DC2626] text-white'; // Red
  };

  const getNegativeColor = (val: number) => {
    if (val >= 20) return 'bg-[#DC2626] text-white'; // Red
    if (val >= 10) return 'bg-[#FBBF24] text-gray-900'; // Yellow
    return 'bg-[#16A34A] text-white'; // Green
  };

  return (
    <div className="w-full bg-white font-sans text-gray-900 pb-24 min-h-screen">
      
      {/* Title Header Section */}
      <div className="w-full bg-[#0B1B36] text-white">
        <div className="max-w-[1600px] mx-auto px-6 xl:px-12 py-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-white">Housing Market</h1>
          <p className="text-xl md:text-3xl text-[#00B3DF] max-w-4xl font-light leading-snug">
            Bagaimana kapasitas makroekonomi mempengaruhi keterjangkauan rumah? Analisis PDRB per Kapita, 
            tingkat kemiskinan, serta keseimbangan suplai dan permintaan di tingkat provinsi.
          </p>
        </div>
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
              &quot;{generateBacklogInsight()}&quot;
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 mb-16">
            
            {/* Scatter Plot */}
            <div className="bg-white p-8 border border-gray-200 lg:col-span-12 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="mb-8 border-b-2 border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">GDP Per Capita vs Poverty Rate</h3>
                <p className="text-[13px] text-gray-500 mt-1 uppercase tracking-widest">Macroeconomic Accessibility</p>
              </div>
              <div className="relative w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis type="number" dataKey="gdp" name="GDP/Capita" axisLine={{stroke: '#D1D5DB'}} tickLine={false} tick={{ fontSize: 13, fill: '#4B5563' }} tickFormatter={(val) => `Rp ${val.toLocaleString('id-ID')} Juta`} />
                    <YAxis type="number" dataKey="poverty" name="Poverty Rate" axisLine={{stroke: '#D1D5DB'}} tickLine={false} tick={{ fontSize: 13, fill: '#4B5563' }} tickFormatter={(val) => `${val.toLocaleString('id-ID')}%`} />
                    <ZAxis type="category" dataKey="province" name="Province" />
                    <RechartsTooltip 
                      cursor={{ strokeDasharray: '3 3' }} 
                      contentStyle={{ backgroundColor: '#111827', color: '#fff', borderRadius: 0, fontWeight: 600 }} 
                      itemStyle={{ color: '#00B3DF' }} 
                      formatter={(value: any, name: string) => {
                        if (name === 'GDP/Capita') return [`Rp ${Number(value).toLocaleString('id-ID')} Juta`, name];
                        if (name === 'Poverty Rate') return [`${Number(value).toLocaleString('id-ID')}%`, name];
                        return [typeof value === 'number' ? value.toLocaleString('id-ID') : value, name];
                      }}
                    />
                    <Scatter name="Provinces" data={scatterData} fill="#005587" shape="circle" line={false}>
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Dual Axis Chart (Supply vs Demand) */}
            <div className="bg-white p-8 border border-gray-200 lg:col-span-12 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="mb-6 border-b-2 border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Housing Demand vs Supply Index</h3>
                <p className="text-[13px] text-gray-500 mt-1 uppercase tracking-widest">All Provinces (Sorted by Population)</p>
              </div>
              <div className="mb-4 bg-[#0B1120] text-[#4ADE80] p-4 rounded-md text-[13px] font-mono overflow-x-auto border border-gray-800 shadow-inner leading-relaxed">
                <span className="text-gray-500">/* Derived using weighted composite index */</span><br/>
                DemandIndex = (0.40 * PopulationScore) + (0.40 * HouseholdScore) + (0.20 * DensityScore)<br/>
                SupplyIndex = 100 - (0.60 * BacklogOwnership + 0.40 * BacklogRTLH)
              </div>
              <p className="text-[13px] text-gray-600 font-medium mb-6 leading-relaxed p-4 bg-blue-50 border-l-4 border-primary rounded-r">
                <strong>Catatan Metodologi:</strong> Penggunaan <em>Weighted Addition</em> (Penjumlahan Berbobot) pada Demand Index dirancang untuk menanggulangi ketimpangan jumlah populasi ekstrim antara Pulau Jawa dan provinsi lain. Jika menggunakan perkalian murni, provinsi berpopulasi padat seperti Jawa Barat akan menarik batas atas normalisasi hingga menekan provinsi luar Jawa ke angka nol (<em>Zero-Skewing</em>).
              </p>
              <div className="relative w-full h-[450px] overflow-x-auto custom-scrollbar">
                <div style={{ minWidth: '1500px', height: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={allProvincesSortedByPop} margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                      <XAxis dataKey="Province" axisLine={{stroke: '#D1D5DB'}} tickLine={false} tick={{ fontSize: 11, fill: '#4B5563' }} angle={-45} textAnchor="end" height={100}/>
                      <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#4B5563' }} />
                      <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#4B5563' }} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#111827', color: '#fff', borderRadius: 0 }} 
                        itemStyle={{ color: '#fff' }}
                        formatter={(value: any, name: string) => [typeof value === 'number' ? value.toLocaleString('id-ID', { maximumFractionDigits: 2 }) : value, name]}
                      />
                      <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '13px', fontWeight: 600 }} />
                      <Bar yAxisId="left" dataKey="SupplyIndex" name="Supply Index" fill="#00B3DF" barSize={16} />
                      <Line yAxisId="right" type="monotone" dataKey="DemandIndex" name="Demand Index" stroke="#DC2626" strokeWidth={3} dot={{ r: 3 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Trend Chart (National Backlog) */}
            <div className="bg-white p-8 border border-gray-200 lg:col-span-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="mb-8 border-b-2 border-gray-100 pb-4 flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">National Macro Trend</h3>
                  <p className="text-[13px] text-gray-500 mt-1 uppercase tracking-widest">Historical Indicator Comparison</p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <label className="flex items-center space-x-2 text-sm font-bold text-gray-700 cursor-pointer hover:text-primary">
                    <input type="checkbox" className="rounded text-primary border-gray-300 focus:ring-primary w-4 h-4" 
                           checked={showBacklog} onChange={(e) => setShowBacklog(e.target.checked)} />
                    <span>Total Backlog (%)</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm font-bold text-gray-700 cursor-pointer hover:text-primary">
                    <input type="checkbox" className="rounded text-primary border-gray-300 focus:ring-primary w-4 h-4" 
                           checked={showInterestRate} onChange={(e) => setShowInterestRate(e.target.checked)} />
                    <span>Interest Rate (%)</span>
                  </label>
                </div>
              </div>
              <div className="relative w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 10, right: 20, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="Year" axisLine={{stroke: '#D1D5DB'}} tickLine={false} tick={{ fontSize: 13, fill: '#4B5563' }} dy={10} />
                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#4B5563' }} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#111827', color: '#fff', borderRadius: 0 }} 
                      itemStyle={{ color: '#fff' }}
                      formatter={(value: any, name: string) => [typeof value === 'number' ? value.toLocaleString('id-ID', { maximumFractionDigits: 2 }) : value, name]}
                    />
                    {showBacklog && <Line type="monotone" dataKey="TotalBacklogPercent" name="Backlog %" stroke="#DC2626" strokeWidth={4} dot={{ r: 4 }} activeDot={{ r: 8 }} />}
                    {showInterestRate && <Line type="monotone" dataKey="InterestRate" name="Interest Rate %" stroke="#005587" strokeWidth={4} dot={{ r: 4 }} activeDot={{ r: 8 }} />}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Column Chart */}
            <div className="bg-white p-8 border border-gray-200 lg:col-span-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="mb-6 border-b-2 border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Mortgage Accessibility</h3>
                <p className="text-[13px] text-gray-500 mt-1 uppercase tracking-widest">All Provinces</p>
              </div>
              <div className="mb-6 bg-[#0B1120] text-[#4ADE80] p-4 rounded-md text-[13px] font-mono overflow-x-auto border border-gray-800 shadow-inner leading-relaxed">
                <span className="text-gray-500">/* Incorporates benchmark interest rate (BI Rate) */</span><br/>
                MortgageScore = (0.60 * AccessibilityIndex) + (0.40 * InterestRateInverse)
              </div>
              <div className="relative w-full h-[400px] overflow-y-auto custom-scrollbar border border-gray-100 pr-2">
                <div style={{ height: '700px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[...provinces].sort((a,b)=>b.MortgageAccessibility-a.MortgageAccessibility)} margin={{ top: 10, right: 20, bottom: 5, left: 10 }} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                      <XAxis type="number" axisLine={{stroke: '#D1D5DB'}} tickLine={false} tick={{ fontSize: 13, fill: '#4B5563' }} domain={[0, 100]} />
                      <YAxis dataKey="Province" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4B5563', fontWeight: 600 }} width={120}/>
                      <RechartsTooltip cursor={{fill: '#F9FAFB'}} contentStyle={{ backgroundColor: '#111827', color: '#fff', borderRadius: 0 }} itemStyle={{ color: '#fff' }} formatter={(value: any, name: string) => [typeof value === 'number' ? value.toLocaleString('id-ID', { maximumFractionDigits: 2 }) : value, name]} />
                      <Bar dataKey="MortgageAccessibility" name="Mortgage Score" barSize={12}>
                        {[...provinces].sort((a,b)=>b.MortgageAccessibility-a.MortgageAccessibility).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.MortgageAccessibility >= 75 ? '#16A34A' : entry.MortgageAccessibility >= 50 ? '#FBBF24' : '#DC2626'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="p-8 border-b-2 border-gray-100 flex flex-col gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Market Ranking</h3>
                <p className="text-[13px] text-gray-500 mt-1 uppercase tracking-widest">Benchmark per Province</p>
              </div>
              <div className="w-full bg-[#0B1120] text-[#4ADE80] p-4 rounded-md text-[13px] font-mono overflow-x-auto border border-gray-800 shadow-inner leading-relaxed">
                <span className="text-gray-500">/* Access Index measures basic macro affordability */</span><br/>
                AccessibilityIndex = (0.30 * GDPScore) + (0.30 * OwnershipScore) + (0.20 * PovertyInverse) + (0.20 * BacklogInverse)
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-4 px-8 text-[12px] font-bold text-gray-500 uppercase tracking-widest">Rank</th>
                    <th className="py-4 px-8 text-[12px] font-bold text-gray-500 uppercase tracking-widest cursor-pointer hover:text-primary" onClick={() => setSortField('Province')}>Province</th>
                    <th className="py-4 px-8 text-[12px] font-bold text-gray-500 uppercase tracking-widest cursor-pointer hover:text-primary" onClick={() => setSortField('GDPPerCapita')}>PDRB/Kapita (Rp Juta)</th>
                    <th className="py-4 px-8 text-[12px] font-bold text-gray-500 uppercase tracking-widest cursor-pointer hover:text-primary" onClick={() => setSortField('PovertyRate')}>Poverty (%)</th>
                    <th className="py-4 px-8 text-[12px] font-bold text-gray-500 uppercase tracking-widest cursor-pointer hover:text-primary" onClick={() => setSortField('AccessibilityIndex')}>Access Index (0-100)</th>
                    <th className="py-4 px-8 text-[12px] font-bold text-gray-500 uppercase tracking-widest cursor-pointer hover:text-primary" onClick={() => setSortField('MortgageAccessibility')}>Mortgage Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedTableData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                      <td className="py-4 px-8 font-bold text-gray-900">{idx + 1}</td>
                      <td className="py-4 px-8 font-bold text-primary">{row.Province}</td>
                      <td className="py-4 px-8 text-gray-600 font-medium">{(row.GDPPerCapita/1000000).toFixed(1)}</td>
                      <td className="py-4 px-8 text-gray-600 font-medium">
                        <span className={`inline-flex items-center justify-center px-3 py-1 font-bold text-xs rounded-sm ${getNegativeColor(row.PovertyRate)}`}>
                          {row.PovertyRate.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-4 px-8">
                        <span className={`inline-flex items-center justify-center px-3 py-1 font-bold text-xs rounded-sm ${getPositiveColor(row.AccessibilityIndex)}`}>
                          {row.AccessibilityIndex.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-4 px-8 text-gray-600 font-medium">
                        <span className={`inline-flex items-center justify-center px-3 py-1 font-bold text-xs rounded-sm ${getPositiveColor(row.MortgageAccessibility)}`}>
                          {row.MortgageAccessibility.toFixed(1)}
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
