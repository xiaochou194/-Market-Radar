import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

interface MiniChartProps {
  data: number[];
  color: string;
}

export const MiniChart: React.FC<MiniChartProps> = ({ data, color }) => {
  const chartData = data.map((val, idx) => ({ i: idx, val }));
  
  // Calculate simple domain to make the chart look dynamic
  const min = Math.min(...data);
  const max = Math.max(...data);
  const padding = (max - min) * 0.1;

  return (
    <div className="h-10 w-20">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <YAxis domain={[min - padding, max + padding]} hide />
          <Line 
            type="monotone" 
            dataKey="val" 
            stroke={color} 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={false} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
