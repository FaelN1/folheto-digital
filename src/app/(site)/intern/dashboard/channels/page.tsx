"use client"

import * as React from "react"
import { Plus, Search, Table2, LayoutGrid, RefreshCw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MetricCards } from "@/components/emulators/metric-cards"
import { EmulatorTable } from "@/components/emulators/emulator-table"
import { EmulatorGrid } from "@/components/emulators/emulator-grid"
import { CreateEmulatorModal } from "@/components/emulators/CreateEmulator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"
import { 
  useEmulatorsByCompany,
  useUpdateEmulatorStatus,
  useSyncEmulators,
  EmulatorStatus
} from "@/hooks/emulators/useEmulators"
import { useCompanyId } from "@/hooks/companies/useCompanies"
import PermissionGuard from "@/components/PermissionGuard"

export default function ChannelsPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedStatus, setSelectedStatus] = React.useState<"ALL" | "ONLINE" | "OFFLINE" | "ERROR" | "UNKNOWN">("ALL")
  const [viewMode, setViewMode] = React.useState<"table" | "grid">("table")
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [dialogContent, setDialogContent] = React.useState<{ title: string; description: string } | null>(null)
  
  // Estados para o modal de criação de emulador
  const [createEmulatorOpen, setCreateEmulatorOpen] = React.useState(false)

  // Buscar companyId do usuário logado
  const { 
    companyId, 
    isLoading: isLoadingCompany,
    error: companyError,
  } = useCompanyId()

  // Use the correct hook to fetch emulators by company
  const { 
    data: emulatorsRaw, 
    isLoading: isLoadingEmulators, 
    error: emulatorsError,
    refetch
  } = useEmulatorsByCompany(companyId || "", {
    refetchInterval: 30000,
    staleTime: 5 * 60 * 1000,
    enabled: !!companyId,
  })

  // Sempre garanta que emulators é um array
const emulators = React.useMemo(
  () => (Array.isArray(emulatorsRaw) ? emulatorsRaw : []),
  [emulatorsRaw]
)
  // Memoized filtered emulators
  const filteredEmulators = React.useMemo(() => {
    let filtered = emulators

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (emulator) =>
          emulator.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          emulator.serverIp.toLowerCase().includes(lowerCaseSearchTerm) ||
          emulator.emulatorId.toLowerCase().includes(lowerCaseSearchTerm) ||
          emulator.id.toLowerCase().includes(lowerCaseSearchTerm),
      )
    }

    if (selectedStatus !== "ALL") {
      filtered = filtered.filter((emulator) => emulator.status === selectedStatus)
    }

    return filtered
  }, [emulators, searchTerm, selectedStatus])

  const handleViewDetails = (id: string) => {
    const emulator = emulators.find((e) => e.id === id)
    if (emulator) {
      setDialogContent({
        title: `Detalhes do Emulador: ${emulator.name}`,
        description: `ID: ${emulator.id}\nEmulatorId: ${emulator.emulatorId}\nIP: ${emulator.serverIp}\nStatus: ${emulator.status}\nEmpresa: Minha Empresa\nCriado em: ${format(new Date(emulator.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}\nAtualizado em: ${format(new Date(emulator.updatedAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}`,
      })
      setDialogOpen(true)
    }
  }

  const handleEdit = (id: string) => {
    setDialogContent({
      title: `Editar Emulador: ${id}`,
      description: "Funcionalidade para editar emulador seria implementada aqui. Rota: PUT /emulators/{id}",
    })
    setDialogOpen(true)
  }

const updateStatus = useUpdateEmulatorStatus({
  onSuccess: (updatedEmulator) => {
    toast.success(`Status do emulador ${updatedEmulator.name} alterado`)
    refetch()
  },
  onError: (error) => {
    toast.error(`Erro ao alterar status: ${error.message}`)
  }
})

const syncEmulators = useSyncEmulators({
  onSuccess: () => {
    setTimeout(() => {
      toast.success("Emuladores sincronizados com sucesso")
      refetch()
    }, 1000)
  },
  onError: (error) => {
    toast.error(`Erro ao sincronizar emuladores: ${error.message}`)
  }
})

