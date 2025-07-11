"use client"

import { PolarGrid, PolarAngleAxis, Radar, RadarChart } from "recharts"

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
  { metric: "Nitrogen", value: 85, ideal: 100 },
  { metric: "Phosphorus", value: 70, ideal: 90 },
  { metric: "Potassium", value: 90, ideal: 90 },
  { metric: "pH", value: 68, ideal: 70 }, // pH * 10 for scale
  { metric: "Organic Matter", value: 75, ideal: 80 },
]

const chartConfig = {
  value: {
    label: "Current",
    color: "hsl(var(--primary))",
  },
  ideal: {
    label: "Ideal",
    color: "hsl(var(--accent))",
  },
}

export function SoilDataChart() {
  const { t } = useLanguage();
  return (
    <Card className="shadow-lg border-white/40">
      <CardHeader>
        <CardTitle className="font-headline">{t('soilComposition')}</CardTitle>
        <CardDescription>Current vs. Ideal Levels (%)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <PolarAngleAxis dataKey="metric" />
            <PolarGrid />
            <Radar
              dataKey="value"
              fill="var(--color-value)"
              fillOpacity={0.6}
              stroke="var(--color-value)"
            />
             <Radar
              dataKey="ideal"
              fill="var(--color-ideal)"
              fillOpacity={0.2}
              stroke="var(--color-ideal)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
