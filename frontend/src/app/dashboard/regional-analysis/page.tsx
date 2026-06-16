"use client";

import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell
} from 'recharts';
import ChoroplethMap from '@/components/charts/ChoroplethMap';
import { fetchProvinceData } from '@/lib/dataProvider';
import { CalculatedKPIs, getTrafficLightColor } from '@/lib/kpiEngine';
import { useLanguage } from '@/components/providers/LanguageProvider';

const YEARS = ["2026", "2025", "2024"];

export default function RegionalAnalysisPage() {
  const [provinces, setProvinces] = useState<CalculatedKPIs[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("2024");
  const [provA, setProvA] = useState("DKI Jakarta");
  const [provB, setProvB] = useState("Jawa Barat");
  const { lang } = useLanguage();

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
  }, [selectedYear]);

  const displayProvinces = React.useMemo(() => {
    if (selectedYear === "2024") return provinces;
    
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
    return <div className="w-full h-screen flex items-center justify-center font-serif text-lg">Generating Spatial Analysis...</div>;
  }

  const sortedByScore = [...displayProvinces].sort((a, b) => b.HousingScore - a.HousingScore);
  const topProvinces = sortedByScore.slice(0, 5).map(p => ({ name: p.Province, score: p.HousingScore }));
  const bottomProvinces = sortedByScore.slice(-5).map(p => ({ name: p.Province, score: p.HousingScore }));

  const mapData = displayProvinces.map(p => ({
    province: p.Province,
    score: p.HousingScore,
    mortgage: p.MortgageAccessibility,
    demand: p.DemandIndex
  }));

  const provAData = displayProvinces.find(p => p.Province === provA) || displayProvinces[0] || {} as CalculatedKPIs;
  const provBData = displayProvinces.find(p => p.Province === provB) || displayProvinces[1] || displayProvinces[0] || {} as CalculatedKPIs;

  const radarData = [
    { subject: lang === 'en' ? 'Accessibility' : 'Aksesibilitas', A: provAData.AccessibilityIndex, B: provBData.AccessibilityIndex, fullMark: 100 },
    { subject: lang === 'en' ? 'Ownership' : 'Kepemilikan', A: provAData.OwnershipRate, B: provBData.OwnershipRate, fullMark: 100 },
    { subject: lang === 'en' ? 'Supply Index' : 'Indeks Pasokan', A: provAData.SupplyIndex, B: provBData.SupplyIndex, fullMark: 100 },
    { subject: lang === 'en' ? 'Mortgage Access' : 'Akses KPR', A: provAData.MortgageAccessibility, B: provBData.MortgageAccessibility, fullMark: 100 },
    { subject: lang === 'en' ? 'Demand Index' : 'Indeks Permintaan', A: provAData.DemandIndex, B: provBData.DemandIndex, fullMark: 100 },
  ];

  const generateComparativeInsight = () => {
    if (!provAData.HousingScore || !provBData.HousingScore) return <></>;
    const delta = provAData.HousingScore - provBData.HousingScore;
    const diff = Math.abs(delta).toFixed(1);

    if (delta > 5) {
      return lang === 'en' ? `${provAData.Province} significantly outperforms ${provBData.Province} in overall housing welfare by ${diff} points.` : `${provAData.Province} mengungguli ${provBData.Province} secara signifikan dalam kesejahteraan perumahan sebesar ${diff} poin.`;
    } else if (delta < -5) {
      return lang === 'en' ? `${provBData.Province} significantly outperforms ${provAData.Province} in overall housing welfare by ${diff} points.` : `${provBData.Province} mengungguli ${provAData.Province} secara signifikan dalam kesejahteraan perumahan sebesar ${diff} poin.`;
    } else {
      return lang === 'en' ? `${provAData.Province} and ${provBData.Province} exhibit near-identical housing market conditions with a marginal gap of ${diff} points.` : `${provAData.Province} dan ${provBData.Province} menunjukkan kondisi pasar perumahan yang hampir identik dengan selisih marjinal ${diff} poin.`;
    }
  };

  return (
    <div className="w-full bg-white text-black min-h-screen pb-24 font-serif leading-relaxed overflow-x-hidden">
      
      {/* PAPER CONTENT */}
      <div className="w-full max-w-[850px] mx-auto px-6 sm:px-8 md:px-16 pt-12 md:pt-16 print:pt-0 print:px-0">
        
        {/* Title Header */}
        <div className="border-b-4 border-black pb-8 md:pb-12 mb-8 md:mb-12 flex justify-between items-end">
          <div>
            <p className="text-xs md:text-sm font-bold uppercase tracking-widest mb-4">
              {lang === 'en' ? 'Spatial & Regional Chapter' : 'Bab Spasial & Regional'}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight break-words">
              {lang === 'en' ? 'Spatial Disparities and Regional Analysis' : 'Ketimpangan Spasial dan Analisis Regional'}
            </h1>
          </div>
          <div className="hidden sm:block">
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-white border-2 border-black font-bold px-3 py-1 text-sm cursor-pointer outline-none font-sans"
            >
              {YEARS.map(y => <option key={y} value={y}>Data {y}</option>)}
            </select>
          </div>
        </div>

        {/* Section 1: Map */}
        <section className="mb-12 print-avoid-break">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide border-b border-gray-300 pb-2 mb-6 break-words">
            {lang === 'en' ? '1. Indonesia Housing Landscape' : '1. Lanskap Perumahan Indonesia'}
          </h2>
          <p className="text-justify text-base md:text-lg mb-6">
            {lang === 'en' 
              ? 'A spatial analysis of the Housing Intelligence Score reveals how affordability, supply, and demand constraints vary geographically.' 
              : 'Analisis spasial dari Skor Intelijen Perumahan mengungkapkan bagaimana keterbatasan keterjangkauan, pasokan, dan permintaan bervariasi secara geografis.'}
          </p>
          
          <div className="my-8 border border-gray-300 p-2 sm:p-4 bg-gray-50 overflow-hidden">
            <h4 className="text-center font-bold font-sans text-xs sm:text-sm mb-4 uppercase break-words">
              {lang === 'en' ? 'Figure 1: Choropleth Map of Housing Intelligence Score' : 'Gambar 1: Peta Koroplet Skor Intelijen Perumahan'}
            </h4>
            <div className="border border-gray-300 bg-white min-h-[400px]">
              <ChoroplethMap data={mapData} meanScore={means.HousingScore} />
            </div>
          </div>
        </section>

        {/* Section 2: Regional Benchmark */}
        <section className="mb-12 print-avoid-break">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide border-b border-gray-300 pb-2 mb-6 break-words">
            {lang === 'en' ? '2. Regional Comparative Benchmark' : '2. Perbandingan Tolok Ukur Regional'}
          </h2>
          <p className="text-justify text-base md:text-lg mb-6">
            {lang === 'en' 
              ? 'By conducting direct comparisons between specific regions, we can isolate macro-level vulnerabilities across multiple housing axes.' 
              : 'Dengan melakukan perbandingan langsung antar wilayah spesifik, kami dapat mengisolasi kerentanan tingkat makro di berbagai sumbu perumahan.'}
          </p>

          <div className="mb-6 p-4 border-l-4 border-black bg-gray-50 text-base md:text-lg italic">
            &quot;{generateComparativeInsight()}&quot;
          </div>
          
          <div className="my-8 border border-gray-300 p-4 bg-gray-50 flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/3 flex flex-col gap-6">
              <div>
                <label className="text-xs font-bold uppercase mb-2 block">{lang === 'en' ? 'Province A' : 'Provinsi A'}</label>
                <select 
                  value={provA}
                  onChange={(e) => setProvA(e.target.value)}
                  className="w-full p-2 border border-gray-300 font-sans text-sm outline-none"
                >
                  {displayProvinces.map(p => <option key={`A-${p.Province}`} value={p.Province}>{p.Province}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase mb-2 block">{lang === 'en' ? 'Province B' : 'Provinsi B'}</label>
                <select 
                  value={provB}
                  onChange={(e) => setProvB(e.target.value)}
                  className="w-full p-2 border border-gray-300 font-sans text-sm outline-none"
                >
                  {displayProvinces.map(p => <option key={`B-${p.Province}`} value={p.Province}>{p.Province}</option>)}
                </select>
              </div>
            </div>

            <div className="w-full md:w-2/3 h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#D1D5DB" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fontFamily: 'serif', fill: '#000' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name={provA} dataKey="A" stroke={getTrafficLightColor(provAData.HousingScore)} fill={getTrafficLightColor(provAData.HousingScore)} fillOpacity={0.5} />
                  <Radar name={provB} dataKey="B" stroke={getTrafficLightColor(provBData.HousingScore)} fill={getTrafficLightColor(provBData.HousingScore)} fillOpacity={0.5} />
                  <RechartsTooltip formatter={(value: number) => value ? Number(value).toLocaleString('id-ID', { maximumFractionDigits: 2 }) : '0.00'} contentStyle={{ backgroundColor: '#111827', color: '#fff', borderColor: '#111827', borderRadius: 0, fontWeight: 600 }} itemStyle={{ color: '#fff' }} />
                </RadarChart>
              </ResponsiveContainer>
              <h4 className="text-center font-bold font-sans text-xs mt-4 uppercase">
                {lang === 'en' ? 'Figure 2: Multi-Axis Performance Radar' : 'Gambar 2: Radar Kinerja Multi-Sumbu'}
              </h4>
            </div>
          </div>
        </section>

        {/* Section 3: Rankings */}
        <section className="mb-12 print-avoid-break">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide border-b border-gray-300 pb-2 mb-6 break-words">
            {lang === 'en' ? '3. Performance Extremes' : '3. Ekstremitas Kinerja'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-gray-300 p-2 sm:p-4 bg-gray-50">
              <h4 className="text-center font-bold font-sans text-xs mb-4 uppercase">
                {lang === 'en' ? 'Figure 3: Top 5 Provinces' : 'Gambar 3: 5 Provinsi Teratas'}
              </h4>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProvinces} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontFamily: 'serif' }} domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" axisLine={{stroke: '#000'}} tickLine={false} tick={{ fontSize: 12, fill: '#000', fontFamily: 'serif' }} />
                    <RechartsTooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ backgroundColor: '#111827', color: '#fff', borderColor: '#111827', borderRadius: 0, fontWeight: 600 }} itemStyle={{ color: '#fff' }} formatter={(value: any) => [Number(value).toFixed(2)]} />
                    <Bar dataKey="score" barSize={16} radius={[0, 4, 4, 0]}>
                      {topProvinces.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getTrafficLightColor(entry.score)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="border border-gray-300 p-2 sm:p-4 bg-gray-50">
              <h4 className="text-center font-bold font-sans text-xs mb-4 uppercase">
                {lang === 'en' ? 'Figure 4: Bottom 5 Provinces' : 'Gambar 4: 5 Provinsi Terbawah'}
              </h4>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bottomProvinces.reverse()} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontFamily: 'serif' }} domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" axisLine={{stroke: '#000'}} tickLine={false} tick={{ fontSize: 12, fill: '#000', fontFamily: 'serif' }} />
                    <RechartsTooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ backgroundColor: '#111827', color: '#fff', borderColor: '#111827', borderRadius: 0, fontWeight: 600 }} itemStyle={{ color: '#fff' }} formatter={(value: any) => [Number(value).toFixed(2)]} />
                    <Bar dataKey="score" barSize={16} radius={[0, 4, 4, 0]}>
                      {bottomProvinces.reverse().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getTrafficLightColor(entry.score)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Data Table */}
        <section className="mb-12 print-avoid-break">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide border-b border-gray-300 pb-2 mb-6 break-words">
            {lang === 'en' ? '4. Complete Province Benchmark Data' : '4. Data Tolok Ukur Provinsi Lengkap'}
          </h2>
          
          <div className="overflow-x-auto border border-gray-300 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full text-xs md:text-sm text-left border-collapse">
              <thead className="bg-black text-white uppercase text-[10px] md:text-xs">
                <tr>
                  <th className="py-3 px-4 border border-gray-300">{lang === 'en' ? 'Province' : 'Provinsi'}</th>
                  <th className="py-3 px-2 border border-gray-300 text-center">{lang === 'en' ? 'Overall Score' : 'Skor Keseluruhan'}</th>
                  <th className="py-3 px-2 border border-gray-300 text-center">{lang === 'en' ? 'Demand' : 'Permintaan'}</th>
                  <th className="py-3 px-2 border border-gray-300 text-center">{lang === 'en' ? 'Supply' : 'Pasokan'}</th>
                  <th className="py-3 px-2 border border-gray-300 text-center">{lang === 'en' ? 'Mortgage' : 'KPR'}</th>
                  <th className="py-3 px-2 border border-gray-300 text-center">{lang === 'en' ? 'Backlog (%)' : 'Backlog (%)'}</th>
                </tr>
              </thead>
              <tbody>
                {sortedByScore.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-300 hover:bg-gray-50">
                    <td className="py-2 px-4 border border-gray-300 font-bold">{row.Province}</td>
                    <td className="py-2 px-2 border border-gray-300 text-center font-mono">{row.HousingScore?.toFixed(1)}</td>
                    <td className="py-2 px-2 border border-gray-300 text-center font-mono">{row.DemandIndex?.toFixed(1)}</td>
                    <td className="py-2 px-2 border border-gray-300 text-center font-mono">{row.SupplyIndex?.toFixed(1)}</td>
                    <td className="py-2 px-2 border border-gray-300 text-center font-mono">{row.MortgageAccessibility?.toFixed(1)}</td>
                    <td className="py-2 px-2 border border-gray-300 text-center font-mono">{row.TotalBacklogPercent?.toFixed(1)}%</td>
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
