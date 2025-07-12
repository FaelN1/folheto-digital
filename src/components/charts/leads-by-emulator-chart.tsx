"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const chartData = [
  { emulator: "Emulador 1", leads: 450 },
  { emulator: "Emulador 2", leads: 320 },
  { emulator: "Emulador 3", leads: 280 },
  { emulator: "Emulador 4", leads: 150 },
]

const chartConfig = {
  leads: {
    label: "Leads",
    color: "hsl(var(--chart-2))",
  },
  emulator: {
    label: "Emulador",
  },
} as const

export function LeadsByEmulatorChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads por Emulador</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="emulator"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.replace("Emulador ", "E")}
            />
            <YAxis dataKey="leads" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="leads" fill="hsl(var(--chart-2))" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
