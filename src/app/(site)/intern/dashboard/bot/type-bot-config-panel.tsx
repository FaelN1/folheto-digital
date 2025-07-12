"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Re-defina a interface Typebot aqui ou importe-a se estiver em um arquivo compartilhado
interface Typebot {
  id: string
  name: string
  description: string
  isActive: boolean
  createdAt: string
  avatarUrl: string
  language: string
  themeColor: string
  initialMessage: string
}

interface TypebotConfigPanelProps {
  typebot: Typebot
  onSave: (updatedBot: Typebot) => void
  onCancel: () => void
}

export  function TypebotConfigPanel({ typebot, onSave, onCancel }: TypebotConfigPanelProps) {
  const [formData, setFormData] = useState<Typebot>(typebot)

  // Atualiza o estado do formulário quando o typebot selecionado muda
  useEffect(() => {
    setFormData(typebot)
  }, [typebot])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: keyof Typebot, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleToggleChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }))
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, themeColor: e.target.value }))
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatarUrl: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Card className="flex-1 flex flex-col rounded-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between border-b p-4">
        <CardTitle className="text-lg">Configurações: {typebot.name}</CardTitle>
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[calc(100vh-300px)]">
        {/* Informações Básicas */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Informações Básicas</h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Bot</Label>
              <Input id="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" value={formData.description} onChange={handleChange} rows={3} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="avatarUrl">Avatar</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={formData.avatarUrl || "/placeholder.svg"} alt="Bot Avatar" />
                  <AvatarFallback>{formData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Input id="avatarUpload" type="file" accept="image/*" onChange={handleAvatarUpload} />
                  <p className="text-xs text-muted-foreground mt-1">Nenhum ficheiro selecionado</p>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="language">Idioma</Label>
              <Select value={formData.language} onValueChange={(value) => handleSelectChange("language", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">Inglês (EUA)</SelectItem>
                  <SelectItem value="es-ES">Espanhol (Espanha)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">Status</Label>
              <Switch id="isActive" checked={formData.isActive} onCheckedChange={handleToggleChange} />
            </div>
          </div>
        </div>

        {/* Configurações Customizáveis */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Configurações Customizáveis</h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="themeColor">Cor do Tema</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="themeColor"
                  type="color"
                  value={formData.themeColor}
                  onChange={handleColorChange}
                  className="w-12 h-12 p-1 border rounded"
                />
                <Input id="themeColorHex" value={formData.themeColor} onChange={handleColorChange} className="flex-1" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="initialMessage">Mensagem Inicial</Label>
              <Textarea id="initialMessage" value={formData.initialMessage} onChange={handleChange} rows={3} />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t p-4">
        <Button onClick={() => onSave(formData)}>Salvar Alterações</Button>
      </CardFooter>
    </Card>
  )
}
