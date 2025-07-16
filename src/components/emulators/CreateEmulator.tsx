import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import { 
  useCreateEmulator,
  type CreateEmulatorInput,
  EmulatorStatus
} from "@/hooks/emulators/useEmulators"

interface CreateEmulatorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  companies: Array<{ id: string; name: string }>
  defaultCompanyId?: string
  onSuccess?: () => void
}

export function CreateEmulatorModal({
  open,
  onOpenChange,
  companies,
  defaultCompanyId,
  onSuccess
}: CreateEmulatorModalProps) {
  const [emulatorForm, setEmulatorForm] = React.useState<CreateEmulatorInput>({
    name: "",
    serverIp: "",
    emulatorId: "",
    status: EmulatorStatus.OFFLINE,
    companyId: defaultCompanyId || ""
  })

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (open) {
      setEmulatorForm({
        name: "",
        serverIp: "",
        emulatorId: "",
        status: EmulatorStatus.OFFLINE,
        companyId: defaultCompanyId || ""
      })
    }
  }, [open, defaultCompanyId])

  // Hook para criar emulador
  const createEmulatorMutation = useCreateEmulator({
    onSuccess: (data) => {
      toast.success(`Emulador "${data.name}" criado com sucesso!`)
      onOpenChange(false)
      setEmulatorForm({ 
        name: "", 
        serverIp: "", 
        emulatorId: "", 
        status: EmulatorStatus.OFFLINE, 
        companyId: defaultCompanyId || ""
      })
      onSuccess?.()
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Erro desconhecido ao criar emulador"
      toast.error(`Erro ao criar emulador: ${errorMessage}`)
      console.error('Erro detalhado:', error)
    }
  })

  const handleCreateEmulator = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validações básicas
    if (!emulatorForm.name.trim()) {
      toast.error("Nome do emulador é obrigatório")
      return
    }
    
    if (!emulatorForm.serverIp.trim()) {
      toast.error("IP do servidor é obrigatório")
      return
    }

    if (!emulatorForm.emulatorId.trim()) {
      toast.error("ID do emulador é obrigatório")
      return
    }
    
    if (!emulatorForm.companyId) {
      toast.error("Empresa é obrigatória")
      return
    }

    // Validação básica de IP
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/
    if (!ipRegex.test(emulatorForm.serverIp)) {
      toast.error("IP do servidor deve ter formato válido (ex: 192.168.1.100)")
      return
    }

    console.log('Enviando dados para API:', emulatorForm)
    createEmulatorMutation.mutate(emulatorForm)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Emulador</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para criar um novo emulador.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleCreateEmulator} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emulator-name">Nome do Emulador *</Label>
            <Input
              id="emulator-name"
              type="text"
              placeholder="Ex: Emulador Principal - Vendas"
              value={emulatorForm.name}
              onChange={(e) => setEmulatorForm(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emulator-server-ip">IP do Servidor *</Label>
            <Input
              id="emulator-server-ip"
              type="text"
              placeholder="192.168.1.100"
              value={emulatorForm.serverIp}
              onChange={(e) => setEmulatorForm(prev => ({ ...prev, serverIp: e.target.value }))}
              required
            />
            <p className="text-xs text-muted-foreground">
              Endereço IP do servidor onde o emulador está rodando
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emulator-id">ID do Emulador *</Label>
            <Input
              id="emulator-id"
              type="text"
              placeholder="EMU_001"
              value={emulatorForm.emulatorId}
              onChange={(e) => setEmulatorForm(prev => ({ ...prev, emulatorId: e.target.value }))}
              required
            />
            <p className="text-xs text-muted-foreground">
              Identificador único do emulador
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emulator-status">Status Inicial *</Label>
            <Select
              value={emulatorForm.status}
              onValueChange={(value: EmulatorStatus) => setEmulatorForm(prev => ({ ...prev, status: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={EmulatorStatus.ONLINE}>Online</SelectItem>
                <SelectItem value={EmulatorStatus.OFFLINE}>Offline</SelectItem>
                <SelectItem value={EmulatorStatus.ERROR}>Erro</SelectItem>
                <SelectItem value={EmulatorStatus.UNKNOWN}>Desconhecido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emulator-company">Empresa *</Label>
            <Select
              value={emulatorForm.companyId}
              onValueChange={(value) => setEmulatorForm(prev => ({ ...prev, companyId: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma empresa" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createEmulatorMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createEmulatorMutation.isPending}
            >
              {createEmulatorMutation.isPending ? "Criando..." : "Criar Emulador"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}