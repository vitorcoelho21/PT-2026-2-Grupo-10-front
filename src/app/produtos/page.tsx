"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import Navbar from "@/components/Navbar";
import CategoriasFiltro from "@/components/categorias/CategoriasFiltro";
import CardProduto from "@/components/produtos/CardProduto";
import { useDebounce } from "@/hooks/useDebounce";
import { getProdutos } from "@/services/produtoService";
import { Produto } from "@/types/produto";
import { normalizar } from "@/utils/texto";

const POR_SECAO = 5;
// Categorias que ganham uma linha própria na visão geral
const CATEGORIAS_DESTAQUE = ["Mercado", "Beleza", "Moda"];

function TituloSecao({ categoria, acao }: { categoria?: string; acao?: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="text-2xl font-bold text-black">
        Produtos{" "}
        {categoria && (
          <span className="text-sm font-normal text-black">
            em <span className="text-[#6A38F3]">{categoria}</span>
          </span>
        )}
      </h2>
      {acao}
    </div>
  );
}

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[] | null>(null); // null = carregando
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState<string | null>(null);
  const buscaDebounced = useDebounce(busca);

  useEffect(() => {
    getProdutos()
      .then((dados) => setProdutos(Array.isArray(dados) ? dados : []))
      .catch(() => {
        setErro("Erro ao carregar os produtos. Tente novamente mais tarde.");
        setProdutos([]);
      });
  }, []);

  const filtrados = useMemo(() => {
    if (!produtos) return [];
    const termo = normalizar(buscaDebounced);
    return produtos.filter((p) => {
      if (termo && !normalizar(p.nome).includes(termo)) return false;
      if (categoria && normalizar(p.categoria?.nome ?? "") !== normalizar(categoria)) return false;
      return true;
    });
  }, [produtos, buscaDebounced, categoria]);

  // Sem busca nem categoria: uma linha para cada categoria em destaque
  // e, abaixo, uma grade com os produtos de todas as outras categorias juntos
  const mostrarSecoes = !categoria && !buscaDebounced.trim();
  const secoes = useMemo(
    () =>
      CATEGORIAS_DESTAQUE.map((nome) => ({
        nome,
        produtos: filtrados.filter((p) => normalizar(p.categoria?.nome ?? "") === normalizar(nome)),
      })).filter((secao) => secao.produtos.length > 0),
    [filtrados],
  );
  const outrosProdutos = useMemo(() => {
    const destaques = CATEGORIAS_DESTAQUE.map(normalizar);
    return filtrados.filter((p) => !destaques.includes(normalizar(p.categoria?.nome ?? "")));
  }, [filtrados]);

  function verMais(nome: string) {
    setCategoria(nome);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const botaoLink = "text-sm font-medium text-[#6A38F3] hover:underline";

  return (
    <div className="min-h-screen bg-black font-sans">
      <div className="pb-16">
        <Navbar />
        <CategoriasFiltro selecionada={categoria} onSelecionar={setCategoria} />
      </div>

      <main className="min-h-[60vh] bg-[#FDF8EE] px-4 py-10 md:px-24">
        {/* Busca */}
        <div className="mb-10 flex md:justify-end">
          <div className="flex w-full items-center rounded-full bg-white px-5 py-3 text-sm shadow-sm md:max-w-2xl">
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Procurar por..."
              aria-label="Procurar produtos"
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

        {erro && <p className="w-fit rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-600">{erro}</p>}

        {!produtos && <p className="text-center text-gray-600">Carregando produtos...</p>}

        {produtos && !erro && filtrados.length === 0 && (
          <>
            <TituloSecao categoria={categoria ?? undefined} />
            <p className="rounded-3xl bg-white px-6 py-10 text-center text-gray-600">
              {mostrarSecoes ? "Nenhum produto cadastrado ainda." : "Nenhum produto encontrado com esses filtros."}
            </p>
          </>
        )}

        {/* Visão geral: uma linha por categoria */}
        {mostrarSecoes &&
          secoes.map((secao) => (
            <section key={secao.nome} className="mb-14">
              <TituloSecao
                categoria={secao.nome}
                acao={
                  secao.produtos.length > POR_SECAO && (
                    <button type="button" onClick={() => verMais(secao.nome)} className={botaoLink}>
                      ver mais
                    </button>
                  )
                }
              />
              <ul className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-4 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
                {secao.produtos.slice(0, POR_SECAO).map((produto) => (
                  <li key={produto.id} className="w-48 shrink-0 snap-start lg:w-auto">
                    <CardProduto produto={produto} />
                  </li>
                ))}
              </ul>
            </section>
          ))}

        {mostrarSecoes && outrosProdutos.length > 0 && (
          <section className="mb-14">
            <h2 className="mb-6 text-2xl font-bold text-black">Outros produtos</h2>
            <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
              {outrosProdutos.map((produto) => (
                <li key={produto.id}>
                  <CardProduto produto={produto} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Categoria escolhida ou busca: grade com todos os resultados */}
        {!mostrarSecoes && filtrados.length > 0 && (
          <section>
            <TituloSecao
              categoria={categoria ?? undefined}
              acao={
                categoria && (
                  <button type="button" onClick={() => setCategoria(null)} className={botaoLink}>
                    ver todas as categorias
                  </button>
                )
              }
            />
            <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
              {filtrados.map((produto) => (
                <li key={produto.id}>
                  <CardProduto produto={produto} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
