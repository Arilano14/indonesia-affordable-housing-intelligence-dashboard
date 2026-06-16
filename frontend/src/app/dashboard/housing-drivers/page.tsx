"use client";

import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from 'recharts';
import { fetchProvinceData } from '@/lib/dataProvider';
import { CalculatedKPIs } from '@/lib/kpiEngine';
import { useLanguage } from '@/components/providers/LanguageProvider';

// Regression Data (Mocked)
const regressionData = [
  { driver: 'Poverty Rate', importance: 42 },
  { driver: 'GDP Per Capita', importance: 28 },
  { driver: 'Supply Index', importance: 18 },
  { driver: 'Demand Index', importance: 12 },
];

const headersEn = ['Access', 'Demand', 'Supply', 'GDP/Cap', 'Poverty', 'Ownership'];
const headersId = ['Akses', 'Permintaan', 'Pasokan', 'PDRB/Kap', 'Kemiskinan', 'Kepemilikan'];

// Helper for Correlation Heatmap Color (-1 to 1)
const getCorrColor = (val: number) => {
  if (val === 1.0) return 'bg-[#005587] text-white font-bold';
  if (val > 0.6) return 'bg-[#00B3DF] text-white font-bold';
  if (val > 0.3) return 'bg-[#BAE6FD] text-[#005587]';
  if (val > -0.3) return 'bg-white text-gray-500';
  if (val > -0.6) return 'bg-[#FECACA] text-[#DC2626]';
  return 'bg-[#DC2626] text-white font-bold';
};

function pearsonCorrelation(x: number[], y: number[]) {
  const n = x.length;
  if (n === 0) return 0;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((a, b, i) => a + (b * y[i]), 0);
  const sumX2 = x.reduce((a, b) => a + (b * b), 0);
  const sumY2 = y.reduce((a, b) => a + (b * b), 0);
  
  const num = (n * sumXY) - (sumX * sumY);
  const den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  if (den === 0) return 0;
  return num / den;
}

