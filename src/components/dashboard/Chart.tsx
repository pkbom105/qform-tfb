"use client";

import React from "react";

interface ChartProps {
  data: number[];
  labels?: string[];
  height?: number;
  color?: string;
  title?: string;
}

const Chart: React.FC<ChartProps> = ({
  data,
  labels,
  height = 200,
  color = "bg-red-600",
  title,
}) => {
  const maxValue = Math.max(...data, 1);
  const defaultLabels = data.map((_, i) => `M${i + 1}`);

  return (
    <div className="w-full">
      {title && (
        <p className="text-sm font-light text-black mb-4">{title}</p>
      )}
      <div className="flex items-end gap-2" style={{ height: `${height}px` }}>
        {data.map((value, index) => {
          const percentage = (value / maxValue) * 100;
          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-1 group"
            >
              <span className="text-[10px] text-slate-400 font-light opacity-0 group-hover:opacity-100 transition-opacity">
                {value.toLocaleString()}
              </span>
              <div
                className="w-full rounded-md transition-all duration-300 hover:opacity-80 cursor-pointer"
                style={{
                  height: `${Math.max(percentage, 4)}%`,
                  backgroundColor: color.includes("bg-")
                    ? undefined
                    : color,
                }}
                title={`${labels?.[index] || defaultLabels[index]}: ${value.toLocaleString()}`}
              >
                <div className={`w-full h-full rounded-md ${color} opacity-90 hover:opacity-100`} />
              </div>
              <span className="text-[9px] text-slate-400 font-light mt-1">
                {labels?.[index] || defaultLabels[index]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Chart;