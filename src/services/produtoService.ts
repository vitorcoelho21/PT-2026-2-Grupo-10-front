import { FiltrosProduto, Produto } from '@/types/produto';
import api from './api';

export const getProdutos = async (filtros: FiltrosProduto = {}) => {
  const response = await api.get<Produto[]>('/products', { params: filtros });
  return response.data;
};
