import { LoginFormato } from '@/types/user';
import api from './api';



export const login = async (credentials: LoginFormato) => {
  try {
    // Faz o pedido POST para a rota de login do backend
    const response = await api.post('/auth/login', credentials);
    console.log('Token recebido do backend:', response.data);

    
    // o backend devolve o token JWT e os dados do utilizador aqui
    return response.data;

  }
    catch (error: any) {
    console.error('Erro:', error.response?.data || error);
    throw error;
  }
};