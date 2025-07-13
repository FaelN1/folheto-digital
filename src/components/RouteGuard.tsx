'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Permission } from '@/lib/permissions';
import { toast } from 'sonner';

interface RouteGuardProps {
  children: ReactNode;
  permissions: Permission | Permission[];
  redirectTo?: string;
  requireAll?: boolean;
  showToast?: boolean;
}

/**
 * Componente que protege rotas inteiras baseado em permissões
 * Redireciona para uma rota específica se não tiver acesso
 * 
 * @example
 * // Proteger rota do bot (USER não pode acessar)
 * <RouteGuard permissions="bot.view" redirectTo="/intern/dashboard">
 *   <BotPage />
 * </RouteGuard>
 * 
 * @example
 * // Proteger configurações avançadas
 * <RouteGuard 
 *   permissions={['settings.users', 'settings.company']} 
 *   redirectTo="/intern/dashboard"
 *   showToast={true}
 * >
 *   <AdvancedSettings />
 * </RouteGuard>
 */
export default function RouteGuard({ 
  children, 
  permissions, 
  redirectTo = '/intern/dashboard',
  requireAll = true,
  showToast = true
}: RouteGuardProps) {
  const { hasPermission, hasAllPermissions, hasAnyPermission, userRole } = usePermissions();
  const router = useRouter();
  
  useEffect(() => {
    let hasAccess = false;
    
    if (Array.isArray(permissions)) {
      hasAccess = requireAll 
        ? hasAllPermissions(permissions)
        : hasAnyPermission(permissions);
    } else {
      hasAccess = hasPermission(permissions);
    }
    
    if (!hasAccess) {
      if (showToast) {
        toast.error('Acesso negado', {
          description: `Seu perfil (${userRole}) não tem permissão para acessar esta página.`,
          duration: 4000,
        });
      }
      
      router.push(redirectTo);
    }
  }, [permissions, redirectTo, requireAll, showToast, hasPermission, hasAllPermissions, hasAnyPermission, userRole, router]);
  
  // Verificar acesso novamente para renderização
  let hasAccess = false;
  
  if (Array.isArray(permissions)) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  } else {
    hasAccess = hasPermission(permissions);
  }
  
  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return <>{children}</>;
}
