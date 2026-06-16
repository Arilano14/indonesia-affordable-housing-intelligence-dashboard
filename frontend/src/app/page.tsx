"use client";

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { fetchNationalData, fetchProvinceData, NationalTrendData } from '@/lib/dataProvider';
import { CalculatedKPIs, getTrafficLightColor } from '@/lib/kpiEngine';
import ChoroplethMap from '@/components/charts/ChoroplethMap';
import { useLanguage } from '@/components/providers/LanguageProvider';

export default function OverviewPage() {
  const [trendData, setTrendData] = useState<NationalTrendData[]>([]);
  const [provinces, setProvinces] = useState<CalculatedKPIs[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();

  useEffect(() => {
    async function loadData() {
      try {
        const [national, provs] = await Promise.all([fetchNationalData(), fetchProvinceData()]);
        
        if (national.length === 1) {
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
    return <div className="w-full h-screen flex items-center justify-center font-serif text-lg">Generating Executive Summary...</div>;
  }

  const latestNational = trendData[trendData.length - 1] || { HousingScore: 0, AccessibilityIndex: 0, OwnershipRate: 0, TotalBacklogPercent: 0, InterestRate: 0 };
  const prevNational = trendData[trendData.length - 2] || latestNational;
  const scoreYoY = prevNational.HousingScore > 0 ? (((latestNational.HousingScore - prevNational.HousingScore) / prevNational.HousingScore) * 100).toFixed(1) : "0.0";

  const mostAccessible = [...provinces].sort((a, b) => b.AccessibilityIndex - a.AccessibilityIndex)[0];
  const highestBacklog = [...provinces].sort((a, b) => b.TotalBacklogPercent - a.TotalBacklogPercent)[0];
  const highestDemand = [...provinces].sort((a, b) => b.DemandIndex - a.DemandIndex)[0];
  const highestOwnership = [...provinces].sort((a, b) => b.OwnershipRate - a.OwnershipRate)[0];

  const mapData = provinces.map(p => ({
    province: p.Province,
    score: p.HousingScore,
    mortgage: p.AccessibilityIndex,
    demand: p.DemandIndex
  }));

  const top5Provinces = [...mapData].sort((a, b) => b.score - a.score).slice(0, 5);
  const bottom5Provinces = [...mapData].sort((a, b) => a.score - b.score).slice(0, 5);

  const score = latestNational.HousingScore || 0;
  const backlog = latestNational.TotalBacklogPercent || 0;

  return (
    <div className="w-full bg-white text-black min-h-screen pb-24 font-serif leading-relaxed overflow-x-hidden">
      
      {/* PAPER CONTENT */}
      <div className="w-full max-w-[850px] mx-auto px-6 sm:px-8 md:px-16 pt-12 md:pt-16 print:pt-0 print:px-0">
        
        {/* Title Header */}
        <div className="border-b-4 border-black pb-8 md:pb-12 mb-8 md:mb-12">
          <p className="text-xs md:text-sm font-bold uppercase tracking-widest mb-4">
            {lang === 'en' ? 'National Overview Chapter' : 'Bab Tinjauan Nasional'}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight break-words">
            {lang === 'en' 
              ? 'Executive Summary: National Housing Condition' 
              : 'Ringkasan Eksekutif: Kondisi Perumahan Nasional'}
          </h1>
        </div>

        {/* Introduction */}
        <section className="mb-12 print-avoid-break">
          <p className="text-justify text-base md:text-lg mb-6">
            {lang === 'en'
              ? `The National Housing Intelligence Score stands at `
              : `Skor Intelijen Perumahan Nasional berada pada angka `}
            <strong>{score.toFixed(1)}</strong> 
            {lang === 'en' 
              ? ` out of 100, reflecting a year-over-year change of +${scoreYoY}%. ` 
              : ` dari 100, mencerminkan perubahan tahun-ke-tahun sebesar +${scoreYoY}%. `}
            
            {score < 50 
              ? (lang === 'en' ? 'National housing conditions indicate systemic challenges. Policy focus should prioritize affordability enhancement, backlog reduction, and acceleration of housing delivery.' : 'Kondisi perumahan nasional menunjukkan tantangan sistemik. Fokus kebijakan harus memprioritaskan peningkatan keterjangkauan, pengurangan backlog, dan percepatan penyediaan perumahan.')
              : backlog > 25 
                ? (lang === 'en' ? 'Current backlog levels suggest a structural supply-demand imbalance. Additional public-private housing partnerships (KPBU) may be required.' : 'Tingkat backlog saat ini menunjukkan ketidakseimbangan pasokan dan permintaan struktural. Kemitraan perumahan publik-swasta (KPBU) tambahan mungkin diperlukan.')
                : score >= 75 
                  ? (lang === 'en' ? 'National housing conditions demonstrate strong resilience, reflecting effective policy interventions in homeownership and accessibility.' : 'Kondisi perumahan nasional menunjukkan ketahanan yang kuat, mencerminkan intervensi kebijakan yang efektif dalam kepemilikan rumah dan aksesibilitas.')
                  : (lang === 'en' ? `The national housing market maintains moderate stability. While ownership rates hover around ${latestNational.OwnershipRate?.toFixed(1)}%, targeted supply strategies remain crucial to address the remaining ${backlog.toFixed(1)}% backlog.` : `Pasar perumahan nasional mempertahankan stabilitas yang moderat. Meskipun tingkat kepemilikan berada di sekitar ${latestNational.OwnershipRate?.toFixed(1)}%, strategi pasokan yang ditargetkan tetap krusial untuk mengatasi sisa backlog sebesar ${backlog.toFixed(1)}%.`)}
          </p>
          
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-xs md:text-sm text-left border-collapse border border-gray-300">
              <thead className="bg-black text-white uppercase text-[10px] md:text-xs">
                <tr>
                  <th className="px-4 py-3 border border-gray-300">{lang === 'en' ? 'Key Indicator' : 'Indikator Utama'}</th>
                  <th className="px-4 py-3 border border-gray-300 text-center">{lang === 'en' ? 'Value' : 'Nilai'}</th>
                  <th className="px-4 py-3 border border-gray-300 text-center">{lang === 'en' ? 'Note' : 'Catatan'}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="px-4 py-2 border border-gray-300 font-bold">{lang === 'en' ? 'Housing Intelligence Score' : 'Skor Intelijen Perumahan'}</td>
                  <td className="px-4 py-2 border border-gray-300 text-center font-mono">{score.toFixed(1)}/100</td>
                  <td className="px-4 py-2 border border-gray-300 text-center italic">{lang === 'en' ? 'Composite Index' : 'Indeks Komposit'}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="px-4 py-2 border border-gray-300 font-bold">{lang === 'en' ? 'Home Ownership Rate' : 'Tingkat Kepemilikan Rumah'}</td>
                  <td className="px-4 py-2 border border-gray-300 text-center font-mono">{latestNational.OwnershipRate?.toFixed(1)}%</td>
                  <td className="px-4 py-2 border border-gray-300 text-center italic">{lang === 'en' ? 'Households' : 'Rumah Tangga'}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="px-4 py-2 border border-gray-300 font-bold">{lang === 'en' ? 'Total Housing Backlog' : 'Total Backlog Perumahan'}</td>
                  <td className="px-4 py-2 border border-gray-300 text-center font-mono">{backlog.toFixed(1)}%</td>
                  <td className="px-4 py-2 border border-gray-300 text-center italic">{lang === 'en' ? 'Of Total Households' : 'Dari Total Rumah Tangga'}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="px-4 py-2 border border-gray-300 font-bold">{lang === 'en' ? 'Benchmark Interest Rate' : 'Suku Bunga Acuan'}</td>
                  <td className="px-4 py-2 border border-gray-300 text-center font-mono">{latestNational.InterestRate?.toFixed(1)}%</td>
                  <td className="px-4 py-2 border border-gray-300 text-center italic">{lang === 'en' ? 'BI Proxy' : 'Proksi BI'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* National Trend Chart */}
        <section className="mb-12 print-avoid-break">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide border-b border-gray-300 pb-2 mb-6 break-words">
            {lang === 'en' ? '1. National Housing Trend' : '1. Tren Perumahan Nasional'}
          </h2>
          
          <div className="my-8 border border-gray-300 p-2 sm:p-4 bg-gray-50 overflow-hidden">
            <h4 className="text-center font-bold font-sans text-xs sm:text-sm mb-4 uppercase break-words">
              {lang === 'en' ? 'Figure 1: Historic Trend of Housing Score vs Ownership Rate' : 'Gambar 1: Tren Historis Skor Perumahan vs Tingkat Kepemilikan'}
            </h4>
            <div className="h-64 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 20, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D1D5DB" />
                  <XAxis dataKey="Year" axisLine={{stroke: '#9CA3AF'}} tickLine={false} tick={{ fontSize: 12, fill: '#000', fontFamily: 'serif' }} dy={10} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#000', fontFamily: 'serif' }} domain={['dataMin - 5', 'dataMax + 5']} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#000', fontFamily: 'serif' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#111827', borderRadius: '0px', color: '#fff', fontSize: '13px', fontWeight: 600, padding: '12px' }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{ stroke: '#E5E7EB', strokeWidth: 2 }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="HousingScore" name={lang === 'en' ? "Housing Score" : "Skor Perumahan"} stroke="#005587" strokeWidth={4} dot={{ r: 5, fill: '#005587', strokeWidth: 0 }} activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }} />
                  <Line yAxisId="right" type="monotone" dataKey="OwnershipRate" name={lang === 'en' ? "Ownership %" : "Kepemilikan %"} stroke="#00B3DF" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-center italic mt-2 text-gray-600">
              {lang === 'en' ? 'Source: Computed from BPS Datasets.' : 'Sumber: Dihitung dari Dataset BPS.'}
            </p>
          </div>
        </section>

        {/* Geospatial Intelligence */}
        <section className="mb-12 print-avoid-break">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide border-b border-gray-300 pb-2 mb-6 break-words">
            {lang === 'en' ? '2. Geospatial Intelligence' : '2. Intelijen Geospasial'}
          </h2>
          <p className="text-justify text-base md:text-lg mb-6">
            {lang === 'en' 
              ? 'The spatial distribution of housing intelligence scores across 38 provinces reveals significant regional disparities. Below is the mapped representation of the national conditions.' 
              : 'Distribusi spasial skor intelijen perumahan di 38 provinsi mengungkapkan ketimpangan regional yang signifikan. Berikut adalah representasi terpetakan dari kondisi nasional.'}
          </p>
          
          <div className="my-8 border border-gray-300 p-2 sm:p-4 bg-gray-50 overflow-hidden">
            <h4 className="text-center font-bold font-sans text-xs sm:text-sm mb-4 uppercase break-words">
              {lang === 'en' ? 'Figure 2: Distribution of Housing Intelligence Score' : 'Gambar 2: Distribusi Skor Intelijen Perumahan'}
            </h4>
            <div className="border border-gray-300 bg-white">
              <ChoroplethMap data={mapData} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="border border-gray-300 p-4">
              <h3 className="font-bold uppercase text-sm border-b border-gray-300 pb-2 mb-4">
                {lang === 'en' ? 'Top 5 Performing Provinces' : '5 Provinsi Berkinerja Terbaik'}
              </h3>
              <ul className="list-decimal pl-5 text-sm md:text-base space-y-2">
                {top5Provinces.map((p) => (
                  <li key={p.province}>
                    <div className="flex justify-between">
                      <span>{p.province}</span>
                      <strong className="font-mono">{p.score.toFixed(1)}</strong>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border border-gray-300 p-4">
              <h3 className="font-bold uppercase text-sm border-b border-gray-300 pb-2 mb-4">
                {lang === 'en' ? 'Bottom 5 Critical Provinces' : '5 Provinsi Paling Kritis'}
              </h3>
              <ul className="list-decimal pl-5 text-sm md:text-base space-y-2">
                {bottom5Provinces.map((p) => (
                  <li key={p.province}>
                    <div className="flex justify-between">
                      <span>{p.province}</span>
                      <strong className="font-mono">{p.score.toFixed(1)}</strong>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Snapshot Summary */}
        <section className="mb-12 print-avoid-break">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide border-b border-gray-300 pb-2 mb-6 break-words">
            {lang === 'en' ? '3. Provincial Extremes' : '3. Kondisi Ekstrem Provinsi'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-gray-300 p-4">
              <p className="text-xs font-bold uppercase text-gray-500 mb-1">{lang === 'en' ? 'Highest Accessibility' : 'Aksesibilitas Tertinggi'}</p>
              <p className="text-lg font-bold">{mostAccessible?.Province || 'N/A'}</p>
            </div>
            <div className="border border-gray-300 p-4">
              <p className="text-xs font-bold uppercase text-gray-500 mb-1">{lang === 'en' ? 'Highest Backlog' : 'Backlog Tertinggi'}</p>
              <p className="text-lg font-bold">{highestBacklog?.Province || 'N/A'}</p>
            </div>
            <div className="border border-gray-300 p-4">
              <p className="text-xs font-bold uppercase text-gray-500 mb-1">{lang === 'en' ? 'Highest Demand Index' : 'Indeks Permintaan Tertinggi'}</p>
              <p className="text-lg font-bold">{highestDemand?.Province || 'N/A'}</p>
            </div>
            <div className="border border-gray-300 p-4">
              <p className="text-xs font-bold uppercase text-gray-500 mb-1">{lang === 'en' ? 'Highest Ownership Rate' : 'Tingkat Kepemilikan Tertinggi'}</p>
              <p className="text-lg font-bold">{highestOwnership?.Province || 'N/A'}</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
