"use client"

import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, Legend, ComposedChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { useLanguage } from "@/lib/i18n"

const chartData = [
  { month: "January", temperature: 7, precipitation: 40 },
  { month: "February", temperature: 8, precipitation: 30 },
  { month: "March", temperature: 12, precipitation: 50 },
  { month: "April", temperature: 17, precipitation: 60 },
  { month: "May", temperature: 22, precipitation: 40 },
  { month: "June", temperature: 28, precipitation: 20 },
]

const chartConfig = {
  temperature: {
    label: "Temperature (°C)",
    color: "hsl(var(--accent))",
  },
  precipitation: {
    label: "Precipitation (mm)",
    color: "hsl(var(--primary))",
  },
}

export function WeatherHistoryChart() {
  const { t } = useLanguage();
  return (
    <Card className="shadow-lg border-white/40">
      <CardHeader>
        <CardTitle className="font-headline">{t('weatherHistory')}</CardTitle>
        <CardDescription>Last 6 Months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <ComposedChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend content={<ChartLegendContent />} />
                <Bar dataKey="precipitation" yAxisId="left" fill="hsl(var(--primary))" radius={4} />
                <Line type="monotone" yAxisId="right" dataKey="temperature" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
            </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
