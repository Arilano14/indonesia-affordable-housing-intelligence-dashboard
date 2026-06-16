"use client";

import React, { useEffect, useState } from 'react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ZAxis, ReferenceLine, PieChart, Pie, Cell
} from 'recharts';
import { fetchNationalData, fetchProvinceData, NationalTrendData } from '@/lib/dataProvider';
import { CalculatedKPIs, getTrafficLightColor } from '@/lib/kpiEngine';
import { useLanguage } from '@/components/providers/LanguageProvider';

const simulationData = [
  { policy: 'Lower Mortgage Rate by 1%', policyId: 'Penurunan Suku Bunga KPR 1%', cost: 'Medium', costId: 'Menengah', impactOwnership: '+6.2%', impactAccessibility: '+12.5%', timeframe: 'Short-term' },
  { policy: 'Subsidized Land Bank for Developers', policyId: 'Bank Tanah Bersubsidi untuk Pengembang', cost: 'High', costId: 'Tinggi', impactOwnership: '+2.1%', impactAccessibility: '+18.0%', timeframe: 'Long-term' },
  { policy: 'Expand Public Housing Supply', policyId: 'Perluasan Pasokan Perumahan Publik', cost: 'Very High', costId: 'Sangat Tinggi', impactOwnership: '+8.5%', impactAccessibility: '+5.0%', timeframe: 'Long-term' },
  { policy: 'Tax Relief for First-Time Buyers', policyId: 'Keringanan Pajak bagi Pembeli Pertama', cost: 'Medium', costId: 'Menengah', impactOwnership: '+4.0%', impactAccessibility: '+8.0%', timeframe: 'Short-term' },
];

