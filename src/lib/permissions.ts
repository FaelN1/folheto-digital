// Tipos de roles disponíveis
export type UserRole = 'MASTER' | 'ADMIN' | 'USER' | 'GUEST';

// Tipos de permissões/features disponíveis
export type Permission =
  | 'dashboard.view'
  | 'campaign.view'
  | 'campaign.create'
  | 'campaign.edit'
  | 'campaign.delete'
  | 'leads.view'
  | 'leads.export'
  | 'leads.delete'
  | 'lead.create'
  | 'bot.view'
  | 'bot.configure'
  | 'channels.view'
  | 'channels.create'
  | 'channels.edit'
  | 'channels.delete'
  | 'reports.view'
  | 'reports.advanced'
  | 'settings.view'
  | 'settings.company'
  | 'settings.users'
  | 'settings.billing'
  | 'system.admin'
  | 'system.logs'
  | 'system.database'
  | 'system.backup'
  | 'emulator.view'
  | 'emulator.create'
  | 'emulator.delete'
  | 'emulator.refresh'
  | 'emulator.edit'
  | 'system.maintenance';

// Configuração de permissões por role
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  MASTER: [
    // Dashboard
    'dashboard.view',

    // Campaign - Acesso total
    'campaign.view',
    'campaign.create',
    'campaign.edit',
    'campaign.delete',

    // Leads - Acesso total
    'leads.view',
    'leads.export',
    'leads.delete',

    // Bot - Acesso total
    'bot.view',
    'bot.configure',

    // Channels - Acesso total
    'channels.view',
    'channels.create',
    'channels.edit',
    'channels.delete',

    // Reports - Acesso total
    'reports.view',
    'reports.advanced',

    // Settings - Acesso total
    'settings.view',
    'settings.company',
    'settings.users',
    'settings.billing',

    // System - Acesso exclusivo do MASTER
    'system.admin',
    'system.logs',
    'system.database',
    'system.backup',
    'system.maintenance',

    // Emulator - Acesso total
    'emulator.view',
    'emulator.create',
    'emulator.delete',
    'emulator.edit',
    'emulator.refresh',
  ],

  ADMIN: [
    // Dashboard
    'dashboard.view',

    // Campaign - Acesso total
    'campaign.view',
    'campaign.create',
    'campaign.edit',
    'campaign.delete',

    // Leads - Acesso total
    'leads.view',
    'leads.export',
    'leads.delete',

    // Bot - Acesso total
    'bot.view',
    'bot.configure',

    // Channels - Acesso total
    'channels.view',
    'channels.create',
    'channels.edit',
    'channels.delete',

    // Reports - Acesso total
    'reports.view',
    'reports.advanced',

    // Settings - Acesso total (exceto system)
    'settings.view',
    'settings.company',
    'settings.users',
    'settings.billing',

    // Emulator - Acesso total
    'emulator.view',
    'emulator.refresh',
  ],

  USER: [
    // Dashboard
    'dashboard.view',

    // Campaign - Apenas visualização e edição
    'campaign.view',
    'campaign.edit',

    // Leads - Apenas visualização
    'leads.view',

    // Bot - SEM ACESSO (conforme solicitado)

    // Channels - Apenas visualização
    'channels.view',

    // Reports - Apenas relatórios básicos
    'reports.view',

    // Settings - Apenas visualização do perfil
    'settings.view',

    'emulator.view',
    'emulator.refresh',
  ],

  GUEST: [
    // Apenas dashboard (página de pending-company)
    'dashboard.view',
  ],
};

// Configuração de navegação por role
export type NavItem = {
  title: string;
  url: string;
  icon: any;
  isActive?: boolean;
  requiredPermissions: Permission[];
  items?: Array<{
    title: string;
    url: string;
    requiredPermissions: Permission[];
  }>;
};

export const NAVIGATION_CONFIG: NavItem[] = [
  {
    title: "Dashboard",
    url: "/intern/dashboard",
    icon: "LayoutDashboard",
    isActive: true,
    requiredPermissions: ['dashboard.view'],
  },
  {
    title: "Campanha",
    url: "/intern/dashboard/campaign",
    icon: "Megaphone",
    requiredPermissions: ['campaign.view'],
  },
  {
    title: "Leads",
    url: "/intern/dashboard/leads",
    icon: "Users",
    requiredPermissions: ['leads.view'],
  },
  {
    title: "Bot",
    url: "/intern/dashboard/bot",
    icon: "Bot",
    requiredPermissions: ['bot.view'], // USER não tem essa permissão
  },
  {
    title: "Canais",
    url: "/intern/dashboard/emulators",
    icon: "Share2",
    requiredPermissions: ['channels.view'],
  },
  {
    title: "Relatórios",
    url: "/intern/dashboard/reports",
    icon: "BarChart2",
    requiredPermissions: ['reports.view'],
  },
  //   {
  //     title: "Configurações",
  //     url: "/intern/dashboard/settings",
  //     icon: "Settings",
  //     requiredPermissions: ['settings.view'],
  //   },
  {
    title: "Sistema",
    url: "/intern/dashboard/system",
    icon: "Shield",
    requiredPermissions: ['system.admin'], // Apenas MASTER
  },
];

// Função helper para verificar permissões
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  return rolePermissions.includes(permission);
}

// Função helper para verificar múltiplas permissões (AND)
export function hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}

// Função helper para verificar se tem alguma das permissões (OR)
export function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

// Função para filtrar itens de navegação baseado nas permissões do usuário
export function getFilteredNavigation(userRole: UserRole): NavItem[] {
  return NAVIGATION_CONFIG.filter(item =>
    hasAllPermissions(userRole, item.requiredPermissions)
  ).map(item => ({
    ...item,
    items: item.items?.filter(subItem =>
      hasAllPermissions(userRole, subItem.requiredPermissions)
    )
  }));
}
