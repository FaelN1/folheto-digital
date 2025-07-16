"use client"

import { ChartBarMultiple } from "@/components/charts/BarChartReport"
import {  ChartAreaLegendReport } from "@/components/charts/ChartAreaReport"
import { Code } from "lucide-react"


export default function ReportsPage() {




  return (
    
    <div className="min-h-screen bg-background">
      <div className="w-full relative">
        {/* Overlay de desenvolvimento */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 50,
            background: "rgba(255,255,255,0.97)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-blue-400 flex items-center justify-center gap-2">
            <span><Code className="inline h-6 w-6 text-blue-400" /></span>
            Em Desenvolvimento
          </h2>
            <p className="text-lg text-gray-700">
              Esta tela está em construção.<br />
              Em breve você poderá visualizar relatórios completos aqui!
            </p>
          </div>
        </div>
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
