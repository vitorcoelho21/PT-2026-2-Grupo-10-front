"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { ChevronLeft, Star } from "lucide-react";

import BadgeLoja from "@/components/produto/BadgeLoja";
import ProdutosDaMesmaLoja from "@/components/produto/ProdutosDaMesmaLoja";

import { getProduto } from "@/services/produtoService";
import { ProdutoDetalhe } from "@/types/produto";

function formatarPreco(preco: string) {
  return Number(preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function DetalheProduto({ id }: { id: number }) {
  const router = useRouter();
  const [produto, setProduto] = useState<ProdutoDetalhe | null>(null);
  const [imagemAtiva, setImagemAtiva] = useState(0);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        setProduto(await getProduto(id));
      } catch (e) {
        setErro(
          isAxiosError(e) && e.response?.status === 404
            ? "Produto não encontrado."
            : "Erro ao carregar o produto. Tente novamente mais tarde.",
        );
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [id]);

  if (loading) {
    return <p className="py-20 text-center text-gray-500">Carregando produto...</p>;
  }

  if (erro || !produto) {
    return (
      <div className="py-20 text-center">
        <p className="mb-6 text-lg text-gray-700">{erro || "Produto não encontrado."}</p>
        <Link href="/home" className="rounded-full bg-[#6A38F3] px-6 py-2 font-bold text-white hover:opacity-90">
          Voltar para o início
        </Link>
      </div>
    );
  }

  const imagens = produto.imagens.length > 0 ? produto.imagens.map((i) => i.urlImagem) : ["/images/placeholder.svg"];
  const disponivel = produto.estoque > 0;

  return (
    <div className="space-y-16">
      <section className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Voltar */}
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Voltar"
          className="w-fit shrink-0 text-black transition hover:text-[#6A38F3]"
        >
          <ChevronLeft className="h-10 w-10" strokeWidth={1.5} />
        </button>

        {/* Galeria: miniaturas na vertical + imagem principal */}
        <div className="flex flex-col-reverse gap-4 sm:flex-row lg:w-[58%] lg:shrink-0">
          {imagens.length > 1 && (
            // p-1: espaço para o contorno (ring) da miniatura ativa não ser cortado pelo scroll
            <div className="-m-1 flex gap-3 overflow-x-auto p-1 sm:max-h-[568px] sm:w-[140px] sm:shrink-0 sm:flex-col sm:overflow-y-auto sm:overflow-x-hidden">
              {imagens.map((url, i) => (
                <button
                  key={url + i}
                  type="button"
                  onClick={() => setImagemAtiva(i)}
                  aria-label={`Ver imagem ${i + 1}`}
                  className={`flex aspect-square w-20 shrink-0 items-center overflow-hidden justify-center rounded-2xl bg-white p-2 shadow-sm ring-2 transition sm:w-full ${
                    i === imagemAtiva ? "ring-[#6A38F3]" : "ring-transparent hover:ring-gray-300"
                  }`}
                >
                  <img src={url} alt="" className="max-h-full max-w-full object-contain" />
                </button>
              ))}
            </div>
          )}

          <div className="relative flex aspect-square flex-1 items-center justify-center rounded-3xl bg-white p-10 shadow-sm">
            <div className="absolute right-5 top-5">
              <BadgeLoja loja={produto.loja} tamanho="lg" comLink />
            </div>
            <img src={imagens[imagemAtiva]} alt={produto.nome} className="max-h-full max-w-full object-contain" />
          </div>
        </div>

        {/* Informações */}
        <div className="min-w-0 flex-1">
          <h1 className="mb-2 text-4xl font-medium text-black md:text-5xl">{produto.nome}</h1>

          <div className="mb-4 flex flex-wrap items-center gap-x-8 gap-y-1 text-lg">
            <span className="flex items-center gap-1 text-gray-700">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              {produto.mediaNotas != null ? (
                <>
                  {produto.mediaNotas.toFixed(1)} | {produto.totalAvaliacoes}{" "}
                  {produto.totalAvaliacoes === 1 ? "avaliação" : "avaliações"}
                </>
              ) : (
                "Sem avaliações"
              )}
            </span>
            <Link
              href={`/categorias/${produto.categoria.nome.toLowerCase()}`}
              className="lowercase text-[#6A38F3] hover:underline"
            >
              {produto.categoria.nome}
            </Link>
            <span className={disponivel ? "text-[#6A38F3]" : "text-red-500"}>
              {disponivel ? `${produto.estoque} disponíve${produto.estoque === 1 ? "l" : "is"}` : "Indisponível"}
            </span>
          </div>

          <p className="mb-10 text-4xl font-medium text-black md:text-5xl">{formatarPreco(produto.preco)}</p>

          <h2 className="text-2xl font-medium text-black">Descrição</h2>
          <div className="mb-4 mt-1 h-1 w-8 rounded-full bg-gray-300" />
          <p className="whitespace-pre-line text-sm leading-snug text-gray-800">
            {produto.descricao || "Este produto ainda não tem descrição."}
          </p>
        </div>
      </section>

      <ProdutosDaMesmaLoja lojaId={produto.loja.id} produtoAtualId={produto.id} />
    </div>
  );
}
