import { Users, Wifi, Tag, TrendingUp, TrendingDown } from "lucide-react"

import { MetricCard } from "@/components/Metrics/section-cards"
import { DashboardHeader } from "@/components/dashboard-header"
import { LeadsByCompanyChart } from "@/components/charts/leads-by-company-chart"
import { LeadsByTagChart } from "@/components/charts/leads-by-tag-chart"
import { LeadsByEmulatorChart } from "@/components/charts/leads-by-emulator-chart"
import { EmulatorStatusChart } from "@/components/charts/emulator-status-chart"
import { TagProportionChart } from "@/components/charts/tag-proportion-chart"
import { LeadsOverTimeChart } from "@/components/charts/leads-over-time-chart"
import { LeadUpdatesChart } from "@/components/charts/lead-updates-chart"
import { LeadsTable } from "@/components/tables/leads-table"
import { EmulatorsTable } from "@/components/tables/emulators-table"
import { TagsTable } from "@/components/tables/tags-table"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-full">
          {/* Header fixo e responsivo */}
          <div className="w-full">
            <DashboardHeader />
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
                title="Total de Emuladores"
                value="100"
                description="Emuladores registrados"
                icon={<Wifi className="h-4 w-4 text-muted-foreground" />}
                className="min-w-0"
              />
              <MetricCard
                title="Emuladores Conectados"
                value="75"
                description="75% do total"
                icon={<Wifi className="h-4 w-4 text-green-500" />}
                className="min-w-0"
              />
              <MetricCard
                title="Emuladores Desconectados"
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
                <LeadsByCompanyChart />
              </div>
              <div className="w-full">
                <LeadsByTagChart />
              </div>
              <div className="w-full">
                <LeadsByEmulatorChart />
              </div>
              <div className="w-full">
                <EmulatorStatusChart />
              </div>
              <div className="w-full">
                <TagProportionChart />
              </div>
              <div className="w-full md:col-span-2 lg:col-span-1 xl:col-span-1">
                <LeadUpdatesChart />
              </div>
            </div>
          </div>

          {/* Gráfico de leads ao longo do tempo - largura completa */}
          <div className="w-full">
            <LeadsOverTimeChart />
          </div>

          {/* Tabelas Complementares */}
          <div className="w-full">
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
          </div>
        </div>
      </div>
    </div>
  )
}