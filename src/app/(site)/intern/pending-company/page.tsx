'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Building2, Clock, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function PendingCompanyPage() {
  const { user, getMe, checkUserStatus, logout } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [isAutoChecking, setIsAutoChecking] = useState(false);

  useEffect(() => {
    // Toast de boas-vindas
    toast.info('Verificação automática ativada', {
      description: 'Sua conta será verificada automaticamente a cada 1 minuto.',
      duration: 4000,
    });

    // Verificar status a cada 1 minuto
    const interval = setInterval(async () => {
      try {
        setIsAutoChecking(true);
        await getMe();
        checkUserStatus();
        setLastCheck(new Date());
      } catch (error) {
        console.error('Erro ao verificar status:', error);
      } finally {
        setIsAutoChecking(false);
      }
    }, 60000); // 1 minuto

    return () => clearInterval(interval);
  }, [getMe, checkUserStatus]);

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    toast.info('Verificando status da conta...', {
      duration: 2000,
    });

    try {
      await getMe();
      checkUserStatus();
      setLastCheck(new Date());
      
      // Verificar se ainda é GUEST sem company após a atualização
      const isStillPending = user?.role === 'GUEST' && (!user?.companyId || user?.companyId === '');
      
      if (isStillPending) {
        toast.warning('Status inalterado', {
          description: 'Sua conta ainda está aguardando associação a uma empresa.',
          duration: 3000,
        });
      } else {
        toast.success('Status atualizado!', {
          description: 'Redirecionando para o dashboard...',
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao verificar status', {
        description: 'Tente novamente em alguns instantes.',
        duration: 3000,
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center relative">
            <Building2 className="h-8 w-8 text-orange-600" />
            {isAutoChecking && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-pulse">
                <div className="w-full h-full bg-blue-400 rounded-full animate-ping"></div>
              </div>
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Aguardando Empresa
          </CardTitle>
          <CardDescription className="text-gray-600">
            Sua conta está pendente de associação a uma empresa. Entre em contato com seu administrador.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-yellow-800 mb-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Informações da Conta</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-yellow-700">
                <span className="font-semibold">Usuário:</span> {user?.name}
              </p>
              <p className="text-sm text-yellow-700">
                <span className="font-semibold">Email:</span> {user?.email}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">O que fazer agora?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Entre em contato com o administrador da empresa</li>
              <li>• Aguarde a associação da sua conta a uma empresa</li>
              <li>• Esta página verificará automaticamente seu status</li>
              <li>• Você será redirecionado quando tudo estiver pronto</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleRefreshStatus}
              className="w-full"
              variant="outline"
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              {isRefreshing ? 'Verificando...' : 'Verificar Status'}
            </Button>

            <Button 
              onClick={logout}
              variant="secondary"
              className="w-full"
              disabled={isRefreshing}
            >
              Sair da Conta
            </Button>
          </div>

          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500">
              Esta página verifica automaticamente seu status a cada 1 minuto.
              Você será redirecionado assim que sua conta for associada a uma empresa.
            </p>
            <p className="text-xs text-gray-400">
              {isAutoChecking ? (
                <span className="text-blue-500 font-medium">🔄 Verificando agora...</span>
              ) : lastCheck ? (
                `Última verificação: ${lastCheck.toLocaleTimeString('pt-BR')}`
              ) : (
                'Aguardando primeira verificação...'
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