const handleToggleStatus = (id: string, currentStatus: EmulatorStatus) => {
  const emulator = emulators.find(e => e.id === id)
  if (!emulator) return

  const newStatus = currentStatus === EmulatorStatus.ONLINE
    ? EmulatorStatus.OFFLINE
    : EmulatorStatus.ONLINE

  updateStatus.mutate({ id, status: newStatus })
}

  const handleNewEmulator = () => {
    if (!companyId) {
      toast.error("Erro: ID da empresa não encontrado")
      return
    }
    setCreateEmulatorOpen(true)
  }

  const handleCreateEmulatorSuccess = () => {
    refetch() // Atualizar a lista após criar um emulador
  }

  // Loading state for company
  if (isLoadingCompany) {
    return (
      <div className="flex-1 space-y-8 p-8">
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando dados da empresa...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state for company
  if (companyError) {
    return (
      <div className="flex-1 space-y-8 p-8">
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-center">
            <p className="text-destructive mb-4">Erro ao carregar dados da empresa: {companyError.message}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // No company found
  // if (hasCompany || companyId) {
  //   return (
  //     <div className="flex-1 space-y-8 p-8">
  //       <div className="flex items-center justify-center h-[400px]">
  //         <div className="text-center">
  //           <p className="text-muted-foreground mb-4">Nenhuma empresa associada ao usuário</p>
  //           <p className="text-sm text-muted-foreground">Entre em contato com o administrador para associar uma empresa</p>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  // Loading state for emulators
  if (isLoadingEmulators) {
    return (
      <div className="flex-1 space-y-8 p-8">
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando canais...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state for emulators
  if (emulatorsError) {
    return (
      <div className="flex-1 space-y-8 p-8">
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-center">
            <p className="text-destructive mb-4">Erro ao carregar canais: {emulatorsError.message}</p>
            <Button onClick={() => refetch()} variant="outline">
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-8 p-8">
      {/* Header da página */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Canais</h2>
          <p className="text-muted-foreground">
            Gerencie os canais da sua empresa. 
            {emulators.length > 0 && ` (${filteredEmulators.length} de ${emulators.length} canais)`}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <PermissionGuard permissions="emulator.refresh">
          <Button 
            onClick={() => syncEmulators.mutate({ 
              emulators: [], 
              source: "manual", 
              timestamp: Date.now() 
            })} 
            variant="outline" 
            size="sm"
            disabled={syncEmulators.isPending}
          >
            {syncEmulators.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sincronizando...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Sincronizar
              </>
            )}
          </Button>
          </PermissionGuard>
          <PermissionGuard permissions="emulator.create">
          <Button onClick={handleNewEmulator}>
            <Plus className="mr-2 h-4 w-4" /> Novo Canal
          </Button>
          </PermissionGuard>
        </div>
      </div>

      {/* Cards de Métricas */}
      {Array.isArray(emulators) && <MetricCards emulators={emulators} />}

      {/* Filtros e Opções de Visualização */}
      <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="            Buscar por nome, IP ou ID do emulador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>

          {/* Status Filter */}
          <Select
            value={selectedStatus}
            onValueChange={(value: "ALL" | "ONLINE" | "OFFLINE" | "ERROR" | "UNKNOWN") => setSelectedStatus(value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrar por Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os Status</SelectItem>
              <SelectItem value="ONLINE">Online</SelectItem>
              <SelectItem value="OFFLINE">Offline</SelectItem>
              <SelectItem value="ERROR">Erro</SelectItem>
              <SelectItem value="UNKNOWN">Desconhecido</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Mode Toggle */}
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(value: "table" | "grid") => value && setViewMode(value)}
          aria-label="Alternar visualização"
        >
          <ToggleGroupItem value="table" aria-label="Visualização em Tabela">
            <Table2 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="grid" aria-label="Visualização em Grade">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Content Area */}
      {emulators.length === 0 ? (
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Nenhum canal encontrado para sua empresa
            </p>

            <PermissionGuard permissions="emulator.create">
              <Button onClick={handleNewEmulator}>
                <Plus className="mr-2 h-4 w-4" /> Criar primeiro canal
              </Button>
            </PermissionGuard>
          </div>
        </div>
      ) : filteredEmulators.length === 0 ? (
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground">Nenhum canal encontrado com os filtros aplicados</p>
            <Button 
              onClick={() => {
                setSearchTerm("")
                setSelectedStatus("ALL")
              }}
              variant="outline"
            >
              Limpar filtros
            </Button>
          </div>
        </div>
      ) : (
        /* Tabela ou Grid de canais */
        <div className="space-y-4">
          {/* Results Summary */}
          <div className="text-sm text-muted-foreground">
            Exibindo {filteredEmulators.length} de {emulators.length} canais
            {searchTerm && ` para "${searchTerm}"`}
            {selectedStatus !== "ALL" && ` com status ${selectedStatus}`}
          </div>

          {viewMode === "table" ? (
            <EmulatorTable
              emulators={filteredEmulators}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onToggleStatus={handleToggleStatus}
            />
          ) : (
            <EmulatorGrid
              emulators={filteredEmulators}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onToggleStatus={handleToggleStatus}
            />
          )}
        </div>
      )}

      {/* Modal para criar novo emulador */}
      {companyId && (
        <CreateEmulatorModal
          open={createEmulatorOpen}
          onOpenChange={setCreateEmulatorOpen}
          companies={[{ id: companyId, name: "Minha Empresa" }]}
          defaultCompanyId={companyId}
          onSuccess={handleCreateEmulatorSuccess}
        />
      )}

      {/* Diálogo para outras ações (placeholder) */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogContent?.title}</DialogTitle>
            <DialogDescription className="whitespace-pre-wrap">
              {dialogContent?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setDialogOpen(false)}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}