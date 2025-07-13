import { useAuth } from '@/contexts/AuthContext';
import { 
  Permission, 
  UserRole, 
  hasPermission, 
  hasAllPermissions, 
  hasAnyPermission,
  getFilteredNavigation,
  ROLE_PERMISSIONS 
} from '@/lib/permissions';

export const usePermissions = () => {
  const { user } = useAuth();
  
  const userRole = (user?.role as UserRole) || 'GUEST';
  
  return {
    // Informações do usuário
    userRole,
    user,
    
    // Funções de verificação de permissão
    hasPermission: (permission: Permission) => hasPermission(userRole, permission),
    hasAllPermissions: (permissions: Permission[]) => hasAllPermissions(userRole, permissions),
    hasAnyPermission: (permissions: Permission[]) => hasAnyPermission(userRole, permissions),
    
    // Navegação filtrada
    getFilteredNavigation: () => getFilteredNavigation(userRole),
    
    // Todas as permissões do usuário atual
    getUserPermissions: () => ROLE_PERMISSIONS[userRole] || [],
    
    // Helpers específicos para funcionalidades comuns
    canViewDashboard: () => hasPermission(userRole, 'dashboard.view'),
    canManageCampaigns: () => hasPermission(userRole, 'campaign.create'),
    canDeleteLeads: () => hasPermission(userRole, 'leads.delete'),
    canConfigureBot: () => hasPermission(userRole, 'bot.configure'),
    canManageUsers: () => hasPermission(userRole, 'settings.users'),
    canViewAdvancedReports: () => hasPermission(userRole, 'reports.advanced'),
    canAccessSystem: () => hasPermission(userRole, 'system.admin'),
    canViewSystemLogs: () => hasPermission(userRole, 'system.logs'),
    canManageDatabase: () => hasPermission(userRole, 'system.database'),

    // Leads Helpers
    canCreateLead: () => hasPermission(userRole, 'lead.create'),
    
    // Emulator Helpers
    canViewEmulator: () => hasPermission(userRole, 'emulator.view'),
    canCreateEmulator: () => hasPermission(userRole, 'emulator.create'),
    canDeleteEmulator: () => hasPermission(userRole, 'emulator.delete'),
    canEditEmulator: () => hasPermission(userRole, 'emulator.edit'),
    canRefreshEmulator: () => hasPermission(userRole, 'emulator.refresh'),


    // Helper para verificar roles
    isMaster: () => userRole === 'MASTER',
    isAdmin: () => userRole === 'ADMIN',
    isUser: () => userRole === 'USER',
    isGuest: () => userRole === 'GUEST',
  };
};
