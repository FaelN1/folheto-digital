# API de Emuladores - Documentação de Integração

## Visão Geral

Esta API permite gerenciar emuladores do sistema, incluindo operações de sincronização, listagem, criação e atualização de emuladores.

## Base URL

```
http://localhost:3000/api/emulators
```

## Autenticação

Todas as rotas requerem autenticação via token Bearer no header:

```
Authorization: Bearer <seu-token-jwt>
```

## Endpoints

### 1. Sincronizar Emuladores

Sincroniza uma lista de emuladores com o sistema.

**Endpoint:** `POST /sync`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Body:**
```json
{
  "emulators": [
    {
      "id": "em_123",
      "name": "company1_emulator_name",
      "emulatorId": "EMU_001",
      "serverIp": "192.168.1.100",
      "status": "ONLINE",
      "createdAt": "2024-01-15T10:30:00Z",
      "_count": {
        "campaigns": 5
      }
    }
  ],
  "source": "external_system",
  "timestamp": 1705315800000
}
```

**Resposta de Sucesso (200):**
```json
{
  "synchronized": 1,
  "errors": []
}
```

**Resposta com Erros (200):**
```json
{
  "synchronized": 0,
  "errors": [
    "Empresa não encontrada para ID: company1",
    "Formato de nome inválido para emulador em_124: invalid_name"
  ]
}
```

### 2. Listar Emuladores

Lista todos os emuladores do sistema com paginação.

**Endpoint:** `GET /`

**Query Parameters:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)
- `companyId` (opcional): Filtrar por empresa
- `status` (opcional): Filtrar por status (ONLINE, OFFLINE, ERROR, UNKNOWN)

**Exemplo:**
```
GET /emulators?page=1&limit=20&status=ONLINE
```

**Resposta (200):**
```json
{
  "emulators": [
    {
      "id": "emu_001",
      "name": "Emulador Principal",
      "serverIp": "192.168.1.100",
      "emulatorId": "EMU_001",
      "status": "ONLINE",
      "companyId": "company1",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T15:20:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

### 3. Obter Emulador por ID

Retorna os detalhes de um emulador específico.

**Endpoint:** `GET /:id`

**Resposta (200):**
```json
{
  "id": "emu_001",
  "name": "Emulador Principal",
  "serverIp": "192.168.1.100",
  "emulatorId": "EMU_001",
  "status": "ONLINE",
  "companyId": "company1",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T15:20:00Z"
}
```

**Resposta de Erro (404):**
```json
{
  "error": "Emulador não encontrado"
}
```

### 4. Criar Emulador

Cria um novo emulador no sistema.

**Endpoint:** `POST /`

**Body:**
```json
{
  "name": "Novo Emulador",
  "serverIp": "192.168.1.101",
  "emulatorId": "EMU_002",
  "status": "OFFLINE",
  "companyId": "company1"
}
```

**Resposta (201):**
```json
{
  "id": "emu_002",
  "name": "Novo Emulador",
  "serverIp": "192.168.1.101",
  "emulatorId": "EMU_002",
  "status": "OFFLINE",
  "companyId": "company1",
  "createdAt": "2024-01-15T16:00:00Z",
  "updatedAt": "2024-01-15T16:00:00Z"
}
```

### 5. Atualizar Emulador

Atualiza um emulador existente.

**Endpoint:** `PUT /:id`

**Body:**
```json
{
  "name": "Emulador Atualizado",
  "serverIp": "192.168.1.102",
  "status": "ONLINE"
}
```

**Resposta (200):**
```json
{
  "id": "emu_001",
  "name": "Emulador Atualizado",
  "serverIp": "192.168.1.102",
  "emulatorId": "EMU_001",
  "status": "ONLINE",
  "companyId": "company1",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T16:30:00Z"
}
```

## Estruturas de Dados

### EmulatorStatus (Enum)
- `ONLINE`: Emulador online e funcionando
- `OFFLINE`: Emulador offline
- `ERROR`: Emulador com erro ou em manutenção
- `UNKNOWN`: Status desconhecido

### Regras de Nomenclatura

Para a sincronização automática, o campo `name` deve seguir o padrão:
```
{companyId}_{emulator_name}
```

Exemplo: `company1_emulator_principal`

## Exemplos de Uso com cURL

### Sincronizar Emuladores
```bash
curl -X POST http://localhost:3000/api/emulators/sync \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token-here" \
  -d '{
    "emulators": [
      {
        "id": "em_123",
        "name": "company1_emulator_test",
        "emulatorId": "EMU_001",
        "serverIp": "192.168.1.100",
        "status": "ONLINE",
        "createdAt": "2024-01-15T10:30:00Z",
        "_count": {
          "campaigns": 5
        }
      }
    ],
    "source": "external_system",
    "timestamp": 1705315800000
  }'
```

### Listar Emuladores
```bash
curl -X GET "http://localhost:3000/api/emulators?page=1&limit=10" \
  -H "Authorization: Bearer your-token-here"
```

### Obter Emulador por ID
```bash
curl -X GET http://localhost:3000/api/emulators/emu_001 \
  -H "Authorization: Bearer your-token-here"
```

### Criar Emulador
```bash
curl -X POST http://localhost:3000/api/emulators \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token-here" \
  -d '{
    "name": "Novo Emulador",
    "serverIp": "192.168.1.101",
    "emulatorId": "EMU_002",
    "status": "OFFLINE",
    "companyId": "company1"
  }'
```

## Códigos de Erro

- `400 Bad Request`: Dados de entrada inválidos
- `401 Unauthorized`: Token de autenticação inválido ou ausente
- `403 Forbidden`: Sem permissão para acessar o recurso
- `404 Not Found`: Emulador não encontrado
- `409 Conflict`: Emulador com emulatorId já existe
- `500 Internal Server Error`: Erro interno do servidor

## Logs e Depuração

O sistema registra logs detalhados para operações de sincronização. Para depuração, verifique os logs do console que incluem:

- Dados recebidos na sincronização
- Processo de validação de empresas
- Operações de criação/atualização de emuladores
- Erros detalhados com stack trace

## Notas Importantes

1. O `emulatorId` deve ser único no sistema
2. O `companyId` deve existir antes de criar/sincronizar emuladores
3. O campo `name` na sincronização deve seguir o padrão `{companyId}_{nome}`
4. Todas as datas devem estar no formato ISO 8601
5. O campo `_count.campaigns` é informativo e não afeta o funcionamento do emulador
