"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Pencil, Power } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { EmulatorStatus } from "@/hooks/emulators/useEmulators"

interface Emulator {
  id: string
  name: string
  serverIp: string
  emulatorId: string
  status: "ONLINE" | "OFFLINE" | "ERROR" | "UNKNOWN"
  companyId: string
  createdAt: string
  updatedAt: string
}

interface EmulatorTableProps {
  emulators: Emulator[]
  onViewDetails: (id: string) => void
  onEdit: (id: string) => void
   onToggleStatus: (id: string, currentStatus: EmulatorStatus) => void 
}

export function EmulatorTable({ emulators, onViewDetails, onEdit, onToggleStatus }: EmulatorTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>IP do Servidor</TableHead>
            <TableHead>ID do Emulador</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead>Atualizado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emulators.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                Nenhum emulador encontrado.
              </TableCell>
            </TableRow>
          ) : (
            emulators.map((emulator) => (
              <TableRow key={emulator.id}>
                <TableCell className="font-medium">{emulator.name}</TableCell>
                <TableCell>{emulator.serverIp}</TableCell>
                <TableCell>{emulator.emulatorId}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      emulator.status === "ONLINE" ? "default" : 
                      emulator.status === "ERROR" ? "destructive" : 
                      "secondary"
                    }
                  >
                    {emulator.status === "ONLINE" ? "Online" :
                     emulator.status === "OFFLINE" ? "Offline" :
                     emulator.status === "ERROR" ? "Erro" : "Desconhecido"}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(emulator.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}</TableCell>
                <TableCell>{format(new Date(emulator.updatedAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}</TableCell>
                <TableCell className="text-right">
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
                          checked={emulator.status === "ONLINE"}
                          onCheckedChange={() => onToggleStatus(emulator.id, emulator.status as EmulatorStatus)}
                          aria-label={`Toggle status for ${emulator.name}`}
                        />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
