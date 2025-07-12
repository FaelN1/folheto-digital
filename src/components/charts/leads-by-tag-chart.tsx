"use client"

import { Pie, PieChart } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const chartData = [
  { tag: "Marketing", leads: 543, fill: "hsl(var(--chart-1))" },
  { tag: "Vendas", leads: 321, fill: "hsl(var(--chart-2))" },
  { tag: "Suporte", leads: 123, fill: "hsl(var(--chart-3))" },
  { tag: "Produto", leads: 87, fill: "hsl(var(--chart-4))" },
]

const chartConfig = {
  leads: {
    label: "Leads",
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
  Produto: {
    label: "Produto",
    color: "hsl(var(--chart-4))",
  },
} as const

export function LeadsByTagChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Leads por Tag</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="leads" nameKey="tag" innerRadius={60} strokeWidth={5} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
