import api from "./api";

export interface ComentarioAutor {
  id: number;
  username: string;
  nome: string;
  fotoPerfilUrl: string | null;
}

export interface Comentario {
  id: number;
  usuarioId: number;
  conteudo: string;
  comentarioPaiId?: number | null;
  avaliacaoProdutoId?: number | null;
  avaliacaoLojaId?: number | null;
  createdAt: string;
  updatedAt: string;
  usuario: ComentarioAutor;
  respostas?: Comentario[];
}

export interface CriarComentarioDados {
  conteudo: string;
  avaliacaoProdutoId?: number;
  avaliacaoLojaId?: number;
  comentarioPaiId?: number;
}

export interface AtualizarComentarioDados {
  conteudo: string;
}

export const getComentarios = async (params: {
  avaliacaoProdutoId?: number;
  avaliacaoLojaId?: number;
}) => {
  const response = await api.get<Comentario[]>("/comments", { params });
  return response.data;
};

export const criarComentario = async (dados: CriarComentarioDados) => {
  const response = await api.post<Comentario>("/comments", dados);
  return response.data;
};

export const atualizarComentario = async (
  id: number,
  dados: AtualizarComentarioDados
) => {
  const response = await api.patch<Comentario>(`/comments/${id}`, dados);
  return response.data;
};

export const deletarComentario = async (id: number) => {
  await api.delete(`/comments/${id}`);
};
