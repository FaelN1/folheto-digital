"use client";
import React from "react"
import { Users, Wifi, Tag, TrendingUp, TrendingDown } from "lucide-react"

import { MetricCard } from "@/components/Metrics/section-cards"
import { DashboardHeader } from "@/components/dashboard-header"
import { ChartBarDefault } from "@/components/charts/leads-by-company-chart"
import { ChartRadialStacked } from "@/components/charts/leads-by-tag-chart"
import { ChartAreaLegend } from "@/components/charts/leads-by-emulator-chart"


export default function DashboardPage() {
    const companies = ["Company A", "Company B", "Company C"]
  const tags = ["Tag 1", "Tag 2", "Tag 3"]
  const emulators = ["Emulator 1", "Emulator 2", "Emulator 3"]

  const [companyFilter, setCompanyFilter] = React.useState<string | undefined>(undefined)
  const [tagFilter, setTagFilter] = React.useState<string | undefined>(undefined)
  const [emulatorFilter, setEmulatorFilter] = React.useState<string | undefined>(undefined)
  const [date, setDate] = React.useState<{ from?: Date; to?: Date } | undefined>(undefined)

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-full">
          {/* Header fixo e responsivo */}
           <div>
      <DashboardHeader
        companies={companies}
        tags={tags}
        emulators={emulators}
        companyFilter={companyFilter}
        tagFilter={tagFilter}
        emulatorFilter={emulatorFilter}
        setCompanyFilter={setCompanyFilter}
        setTagFilter={setTagFilter}
        setEmulatorFilter={setEmulatorFilter}
        date={date}
        setDate={setDate}
      />
    </div>

          {/* Cards de Métricas responsivos */}
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              <MetricCard
                title="Total de Leads"
                value="1,234"
                description="Total de leads registrados"
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
                className="min-w-0"
              />
              <MetricCard
                title="Novos Leads (Hoje)"
                value="+50"
                description="20% a mais que ontem"
                icon={<TrendingUp className="h-4 w-4 text-green-500" />}
                className="min-w-0"
              />
              <MetricCard
                title="Novos Leads (7 Dias)"
                value="+250"
                description="15% a mais que na semana passada"
                icon={<TrendingUp className="h-4 w-4 text-green-500" />}
                className="min-w-0"
              />
              <MetricCard
                title="Novos Leads (30 Dias)"
                value="+800"
                description="5% a menos que no mês passado"
                icon={<TrendingDown className="h-4 w-4 text-red-500" />}
                className="min-w-0"
              />
              <MetricCard
                title="Total de Canais"
                value="100"
                description="Canais registrados"
                icon={<Wifi className="h-4 w-4 text-muted-foreground" />}
                className="min-w-0"
              />
              <MetricCard
                title="Canais Conectados"
                value="75"
                description="75% do total"
                icon={<Wifi className="h-4 w-4 text-green-500" />}
                className="min-w-0"
              />
              <MetricCard
                title="Canais Desconectados"
                value="25"
                description="25% do total"
                icon={<Wifi className="h-4 w-4 text-red-500" />}
                className="min-w-0"
              />
              <MetricCard
                title="Total de Tags"
                value="15"
                description="Tags únicas em uso"
                icon={<Tag className="h-4 w-4 text-muted-foreground" />}
                className="min-w-0"
              />
            </div>
          </div>

          {/* Gráficos responsivos */}
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
              <div className="w-full">
                <ChartBarDefault />
              </div>
              <div className="w-full">
                <ChartRadialStacked />
              </div>
              <div className="w-full">
                <ChartAreaLegend />
              </div>
              {/* <div className="w-full">
                <ChartPieLabel />
              </div>
              <div className="w-full">
                <TagProportionChart />
              </div>
              <div className="w-full md:col-span-2 lg:col-span-1 xl:col-span-1">
                <LeadUpdatesChart />
              </div> */}
            </div>
          </div>

    

          {/* Tabelas Complementares */}
          {/* <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              <div className="w-full lg:col-span-2 xl:col-span-1">
                <LeadsTable />
              </div>
              <div className="w-full">
                <EmulatorsTable />
              </div>
              <div className="w-full">
                <TagsTable />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}