// @ts-nocheck
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type BarChartData = {
    topic: string;
    count: number;
};

// --- FALLBACK DATA BY COMPANY ---
const appleFallback: BarChartData[] = [
  { topic: "Camera Quality", count: 85 },
  { topic: "Battery Life", count: 62 },
  { topic: "Eco-system", count: 94 },
  { topic: "Build Design", count: 78 },
  { topic: "Price Point", count: 45 },
];

const samsungFallback: BarChartData[] = [
  { topic: "Display Tech", count: 92 },
  { topic: "S-Pen Logic", count: 58 },
  { topic: "Multitasking", count: 75 },
  { topic: "OS Updates", count: 40 },
  { topic: "Zoom Camera", count: 88 },
];

const chartConfig = {
  apple: {
    label: "Apple",
    color: "#EF4444",
  },
  samsung: {
    label: "Samsung",
    color: "#3B82F6",
  },
} satisfies ChartConfig;

export function TopicBarChartComponent({ 
  data, 
  sentiment, 
  company 
}: { 
  data?: BarChartData[], 
  sentiment: string, 
  company: "Apple" | "Samsung" 
}) {

  // Select the correct fallback based on the company prop
  const activeFallback = company === "Apple" ? appleFallback : samsungFallback;
  const displayData = data && data.length > 0 ? data : activeFallback;

  return (
    <Card className="flex flex-col w-full">
      <CardHeader>
        <CardTitle>{company} Topic Analysis</CardTitle>
        <CardDescription>
          Specific {sentiment} sentiment distribution for {company} products
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-full max-h-[350px]"
        >
          <BarChart
            accessibilityLayer
            data={displayData}
            layout="horizontal"
            margin={{ left: 0, right: 0, top: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient id="fillRed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="fillGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
            
            <YAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <XAxis
              dataKey="topic"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              fontSize={12}
              tickFormatter={(value) => value.length > 12 ? `${value.slice(0, 10)}...` : value}
            />
            
            <ChartTooltip
              cursor={{ fill: 'transparent' }}
              content={<ChartTooltipContent hideLabel />}
            />
            
            <Bar
              dataKey="count"
              fill={sentiment === "positive" ? "url(#fillGreen)" : "url(#fillRed)"}
              radius={[4, 4, 0, 0]}
              barSize={45}
              isAnimationActive={true}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}