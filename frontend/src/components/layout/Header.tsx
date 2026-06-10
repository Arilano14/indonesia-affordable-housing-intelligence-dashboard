"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, ChevronDown, MapPin, Calendar, Menu, X, Search, Globe } from 'lucide-react';

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
  const [regionOpen, setRegionOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("All Provinces");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Mega menu state
  const [activeGroup, setActiveGroup] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const regionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Use headerRef to keep mega menu open if clicked inside it
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setRegionOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter provinces based on search query or active group
  const filteredProvinces = PROVINCES.filter(p => {
    if (searchQuery) {
      return p.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (activeGroup === "All") return true;
    const group = GROUPS.find(g => g.label === activeGroup);
    return group ? group.regex.test(p) : true;
  });

  return (
    <header ref={headerRef} className="w-full flex flex-col font-sans border-b border-gray-200 sticky top-0 z-50 bg-[#F4F4F4] relative">
      {/* Top Utility Bar */}
      <div className="h-auto md:h-24 bg-[#F4F4F4] flex flex-col md:flex-row items-center justify-between px-6 xl:px-12 py-4 md:py-0">
        
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center space-x-4 md:space-x-5">
            <img src="/logo.png" alt="IAHID Logo" className="h-10 md:h-12 w-auto object-contain shrink-0" />
            <div className="flex flex-col">
              <span className="font-bold text-lg md:text-2xl leading-tight tracking-tight text-[#111827] line-clamp-1">Indonesia Affordable Housing Intelligence</span>
              <span className="text-[10px] md:text-[12px] text-gray-500 uppercase tracking-widest mt-0.5 md:mt-1">Ministry of Public Works and Housing</span>
            </div>
          </div>
          <button className="md:hidden text-primary" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        
        <div className={`flex flex-col md:flex-row items-stretch md:items-center w-full md:w-auto mt-6 md:mt-0 space-y-6 md:space-y-0 text-sm ${mobileMenuOpen ? 'flex' : 'hidden md:flex'}`}>
          
          {/* Mega Menu Trigger */}
          <div className="relative flex flex-col z-20">
            <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1"><MapPin size={12}/> Region</span>
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                setRegionOpen(!regionOpen); 
              }}
              className={`flex items-center justify-between min-w-[200px] bg-transparent text-gray-900 font-bold focus:outline-none cursor-pointer border-b-2 hover:border-primary transition-colors pb-1 group ${regionOpen ? 'border-primary' : 'border-gray-200'}`}
            >
              <span className="truncate max-w-[180px] text-left">{selectedRegion}</span>
              <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${regionOpen ? 'rotate-180 text-primary' : ''}`} />
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

      {/* Global Dimmer Overlay */}
      <div 
        className={`absolute top-full left-0 w-full h-[100vh] bg-[#001730]/40 backdrop-blur-sm transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${regionOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none hidden'}`}
        onClick={() => { setRegionOpen(false); }}
        style={{ zIndex: 40 }}
      />

      {/* Mega Menu Full Width Overlay */}
      <div 
        className={`absolute top-full left-0 w-full bg-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] border-t border-gray-200 z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top ${regionOpen ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none hidden'}`}
      >
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row h-auto md:h-[450px]">
          
          {/* Left Sidebar (Mega Menu) */}
          <div className="w-full md:w-[320px] flex-shrink-0 border-r border-gray-200 bg-gray-50/50 p-8 flex flex-col">
            {/* Search */}
            <div className="relative mb-8">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search Province" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if(e.target.value) setActiveGroup("All");
                }}
                className="w-full bg-white border border-gray-200 rounded-sm py-3 pl-12 pr-4 text-[13px] font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            
            {/* Groups */}
            <div className="flex flex-col space-y-1 overflow-y-auto custom-scrollbar flex-1 pr-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-4">Provinces A - Z</span>
              {GROUPS.map(g => (
                <button
                  key={g.label}
                  onClick={(e) => { e.stopPropagation(); setActiveGroup(g.label); setSearchQuery(""); }}
                  className={`text-left px-4 py-2.5 text-[13px] font-bold tracking-wide rounded-sm transition-colors ${activeGroup === g.label && !searchQuery ? 'text-primary bg-white shadow-sm border border-gray-100' : 'text-primary hover:bg-gray-100 border border-transparent'}`}
                >
                  {g.label}
                </button>
              ))}
              
              <div className="my-4 border-t border-gray-200 mx-4"></div>
              
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-4">National Engagement</span>
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedRegion("All Provinces"); setRegionOpen(false); }}
                className="text-left px-4 py-2.5 text-[13px] font-bold tracking-wide rounded-sm text-gray-900 hover:bg-gray-100 flex items-center gap-2 transition-colors group"
              >
                Browse all provinces & regions
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center ml-2 group-hover:bg-[#00B3DF] transition-colors">
                  <ArrowRight size={12} className="text-white" />
                </div>
              </button>
            </div>
          </div>

          {/* Right Content (Grid) */}
          <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar bg-white">
            <h3 className="text-[13px] text-gray-500 font-bold mb-8 uppercase tracking-widest">
              {searchQuery ? `Search results for "${searchQuery}"` : activeGroup === "All" ? "All Provinces (Aceh - Papua)" : `Provinces ${activeGroup}`}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
              {filteredProvinces.map(prov => (
                <button
                  key={prov}
                  onClick={(e) => { e.stopPropagation(); setSelectedRegion(prov); setRegionOpen(false); }}
                  className="flex items-center group text-left p-2 -m-2 rounded-sm hover:bg-gray-50 transition-colors"
                >
                  {/* Flag representation (Indonesia colors + outline) */}
                  <div className="w-7 h-5 bg-gray-200 mr-4 flex flex-col justify-center overflow-hidden shadow-sm border border-gray-200 flex-shrink-0 group-hover:border-gray-300 transition-colors">
                    <div className="w-full h-1/2 bg-[#DC2626]"></div>
                    <div className="w-full h-1/2 bg-white"></div>
                  </div>
                  <span className={`text-[14px] font-medium transition-colors line-clamp-1 ${selectedRegion === prov ? 'text-primary font-bold' : 'text-gray-900 group-hover:text-primary'}`}>
                    {prov}
                  </span>
                </button>
              ))}
              {filteredProvinces.length === 0 && (
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Search size={24} className="text-gray-400" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">No provinces found</h4>
                  <p className="text-sm text-gray-500">We couldn't find any provinces matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>

        </div>
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
