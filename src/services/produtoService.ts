import { AvaliacaoProduto, FiltrosProduto, Produto, ProdutoDetalhe } from '@/types/produto';
import api from './api';

export const getProdutos = async (filtros: FiltrosProduto = {}) => {
  const response = await api.get<Produto[]>('/products', { params: filtros });
  return response.data;
};

export const getProduto = async (id: number) => {
  const response = await api.get<ProdutoDetalhe>(`/products/${id}`);
  return response.data;
};

export const getAvaliacoesProduto = async (produtoId: number) => {
  const response = await api.get<AvaliacaoProduto[]>('/reviews', { params: { produtoId } });
  return response.data;
};
