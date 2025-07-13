"use client"

import { useState } from "react"
import { Search, Trash2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Dados de exemplo das campanhas
const campaigns = [
  {
    id: 1,
    name: "Campanha Black Friday 2024",
    emulador: "Google Ads",
    quantidadeContatos: 2500,
    status: "ativa",
  },
  {
    id: 2,
    name: "Lançamento Produto Verão",
    emulador: "Facebook Ads",
    quantidadeContatos: 1780,
    status: "pausada",
  },
  {
    id: 3,
    name: "Remarketing E-commerce",
    emulador: "Google Ads",
    quantidadeContatos: 1340,
    status: "ativa",
  },
  {
    id: 4,
    name: "Awareness Marca Nacional",
    emulador: "Meta Ads",
    quantidadeContatos: 4500,
    status: "finalizada",
  },
  {
    id: 5,
    name: "Promoção Natal 2024",
    emulador: "Google Ads",
    quantidadeContatos: 0,
    status: "rascunho",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "ativa":
      return "bg-green-100 text-green-800 hover:bg-green-100"
    case "pausada":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    case "finalizada":
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    case "rascunho":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("pt-BR").format(value)
}

export default function CampaignsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [platformFilter, setPlatformFilter] = useState("todas")

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "todos" || campaign.status === statusFilter
    const matchesEmulador = platformFilter === "todas" || campaign.emulador === platformFilter

    return matchesSearch && matchesStatus && matchesEmulador
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Campanhas</h1>
          <p className="text-muted-foreground">Gerencie suas campanhas publicitárias</p>
        </div>
        <Button asChild>
          <Link href="/intern/dashboard/campaign/create">Nova Campanha</Link>
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar campanhas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="ativa">Ativa</SelectItem>
                <SelectItem value="pausada">Pausada</SelectItem>
                <SelectItem value="finalizada">Finalizada</SelectItem>
                <SelectItem value="rascunho">Rascunho</SelectItem>
              </SelectContent>
            </Select>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Emulador" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todos os emuladores</SelectItem>
                <SelectItem value="Google Ads">Google Ads</SelectItem>
                <SelectItem value="Facebook Ads">Facebook Ads</SelectItem>
                <SelectItem value="Meta Ads">Meta Ads</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Campanhas */}
      <div className="grid gap-4">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 flex-1">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-semibold">{campaign.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Emulador</p>
                    <p className="font-medium">{campaign.emulador}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Quantidade de contatos</p>
                    <p className="font-medium">{formatNumber(campaign.quantidadeContatos)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2 cursor-pointer  " />
                  Apagar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma campanha encontrada com os filtros aplicados.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
