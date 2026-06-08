"use client";

import React, { useEffect, useState } from 'react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ZAxis, ReferenceLine, PieChart, Pie, Cell
} from 'recharts';
import { ArrowRight, ShieldAlert, Zap, TrendingDown, Target, Info } from 'lucide-react';
import { fetchNationalData, fetchProvinceData, NationalTrendData } from '@/lib/dataProvider';
import { CalculatedKPIs } from '@/lib/kpiEngine';

const simulationData = [
  { policy: 'Lower Mortgage Rate by 1%', cost: 'Medium', impactOwnership: '+6.2%', impactAffordability: '+12.5%', timeframe: 'Short-term' },
  { policy: 'Subsidized Land Bank for Developers', cost: 'High', impactOwnership: '+2.1%', impactAffordability: '+18.0%', timeframe: 'Long-term' },
  { policy: 'Expand Public Housing Supply', cost: 'Very High', impactOwnership: '+8.5%', impactAffordability: '+5.0%', timeframe: 'Long-term' },
  { policy: 'Tax Relief for First-Time Buyers', cost: 'Medium', impactOwnership: '+4.0%', impactAffordability: '+8.0%', timeframe: 'Short-term' },
];

const GAUGE_COLORS = ['#D97706', '#E5E7EB']; // Warning Orange

