import Link from 'next/link';
import { Download, ArrowRight } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full flex flex-col font-sans border-b border-gray-200">
      {/* Top Utility Bar (White with blue text) */}
      <div className="h-24 bg-white flex items-center justify-between px-6 xl:px-12">
        <div className="flex items-center space-x-5">
          <div className="w-14 h-14 bg-primary flex items-center justify-center font-bold text-2xl text-white tracking-widest">
            IA
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-2xl leading-tight tracking-tight text-primary">Indonesia Affordable Housing Intelligence</span>
            <span className="text-[12px] text-gray-500 uppercase tracking-widest mt-1">Ministry of Public Works and Housing</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-10 text-sm">
          <div className="flex flex-col">
            <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">Region</span>
            <select className="bg-transparent text-gray-900 font-bold focus:outline-none appearance-none cursor-pointer border-b-2 border-gray-200 hover:border-primary transition-colors pb-1 pr-4">
              <option>All Provinces</option>
              <option>DKI Jakarta</option>
              <option>Jawa Barat</option>
            </select>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">Year</span>
            <select className="bg-transparent text-gray-900 font-bold focus:outline-none appearance-none cursor-pointer border-b-2 border-gray-200 hover:border-primary transition-colors pb-1 pr-4">
              <option>2026</option>
              <option>2025</option>
            </select>
          </div>
          
          <button className="group flex items-center space-x-2 bg-primary text-white px-8 py-3.5 font-bold text-[13px] uppercase tracking-widest overflow-hidden relative">
            <span className="relative z-10 transition-transform duration-300 group-hover:-translate-x-1">Export Report</span>
            <ArrowRight size={16} className="relative z-10 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
            <div className="absolute inset-0 bg-[#003B5C] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="h-14 bg-gray-50 border-t border-gray-200 px-6 xl:px-12 flex items-center">
        <nav className="flex items-center space-x-10 text-[13px] font-bold text-gray-600 uppercase tracking-widest w-full overflow-x-auto">
          {[
            { name: 'Overview', path: '/' },
            { name: 'Housing Market', path: '/dashboard/housing-market' },
            { name: 'Regional Analysis', path: '/dashboard/regional-analysis' },
            { name: 'Housing Drivers', path: '/dashboard/housing-drivers' },
            { name: 'Policy Insights', path: '/dashboard/policy-insights' },
          ].map((item) => (
            <Link key={item.name} href={item.path} className={`relative group py-4 overflow-hidden ${item.path === '/' ? 'text-primary' : ''}`}>
              <span className="group-hover:text-primary transition-colors">{item.name}</span>
              <div className={`absolute bottom-0 left-0 w-full h-[3px] bg-primary transition-transform duration-300 ease-out ${item.path === '/' ? 'translate-x-0' : '-translate-x-[105%] group-hover:translate-x-0'}`}></div>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
