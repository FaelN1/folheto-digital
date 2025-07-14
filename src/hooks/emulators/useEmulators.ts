import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/axios";

/**
 * ---------------------------------------------------------------------------
 * 📑 Types & Interfaces
 * ---------------------------------------------------------------------------
 */
export enum EmulatorStatus {
  CONNECTED = "CONNECTED",
  DISCONNECTED = "DISCONNECTED",
}

export interface Emulator {
  id: string;
  name: string;
  phone: string;
  status: EmulatorStatus;
  companyId: string;
  createdAt: string; // ISODate
  updatedAt: string; // ISODate
}

export interface CreateEmulatorInput {
  name: string;
  phone: string;
  companyId: string;
}

export interface UpdateEmulatorInput {
  name?: string;
  phone?: string;
  status?: EmulatorStatus;
}

export interface UpdateEmulatorStatusInput {
  status: EmulatorStatus;
}

/**
 * ---------------------------------------------------------------------------
 * 🔑 React Query Keys
 * ---------------------------------------------------------------------------
 */
export const emulatorKeys = {
  all: ["emulators"] as const,
  lists: () => [...emulatorKeys.all, "list"] as const,
  list: (companyId?: string) => [...emulatorKeys.lists(), { companyId }] as const,
  details: () => [...emulatorKeys.all, "detail"] as const,
  detail: (id: string) => [...emulatorKeys.details(), id] as const,
};

/**
 * ---------------------------------------------------------------------------
 * 📡 API Functions
 * ---------------------------------------------------------------------------
 */

// GET /emulators/company/{companyId} - Obter emuladores/canais por empresa
const fetchEmulatorsByCompany = async (companyId: string): Promise<Emulator[]> => {
  const response = await api.get<Emulator[]>(`/emulators/company/${companyId}`);
  return response.data;
};

// GET /emulators/{id} - Obter emulador específico (se a rota existir)
const fetchEmulator = async (id: string): Promise<Emulator> => {
  const response = await api.get<Emulator>(`/emulators/${id}`);
  return response.data;
};

// POST /emulators - Criar novo emulador
const createEmulator = async (data: CreateEmulatorInput): Promise<Emulator> => {
  const response = await api.post<Emulator>("/emulators", data);
  return response.data;
};

// PUT /emulators/{id} - Atualizar emulador completo
const updateEmulator = async (id: string, data: UpdateEmulatorInput): Promise<Emulator> => {
  const response = await api.put<Emulator>(`/emulators/${id}`, data);
  return response.data;
};

// PATCH /emulators/{id}/status - Atualizar apenas status
const updateEmulatorStatus = async (id: string, data: UpdateEmulatorStatusInput): Promise<Emulator> => {
  const response = await api.patch<Emulator>(`/emulators/${id}/status`, data);
  return response.data;
};

// DELETE /emulators/{id} - Deletar emulador
const deleteEmulator = async (id: string): Promise<void> => {
  await api.delete(`/emulators/${id}`);
};

/**
 * ---------------------------------------------------------------------------
 * 🪝 Custom Hooks
 * ---------------------------------------------------------------------------
 */

/**
 * useEmulatorsByCompany — Busca emuladores/canais de uma empresa específica
 * @param companyId ID da empresa
 * @param options Opções do React Query
 */
export function useEmulatorsByCompany(
  companyId: string,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
    staleTime?: number;
  }
) {
  return useQuery<Emulator[], AxiosError>({
    queryKey: emulatorKeys.list(companyId),
    queryFn: () => fetchEmulatorsByCompany(companyId),
    enabled: (options?.enabled ?? true) && !!companyId,
    refetchInterval: options?.refetchInterval,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutos padrão
  });
}

/**
 * useEmulator — Busca um emulador específico por ID
 * @param id ID do emulador
 * @param options Opções do React Query
 */
export function useEmulator(
  id: string | undefined,
  options?: {
    enabled?: boolean;
    staleTime?: number;
  }
) {
  return useQuery<Emulator, AxiosError>({
    queryKey: emulatorKeys.detail(id ?? ""),
    queryFn: () => fetchEmulator(id as string),
    enabled: (options?.enabled ?? true) && !!id,
    staleTime: options?.staleTime ?? 5 * 60 * 1000,
  });
}

/**
 * useCreateEmulator — Mutation para criar um novo emulador
 * @param options Opções da mutation
 */
