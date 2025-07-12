"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import { 
  useCreateEmulator,
  type CreateEmulatorInput
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
    phone: "",
    companyId: defaultCompanyId || ""
  })

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (open) {
      setEmulatorForm({
        name: "",
        phone: "",
        companyId: defaultCompanyId || ""
      })
    }
  }, [open, defaultCompanyId])

  // Hook para criar emulador
  const createEmulatorMutation = useCreateEmulator({
    onSuccess: (data) => {
      toast.success(`Emulador "${data.name}" criado com sucesso!`)
      onOpenChange(false)
      setEmulatorForm({ name: "", phone: "", companyId: "" })
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
    
    if (!emulatorForm.phone.trim()) {
      toast.error("Telefone é obrigatório")
      return
    }
    
    if (!emulatorForm.companyId) {
      toast.error("Empresa é obrigatória")
      return
    }

    // Validação de formato de telefone (básica)
    const phoneDigits = emulatorForm.phone.replace(/\D/g, '')
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      toast.error("Telefone deve ter entre 10 e 11 dígitos")
      return
    }

    console.log('Enviando dados para API:', emulatorForm)
    createEmulatorMutation.mutate(emulatorForm)
  }

  const formatPhoneInput = (value: string) => {
    // Remove tudo que não é dígito
    const digitsOnly = value.replace(/\D/g, '')
    
    // Aplica máscara (xx) xxxxx-xxxx
    if (digitsOnly.length <= 2) {
      return digitsOnly ? `(${digitsOnly}` : ''
    } else if (digitsOnly.length <= 7) {
      return `(${digitsOnly.slice(0, 2)}) ${digitsOnly.slice(2)}`
    } else {
      return `(${digitsOnly.slice(0, 2)}) ${digitsOnly.slice(2, 7)}-${digitsOnly.slice(7, 11)}`
    }
  }

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneInput(value)
    setEmulatorForm(prev => ({ ...prev, phone: formatted }))
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
              placeholder="Ex: Emulador WhatsApp - Vendas"
              value={emulatorForm.name}
              onChange={(e) => setEmulatorForm(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emulator-phone">Telefone *</Label>
            <Input
              id="emulator-phone"
              type="tel"
              placeholder="(11) 99999-9999"
              value={emulatorForm.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              maxLength={15}
              required
            />
            <p className="text-xs text-muted-foreground">
              Digite apenas números, a máscara será aplicada automaticamente
            </p>
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