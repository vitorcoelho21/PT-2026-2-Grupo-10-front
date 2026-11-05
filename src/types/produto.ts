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
  loja: { id: number; nome: string };
}

export interface FiltrosProduto {
  categoriaId?: number;
  lojaId?: number;
  busca?: string;
}
