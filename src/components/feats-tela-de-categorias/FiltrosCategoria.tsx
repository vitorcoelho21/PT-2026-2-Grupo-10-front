"use client";

import { ChevronDown } from "lucide-react";

interface FiltrosCategoriaProps {
  categoria: string;
  subcategoriaAtiva: string | null;
  onSelecionarSubcategoria: (subcategoria: string | null) => void;
  ordenacao: string;
  onSelecionarOrdenacao: (ord: string) => void;
}

// Dicionário com os filtros específicos de cada seção
// ("Outros" é adicionado no fim de todas e mostra todos os produtos da categoria)
const opcoesFiltros: Record<string, string[]> = {
  beleza: ["Maquilhagem", "Skincare", "Cabelo", "Perfumes"],
  mercado: ["Bebidas", "Mercearia", "Laticínios", "Limpeza"],
  moda: ["Roupas", "Calçado", "Acessórios", "Infantil"],
  eletronicos: ["Celulares", "Notebooks", "TVs", "Acessórios"],
  jogos: ["PlayStation", "Xbox", "Nintendo", "PC"],
  farmacia: ["Medicamentos", "Vitaminas", "Higiene", "Bebé"],
  brinquedos: ["Jogos de Tabuleiro", "Bonecos e Figuras", "Educativos", "Pelúcias"],
  casa: ["Móveis", "Decoração", "Cozinha", "Cama, Mesa e Banho"],
  default: ["Novidades", "Promoções", "Mais Vendidos"],
};

const FILTRO_TODOS = "Outros";

// Filtros de subcategoria de uma seção, sempre terminando com "Outros"
export function getFiltrosCategoria(categoria: string): string[] {
  return [...(opcoesFiltros[categoria.toLowerCase()] || opcoesFiltros.default), FILTRO_TODOS];
}

const opcoesOrdenacao = [
  { rotulo: "ordenar por", valor: "" },
  { rotulo: "mais recentes", valor: "recentes_desc" },
  { rotulo: "menor preço", valor: "preco_asc" },
  { rotulo: "maior preço", valor: "preco_desc" },
  { rotulo: "nome (a-z)", valor: "nome_asc" },
  { rotulo: "mais avaliados", valor: "relevancia_desc" },
];

export default function FiltrosCategoria({
  categoria,
  subcategoriaAtiva,
  onSelecionarSubcategoria,
  ordenacao,
  onSelecionarOrdenacao,
}: FiltrosCategoriaProps) {
  const filtros = getFiltrosCategoria(categoria);

  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Botões de Filtro de Subcategoria */}
      <div className="scrollbar-hide flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0">
        {filtros.map((filtro) => {
          const ativo = subcategoriaAtiva === filtro;
          return (
            <button
              key={filtro}
              type="button"
              onClick={() => onSelecionarSubcategoria(ativo ? null : filtro)}
              aria-pressed={ativo}
              className={`whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-medium transition shadow-sm ${
                ativo
                  ? "bg-[#6A38F3] text-white shadow-md"
                  : "bg-white text-[#6A38F3] hover:bg-[#F3EFFF]"
              }`}
            >
              {filtro}
            </button>
          );
        })}
      </div>

      {/* Botão / Seletor de Ordenação */}
      <div className="relative shrink-0 self-end sm:self-auto">
        <select
          value={ordenacao}
          onChange={(e) => onSelecionarOrdenacao(e.target.value)}
          aria-label="Ordenar produtos"
          className="cursor-pointer appearance-none rounded-full bg-white px-6 py-2.5 pr-11 text-sm font-medium text-[#6A38F3] shadow-sm outline-none transition hover:bg-[#F3EFFF]"
        >
          {opcoesOrdenacao.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor} className="text-black">
              {opcao.rotulo}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6A38F3]" />
      </div>
    </div>
  );
}
