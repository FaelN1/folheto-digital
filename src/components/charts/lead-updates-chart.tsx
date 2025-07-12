"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const chartData = [
  { date: "Dia 1", updates: 5 },
  { date: "Dia 2", updates: 8 },
  { date: "Dia 3", updates: 6 },
  { date: "Dia 4", updates: 10 },
  { date: "Dia 5", updates: 7 },
  { date: "Dia 6", updates: 12 },
  { date: "Dia 7", updates: 9 },
]

const chartConfig = {
  updates: {
    label: "Atualizações",
    color: "hsl(var(--chart-4))",
  },
  date: {
    label: "Dia",
  },
} as const

export function LeadUpdatesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Atualizações de Leads (Últimos 7 Dias)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis dataKey="updates" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line dataKey="updates" type="monotone" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
