"use client"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, LayoutDashboard, TrendingUp } from "lucide-react"
import { ChartBarMultiple } from "@/components/charts/BarChartReport"
import {  ChartAreaLegendReport } from "@/components/charts/ChartAreaReport"


export default function ReportsPage() {




  return (
    <div className="min-h-screen bg-background">
      <div className="w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-full">
       <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Relatórios de Campanhas</h1>
        <p className="text-muted-foreground">Visão geral e métricas detalhadas das suas campanhas.</p>
      </div>

          {/* Cards de Métricas responsivos */}
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
      
            </div>
          </div>

          {/* Gráficos responsivos */}
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-4">
              <div className="w-full">
                <ChartBarMultiple />
              </div>
               <div className="w-full">
                <ChartAreaLegendReport/>
              </div>{/*
              <div className="w-full">
                <ChartAreaLegend />
              </div> */}
          
        </div>
      </div>
    </div> </div> </div>
  )
}
