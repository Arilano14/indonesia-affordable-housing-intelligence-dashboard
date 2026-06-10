"use client";

import React, { memo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";

const geoUrl = "https://raw.githubusercontent.com/superpikar/indonesia-geojson/master/indonesia-province-simple.json";

interface MapProps {
  data: {
    province: string;
    score: number;
  }[];
  meanScore?: number;
}

const ChoroplethMap = ({ data, meanScore = 60 }: MapProps) => {
  const [tooltip, setTooltip] = useState({ content: "", x: 0, y: 0, visible: false });

  // Dynamic mean-based color scale
  const colorScale = scaleLinear<string>()
    .domain([meanScore - 10, meanScore, meanScore + 10])
    .range(["#DC2626", "#FBBF24", "#16A34A"]);

  const handleMouseEnter = (geoName: string, score: number, e: React.MouseEvent) => {
    setTooltip({
      content: `${geoName} - Score: ${score > 0 ? score.toFixed(1) : "N/A"}`,
      x: e.clientX,
      y: e.clientY,
      visible: true
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (tooltip.visible) {
      setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
    }
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  return (
    <div className="w-full h-[400px] bg-white relative">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 1200, center: [118, -2] }}
        width={800} height={400}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup center={[118, -2]} zoom={1}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const provinceName = geo.properties.Propinsi || geo.properties.name || "";
                let geoName = provinceName.toLowerCase();
                
                // Fix geojson typos (e.g., "nusatenggara barat")
                if (geoName.includes("nusatenggara")) {
                  geoName = geoName.replace("nusatenggara", "nusa tenggara");
                }
                
                let finalScore = 0;
                let displayName = provinceName;

                // Handle old GeoJSON "Papua/Irian" names to map to all new Papua provinces
                if (geoName.includes("papua") || geoName.includes("irian")) {
                  const papuaProvinces = data.filter(d => d.province.toLowerCase().includes("papua"));
                  if (papuaProvinces.length > 0) {
                    finalScore = papuaProvinces.reduce((acc, p) => acc + p.score, 0) / papuaProvinces.length;
                  }
                  displayName = "Papua Region";
                } else {
                  // Normal match
                  const match = data.find(d => {
                    const dbName = d.province.toLowerCase().replace("di ", "d.i. ");
                    return geoName.includes(dbName) || dbName.includes(geoName);
                  });
                  if (match) finalScore = match.score;
                }

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={finalScore > 0 ? colorScale(finalScore) : "#F3F4F6"}
                    stroke="#FFFFFF"
                    strokeWidth={0.5}
                    onMouseEnter={(e) => handleMouseEnter(displayName, finalScore, e)}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#00B3DF", outline: "none", cursor: "pointer" },
                      pressed: { fill: "#003B5C", outline: "none" }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 p-4 border border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-widest">
        <div className="mb-2">Score Legend vs Avg ({meanScore.toFixed(1)})</div>
        <div className="flex items-center space-x-2">
          <div className="flex flex-col space-y-1">
            <div className="w-4 h-4 bg-[#16A34A]"></div>
            <div className="w-4 h-4 bg-[#FBBF24]"></div>
            <div className="w-4 h-4 bg-[#DC2626]"></div>
          </div>
          <div className="flex flex-col justify-between h-[52px] py-0">
            <span>Good (&gt;Avg)</span>
            <span>Avg ({meanScore.toFixed(1)})</span>
            <span>Poor (&lt;Avg)</span>
          </div>
        </div>
      </div>

      {/* Floating Tooltip */}
      {tooltip.visible && (
        <div 
          className="fixed z-50 bg-gray-900 text-white px-3 py-2 rounded text-sm font-bold shadow-lg pointer-events-none"
          style={{ left: tooltip.x + 15, top: tooltip.y + 15 }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default memo(ChoroplethMap);
