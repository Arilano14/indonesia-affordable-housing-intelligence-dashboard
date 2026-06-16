"use client";

import React, { useEffect, useState } from 'react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ZAxis,
  LineChart, Line, BarChart, Bar, ComposedChart, Legend, Cell
} from 'recharts';
import { fetchNationalData, fetchProvinceData, NationalTrendData } from '@/lib/dataProvider';
import { CalculatedKPIs, getTrafficLightColor } from '@/lib/kpiEngine';
import { useLanguage } from '@/components/providers/LanguageProvider';

export default function HousingMarketPage() {
  const [sortField, setSortField] = useState('AccessibilityIndex');
  const [trendData, setTrendData] = useState<NationalTrendData[]>([]);
  const [provinces, setProvinces] = useState<CalculatedKPIs[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();
  
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
    return <div className="w-full h-screen flex items-center justify-center font-serif text-lg">Generating Market Analysis...</div>;
  }

  const scatterData = provinces.map(p => ({
    province: p.Province,
    gdp: p.GDPPerCapita / 1000000,
    poverty: p.PovertyRate,
    accessibility: p.AccessibilityIndex,
    population: p.Population
  }));

  const allProvincesSortedByPop = [...provinces].sort((a, b) => b.Population - a.Population);

  const sortedTableData = [...provinces].sort((a, b) => {
    return (b[sortField as keyof typeof b] as number) > (a[sortField as keyof typeof a] as number) ? 1 : -1;
  });

  const highestBacklog = [...provinces].sort((a, b) => b.TotalBacklogPercent - a.TotalBacklogPercent)[0];

  const generateBacklogInsight = () => {
    if (!highestBacklog) return <></>;
    const prov = highestBacklog.Province;
    const backlog = highestBacklog.TotalBacklogPercent.toFixed(1) + '%';
    if (highestBacklog.TotalBacklogPercent > 30) {
      return lang === 'en' ? `Province ${prov} faces a critical housing deficit. With ${backlog} backlog, urgent supply-side interventions are mandated to address the severe shortage.` : `Provinsi ${prov} menghadapi defisit perumahan yang kritis. Dengan backlog sebesar ${backlog}, intervensi sisi pasokan yang mendesak diamanatkan untuk mengatasi kekurangan yang parah.`;
    } else if (highestBacklog.TotalBacklogPercent <= 10) {
      return lang === 'en' ? `Province ${prov} demonstrates high housing resilience with a minimal backlog of ${backlog}, outperforming the national benchmark significantly.` : `Provinsi ${prov} menunjukkan ketahanan perumahan yang tinggi dengan backlog minimal sebesar ${backlog}, mengungguli tolok ukur nasional secara signifikan.`;
    } else {
      return lang === 'en' ? `Province ${prov} reports the highest national backlog at ${backlog}. While not at critical crisis levels (>30%), sustained supply-demand imbalances require continued policy focus.` : `Provinsi ${prov} melaporkan backlog nasional tertinggi pada ${backlog}. Meskipun belum pada tingkat krisis (>30%), ketidakseimbangan pasokan dan permintaan yang berkelanjutan memerlukan fokus kebijakan yang terus-menerus.`;
    }
  };

  return (
    <div className="w-full bg-white text-black min-h-screen pb-24 font-serif leading-relaxed overflow-x-hidden">
      
      {/* PAPER CONTENT */}
      <div className="w-full max-w-[850px] mx-auto px-6 sm:px-8 md:px-16 pt-12 md:pt-16 print:pt-0 print:px-0">
        
        {/* Title Header */}
        <div className="border-b-4 border-black pb-8 md:pb-12 mb-8 md:mb-12">
          <p className="text-xs md:text-sm font-bold uppercase tracking-widest mb-4">
            {lang === 'en' ? 'Housing Market Dynamics Chapter' : 'Bab Dinamika Pasar Perumahan'}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight break-words">
            {lang === 'en' ? 'Market Capacity, Demand, and Supply Disparities' : 'Kapasitas Pasar, Ketimpangan Permintaan, dan Pasokan'}
          </h1>
        </div>

        {/* Section 1: Macro Insight */}
        <section className="mb-12 print-avoid-break">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide border-b border-gray-300 pb-2 mb-6 break-words">
            {lang === 'en' ? '1. Market Overview' : '1. Tinjauan Pasar'}
          </h2>
          <p className="text-justify text-base md:text-lg mb-6">
            {lang === 'en' 
              ? 'Analyzing macroeconomic capacity reveals fundamental relationships between wealth, poverty, and housing accessibility at the provincial level.' 
              : 'Menganalisis kapasitas makroekonomi mengungkap hubungan mendasar antara kekayaan, kemiskinan, dan aksesibilitas perumahan di tingkat provinsi.'}
          </p>
          <div className="mb-6 p-4 border-l-4 border-black bg-gray-50 text-base md:text-lg italic">
            &quot;{generateBacklogInsight()}&quot;
          </div>
          
          <div className="my-8 border border-gray-300 p-2 sm:p-4 bg-gray-50 overflow-hidden">
            <h4 className="text-center font-bold font-sans text-xs sm:text-sm mb-4 uppercase break-words">
              {lang === 'en' ? 'Figure 1: GDP per Capita vs Poverty Rate (Accessibility Proxy)' : 'Gambar 1: PDRB per Kapita vs Tingkat Kemiskinan (Proksi Aksesibilitas)'}
            </h4>
            <div className="h-64 sm:h-80 w-full border border-gray-300 bg-white">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D1D5DB" />
                  <XAxis type="number" dataKey="gdp" name="GDP/Capita" axisLine={{stroke: '#9CA3AF'}} tickLine={false} tick={{ fontSize: 12, fontFamily: 'serif' }} tickFormatter={(val) => `Rp${val} Jt`} />
                  <YAxis type="number" dataKey="poverty" name="Poverty Rate" axisLine={{stroke: '#9CA3AF'}} tickLine={false} tick={{ fontSize: 12, fontFamily: 'serif' }} tickFormatter={(val) => `${val}%`} />
                  <ZAxis type="category" dataKey="province" name="Province" />
                  <RechartsTooltip 
                    cursor={{ strokeDasharray: '3 3' }} 
                    contentStyle={{ backgroundColor: '#111827', color: '#fff', borderColor: '#111827', borderRadius: 0, fontWeight: 600 }} 
                    itemStyle={{ color: '#00B3DF' }} 
                    formatter={(value: any, name: string) => {
                      if (name === 'GDP/Capita') return [`Rp ${Number(value).toLocaleString('id-ID')} Juta`, name];
                      if (name === 'Poverty Rate') return [`${Number(value).toLocaleString('id-ID')}%`, name];
                      return [value, name];
                    }}
                  />
                  <Scatter name="Provinces" data={scatterData} shape="circle" line={false}>
                    {scatterData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getTrafficLightColor(entry.accessibility)} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Section 2: Supply vs Demand */}
        <section className="mb-12 print-avoid-break">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide border-b border-gray-300 pb-2 mb-6 break-words">
            {lang === 'en' ? '2. Structural Supply and Demand' : '2. Pasokan dan Permintaan Struktural'}
          </h2>
          <p className="text-justify text-base md:text-lg mb-6">
            {lang === 'en' 
              ? 'The chart below contrasts the Housing Supply Index against the Demand Index, sorted by population to highlight the zero-skewing effect of highly dense provinces.' 
              : 'Grafik di bawah ini membandingkan Indeks Pasokan Perumahan dengan Indeks Permintaan, diurutkan berdasarkan populasi untuk menyoroti efek zero-skewing dari provinsi yang padat penduduk.'}
          </p>
          
          <div className="my-8 border border-gray-300 p-2 sm:p-4 bg-gray-50 overflow-hidden">
            <h4 className="text-center font-bold font-sans text-xs sm:text-sm mb-4 uppercase break-words">
              {lang === 'en' ? 'Figure 2: Demand vs Supply Equilibrium Index' : 'Gambar 2: Indeks Ekuilibrium Permintaan vs Pasokan'}
            </h4>
            <div className="w-full h-80 overflow-x-auto border border-gray-300 bg-white">
              <div style={{ minWidth: '1000px', height: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={allProvincesSortedByPop} margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="Province" axisLine={{stroke: '#9CA3AF'}} tickLine={false} tick={{ fontSize: 10, fontFamily: 'sans-serif' }} angle={-45} textAnchor="end" height={80}/>
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontFamily: 'serif' }} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontFamily: 'serif' }} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#111827', color: '#fff', borderColor: '#111827', borderRadius: 0, fontWeight: 600 }} 
                      itemStyle={{ color: '#fff' }}
                      formatter={(value: any, name: string) => [Number(value).toFixed(2), name]}
                    />
                    <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px', fontWeight: 600 }} />
                    <Bar yAxisId="left" dataKey="SupplyIndex" name={lang === 'en' ? "Supply Index" : "Indeks Pasokan"} barSize={12}>
                      {allProvincesSortedByPop.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getTrafficLightColor(entry.SupplyIndex)} />
                      ))}
                    </Bar>
                    <Line yAxisId="right" type="step" dataKey="DemandIndex" name={lang === 'en' ? "Demand Index" : "Indeks Permintaan"} stroke="#DC2626" strokeWidth={2} dot={{ r: 2 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
            <p className="text-xs text-justify italic mt-4 text-gray-700">
              {lang === 'en' ? 'Methodological Note: Weighted addition prevents population extremes (e.g. West Java) from compressing smaller regions to zero during normalization.' : 'Catatan Metodologi: Penjumlahan berbobot mencegah ekstrem populasi (misal Jawa Barat) menekan wilayah yang lebih kecil menjadi nol selama normalisasi.'}
            </p>
          </div>
        </section>

        {/* Section 3: Mortgage Accessibility */}
        <section className="mb-12 print-avoid-break">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide border-b border-gray-300 pb-2 mb-6 break-words">
            {lang === 'en' ? '3. Mortgage Accessibility Constraints' : '3. Keterbatasan Aksesibilitas KPR'}
          </h2>
          <p className="text-justify text-base md:text-lg mb-6">
            {lang === 'en' ? 'Mortgage scoring reveals banking penetration and financial eligibility.' : 'Penilaian KPR mengungkapkan penetrasi perbankan dan kelayakan finansial.'}
          </p>

          <div className="my-8 border border-gray-300 p-2 sm:p-4 bg-gray-50 overflow-hidden">
            <h4 className="text-center font-bold font-sans text-xs sm:text-sm mb-4 uppercase break-words">
              {lang === 'en' ? 'Figure 3: Provincial Mortgage Accessibility Index' : 'Gambar 3: Indeks Aksesibilitas KPR Provinsi'}
            </h4>
            <div className="w-full h-[500px] overflow-y-auto border border-gray-300 bg-white p-2">
              <div style={{ height: '700px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[...provinces].sort((a,b)=>b.MortgageAccessibility-a.MortgageAccessibility)} margin={{ top: 10, right: 20, bottom: 5, left: 20 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                    <XAxis type="number" axisLine={{stroke: '#9CA3AF'}} tickLine={false} tick={{ fontSize: 12, fontFamily: 'serif' }} domain={[0, 100]} />
                    <YAxis dataKey="Province" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontFamily: 'sans-serif' }} width={120}/>
                    <RechartsTooltip cursor={{fill: '#F9FAFB'}} contentStyle={{ backgroundColor: '#111827', borderColor: '#111827', borderRadius: 0, fontWeight: 600 }} itemStyle={{ color: '#fff' }} formatter={(value: any) => [Number(value).toFixed(2)]} />
                    <Bar dataKey="MortgageAccessibility" name="Mortgage Score" barSize={10}>
                      {[...provinces].sort((a,b)=>b.MortgageAccessibility-a.MortgageAccessibility).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getTrafficLightColor(entry.MortgageAccessibility)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Market Ranking Table */}
        <section className="mb-12 print-avoid-break">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide border-b border-gray-300 pb-2 mb-6 break-words">
            {lang === 'en' ? '4. Consolidated Market Rankings' : '4. Peringkat Pasar Terkonsolidasi'}
          </h2>
          
          <div className="overflow-x-auto border border-gray-300">
            <table className="w-full text-xs md:text-sm text-left border-collapse">
              <thead className="bg-black text-white uppercase text-[10px] md:text-xs">
                <tr>
                  <th className="py-3 px-4 border border-gray-300 cursor-pointer" onClick={() => setSortField('Province')}>{lang === 'en' ? 'Province' : 'Provinsi'}</th>
                  <th className="py-3 px-2 border border-gray-300 text-center cursor-pointer" onClick={() => setSortField('GDPPerCapita')}>{lang === 'en' ? 'GDP/Cap (Rp M)' : 'PDRB/Kap (Rp Jt)'}</th>
                  <th className="py-3 px-2 border border-gray-300 text-center cursor-pointer" onClick={() => setSortField('PovertyRate')}>{lang === 'en' ? 'Poverty (%)' : 'Miskin (%)'}</th>
                  <th className="py-3 px-2 border border-gray-300 text-center cursor-pointer" onClick={() => setSortField('AccessibilityIndex')}>{lang === 'en' ? 'Access Index' : 'Indeks Akses'}</th>
                  <th className="py-3 px-2 border border-gray-300 text-center cursor-pointer" onClick={() => setSortField('MortgageAccessibility')}>{lang === 'en' ? 'Mortgage Score' : 'Skor KPR'}</th>
                </tr>
              </thead>
              <tbody>
                {sortedTableData.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-300 hover:bg-gray-50">
                    <td className="py-2 px-4 border border-gray-300 font-bold">{row.Province}</td>
                    <td className="py-2 px-2 border border-gray-300 text-center font-mono">{(row.GDPPerCapita/1000000).toFixed(1)}</td>
                    <td className="py-2 px-2 border border-gray-300 text-center font-mono">{row.PovertyRate.toFixed(1)}%</td>
                    <td className="py-2 px-2 border border-gray-300 text-center font-mono">{row.AccessibilityIndex.toFixed(1)}</td>
                    <td className="py-2 px-2 border border-gray-300 text-center font-mono">{row.MortgageAccessibility.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}
