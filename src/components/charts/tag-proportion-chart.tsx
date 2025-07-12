"use client"

import { Pie, PieChart } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const chartData = [
  { tag: "Marketing", value: 40, fill: "hsl(var(--chart-1))" },
  { tag: "Vendas", value: 30, fill: "hsl(var(--chart-2))" },
  { tag: "Suporte", value: 20, fill: "hsl(var(--chart-3))" },
  { tag: "Outros", value: 10, fill: "hsl(var(--chart-4))" },
]

const chartConfig = {
  value: {
    label: "Proporção",
  },
  Marketing: {
    label: "Marketing",
    color: "hsl(var(--chart-1))",
  },
  Vendas: {
    label: "Vendas",
    color: "hsl(var(--chart-2))",
  },
  Suporte: {
    label: "Suporte",
    color: "hsl(var(--chart-3))",
  },
  Outros: {
    label: "Outros",
    color: "hsl(var(--chart-4))",
  },
} as const

export function TagProportionChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Proporção de Tags em Leads</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="value" nameKey="tag" innerRadius={60} strokeWidth={5} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
