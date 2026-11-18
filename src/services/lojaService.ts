import api from './api';

export interface LojaData {
  nome: string;
  descricao?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  stickerUrl?: string | null;
}

export interface Loja extends LojaData {
  id: number;
  usuarioId: number;
  // Só vem no GET /lojas: categoria com mais produtos da loja (null se não tem produtos)
  categoriaPrincipal?: { id: number; nome: string } | null;
}

// Item da resposta do GET /store-reviews
export interface AvaliacaoLoja {
  id: number;
  usuarioId: number;
  lojaId: number;
  nota: number;
  comentario: string | null;
  createdAt: string;
  updatedAt: string;
  usuario: { id: number; username: string; nome: string; fotoPerfilUrl: string | null };
  loja: { id: number; nome: string; logoUrl: string | null };
  _count?: { comentarios: number };
}

export const getLojas = async () => (await api.get('/lojas')).data;

export const getLoja = async (id: number) => {
  const response = await api.get(`/lojas/${id}`);
  return response.data;
};

export const createLoja = async (data: LojaData) => api.post<Loja>('/lojas', data);

export const updateLoja = async (id: number, data: Partial<LojaData>) => api.patch<Loja>(`/lojas/${id}`, data);

export const deleteLoja = async (id: number) => api.delete(`/lojas/${id}`);

// GET /store-reviews?usuarioId= — avaliações de loja feitas por um usuário (mais novas primeiro)
export const getAvaliacoesLojaDoUsuario = async (usuarioId: number) => {
  const response = await api.get<AvaliacaoLoja[]>('/store-reviews', { params: { usuarioId } });
  return response.data;
};

export const getAvaliacoesDaLoja = async (lojaId: number) => {
  const response = await api.get<AvaliacaoLoja[]>('/store-reviews', { params: { lojaId } });
  return response.data;
};
