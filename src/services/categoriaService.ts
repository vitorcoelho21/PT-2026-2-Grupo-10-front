import api from './api';

export interface Categoria {
  id: number;
  nome: string;
  categoriaPaiId: number | null;
}

export const getCategorias = async (params?: { raiz?: boolean; nome?: string }) => {
  const response = await api.get<Categoria[]>('/categories', { params });
  return response.data;
};
