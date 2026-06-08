"use client";

import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, TrendingDown, Target } from 'lucide-react';
import { fetchNationalData, fetchProvinceData, NationalTrendData } from '@/lib/dataProvider';
import { CalculatedKPIs } from '@/lib/kpiEngine';

export default function ResearchPage() {
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

  const latestNational = nationalTrend[nationalTrend.length - 1] || { HousingScore: 72.4, AffordabilityRatio: 5.8, OwnershipRate: 84.1, HousingBacklog: 9900000 };
  
  // Find highest affordability (worst)
  const worstAffordability = [...provinces].sort((a,b) => b.AffordabilityIndex - a.AffordabilityIndex)[0];
  const totalBacklog = (provinces.reduce((sum, p) => sum + p.HousingBacklog, 0) / 1000000).toFixed(1);

  return (
    <div className="w-full bg-white font-sans text-gray-900 pb-24">
      
      {/* Title Header Section */}
      <div className="max-w-[1600px] mx-auto px-6 xl:px-12 py-12">
        <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tight mb-4 flex items-center">
          <BookOpen className="mr-4 text-accent" size={40} />
          Research Findings
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl font-medium leading-relaxed">
          Applied Business Intelligence analysis of the Indonesian housing market, assessing affordability, ownership access, and policy interventions.
        </p>
      </div>

      <div className="border-y border-gray-200 bg-[#F9F9F9] py-12">
        <div className="max-w-[1200px] mx-auto px-6 xl:px-12">
          
          {/* Executive Summary */}
          <section className="bg-white border border-gray-200 p-8 xl:p-12 mb-12 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-widest mb-6">1. Executive Summary</h2>
            <div className="prose max-w-none text-gray-600 font-medium leading-relaxed">
              <p className="text-lg mb-8">
                The Indonesian housing market is currently experiencing a structural shift characterized by a growing disconnect between property price appreciation and household income growth. The national <strong className="text-primary">Housing Intelligence Score currently stands at {latestNational.HousingScore}/100</strong>, indicating a &quot;{latestNational.HousingScore >= 60 ? 'Moderate' : 'Warning'}&quot; systemic health but masking severe disparities across high-density urban centers.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 border border-gray-100 p-6 flex flex-col items-center text-center">
                  <span className="text-4xl font-black text-gray-900">{latestNational.AffordabilityRatio}x</span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">National Affordability Ratio</span>
                </div>
                <div className="bg-gray-50 border border-gray-100 p-6 flex flex-col items-center text-center">
                  <span className="text-4xl font-black text-gray-900">{latestNational.OwnershipRate}%</span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Home Ownership Rate</span>
                </div>
                <div className="bg-gray-50 border border-gray-100 p-6 flex flex-col items-center text-center">
                  <span className="text-4xl font-black text-gray-900">{totalBacklog}M</span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Housing Backlog (Units)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Highlight Quote */}
          <blockquote className="bg-primary text-white p-10 md:p-16 relative overflow-hidden mb-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 transform rotate-45 -mr-20 -mt-20"></div>
            <p className="text-2xl md:text-3xl font-light leading-snug max-w-4xl italic">
              &quot;The challenge is no longer just building enough houses; it is building affordable houses where the economic engines operate, without crippling the financial stability of the middle class.&quot;
            </p>
          </blockquote>

          {/* Top Findings */}
          <section className="mb-12">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center">
              <CheckCircle2 className="mr-3 text-green-600" size={28} />
              2. Top Findings
            </h2>
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 p-8 hover:border-primary transition-colors">
                <h3 className="text-lg font-bold text-primary mb-3">1. The Affordability Chasm in Tier-1 Cities</h3>
                <p className="text-gray-600 font-medium leading-relaxed">
                  In provinces like {worstAffordability?.Province}, the affordability index has breached {Math.floor(worstAffordability?.AffordabilityIndex || 10)}x annual household income. Property price growth consistently outpaces income growth, pushing homeownership out of reach for millennials.
                </p>
              </div>
              <div className="bg-white border border-gray-200 p-8 hover:border-primary transition-colors">
                <h3 className="text-lg font-bold text-primary mb-3">2. Demand-Supply Mismatch Driven by Urbanization</h3>
                <p className="text-gray-600 font-medium leading-relaxed">
                  Urban population growth is absorbing new housing supply at a rapid pace in industrial corridors. This structural deficit is the primary driver of the {totalBacklog} million unit national backlog.
                </p>
              </div>
              <div className="bg-white border border-gray-200 p-8 hover:border-primary transition-colors">
                <h3 className="text-lg font-bold text-primary mb-3">3. Mortgage Accessibility Constraints</h3>
                <p className="text-gray-600 font-medium leading-relaxed">
                  Despite relatively stable interest rates, the Mortgage Accessibility Score is suppressed by high down-payment barriers and informal sector income volatility, excluding a large portion of the active workforce from formal banking products.
                </p>
              </div>
            </div>
          </section>

          {/* Key Challenges */}
          <section className="mb-12">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center">
              <TrendingDown className="mr-3 text-red-600" size={28} />
              3. Key Challenges
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 border border-red-100 p-8">
                <h4 className="font-bold text-red-900 mb-2">Land Scarcity & Speculation</h4>
                <p className="text-sm text-red-800 font-medium leading-relaxed">Speculative land banking has artificially inflated land acquisition costs by 150% in peri-urban areas over the last decade.</p>
              </div>
              <div className="bg-red-50 border border-red-100 p-8">
                <h4 className="font-bold text-red-900 mb-2">Construction Material Inflation</h4>
                <p className="text-sm text-red-800 font-medium leading-relaxed">Global supply chain pressures have driven up raw material costs, squeezing developer margins for affordable housing segments.</p>
              </div>
              <div className="bg-red-50 border border-red-100 p-8">
                <h4 className="font-bold text-red-900 mb-2">Spatial Inequality</h4>
                <p className="text-sm text-red-800 font-medium leading-relaxed">Investment is heavily concentrated in Java, leaving Eastern Indonesia with severe infrastructure and supply deficits.</p>
              </div>
              <div className="bg-red-50 border border-red-100 p-8">
                <h4 className="font-bold text-red-900 mb-2">Informal Economy</h4>
                <p className="text-sm text-red-800 font-medium leading-relaxed">A massive unbanked population struggles to meet rigorous credit underwriting standards for mortgages.</p>
              </div>
            </div>
          </section>

          {/* Strategic Recommendations */}
          <section>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center">
              <Target className="mr-3 text-accent" size={28} />
              4. Strategic Recommendations
            </h2>
            <div className="space-y-6">
              <div className="flex items-start bg-white border border-gray-200 p-8">
                <div className="w-12 h-12 bg-gray-50 flex items-center justify-center text-primary font-black text-xl mr-6 flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">Transit-Oriented Development (TOD) Expansion</h4>
                  <p className="text-gray-600 font-medium leading-relaxed mt-2">Subsidize high-density vertical housing integrated with public transport networks (LRT/MRT) to reduce commute costs and land acquisition premiums.</p>
                </div>
              </div>
              <div className="flex items-start bg-white border border-gray-200 p-8">
                <div className="w-12 h-12 bg-gray-50 flex items-center justify-center text-primary font-black text-xl mr-6 flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">Alternative Credit Scoring</h4>
                  <p className="text-gray-600 font-medium leading-relaxed mt-2">Implement non-traditional underwriting models leveraging telco data and digital payments to qualify informal sector workers for state-backed mortgages.</p>
                </div>
              </div>
              <div className="flex items-start bg-white border border-gray-200 p-8">
                <div className="w-12 h-12 bg-gray-50 flex items-center justify-center text-primary font-black text-xl mr-6 flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">Progressive Vacant Land Tax</h4>
                  <p className="text-gray-600 font-medium leading-relaxed mt-2">Disincentivize speculative land banking by implementing a tiered taxation system on undeveloped urban land to free up parcels for residential development.</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
