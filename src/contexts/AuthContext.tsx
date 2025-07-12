'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authService } from '@/services/auth'

interface User {
  id: string;
  name: string;
  email: string;
  companyId: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, companyId: string) => Promise<void>;
  logout: () => void;
  getMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  // Função para definir cookie
  const setCookie = (name: string, value: string, days: number = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
  };

  // Função para remover cookie
  const removeCookie = (name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          authService.setAuthToken(token);
          setCookie('accessToken', token);
          await getMe();
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        logout();
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

const login = async (email: string, password: string) => {
  try {
    const response = await authService.login({ email, password });

    authService.setAuthToken(response.token); 
    setCookie('accessToken', response.token); 

    await getMe();

    toast.success('Login realizado com sucesso!');
    router.push('/intern/dashboard');
  } catch (error: any) {
    console.error('Erro no login:', error);
    const message = error.response?.data?.message || 'Erro ao fazer login';
    toast.error(message);
    throw new Error(message);
  }
};


  const register = async (name: string, email: string, password: string, companyId: string) => {
    try {
      await authService.register({ name, email, password, companyId });

      toast.success('Conta criada com sucesso! Faça login para continuar.');
      router.push('/auth/login');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao registrar';
      toast.error(message);
      throw new Error(message);
    }
  };

  const getMe = async () => {
    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.removeAuthToken();
    removeCookie('accessToken');
    setUser(null);
    router.push('/auth/login');
    toast.info('Logout realizado com sucesso!');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        getMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };