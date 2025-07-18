import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Wifi, WifiOff, Clock } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

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

interface MetricCardsProps {
  emulators: Emulator[]
}

export function MetricCards({ emulators }: MetricCardsProps) {
  const totalEmulators = emulators.length
  const onlineEmulators = emulators.filter((e) => e.status === "ONLINE").length
  const offlineEmulators = emulators.filter((e) => e.status === "OFFLINE").length
  const errorEmulators = emulators.filter((e) => e.status === "ERROR").length
  const unknownEmulators = emulators.filter((e) => e.status === "UNKNOWN").length

  const latestUpdate = emulators.reduce((latest, emulator) => {
    const currentUpdate = new Date(emulator.updatedAt)
    return currentUpdate > latest ? currentUpdate : latest
  }, new Date(0)) // Initialize with a very old date

  const formattedLastUpdate =
    latestUpdate.getTime() === new Date(0).getTime()
      ? "N/A"
      : format(latestUpdate, "dd/MM/yyyy HH:mm", { locale: ptBR })

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Canais</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEmulators}</div>
          <p className="text-xs text-muted-foreground">Todos os canais registrados</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Canais Online</CardTitle>
          <Wifi className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{onlineEmulators}</div>
          <p className="text-xs text-muted-foreground">Atualmente online</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Canais Offline</CardTitle>
          <WifiOff className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{offlineEmulators}</div>
          <p className="text-xs text-muted-foreground">Atualmente offline</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Última Atualização</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formattedLastUpdate}</div>
          <p className="text-xs text-muted-foreground">Dados mais recentes</p>
        </CardContent>
      </Card>
    </div>
  )
}
