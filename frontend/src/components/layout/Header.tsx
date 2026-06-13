"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, ChevronDown, MapPin, Calendar, Menu, X, Search, Globe } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';

const PROVINCES = [
  "Aceh", "Bali", "Banten", "Bengkulu",
  "DI Yogyakarta", "DKI Jakarta", "Gorontalo",
  "Jambi", "Jawa Barat", "Jawa Tengah", "Jawa Timur", 
  "Kalimantan Barat", "Kalimantan Selatan", "Kalimantan Tengah", "Kalimantan Timur", "Kalimantan Utara",
  "Kepulauan Bangka Belitung", "Kepulauan Riau", "Lampung", "Maluku", "Maluku Utara",
  "Nusa Tenggara Barat", "Nusa Tenggara Timur", 
  "Papua", "Papua Barat", "Papua Barat Daya", "Papua Pegunungan", "Papua Selatan", "Papua Tengah", "Riau",
  "Sulawesi Barat", "Sulawesi Selatan", "Sulawesi Tengah", "Sulawesi Tenggara", "Sulawesi Utara", 
  "Sumatera Barat", "Sumatera Selatan", "Sumatera Utara"
];

const GROUPS = [
  { label: "A - C", regex: /^[A-C]/i },
  { label: "D - I", regex: /^[D-I]/i },
  { label: "J - M", regex: /^[J-M]/i },
  { label: "N - R", regex: /^[N-R]/i },
  { label: "S - Z", regex: /^[S-Z]/i }
];

const NAV_ITEMS = [
  { name: 'Overview', path: '/' },
  { name: 'Housing Market', path: '/dashboard/housing-market' },
  { name: 'Regional Analysis', path: '/dashboard/regional-analysis' },
  { name: 'Housing Drivers', path: '/dashboard/housing-drivers' },
  { name: 'Policy Insights', path: '/dashboard/policy-insights' },
  { name: 'Research Findings', path: '/dashboard/research' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const { lang, setLang } = useLanguage();

  return (
    <header ref={headerRef} className="w-full flex flex-col font-sans border-b border-gray-200 sticky top-0 z-50 bg-[#F4F4F4] relative">
      {/* Top Utility Bar */}
      <div className="h-auto md:h-24 bg-[#F4F4F4] flex flex-col md:flex-row items-center justify-between px-6 xl:px-12 py-4 md:py-0 w-full overflow-hidden">
        
        <div className="flex items-center justify-between w-full md:w-auto min-w-0">
          <div className="flex items-center space-x-4 md:space-x-5 min-w-0">
            <img src="/logo.png" alt="IAHID Logo" className="h-10 md:h-12 w-auto object-contain shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-lg md:text-2xl leading-tight tracking-tight text-[#111827] truncate">Indonesia Affordable Housing Intelligence</span>
              <span className="text-[10px] md:text-[12px] text-gray-500 uppercase tracking-widest mt-0.5 md:mt-1 truncate">Ministry of Public Works and Housing</span>
            </div>
          </div>
          <button className="md:hidden text-primary shrink-0 ml-4" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Language Toggle */}
        <div className="hidden md:flex items-center gap-2 bg-white px-2 py-1 border border-gray-200 rounded shadow-sm shrink-0 ml-8">
          <button 
            onClick={() => setLang('en')}
            className={`px-2 py-1 text-xs font-bold font-sans ${lang === 'en' ? 'bg-black text-white' : 'bg-transparent text-gray-500 hover:text-black'} transition-colors rounded`}
          >
            EN
          </button>
          <span className="text-gray-300">|</span>
          <button 
            onClick={() => setLang('id')}
            className={`px-2 py-1 text-xs font-bold font-sans ${lang === 'id' ? 'bg-black text-white' : 'bg-transparent text-gray-500 hover:text-black'} transition-colors rounded`}
          >
            IND
          </button>
        </div>

        {/* Mobile Language Toggle */}
        <div className={`w-full flex justify-end mt-4 md:hidden transition-all ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="flex items-center gap-2 bg-white px-2 py-1 border border-gray-200 rounded shadow-sm">
            <button 
              onClick={() => setLang('en')}
              className={`px-2 py-1 text-xs font-bold font-sans ${lang === 'en' ? 'bg-black text-white' : 'bg-transparent text-gray-500 hover:text-black'} transition-colors rounded`}
            >
              EN
            </button>
            <span className="text-gray-300">|</span>
            <button 
              onClick={() => setLang('id')}
              className={`px-2 py-1 text-xs font-bold font-sans ${lang === 'id' ? 'bg-black text-white' : 'bg-transparent text-gray-500 hover:text-black'} transition-colors rounded`}
            >
              IND
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className={`bg-[#F4F4F4] px-6 xl:px-12 flex flex-col md:flex-row items-center md:h-14 transition-all duration-300 ${mobileMenuOpen ? 'flex py-4' : 'hidden md:flex'}`}>
        <nav className="flex flex-col md:flex-row items-start md:items-center md:space-x-8 text-[14px] font-bold text-[#111827] w-full md:overflow-x-auto custom-scrollbar">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.name} href={item.path} onClick={() => setMobileMenuOpen(false)} className={`relative group py-4 md:py-4 w-full md:w-auto overflow-hidden whitespace-nowrap transition-colors duration-300 ${isActive ? 'text-primary' : ''}`}>
                <span className={`transition-all duration-300 ${isActive ? 'translate-x-2 md:translate-x-0 inline-block text-primary' : 'group-hover:text-primary'}`}>{item.name}</span>
                {/* Active Indicator Animation */}
                <div className={`absolute bottom-0 left-0 w-full h-[3px] bg-primary transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive ? 'translate-x-0' : '-translate-x-[105%] group-hover:translate-x-0'}`}></div>
                
                {/* Subtle active background effect for mobile */}
                {isActive && <div className="absolute inset-0 bg-primary/5 md:hidden -z-10 rounded-sm"></div>}
              </Link>
            )
          })}
        </nav>
      </div>
      
      {/* Global CSS for Custom Scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db; 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af; 
        }
      `}} />
    </header>
  );
}
