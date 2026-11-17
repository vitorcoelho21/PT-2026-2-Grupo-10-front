"use client";

import { useState } from "react";
import SearchBar from "@/components/home/SearchBar";
import FiltrosCategoria from "@/components/feats-tela-de-categorias/FiltrosCategoria";
import ListaProdutos from "@/components/feats-tela-de-categorias/ListaProdutos";
import { useDebounce } from "@/hooks/useDebounce";

// Parte interativa da página de categoria: guarda o texto da busca
// e repassa para a lista, que filtra os produtos enquanto o usuário digita.
export default function ConteudoCategoria({ categoria }: { categoria: string }) {
  const [busca, setBusca] = useState("");
  const buscaDebounced = useDebounce(busca);

  return (
    <>
      {/* Barra de Pesquisa
          A linha de filtros abaixo sobe (-mt-20) e fica por cima desta área.
          z-40 põe a busca na frente; pointer-events-none deixa os cliques
          fora da caixa da busca passarem para os filtros (ex.: "Ordenar por"). */}
      <div className="pointer-events-none relative z-40 mt-12 max-w-4xl px-8 ml-[800px] md:px-16">
        <SearchBar valor={busca} onChange={setBusca} />
      </div>

      {/* Filtros e Ordenação */}
      <div className="relative z-30 -mt-20 flex w-full items-center justify-between px-8 py-4 md:px-16 -ml-100">
        <FiltrosCategoria categoria={categoria} />
      </div>

      {/* Grelha de Produtos vindos do Banco de Dados */}
      <div className="px-8 pb-16 md:px-16">
        <ListaProdutos categoria={categoria} busca={buscaDebounced} />
      </div>
    </>
  );
}
