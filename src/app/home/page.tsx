"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/home/SearchBar";
import CategoriasCarrossel from "@/components/home/CategoriasCarrossel";
import SecaoProdutosDestaque from "@/components/home/SecaoProdutosDestaque";
import Fantoche from "@/components/home/Fantoche";
import ListaProdutos from "@/components/feats-tela-de-categorias/ListaProdutos";
import { useDebounce } from "@/hooks/useDebounce";
import { getMe } from "@/services/authService";

export default function DashboardPage() {
  const [usuarioEmail, setUsuarioEmail] = useState("");
  const [busca, setBusca] = useState("");
  const buscaDebounced = useDebounce(busca);

  // Roda uma vez ao abrir: valida a sessão real no back-end
  useEffect(() => {
    getMe()
      .then((usuario) => setUsuarioEmail(usuario.email))
      .catch(() => {
        // Se o token falhar, o interceptor ou a própria rota tratam do redirecionamento
      });
  }, []);

  return (
      <div className="min-h-screen bg-[#FDF8EE] font-sans">
        <div className="relative rounded-b-[40px] bg-black pb-16 overflow-hidden">
          <Navbar />
          <Fantoche />
        </div>

        {}
        <SearchBar valor={busca} onChange={setBusca} />

        {}
        <div className="px-8 py-12 md:px-16">
          {buscaDebounced.trim() ? (
            // Enquanto há texto na busca, mostra os resultados no lugar das secções
            <div>
              <h2 className="mb-6 text-2xl font-bold text-black">
                Resultados <span className="text-lg font-normal text-purple-600">para &quot;{buscaDebounced.trim()}&quot;</span>
              </h2>
              <ListaProdutos busca={buscaDebounced} />
            </div>
          ) : (
            <>
              {/* Carrossel Centralizado */}
              <div className="flex justify-center mb-12 w-full">
                <CategoriasCarrossel />
              </div>
          
              {/* Secções de Produtos */}
              <SecaoProdutosDestaque tituloDestaque="em Mercado" categoria="mercado" />
              <SecaoProdutosDestaque tituloDestaque="em Beleza" categoria="beleza" />
              <SecaoProdutosDestaque tituloDestaque="em Moda" categoria="moda" />
              <SecaoProdutosDestaque tituloDestaque="em Eletrônicos" categoria="eletronicos" />
            </>
          )}
        </div>
      </div>
  );
}