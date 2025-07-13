'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RouteGuard from '@/components/RouteGuard';
import PermissionGuard from '@/components/PermissionGuard';
import { usePermissions } from '@/hooks/usePermissions';
import { 
  Shield, 
  Database, 
  FileText, 
  HardDrive, 
  Settings, 
  Users, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function SystemPage() {
  const { userRole, user } = usePermissions();

  const systemStats = {
    uptime: '99.8%',
    activeUsers: 1247,
    databaseSize: '2.3 GB',
    lastBackup: '2 horas atrás',
    serverLoad: '45%',
    errors: 3
  };

  return (
    <RouteGuard permissions="system.admin">
      <div className="container mx-auto p-6 space-y-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-red-600" />
            <h1 className="text-3xl font-bold">Painel do Sistema</h1>
            <Badge variant="destructive">MASTER ONLY</Badge>
          </div>
          <p className="text-gray-600">
            Área restrita para administradores do sistema. Acesso exclusivo para role MASTER.
          </p>
        </div>

        {/* Status do Sistema */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uptime do Sistema</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{systemStats.uptime}</div>
              <p className="text-xs text-muted-foreground">
                Sistema operacional
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                Conectados agora
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Carga do Servidor</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{systemStats.serverLoad}</div>
              <p className="text-xs text-muted-foreground">
                Uso de recursos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Ferramentas do Sistema */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PermissionGuard permissions="system.logs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Logs do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Visualizar e analisar logs de sistema, erros e atividades.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Erros hoje:</span>
                    <Badge variant="destructive">{systemStats.errors}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Último backup:</span>
                    <span className="text-gray-500">{systemStats.lastBackup}</span>
                  </div>
                </div>
                <Button className="w-full">Ver Logs</Button>
              </CardContent>
            </Card>
          </PermissionGuard>

          <PermissionGuard permissions="system.database">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Gerenciamento de Banco
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Administrar banco de dados, backups e otimizações.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Tamanho do DB:</span>
                    <span className="font-medium">{systemStats.databaseSize}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <Badge variant="default">Saudável</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">Backup Manual</Button>
                  <Button variant="secondary" className="w-full">Otimizar DB</Button>
                </div>
              </CardContent>
            </Card>
          </PermissionGuard>

          <PermissionGuard permissions="system.backup">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  Sistema de Backup
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Configurar e gerenciar backups automáticos do sistema.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Backup automático:</span>
                    <Badge variant="default">Ativo</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Frequência:</span>
                    <span className="text-sm font-medium">Diário às 02:00</span>
                  </div>
                  <Button variant="outline" className="w-full">Configurar Backups</Button>
                </div>
              </CardContent>
            </Card>
          </PermissionGuard>

          <PermissionGuard permissions="system.maintenance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Manutenção
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Ferramentas de manutenção e configuração avançada.
                </p>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">Limpar Cache</Button>
                  <Button variant="outline" className="w-full">Reiniciar Serviços</Button>
                  <Button variant="destructive" className="w-full">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Modo Manutenção
                  </Button>
                </div>
              </CardContent>
            </Card>
          </PermissionGuard>
        </div>

        {/* Informações de Acesso */}
        <Card>
          <CardHeader>
            <CardTitle>Informações de Acesso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Usuário Atual</p>
                <p className="text-sm">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Role</p>
                <Badge variant="destructive">{userRole}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                <p className="text-sm">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Última Atividade</p>
                <p className="text-sm flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Agora
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aviso de Segurança */}
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 mb-1">Área Crítica do Sistema</h4>
                <p className="text-sm text-red-800">
                  Esta área contém ferramentas críticas que podem afetar todo o sistema. 
                  Use com extremo cuidado. Todas as ações são registradas e monitoradas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </RouteGuard>
  );
}