export function useCreateEmulator(options?: {
  onSuccess?: (data: Emulator, variables: CreateEmulatorInput) => void;
  onError?: (error: AxiosError, variables: CreateEmulatorInput) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation<Emulator, AxiosError, CreateEmulatorInput>({
    mutationFn: createEmulator,
    onSuccess: (data, variables) => {
      // Atualiza cache de detalhes
      queryClient.setQueryData<Emulator>(emulatorKeys.detail(data.id), data);

      // Invalida listas relacionadas
      queryClient.invalidateQueries({ queryKey: emulatorKeys.list(variables.companyId) });
      queryClient.invalidateQueries({ queryKey: emulatorKeys.lists() });

      options?.onSuccess?.(data, variables);
    },
    onError: options?.onError,
  });
}

/**
 * useUpdateEmulator — Mutation para atualizar um emulador (PUT)
 * @param options Opções da mutation
 */
export function useUpdateEmulator(options?: {
  onSuccess?: (data: Emulator, variables: { id: string; data: UpdateEmulatorInput }) => void;
  onError?: (error: AxiosError, variables: { id: string; data: UpdateEmulatorInput }) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation<Emulator, AxiosError, { id: string; data: UpdateEmulatorInput }>({
    mutationFn: ({ id, data }) => updateEmulator(id, data),
    onSuccess: (updated, variables) => {
      // Atualiza cache de detalhes
      queryClient.setQueryData<Emulator>(emulatorKeys.detail(variables.id), updated);

      // Atualiza listas otimisticamente
      queryClient.setQueriesData<Emulator[]>(
        { queryKey: emulatorKeys.lists() },
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map(emulator => 
            emulator.id === variables.id ? updated : emulator
          );
        }
      );

      // Invalida listas da empresa
      queryClient.invalidateQueries({ queryKey: emulatorKeys.list(updated.companyId) });

      options?.onSuccess?.(updated, variables);
    },
    onError: options?.onError,
  });
}

/**
 * useUpdateEmulatorStatus — Mutation para atualizar apenas o status (PATCH)
 * @param options Opções da mutation
 */
export function useUpdateEmulatorStatus(options?: {
  onSuccess?: (data: Emulator, variables: { id: string; status: EmulatorStatus }) => void;
  onError?: (error: AxiosError, variables: { id: string; status: EmulatorStatus }) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation<Emulator, AxiosError, { id: string; status: EmulatorStatus }>({
    mutationFn: ({ id, status }) => updateEmulatorStatus(id, { status }),
    onSuccess: (updated, variables) => {
      // Atualiza cache de detalhes
      queryClient.setQueryData<Emulator>(emulatorKeys.detail(variables.id), updated);

      // Atualiza listas otimisticamente
      queryClient.setQueriesData<Emulator[]>(
        { queryKey: emulatorKeys.lists() },
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map(emulator => 
            emulator.id === variables.id ? updated : emulator
          );
        }
      );

      options?.onSuccess?.(updated, variables);
    },
    onError: options?.onError,
  });
}

/**
 * useDeleteEmulator — Mutation para deletar um emulador
 * @param options Opções da mutation
 */
export function useDeleteEmulator(options?: {
  onSuccess?: (variables: string) => void;
  onError?: (error: AxiosError, variables: string) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, string>({
    mutationFn: deleteEmulator,
    onSuccess: (_, emulatorId) => {
      // Remove do cache de detalhes
      queryClient.removeQueries({ queryKey: emulatorKeys.detail(emulatorId) });

      // Remove das listas otimisticamente
      queryClient.setQueriesData<Emulator[]>(
        { queryKey: emulatorKeys.lists() },
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.filter(emulator => emulator.id !== emulatorId);
        }
      );

      // Invalida todas as listas para garantir consistência
      queryClient.invalidateQueries({ queryKey: emulatorKeys.lists() });

      options?.onSuccess?.(emulatorId);
    },
    onError: options?.onError,
  });
}

/**
 * ---------------------------------------------------------------------------
 * 🎯 Hooks de Conveniência
 * ---------------------------------------------------------------------------
 */

/**
 * useToggleEmulatorStatus — Hook de conveniência para alternar status
 * @param emulator Emulador atual
 * @param options Opções da mutation
 */
export function useToggleEmulatorStatus(
  emulator: Emulator,
  options?: {
    onSuccess?: (data: Emulator) => void;
    onError?: (error: AxiosError) => void;
  }
) {
  const updateStatus = useUpdateEmulatorStatus({
    onSuccess: (data) => options?.onSuccess?.(data),
    onError: (error) => options?.onError?.(error),
  });

  const toggle = () => {
    const newStatus = emulator.status === EmulatorStatus.CONNECTED 
      ? EmulatorStatus.DISCONNECTED 
      : EmulatorStatus.CONNECTED;
    
    updateStatus.mutate({ id: emulator.id, status: newStatus });
  };

  return {
    toggle,
    isLoading: updateStatus.isPending,
    error: updateStatus.error,
  };
}

