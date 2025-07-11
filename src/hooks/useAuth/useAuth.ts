import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { loginAuth } from "@/hooks/useAuth/loginAuth";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const data = await loginAuth({ email, password });
      localStorage.setItem("token", data.token); // Salve o token
      await fetchMe();
      return data;
    } finally {
      setLoading(false);
    }
  }

  async function fetchMe() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("token");
  }

  useEffect(() => {
    fetchMe();
  }, []);

  return { user, loading, login, logout, fetchMe };
}