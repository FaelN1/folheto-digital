import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/axios";

/**
 * ---------------------------------------------------------------------------
 * 📑 Types & Interfaces
 * ---------------------------------------------------------------------------
 */
export interface Company {
  id: string;
  name: string;
  cnpj: string;
  phone: string;
  email: string;
  createdAt: string; // ISODate
  updatedAt: string; // ISODate
}

export interface CreateCompanyInput {
  name: string;
  cnpj: string;
  phone: string;
  email: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * ---------------------------------------------------------------------------
 * 🔑 React Query Keys
 * ---------------------------------------------------------------------------
 */
export const companyKeys = {
  all: ["companies"] as const,
  user: () => [...companyKeys.all, "user"] as const,
};

export const userKeys = {
  all: ["user"] as const,
  me: () => [...userKeys.all, "me"] as const,
};

/**
 * ---------------------------------------------------------------------------
 * 📡 API Functions
 * ---------------------------------------------------------------------------
 */

// GET /auth/me - Obter dados do usuário logado (incluindo companyId)
const fetchUserData = async (): Promise<User> => {
  const response = await api.get<User>("/auth/me");
  return response.data;
};

// POST /companies - Criar nova empresa
const createCompany = async (data: CreateCompanyInput): Promise<Company> => {
  const response = await api.post<Company>("/companies", data);
  return response.data;
};

/**
 * ---------------------------------------------------------------------------
 * 🪝 Custom Hooks
 * ---------------------------------------------------------------------------
 */

/**
 * useUserData — Busca dados do usuário logado
 * @param options Opções do React Query
 */
export function useUserData(options?: {
  enabled?: boolean;
  staleTime?: number;
}) {
  return useQuery<User, AxiosError>({
    queryKey: userKeys.me(),
    queryFn: fetchUserData,
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error) => {
      // Não retry em caso de 401 (não autenticado)
      if (error.response?.status === 401) return false;
      return failureCount < 3;
    },
  });
}

/**
 * useCreateCompany — Mutation para criar uma nova empresa
 * @param options Opções da mutation
 */
export function useCreateCompany(options?: {
  onSuccess?: (data: Company, variables: CreateCompanyInput) => void;
  onError?: (error: AxiosError, variables: CreateCompanyInput) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation<Company, AxiosError, CreateCompanyInput>({
    mutationFn: createCompany,
    onSuccess: (data, variables) => {
      // Invalida dados do usuário para buscar dados atualizados (incluindo novo companyId)
      queryClient.invalidateQueries({ queryKey: userKeys.me() });

      options?.onSuccess?.(data, variables);
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
 * useCompanyId — Hook para obter o companyId do usuário logado
 */
export function useCompanyId() {
  const { data: user, isLoading, error } = useUserData();
  
  return {
    companyId: user?.companyId || null,
    isLoading,
    error,
    hasCompany: !!user?.companyId,
  };
}

/**
 * useCompaniesOptions — Hook adaptado para funcionar com companyId do usuário
 */
export function useCompaniesOptions(options?: {
  enabled?: boolean;
}) {
  const { data: user, isLoading, error } = useUserData({
    enabled: options?.enabled,
  });

  // Retorna formato compatível com o código existente
  const companiesOptions = React.useMemo(() => {
    if (!user?.companyId) return [];
    
    return [
      {
        value: user.companyId,
        label: `Minha Empresa`, // Nome mais amigável
        company: {
          id: user.companyId,
          name: `Minha Empresa`,
          cnpj: "",
          phone: "",
          email: "",
          createdAt: "",
          updatedAt: "",
        } as Company,
      }
    ];
  }, [user?.companyId]);

  // Simula array de empresas para compatibilidade
  const companies = React.useMemo(() => {
    if (!user?.companyId) return [];
    
    return [
      {
        id: user.companyId,
        name: `Minha Empresa`,
        cnpj: "",
        phone: "",
        email: "",
        createdAt: "",
        updatedAt: "",
      } as Company
    ];
  }, [user?.companyId]);

  return {
    companiesOptions,
    companies,
    isLoading,
    error,
  };
}

/**
 * useUserCompany — Hook para obter dados da empresa do usuário
 */
export function useUserCompany() {
  const { data: user, isLoading, error } = useUserData();
  
  const company = React.useMemo(() => {
    if (!user?.companyId) return null;
    
    return {
      id: user.companyId,
      name: `Minha Empresa`,
      cnpj: "",
      phone: "",
      email: "",
      createdAt: "",
      updatedAt: "",
    } as Company;
  }, [user?.companyId]);

  return {
    company,
    companyId: user?.companyId || null,
    isLoading,
    error,
    hasCompany: !!user?.companyId,
  };
}