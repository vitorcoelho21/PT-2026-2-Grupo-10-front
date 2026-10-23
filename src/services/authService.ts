import { LoginFormato } from "@/types/user";
import api from "./api";
import { clearToken, setToken } from "@/utils/token";



export const login = async (credentials: LoginFormato) => {
  const { data } = await api.post<{ access_token: string }>("/auth/login", credentials);
  setToken(data.access_token);
  return data;
};

export const logout = () => clearToken();

export const forgotPassword = async (email: string) => {
  const { data } = await api.post<{ message: string }>("/auth/forgot-password", { email });
  return data;
};

export const resetPassword = async (token: string, novaSenha: string) => {
  const { data } = await api.post<{ message: string }>("/auth/reset-password", { token, novaSenha });
  return data;
};