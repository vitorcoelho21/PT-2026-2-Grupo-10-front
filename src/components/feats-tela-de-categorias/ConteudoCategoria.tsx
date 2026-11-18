"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import FiltrosCategoria from "@/components/feats-tela-de-categorias/FiltrosCategoria";
import ListaProdutos from "@/components/feats-tela-de-categorias/ListaProdutos";
import { useDebounce } from "@/hooks/useDebounce";

// Conteúdo interativo da página de categorias:
// 1. Barra de pesquisa centralizada
// 2. Filtros de subcategoria e ordenação alinhados horizontalmente (sem sobreposição)
// 3. Grade de produtos com 5 colunas
export default function ConteudoCategoria({ categoria }: { categoria: string }) {
  const [busca, setBusca] = useState("");
  const [subcategoria, setSubcategoria] = useState<string | null>(null);
  const [ordenacao, setOrdenacao] = useState("");
  const buscaDebounced = useDebounce(busca);

  // Divide o valor da ordenação (ex: "preco_asc") em campo e direção
  const { ordenarPor, ordem } = useMemo(() => {
    if (!ordenacao) return { ordenarPor: undefined, ordem: undefined };
    const [campo, sentido] = ordenacao.split("_");
    return { ordenarPor: campo, ordem: sentido };
  }, [ordenacao]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      {/* 1. Barra de Pesquisa Centralizada */}
      <div className="mx-auto mb-8 max-w-2xl">
        <div className="flex items-center rounded-full bg-white px-6 py-3.5 shadow-sm">
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Procurar por..."
            aria-label="Procurar produtos"
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-[#B9A6F7] [&::-webkit-search-cancel-button]:hidden"
          />
          {busca ? (
            <button
              type="button"
              onClick={() => setBusca("")}
              aria-label="Limpar busca"
              className="text-[#B9A6F7] hover:text-[#6A38F3]"
            >
              <X className="h-5 w-5" />
            </button>
          ) : (
            <Search className="h-5 w-5 text-[#B9A6F7]" />
          )}
        </div>
      </div>

      {/* 2. Filtros e Ordenação: em linha única, sem sobreposição */}
      <div className="mb-8">
        <FiltrosCategoria
          categoria={categoria}
          subcategoriaAtiva={subcategoria}
          onSelecionarSubcategoria={setSubcategoria}
          ordenacao={ordenacao}
          onSelecionarOrdenacao={setOrdenacao}
        />
      </div>

      {/* 3. Grade de Produtos */}
      <div className="pb-16">
        <ListaProdutos
          categoria={categoria}
          subcategoria={subcategoria}
          busca={buscaDebounced}
          ordenarPor={ordenarPor}
          ordem={ordem}
        />
      </div>
    </div>
  );
}
