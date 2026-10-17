// @ts-nocheck
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
    sentiment: "positive" | "negative" | "neutral";
    apple: number;
    samsung: number;
};

// --- FALLBACK DATA FOR BRAND COMPARISON ---
const fallbackData: BarChartData[] = [
    { sentiment: "positive", apple: 85, samsung: 72 },
    { sentiment: "negative", apple: 40, samsung: 35 },
    { sentiment: "neutral", apple: 55, samsung: 60 },
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

export function BarChartComponent({ data = fallbackData }: { data?: BarChartData[] }) {
    
    // Ensure we always have data to show
    const displayData = data && data.length > 0 ? data : fallbackData;

    return (
        <Card className="mx-4">
            <CardHeader>
                <CardTitle>Comparative Brand Analysis</CardTitle>
                <CardDescription>
                    Direct sentiment volume comparison between Apple and Samsung
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[300px] w-full min-w-[300px]"
                >
                    <BarChart accessibilityLayer data={displayData} margin={{ left: 12, right: 12 }}>
                        <defs>
                            <linearGradient id="fillRed" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.2} />
                            </linearGradient>
                            <linearGradient id="fillBlue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.2} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                        <XAxis
                            dataKey="sentiment"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => value.toLocaleString()}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar 
                            dataKey="apple" 
                            fill="url(#fillRed)" 
                            radius={[4, 4, 0, 0]} 
                            barSize={40}
                            isAnimationActive={true}
                        />
                        <Bar 
                            dataKey="samsung" 
                            fill="url(#fillBlue)" 
                            radius={[4, 4, 0, 0]} 
                            barSize={40}
                            isAnimationActive={true}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}