export default function PolicyInsightsPage() {
  const [provinces, setProvinces] = useState<CalculatedKPIs[]>([]);
  const [nationalTrend, setNationalTrend] = useState<NationalTrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [national, provs] = await Promise.all([fetchNationalData(), fetchProvinceData()]);
        setNationalTrend(national);
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

  const latestNational = nationalTrend[nationalTrend.length - 1] || { HousingScore: 65 };
  const gaugeData = [
    { name: 'Score', value: latestNational.HousingScore },
    { name: 'Empty', value: 100 - latestNational.HousingScore },
  ];

  // Build Priority Matrix Data
  const priorityMatrixData = provinces.map(p => {
    let status = 'Low Priority';
    if (p.RiskLevel === 'Critical') status = 'High Priority';
    else if (p.RiskLevel === 'Warning') status = 'Medium Priority';
    
    return {
      province: p.Province,
      affordability: p.AffordabilityIndex,
      backlog: p.HousingBacklog / 1000000,
      status
    };
  });

  const priorityTableData = [...priorityMatrixData].sort((a, b) => b.affordability * b.backlog - a.affordability * a.backlog);

  // Dynamic Rule Engine for Recommendations
  const rules = [];
  const avgAffordability = provinces.reduce((sum, p) => sum + p.AffordabilityIndex, 0) / provinces.length;
  const avgGrowth = provinces.reduce((sum, p) => sum + p.PropertyPriceGrowth, 0) / provinces.length;
  const totalBacklog = provinces.reduce((sum, p) => sum + p.HousingBacklog, 0);
  const avgOwnership = provinces.reduce((sum, p) => sum + p.OwnershipRate, 0) / provinces.length;
  const avgMortgageScore = provinces.reduce((sum, p) => sum + p.MortgageScore, 0) / provinces.length;

  if (avgAffordability > 5.0 && avgGrowth > 2.0) {
    rules.push({ title: 'Supply Expansion', icon: Target, desc: `Affordability is above 5.0x and growth > 2%. Focus on expanding public housing supply and TOD incentives to cool down the market.`, color: 'text-[#005587]' });
  }
  if (totalBacklog > 5000000 && avgOwnership < 80) {
    rules.push({ title: 'Backlog Reduction', icon: TrendingDown, desc: `Backlog is high (>5M). Prioritize public housing investment and RTLH renovations in high-density provinces.`, color: 'text-[#16A34A]' });
  }
  if (avgMortgageScore < 60) {
    rules.push({ title: 'Mortgage Support', icon: Zap, desc: `Mortgage accessibility is below threshold (60). Expand subsidized mortgage programs (FLPP) and explore alternative credit scoring.`, color: 'text-[#00B3DF]' });
  }
  if (avgAffordability > 6.0) {
    rules.push({ title: 'Price Control', icon: ShieldAlert, desc: `Severe affordability crisis (>6.0x). Implement regulations on idle land and progressive taxes on secondary properties.`, color: 'text-[#DC2626]' });
  }

  // Ensure we have at least 4 rules to display nicely
  while (rules.length < 4) {
    rules.push({ title: 'Monitoring Required', icon: Info, desc: 'Current metrics are stable. Continue monitoring key indicators.', color: 'text-gray-500' });
  }

  return (
    <div className="w-full bg-white font-sans text-gray-900 pb-24">
      
      {/* Title Header Section */}
      <div className="max-w-[1600px] mx-auto px-6 xl:px-12 py-12">
        <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tight mb-4">Policy Insights</h1>
        <p className="text-lg text-gray-600 max-w-3xl font-medium leading-relaxed">
          Berdasarkan temuan intelijen pasar perumahan, apa tindakan strategis yang harus dilakukan pemerintah?
          Halaman ini mentranslasikan analytics menjadi dukungan pengambilan keputusan kebijakan (Decision Support).
        </p>
      </div>

      <div className="border-y border-gray-200 bg-[#F9F9F9]">
        <div className="max-w-[1600px] mx-auto px-6 xl:px-12 py-12">

          {/* Final Executive Recommendation (Large Highlight Card) */}
          <div className="bg-[#005587] text-white p-10 md:p-16 mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 transform rotate-45 -mr-20 -mt-20"></div>
            <h3 className="text-[12px] uppercase tracking-widest font-bold text-[#00B3DF] mb-4">Final Executive Recommendation</h3>
            <p className="text-2xl md:text-3xl font-light leading-snug max-w-5xl">
              &quot;Tantangan perumahan Indonesia kini lebih didorong oleh <span className="font-bold">tekanan keterjangkauan harga</span> di provinsi berkembang pesat, bukan sekadar defisit pasokan absolut. Kebijakan yang difokuskan pada <span className="font-bold border-b-2 border-[#00B3DF]">subsidi akses KPR dan pengendalian spekulasi tanah</span> diproyeksikan memberikan dampak tertinggi.&quot;
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 mb-16">
            
            {/* National Risk Score (Gauge) */}
            <div className="lg:col-span-4 bg-white p-8 border border-gray-200 flex flex-col items-center justify-center relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#D97706]"></div>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-2">National Risk Score</h3>
              <p className="text-[12px] text-gray-500 uppercase tracking-widest mb-8">Overall Housing Stability</p>
              
              <div className="h-[200px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gaugeData}
                      cx="50%"
                      cy="100%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius="70%"
                      outerRadius="100%"
                      paddingAngle={0}
                      dataKey="value"
                      stroke="none"
                    >
                      {gaugeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={GAUGE_COLORS[index % GAUGE_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute bottom-0 left-0 w-full text-center pb-4">
                  <div className="text-6xl font-black text-gray-900 tracking-tighter">{latestNational.HousingScore}</div>
                  <div className="text-[13px] font-bold text-[#D97706] uppercase tracking-widest mt-1">
                    {latestNational.HousingScore >= 80 ? 'Low Risk' : latestNational.HousingScore >= 60 ? 'Moderate Risk' : 'High Risk'}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendation Cards */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {rules.slice(0,4).map((rec, i) => (
                <div key={i} className="bg-white p-8 border border-gray-200 hover:border-gray-300 transition-colors flex flex-col">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-2 bg-gray-50 rounded-full ${rec.color}`}><rec.icon size={20} /></div>
                    <h3 className="text-[14px] font-bold text-gray-900 uppercase tracking-widest">{rec.title}</h3>
                  </div>
                  <p className="text-[14px] text-gray-600 font-medium leading-relaxed">{rec.desc}</p>
                </div>
              ))}
            </div>

            {/* Policy Priority Matrix (2x2) */}
            <div className="lg:col-span-6 bg-white p-8 border border-gray-200">
              <div className="mb-8 border-b-2 border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Policy Priority Matrix</h3>
                <p className="text-[13px] text-gray-500 mt-1 uppercase tracking-widest">Affordability vs Backlog Quadrant</p>
              </div>
              <div className="h-[400px] w-full relative">
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-10 pointer-events-none z-0">
                  <div className="bg-[#16A34A] border-r border-b border-gray-400"></div>
                  <div className="bg-[#D97706] border-b border-gray-400"></div>
                  <div className="bg-gray-200 border-r border-gray-400"></div>
                  <div className="bg-[#DC2626]"></div>
                </div>
                <ResponsiveContainer width="100%" height="100%" className="relative z-10">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis type="number" dataKey="affordability" name="Affordability Ratio" domain={[0, 12]} axisLine={{stroke: '#D1D5DB'}} tickLine={false} tick={{ fontSize: 13, fill: '#4B5563' }}>
                    </XAxis>
                    <YAxis type="number" dataKey="backlog" name="Backlog (M Units)" domain={[0, 2]} axisLine={{stroke: '#D1D5DB'}} tickLine={false} tick={{ fontSize: 13, fill: '#4B5563' }} />
                    <ZAxis type="category" dataKey="province" name="Province" />
                    <ReferenceLine x={5} stroke="#9CA3AF" strokeDasharray="5 5" />
                    <ReferenceLine y={0.5} stroke="#9CA3AF" strokeDasharray="5 5" />
                    <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#111827', color: '#fff', borderRadius: 0, fontWeight: 600 }} itemStyle={{ color: '#00B3DF' }} />
                    <Scatter name="Provinces" data={priorityMatrixData} fill="#005587" shape="circle">
                      {priorityMatrixData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.status === 'High Priority' ? '#DC2626' : entry.status === 'Medium Priority' ? '#D97706' : '#16A34A'} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Impact Simulation Scenario Table */}
            <div className="lg:col-span-6 bg-white border border-gray-200 overflow-hidden flex flex-col">
              <div className="p-8 border-b-2 border-gray-100 flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">Impact Simulation</h3>
                  <p className="text-[13px] text-gray-500 mt-1 uppercase tracking-widest">Policy Scenario Outcomes</p>
                </div>
              </div>
              <div className="flex-1 overflow-x-auto p-4">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Policy Intervention</th>
                      <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Est. Cost</th>
                      <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Impact (Affordability)</th>
                      <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Impact (Ownership)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {simulationData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 font-bold text-gray-900">{row.policy}</td>
                        <td className="py-4 px-6"><span className={`text-[11px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm ${row.cost === 'High' || row.cost === 'Very High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{row.cost}</span></td>
                        <td className="py-4 px-6 font-bold text-[#16A34A]">{row.impactAffordability}</td>
                        <td className="py-4 px-6 font-bold text-[#005587]">{row.impactOwnership}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-8 border-t border-gray-100 mt-auto">
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Top Target Provinces</h3>
                <div className="flex flex-wrap gap-2">
                  {priorityTableData.slice(0, 4).map((p, i) => (
                    <span key={i} className="px-3 py-1.5 bg-[#DC2626] text-white text-xs font-bold uppercase tracking-widest rounded-sm">{p.province}</span>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
