"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { Tooltip } from 'react-tooltip';

const geoUrl = "/data/indonesia-38-provinces.topo.json";

// Define the metrics we want to display
interface ProvinceData {
  province: string;
  score: number; // Housing Intelligence Score
  mortgage: number; // Mortgage Accessibility Index
  demand: number; // Housing Demand Index
}

interface ChoroplethMapProps {
  data: ProvinceData[];
}

export default function ChoroplethMap({ data }: ChoroplethMapProps) {
  const [tooltipContent, setTooltipContent] = useState<React.ReactNode>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Create a dictionary for O(1) lookups
  const dataDict = useMemo(() => {
    const dict: Record<string, ProvinceData> = {};
    data.forEach(d => {
      // Handle the DI Yogyakarta naming difference
      const key = d.province === "DI Yogyakarta" ? "Daerah Istimewa Yogyakarta" : d.province;
      dict[key] = d;
    });
    return dict;
  }, [data]);

  // Determine min and max scores for color scaling
  const validScores = data.map(d => d.score).filter(s => s != null);
  const minScore = validScores.length > 0 ? Math.min(...validScores) : 0;
  const maxScore = validScores.length > 0 ? Math.max(...validScores) : 100;

  // Create a color scale (Red to Green based on score)
  // Low score = #DC2626 (Red), Mid = #FBBF24 (Yellow), High = #10B981 (Green)
  const colorScale = scaleLinear<string>()
    .domain([minScore, (minScore + maxScore) / 2, maxScore])
    .range(["#ef4444", "#fcd34d", "#10b981"]);

  if (!mounted) return <div className="w-full h-[500px] bg-gray-50 animate-pulse rounded-lg border border-gray-200"></div>;

  return (
    <div className="relative w-full h-[500px] bg-[#f8fafc] rounded-lg border border-gray-200 overflow-hidden">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1300,
          center: [118, -2.5]
        }}
        width={800}
        height={500}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup center={[118, -2.5]} zoom={1} minZoom={1} maxZoom={4}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const provinceName = geo.properties.PROVINSI;
                const provinceData = dataDict[provinceName];
                const score = provinceData ? provinceData.score : null;
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={score ? colorScale(score) : "#e2e8f0"}
                    stroke="#ffffff"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: "#0ea5e9", cursor: "pointer" },
                      pressed: { outline: "none", fill: "#0284c7" },
                    }}
                    onMouseEnter={() => {
                      if (provinceData) {
                        setTooltipContent(
                          <div className="flex flex-col gap-1 p-1">
                            <span className="font-bold text-sm border-b border-gray-600 pb-1 mb-1">{provinceData.province}</span>
                            <div className="flex justify-between gap-4 text-xs">
                              <span className="text-gray-300">Housing Score:</span>
                              <span className="font-bold text-white">{provinceData.score != null ? provinceData.score.toFixed(2) : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between gap-4 text-xs">
                              <span className="text-gray-300">Mortgage Access:</span>
                              <span className="font-bold text-white">{provinceData.mortgage != null ? provinceData.mortgage.toFixed(2) : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between gap-4 text-xs">
                              <span className="text-gray-300">Demand Index:</span>
                              <span className="font-bold text-white">{provinceData.demand != null ? provinceData.demand.toFixed(2) : 'N/A'}</span>
                            </div>
                          </div>
                        );
                      } else {
                        setTooltipContent(`${provinceName} (No Data)`);
                      }
                    }}
                    onMouseLeave={() => {
                      setTooltipContent("");
                    }}
                    data-tooltip-id="my-tooltip"
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      
      <Tooltip 
        id="my-tooltip" 
        style={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '4px', zIndex: 100 }}
      >
        {tooltipContent}
      </Tooltip>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded shadow-sm border border-gray-200 text-xs">
        <div className="font-bold mb-2">Housing Intelligence Score</div>
        <div className="flex items-center gap-2">
          <div className="flex w-32 h-3 rounded overflow-hidden">
            <div className="flex-1 bg-red-500"></div>
            <div className="flex-1 bg-yellow-400"></div>
            <div className="flex-1 bg-emerald-500"></div>
          </div>
        </div>
        <div className="flex justify-between mt-1 text-gray-500 font-medium">
          <span>{minScore.toFixed(0)}</span>
          <span>{maxScore.toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
}
