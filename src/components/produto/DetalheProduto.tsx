"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isAxiosError } from "axios";

import { getAvaliacoesProduto, getProduto } from "@/services/produtoService";
import { AvaliacaoProduto, ProdutoDetalhe } from "@/types/produto";

function formatarPreco(preco: string) {
  return Number(preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function Estrelas({ nota, tamanho = "text-lg" }: { nota: number; tamanho?: string }) {
  const cheias = Math.round(nota);
  return (
    <span className={`${tamanho} leading-none`} aria-label={`${nota.toFixed(1)} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= cheias ? "text-[#6A38F3]" : "text-gray-300"}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function DetalheProduto({ id }: { id: number }) {
  const [produto, setProduto] = useState<ProdutoDetalhe | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoProduto[]>([]);
  const [imagemAtiva, setImagemAtiva] = useState(0);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const [dadosProduto, dadosAvaliacoes] = await Promise.all([
          getProduto(id),
          // Se as avaliações falharem, a página ainda mostra o produto
          getAvaliacoesProduto(id).catch(() => []),
        ]);
        setProduto(dadosProduto);
        setAvaliacoes(dadosAvaliacoes);
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
    <div className="space-y-12">
      {/* Caminho de navegação */}
      <nav className="text-sm text-gray-500">
        <Link href="/home" className="hover:text-[#6A38F3]">Início</Link>
        <span className="mx-2">/</span>
        <Link href={`/categorias/${produto.categoria.nome.toLowerCase()}`} className="capitalize hover:text-[#6A38F3]">
          {produto.categoria.nome}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{produto.nome}</span>
      </nav>

      <section className="grid gap-8 md:grid-cols-2">
        {/* Galeria */}
        <div>
          <div className="flex aspect-square items-center justify-center rounded-3xl bg-white p-8 shadow-sm">
            <img src={imagens[imagemAtiva]} alt={produto.nome} className="max-h-full max-w-full object-contain" />
          </div>

          {imagens.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {imagens.map((url, i) => (
                <button
                  key={url + i}
                  type="button"
                  onClick={() => setImagemAtiva(i)}
                  className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-white p-2 shadow-sm ring-2 transition ${
                    i === imagemAtiva ? "ring-[#6A38F3]" : "ring-transparent hover:ring-gray-300"
                  }`}
                >
                  <img src={url} alt={`${produto.nome} - imagem ${i + 1}`} className="max-h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informações */}
        <div className="flex flex-col">
          <span className="mb-3 w-fit rounded-md bg-gray-200 px-2 py-1 text-xs font-bold uppercase tracking-wider text-gray-700">
            {produto.loja.nome}
          </span>

          <h1 className="mb-3 text-3xl font-bold text-black md:text-4xl">{produto.nome}</h1>

          <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
            {produto.mediaNotas != null ? (
              <>
                <Estrelas nota={produto.mediaNotas} />
                <span className="font-semibold text-gray-800">{produto.mediaNotas.toFixed(1)}</span>
                <span>({produto.totalAvaliacoes} {produto.totalAvaliacoes === 1 ? "avaliação" : "avaliações"})</span>
              </>
            ) : (
              <span>Ainda sem avaliações</span>
            )}
          </div>

          <p className="mb-2 text-4xl font-bold text-black">{formatarPreco(produto.preco)}</p>

          <p className={`mb-8 text-sm font-bold tracking-wider ${disponivel ? "text-green-600" : "text-red-500"}`}>
            {disponivel ? `DISPONÍVEL · ${produto.estoque} em estoque` : "INDISPONÍVEL"}
          </p>

          <div className="mb-8">
            <h2 className="mb-2 text-lg font-semibold text-black">Descrição</h2>
            <p className="whitespace-pre-line text-gray-700">
              {produto.descricao || "Este produto ainda não tem descrição."}
            </p>
          </div>

          <Link
            href={`/lojas/${produto.loja.id}`}
            className="mt-auto w-fit rounded-full bg-[#6A38F3] px-8 py-3 text-sm font-bold uppercase text-white transition hover:bg-black"
          >
            Ver loja
          </Link>
        </div>
      </section>

      {/* Avaliações */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-black">Avaliações</h2>

        {avaliacoes.length === 0 ? (
          <p className="text-gray-500">Ninguém avaliou este produto ainda.</p>
        ) : (
          <ul className="space-y-4">
            {avaliacoes.map((a) => (
              <li key={a.id} className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="mb-2 flex items-center gap-3">
                  {a.usuario.fotoPerfilUrl ? (
                    <img
                      src={a.usuario.fotoPerfilUrl}
                      alt={a.usuario.nome}
                      className="h-10 w-10 rounded-full bg-gray-200 object-cover"
                    />
                  ) : (
                    // Sem foto de perfil: mostra a inicial do nome
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6A38F3] font-bold uppercase text-white">
                      {a.usuario.nome.charAt(0)}
                    </span>
                  )}
                  <div>
                    <Link href={`/perfil/${a.usuario.id}`} className="font-semibold text-gray-900 hover:text-[#6A38F3]">
                      {a.usuario.nome}
                    </Link>
                    <p className="text-xs text-gray-500">
                      @{a.usuario.username} · {new Date(a.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <Estrelas nota={a.nota} tamanho="text-base" />
                  </div>
                </div>
                {a.comentario && <p className="text-gray-700">{a.comentario}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
