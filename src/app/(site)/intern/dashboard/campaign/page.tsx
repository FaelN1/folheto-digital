"use client"
import * as React from "react"
import { CalendarIcon, Send, Smile, X, Upload, Clock, Users, MessageCircle, ImageIcon, User } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { MultiSelectTags } from "@/components/ui/multi-select-tags" // Importe o novo componente

// Dados de exemplo
const canais = [
  { value: "whatsapp", label: "WhatsApp", icon: "💬" },
  { value: "email", label: "Email", icon: "📧" },
  { value: "sms", label: "SMS", icon: "📱" },
  { value: "instagram", label: "Instagram Direct", icon: "📷" },
]
const leads = [
  { id: "lead_001", name: "Ana Silva", phone: "(11) 99999-1234", email: "ana.silva@email.com" },
  { id: "lead_002", name: "Carlos Santos", phone: "(11) 88888-5678", email: "carlos.santos@email.com" },
  { id: "lead_003", name: "Maria Oliveira", phone: "(11) 77777-9012", email: "maria.oliveira@email.com" },
  { id: "lead_004", name: "João Pereira", phone: "(11) 66666-3456", email: "joao.pereira@email.com" },
  { id: "lead_005", name: "Fernanda Costa", phone: "(11) 55555-7890", email: "fernanda.costa@email.com" },
  { id: "lead_006", name: "Roberto Lima", phone: "(11) 44444-2468", email: "roberto.lima@email.com" },
]
const tagsOptions = [
  "Promoção",
  "Lançamento",
  "Boas-vindas",
  "Engajamento",
  "Suporte",
  "VIP",
  "Novo Cliente",
  "Reengajamento",
  "Upsell",
  "Cross-sell",
  "Feedback",
  "Aniversário",
  "Campanha X",
  "Campanha Y",
  "Inativo",
] // Adicionadas mais tags para testar
const horarios = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
]
import Picker from "@emoji-mart/react"
import data from "@emoji-mart/data"
import IPhoneMockup from "./IphoneMockup"

export default function CampaignsPage() {
  const [canalSelecionado, setCanalSelecionado] = React.useState("")
  const [selectedLead, setSelectedLead] = React.useState("")
  const [tagsSelecionadas, setTagsSelecionadas] = React.useState<string[]>([])
  const [mensagem, setMensagem] = React.useState("")
  const [arquivo, setArquivo] = React.useState<File | null>(null)
  const [arquivoPreviewUrl, setArquivoPreviewUrl] = React.useState<string | null>(null)
  const [opcaoEnvio, setOpcaoEnvio] = React.useState("disparar_agora")
  const [dataAgendamento, setDataAgendamento] = React.useState<Date>()
  const [horaAgendamento, setHoraAgendamento] = React.useState("")
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false)
  const selectedLeadData = leads.find((lead) => lead.id === selectedLead)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("O arquivo excede o limite de 10MB.")
        return
      }
      setArquivo(file)
      setArquivoPreviewUrl(URL.createObjectURL(file))
    }
  }
  const handleRemoveFile = () => {
    setArquivo(null)
    setArquivoPreviewUrl(null)
    const fileInput = document.getElementById("file-upload") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }
 function handleEmojiSelect(native: string) {
  const textarea = document.getElementById("mensagem") as HTMLTextAreaElement
  if (textarea) {
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newText = mensagem.substring(0, start) + native + mensagem.substring(end)
    setMensagem(newText)
    
    // Fechar o picker de emoji
    setShowEmojiPicker(false)
    
    // Restaurar posição do cursor após o React atualizar
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + native.length
      textarea.focus()
    }, 0)
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto py-8 px-4 ">
        {/* Header Elegante */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2"> Criador de Campanhas</h1>
          <p className="text-muted-foreground">Crie campanhas personalizadas e veja como ficam em tempo real</p>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Formulário Principal */}
          <div className="xl:col-span-3 space-y-6">
            {/* Configurações Básicas */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  Configurações da Campanha
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Canal e Lead */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="canal" className="text-sm font-semibold">
                      Canal de Envio
                    </Label>
                    <Select value={canalSelecionado} onValueChange={setCanalSelecionado}>
                      <SelectTrigger id="canal" className="h-11 w-full">
                        <SelectValue placeholder="Selecione o canal" />
                      </SelectTrigger>
                      <SelectContent>
                        {canais.map((canal) => (
                          <SelectItem key={canal.value} value={canal.value}>
                            <div className="flex items-center gap-2">
                              <span>{canal.icon}</span>
                              {canal.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lead" className="text-sm font-semibold">
                      Destinatário (Lead)
                    </Label>
                    <Select value={selectedLead} onValueChange={setSelectedLead}>
                      <SelectTrigger id="lead" className="h-11 w-full">
                        <SelectValue placeholder="Selecione um lead" />
                      </SelectTrigger>
                      <SelectContent>
                        {leads.map((lead) => (
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
                <MultiSelectTags
                  options={tagsOptions}
                  selected={tagsSelecionadas}
                  onSelect={setTagsSelecionadas}
                  label="Tags da Campanha"
                  placeholder="Selecione as tags da campanha"
                />
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
                    <span className="text-sm text-muted-foreground">{mensagem.length} / 2000 caracteres</span>
                  </div>
                    <div className="relative flex items-end">
                    <Textarea
                      id="mensagem"
                      placeholder="Digite sua mensagem aqui... Use emojis para torná-la mais expressiva! 😊"
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
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
             
{/* Upload de Arquivo */}
<div className="space-y-3">
  <Label className="text-sm font-semibold">Anexar Mídia</Label>
  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
    {arquivo ? (
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2 text-green-600">
          <Upload className="w-5 h-5" />
          <span className="font-medium">Arquivo anexado</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {arquivo.name} ({(arquivo.size / (1024 * 1024)).toFixed(2)} MB)
        </p>
        <Button variant="outline" onClick={handleRemoveFile} size="sm">
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
                <RadioGroup value={opcaoEnvio} onValueChange={setOpcaoEnvio} className="grid grid-cols-2 gap-4">
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
                {opcaoEnvio === "agendar" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Data</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal h-11",
                              !dataAgendamento && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dataAgendamento ? format(dataAgendamento, "PPP", { locale: ptBR }) : "Selecione a data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dataAgendamento}
                            onSelect={setDataAgendamento}
                            initialFocus
                            fixedWeeks
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hora" className="text-sm font-semibold">
                        Horário
                      </Label>
                      <Select value={horaAgendamento} onValueChange={setHoraAgendamento}>
                        <SelectTrigger id="hora" className="h-11 w-full">
                          <SelectValue placeholder="Selecione o horário" />
                        </SelectTrigger>
                        <SelectContent>
                          {horarios.map((hora) => (
                            <SelectItem key={hora} value={hora}>
                              {hora}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all"
                >
                  <Send className="mr-2 h-5 w-5" />
                  {opcaoEnvio === "disparar_agora" ? "Disparar Campanha Agora" : "Agendar Campanha"}
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
                  <p className="text-sm text-muted-foreground">Veja como sua mensagem aparecerá no WhatsApp</p>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <IPhoneMockup message={mensagem} imageUrl={arquivoPreviewUrl} selectedLead={selectedLeadData} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
