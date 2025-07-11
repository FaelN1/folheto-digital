import api from "@/lib/axios";

type LoginParams = {
  email: string;
  password: string;
};

export async function loginAuth({ email, password }: LoginParams) {
  const response = await api.post("api/auth/login", { email, password });
  return response.data;
}