"use client";

import React, { memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";

// Using a public TopoJSON file for Indonesia provinces
const geoUrl = "https://raw.githubusercontent.com/superpikar/indonesia-geojson/master/indonesia-province-simple.json";

// We scale from light blue to dark OECD blue
const colorScale = scaleLinear<string>()
  .domain([40, 100])
  .range(["#E5E7EB", "#005587"]);

interface MapProps {
  data: {
    province: string;
    score: number;
  }[];
}

const ChoroplethMap = ({ data }: MapProps) => {
  return (
    <div className="w-full h-[400px] bg-white relative">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1200,
          center: [118, -2]
        }}
        width={800}
        height={400}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup center={[118, -2]} zoom={1}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const provinceName = geo.properties.Propinsi || geo.properties.name || "";
                
                // Try to match the province name from our data
                const match = data.find((d) => {
                  const dbName = d.province.toLowerCase();
                  const geoName = provinceName.toLowerCase();
                  return geoName.includes(dbName) || dbName.includes(geoName);
                });

                const score = match ? match.score : 0;
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={match ? colorScale(score) : "#F3F4F6"}
                    stroke="#FFFFFF"
                    strokeWidth={0.5}
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
        <div className="mb-2">Score Legend</div>
        <div className="flex items-center space-x-2">
          <div className="flex flex-col space-y-1">
            <div className="w-4 h-4 bg-[#005587]"></div>
            <div className="w-4 h-4 bg-[#337a9f]"></div>
            <div className="w-4 h-4 bg-[#7ab0c6]"></div>
            <div className="w-4 h-4 bg-[#E5E7EB]"></div>
          </div>
          <div className="flex flex-col justify-between h-20 py-1">
            <span>Excellent (80+)</span>
            <span>Moderate (60+)</span>
            <span>Warning (&lt;60)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ChoroplethMap);
