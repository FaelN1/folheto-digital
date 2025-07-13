"use client"

import { useState } from "react"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TypebotConfigPanel } from "./type-bot-config-panel" // Importa o painel de configuração
import RouteGuard from "@/components/RouteGuard"
import PermissionGuard from "@/components/PermissionGuard"

// Interface para o Typebot
interface Typebot {
  id: string
  name: string
  description: string
  isActive: boolean
  createdAt: string // e.g., "2023-01-15"
  avatarUrl: string
  language: string
  themeColor: string // e.g., "#4F46E5"
  initialMessage: string
}

// Dados mockados iniciais
const initialTypebots: Typebot[] = [
  {
    id: "1",
    name: "Bot de Suporte ao Cliente",
    description: "Responde a perguntas frequentes e direciona para o suporte humano.",
    isActive: true,
    createdAt: "2023-01-15",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    language: "pt-BR",
    themeColor: "#4F46E5",
    initialMessage: "Olá! Como posso ajudar você hoje?",
  },
  {
    id: "2",
    name: "Bot de Geração de Leads",
    description: "Coleta informações de contato de visitantes interessados.",
    isActive: false,
    createdAt: "2023-03-20",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    language: "en-US",
    themeColor: "#10B981",
    initialMessage: "Bem-vindo! Posso te ajudar a encontrar o que procura?",
  },
  {
    id: "3",
    name: "Bot de Perguntas Frequentes (FAQ)",
    description: "Fornece respostas rápidas para dúvidas comuns.",
    isActive: true,
    createdAt: "2023-05-10",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    language: "es-ES",
    themeColor: "#EF4444",
    initialMessage: "Hola! En qué puedo ayudarte?",
  },
]

export default function TypebotManagementPage() {
  const [typebots, setTypebots] = useState<Typebot[]>(initialTypebots)
  const [selectedTypebotId, setSelectedTypebotId] = useState<string | null>(null)
  const [isCreatingNew, setIsCreatingNew] = useState(false) // Indica se estamos criando um novo bot

  const selectedTypebot = selectedTypebotId ? typebots.find((bot) => bot.id === selectedTypebotId) : null

  const handleCreateBot = () => {
    const newId = (Number.parseInt(typebots[typebots.length - 1]?.id || "0") + 1).toString()
    const newBot: Typebot = {
      id: newId,
      name: `Novo Typebot ${newId}`,
      description: "Este é um novo Typebot.",
      isActive: false,
      createdAt: new Date().toISOString().split("T")[0], // Data atual
      avatarUrl: "/placeholder.svg?height=40&width=40",
      language: "pt-BR",
      themeColor: "#6B7280",
      initialMessage: "Olá! Sou um novo bot.",
    }
    setTypebots((prev) => [...prev, newBot])
    setSelectedTypebotId(newId) // Seleciona o novo bot para edição
    setIsCreatingNew(true) // Define o estado de criação
  }

  const handleSaveBot = (updatedBot: Typebot) => {
    setTypebots((prev) => prev.map((bot) => (bot.id === updatedBot.id ? updatedBot : bot)))
    setSelectedTypebotId(null) // Desseleciona após salvar
    setIsCreatingNew(false) // Reseta o estado de criação
  }

  const handleCancelEdit = () => {
    if (isCreatingNew && selectedTypebot) {
      // Se era um bot novo e foi cancelado, remove-o da lista
      setTypebots((prev) => prev.filter((bot) => bot.id !== selectedTypebot.id))
    }
    setSelectedTypebotId(null) // Desseleciona
    setIsCreatingNew(false) // Reseta o estado de criação
  }

  const handleToggleStatus = (id: string) => {
    setTypebots((prev) => prev.map((bot) => (bot.id === id ? { ...bot, isActive: !bot.isActive } : bot)))
  }

  const handleDeleteBot = (id: string) => {
    if (confirm("Tem certeza que deseja deletar este Typebot?")) {
      setTypebots((prev) => prev.filter((bot) => bot.id !== id))
      if (selectedTypebotId === id) {
        setSelectedTypebotId(null) // Desseleciona se o bot deletado estava selecionado
      }
      alert(`Typebot com ID: ${id} deletado.`)
    }
  }

  return (
    <RouteGuard permissions="bot.view">
      <div className="flex h-full w-full bg-gray-50 min-h-[calc(100vh-200px)]">
        {/* Painel Esquerdo: Lista de Typebots */}
        <div className="w-1/3 border-r">
          <Card className="h-full rounded-none border-0 border-r">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Typebots</CardTitle>
                <PermissionGuard permissions="bot.configure">
                  <Button size="sm" onClick={handleCreateBot}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Criar Novo
                  </Button>
                </PermissionGuard>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0 max-h-[calc(100vh-300px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {typebots.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                        Nenhum Typebot cadastrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    typebots.map((typebot) => (
                      <TableRow
                        key={typebot.id}
                        className={`cursor-pointer hover:bg-gray-50 ${selectedTypebotId === typebot.id ? "bg-blue-50" : ""}`}
                        onClick={() => setSelectedTypebotId(typebot.id)}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={typebot.avatarUrl || "/placeholder.svg"} alt={typebot.name} />
                              <AvatarFallback>{typebot.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{typebot.name}</span>
                              <span className="text-xs text-muted-foreground">{typebot.createdAt}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={typebot.isActive ? "default" : "secondary"} className="text-xs">
                            {typebot.isActive ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedTypebotId(typebot.id)
                              }}
                              aria-label={`Editar ${typebot.name}`}
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteBot(typebot.id)
                              }}
                              aria-label={`Deletar ${typebot.name}`}
                            >
                              <Trash2 className="h-3 w-3 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t p-4 text-sm text-muted-foreground">
              <span>Total: {typebots.length} Typebots</span>
            </CardFooter>
          </Card>
        </div>

        {/* Painel Direito: Configurações do Typebot */}
        <div className="flex-1">
          {selectedTypebot ? (
            <PermissionGuard
              permissions="bot.configure"
              fallback={
                <Card className="h-full rounded-none border-0">
                  <CardContent className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <h3 className="text-lg font-medium mb-2">Acesso Restrito</h3>
                      <p className="text-sm text-gray-500">
                        Você pode visualizar os bots, mas não tem permissão para configurá-los.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              }
            >
              <TypebotConfigPanel
                typebot={selectedTypebot}
                onSave={handleSaveBot}
                onCancel={handleCancelEdit}
              />
            </PermissionGuard>
          ) : (
            <Card className="flex-1 flex flex-col rounded-none shadow-none">
              <div className="flex flex-1 items-center justify-center text-muted-foreground p-8 text-center">
                <div className="max-w-md">
                  <h3 className="text-lg font-medium mb-2">Selecione um Typebot</h3>
                  <p className="text-sm">
                    Escolha um Typebot na lista à esquerda para configurar ou clique em "Criar Novo" para começar.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </RouteGuard>
  )
}
