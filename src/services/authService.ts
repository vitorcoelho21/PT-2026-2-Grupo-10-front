import { LoginFormato } from '@/types/user';
import api from './api';



export const login = async (credentials: LoginFormato) => {
  try {
    // Faz o pedido POST para a rota de login do backend
    const response = await api.post('/auth/login', credentials);
    
    // o backend devolve o token JWT e os dados do utilizador aqui
    return response.data; 
  } catch (error) {
    console.error('Erro na autenticação:', error);
    throw error; // Lança o erro
  }
};