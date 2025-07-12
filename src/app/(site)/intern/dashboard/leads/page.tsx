"use client"

import * as React from "react"
import { CalendarIcon, Filter, Search, Upload, Info, Tag, X, ChevronLeft, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { MultiSelectTags } from "@/components/ui/multi-select-tags"
import { useLeadsByCompany, useLeadTags, type Lead, type CreateLeadParams } from "@/hooks/leads/useLeads"
import { useTagsByCompany, type Tag as CompanyTag, type CreateTagParams } from "@/hooks/tags/useTags"
import { toast } from "sonner"

// Dados mockados
const companies = ["Todas", "Empresa A", "Empresa B", "Empresa C"]

const channels = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
]

export default function LeadsPage() {
  // Estados dos filtros
  const [filtroCompany, setFiltroCompany] = React.useState("Empresa A")
  const [filtroTags, setFiltroTags] = React.useState<string[]>([])
  const [dataInicio, setDataInicio] = React.useState<Date>()
  const [dataFim, setDataFim] = React.useState<Date>()
  const [busca, setBusca] = React.useState("")
  const [filtroChannel, setFiltroChannel] = React.useState<"ALL" | "whatsapp" | "email" | "sms">("ALL")

  // Estados dos modais
  const [importFile, setLocalImportFile] = React.useState<File | null>(null)
  const [isImportModalOpen, setIsImportModalOpen] = React.useState(false)
  const [selectedLeadForDetails, setSelectedLeadForDetails] = React.useState<Lead | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false)
  const [isManageTagsModalOpen, setIsManageTagsModalOpen] = React.useState(false)
  const [isCreateLeadModalOpen, setIsCreateLeadModalOpen] = React.useState(false)

  // Estados para criação de tag
  const [newTagName, setNewTagName] = React.useState("")
  const [newTagColor, setNewTagColor] = React.useState("#3B82F6")

  // Estados para criação de lead
  const [newLead, setNewLead] = React.useState<Omit<CreateLeadParams, 'companyId'>>({
    name: "",
    phone: "",
    email: "",
  })

  // Estados de paginação
  const [currentPage, setCurrentPage] = React.useState(1)
  const leadsPerPage = 10

  // Hook para leads
  const {
    leads,
    isLoading: isLoadingLeads,
    error: leadsError,
    createLead,
    isCreatingLead,
    refreshLeads,
  } = useLeadsByCompany(
    filtroCompany !== "Todas" ? filtroCompany : "",
    {
      search: busca,
      tags: filtroTags,
      channel: filtroChannel !== "ALL" ? filtroChannel : undefined,
      dateFrom: dataInicio,
      dateTo: dataFim,
      page: currentPage,
      limit: leadsPerPage,
    }
  )

    const handleSetImportFile = (file: File | null) => {
    setLocalImportFile(file)
  }
  // Hook para tags
  const {
    tags,
    isLoading: isLoadingTags,
    createTag,
    deleteTag,
    isCreatingTag,
    isDeletingTag,
  } = useTagsByCompany(filtroCompany !== "Todas" ? filtroCompany : "")

  // Hook para operações de tags em leads
  const { assignTag, removeTag, isAssigningTag, isRemovingTag } = useLeadTags()

  // Dados dos leads com filtragem local se necessário
 const filteredLeads = React.useMemo(() => {
  if (!Array.isArray(leads)) {
    return []
  }
  if (filtroCompany === "Todas") {
    return []
  }
  return leads
}, [leads, filtroCompany])


  // Lógica de paginação
  const totalLeads = filteredLeads?.length || 0
  const totalPages = Math.ceil(totalLeads / leadsPerPage)

  // Funções de manipulação
  const handleViewDetails = (lead: Lead) => {
    setSelectedLeadForDetails(lead)
    setIsDetailsModalOpen(true)
  }

  const handleImportContacts = () => {
    setIsImportModalOpen(true)
  }

  const handleCreateLead = async () => {
    if (!newLead.name || !newLead.phone || !newLead.email) {
      toast.error("Erro", {
        description: "Todos os campos são obrigatórios",
      })
      return
    }

    if (filtroCompany === "Todas") {
      toast.error("Erro", {
        description: "Selecione uma empresa específica para criar um lead",
      })
      return
    }

    try {
      await createLead({
        ...newLead,
        companyId: filtroCompany,
      })
      
      setNewLead({ name: "", phone: "", email: "" })
      setIsCreateLeadModalOpen(false)
      toast.success("Lead criado com sucesso!")
    } catch (error) {
      console.error("Erro ao criar lead:", error)
    }
  }

  const handleCreateTag = async (tagName: string) => {
    if (filtroCompany === "Todas") {
      toast.error("Erro", {
        description: "Selecione uma empresa específica para criar uma tag",
      })
      return
    }

    try {
      await createTag({
        name: tagName,
        color: newTagColor,
        companyId: filtroCompany,
      })
    } catch (error) {
      console.error("Erro ao criar tag:", error)
    }
  }

