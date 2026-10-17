// @ts-nocheck
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type chartData = {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
};

// --- FALLBACK DATA FOR LIVE DEMO ---
const fallbackData: chartData[] = [
  { date: "10:00 AM", positive: 40, negative: 10, neutral: 20 },
  { date: "10:05 AM", positive: 55, negative: 15, neutral: 25 },
  { date: "10:10 AM", positive: 45, negative: 30, neutral: 15 },
  { date: "10:15 AM", positive: 70, negative: 20, neutral: 30 },
  { date: "10:20 AM", positive: 85, negative: 10, neutral: 20 },
  { date: "10:25 AM", positive: 75, negative: 25, neutral: 40 },
];

const chartConfig = {
  positive: {
    label: "Positive",
    color: "#22c55e", // Using proper green hex
  },
  negative: {
    label: "Negative",
    color: "#ef4444", // Using proper red hex
  },
  neutral: {
    label: "Neutral",
    color: "#94a3b8", // Using proper gray hex
  },
} satisfies ChartConfig;

export function SentimentChart({ 
  data = fallbackData, // <-- Default to fallbackData if prop is empty
  title 
}: { 
  data?: chartData[]; 
  title: string 
}) {
  
  // Use data prop if it has items, otherwise use fallback
  const displayData = data && data.length > 0 ? data : fallbackData;

  return (
    <Card className="mx-4">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{title} Sentiment Trend</CardTitle>
          <CardDescription>
            Real-time LSTM sentiment classification tracking
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full min-w-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayData}>
              <defs>
                <linearGradient id="fillPositive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillNegative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillNeutral" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.toLocaleString()}
              />

              <ChartTooltip
                cursor={true}
                content={<ChartTooltipContent indicator="dot" />}
              />

              <Area
                dataKey="positive"
                type="monotone"
                fill="url(#fillPositive)"
                stroke="#22c55e"
                strokeWidth={2}
                isAnimationActive={true}
              />
              <Area
                dataKey="neutral"
                type="monotone"
                fill="url(#fillNeutral)"
                stroke="#94a3b8"
                strokeWidth={2}
                isAnimationActive={true}
              />
              <Area
                dataKey="negative"
                type="monotone"
                fill="url(#fillNegative)"
                stroke="#ef4444"
                strokeWidth={2}
                isAnimationActive={true}
              />

              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}