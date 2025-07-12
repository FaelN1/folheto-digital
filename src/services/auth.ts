import api from '@/lib/axios';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string; 
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    companyId: string;
  };
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  companyId: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export const authService = {
async login({ email, password }: LoginRequest): Promise<LoginResponse> {
  try {
    console.log('[authService] Enviando POST /auth/login');
    const response = await api.post('/auth/login', { email, password });
    console.log('[authService] Sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('[authService] Erro na requisição /auth/login:', error);
    throw error; // repassa o erro para o AuthContext
  }
}
,

  async register({ name, email, password, companyId }: RegisterRequest): Promise<void> {
    await api.post('/auth/register', { name, email, password, companyId });
  },

  async getMe(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  setAuthToken(token: string): void {
    localStorage.setItem('accessToken', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  removeAuthToken(): void {
    localStorage.removeItem('accessToken');
    delete api.defaults.headers.common['Authorization'];
  },

  getStoredToken(): string | null {
    return localStorage.getItem('accessToken');
  }
};