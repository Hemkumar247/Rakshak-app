"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
  { crop: "Corn", lastMonth: 1800, thisMonth: 1850 },
  { crop: "Soybeans", lastMonth: 3800, thisMonth: 3750 },
  { crop: "Wheat", lastMonth: 2100, thisMonth: 2200 },
  { crop: "Cotton", lastMonth: 7500, thisMonth: 7400 },
]

const chartConfig = {
  lastMonth: {
    label: "Last Month",
    color: "hsl(var(--primary))",
  },
  thisMonth: {
    label: "This Month",
    color: "hsl(var(--accent))",
  },
}

export function MarketTrendsChart() {
  const { t } = useLanguage();
  return (
    <Card className="shadow-lg border-white/40">
      <CardHeader>
        <CardTitle className="font-headline">{t('marketTrendsChart')}</CardTitle>
        <CardDescription>Price Comparison</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="crop"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="lastMonth" fill="var(--color-lastMonth)" radius={4} />
            <Bar dataKey="thisMonth" fill="var(--color-thisMonth)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
