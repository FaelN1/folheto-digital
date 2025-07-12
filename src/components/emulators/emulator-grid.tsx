"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Pencil, Power, Phone, User } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Emulator {
  id: string
  name: string
  phone: string
  status: "CONNECTED" | "DISCONNECTED"
  companyId: string
  createdAt: string
  updatedAt: string
}

interface EmulatorGridProps {
  emulators: Emulator[]
  onViewDetails: (id: string) => void
  onEdit: (id: string) => void
  onToggleStatus: (id: string, currentStatus: "CONNECTED" | "DISCONNECTED") => void
}

export function EmulatorGrid({ emulators, onViewDetails, onEdit, onToggleStatus }: EmulatorGridProps) {
  if (emulators.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">Nenhum emulador encontrado.</div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {emulators.map((emulator) => (
        <Card key={emulator.id} className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {emulator.name}
            </CardTitle>
            <Badge variant={emulator.status === "CONNECTED" ? "default" : "destructive"}>
              {emulator.status === "CONNECTED" ? "Conectado" : "Desconectado"}
            </Badge>
          </CardHeader>
          <CardContent className="flex-1">
            <CardDescription className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              {emulator.phone}
            </CardDescription>
            <p className="text-xs text-muted-foreground mt-2">
              Criado em: {format(new Date(emulator.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
            </p>
            <p className="text-xs text-muted-foreground">
              Atualizado em: {format(new Date(emulator.updatedAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
            </p>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 pt-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails(emulator.id)}>
                  <Eye className="mr-2 h-4 w-4" /> Ver detalhes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(emulator.id)}>
                  <Pencil className="mr-2 h-4 w-4" /> Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Power className="mr-2 h-4 w-4" /> Mudar status
                  </div>
                  <Switch
                    checked={emulator.status === "CONNECTED"}
                    onCheckedChange={() => onToggleStatus(emulator.id, emulator.status)}
                    aria-label={`Toggle status for ${emulator.name}`}
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
