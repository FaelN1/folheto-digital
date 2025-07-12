import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";

// Types para a API de Tags
export interface Tag {
  id: string;
  name: string;
  color: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagParams {
  name: string;
  color: string;
  companyId: string;
}

export interface UpdateTagParams {
  id: string;
  name?: string;
  color?: string;
}

export interface TagsFilters {
  companyId?: string;
  emulatorId?: string;
  search?: string;
}

// Hook principal para gerenciamento de tags
export function useTags(filters?: TagsFilters) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Query para buscar tags por empresa
  const {
    data: tagsByCompany,
    isLoading: isLoadingTagsByCompany,
    error: tagsByCompanyError,
    refetch: refetchTagsByCompany,
  } = useQuery({
    queryKey: ["tags", "company", filters?.companyId],
    queryFn: async () => {
      if (!filters?.companyId) return [];
      const response = await api.get(`/tags/company/${filters.companyId}`);
      return response.data as Tag[];
    },
    enabled: !!filters?.companyId,
    staleTime: 10 * 60 * 1000, // 10 minutos
    retry: 3,
  });

  // Query para buscar tags por emulador
  const {
    data: tagsByEmulator,
    isLoading: isLoadingTagsByEmulator,
    error: tagsByEmulatorError,
    refetch: refetchTagsByEmulator,
  } = useQuery({
    queryKey: ["tags", "emulator", filters?.emulatorId],
    queryFn: async () => {
      if (!filters?.emulatorId) return [];
      const response = await api.get(`/tags/emulator/${filters.emulatorId}`);
      return response.data as Tag[];
    },
    enabled: !!filters?.emulatorId,
    staleTime: 10 * 60 * 1000,
    retry: 3,
  });

  // Mutation para criar nova tag
  const createTagMutation = useMutation({
    mutationFn: async (params: CreateTagParams) => {
      const response = await api.post("/tags", params);
      return response.data as Tag;
    },
    onSuccess: (data) => {
      // Invalidar cache relevante
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag criada com sucesso!", {
        description: `A tag "${data.name}" foi criada.`,
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Erro ao criar tag";
      toast.error("Erro ao criar tag", {
        description: errorMessage,
      });
    },
  });

  // Mutation para atualizar tag
  const updateTagMutation = useMutation({
    mutationFn: async (params: UpdateTagParams) => {
      const { id, ...updateData } = params;
      const response = await api.put(`/tags/${id}`, updateData);
      return response.data as Tag;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag atualizada com sucesso!", {
        description: `A tag "${data.name}" foi atualizada.`,
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Erro ao atualizar tag";
      toast.error("Erro ao atualizar tag", {
        description: errorMessage,
      });
    },
  });

  // Mutation para deletar tag
  const deleteTagMutation = useMutation({
    mutationFn: async (tagId: string) => {
      await api.delete(`/tags/${tagId}`);
      return tagId;
    },
    onSuccess: (deletedTagId) => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      // Também invalidar leads que podem ter essa tag
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Tag removida com sucesso!");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Erro ao remover tag";
      toast.error("Erro ao remover tag", {
        description: errorMessage,
      });
    },
  });

  // Funções auxiliares
  const createTag = async (params: CreateTagParams) => {
    setIsLoading(true);
    try {
      return await createTagMutation.mutateAsync(params);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTag = async (params: UpdateTagParams) => {
    setIsLoading(true);
    try {
      return await updateTagMutation.mutateAsync(params);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTag = async (tagId: string) => {
    setIsLoading(true);
    try {
      return await deleteTagMutation.mutateAsync(tagId);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para invalidar cache e recarregar dados
  const refreshTags = () => {
    queryClient.invalidateQueries({ queryKey: ["tags"] });
  };

  // Determinar quais dados retornar baseado nos filtros
  const tags = filters?.companyId ? tagsByCompany : tagsByEmulator;
  const isLoadingTags = filters?.companyId ? isLoadingTagsByCompany : isLoadingTagsByEmulator;
  const tagsError = filters?.companyId ? tagsByCompanyError : tagsByEmulatorError;

  return {
    // Dados
    tags: tags || [],
    tagsByCompany,
    tagsByEmulator,
    
    // Estados de loading
    isLoading: isLoading || isLoadingTags,
    isLoadingTagsByCompany,
    isLoadingTagsByEmulator,
    isCreatingTag: createTagMutation.isPending,
    isUpdatingTag: updateTagMutation.isPending,
    isDeletingTag: deleteTagMutation.isPending,
    
    // Erros
    error: tagsError,
    tagsByCompanyError,
    tagsByEmulatorError,
    createError: createTagMutation.error,
    updateError: updateTagMutation.error,
    deleteError: deleteTagMutation.error,
    
    // Ações
    createTag,
    updateTag,
    deleteTag,
    refreshTags,
    refetchTagsByCompany,
    refetchTagsByEmulator,
    
    // Estados das mutations
    createTagMutation,
    updateTagMutation,
    deleteTagMutation,
  };
}

// Hook específico para tags por empresa
export function useTagsByCompany(companyId: string) {
  return useTags({ companyId });
}

// Hook específico para tags por emulador
export function useTagsByEmulator(emulatorId: string) {
  return useTags({ emulatorId });
}