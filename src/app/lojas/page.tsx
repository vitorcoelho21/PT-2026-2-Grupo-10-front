"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";

import Navbar from "@/components/Navbar";
import CardLoja from "@/components/loja/CardLoja";
import CategoriasFiltro from "@/components/categorias/CategoriasFiltro";
import { categorias } from "@/components/home/CategoriasCarrossel";
import { useDebounce } from "@/hooks/useDebounce";
import { getLojas, Loja } from "@/services/lojaService";
import { normalizar } from "@/utils/texto";

export default function LojasPage() {
  const [lojas, setLojas] = useState<Loja[] | null>(null); // null = carregando
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState<string | null>(null);
  const buscaDebounced = useDebounce(busca);

  useEffect(() => {
    getLojas()
      .then((dados) => setLojas(Array.isArray(dados) ? dados : []))
      .catch(() => {
        setErro("Erro ao carregar as lojas. Tente novamente mais tarde.");
        setLojas([]);
      });
  }, []);

  const lojasFiltradas = useMemo(() => {
    if (!lojas) return [];
    const termo = normalizar(buscaDebounced);
    return lojas.filter((loja) => {
      if (termo && !normalizar(loja.nome).includes(termo)) return false;
      if (categoria && normalizar(loja.categoriaPrincipal?.nome ?? "") !== normalizar(categoria)) return false;
      return true;
    });
  }, [lojas, buscaDebounced, categoria]);

  const temFiltro = Boolean(buscaDebounced.trim() || categoria);

  return (
    <div className="min-h-screen bg-black font-sans">
      <div className="pb-16">
        <Navbar />
        <CategoriasFiltro selecionada={categoria} onSelecionar={setCategoria} />
      </div>

      <main className="min-h-[60vh] bg-[#FDF8EE] px-4 py-10 md:px-24">
        {/* Mesma largura da fileira de categorias, para tudo ficar alinhado ao centro */}
        <div className="mx-auto max-w-[1232px]">
        {/* Busca */}
        <div className="mb-6 flex md:justify-end">
          <div className="flex w-full items-center rounded-full bg-white px-5 py-3 text-sm shadow-sm md:max-w-2xl">
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Procurar por..."
              aria-label="Procurar lojas"
              className="flex-1 bg-transparent text-gray-700 outline-none placeholder:text-[#B9A6F7] [&::-webkit-search-cancel-button]:hidden"
            />
            {busca ? (
              <button type="button" onClick={() => setBusca("")} aria-label="Limpar busca">
                <X className="h-5 w-5 text-[#B9A6F7] hover:text-[#6A38F3]" />
              </button>
            ) : (
              <Search className="h-5 w-5 text-[#B9A6F7]" />
            )}
          </div>
        </div>

        {/* Título + filtro de categoria */}
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-black">Lojas</h1>

          <div className="relative w-full md:max-w-lg">
            <select
              value={categoria ?? ""}
              onChange={(e) => setCategoria(e.target.value || null)}
              aria-label="Filtrar por categoria"
              className={`w-full appearance-none rounded-full bg-white px-6 py-3 pr-12 text-sm shadow-sm outline-none ${
                categoria ? "text-black" : "text-[#B9A6F7]"
              }`}
            >
              <option value="">filtros</option>
              {categorias.map((cat) => (
                <option key={cat.nome} value={cat.nome}>
                  {cat.nome}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6A38F3]" />
          </div>
        </div>

        {erro && <p className="w-fit rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-600">{erro}</p>}

        {!lojas && <p className="text-center text-gray-600">Carregando lojas...</p>}

        {lojas && !erro && lojasFiltradas.length === 0 && (
          <p className="rounded-3xl bg-white px-6 py-10 text-center text-gray-600">
            {temFiltro ? "Nenhuma loja encontrada com esses filtros." : "Nenhuma loja cadastrada ainda."}
          </p>
        )}

        {lojasFiltradas.length > 0 && (
          <ul className="flex flex-wrap justify-center gap-x-10 gap-y-10 md:gap-x-16">
            {lojasFiltradas.map((loja) => (
              <li key={loja.id}>
                <div className="w-28 md:w-32">
                  <CardLoja loja={loja} pequeno />
                </div>
              </li>
            ))}
          </ul>
        )}
        </div>
      </main>
    </div>
  );
}
