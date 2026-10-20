import { CadastroFormato } from '@/types/user';
import { updateFormato } from '@/types/user';
import api from './api';

// 1. Cadastro
export const registerUser = async (data: CadastroFormato) => {
  try {
    const response = await api.post('/user', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar o usuário:', error);
    throw error;
  }
};

// 2. Buscar todos os usuários
export const getAllUsers = async () => {
  const response = await api.get('/user');
  return response.data;
};

// 3. Buscar um usuário específico
export const getUserById = async (id: string) => {
  const response = await api.get(`/user/${id}`);
  return response.data;
};

// 4. Atualizar usuário
export const updateUser = async (id: string, data: updateFormato) => {
  const response = await api.patch(`/user/${id}`, data);
  return response.data;
};

// 5. Deletar usuário
export const deleteUser = async (id: string) => {
  const response = await api.delete(`/user/${id}`);
  return response.data;
};