export default function PolicyInsightsPage() {
  const [provinces, setProvinces] = useState<CalculatedKPIs[]>([]);
  const [nationalTrend, setNationalTrend] = useState<NationalTrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();

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
    return <div className="w-full h-screen flex items-center justify-center font-serif text-lg">Generating Policy Scenarios...</div>;
  }

  const latestNational = nationalTrend[nationalTrend.length - 1] || { HousingScore: 65 };
  const gaugeData = [
    { name: 'Score', value: latestNational.HousingScore },
    { name: 'Empty', value: 100 - latestNational.HousingScore },
  ];

  const priorityMatrixData = provinces.map(p => {
    let status = 'Low Priority';
    if (p.RiskLevel === 'Critical') status = 'High Priority';
    else if (p.RiskLevel === 'Warning') status = 'Medium Priority';
    
    return {
      province: p.Province,
      accessibility: p.AccessibilityIndex,
      backlog: p.TotalBacklogPercent,
      status
    };
  });

  const priorityTableData = [...priorityMatrixData].sort((a, b) => b.backlog * (100 - b.accessibility) - a.backlog * (100 - a.accessibility));

  const avgBacklog = provinces.reduce((sum, p) => sum + p.TotalBacklogPercent, 0) / (provinces.length || 1);
  const highBacklogProv = [...provinces].sort((a,b) => b.TotalBacklogPercent - a.TotalBacklogPercent)[0];
  const lowAccessProv = [...provinces].sort((a,b) => a.AccessibilityIndex - b.AccessibilityIndex)[0];
  const lowQualityProv = [...provinces].sort((a,b) => a.DecentHousingRate - b.DecentHousingRate)[0];
  const highScoreProv = [...provinces].sort((a,b) => b.HousingScore - a.HousingScore)[0];

  const rules = [];
  if (highBacklogProv && highBacklogProv.TotalBacklogPercent > 30 && highBacklogProv.AccessibilityIndex < 40) {
    rules.push({ 
      title: lang === 'en' ? 'Priority: High (Intervention Required)' : 'Prioritas: Tinggi (Intervensi Dibutuhkan)', 
      desc: lang === 'en' ? `Expand subsidized financing (FLPP/SSB) in ${highBacklogProv.Province}. The dual challenge of high backlog (${highBacklogProv.TotalBacklogPercent.toFixed(1)}%) and low affordability (${highBacklogProv.AccessibilityIndex.toFixed(1)}) requires heavy government intervention.` : `Perluas pembiayaan bersubsidi (FLPP/SSB) di ${highBacklogProv.Province}. Tantangan ganda berupa backlog tinggi (${highBacklogProv.TotalBacklogPercent.toFixed(1)}%) dan keterjangkauan rendah (${highBacklogProv.AccessibilityIndex.toFixed(1)}) memerlukan intervensi pemerintah yang masif.`
    });
  } else if (highBacklogProv && highBacklogProv.TotalBacklogPercent > 30) {
    rules.push({ 
      title: lang === 'en' ? 'Priority: High (Supply Focus)' : 'Prioritas: Tinggi (Fokus Pasokan)', 
      desc: lang === 'en' ? `Prioritize expansion of affordable housing supply programs in ${highBacklogProv.Province}, focusing on low-income households and reducing the ${highBacklogProv.TotalBacklogPercent.toFixed(1)}% backlog.` : `Prioritaskan perluasan program pasokan perumahan terjangkau di ${highBacklogProv.Province}, dengan fokus pada rumah tangga berpenghasilan rendah dan mengurangi backlog sebesar ${highBacklogProv.TotalBacklogPercent.toFixed(1)}%.`
    });
  }

  if (lowQualityProv && lowQualityProv.DecentHousingRate < 60 && lowQualityProv.OwnershipRate > 75) {
    rules.push({ 
      title: lang === 'en' ? 'Priority: Medium (Quality Focus)' : 'Prioritas: Menengah (Fokus Kualitas)', 
      desc: lang === 'en' ? `Shift budget allocation from new construction to Bantuan Stimulan Perumahan Swadaya (BSPS) in ${lowQualityProv.Province}. Ownership is high (${lowQualityProv.OwnershipRate.toFixed(1)}%), but housing quality is critically low.` : `Alihkan alokasi anggaran dari pembangunan baru ke Bantuan Stimulan Perumahan Swadaya (BSPS) di ${lowQualityProv.Province}. Kepemilikan tinggi (${lowQualityProv.OwnershipRate.toFixed(1)}%), tetapi kualitas perumahan sangat rendah.`
    });
  }

  if (lowAccessProv && lowAccessProv.AccessibilityIndex < 40) {
    rules.push({ 
      title: lang === 'en' ? 'Priority: High (Financial Access)' : 'Prioritas: Tinggi (Akses Finansial)', 
      desc: lang === 'en' ? `Consider strengthening mortgage affordability schemes through subsidized financing programs and interest-rate support mechanisms in ${lowAccessProv.Province}.` : `Pertimbangkan penguatan skema keterjangkauan KPR melalui program pembiayaan bersubsidi dan mekanisme dukungan suku bunga di ${lowAccessProv.Province}.`
    });
  }

  if (highScoreProv && highScoreProv.HousingScore > 80) {
    rules.push({ 
      title: lang === 'en' ? 'Priority: Low (Maintenance)' : 'Prioritas: Rendah (Pemeliharaan)', 
      desc: lang === 'en' ? `Maintain current policy trajectories in ${highScoreProv.Province}. Focus on sustainable urban planning and green housing initiatives.` : `Pertahankan lintasan kebijakan saat ini di ${highScoreProv.Province}. Fokus pada perencanaan tata ruang berkelanjutan dan inisiatif perumahan hijau.`
    });
  }

  while (rules.length < 4) {
    rules.push({ 
      title: lang === 'en' ? 'Monitoring Required' : 'Pemantauan Diperlukan', 
      desc: lang === 'en' ? `Current metrics are stable. Continue monitoring key indicators.` : `Metrik saat ini stabil. Lanjutkan pemantauan indikator utama.`
    });
  }

  return (
    <div className="w-full bg-white text-black min-h-screen pb-24 font-serif leading-relaxed overflow-x-hidden">
      
      {/* PAPER CONTENT */}
      <div className="w-full max-w-[850px] mx-auto px-6 sm:px-8 md:px-16 pt-12 md:pt-16 print:pt-0 print:px-0">
        
        {/* Title Header */}
        <div className="border-b-4 border-black pb-8 md:pb-12 mb-8 md:mb-12">
          <p className="text-xs md:text-sm font-bold uppercase tracking-widest mb-4">
            {lang === 'en' ? 'Policy Intelligence Chapter' : 'Bab Intelijen Kebijakan'}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight break-words">
            {lang === 'en' ? 'Strategic Policy Scenarios and Interventions' : 'Skenario Kebijakan Strategis dan Intervensi'}
          </h1>
        </div>

        {/* Executive Recommendation */}
        <section className="mb-12 print-avoid-break">
          <div className="p-6 md:p-8 border-2 border-black bg-white mb-8">
            <h3 className="text-sm font-bold uppercase border-b border-black pb-2 mb-4">
              {lang === 'en' ? 'Final Executive Recommendation' : 'Rekomendasi Eksekutif Akhir'}
            </h3>
            <p className="text-lg md:text-xl italic text-justify leading-relaxed">
              &quot;{lang === 'en' 
                ? `Based on the national evaluation, the dual challenge of high backlog (${avgBacklog?.toFixed(1) || 0}%) and accessibility pressures requires targeted interventions. Policies must adapt dynamically: shift supply focus to ${highBacklogProv?.Province || 'critical zones'}, while applying mortgage subsidies primarily in areas like ${lowAccessProv?.Province || 'low-access regions'}.`
                : `Berdasarkan evaluasi nasional, tantangan ganda berupa backlog tinggi (${avgBacklog?.toFixed(1) || 0}%) dan tekanan aksesibilitas memerlukan intervensi yang ditargetkan. Kebijakan harus beradaptasi secara dinamis: alihkan fokus pasokan ke ${highBacklogProv?.Province || 'zona kritis'}, sementara menerapkan subsidi KPR terutama di wilayah seperti ${lowAccessProv?.Province || 'wilayah dengan akses rendah'}.`}&quot;
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-8">
            <div className="col-span-1 border border-gray-300 p-4 text-center">
              <h4 className="text-xs font-bold uppercase mb-4">{lang === 'en' ? 'National Risk Status' : 'Status Risiko Nasional'}</h4>
              <div className="relative h-32 w-full mx-auto">
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
                        <Cell key={`cell-${index}`} fill={index === 0 ? getTrafficLightColor(latestNational.HousingScore) : '#E5E7EB'} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute bottom-0 left-0 w-full text-center">
                  <div className="text-3xl font-black">{latestNational.HousingScore?.toFixed(0)}</div>
                </div>
              </div>
              <div className="text-xs font-bold uppercase mt-2">
                {latestNational.HousingScore >= 80 ? (lang === 'en' ? 'Low Risk' : 'Risiko Rendah') : latestNational.HousingScore >= 60 ? (lang === 'en' ? 'Moderate Risk' : 'Risiko Moderat') : (lang === 'en' ? 'High Risk' : 'Risiko Tinggi')}
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <h4 className="text-sm font-bold uppercase border-b border-gray-300 pb-2 mb-4">{lang === 'en' ? 'Direct Policy Directives' : 'Arahan Kebijakan Langsung'}</h4>
              <ul className="space-y-4">
                {rules.slice(0, 3).map((rule, idx) => (
                  <li key={idx} className="text-sm border-l-2 border-black pl-4">
                    <strong className="block mb-1">{rule.title}</strong>
                    <span className="text-gray-700 text-justify block">{rule.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Priority Matrix */}
        <section className="mb-12 print-avoid-break">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide border-b border-gray-300 pb-2 mb-6 break-words">
            {lang === 'en' ? '1. Policy Priority Quadrants' : '1. Kuadran Prioritas Kebijakan'}
          </h2>
          <p className="text-justify text-base md:text-lg mb-6">
            {lang === 'en' ? 'By mapping Accessibility against the Housing Backlog, we identify regions requiring immediate, specialized interventions versus those suited for standard market mechanisms.' : 'Dengan memetakan Aksesibilitas terhadap Backlog Perumahan, kami mengidentifikasi wilayah yang memerlukan intervensi khusus dan segera dibandingkan dengan yang sesuai untuk mekanisme pasar standar.'}
          </p>

          <div className="my-8 border border-gray-300 p-2 sm:p-4 bg-gray-50 overflow-hidden">
            <h4 className="text-center font-bold font-sans text-xs sm:text-sm mb-4 uppercase break-words">
              {lang === 'en' ? 'Figure 1: Accessibility vs Backlog Matrix' : 'Gambar 1: Matriks Aksesibilitas vs Backlog'}
            </h4>
            <div className="relative h-80 w-full border border-gray-300 bg-white">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" dataKey="accessibility" name="Accessibility Index" domain={[0, 100]} axisLine={{stroke: '#9CA3AF'}} tickLine={false} tick={{ fontSize: 12, fontFamily: 'serif' }} />
                  <YAxis type="number" dataKey="backlog" name="Backlog (%)" domain={[0, 50]} axisLine={{stroke: '#9CA3AF'}} tickLine={false} tick={{ fontSize: 12, fontFamily: 'serif' }} />
                  <ZAxis type="category" dataKey="province" name="Province" />
                  <ReferenceLine x={50} stroke="#000" strokeDasharray="5 5" />
                  <ReferenceLine y={25} stroke="#9CA3AF" strokeDasharray="5 5" />
                  <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#111827', color: '#fff', borderColor: '#111827', borderRadius: 0, fontWeight: 600 }} itemStyle={{ color: '#00B3DF' }} formatter={(value: any, name: string) => [typeof value === 'number' ? value.toLocaleString('id-ID', { maximumFractionDigits: 2 }) : value, name]} />
                  <Scatter name="Provinces" data={priorityMatrixData} fill="#005587" shape="circle">
                    {priorityMatrixData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.status === 'High Priority' ? '#DC2626' : entry.status === 'Medium Priority' ? '#D97706' : '#16A34A'} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
              <div className="absolute top-2 left-2 text-[8px] sm:text-[10px] font-bold uppercase bg-white/80 p-1 z-10 max-w-[45%] text-left leading-tight">High Backlog<br/>Low Access (Crisis)</div>
              <div className="absolute top-2 right-2 text-[8px] sm:text-[10px] font-bold uppercase bg-white/80 p-1 z-10 max-w-[45%] text-right leading-tight">High Backlog<br/>High Access</div>
              <div className="absolute bottom-8 left-2 text-[8px] sm:text-[10px] font-bold uppercase bg-white/80 p-1 z-10 max-w-[45%] text-left leading-tight">Low Backlog<br/>Low Access</div>
              <div className="absolute bottom-8 right-2 text-[8px] sm:text-[10px] font-bold uppercase bg-white/80 p-1 z-10 max-w-[45%] text-right leading-tight">Low Backlog<br/>High Access (Stable)</div>
            </div>
          </div>
        </section>

        {/* Simulation Scenario Table */}
        <section className="mb-12 print-avoid-break">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide border-b border-gray-300 pb-2 mb-6 break-words">
            {lang === 'en' ? '2. Impact Simulation Outcomes' : '2. Hasil Simulasi Dampak'}
          </h2>
          <p className="text-justify text-base md:text-lg mb-6">
            {lang === 'en' ? 'Projections of potential fiscal interventions and their estimated impacts on ownership and accessibility scores.' : 'Proyeksi intervensi fiskal potensial dan perkiraan dampaknya terhadap skor kepemilikan dan aksesibilitas.'}
          </p>
          
          <div className="overflow-x-auto border border-gray-300">
            <table className="w-full text-xs md:text-sm text-left border-collapse">
              <thead className="bg-black text-white uppercase text-[10px] md:text-xs">
                <tr>
                  <th className="py-3 px-4 border border-gray-300">{lang === 'en' ? 'Policy Intervention' : 'Intervensi Kebijakan'}</th>
                  <th className="py-3 px-2 border border-gray-300 text-center">{lang === 'en' ? 'Est. Fiscal Cost' : 'Est. Biaya Fiskal'}</th>
                  <th className="py-3 px-2 border border-gray-300 text-center">{lang === 'en' ? 'Impact (Access)' : 'Dampak (Akses)'}</th>
                  <th className="py-3 px-2 border border-gray-300 text-center">{lang === 'en' ? 'Impact (Ownership)' : 'Dampak (Kepemilikan)'}</th>
                </tr>
              </thead>
              <tbody>
                {simulationData.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-300 hover:bg-gray-50">
                    <td className="py-2 px-4 border border-gray-300 font-bold">{lang === 'en' ? row.policy : row.policyId}</td>
                    <td className="py-2 px-2 border border-gray-300 text-center"><span className={`text-[10px] font-bold uppercase px-2 py-1 ${row.cost === 'High' || row.cost === 'Very High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{lang === 'en' ? row.cost : row.costId}</span></td>
                    <td className="py-2 px-2 border border-gray-300 text-center font-mono font-bold text-[#16A34A]">{row.impactAccessibility}</td>
                    <td className="py-2 px-2 border border-gray-300 text-center font-mono font-bold text-[#005587]">{row.impactOwnership}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 border border-gray-300 p-4 bg-gray-50">
            <h4 className="text-sm font-bold uppercase mb-2">{lang === 'en' ? 'Targeted High-Priority Provinces' : 'Provinsi Sasaran Prioritas Tinggi'}</h4>
            <div className="flex flex-wrap gap-2">
              {priorityTableData.slice(0, 5).map((p, i) => (
                <span key={i} className="px-3 py-1 border border-black bg-[#DC2626] text-white text-xs font-bold uppercase">{p.province}</span>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
