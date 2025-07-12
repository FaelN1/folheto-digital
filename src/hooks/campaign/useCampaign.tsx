import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/axios";
import { toast } from "sonner";

/**
 * ---------------------------------------------------------------------------
 * 📑 Types & Interfaces
 * ---------------------------------------------------------------------------
 */
export interface Campaign {
  id: string;
  name: string;
  description: string;
  companyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignParams {
  name: string;
  description?: string;
  companyId: string;
  files?: File[];
}

export interface UpdateCampaignParams {
  id: string;
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface CampaignsFilters {
  companyId?: string;
  emulatorId?: string;
  tagId?: string;
  status?: "active" | "inactive" | "completed";
  search?: string;
  page?: number;
  limit?: number;
}

export interface CampaignsResponse {
  campaigns: Campaign[];
  total: number;
  page: number;
  limit: number;
}

/**
 * ---------------------------------------------------------------------------
 * 🔑 React Query Keys
 * ---------------------------------------------------------------------------
 */
export const campaignKeys = {
  all: ["campaigns"] as const,
  lists: () => [...campaignKeys.all, "list"] as const,
  list: (filters: CampaignsFilters) => [...campaignKeys.lists(), filters] as const,
  company: (companyId: string) => [...campaignKeys.all, "company", companyId] as const,
  emulator: (emulatorId: string) => [...campaignKeys.all, "emulator", emulatorId] as const,
  tag: (tagId: string) => [...campaignKeys.all, "tag", tagId] as const,
  status: (status: string) => [...campaignKeys.all, "status", status] as const,
  detail: (id: string) => [...campaignKeys.all, "detail", id] as const,
};

/**
 * ---------------------------------------------------------------------------
 * 📡 API Functions
 * ---------------------------------------------------------------------------
 */

// GET /campaigns - Listar campanhas
const fetchCampaigns = async (filters?: CampaignsFilters): Promise<CampaignsResponse> => {
  const response = await api.get<CampaignsResponse>("/campaigns", {
    params: {
      page: filters?.page || 1,
      limit: filters?.limit || 10,
      search: filters?.search,
    },
  });
  return response.data;
};

// GET /campaigns/{id} - Buscar campanha por ID
const fetchCampaign = async (id: string): Promise<Campaign> => {
  const response = await api.get<Campaign>(`/campaigns/${id}`);
  return response.data;
};

// GET /campaigns/company/{companyId} - Buscar campanhas por empresa
const fetchCampaignsByCompany = async (companyId: string): Promise<Campaign[]> => {
  const response = await api.get<Campaign[]>(`/campaigns/company/${companyId}`);
  return response.data;
};

// GET /campaigns/emulator/{emulatorId} - Buscar campanhas por emulador
const fetchCampaignsByEmulator = async (emulatorId: string): Promise<Campaign[]> => {
  const response = await api.get<Campaign[]>(`/campaigns/emulator/${emulatorId}`);
  return response.data;
};

// GET /campaigns/tag/{tagId} - Buscar campanhas por tag
const fetchCampaignsByTag = async (tagId: string): Promise<Campaign[]> => {
  const response = await api.get<Campaign[]>(`/campaigns/tag/${tagId}`);
  return response.data;
};

// GET /campaigns/status/{status} - Buscar campanhas por status
const fetchCampaignsByStatus = async (status: string): Promise<Campaign[]> => {
  const response = await api.get<Campaign[]>(`/campaigns/status/${status}`);
  return response.data;
};

// POST /campaigns - Criar nova campanha
const createCampaign = async (data: CreateCampaignParams): Promise<Campaign> => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("companyId", data.companyId);
  
  if (data.description) {
    formData.append("description", data.description);
  }
  
  if (data.files && data.files.length > 0) {
    data.files.forEach((file, index) => {
      formData.append(`files`, file);
    });
  }

