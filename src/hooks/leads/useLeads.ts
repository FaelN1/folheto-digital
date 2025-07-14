import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";

// Types para a API de Leads
export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  channel: "whatsapp" | "email" | "sms";
}

export interface CreateLeadParams {
  name: string;
  phone: string;
  email: string;
  companyId: string;
}

export interface AssignTagParams {
  leadId: string;
  tagId: string;
}

export interface RemoveTagParams {
  leadId: string;
  tagId: string;
}

export interface LeadsFilters {
  companyId?: string;
  emulatorId?: string;
  search?: string;
  tags?: string[];
  channel?: "whatsapp" | "email" | "sms";
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
}

// Hook principal para gerenciamento de leads
export function useLeads(filters?: LeadsFilters) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Query para buscar leads por empresa
  const {
    data: leadsByCompany,
    isLoading: isLoadingLeadsByCompany,
    error: leadsByCompanyError,
    refetch: refetchLeadsByCompany,
  } = useQuery({
    queryKey: ["leads", "company", filters?.companyId, filters],
    queryFn: async () => {
      if (!filters?.companyId) return [];
      const response = await api.get(`/leads/company/${filters.companyId}`, {
        params: {
          search: filters.search,
          tags: filters.tags?.join(","),
          channel: filters.channel,
          dateFrom: filters.dateFrom?.toISOString(),
          dateTo: filters.dateTo?.toISOString(),
          page: filters.page || 1,
          limit: filters.limit || 10,
        },
      });
      return response.data;
    },
    enabled: !!filters?.companyId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
  });

  // Query para buscar leads por emulador
  const {
    data: leadsByEmulator,
    isLoading: isLoadingLeadsByEmulator,
    error: leadsByEmulatorError,
    refetch: refetchLeadsByEmulator,
  } = useQuery({
    queryKey: ["leads", "emulator", filters?.emulatorId, filters],
    queryFn: async () => {
      if (!filters?.emulatorId) return [];
      const response = await api.get(`/leads/emulator/${filters.emulatorId}`, {
        params: {
          search: filters.search,
          tags: filters.tags?.join(","),
          channel: filters.channel,
          dateFrom: filters.dateFrom?.toISOString(),
          dateTo: filters.dateTo?.toISOString(),
          page: filters.page || 1,
          limit: filters.limit || 10,
        },
      });
      return response.data;
    },
    enabled: !!filters?.emulatorId,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });

  // Mutation para criar novo lead
  const createLeadMutation = useMutation({
    mutationFn: async (params: CreateLeadParams) => {
      const response = await api.post("/leads", params);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidar cache relevante
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast("Lead criado com sucesso!", {
        description: `${data.name} foi adicionado à lista de leads.`,
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Erro ao criar lead";
      toast.error("Erro", {
        description: errorMessage,
      });
    },
  });

  // Mutation para atribuir tag a um lead
  const assignTagMutation = useMutation({
    mutationFn: async (params: AssignTagParams) => {
      const response = await api.post("/leads/assign-tag", params);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast("Tag atribuída com sucesso!");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Erro ao atribuir tag";
      toast.error("Erro", {
        description: errorMessage,
      });
    },
  });

  // Mutation para remover tag de um lead
  const removeTagMutation = useMutation({
    mutationFn: async (params: RemoveTagParams) => {
      const response = await api.post("/leads/remove-tag", params);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast("Tag removida com sucesso!");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Erro ao remover tag";
      toast.error("Erro", {
        description: errorMessage,
      });
    },
  });

  // Funções auxiliares
  const createLead = async (params: CreateLeadParams) => {
    setIsLoading(true);
    try {
      return await createLeadMutation.mutateAsync(params);
    } finally {
      setIsLoading(false);
    }
  };

  const assignTag = async (params: AssignTagParams) => {
    setIsLoading(true);
    try {
      return await assignTagMutation.mutateAsync(params);
    } finally {
      setIsLoading(false);
    }
  };

  const removeTag = async (params: RemoveTagParams) => {
    setIsLoading(true);
    try {
      return await removeTagMutation.mutateAsync(params);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para invalidar cache e recarregar dados
  const refreshLeads = () => {
    queryClient.invalidateQueries({ queryKey: ["leads"] });
  };

  // Determinar quais dados retornar baseado nos filtros
  const leads = filters?.companyId ? leadsByCompany : leadsByEmulator;
  const isLoadingLeads = filters?.companyId ? isLoadingLeadsByCompany : isLoadingLeadsByEmulator;
  const leadsError = filters?.companyId ? leadsByCompanyError : leadsByEmulatorError;

  return {
    // Dados
    leads: leads || [],
    leadsByCompany,
    leadsByEmulator,
    
    // Estados de loading
    isLoading: isLoading || isLoadingLeads,
    isLoadingLeadsByCompany,
    isLoadingLeadsByEmulator,
    isCreatingLead: createLeadMutation.isPending,
    isAssigningTag: assignTagMutation.isPending,
    isRemovingTag: removeTagMutation.isPending,
    
    // Erros
    error: leadsError,
    leadsByCompanyError,
    leadsByEmulatorError,
    createError: createLeadMutation.error,
    assignTagError: assignTagMutation.error,
    removeTagError: removeTagMutation.error,
    
    // Ações
    createLead,
    assignTag,
    removeTag,
    refreshLeads,
    refetchLeadsByCompany,
    refetchLeadsByEmulator,
    
    // Estados das mutations
    createLeadMutation,
    assignTagMutation,
    removeTagMutation,
  };
}

// Hook específico para leads por empresa
export function useLeadsByCompany(companyId: string, filters?: Omit<LeadsFilters, 'companyId'>) {
  return useLeads({ ...filters, companyId });
}

// Hook específico para leads por emulador
export function useLeadsByEmulator(emulatorId: string, filters?: Omit<LeadsFilters, 'emulatorId'>) {
  return useLeads({ ...filters, emulatorId });
}

// Hook para operações de tags em leads
export function useLeadTags() {
  const queryClient = useQueryClient();
  
  const assignTagMutation = useMutation({
    mutationFn: async (params: AssignTagParams) => {
      const response = await api.post("/leads/assign-tag", params);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast("Tag atribuída com sucesso!");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Erro ao atribuir tag";
      toast.error("Erro", {
        description: errorMessage,
      });
    },
  });

  const removeTagMutation = useMutation({
    mutationFn: async (params: RemoveTagParams) => {
      const response = await api.post("/leads/remove-tag", params);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast("Tag removida com sucesso!");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Erro ao remover tag";
      toast.error("Erro", {
        description: errorMessage,
      });
    },
  });

  return {
    assignTag: assignTagMutation.mutateAsync,
    removeTag: removeTagMutation.mutateAsync,
    isAssigningTag: assignTagMutation.isPending,
    isRemovingTag: removeTagMutation.isPending,
    assignTagError: assignTagMutation.error,
    removeTagError: removeTagMutation.error,
  };
}