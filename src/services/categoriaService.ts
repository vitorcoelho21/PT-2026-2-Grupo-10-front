import api from './api';

export interface Categoria {
  id: number;
  nome: string;
  categoriaPaiId: number | null;
}

export const getCategorias = async () => {
  const response = await api.get<Categoria[]>('/categories');
  return response.data;
};
