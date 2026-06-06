"use client";

import React from 'react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ZAxis, ReferenceLine, PieChart, Pie, Cell
} from 'recharts';
import { ArrowRight, ShieldAlert, Zap, TrendingDown, Target } from 'lucide-react';

const priorityMatrixData = [
  { province: 'DKI Jakarta', affordability: 7.9, backlog: 1.2, status: 'High Priority' },
  { province: 'Jawa Barat', affordability: 6.4, backlog: 2.1, status: 'High Priority' },
  { province: 'Banten', affordability: 6.8, backlog: 1.5, status: 'High Priority' },
  { province: 'Jawa Tengah', affordability: 4.5, backlog: 1.8, status: 'Medium Priority' },
  { province: 'Jawa Timur', affordability: 5.6, backlog: 1.7, status: 'Medium Priority' },
  { province: 'Bali', affordability: 10.8, backlog: 0.3, status: 'High Priority' },
  { province: 'DI Yogyakarta', affordability: 8.4, backlog: 0.4, status: 'Medium Priority' },
  { province: 'Papua', affordability: 3.5, backlog: 0.8, status: 'Low Priority' },
  { province: 'Sulawesi Selatan', affordability: 4.5, backlog: 0.6, status: 'Low Priority' },
];

const priorityTableData = [...priorityMatrixData].sort((a, b) => b.affordability * b.backlog - a.affordability * a.backlog);

const simulationData = [
  { policy: 'Lower Mortgage Rate by 1%', cost: 'Medium', impactOwnership: '+6.2%', impactAffordability: '+12.5%', timeframe: 'Short-term' },
  { policy: 'Subsidized Land Bank for Developers', cost: 'High', impactOwnership: '+2.1%', impactAffordability: '+18.0%', timeframe: 'Long-term' },
  { policy: 'Expand Public Housing Supply', cost: 'Very High', impactOwnership: '+8.5%', impactAffordability: '+5.0%', timeframe: 'Long-term' },
  { policy: 'Tax Relief for First-Time Buyers', cost: 'Medium', impactOwnership: '+4.0%', impactAffordability: '+8.0%', timeframe: 'Short-term' },
];

// Gauge Chart Data
const gaugeData = [
  { name: 'Score', value: 65 },
  { name: 'Empty', value: 35 },
];
const GAUGE_COLORS = ['#D97706', '#E5E7EB']; // Warning Orange

export default function PolicyInsightsPage() {
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
              "Tantangan perumahan Indonesia kini lebih didorong oleh <span className="font-bold">tekanan keterjangkauan harga</span> di provinsi berkembang pesat, bukan sekadar defisit pasokan absolut. Kebijakan yang difokuskan pada <span className="font-bold border-b-2 border-[#00B3DF]">subsidi akses KPR dan pengendalian spekulasi tanah</span> diproyeksikan memberikan dampak tertinggi."
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
                  <div className="text-6xl font-black text-gray-900 tracking-tighter">65</div>
                  <div className="text-[13px] font-bold text-[#D97706] uppercase tracking-widest mt-1">Moderate Risk</div>
                </div>
              </div>
            </div>

            {/* Recommendation Cards */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: 'Supply Expansion', icon: Target, desc: 'Fokuskan pembangunan perumahan publik dan insentif TOD di kluster Jawa Barat dan Banten yang memiliki backlog absolut tertinggi.', color: 'text-[#005587]' },
                { title: 'Mortgage Support', icon: Zap, desc: 'Perluas akses pembiayaan bersubsidi (FLPP) tidak hanya untuk MBR, namun disesuaikan untuk segmentasi menengah di DKI Jakarta & Bali.', color: 'text-[#00B3DF]' },
                { title: 'Price Control', icon: ShieldAlert, desc: 'Terapkan regulasi pengendalian lahan tidur dan pajak progresif properti sekunder di daerah dengan rasio harga > 8x pendapatan.', color: 'text-[#DC2626]' },
                { title: 'Backlog Reduction', icon: TrendingDown, desc: 'Prioritaskan program renovasi rumah tidak layak huni (RTLH) di wilayah Indonesia Timur daripada pembangunan unit baru.', color: 'text-[#16A34A]' },
              ].map((rec, i) => (
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
                    <XAxis type="number" dataKey="affordability" name="Affordability Ratio" domain={[2, 12]} axisLine={{stroke: '#D1D5DB'}} tickLine={false} tick={{ fontSize: 13, fill: '#4B5563' }}>
                    </XAxis>
                    <YAxis type="number" dataKey="backlog" name="Backlog (M Units)" domain={[0, 3]} axisLine={{stroke: '#D1D5DB'}} tickLine={false} tick={{ fontSize: 13, fill: '#4B5563' }} />
                    <ZAxis type="category" dataKey="province" name="Province" />
                    <ReferenceLine x={6} stroke="#9CA3AF" strokeDasharray="5 5" />
                    <ReferenceLine y={1.0} stroke="#9CA3AF" strokeDasharray="5 5" />
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
