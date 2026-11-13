export interface Produto {
  id: number;
  lojaId: number;
  categoriaId: number;
  nome: string;
  descricao: string | null;
  preco: string;
  estoque: number;
  createdAt: string;
  updatedAt: string;
  categoria: { id: number; nome: string };
  // logoUrl só aparece se o back-end incluir no select da loja
  loja: { id: number; nome: string; logoUrl?: string | null };
  // No GET /products vem só a imagem principal; no GET /products/:id vêm todas
  imagens: ImagemProduto[];
}

export interface FiltrosProduto {
  categoriaId?: number;
  lojaId?: number;
  busca?: string;
}

export interface ImagemProduto {
  id: number;
  produtoId: number;
  urlImagem: string;
  ordem: number;
}

// Resposta do GET /products/:id
export interface ProdutoDetalhe extends Produto {
  mediaNotas: number | null;
  totalAvaliacoes: number;
}

// Item da resposta do GET /reviews?produtoId=
export interface AvaliacaoProduto {
  id: number;
  usuarioId: number;
  produtoId: number;
  nota: number;
  comentario: string | null;
  createdAt: string;
  updatedAt: string;
  usuario: { id: number; username: string; nome: string; fotoPerfilUrl: string | null };
  _count?: { comentarios: number };
}
