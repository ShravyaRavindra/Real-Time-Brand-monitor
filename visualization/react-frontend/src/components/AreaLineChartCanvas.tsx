/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// --- FALLBACK DATA FOR THE CANVAS ---
const defaultData = [
  { name: "01", value: 10 },
  { name: "02", value: 25 },
  { name: "03", value: 15 },
  { name: "04", value: 45 },
  { name: "05", value: 30 },
  { name: "06", value: 55 },
];

export const AreaLineChartCanvas = ({ 
  data = defaultData, 
  color = "#8884d8" 
}: { 
  data?: any; 
  color?: string 
}) => {

  // Use provided data if it exists and isn't empty, otherwise use default
  const chartDisplayData = data && data.length > 0 ? data : defaultData;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartDisplayData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="colorCanvas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
        <XAxis 
          dataKey="name" 
          hide={false} 
          tick={{fontSize: 12}} 
          tickLine={false} 
          axisLine={false}
        />
        <YAxis 
          hide={false} 
          tick={{fontSize: 12}} 
          tickLine={false} 
          axisLine={false}
        />
        <Tooltip 
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          fill="url(#colorCanvas)" 
          strokeWidth={2}
          isAnimationActive={true}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};