import axios from 'axios';
import { CadastroFormato, updateFormato, Usuario } from '@/types/user';
import api from './api';

// Extrai a mensagem de erro que o NestJS devolve ({ message: string | string[] })
const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join(' ');
    if (typeof message === 'string') return message;
  }
  return fallback;
};

// 1. Cadastro
export const registerUser = async (data: CadastroFormato) => {
  try {
    const response = await api.post<Usuario>('/user', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar o usuário:', error);
    throw new Error(getErrorMessage(error, 'Não foi possível cadastrar o usuário.'));
  }
};

// 2. Buscar um usuário específico
export const getUserById = async (id: number) => {
  const response = await api.get<Usuario>(`/user/${id}`);
  return response.data;
};

// 3. Atualizar usuário (dados do perfil e/ou senha)
export const updateUser = async (id: number, data: updateFormato) => {
  try {
    const response = await api.patch<Usuario>(`/user/${id}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('Senha atual incorreta.');
    }
    throw new Error(getErrorMessage(error, 'Não foi possível atualizar o usuário.'));
  }
};

// 4. Trocar apenas a senha (exige a senha atual)
export const changePassword = async (
  id: number,
  senhaAtual: string,
  senhaHash: string,
) => {
  return updateUser(id, { senhaAtual, senhaHash });
};

// 5. Deletar usuário
export const deleteUser = async (id: number) => {
  const response = await api.delete(`/user/${id}`);
  return response.data;
};