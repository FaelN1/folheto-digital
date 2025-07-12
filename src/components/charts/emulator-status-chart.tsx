"use client"

import { Pie, PieChart } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const chartData = [
  { status: "Conectado", count: 75, fill: "hsl(var(--chart-1))" },
  { status: "Desconectado", count: 25, fill: "hsl(var(--chart-3))" },
]

const chartConfig = {
  count: {
    label: "Quantidade",
  },
  Conectado: {
    label: "Conectado",
    color: "hsl(var(--chart-1))",
  },
  Desconectado: {
    label: "Desconectado",
    color: "hsl(var(--chart-3))",
  },
} as const

export function EmulatorStatusChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Emuladores por Status</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="count" nameKey="status" innerRadius={60} strokeWidth={5} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
