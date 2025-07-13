'use client';

import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Permission } from '@/lib/permissions';

interface PermissionGuardProps {
  children: ReactNode;
  permissions: Permission | Permission[];
  fallback?: ReactNode;
  requireAll?: boolean; // Se true, requer TODAS as permissões. Se false, requer QUALQUER uma
}

/**
 * Componente que protege elementos da UI baseado em permissões
 * 
 * @example
 * // Mostrar apenas para quem pode gerenciar campanhas
 * <PermissionGuard permissions="campaign.create">
 *   <Button>Nova Campanha</Button>
 * </PermissionGuard>
 * 
 * @example
 * // Mostrar para quem tem QUALQUER uma das permissões
 * <PermissionGuard permissions={['campaign.view', 'leads.view']} requireAll={false}>
 *   <NavItem />
 * </PermissionGuard>
 * 
 * @example
 * // Mostrar apenas para admins, com fallback
 * <PermissionGuard permissions="settings.users" fallback={<div>Acesso negado</div>}>
 *   <UserManagement />
 * </PermissionGuard>
 */
export default function PermissionGuard({ 
  children, 
  permissions, 
  fallback = null, 
  requireAll = true 
}: PermissionGuardProps) {
  const { hasPermission, hasAllPermissions, hasAnyPermission } = usePermissions();
  
  let hasAccess = false;
  
  if (Array.isArray(permissions)) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  } else {
    hasAccess = hasPermission(permissions);
  }
  
  if (!hasAccess) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}
