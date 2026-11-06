import api from './api';

export interface LojaData {
  nome: string;
  descricao?: string;
  logoUrl?: string;
  bannerUrl?: string;
  stickerUrl?: string;
}

export interface Loja extends LojaData {
  id: number;
  usuarioId: number;
}

export const getLojas = async () => (await api.get('/lojas')).data;

export const getLoja = async (id: number) => {
  const response = await api.get(`/lojas/${id}`);
  return response.data;
};

export const createLoja = async (data: LojaData) => api.post('/lojas', data);

export const updateLoja = async (id: number, data: Partial<LojaData>) => api.patch(`/lojas/${id}`, data);

export const deleteLoja = async (id: number) => api.delete(`/lojas/${id}`);


