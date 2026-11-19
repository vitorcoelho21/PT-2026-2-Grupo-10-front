import {
  AtualizarProdutoDados,
  AvaliacaoProduto,
  CriarProdutoDados,
  FiltrosProduto,
  ImagemProduto,
  OpcaoCategoria,
  Produto,
  ProdutoDetalhe,
} from '@/types/produto';
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

export const getAvaliacaoProduto = async (id: number) => {
  const response = await api.get<AvaliacaoProduto>(`/reviews/${id}`);
  return response.data;
};


// POST /products — só funciona numa loja do usuário logado
export const criarProduto = async (dados: CriarProdutoDados) => {
  const response = await api.post<Produto>('/products', dados);
  return response.data;
};

// PATCH /products/:id — só o dono da loja
export const atualizarProduto = async (id: number, dados: AtualizarProdutoDados) => {
  const response = await api.patch<Produto>(`/products/${id}`, dados);
  return response.data;
};

// DELETE /products/:id — as imagens e avaliações caem junto (cascata no banco)
export const deletarProduto = async (id: number) => {
  await api.delete(`/products/${id}`);
};

// POST /product-images — o back-end só guarda a URL, não recebe o arquivo
export const adicionarImagemProduto = async (produtoId: number, urlImagem: string, ordem?: number) => {
  const response = await api.post<ImagemProduto>('/product-images', { produtoId, urlImagem, ordem });
  return response.data;
};

export const atualizarImagemProduto = async (id: number, urlImagem: string) => {
  const response = await api.patch<ImagemProduto>(`/product-images/${id}`, { urlImagem });
  return response.data;
};

export const deletarImagemProduto = async (id: number) => {
  await api.delete(`/product-images/${id}`);
};

// GET /categories/opcoes — lista plana com o caminho completo (precisa de login)
export const getOpcoesCategorias = async () => {
  const response = await api.get<OpcaoCategoria[]>('/categories/opcoes');
  return response.data;
};

// GET /reviews?usuarioId= — avaliações de produto feitas por um usuário (mais novas primeiro)
export const getAvaliacoesDoUsuario = async (usuarioId: number) => {
  const response = await api.get<AvaliacaoProduto[]>('/reviews', { params: { usuarioId } });
  return response.data;
};

export interface CriarAvaliacaoProdutoDados {
  produtoId: number;
  nota: number;
  comentario?: string;
}

export interface AtualizarAvaliacaoProdutoDados {
  nota?: number;
  comentario?: string;
}

export const criarAvaliacaoProduto = async (dados: CriarAvaliacaoProdutoDados) => {
  const response = await api.post<AvaliacaoProduto>('/reviews', dados);
  return response.data;
};

export const atualizarAvaliacaoProduto = async (id: number, dados: AtualizarAvaliacaoProdutoDados) => {
  const response = await api.patch<AvaliacaoProduto>(`/reviews/${id}`, dados);
  return response.data;
};

export const deletarAvaliacaoProduto = async (id: number) => {
  await api.delete(`/reviews/${id}`);
};