const handleAddTag = async () => {
  console.log('Tags:', tags, 'Type:', typeof tags, 'IsArray:', Array.isArray(tags))
  
  if (newTagName.trim() !== "" && !(Array.isArray(tags) && tags.some((tag) => tag.name === newTagName.trim()))) {
    await handleCreateTag(newTagName.trim())
    setNewTagName("")
    setNewTagColor("#3B82F6")
  }
}

  const handleRemoveTagFromList = async (tagId: string) => {
    try {
      await deleteTag(tagId)
      setFiltroTags((prev) => prev.filter((id) => id !== tagId))
    } catch (error) {
      console.error("Erro ao remover tag:", error)
    }
  }

  const handleAssignTag = async (leadId: string, tagId: string) => {
    try {
      await assignTag({ leadId, tagId })
    } catch (error) {
      console.error("Erro ao atribuir tag:", error)
    }
  }

  const handleRemoveTag = async (leadId: string, tagId: string) => {
    try {
      await removeTag({ leadId, tagId })
    } catch (error) {
      console.error("Erro ao remover tag:", error)
    }
  }

  const setSearchTerm = (value: string) => {
    setBusca(value)
    setCurrentPage(1)
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Função auxiliar para determinar a cor do texto
  const getContrastColor = (hexcolor: string) => {
    if (!hexcolor) return "black"
    const r = Number.parseInt(hexcolor.substring(1, 3), 16)
    const g = Number.parseInt(hexcolor.substring(3, 5), 16)
    const b = Number.parseInt(hexcolor.substring(5, 7), 16)
    const y = (r * 299 + g * 587 + b * 114) / 1000
    return y >= 128 ? "black" : "white"
  }

  // Função para encontrar tag por ID
 const findTagById = (tagId: string): CompanyTag | undefined => {
  return Array.isArray(tags) ? tags.find(tag => tag.id === tagId) : undefined
}

 if (leadsError && filtroCompany !== "Todas") {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erro ao carregar leads</h2>
          <p className="text-muted-foreground mb-4">
            {leadsError?.message || "Ocorreu um erro inesperado"}
          </p>
          <Button onClick={refreshLeads}>Tentar novamente</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Gerenciamento de Leads</h1>
          <p className="text-muted-foreground">Visualize e gerencie todos os seus leads em um só lugar</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsCreateLeadModalOpen(true)}
            disabled={filtroCompany === "Todas"}
          >
            <Upload className="mr-2 h-4 w-4" /> Criar Lead
          </Button>
          <Button onClick={handleImportContacts} variant="outline">
            <Upload className="mr-2 h-4 w-4" /> Importar Contatos
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Linha 1: Busca, Filtro de Empresa e Canal */}
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nome, telefone ou email..."
                value={busca}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={isLoadingLeads}
              />
            </div>
            <div className="space-y-2 w-full md:w-[200px] flex-shrink-0">
              <Label htmlFor="company">Empresa</Label>
              <select
                id="company"
                value={filtroCompany}
                onChange={(e) => {
                  setFiltroCompany(e.target.value)
                  setCurrentPage(1)
                  setFiltroTags([]) // Reset tags when changing company
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoadingLeads}
              >
                {companies.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 w-full md:w-[200px] flex-shrink-0">
              <Label htmlFor="channel">Canal</Label>
              <select
                id="channel"
                value={filtroChannel}
                onChange={(e) => {
                  setFiltroChannel(e.target.value as "ALL" | "whatsapp" | "email" | "sms")
                  setCurrentPage(1)
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoadingLeads}
              >
                <option value="ALL">Todos os Canais</option>
                {channels.map((channel) => (
                  <option key={channel.value} value={channel.value}>
                    {channel.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Linha 2: Filtros de Tags */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Tags</Label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsManageTagsModalOpen(true)}
                disabled={filtroCompany === "Todas"}
              >
                <Tag className="mr-2 h-4 w-4" /> Gerenciar Tags
              </Button>
            </div>
            <MultiSelectTags
             options={Array.isArray(tags) ? tags.map(tag => tag.name) : []}
              selected={filtroTags}
              onSelect={(tagIds) => {
                setFiltroTags(tagIds)
                setCurrentPage(1)
              }}
              placeholder="Selecione as tags para filtrar..."
              disabled={isLoadingTags || filtroCompany === "Todas"}
              onCreateTag={handleCreateTag}
              showCreateOption={filtroCompany !== "Todas"}
            />
          </div>

          {/* Linha 3: Filtros de data */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Data de Cadastro - Início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !dataInicio && "text-muted-foreground")}
                    disabled={isLoadingLeads}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataInicio ? format(dataInicio, "PPP", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" side="bottom" sideOffset={4}>
                  <Calendar 
                    mode="single" 
                    selected={dataInicio} 
                    onSelect={(date) => {
                      setDataInicio(date)
                      setCurrentPage(1)
                    }} 
                    initialFocus 
                    fixedWeeks 
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Data de Cadastro - Fim</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !dataFim && "text-muted-foreground")}
                    disabled={isLoadingLeads}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataFim ? format(dataFim, "PPP", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" side="bottom" sideOffset={4}>
                  <Calendar 
                    mode="single" 
                    selected={dataFim} 
                    onSelect={(date) => {
                      setDataFim(date)
                      setCurrentPage(1)
                    }} 
                    initialFocus 
                    fixedWeeks 
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Leads */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              Lista de Leads ({totalLeads} {totalLeads === 1 ? "lead" : "leads"})
              {isLoadingLeads && <span className="ml-2 text-sm text-muted-foreground">Carregando...</span>}
            </span>
            {filtroCompany === "Todas" && (
              <span className="text-sm text-muted-foreground">
                Selecione uma empresa específica para visualizar os leads
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead>Última Atualização</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
                      <TableBody>
                {isLoadingLeads ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="ml-2">Carregando leads...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filtroCompany === "Todas" ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      Selecione uma empresa específica para visualizar os leads.
                    </TableCell>
                  </TableRow>
                ) : !filteredLeads || filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      Nenhum lead encontrado com os filtros aplicados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead) => (
                    <TableRow
                      key={lead.id}
                      className="hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleViewDetails(lead)}
                    >
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>{lead.phone}</TableCell>
                      <TableCell className="text-blue-600 hover:text-blue-800">
                        <a href={`mailto:${lead.email}`} onClick={(e) => e.stopPropagation()}>
                          {lead.email}
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{lead.companyId}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {lead.channel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(lead.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </TableCell>
// ...existing code...
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Controles de Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1 || isLoadingLeads}
              >
                <ChevronLeft className="h-4 w-4 mr-2" /> Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages || isLoadingLeads}
              >
                Próxima <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Criação de Lead */}
      <Dialog open={isCreateLeadModalOpen} onOpenChange={setIsCreateLeadModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Criar Novo Lead</DialogTitle>
            <DialogDescription>
              Adicione um novo lead para a empresa {filtroCompany}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="lead-name">Nome</Label>
              <Input
                id="lead-name"
                placeholder="Nome completo do lead"
                value={newLead.name}
                onChange={(e) => setNewLead(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-phone">Telefone</Label>
              <Input
                id="lead-phone"
                placeholder="(11) 99999-9999"
                value={newLead.phone}
                onChange={(e) => setNewLead(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-email">Email</Label>
              <Input
                id="lead-email"
                type="email"
                placeholder="email@exemplo.com"
                value={newLead.email}
                onChange={(e) => setNewLead(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateLeadModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateLead} disabled={isCreatingLead}>
              {isCreatingLead ? "Criando..." : "Criar Lead"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Importação de Contatos */}
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Importar Contatos</DialogTitle>
            <DialogDescription>Faça o upload de um arquivo CSV para importar novos leads.</DialogDescription>
          </DialogHeader>
           <div className="grid gap-4 py-4">
      <form
        className="relative flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition-colors duration-200 hover:border-gray-400 hover:bg-gray-100 data-[dragging=true]:border-blue-500 data-[dragging=true]:bg-blue-50"
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
          e.currentTarget.setAttribute("data-dragging", "true")
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          e.stopPropagation()
          e.currentTarget.removeAttribute("data-dragging")
        }}
        onDrop={(e) => {
          e.preventDefault()
          e.stopPropagation()
          e.currentTarget.removeAttribute("data-dragging")
          const file = e.dataTransfer.files?.[0]
          if (file) handleSetImportFile(file)
        }}
        onSubmit={(e) => {
          e.preventDefault()
          // handle file upload here
        }}
      >
        <Upload className="h-12 w-12 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Arraste e solte seu arquivo CSV aqui, ou</p>
        <input
          type="file"
          accept=".csv,.xlsx"
          className="hidden"
          id="csv-upload"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleSetImportFile(file)
          }}
        />
      <label htmlFor="csv-upload" className="cursor-pointer">
  <Button variant="outline" asChild>
    <span>Selecionar Arquivo</span>
  </Button>
</label>
        <p className="text-xs text-muted-foreground">Max. 10MB, formato CSV</p>
        {importFile && (
          <div className="mt-4 flex items-center gap-3 rounded-md bg-white p-3 shadow-sm">
            <span className="text-sm font-medium text-primary truncate max-w-[180px]">{importFile.name}</span>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {(importFile.size / (1024 * 1024)).toFixed(2)} MB
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSetImportFile(null)}
              className="ml-auto flex-shrink-0"
            >
              <X className="h-4 w-4 mr-1" />
              Remover
            </Button>
          </div>
        )}
      </form>
    </div>
          <DialogFooter>
            <Button type="submit">Importar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes do Lead */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Lead</DialogTitle>
            <DialogDescription>Informações completas sobre {selectedLeadForDetails?.name}</DialogDescription>
          </DialogHeader>
          {selectedLeadForDetails && (
            <div className="grid gap-4 py-4 text-sm">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-semibold">Nome:</Label>
                <span className="col-span-2">{selectedLeadForDetails.name}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-semibold">Telefone:</Label>
                <span className="col-span-2">{selectedLeadForDetails.phone}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-semibold">Email:</Label>
                <span className="col-span-2">{selectedLeadForDetails.email}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-semibold">Empresa:</Label>
                <span className="col-span-2">{selectedLeadForDetails.companyId}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-semibold">Canal:</Label>
                <span className="col-span-2 capitalize">{selectedLeadForDetails.channel}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-semibold">Criado em:</Label>
                <span className="col-span-2">
                  {format(new Date(selectedLeadForDetails.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-semibold">Atualizado em:</Label>
                <span className="col-span-2">
                  {format(new Date(selectedLeadForDetails.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
              </div>
              <div className="grid grid-cols-3 items-start gap-4">
                <Label className="text-right font-semibold pt-1">Tags:</Label>
                <div className="col-span-2 flex flex-wrap gap-1">
                  {selectedLeadForDetails.tags.length > 0 ? (
                    selectedLeadForDetails.tags.map((tagId) => {
                      const tag = findTagById(tagId)
                      if (!tag) return null
                      
                      const textColor = getContrastColor(tag.color)
                      return (
                        <Badge 
                          key={tagId} 
                          style={{ backgroundColor: tag.color, color: textColor }}
                        >
                          {tag.name}
                        </Badge>
                      )
                    }).filter(Boolean)
                  ) : (
                    <span className="text-muted-foreground">Nenhuma tag</span>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailsModalOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Gerenciamento de Tags */}
      <Dialog open={isManageTagsModalOpen} onOpenChange={setIsManageTagsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Gerenciar Tags</DialogTitle>
            <DialogDescription>Adicione, edite ou remova tags para organizar seus leads.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-tag-name">Adicionar Nova Tag</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="new-tag-name"
                  placeholder="Nome da nova tag"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddTag()
                    }
                  }}
                />
                <input
                  type="color"
                  value={newTagColor}
                  onChange={(e) => setNewTagColor(e.target.value)}
                  className="w-10 h-10 p-0 border-none cursor-pointer rounded-md overflow-hidden"
                  title="Escolher cor da tag"
                />
                <Button 
                  onClick={handleAddTag}
                  disabled={isCreatingTag || !newTagName.trim()}
                >
                  {isCreatingTag ? "Criando..." : "Adicionar"}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags Existentes</Label>
          <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto rounded-md border p-3">
  {isLoadingTags ? (
    <p className="text-muted-foreground text-sm">Carregando tags...</p>
  ) : !tags || !Array.isArray(tags) || tags.length === 0 ? (
    <p className="text-muted-foreground text-sm">Nenhuma tag disponível.</p>
  ) : (
    tags.map((tag) => {
      const textColor = getContrastColor(tag.color)
      return (
        <Badge
          key={tag.id}
          style={{ backgroundColor: tag.color, color: textColor }}
          className="pr-1"
        >
          {tag.name}
          <Button
            variant="ghost"
            size="icon"
            className="ml-1 h-4 w-4 rounded-full bg-white/30 text-white hover:bg-white/50"
            onClick={() => handleRemoveTagFromList(tag.id)}
            disabled={isDeletingTag}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remover tag {tag.name}</span>
          </Button>
        </Badge>
      )
    })
  )}
</div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManageTagsModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}