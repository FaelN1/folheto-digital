# Tela de Emuladores - Atualizada com a API

A tela de emuladores (canais) foi completamente refatorada para usar os endpoints e campos da documentação do emulators-api.

## Mudanças Implementadas

### 1. Serviço (src/services/emulator.ts)
- ✅ Implementação dos 5 endpoints da API:
  - `GET /emulators` com filtros (page, limit, companyId, status)
  - `GET /emulators/:id`
  - `POST /emulators`
  - `PUT /emulators/:id`
  - `POST /emulators/sync`

### 2. Hooks (src/hooks/emulators/useEmulators.ts)
- ✅ Atualização do enum `EmulatorStatus`: `ONLINE`, `OFFLINE`, `ERROR`, `UNKNOWN`
- ✅ Interface `Emulator` com campos corretos: `serverIp`, `emulatorId` (removido `phone`)
- ✅ Hook `useSyncEmulators` para sincronização
- ✅ Funções de API atualizadas para usar os endpoints corretos

### 3. Componentes

#### MetricCards
- ✅ Atualizado para status: ONLINE, OFFLINE, ERROR, UNKNOWN
- ✅ Removido referência ao campo `phone`

#### EmulatorTable
- ✅ Colunas: Nome, IP do Servidor, ID do Emulador, Status, Criado em, Atualizado em
- ✅ Status com cores apropriadas (Online=verde, Error=vermelho, outros=cinza)
- ✅ Switch para alternar entre ONLINE/OFFLINE

#### EmulatorGrid
- ✅ Layout em cards com IP do servidor e ID do emulador
- ✅ Status com badges coloridos
- ✅ Switch para alternar status

#### CreateEmulator
- ✅ Formulário com campos: Nome, IP do Servidor, ID do Emulador, Status, Empresa
- ✅ Validação de IP básica
- ✅ Seleção de status inicial

### 4. Tela Principal (page.tsx)
- ✅ Filtros atualizados para novos status
- ✅ Busca por nome, IP ou ID do emulador
- ✅ Botão de sincronização usando endpoint `/sync`
- ✅ Toggle entre ONLINE/OFFLINE
- ✅ Detalhes mostram IP e ID do emulador

## Endpoints Utilizados

1. **GET /emulators?companyId={id}** - Listar emuladores por empresa
2. **GET /emulators/{id}** - Obter emulador específico
3. **POST /emulators** - Criar novo emulador
4. **PUT /emulators/{id}** - Atualizar emulador
5. **POST /emulators/sync** - Sincronizar emuladores

## Estrutura de Dados da API

```typescript
interface Emulator {
  id: string;
  name: string;
  serverIp: string;
  emulatorId: string;
  status: "ONLINE" | "OFFLINE" | "ERROR" | "UNKNOWN";
  companyId: string;
  createdAt: string;
  updatedAt: string;
}
```

## Funcionalidades Implementadas

- ✅ Listagem paginada de emuladores
- ✅ Filtro por status (ONLINE, OFFLINE, ERROR, UNKNOWN)
- ✅ Busca por nome, IP ou ID do emulador
- ✅ Visualização em tabela ou grid
- ✅ Criação de novos emuladores
- ✅ Atualização de status
- ✅ Sincronização manual
- ✅ Métricas em cards (total, online, offline, com erro)
- ✅ Permissões por função do usuário

## Validações

- Nome do emulador obrigatório
- IP do servidor obrigatório e com formato válido
- ID do emulador obrigatório e único
- Status inicial selecionável
- Empresa obrigatória

A implementação está completa e alinhada com a documentação da API fornecida.
