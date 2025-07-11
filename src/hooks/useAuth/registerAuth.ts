import api from "@/lib/axios";

type RegisterParams = {
  name: string;
  email: string;
  password: string;
  companyId: string;
};

export async function registerAuth({ name, email, password, companyId }: RegisterParams) {
  const response = await api.post("api/auth/register", {
    name,
    email,
    password,
    companyId,
  });
  return response.data;
}