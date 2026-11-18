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
  categoria: {
    id: number;
    nome: string;
    categoriaPaiId?: number | null;
    categoriaPai?: { id: number; nome: string } | null;
  };
  // logoUrl ou stickerUrl da loja para o badge do produto
  loja: { id: number; nome: string; logoUrl?: string | null; stickerUrl?: string | null };
  // No GET /products vem só a imagem principal; no GET /products/:id vêm todas
  imagens: ImagemProduto[];
}

export interface FiltrosProduto {
  categoria?: string;
  categoriaId?: number;
  lojaId?: number;
  busca?: string;
  ordenarPor?: string;
  ordem?: string;
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
  // Produto avaliado (nome, loja e imagem principal). Vem na listagem do GET /reviews.
  produto?: { id: number; nome: string; loja: { id: number; nome: string }; imagens: ImagemProduto[] };
}
