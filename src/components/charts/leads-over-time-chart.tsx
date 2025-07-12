"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const chartData = [
  { date: "Jan", leads: 120 },
  { date: "Fev", leads: 150 },
  { date: "Mar", leads: 130 },
  { date: "Abr", leads: 180 },
  { date: "Mai", leads: 200 },
  { date: "Jun", leads: 190 },
  { date: "Jul", leads: 220 },
]

const chartConfig = {
  leads: {
    label: "Leads Criados",
    color: "hsl(var(--chart-1))",
  },
  date: {
    label: "Mês",
  },
} as const

export function LeadsOverTimeChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads Criados por Mês</CardTitle>
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
            <YAxis dataKey="leads" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line dataKey="leads" type="monotone" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
