import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const emulators = [
  { id: "E001", name: "Emulador Alpha", status: "Conectado", lastSeen: "2 minutos atrás" },
  { id: "E002", name: "Emulador Beta", status: "Desconectado", lastSeen: "1 hora atrás" },
  { id: "E003", name: "Emulador Gamma", status: "Conectado", lastSeen: "10 minutos atrás" },
  { id: "E004", name: "Emulador Delta", status: "Conectado", lastSeen: "5 minutos atrás" },
  { id: "E005", name: "Emulador Epsilon", status: "Desconectado", lastSeen: "1 dia atrás" },
]

export function EmulatorsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Canais</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Última Vez Visto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emulators.map((emulator) => (
              <TableRow key={emulator.id}>
                <TableCell className="font-medium">{emulator.id}</TableCell>
                <TableCell>{emulator.name}</TableCell>
                <TableCell>
                  <Badge variant={emulator.status === "Conectado" ? "default" : "destructive"}>{emulator.status}</Badge>
                </TableCell>
                <TableCell>{emulator.lastSeen}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
