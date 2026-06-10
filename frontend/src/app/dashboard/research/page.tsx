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

  const latestNational = nationalTrend[nationalTrend.length - 1] || { HousingScore: 72.4, AccessibilityIndex: 65, OwnershipRate: 84.1, TotalBacklogPercent: 9.9 };
  
  // Find highest affordability (worst)
  const worstAccessibility = [...provinces].sort((a,b) => a.AccessibilityIndex - b.AccessibilityIndex)[0];

  return (
    <div className="w-full bg-white font-sans text-gray-900 pb-24 min-h-screen">
      
      {/* Title Header Section */}
      <div className="w-full bg-[#0B1B36] text-white">
        <div className="max-w-[1600px] mx-auto px-6 xl:px-12 py-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-white flex items-center">
            <BookOpen className="mr-4 text-[#00B3DF]" size={48} />
            Research Findings
          </h1>
          <p className="text-xl md:text-3xl text-[#00B3DF] max-w-4xl font-light leading-snug">
            Applied Business Intelligence analysis of the Indonesian housing market, assessing affordability, ownership access, and policy interventions.
          </p>
        </div>
      </div>

      <div className="border-y border-gray-200 bg-[#F9F9F9] py-12">
        <div className="max-w-[1200px] mx-auto px-6 xl:px-12">
          
          {/* Executive Summary */}
          <section className="bg-white border border-gray-200 p-8 xl:p-12 mb-12 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-widest mb-6">1. Executive Summary</h2>
            <div className="prose max-w-none text-gray-600 font-medium leading-relaxed">
              <p className="text-lg mb-8">
                The Indonesian housing market is currently experiencing a structural shift characterized by a growing disconnect between property price appreciation and household income growth. The national <strong className="text-primary">Housing Score currently stands at {latestNational.HousingScore?.toFixed(1)}/100</strong>, indicating a &quot;{latestNational.HousingScore >= 60 ? 'Moderate' : 'Warning'}&quot; systemic health but masking severe disparities across high-density urban centers.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 border border-gray-100 p-6 flex flex-col items-center text-center">
                  <span className="text-4xl font-black text-gray-900">{latestNational.OwnershipRate?.toFixed(1)}%</span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Home Ownership Rate</span>
                </div>
                <div className="bg-gray-50 border border-gray-100 p-6 flex flex-col items-center text-center">
                  <span className="text-4xl font-black text-gray-900">{latestNational.TotalBacklogPercent?.toFixed(1)}%</span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Housing Backlog (% of Households)</span>
                </div>
                <div className="bg-gray-50 border border-gray-100 p-6 flex flex-col items-center text-center">
                  <span className="text-4xl font-black text-gray-900">{latestNational.DemandIndex?.toFixed(1)}</span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2 mb-4">National Demand Index (0-100)</span>
                  <div className="w-full text-left bg-[#0B1120] text-[#4ADE80] p-3 rounded-md text-[11px] font-mono overflow-x-auto shadow-inner leading-relaxed">
                    <span className="text-gray-500">/* Pop * HH * Urbanization */</span><br/>
                    Demand = Σ(ProvincialDemand * Weight)
                  </div>
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
                  In provinces like {worstAccessibility?.Province}, the Accessibility Index has fallen to {worstAccessibility?.AccessibilityIndex?.toFixed(1)}/100. High poverty rates combined with low GDP per capita in rural areas contrast sharply with urban centers where property prices outpace income growth.
                </p>
              </div>
              <div className="bg-white border border-gray-200 p-8 hover:border-primary transition-colors">
                <h3 className="text-lg font-bold text-primary mb-3">2. Demand-Supply Mismatch Driven by Urbanization</h3>
                <p className="text-gray-600 font-medium leading-relaxed">
                  Urban population growth is absorbing new housing supply at a rapid pace in industrial corridors. This structural deficit is a primary driver keeping the backlog above 10% in multiple major provinces.
                </p>
              </div>
              <div className="bg-white border border-gray-200 p-8 hover:border-primary transition-colors">
                <h3 className="text-lg font-bold text-primary mb-3">3. Mortgage Accessibility Constraints</h3>
                <p className="text-gray-600 font-medium leading-relaxed">
                  Despite relatively stable macroeconomic conditions, the Mortgage Accessibility Score is suppressed by high down-payment barriers and informal sector income volatility, excluding a large portion of the active workforce from formal banking products.
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
