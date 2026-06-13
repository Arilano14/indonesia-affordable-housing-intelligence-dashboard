"use client";

import React, { useEffect, useState } from 'react';
import { fetchNationalData, fetchProvinceData, NationalTrendData } from '@/lib/dataProvider';
import { CalculatedKPIs, calculateKPIs, pearsonCorrelation, simulateScenarios } from '@/lib/kpiEngine';
import { Download } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useLanguage } from '@/components/providers/LanguageProvider';

export default function ResearchFindingsPage() {
  const [provinces, setProvinces] = useState<CalculatedKPIs[]>([]);
  const [nationalTrend, setNationalTrend] = useState<NationalTrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();

  useEffect(() => {
    async function loadData() {
      try {
        const [national, provs] = await Promise.all([fetchNationalData(), fetchProvinceData()]);
        setNationalTrend(national);
        setProvinces(calculateKPIs(provs));
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center font-serif text-lg">Generating Academic Report...</div>;
  }

  const latestNational = nationalTrend[nationalTrend.length - 1] || { HousingScore: 65, TotalBacklogPercent: 15, PovertyRate: 10, MortgageAccessibility: 50, OwnershipRate: 80 };
  
  const avgGDP = provinces.reduce((a,b)=>a+b.GDPPerCapita,0)/provinces.length || 1;
  const highGDPHighBacklog = provinces.filter(p => p.GDPPerCapita > avgGDP && p.TotalBacklogPercent > latestNational.TotalBacklogPercent);
  const stressZones = provinces.filter(p => p.TotalBacklogPercent > latestNational.TotalBacklogPercent && p.OwnershipRate < latestNational.OwnershipRate && p.PovertyRate > latestNational.PovertyRate);
  
  const clusterA = provinces.filter(p => p.ArchetypeCluster.startsWith('A'));
  const clusterB = provinces.filter(p => p.ArchetypeCluster.startsWith('B'));
  const clusterC = provinces.filter(p => p.ArchetypeCluster.startsWith('C'));
  const clusterD = provinces.filter(p => p.ArchetypeCluster.startsWith('D'));

  const topHOGI = [...provinces].sort((a,b) => b.HOGIScore - a.HOGIScore).slice(0, 10);

  const scores = provinces.map(p => p.HousingScore);
  const gdpCorr = pearsonCorrelation(provinces.map(p => p.GDPPerCapita), scores);
  const povCorr = pearsonCorrelation(provinces.map(p => p.PovertyRate), scores);
  const backCorr = pearsonCorrelation(provinces.map(p => p.TotalBacklogPercent), scores);
  const ownCorr = pearsonCorrelation(provinces.map(p => p.OwnershipRate), scores);

  const correlations = [
    { name: lang === 'en' ? "GDP per Capita" : "PDB per Kapita", value: gdpCorr },
    { name: lang === 'en' ? "Poverty Rate" : "Tingkat Kemiskinan", value: povCorr },
    { name: lang === 'en' ? "Housing Backlog" : "Kekurangan Rumah", value: backCorr },
    { name: lang === 'en' ? "Ownership Rate" : "Tingkat Kepemilikan", value: ownCorr }
  ].sort((a,b) => Math.abs(b.value) - Math.abs(a.value));

  const strongestDriver = correlations[0];

  const simulations = simulateScenarios(latestNational);

  const handlePrint = () => window.print();

  return (
    <div className="w-full bg-white text-black min-h-screen pb-24 font-serif leading-relaxed overflow-x-hidden">
      
      {/* Non-printable Action Bar */}
      <div className="w-full bg-gray-100 border-b border-gray-300 p-4 flex justify-end items-center print:hidden">
        <button 
          onClick={handlePrint}
          className="bg-black text-white px-6 py-2 flex items-center gap-2 font-sans text-sm hover:bg-gray-800 transition-colors rounded shadow-sm w-full sm:w-auto justify-center"
        >
          <Download size={16} />
          {lang === 'en' ? 'Download White Paper (PDF)' : 'Unduh White Paper (PDF)'}
        </button>
      </div>

      {/* PAPER CONTENT */}
      <div className="w-full max-w-[850px] mx-auto px-6 sm:px-8 md:px-16 pt-12 md:pt-16 print:pt-0 print:px-0">
        
        {/* Cover Page */}
        <div className="border-b-4 border-black pb-8 md:pb-12 mb-8 md:mb-12">
          <p className="text-xs md:text-sm font-bold uppercase tracking-widest mb-4">
            Indonesia Affordable Housing Intelligence Dashboard
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight break-words">
            {lang === 'en' 
              ? 'Data-Driven Assessment of Housing Affordability, Accessibility, and Regional Disparities in Indonesia' 
              : 'Penilaian Berbasis Data terhadap Keterjangkauan, Aksesibilitas, dan Ketimpangan Perumahan Regional di Indonesia'}
          </h1>
        </div>

        {/* SECTION 1: Abstract */}
        <section className="mb-12 page-break-after">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide border-b border-gray-300 pb-2 mb-6 break-words">
            {lang === 'en' ? '1. Executive Research Abstract' : '1. Abstrak Eksekutif Penelitian'}
          </h2>
          <div className="text-justify text-base md:text-lg">
            <p className="mb-4">
              {lang === 'en' 
                ? 'This paper presents an applied business intelligence analysis of the Indonesian housing market, utilizing empirical datasets to extract non-obvious patterns in affordability and ownership accessibility. At the national level, the Housing Intelligence Score is evaluated at ' 
                : 'Makalah ini menyajikan analisis intelijen bisnis terapan untuk pasar perumahan Indonesia, memanfaatkan dataset empiris guna mengekstraksi pola-pola yang tidak terlihat terkait keterjangkauan dan aksesibilitas kepemilikan. Di tingkat nasional, Skor Intelijen Perumahan dievaluasi pada angka '}
              <strong>{latestNational.HousingScore?.toFixed(1)}</strong> 
              {lang === 'en' ? ' out of 100, which suggests that housing conditions ' : ' dari 100, yang menunjukkan bahwa kondisi perumahan '}
              {latestNational.HousingScore > 75 
                ? (lang === 'en' ? 'are generally favorable with balanced indicators' : 'secara umum menguntungkan dengan indikator yang seimbang') 
                : latestNational.HousingScore >= 50 
                  ? (lang === 'en' ? 'remain moderate but display notable regional disparities requiring targeted interventions' : 'tetap moderat namun menunjukkan ketimpangan regional yang signifikan sehingga memerlukan intervensi yang ditargetkan') 
                  : (lang === 'en' ? 'indicate significant structural challenges and require immediate policy attention' : 'menunjukkan tantangan struktural yang signifikan dan memerlukan perhatian kebijakan segera')}.
            </p>
            <p className="mb-4">
              {lang === 'en' 
                ? 'By transitioning away from descriptive dashboards toward predictive and diagnostic indices—such as the newly formulated Housing Opportunity Gap Index (HOGI)—the research uncovers the underlying drivers of housing stress. It challenges the conventional assumption that economic growth directly translates to improved housing outcomes.' 
                : 'Dengan bertransisi dari sekadar dasbor deskriptif menuju indeks prediktif dan diagnostik—seperti Indeks Kesenjangan Peluang Perumahan (HOGI)—riset ini mengungkap akar masalah tekanan perumahan. Hasil analisis menantang asumsi lama bahwa pertumbuhan ekonomi secara otomatis menghasilkan perbaikan hasil perumahan.'}
            </p>
          </div>
        </section>

        {/* SECTION 2: Hidden Patterns */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide border-b border-gray-300 pb-2 mb-6 break-words">
            {lang === 'en' ? '2. Hidden Patterns Discovery' : '2. Penemuan Pola Tersembunyi'}
          </h2>
          
          <h3 className="text-lg md:text-xl font-bold italic mb-4">
            {lang === 'en' ? '2.1 Economic Growth ≠ Housing Accessibility' : '2.1 Pertumbuhan Ekonomi ≠ Aksesibilitas Perumahan'}
          </h3>
          <p className="text-justify mb-4 text-base md:text-lg">
            {lang === 'en' 
              ? `Analysis of the dataset reveals a counter-intuitive pattern: high GDP per capita does not guarantee housing accessibility. Several provinces exhibit high economic output yet suffer from severe housing shortages. We identified ${highGDPHighBacklog.length} provinces exhibiting this exact anomaly, proving that ` 
              : `Analisis dataset mengungkapkan pola yang kontraintuitif: PDB per kapita yang tinggi tidak menjamin aksesibilitas perumahan. Beberapa provinsi menunjukkan keluaran ekonomi yang tinggi namun menderita kekurangan perumahan parah. Kami mengidentifikasi ${highGDPHighBacklog.length} provinsi yang menunjukkan anomali ini, membuktikan bahwa `}
            <em>{lang === 'en' ? 'economic prosperity alone does not guarantee housing accessibility' : 'kemakmuran ekonomi saja tidak menjamin aksesibilitas perumahan'}</em>. 
            {lang === 'en' ? ' The rapid urbanization in these areas likely drives land speculation, outpacing income gains.' : ' Urbanisasi pesat di wilayah-wilayah ini kemungkinan besar mendorong spekulasi tanah yang melampaui kenaikan pendapatan.'}
          </p>

          <h3 className="text-lg md:text-xl font-bold italic mb-4 mt-8">
            {lang === 'en' ? '2.2 The Housing Stress Zone' : '2.2 Zona Tekanan Perumahan'}
          </h3>
          <p className="text-justify mb-4 text-base md:text-lg">
            {lang === 'en' 
              ? `A critical clustering analysis isolates regions suffering from a tripartite crisis: Backlog above the national average (${latestNational.TotalBacklogPercent?.toFixed(1)}%), Ownership below average (${latestNational.OwnershipRate?.toFixed(1)}%), and Poverty above average (${latestNational.PovertyRate?.toFixed(1)}%). We classified ${stressZones.length} provinces strictly as "Housing Stress Clusters," necessitating immediate, targeted social intervention.` 
              : `Analisis pengelompokan secara kritis mengisolasi wilayah yang menderita krisis tiga ganda: Backlog di atas rata-rata nasional (${latestNational.TotalBacklogPercent?.toFixed(1)}%), Kepemilikan di bawah rata-rata (${latestNational.OwnershipRate?.toFixed(1)}%), dan Kemiskinan di atas rata-rata (${latestNational.PovertyRate?.toFixed(1)}%). Kami mengklasifikasikan ${stressZones.length} provinsi ke dalam "Zona Tekanan Perumahan," yang sangat membutuhkan intervensi sosial yang cepat dan tepat sasaran.`}
          </p>

          <div className="my-8 border border-gray-300 p-2 sm:p-4 bg-gray-50 overflow-hidden">
            <h4 className="text-center font-bold font-sans text-xs sm:text-sm mb-4 uppercase break-words">
              {lang === 'en' ? 'Figure 1: GDP per Capita vs. Housing Score' : 'Gambar 1: PDB per Kapita vs. Skor Perumahan'}
            </h4>
            <div className="h-48 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
                  <XAxis dataKey="GDPPerCapita" type="number" name="GDP" tickFormatter={(val) => `${(val/1000000).toFixed(0)}M`} tick={{fontSize: 10, fill: '#6B7280'}} />
                  <YAxis dataKey="HousingScore" type="number" name="Score" domain={[0, 100]} tick={{fontSize: 10, fill: '#6B7280'}} />
                  <Tooltip cursor={{strokeDasharray: '3 3'}} formatter={(value: number) => value.toFixed(2)} />
                  <Scatter name="Provinces" data={provinces} fill="#000000">
                    {provinces.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.GDPPerCapita > avgGDP && entry.TotalBacklogPercent > latestNational.TotalBacklogPercent ? '#EF4444' : '#000000'} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-center italic mt-2 text-gray-600">
              {lang === 'en' ? 'Note: Red dots indicate provinces with High GDP but High Backlog.' : 'Catatan: Titik merah menunjukkan provinsi dengan PDB Tinggi namun Backlog Tinggi.'}
            </p>
          </div>
        </section>

        {/* SECTION 3: Archetypes */}
        <section className="mb-12 page-break-before">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide border-b border-gray-300 pb-2 mb-6 break-words">
            {lang === 'en' ? '3. Provincial Archetype Analysis' : '3. Analisis Arketipe Provinsi'}
          </h2>
          <p className="text-justify mb-6 text-base md:text-lg">
            {lang === 'en' 
              ? 'Rather than relying on linear ranking systems, this study classifies provinces into four distinct archetypes to inform tailored policy responses.' 
              : 'Alih-alih bergantung pada sistem peringkat linier, studi ini mengklasifikasikan provinsi ke dalam empat arketipe yang berbeda untuk merumuskan respons kebijakan yang disesuaikan.'}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
            <div className="border border-gray-300 p-4 md:p-6 bg-white shadow-sm">
              <h4 className="font-bold text-base md:text-lg mb-2">
                {lang === 'en' ? 'Cluster A: Emerging Housing Markets' : 'Klaster A: Pasar Perumahan Berkembang'}
              </h4>
              <p className="text-sm text-gray-700">
                {lang === 'en' ? `High economic output with declining backlogs. (${clusterA.length} Provinces)` : `Keluaran ekonomi tinggi dengan backlog yang menurun. (${clusterA.length} Provinsi)`}
              </p>
            </div>
            <div className="border border-gray-300 p-4 md:p-6 bg-gray-50 shadow-sm">
              <h4 className="font-bold text-base md:text-lg mb-2">
                {lang === 'en' ? 'Cluster B: High Growth Housing Stress' : 'Klaster B: Pertumbuhan Tinggi & Tekanan Perumahan'}
              </h4>
              <p className="text-sm text-gray-700">
                {lang === 'en' ? `High economic output hampered by severe backlogs. (${clusterB.length} Provinces)` : `Keluaran ekonomi tinggi yang terhambat oleh backlog parah. (${clusterB.length} Provinsi)`}
              </p>
            </div>
            <div className="border border-gray-300 p-4 md:p-6 bg-gray-100 shadow-sm">
              <h4 className="font-bold text-base md:text-lg mb-2">
                {lang === 'en' ? 'Cluster C: Social Vulnerability Zone' : 'Klaster C: Zona Kerentanan Sosial'}
              </h4>
              <p className="text-sm text-gray-700">
                {lang === 'en' ? `Characterized by high poverty and lowest ownership rates. (${clusterC.length} Provinces)` : `Ditandai dengan tingginya kemiskinan dan tingkat kepemilikan terendah. (${clusterC.length} Provinsi)`}
              </p>
            </div>
            <div className="border border-gray-300 p-4 md:p-6 bg-white shadow-sm">
              <h4 className="font-bold text-base md:text-lg mb-2">
                {lang === 'en' ? 'Cluster D: Balanced Housing Region' : 'Klaster D: Wilayah Perumahan Seimbang'}
              </h4>
              <p className="text-sm text-gray-700">
                {lang === 'en' ? `Achieving high housing scores with managed backlogs. (${clusterD.length} Provinces)` : `Mencapai skor perumahan tinggi dengan backlog yang terkendali. (${clusterD.length} Provinsi)`}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: HOGI */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide border-b border-gray-300 pb-2 mb-6 break-words">
            {lang === 'en' ? '4. Housing Opportunity Gap Index (HOGI)' : '4. Indeks Kesenjangan Peluang Perumahan (HOGI)'}
          </h2>
          <p className="text-justify mb-6 text-base md:text-lg">
            {lang === 'en' 
              ? 'The HOGI is a novel composite metric designed to measure housing inequality. It aggregates Backlog (35%), Poverty (25%), Ownership Gap (20%), and Accessibility Gap (20%). A higher HOGI score (0-100) indicates severe spatial housing inequality.' 
              : 'HOGI adalah metrik gabungan baru yang dirancang untuk mengukur ketidaksetaraan perumahan. Metrik ini menggabungkan Backlog (35%), Kemiskinan (25%), Kesenjangan Kepemilikan (20%), dan Kesenjangan Aksesibilitas (20%). Skor HOGI yang lebih tinggi (0-100) menunjukkan ketidaksetaraan spasial yang parah.'}
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-xs md:text-sm text-left border-collapse border border-gray-300 min-w-[500px]">
              <thead className="bg-black text-white uppercase text-[10px] md:text-xs">
                <tr>
                  <th className="px-2 md:px-4 py-2 md:py-3 border border-gray-300">Rank</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 border border-gray-300">{lang === 'en' ? 'Province' : 'Provinsi'}</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 border border-gray-300 text-center">HOGI Score</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 border border-gray-300 text-center">{lang === 'en' ? 'Category' : 'Kategori'}</th>
                </tr>
              </thead>
              <tbody>
                {topHOGI.map((prov, idx) => (
                  <tr key={prov.Province} className="border-b border-gray-300">
                    <td className="px-2 md:px-4 py-2 border border-gray-300 text-center font-bold">{idx + 1}</td>
                    <td className="px-2 md:px-4 py-2 border border-gray-300">{prov.Province}</td>
                    <td className="px-2 md:px-4 py-2 border border-gray-300 text-center font-mono">{prov.HOGIScore.toFixed(2)}</td>
                    <td className="px-2 md:px-4 py-2 border border-gray-300 text-center italic">
                      {lang === 'en' ? prov.HOGICategory : prov.HOGICategory.replace('Gap', 'Kesenjangan')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 5: Drivers */}
        <section className="mb-12 page-break-before">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide border-b border-gray-300 pb-2 mb-6 break-words">
            {lang === 'en' ? '5. Housing Driver Intelligence' : '5. Kecerdasan Pendorong Perumahan'}
          </h2>
          <p className="text-justify mb-6 text-base md:text-lg">
            {lang === 'en' 
              ? 'To determine which macroeconomic variable possesses the strongest explanatory power over housing performance, we calculated the Pearson correlation coefficient between various inputs and the final Housing Score.' 
              : 'Untuk menentukan variabel makroekonomi mana yang memiliki kekuatan penjelas terkuat terhadap kinerja perumahan, kami menghitung koefisien korelasi Pearson antara berbagai variabel masukan dengan Skor Perumahan.'}
          </p>

          <div className="bg-gray-50 border-l-4 border-black p-4 md:p-6 mb-6">
            <p className="text-base md:text-lg font-bold">{lang === 'en' ? 'Primary Finding:' : 'Temuan Utama:'}</p>
            <p className="text-justify mt-2 text-sm md:text-base">
              <strong>{strongestDriver.name}</strong> 
              {lang === 'en' ? ' exhibits the strongest ' : ' menunjukkan hubungan '}
              {strongestDriver.value > 0 ? (lang === 'en' ? 'positive' : 'positif') : (lang === 'en' ? 'negative' : 'negatif')}
              {lang === 'en' ? ' relationship (r = ' : ' terkuat (r = '}
              {strongestDriver.value.toFixed(2)}) 
              {lang === 'en' 
                ? ' with overall housing performance. This suggests that targeting this variable is a more important driver for national housing stability than isolated housing interventions.' 
                : ' terhadap kinerja perumahan secara keseluruhan. Ini mengindikasikan bahwa variabel ini menjadi pendorong yang lebih penting bagi stabilitas perumahan nasional daripada intervensi yang terisolasi.'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm text-left border-collapse border border-gray-300 mt-4 min-w-[500px]">
              <thead className="bg-gray-200 uppercase text-[10px] md:text-xs">
                <tr>
                  <th className="px-2 md:px-4 py-2 md:py-3 border border-gray-300">{lang === 'en' ? 'Variable' : 'Variabel'}</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 border border-gray-300 text-center">Pearson (r)</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 border border-gray-300">{lang === 'en' ? 'Interpretation' : 'Interpretasi'}</th>
                </tr>
              </thead>
              <tbody>
                {correlations.map((corr) => (
                  <tr key={corr.name}>
                    <td className="px-2 md:px-4 py-2 border border-gray-300 font-bold">{corr.name}</td>
                    <td className="px-2 md:px-4 py-2 border border-gray-300 text-center font-mono">{corr.value.toFixed(3)}</td>
                    <td className="px-2 md:px-4 py-2 border border-gray-300">
                      {Math.abs(corr.value) > 0.7 
                        ? (lang === 'en' ? "Strong " : "Kuat ") 
                        : Math.abs(corr.value) > 0.4 
                          ? (lang === 'en' ? "Moderate " : "Moderat ") 
                          : (lang === 'en' ? "Weak " : "Lemah ")} 
                      {corr.value > 0 ? (lang === 'en' ? "Positive" : "Positif") : (lang === 'en' ? "Negative" : "Negatif")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 6: Simulations */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide border-b border-gray-300 pb-2 mb-6 break-words">
            {lang === 'en' ? '6. Scenario Simulation' : '6. Simulasi Skenario'}
          </h2>
          <p className="text-justify mb-6 text-base md:text-lg">
            {lang === 'en' 
              ? 'By shifting from descriptive analytics to prescriptive intelligence, we utilize the KPI engine to simulate the impact of strategic policy interventions on the National Housing Score.' 
              : 'Dengan beralih dari analitik deskriptif ke kecerdasan preskriptif, kami menggunakan algoritma KPI untuk menyimulasikan dampak dari intervensi kebijakan strategis terhadap Skor Perumahan Nasional.'}
          </p>

          <div className="space-y-4 md:space-y-6">
            {Object.entries(simulations).map(([key, sim]) => (
              <div key={key} className="border border-gray-300 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
                <div className="flex-1 text-center md:text-left">
                  <h4 className="font-black text-base md:text-lg mb-1">
                    {lang === 'id' ? sim.name.replace('Reduction', 'Penurunan').replace('Improvement', 'Peningkatan').replace('Poverty', 'Kemiskinan') : sim.name}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-600">
                    {lang === 'en' ? 'Simulated impact on the aggregate national housing score.' : 'Dampak tersimulasi pada skor agregat perumahan nasional.'}
                  </p>
                </div>
                <div className="flex items-center gap-4 sm:gap-8 font-mono">
                  <div className="text-center">
                    <p className="text-[10px] md:text-xs uppercase text-gray-500 mb-1">{lang === 'en' ? 'Current' : 'Saat Ini'}</p>
                    <p className="text-xl md:text-2xl">{latestNational.HousingScore?.toFixed(1)}</p>
                  </div>
                  <div className="text-gray-300 text-xl md:text-3xl">→</div>
                  <div className="text-center">
                    <p className="text-[10px] md:text-xs uppercase text-gray-500 mb-1">{lang === 'en' ? 'Projected' : 'Proyeksi'}</p>
                    <p className="text-xl md:text-2xl font-bold">{sim.newScore.toFixed(1)}</p>
                  </div>
                  <div className="text-center bg-black text-white px-2 sm:px-3 py-1 rounded-sm text-sm sm:text-base">
                    +{sim.diff.toFixed(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 7 & 8: Policy */}
        <section className="mb-12 page-break-before">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide border-b border-gray-300 pb-2 mb-6 break-words">
            {lang === 'en' ? '7. Policy Intelligence Matrix & Priorities' : '7. Matriks Intelijen Kebijakan & Prioritas'}
          </h2>
          
          <ul className="list-disc pl-6 mb-8 text-base md:text-lg space-y-2">
            {latestNational.TotalBacklogPercent > 10 && 
              <li><strong>{lang === 'en' ? 'Accelerate Affordable Housing Supply: ' : 'Percepat Pasokan Perumahan Terjangkau: '}</strong> {lang === 'en' ? 'The national backlog remains critically high.' : 'Backlog nasional masih sangat tinggi.'}</li>}
            {latestNational.MortgageAccessibility < 60 && 
              <li><strong>{lang === 'en' ? 'Improve Mortgage Accessibility: ' : 'Tingkatkan Aksesibilitas KPR: '}</strong> {lang === 'en' ? 'Alternative credit underwriting is required immediately.' : 'Analisis kredit alternatif segera dibutuhkan.'}</li>}
            {topHOGI[0] && 
              <li><strong>{lang === 'en' ? 'Reduce Regional Housing Inequality: ' : 'Kurangi Ketimpangan Perumahan Regional: '}</strong> {lang === 'en' ? `Special intervention required in ${topHOGI[0].Province} due to severe HOGI score.` : `Intervensi khusus diperlukan di ${topHOGI[0].Province} karena skor HOGI yang parah.`}</li>}
            {stressZones.length > 0 && 
              <li><strong>{lang === 'en' ? 'Targeted Social Housing Programs: ' : 'Program Perumahan Sosial Tertarget: '}</strong> {lang === 'en' ? `Deploy heavy subsidies for the ${stressZones.length} provinces trapped in the housing stress cluster.` : `Terapkan subsidi berat untuk ${stressZones.length} provinsi yang terjebak dalam klaster tekanan perumahan.`}</li>}
          </ul>

          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm text-left border-collapse border border-gray-300 min-w-[600px]">
              <thead className="bg-black text-white uppercase text-[10px] md:text-xs">
                <tr>
                  <th className="px-2 md:px-3 py-2 border border-gray-300">{lang === 'en' ? 'Issue' : 'Masalah'}</th>
                  <th className="px-2 md:px-3 py-2 border border-gray-300">{lang === 'en' ? 'Root Cause' : 'Akar Penyebab'}</th>
                  <th className="px-2 md:px-3 py-2 border border-gray-300">{lang === 'en' ? 'Affected Archetype' : 'Arketipe Terdampak'}</th>
                  <th className="px-2 md:px-3 py-2 border border-gray-300">{lang === 'en' ? 'Recommended Policy' : 'Rekomendasi Kebijakan'}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="px-2 md:px-3 py-2 border border-gray-300 font-bold">{lang === 'en' ? 'Severe Housing Shortage' : 'Kekurangan Perumahan Parah'}</td>
                  <td className="px-2 md:px-3 py-2 border border-gray-300">{lang === 'en' ? 'Urban land speculation' : 'Spekulasi lahan perkotaan'}</td>
                  <td className="px-2 md:px-3 py-2 border border-gray-300 italic">{lang === 'en' ? 'Cluster B' : 'Klaster B'}</td>
                  <td className="px-2 md:px-3 py-2 border border-gray-300">{lang === 'en' ? 'Vacant land tax, TOD supply subsidies' : 'Pajak lahan kosong, subsidi pasokan TOD'}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="px-2 md:px-3 py-2 border border-gray-300 font-bold">{lang === 'en' ? 'Low Ownership Rates' : 'Tingkat Kepemilikan Rendah'}</td>
                  <td className="px-2 md:px-3 py-2 border border-gray-300">{lang === 'en' ? 'High poverty, low formal credit' : 'Kemiskinan tinggi, kredit formal rendah'}</td>
                  <td className="px-2 md:px-3 py-2 border border-gray-300 italic">{lang === 'en' ? 'Cluster C' : 'Klaster C'}</td>
                  <td className="px-2 md:px-3 py-2 border border-gray-300">{lang === 'en' ? 'Micro-mortgages, informal sector guarantees' : 'Kredit mikro, jaminan sektor informal'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 9 & 10: Conclusion */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide border-b border-gray-300 pb-2 mb-6 break-words">
            {lang === 'en' ? '8. Research Contribution & Conclusion' : '8. Kontribusi Riset & Kesimpulan'}
          </h2>
          <div className="bg-gray-100 p-4 md:p-6 italic text-justify mb-6 text-sm md:text-base">
            {lang === 'en' 
              ? `"This study contributes to affordable housing analytics by integrating demographic, economic, and housing indicators into a unified Housing Intelligence Framework. Unlike traditional descriptive dashboards, the framework provides predictive and policy-oriented intelligence for decision makers."` 
              : `"Studi ini berkontribusi pada analitik perumahan yang terjangkau dengan mengintegrasikan indikator demografi, ekonomi, dan perumahan ke dalam Kerangka Intelijen Perumahan yang terpadu. Berbeda dengan dasbor deskriptif tradisional, kerangka ini menyediakan kecerdasan prediktif dan berorientasi kebijakan bagi para pengambil keputusan."`}
          </div>
          <p className="text-justify mb-4 text-base md:text-lg">
            {lang === 'en' 
              ? `The evidence strongly supports a pivot from uniform national housing policies toward archetype-specific interventions. The application of the Housing Opportunity Gap Index (HOGI) proves that spatial inequalities require localized, targeted solutions rather than blanket macroeconomic adjustments. Future research should expand the scenario simulation engine to integrate machine learning techniques for long-term forecasting.` 
              : `Bukti sangat mendukung peralihan dari kebijakan perumahan nasional yang seragam menuju intervensi spesifik arketipe. Penerapan Indeks Kesenjangan Peluang Perumahan (HOGI) membuktikan bahwa ketidaksetaraan spasial memerlukan solusi lokal yang ditargetkan, bukan sekadar penyesuaian makroekonomi secara menyeluruh. Penelitian masa depan harus memperluas mesin simulasi skenario untuk mengintegrasikan teknik pembelajaran mesin (AI) guna peramalan jangka panjang.`}
          </p>
        </section>

        {/* SECTION 11: Methodology */}
        <section className="mb-12 text-xs md:text-sm text-gray-600">
          <h2 className="text-base md:text-lg font-black uppercase tracking-wide border-b border-gray-300 pb-2 mb-4 text-black break-words">
            {lang === 'en' ? 'Appendix: Methodology & Sources' : 'Lampiran: Metodologi & Sumber'}
          </h2>
          <p className="mb-2"><strong>{lang === 'en' ? 'Data Sources:' : 'Sumber Data:'}</strong> World Bank Open Data (GDP, Inflation), Badan Pusat Statistik (Poverty, Population, Backlog), Bank Indonesia (Interest Rates), {lang === 'en' ? 'and' : 'dan'} Kementerian PKP.</p>
          <p className="mb-2"><strong>{lang === 'en' ? 'HOGI Formula:' : 'Rumus HOGI:'}</strong> {lang === 'en' ? 'Computed as a weighted composite:' : 'Dihitung sebagai gabungan berbobot:'} 0.35(Backlog) + 0.25(Poverty) + 0.20(Ownership Gap) + 0.20(Accessibility Gap).</p>
          <p className="mb-2"><strong>{lang === 'en' ? 'Correlation Engine:' : 'Mesin Korelasi:'}</strong> Pearson Product-Moment Correlation (r) {lang === 'en' ? 'utilizing linear covariance mathematics across' : 'menggunakan matematika kovarians linier di'} {provinces.length} {lang === 'en' ? 'spatial data points.' : 'titik data spasial.'}</p>
        </section>

      </div>
    </div>
  );
}
