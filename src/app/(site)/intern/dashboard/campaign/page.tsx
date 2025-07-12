"use client"
import * as React from "react"
import { CalendarIcon, Send, Smile, X, Upload, Clock, Users, MessageCircle, ImageIcon, User } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { MultiSelectTags } from "@/components/ui/multi-select-tags"
import { toast } from "sonner"
import Picker from "@emoji-mart/react"
import data from "@emoji-mart/data"
import IPhoneMockup from "./IphoneMockup"

// Hooks
import { useCampaigns, CreateCampaignParams } from "@/hooks/campaign/useCampaign"
import { useUserCompany } from "@/hooks/companies/useCompanies"
import { useLeadsByCompany } from "@/hooks/leads/useLeads"
import { useTagsByCompany } from "@/hooks/tags/useTags"
import { useEmulatorsByCompany } from "@/hooks/emulators/useEmulators"
import { Calendar20 } from "@/components/ui/calendar-20"

// Tipos locais
interface CampaignFormData {
  name: string;
  description?: string;
  selectedEmulator: string;
  selectedLead: string;
  tags: string[];
  message: string;
  file: File | null;
  sendOption: "disparar_agora" | "agendar";
  scheduledDate?: Date;
  scheduledTime?: string;
}

export default function CampaignsPage() {
  // Estados do formulário
  const [formData, setFormData] = React.useState<CampaignFormData>({
    name: "",
    description: "",
    selectedEmulator: "",
    selectedLead: "",
    tags: [],
    message: "",
    file: null,
    sendOption: "disparar_agora",
  })
  
  const [filePreviewUrl, setFilePreviewUrl] = React.useState<string | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false)

  // Componente do Calendar Avançado
  const AdvancedScheduler = () => {
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>()
    const [selectedTime, setSelectedTime] = React.useState<string | null>(null)
    
    // Gerar slots de horário de 8:00 às 20:00 com intervalos de 30 minutos
    const timeSlots = React.useMemo(() => {
      const slots = []
      for (let hour = 8; hour <= 20; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          if (hour === 20 && minute > 0) break // Para às 20:00
          const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
          slots.push(timeString)
        }
      }
      return slots
    }, [])

    // Datas bloqueadas (exemplo: fins de semana ou feriados)
    const bookedDates = React.useMemo(() => {
      const today = new Date()
      const blockedDates = []
      
      // Bloquear domingos por exemplo
      for (let i = 0; i < 30; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        if (date.getDay() === 0) { // Domingo
          blockedDates.push(date)
        }
      }
      return blockedDates
    }, [])

    // Sincronizar com o estado principal
    React.useEffect(() => {
      if (selectedDate && selectedTime) {
        updateFormData({ 
          scheduledDate: selectedDate, 
          scheduledTime: selectedTime 
        })
      }
    }, [selectedDate, selectedTime])

    return (
      <Card className="gap-0 p-0 border-0 shadow-none">
        <CardContent className="relative p-0 md:pr-48">
          <div className="p-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              defaultMonth={new Date()}
              disabled={(date) => {
                // Bloquear datas passadas
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                if (date < today) return true
                
                // Bloquear datas na lista de bloqueadas
                return bookedDates.some(blockedDate => 
                  date.toDateString() === blockedDate.toDateString()
                )
              }}
              showOutsideDays={false}
              modifiers={{
                booked: bookedDates,
              }}
              modifiersClassNames={{
                booked: "[&>button]:line-through opacity-50",
              }}
              className="bg-transparent p-0 [--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
              formatters={{
                formatWeekdayName: (date) => {
                  return date.toLocaleString("pt-BR", { weekday: "short" })
                },
              }}
            />
          </div>
          
          {/* Horários disponíveis */}
          {selectedDate && (
            <div className="no-scrollbar inset-y-0 right-0 flex max-h-72 w-full scroll-pb-6 flex-col gap-4 overflow-y-auto border-t p-6 md:absolute md:max-h-none md:w-48 md:border-t-0 md:border-l">
              <div className="text-sm font-medium text-center mb-2">
                Horários Disponíveis
              </div>
              <div className="grid gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    onClick={() => setSelectedTime(time)}
                    className="w-full shadow-none text-sm"
                    size="sm"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        
        {/* Footer com resumo */}
        {selectedDate && (
          <CardFooter className="flex flex-col gap-4 border-t px-6 py-4 md:flex-row bg-gray-50/50">
            <div className="text-sm flex-1">
              {selectedDate && selectedTime ? (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>
                    Agendado para{" "}
                    <span className="font-medium text-primary">
                      {selectedDate?.toLocaleDateString("pt-BR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </span>
                    {selectedTime && (
                      <>
                        {" "}às <span className="font-medium text-primary">{selectedTime}</span>
                      </>
                    )}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Selecione uma data e horário para agendar</span>
                </div>
              )}
            </div>
            
            {selectedTime && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedTime(null)
                  updateFormData({ scheduledTime: undefined })
                }}
                className="md:w-auto"
              >
                Limpar Horário
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    )
  }

  // Hooks de dados
  const { company, companyId, isLoading: isLoadingCompany } = useUserCompany()
  
  const { 
    createCampaign, 
    isCreatingCampaign, 
    error: campaignError 
  } = useCampaigns()

  const { 
    leads, 
    isLoading: isLoadingLeads 
  } = useLeadsByCompany(companyId || "", {
    enabled: !!companyId,
  })

  const { 
    tags, 
    isLoading: isLoadingTags 
  } = useTagsByCompany(companyId || "", {
    enabled: !!companyId,
  })

  const { 
    data: emulators, 
    isLoading: isLoadingEmulators 
  } = useEmulatorsByCompany(companyId || "", {
    enabled: !!companyId,
  })

  // Handlers para atualização do formulário
  const updateFormData = (updates: Partial<CampaignFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Arquivo muito grande", {
          description: "O arquivo excede o limite de 10MB.",
        })
        return
      }
      updateFormData({ file })
      setFilePreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleRemoveFile = () => {
    updateFormData({ file: null })
    setFilePreviewUrl(null)
    const fileInput = document.getElementById("file-upload") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  const handleEmojiSelect = (native: string) => {
    const textarea = document.getElementById("mensagem") as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newMessage = formData.message.substring(0, start) + native + formData.message.substring(end)
      updateFormData({ message: newMessage })
      
      setShowEmojiPicker(false)
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + native.length
        textarea.focus()
      }, 0)
    }
  }

  // Validação do formulário
  const validateForm = (): string | null => {
    if (!formData.name.trim()) return "Nome da campanha é obrigatório"
    if (!formData.selectedEmulator) return "Selecione um emulador"
    if (!formData.selectedLead) return "Selecione um destinatário"
    if (!formData.message.trim() && !formData.file) return "Adicione uma mensagem ou arquivo"
    if (!companyId) return "Empresa não identificada"
    
    if (formData.sendOption === "agendar") {
      if (!formData.scheduledDate) return "Selecione a data para agendamento"
      if (!formData.scheduledTime) return "Selecione o horário para agendamento"
    }
    
    return null
  }

  // Submit do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      toast.error("Erro de validação", {
        description: validationError,
      })
      return
    }

    try {
      const campaignData: CreateCampaignParams = {
        name: formData.name,
        description: formData.message, 
        companyId: companyId!,
        files: formData.file ? [formData.file] : undefined,
      }

      await createCampaign(campaignData)
      
      // Reset do formulário após sucesso
      setFormData({
        name: "",
        description: "",
        selectedEmulator: "",
        selectedLead: "",
        tags: [],
        message: "",
        file: null,
        sendOption: "disparar_agora",
      })
      setFilePreviewUrl(null)
      
      toast.success("Campanha criada com sucesso!", {
        description: formData.sendOption === "disparar_agora" 
          ? "A campanha foi enviada imediatamente." 
          : "A campanha foi agendada com sucesso.",
      })
      
    } catch (error) {
      console.error("Erro ao criar campanha:", error)
      toast.error("Erro ao criar campanha", {
        description: "Tente novamente em alguns instantes.",
      })
    }
  }

  // Dados derivados
  const selectedLeadData = React.useMemo(() => {
    return Array.isArray(leads) 
      ? leads.find(lead => lead.id === formData.selectedLead)
      : undefined
  }, [leads, formData.selectedLead])

  const selectedEmulatorData = React.useMemo(() => {
    return Array.isArray(emulators) 
      ? emulators.find(emulator => emulator.id === formData.selectedEmulator)
      : undefined
  }, [emulators, formData.selectedEmulator])

  const tagsOptions = React.useMemo(() => {
    return Array.isArray(tags) ? tags.map(tag => tag.name) : []
  }, [tags])

  const availableEmulators = React.useMemo(() => {
    return Array.isArray(emulators) 
      ? emulators.filter(emulator => emulator.status === "CONNECTED")
      : []
  }, [emulators])

  // Loading states
  if (isLoadingCompany) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dados da empresa...</p>
        </div>
      </div>
    )
  }

  if (companyId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Empresa não encontrada</h2>
          <p className="text-muted-foreground">
            Não foi possível identificar sua empresa. Entre em contato com o suporte.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Criador de Campanhas</h1>
          <p className="text-muted-foreground">
            Crie campanhas personalizadas para {company?.name || "sua empresa"} e veja como ficam em tempo real
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            {/* Formulário Principal */}
            <div className="xl:col-span-3 space-y-6">
              {/* Informações Básicas */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    Informações da Campanha
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Nome da campanha */}
                  <div className="space-y-2">
                    <Label htmlFor="campaign-name" className="text-sm font-semibold">
                      Nome da Campanha *
                    </Label>
                    <Input
                      id="campaign-name"
                      placeholder="Ex: Promoção Black Friday 2024"
                      value={formData.name}
                      onChange={(e) => updateFormData({ name: e.target.value })}
                      className="h-11"
                      required
                    />
                  </div>

                  {/* Descrição */}
                  <div className="space-y-2">
                    <Label htmlFor="campaign-description" className="text-sm font-semibold">
                      Descrição (opcional)
                    </Label>
                    <Input
                      id="campaign-description"
                      placeholder="Descreva brevemente o objetivo desta campanha"
                      value={formData.description}
                      onChange={(e) => updateFormData({ description: e.target.value })}
                      className="h-11"
                    />
                  </div>

                  {/* Emulador e Lead */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="emulator" className="text-sm font-semibold">
                        Emulador WhatsApp *
                      </Label>
                      <Select 
                        value={formData.selectedEmulator} 
                        onValueChange={(value) => updateFormData({ selectedEmulator: value })}
                        disabled={isLoadingEmulators}
                      >
                        <SelectTrigger id="emulator" className="h-11 w-full">
                          <SelectValue placeholder={
                            isLoadingEmulators 
                              ? "Carregando emuladores..." 
                              : availableEmulators.length === 0
                                ? "Nenhum emulador conectado"
                                : "Selecione um emulador"
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          {availableEmulators.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">
                              <p className="text-sm">Nenhum emulador conectado encontrado</p>
                              <p className="text-xs mt-1">
                                Verifique se há emuladores ativos na página de Emuladores
                              </p>
                            </div>
                          ) : (
                            availableEmulators.map((emulator) => (
                              <SelectItem key={emulator.id} value={emulator.id}>
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <div className="flex flex-col items-start">
                                    <span className="font-medium">{emulator.name}</span>
                                    <span className="text-xs text-muted-foreground">{emulator.phone}</span>
                                  </div>
                                </div>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {availableEmulators.length === 0 && !isLoadingEmulators && (
                        <p className="text-xs text-orange-600">
                          ⚠️ Nenhum emulador conectado. Configure um emulador primeiro.
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lead" className="text-sm font-semibold">
                        Destinatário (Lead) *
                      </Label>
                      <Select 
                        value={formData.selectedLead} 
                        onValueChange={(value) => updateFormData({ selectedLead: value })}
                        disabled={isLoadingLeads}
                      >
                        <SelectTrigger id="lead" className="h-11 w-full">
                          <SelectValue placeholder={
                            isLoadingLeads ? "Carregando leads..." : "Selecione um lead"
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(leads) && leads.map((lead) => (
                            <SelectItem key={lead.id} value={lead.id}>
                              <div className="flex flex-col items-start">
                                <span className="font-medium">{lead.name}</span>
                                <span className="text-xs text-muted-foreground">{lead.phone}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Tags da Campanha</Label>
                    <MultiSelectTags
                      options={tagsOptions}
                      selected={formData.tags}
                      onSelect={(tags) => updateFormData({ tags })}
                      placeholder={
                        isLoadingTags 
                          ? "Carregando tags..." 
                          : "Selecione as tags da campanha"
                      }
                      disabled={isLoadingTags}
                    />
                  </div>

                  {/* Info do Emulador Selecionado */}
                  {selectedEmulatorData && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-800">
                        <MessageCircle className="w-4 h-4" />
                        <span className="font-medium">Emulador Selecionado:</span>
                      </div>
                      <p className="text-sm text-blue-600 mt-1">
                        {selectedEmulatorData.name} ({selectedEmulatorData.phone})
                      </p>
                      <p className="text-xs text-blue-500 mt-1">
                        Status: Conectado • Criado em {format(new Date(selectedEmulatorData.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Conteúdo da Mensagem */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-primary" />
                    </div>
                    Conteúdo da Mensagem
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Textarea com Emojis */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="mensagem" className="text-sm font-semibold">
                        Mensagem
                      </Label>
                      <span className="text-sm text-muted-foreground">
                        {formData.message.length} / 2000 caracteres
                      </span>
                    </div>
                    <div className="relative flex items-end">
                      <Textarea
                        id="mensagem"
                        placeholder="Digite sua mensagem aqui... Use emojis para torná-la mais expressiva! 😊"
                        value={formData.message}
                        onChange={(e) => updateFormData({ message: e.target.value })}
                        maxLength={2000}
                        rows={6}
                        className="resize-none text-base leading-relaxed"
                      />
                      <div className="ml-2 mb-4">
                        <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                              <Smile className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="end">
                            <Picker
                              data={data}
                              onEmojiSelect={(emoji: any) => handleEmojiSelect(emoji.native)}
                              theme="light"
                              set="native"
                              previewPosition="none"
                              skinTonePosition="none"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>

                  {/* Upload de Arquivo */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Anexar Mídia</Label>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      {formData.file ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-center gap-2 text-green-600">
                            <Upload className="w-5 h-5" />
                            <span className="font-medium">Arquivo anexado</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formData.file.name} ({(formData.file.size / (1024 * 1024)).toFixed(2)} MB)
                          </p>
                          <Button variant="outline" onClick={handleRemoveFile} size="sm" type="button">
                            <X className="w-4 h-4 mr-2" />
                            Remover
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <div>
                            <label htmlFor="file-upload" className="cursor-pointer">
                              <span className="text-primary font-medium hover:underline">Clique para enviar</span>
                              <span className="text-muted-foreground"> ou arraste e solte</span>
                            </label>
                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF, MP4 até 10MB</p>
                          </div>
                          <Input
                            id="file-upload"
                            type="file"
                            accept="image/*,video/*,audio/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Opções de Envio */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    Opções de Envio
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup 
                    value={formData.sendOption} 
                    onValueChange={(value: "disparar_agora" | "agendar") => updateFormData({ sendOption: value })}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="disparar_agora" id="disparar_agora" />
                      <Label htmlFor="disparar_agora" className="flex-1 cursor-pointer">
                        <div className="font-medium">Disparar Agora</div>
                        <div className="text-sm text-muted-foreground">Envio imediato</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="agendar" id="agendar" />
                      <Label htmlFor="agendar" className="flex-1 cursor-pointer">
                        <div className="font-medium">Agendar</div>
                        <div className="text-sm text-muted-foreground">Programar envio</div>
                      </Label>
                    </div>
                  </RadioGroup>
                  
                    {/* Calendar Avançado para Agendamento */}
                    {formData.sendOption === "agendar" && (
                    <div className="space-y-4">
                      <div className="text-sm font-medium text-gray-700 mb-4">
                      Selecione a data e horário para envio:
                      </div>
                      <Calendar20 />
                    </div>
                    )}
                    
                    <Button
                    type="submit"
                    disabled={isCreatingCampaign || availableEmulators.length === 0}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all disabled:opacity-50"
                    >
                    {isCreatingCampaign ? (
                      <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Criando Campanha...
                      </>
                    ) : availableEmulators.length === 0 ? (
                      <>
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Configure um Emulador Primeiro
                      </>
                    ) : (
                      <>
                      <Send className="mr-2 h-5 w-5" />
                      {formData.sendOption === "disparar_agora" 
                        ? "Disparar Campanha Agora" 
                        : "Agendar Campanha"
                      }
                      </>
                    )}
                    </Button>
                </CardContent>
              </Card>
            </div>

            {/* Prévia do WhatsApp */}
            <div className="xl:col-span-2">
              <div className="sticky top-8">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl">Prévia da Mensagem</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Veja como sua mensagem aparecerá no WhatsApp
                      {selectedEmulatorData && (
                        <span className="block mt-1 text-xs">
                          via {selectedEmulatorData.name}
                        </span>
                      )}
                    </p>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <IPhoneMockup 
                      message={formData.message} 
                      imageUrl={filePreviewUrl} 
                      selectedLead={selectedLeadData} 
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}