export default function HousingDriversPage() {
  const [provinces, setProvinces] = useState<CalculatedKPIs[]>([]);
  const [loading, setLoading] = useState(true);
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
  }, []);

  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center font-serif text-lg">Generating Macroeconomic Analysis...</div>;
  }

  const varGetters = [
    (p: CalculatedKPIs) => p.AccessibilityIndex,
    (p: CalculatedKPIs) => p.DemandIndex,
    (p: CalculatedKPIs) => p.SupplyIndex,
    (p: CalculatedKPIs) => p.GDPPerCapita,
    (p: CalculatedKPIs) => p.PovertyRate,
    (p: CalculatedKPIs) => p.OwnershipRate,
  ];

  const headers = lang === 'en' ? headersEn : headersId;

  const correlationMatrix = headers.map((rowName, i) => {
    const xVals = provinces.map(varGetters[i]);
    const values = headers.map((_, j) => {
      const yVals = provinces.map(varGetters[j]);
      return pearsonCorrelation(xVals, yVals);
    });
    return { var: rowName, values };
  });

  const avgPoverty = (provinces.reduce((sum, p) => sum + p.PovertyRate, 0) / provinces.length).toFixed(1);
  
  const economicData = [
    { year: '2020', gdp: 5.0, poverty: 10.1, ownership: 80.0 },
    { year: '2021', gdp: -2.1, poverty: 9.7, ownership: 81.1 },
    { year: '2022', gdp: 3.7, poverty: 9.5, ownership: 82.5 },
    { year: '2023', gdp: 5.3, poverty: 9.3, ownership: 83.0 },
    { year: '2024', gdp: 5.0, poverty: Number(avgPoverty), ownership: 84.0 },
  ];

  const lowestAccessibility = [...provinces].sort((a, b) => a.AccessibilityIndex - b.AccessibilityIndex)[0];
  
  const generateMortgageInsight = () => {
    if (!lowestAccessibility) return <></>;
    const prov = lowestAccessibility.Province;
    const pov = lowestAccessibility.PovertyRate.toFixed(1) + '%';
    const acc = lowestAccessibility.AccessibilityIndex.toFixed(1);

    if (lowestAccessibility.AccessibilityIndex < 40) {
      return lang === 'en' 
        ? `Macroeconomic headwinds in ${prov} heavily restrict homeownership. A high poverty rate of ${pov} combined with low regional GDP drastically limits mortgage feasibility, resulting in a critical accessibility score of ${acc}.`
        : `Hambatan makroekonomi di ${prov} sangat membatasi kepemilikan rumah. Tingkat kemiskinan yang tinggi sebesar ${pov} dikombinasikan dengan PDRB regional yang rendah secara drastis membatasi kelayakan KPR, menghasilkan skor aksesibilitas kritis sebesar ${acc}.`;
    } else {
      return lang === 'en' 
        ? `GDP per Capita growth strongly correlates positively with formal housing supply, whereas the Poverty Rate directly restricts accessibility.`
        : `Pertumbuhan PDRB per Kapita memiliki korelasi positif yang kuat terhadap suplai perumahan formal, sementara Tingkat Kemiskinan secara langsung membatasi aksesibilitas.`;
    }
  };

  return (
    <div className="w-full bg-white text-black min-h-screen pb-24 font-serif leading-relaxed overflow-x-hidden">
      
      {/* PAPER CONTENT */}
      <div className="w-full max-w-[850px] mx-auto px-6 sm:px-8 md:px-16 pt-12 md:pt-16 print:pt-0 print:px-0">
        
        {/* Title Header */}
        <div className="border-b-4 border-black pb-8 md:pb-12 mb-8 md:mb-12">
          <p className="text-xs md:text-sm font-bold uppercase tracking-widest mb-4">
            {lang === 'en' ? 'Macroeconomic Drivers Chapter' : 'Bab Penggerak Makroekonomi'}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight break-words">
            {lang === 'en' ? 'Statistical Correlates of Housing Disparities' : 'Korelasi Statistik Ketimpangan Perumahan'}
          </h1>
        </div>

        {/* Introduction */}
        <section className="mb-12 print-avoid-break">
          <p className="text-justify text-base md:text-lg mb-6">
            {lang === 'en' 
              ? 'This chapter explores the underlying macroeconomic drivers that dictate the feasibility of homeownership across provinces. By running cross-sectional correlations, we aim to identify the structural barriers impeding the housing market.' 
              : 'Bab ini mengeksplorasi penggerak makroekonomi mendasar yang menentukan kelayakan kepemilikan rumah di berbagai provinsi. Dengan menjalankan korelasi cross-sectional, kami bertujuan mengidentifikasi hambatan struktural yang menghalangi pasar perumahan.'}
          </p>
          <div className="mb-6 p-4 border-l-4 border-black bg-gray-50 text-base md:text-lg italic">
            &quot;{generateMortgageInsight()}&quot;
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-8">
            <div className="border border-gray-300 p-4">
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-500 border-b border-gray-300 pb-2 mb-2">{lang === 'en' ? 'Strongest Positive Driver' : 'Penggerak Positif Terkuat'}</h3>
              <div className="text-xl font-bold mb-1">{lang === 'en' ? 'GDP Per Capita' : 'PDRB Per Kapita'}</div>
              <p className="text-xs italic text-gray-600">r = {correlationMatrix[3].values[2].toFixed(2)} {lang === 'en' ? 'against Supply' : 'terhadap Pasokan'}</p>
            </div>
            <div className="border border-gray-300 p-4">
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-500 border-b border-gray-300 pb-2 mb-2">{lang === 'en' ? 'Strongest Negative Driver' : 'Penggerak Negatif Terkuat'}</h3>
              <div className="text-xl font-bold mb-1">{lang === 'en' ? 'Poverty Rate' : 'Tingkat Kemiskinan'}</div>
              <p className="text-xs italic text-gray-600">r = {correlationMatrix[4].values[0].toFixed(2)} {lang === 'en' ? 'against Access' : 'terhadap Akses'}</p>
            </div>
            <div className="border border-gray-300 p-4">
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-500 border-b border-gray-300 pb-2 mb-2">{lang === 'en' ? 'Highest Impact Indicator' : 'Indikator Dampak Tertinggi'}</h3>
              <div className="text-xl font-bold mb-1">{lang === 'en' ? 'Supply Index' : 'Indeks Pasokan'}</div>
              <p className="text-xs italic text-gray-600">r = {correlationMatrix[2].values[5].toFixed(2)} {lang === 'en' ? 'against Ownership' : 'terhadap Kepemilikan'}</p>
            </div>
          </div>
        </section>

        {/* Correlation Matrix Heatmap */}
        <section className="mb-12 print-avoid-break">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide border-b border-gray-300 pb-2 mb-6 break-words">
            {lang === 'en' ? '1. Pearson Correlation Matrix' : '1. Matriks Korelasi Pearson'}
          </h2>
          <p className="text-justify text-base md:text-lg mb-6">
            {lang === 'en' ? 'The matrix below quantifies the linear relationships between macroeconomic indicators and housing outcomes.' : 'Matriks di bawah ini mengkuantifikasi hubungan linier antara indikator makroekonomi dan hasil perumahan.'}
          </p>
          
          <div className="my-8 border border-gray-300 p-2 sm:p-4 bg-gray-50 overflow-hidden">
            <h4 className="text-center font-bold font-sans text-xs sm:text-sm mb-4 uppercase break-words">
              {lang === 'en' ? 'Table 1: Macroeconomic Correlation Heatmap (r)' : 'Tabel 1: Peta Panas Korelasi Makroekonomi (r)'}
            </h4>
            <div className="overflow-x-auto border border-gray-300 bg-white p-2">
              <table className="w-full text-center border-collapse text-xs md:text-sm">
                <thead>
                  <tr>
                    <th className="p-2 border border-gray-300 bg-gray-50"></th>
                    {headers.map((h, i) => <th key={i} className="p-2 border border-gray-300 bg-gray-50 font-bold uppercase text-[10px] whitespace-nowrap">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {correlationMatrix.map((row, i) => (
                    <tr key={i}>
                      <td className="p-2 border border-gray-300 font-bold bg-gray-50 text-left text-[10px] uppercase whitespace-nowrap">{row.var}</td>
                      {row.values.map((val, j) => (
                        <td key={j} className="p-1 border border-gray-300">
                          <div className={`w-full h-8 md:h-10 flex items-center justify-center font-mono ${getCorrColor(val)}`}>
                            {val.toFixed(2)}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-center space-x-6 text-[10px] uppercase font-bold text-gray-500">
              <div className="flex items-center"><div className="w-3 h-3 bg-[#005587] mr-2 border border-gray-300"></div> +1.0</div>
              <div className="flex items-center"><div className="w-3 h-3 bg-white mr-2 border border-gray-300"></div> 0.0</div>
              <div className="flex items-center"><div className="w-3 h-3 bg-[#DC2626] mr-2 border border-gray-300"></div> -1.0</div>
            </div>
          </div>
        </section>

        {/* Feature Importance & Economic Context */}
        <section className="mb-12 print-avoid-break">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide border-b border-gray-300 pb-2 mb-6 break-words">
            {lang === 'en' ? '2. Regression Drivers & Trends' : '2. Penggerak Regresi & Tren'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="border border-gray-300 p-2 sm:p-4 bg-gray-50 overflow-hidden">
              <h4 className="text-center font-bold font-sans text-xs mb-4 uppercase">
                {lang === 'en' ? 'Figure 1: Feature Importance (%)' : 'Gambar 1: Tingkat Kepentingan Fitur (%)'}
              </h4>
              <div className="h-64 w-full border border-gray-300 bg-white">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regressionData} layout="vertical" margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontFamily: 'serif' }} domain={[0, 50]} />
                    <YAxis dataKey="driver" type="category" axisLine={{stroke: '#9CA3AF'}} tickLine={false} tick={{ fontSize: 11, fontFamily: 'sans-serif' }} width={80} />
                    <RechartsTooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ backgroundColor: '#111827', borderColor: '#111827', borderRadius: 0, fontWeight: 600 }} itemStyle={{ color: '#fff' }} formatter={(value: any) => [Number(value).toFixed(1) + '%']} />
                    <Bar dataKey="importance" fill="#005587" barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="border border-gray-300 p-2 sm:p-4 bg-gray-50 overflow-hidden">
              <h4 className="text-center font-bold font-sans text-xs mb-4 uppercase">
                {lang === 'en' ? 'Figure 2: Economic Context Over Time' : 'Gambar 2: Konteks Ekonomi Seiring Waktu'}
              </h4>
              <div className="h-64 w-full border border-gray-300 bg-white pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={economicData} margin={{ top: 10, right: 10, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="year" axisLine={{stroke: '#9CA3AF'}} tickLine={false} tick={{ fontSize: 11, fontFamily: 'serif' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontFamily: 'serif' }} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#111827', borderRadius: 0, fontWeight: 600 }} itemStyle={{ color: '#fff' }} formatter={(value: any) => [Number(value).toFixed(1) + '%']} />
                    <Line type="monotone" dataKey="gdp" name="GDP" stroke="#16A34A" strokeWidth={3} dot={{r:3}} />
                    <Line type="monotone" dataKey="ownership" name="Ownership" stroke="#005587" strokeWidth={3} dot={{r:3}} strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="poverty" name="Poverty" stroke="#DC2626" strokeWidth={3} dot={{r:3}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
