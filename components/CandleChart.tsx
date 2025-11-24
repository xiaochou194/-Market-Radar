
import React from 'react';
import { ComposedChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { OHLC } from '../types';

interface CandleChartProps {
  data: OHLC[];
}

export const CandleChart: React.FC<CandleChartProps> = ({ data }) => {
  // Transform data for Recharts to render a standard candlestick
  // body: [min(open, close), max(open, close)]
  // wick: [low, high]
  // Colors: Red (#ef4444) for Up (Close >= Open), Green (#22c55e) for Down (Close < Open)
  
  const processedData = data.map(d => ({
    ...d,
    body: [Math.min(d.open, d.close), Math.max(d.open, d.close)],
    wick: [d.low, d.high],
    color: d.close >= d.open ? '#ef4444' : '#22c55e'
  }));
  
  const min = Math.min(...data.map(d => d.low));
  const max = Math.max(...data.map(d => d.high));
  const padding = (max - min) * 0.1;

  // Dynamic bar size based on data density
  // < 10 items (1W) -> fat bars (20px)
  // < 50 items (1M) -> medium bars (8px)
  // > 50 items (1Y) -> thin bars (2px)
  const barSize = data.length < 15 ? 20 : data.length < 60 ? 8 : 2;
  const wickSize = data.length < 60 ? 1.5 : 1;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={processedData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
        <XAxis 
          dataKey="time" 
          tick={{fontSize: 10, fill: '#94a3b8'}} 
          minTickGap={30} 
          axisLine={false} 
          tickLine={false} 
          tickFormatter={(val) => val.slice(5)} // Show MM-DD
        />
        <YAxis 
          domain={[min - padding, max + padding]} 
          tick={{fontSize: 10, fill: '#94a3b8'}} 
          axisLine={false} 
          tickLine={false} 
          width={35}
        />
        <Tooltip 
          cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const d = payload[0].payload;
              const isUp = d.close >= d.open;
              const colorClass = isUp ? 'text-red-500' : 'text-green-500';
              return (
                <div className="bg-white dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700 rounded shadow-lg text-xs font-mono min-w-[120px]">
                  <div className="mb-1 text-slate-500 font-bold">{d.time}</div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                    <span className="text-slate-500">开:</span> <span className={colorClass}>{d.open.toFixed(2)}</span>
                    <span className="text-slate-500">高:</span> <span className={colorClass}>{d.high.toFixed(2)}</span>
                    <span className="text-slate-500">低:</span> <span className={colorClass}>{d.low.toFixed(2)}</span>
                    <span className="text-slate-500">收:</span> <span className={colorClass}>{d.close.toFixed(2)}</span>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        {/* The Wick (represented as a very thin bar spanning Low to High) */}
        {/* We color the wick same as the body for standard professional look */}
        <Bar dataKey="wick" barSize={wickSize}>
          {processedData.map((entry, index) => (
            <Cell key={`cell-wick-${index}`} fill={entry.color} />
          ))}
        </Bar>
        
        {/* The Body (spanning Open to Close) */}
        <Bar dataKey="body" barSize={barSize}>
          {processedData.map((entry, index) => (
            <Cell key={`cell-body-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </ComposedChart>
    </ResponsiveContainer>
  );
};
