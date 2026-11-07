"use client";

import { useState } from "react";

interface FiltrosCategoriaProps {
  categoria: string;
}

// Dicionário com os filtros específicos de cada secção
const opcoesFiltros: Record<string, string[]> = {
  beleza: ["Maquilhagem", "Skincare", "Cabelo", "Perfumes"],
  mercado: ["Bebidas", "Mercearia", "Laticínios", "Limpeza"],
  moda: ["Roupas", "Calçado", "Acessórios", "Infantil"],
  eletronicos: ["Smartphones", "Computadores", "TVs", "Acessórios"],
  jogos: ["PlayStation", "Xbox", "Nintendo", "PC"],
  farmacia: ["Medicamentos", "Vitaminas", "Higiene", "Bebé"],
  // Caso a categoria não esteja mapeada acima, mostra estes filtros por omissão
  default: ["Novidades", "Promoções", "Mais Vendidos", "Marcas"],
};

export default function FiltrosCategoria({ categoria }: FiltrosCategoriaProps) {
  const [filtroAtivo, setFiltroAtivo] = useState("Todos");
  
  // Vai buscar os filtros da categoria atual, ou usa o default se não encontrar
  const filtros = opcoesFiltros[categoria] || opcoesFiltros.default;

  return (
    <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4 md:px-16">
      
      {/* Botões de Filtro */}
      <div className="flex flex-1 gap-3 overflow-x-auto">
        <button 
          onClick={() => setFiltroAtivo("Todos")}
          className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
            filtroAtivo === "Todos" 
              ? "bg-purple-600 text-white" 
              : "bg-white text-gray-700 shadow-sm hover:bg-gray-50"
          }`}
        >
          Todos
        </button>
        
        {filtros.map((filtro) => (
          <button
            key={filtro}
            onClick={() => setFiltroAtivo(filtro)}
            className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              filtroAtivo === filtro 
                ? "bg-purple-600 text-white" 
                : "bg-white text-gray-700 shadow-sm hover:bg-gray-50"
            }`}
          >
            {filtro}
          </button>
        ))}
      </div>

      {/* Botão de Ordenação */}
      <button className="ml-4 flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="21" y1="10" x2="3" y2="10"></line>
          <line x1="21" y1="6" x2="3" y2="6"></line>
          <line x1="21" y1="14" x2="3" y2="14"></line>
          <line x1="21" y1="18" x2="3" y2="18"></line>
        </svg>
        Ordenar por
      </button>
    </div>
  );
}