  const response = await api.post<Campaign>("/campaigns", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// PATCH /campaigns/{id} - Atualizar campanha
const updateCampaign = async (params: UpdateCampaignParams): Promise<Campaign> => {
  const { id, ...updateData } = params;
  const response = await api.patch<Campaign>(`/campaigns/${id}`, updateData);
  return response.data;
};

// DELETE /campaigns/{id} - Deletar campanha
const deleteCampaign = async (id: string): Promise<void> => {
  await api.delete(`/campaigns/${id}`);
};

/**
 * ---------------------------------------------------------------------------
 * 🪝 Custom Hooks
 * ---------------------------------------------------------------------------
 */

/**
 * useCampaigns — Hook principal para gerenciamento de campanhas
 * @param filters Filtros para as campanhas
 */
export function useCampaigns(filters?: CampaignsFilters) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Query para buscar campanhas
  const {
    data: campaignsData,
    isLoading: isLoadingCampaigns,
    error: campaignsError,
    refetch: refetchCampaigns,
  } = useQuery<CampaignsResponse, AxiosError>({
    queryKey: campaignKeys.list(filters || {}),
    queryFn: () => fetchCampaigns(filters),
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
  });

  // Mutation para criar nova campanha
  const createCampaignMutation = useMutation<Campaign, AxiosError, CreateCampaignParams>({
    mutationFn: createCampaign, 
    onSuccess: (data) => {
      // Invalidar cache relevante
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
      queryClient.invalidateQueries({ queryKey: campaignKeys.company(data.companyId) });
      
      toast.success("Campanha criada com sucesso!", {
        description: `A campanha "${data.name}" foi criada.`,
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Erro ao criar campanha";
      toast.error("Erro ao criar campanha", {
        description: errorMessage,
      });
    },
  });

  // Mutation para atualizar campanha
  const updateCampaignMutation = useMutation<Campaign, AxiosError, UpdateCampaignParams>({
    mutationFn: updateCampaign, 
    onSuccess: (data) => {
      // Atualizar cache específico
      queryClient.setQueryData<Campaign>(campaignKeys.detail(data.id), data);
      
      // Invalidar listas relacionadas
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
      queryClient.invalidateQueries({ queryKey: campaignKeys.company(data.companyId) });
      
      toast.success("Campanha atualizada com sucesso!", {
        description: `A campanha "${data.name}" foi atualizada.`,
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Erro ao atualizar campanha";
      toast.error("Erro ao atualizar campanha", {
        description: errorMessage,
      });
    },
  });

  // Mutation para deletar campanha
  const deleteCampaignMutation = useMutation<void, AxiosError, string>({
    mutationFn: deleteCampaign, 
    onSuccess: (_, deletedId) => {
      // Remover do cache
      queryClient.removeQueries({ queryKey: campaignKeys.detail(deletedId) });
      
      // Invalidar listas
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
      
      toast.success("Campanha removida com sucesso!");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Erro ao remover campanha";
      toast.error("Erro ao remover campanha", {
        description: errorMessage,
      });
    },
  });

  // Funções auxiliares com nomes diferentes para evitar conflito
  const handleCreateCampaign = async (params: CreateCampaignParams) => {
    setIsLoading(true);
    try {
      return await createCampaignMutation.mutateAsync(params);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCampaign = async (params: UpdateCampaignParams) => {
    setIsLoading(true);
    try {
      return await updateCampaignMutation.mutateAsync(params);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    setIsLoading(true);
    try {
      return await deleteCampaignMutation.mutateAsync(id);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para invalidar cache e recarregar dados
  const refreshCampaigns = () => {
    queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
  };

  return {
    // Dados
    campaigns: campaignsData?.campaigns || [],
    total: campaignsData?.total || 0,
    page: campaignsData?.page || 1,
    limit: campaignsData?.limit || 10,
    
    // Estados de loading
    isLoading: isLoading || isLoadingCampaigns,
    isCreatingCampaign: createCampaignMutation.isPending,
    isUpdatingCampaign: updateCampaignMutation.isPending,
    isDeletingCampaign: deleteCampaignMutation.isPending,
    
    // Erros
    error: campaignsError,
    createError: createCampaignMutation.error,
    updateError: updateCampaignMutation.error,
    deleteError: deleteCampaignMutation.error,
    
    // Ações (com nomes atualizados)
    createCampaign: handleCreateCampaign,
    updateCampaign: handleUpdateCampaign,
    deleteCampaign: handleDeleteCampaign,
    refreshCampaigns,
    refetchCampaigns,
    
    // Estados das mutations
    createCampaignMutation,
    updateCampaignMutation,
    deleteCampaignMutation,
  };
}

/**
 * useCampaign — Busca uma campanha específica por ID
 * @param id ID da campanha
 * @param options Opções do React Query
 */
export function useCampaign(
  id: string | undefined,
  options?: {
    enabled?: boolean;
    staleTime?: number;
  }
) {
  return useQuery<Campaign, AxiosError>({
    queryKey: campaignKeys.detail(id || ""),
    queryFn: () => fetchCampaign(id!),
    enabled: (options?.enabled ?? true) && !!id,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutos padrão
    retry: 3,
  });
}

/**
 * useCampaignsByCompany — Busca campanhas de uma empresa específica
 * @param companyId ID da empresa
 * @param options Opções do React Query
 */
export function useCampaignsByCompany(
  companyId: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
  }
) {
  return useQuery<Campaign[], AxiosError>({
    queryKey: campaignKeys.company(companyId),
    queryFn: () => fetchCampaignsByCompany(companyId),
    enabled: (options?.enabled ?? true) && !!companyId,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutos padrão
    retry: 3,
  });
}

/**
 * useCampaignsByEmulator — Busca campanhas de um emulador específico
 * @param emulatorId ID do emulador
 * @param options Opções do React Query
 */
export function useCampaignsByEmulator(
  emulatorId: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
  }
) {
  return useQuery<Campaign[], AxiosError>({
    queryKey: campaignKeys.emulator(emulatorId),
    queryFn: () => fetchCampaignsByEmulator(emulatorId),
    enabled: (options?.enabled ?? true) && !!emulatorId,
    staleTime: options?.staleTime ?? 5 * 60 * 1000,
    retry: 3,
  });
}

/**
 * useCampaignsByTag — Busca campanhas de uma tag específica
 * @param tagId ID da tag
 * @param options Opções do React Query
 */
export function useCampaignsByTag(
  tagId: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
  }
) {
  return useQuery<Campaign[], AxiosError>({
    queryKey: campaignKeys.tag(tagId),
    queryFn: () => fetchCampaignsByTag(tagId),
    enabled: (options?.enabled ?? true) && !!tagId,
    staleTime: options?.staleTime ?? 5 * 60 * 1000,
    retry: 3,
  });
}

/**
 * useCampaignsByStatus — Busca campanhas por status
 * @param status Status das campanhas
 * @param options Opções do React Query
 */
export function useCampaignsByStatus(
  status: "active" | "inactive" | "completed",
  options?: {
    enabled?: boolean;
    staleTime?: number;
  }
) {
  return useQuery<Campaign[], AxiosError>({
    queryKey: campaignKeys.status(status),
    queryFn: () => fetchCampaignsByStatus(status),
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 5 * 60 * 1000,
    retry: 3,
  });
}

/**
 * useCreateCampaign — Hook específico para criação de campanhas com opções customizadas
 * @param options Opções da mutation
 */
export function useCreateCampaign(options?: {
  onSuccess?: (data: Campaign, variables: CreateCampaignParams) => void;
  onError?: (error: AxiosError, variables: CreateCampaignParams) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation<Campaign, AxiosError, CreateCampaignParams>({
    mutationFn: createCampaign,
    onSuccess: (data, variables) => {
      // Atualizar cache de detalhes
      queryClient.setQueryData<Campaign>(campaignKeys.detail(data.id), data);

      // Invalidar listas relacionadas
      queryClient.invalidateQueries({ queryKey: campaignKeys.company(variables.companyId) });
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });

      options?.onSuccess?.(data, variables);
    },
    onError: options?.onError,
  });
}

/**
 * useUpdateCampaign — Hook específico para atualização de campanhas
 * @param options Opções da mutation
 */
export function useUpdateCampaign(options?: {
  onSuccess?: (data: Campaign, variables: UpdateCampaignParams) => void;
  onError?: (error: AxiosError, variables: UpdateCampaignParams) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation<Campaign, AxiosError, UpdateCampaignParams>({
    mutationFn: updateCampaign,
    onSuccess: (data, variables) => {
      // Atualizar cache de detalhes
      queryClient.setQueryData<Campaign>(campaignKeys.detail(variables.id), data);

      // Invalidar listas relacionadas
      queryClient.invalidateQueries({ queryKey: campaignKeys.company(data.companyId) });
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });

      options?.onSuccess?.(data, variables);
    },
    onError: options?.onError,
  });
}

/**
 * useDeleteCampaign — Hook específico para exclusão de campanhas
 * @param options Opções da mutation
 */
export function useDeleteCampaign(options?: {
  onSuccess?: (variables: string) => void;
  onError?: (error: AxiosError, variables: string) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, string>({
    mutationFn: deleteCampaign,
    onSuccess: (_, variables) => {
      // Remover do cache
      queryClient.removeQueries({ queryKey: campaignKeys.detail(variables) });
      
      // Invalidar listas
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });

      options?.onSuccess?.(variables);
    },
    onError: options?.onError,
  });
}