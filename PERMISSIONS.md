# Sistema de Controle de Acesso por Roles

Este sistema implementa um controle de acesso granular baseado em roles (MASTER, ADMIN, USER, GUEST) com permissões específicas para cada funcionalidade.

## 🏗️ Arquitetura

### 1. **Configuração de Permissões** (`src/lib/permissions.ts`)
- Define tipos de roles e permissões
- Mapeia permissões por role
- Funções helper para verificação de acesso

### 2. **Hook de Permissões** (`src/hooks/usePermissions.ts`)
- Interface para verificar permissões
- Helpers específicos para funcionalidades comuns
- Navegação filtrada baseada em permissões

### 3. **Componentes de Proteção**
- `PermissionGuard`: Protege elementos da UI
- `RouteGuard`: Protege rotas inteiras

## 🔐 Configuração de Roles

### MASTER (Dono do Sistema)

- ✅ **TODOS** os acessos de ADMIN
- ✅ Acesso ao painel de sistema
- ✅ Logs e monitoramento avançado
- ✅ Gerenciamento de banco de dados
- ✅ Sistema de backup e manutenção
- 🔴 **Acesso crítico e irrestrito**

### ADMIN (Acesso Total)

- ✅ Todas as funcionalidades de negócio
- ✅ Gerenciamento de usuários
- ✅ Configurações da empresa
- ✅ Relatórios avançados
- ❌ Funções de sistema (exclusivas do MASTER)

### USER (Acesso Limitado)

- ✅ Dashboard, Campanhas, Leads, Canais, Relatórios básicos
- ❌ **Bot** (conforme solicitado)
- ❌ Criação de campanhas
- ❌ Exclusão de leads
- ❌ Configurações avançadas

### GUEST (Mínimo)

- ✅ Apenas dashboard (página pending-company)

## 🎯 Exemplos de Uso

### 1. **Proteger Elementos da UI**
```tsx
import PermissionGuard from '@/components/PermissionGuard';

// Mostrar botão apenas para quem pode criar campanhas
<PermissionGuard permissions="campaign.create">
  <Button>Nova Campanha</Button>
</PermissionGuard>

// Mostrar para quem tem QUALQUER uma das permissões
<PermissionGuard permissions={['campaign.view', 'leads.view']} requireAll={false}>
  <NavItem />
</PermissionGuard>

// Com fallback personalizado
<PermissionGuard 
  permissions="settings.users" 
  fallback={<div>Acesso negado</div>}
>
  <UserManagement />
</PermissionGuard>
```

### 2. **Proteger Rotas Inteiras**
```tsx
import RouteGuard from '@/components/RouteGuard';

// Proteger página do bot (USER não pode acessar)
<RouteGuard permissions="bot.view" redirectTo="/intern/dashboard">
  <BotPage />
</RouteGuard>

// Proteger com múltiplas permissões
<RouteGuard 
  permissions={['settings.users', 'settings.company']} 
  redirectTo="/intern/dashboard"
  showToast={true}
>
  <AdvancedSettings />
</RouteGuard>
```

### 3. **Verificações Programáticas**
```tsx
import { usePermissions } from '@/hooks/usePermissions';

function MyComponent() {
  const { 
    hasPermission, 
    isAdmin, 
    canDeleteLeads,
    getFilteredNavigation 
  } = usePermissions();

  if (hasPermission('campaign.create')) {
    // Mostrar formulário de criação
  }

  if (isAdmin()) {
    // Funcionalidades de admin
  }

  const navigation = getFilteredNavigation(); // Itens permitidos
}
```

## 🗂️ Navegação Dinâmica

A sidebar é automaticamente filtrada baseada nas permissões:

- **MASTER**: Vê todos os itens + painel "Sistema"
- **ADMIN**: Vê todos os itens exceto "Sistema"
- **USER**: Vê tudo exceto "Bot" e "Sistema"
- **GUEST**: Vê apenas dashboard (redirecionado para pending-company)

## 🛡️ Implementação na Página do Bot

A página do bot (`/intern/dashboard/bot`) agora tem:

1. **Proteção de Rota**: USER não consegue acessar
2. **Proteção de Funcionalidades**: Botões de criação/edição protegidos
3. **Fallback Gracioso**: Mensagem explicativa quando sem permissão

## 🧪 Página de Demonstração

Acesse `/intern/permissions-demo` para ver exemplos práticos de:
- Botões condicionais
- Conteúdo baseado em permissões
- Verificações programáticas
- Lista de permissões do usuário atual

## 🔄 Fluxo de Funcionamento

1. **Login**: Usuário faz login e recebe role do backend
2. **Verificação**: Sistema mapeia role para permissões específicas
3. **Navegação**: Sidebar mostra apenas itens permitidos
4. **Proteção**: Rotas e elementos verificam permissões em tempo real
5. **Feedback**: Toasts e mensagens informam sobre restrições

## ⚡ Vantagens

- **Granular**: Controle fino sobre cada funcionalidade
- **Flexível**: Fácil adicionar novas permissões
- **Reativo**: Mudanças de role refletem instantaneamente
- **Seguro**: Proteção tanto na UI quanto nas rotas
- **Developer-Friendly**: APIs simples e intuitivas

Este sistema garante que usuários vejam apenas o que podem acessar, melhorando a experiência e segurança da aplicação! 🎉
