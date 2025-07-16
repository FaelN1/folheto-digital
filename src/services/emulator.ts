import api from "../lib/axios";

// Listar emuladores com filtros (paginado, status, companyId)
export const getEmulators = (params?: {
  page?: number;
  limit?: number;
  companyId?: string;
  status?: "ONLINE" | "OFFLINE" | "ERROR" | "UNKNOWN";
}) =>
  api.get("/emulators", { params });

// Obter emulador por ID
export const getEmulatorById = (id: string) =>
  api.get(`/emulators/${id}`);

// Criar emulador
export const createEmulator = (data: {
  name: string;
  serverIp: string;
  emulatorId: string;
  status: "ONLINE" | "OFFLINE" | "ERROR" | "UNKNOWN";
  companyId: string;
}) =>
  api.post("/emulators", data);

// Atualizar emulador
export const updateEmulator = (id: string, data: {
  name?: string;
  serverIp?: string;
  status?: "ONLINE" | "OFFLINE" | "ERROR" | "UNKNOWN";
}) =>
  api.put(`/emulators/${id}`, data);

// Sincronizar emuladores
export const syncEmulators = (data: {
  emulators: Array<{
    id: string;
    name: string;
    emulatorId: string;
    serverIp: string;
    status: "ONLINE" | "OFFLINE" | "ERROR" | "UNKNOWN";
    createdAt: string;
    _count?: { campaigns: number };
  }>;
  source: string;
  timestamp: number;
}) =>
  api.post("/emulators/sync", data);
