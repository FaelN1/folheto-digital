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

// Mock data for campaigns
interface Campaign {
  id: string
  name: string
  segment: string // e.g., "Varejo", "Serviços", "Tecnologia"
  leadsCount: number
  createdAt: string
}

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: "c1", name: "Promoção Verão 2024", segment: "Varejo", leadsCount: 1200, createdAt: "2024-01-10T10:00:00Z" },
  { id: "c2", name: "Lançamento Produto X", segment: "Tecnologia", leadsCount: 850, createdAt: "2024-02-15T11:00:00Z" },
  {
    id: "c3",
    name: "Campanha de Engajamento",
    segment: "Serviços",
    leadsCount: 300,
    createdAt: "2024-03-01T09:00:00Z",
  },
  { id: "c4", name: "Black Friday 2023", segment: "Varejo", leadsCount: 2500, createdAt: "2023-11-20T14:00:00Z" },
  { id: "c5", name: "Webinar Gratuito", segment: "Educação", leadsCount: 600, createdAt: "2024-04-05T16:00:00Z" },
  {
    id: "c6",
    name: "Atualização de Software",
    segment: "Tecnologia",
    leadsCount: 1100,
    createdAt: "2024-05-10T10:30:00Z",
  },
  {
    id: "c7",
    name: "Oferta Especial Clientes",
    segment: "Serviços",
    leadsCount: 450,
    createdAt: "2024-06-01T13:00:00Z",
  },
  { id: "c8", name: "Liquidação de Inverno", segment: "Varejo", leadsCount: 1800, createdAt: "2024-06-15T11:00:00Z" },
  { id: "c9", name: "Curso Online Marketing", segment: "Educação", leadsCount: 720, createdAt: "2024-07-01T09:00:00Z" },
  { id: "c10", name: "Sorteio de Natal", segment: "Varejo", leadsCount: 3000, createdAt: "2023-12-01T10:00:00Z" },
  { id: "c11", name: "Treinamento Avançado", segment: "Educação", leadsCount: 400, createdAt: "2024-07-10T14:00:00Z" },
  { id: "c12", name: "Manutenção Preventiva", segment: "Serviços", leadsCount: 200, createdAt: "2024-07-05T11:00:00Z" },
]

// Nova paleta de cores azuis (claras e fortes)
const CHART_COLORS = [
  "#87CEEB", // Sky Blue
  "#6495ED", // Cornflower Blue
  "#4682B4", // Steel Blue
  "#1E90FF", // Dodger Blue
  "#00BFFF", // Deep Sky Blue
  "#4169E1", // Royal Blue
  "#0000CD", // Medium Blue
  "#00008B", // Dark Blue
  "#000080", // Navy Blue
  "#ADD8E6", // Light Blue
  "#5F9EA0", // Cadet Blue
  "#7B68EE", // Medium Slate Blue
]

export default function ReportsPage() {
  // 1. Total de campanhas feitas
  const totalCampaigns = MOCK_CAMPAIGNS.length

  // 2. Total de leads por campanha (para o gráfico de barras)
  const leadsPerCampaignData = MOCK_CAMPAIGNS.map((campaign) => ({
    name: campaign.name,
    leads: campaign.leadsCount,
  })).sort((a, b) => b.leads - a.leads) // Ordena por leads para melhor visualização

  // 3. Total de campanhas por segmento (para o gráfico de pizza)
  const campaignsPerSegmentMap = MOCK_CAMPAIGNS.reduce(
    (acc, campaign) => {
      acc[campaign.segment] = (acc[campaign.segment] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const campaignsPerSegmentData = Object.entries(campaignsPerSegmentMap).map(([name, value]) => ({
    name,
    value,
  }))

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Relatórios de Campanhas</h1>
        <p className="text-muted-foreground">Visão geral e métricas detalhadas das suas campanhas.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {/* Card: Total de Campanhas Feitas */}
        <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Campanhas Feitas</CardTitle>
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">Campanhas criadas até o momento</p>
          </CardContent>
        </Card>

        {/* Card: Total de Leads Gerados */}
        <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads Gerados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.leadsCount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Leads únicos alcançados por todas as campanhas</p>
          </CardContent>
        </Card>

        {/* Card: Média de Leads por Campanha */}
        <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média de Leads por Campanha</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {(MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.leadsCount, 0) / totalCampaigns).toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground">Média de leads por campanha</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Gráfico: Total de Leads por Campanha */}
        <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Leads por Campanha</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadsPerCampaignData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                    tick={{ fontSize: 10 }}
                    className="fill-foreground"
                  />
                  <YAxis className="fill-foreground" />
                  <Tooltip
                    // Estilos explícitos para o tooltip para garantir visibilidade
                    contentStyle={{
                      backgroundColor: "#222", // Fundo escuro
                      borderColor: "#444",
                      borderRadius: "0.5rem",
                      color: "#fff", // Texto branco
                    }}
                    labelStyle={{ color: "#eee" }} // Cor do label
                    itemStyle={{ color: "#fff" }} // Cor dos itens
                  />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  <Bar dataKey="leads" name="Total de Leads" radius={[4, 4, 0, 0]}>
                    {leadsPerCampaignData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico: Total de Campanhas por Segmento */}
        <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Campanhas por Segmento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={campaignsPerSegmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {campaignsPerSegmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    // Estilos explícitos para o tooltip para garantir visibilidade
                    contentStyle={{
                      backgroundColor: "#222", // Fundo escuro
                      borderColor: "#444",
                      borderRadius: "0.5rem",
                      color: "#fff", // Texto branco
                    }}
                    labelStyle={{ color: "#eee" }} // Cor do label
                    itemStyle={{ color: "#fff" }} // Cor dos itens
                  />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
