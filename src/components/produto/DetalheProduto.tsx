"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { ChevronLeft, Star, User } from "lucide-react";

import { BotaoAvaliacao, ModalAvaliacao } from "@/components/avaliacao";
import CardAvaliacao from "@/components/perfil/CardAvaliacao";
import BadgeLoja from "@/components/produto/BadgeLoja";
import ProdutosDaMesmaLoja from "@/components/produto/ProdutosDaMesmaLoja";

import { getMe } from "@/services/authService";
import {
  atualizarAvaliacaoProduto,
  criarAvaliacaoProduto,
  deletarAvaliacaoProduto,
  getAvaliacoesProduto,
  getProduto,
} from "@/services/produtoService";
import { AvaliacaoProduto, ProdutoDetalhe } from "@/types/produto";
import { getToken } from "@/utils/token";

function FotoAutor({ autor }: { autor: AvaliacaoProduto["usuario"] }) {
  const [erroImagem, setErroImagem] = useState(false);

  if (autor.fotoPerfilUrl && !erroImagem) {
    return (
      <img
        src={autor.fotoPerfilUrl}
        alt={autor.nome}
        onError={() => setErroImagem(true)}
        className="h-full w-full rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center rounded-full bg-[#F6F3E4]">
      <User className="h-10 w-10 text-gray-300" />
    </div>
  );
}

function Estrelas({ nota, tamanho }: { nota: number; tamanho: string }) {
  return (
    <div className="flex justify-center gap-1" aria-label={`Nota ${nota.toFixed(1)} de 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${tamanho} ${i <= Math.round(nota) ? "fill-yellow-400 text-yellow-400" : "text-gray-500"}`}
        />
      ))}
    </div>
  );
}

function formatarPreco(preco: string) {
  return Number(preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function DetalheProduto({ id }: { id: number }) {
  const router = useRouter();
  const [produto, setProduto] = useState<ProdutoDetalhe | null>(null);
  const [imagemAtiva, setImagemAtiva] = useState(0);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoProduto[] | null>(null);
  const [idLogado, setIdLogado] = useState<number | null>(null);
  const [modalAvaliacaoAberto, setModalAvaliacaoAberto] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        const [prod, avs] = await Promise.all([
          getProduto(id),
          getAvaliacoesProduto(id).catch(() => []),
        ]);
        setProduto(prod);
        setAvaliacoes(avs);
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

    if (getToken()) {
      getMe()
        .then((me) => setIdLogado(me.sub))
        .catch(() => {});
    }
  }, [id]);

  const minhaAvaliacao = avaliacoes?.find((a) => idLogado !== null && a.usuarioId === idLogado) ?? null;
  const totalAvaliacoes = avaliacoes !== null ? avaliacoes.length : (produto?.totalAvaliacoes ?? 0);
  const media = avaliacoes?.length
    ? avaliacoes.reduce((soma, a) => soma + a.nota, 0) / avaliacoes.length
    : (produto?.mediaNotas ?? null);

  function handleAbrirModalAvaliacao() {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    setModalAvaliacaoAberto(true);
  }

  async function handleSalvarAvaliacao(dados: { nota: number; comentario?: string }) {
    if (minhaAvaliacao) {
      const atualizada = await atualizarAvaliacaoProduto(minhaAvaliacao.id, dados);
      setAvaliacoes((prev) =>
        prev ? prev.map((a) => (a.id === minhaAvaliacao.id ? { ...a, ...atualizada } : a)) : [atualizada]
      );
    } else {
      const nova = await criarAvaliacaoProduto({ produtoId: id, ...dados });
      setAvaliacoes((prev) => (prev ? [nova, ...prev] : [nova]));
    }
  }

  async function handleDeletarAvaliacao() {
    if (!minhaAvaliacao) return;
    await deletarAvaliacaoProduto(minhaAvaliacao.id);
    setAvaliacoes((prev) => (prev ? prev.filter((a) => a.id !== minhaAvaliacao.id) : []));
  }

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
              {media != null ? (
                <>
                  {media.toFixed(1)} | {totalAvaliacoes}{" "}
                  {totalAvaliacoes === 1 ? "avaliação" : "avaliações"}
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

      {/* Seção de Reviews e Comentários do Produto */}
      <section className="overflow-hidden rounded-3xl bg-black px-4 pb-10 pt-8 text-center text-white">
        <h2 className="text-2xl font-medium md:text-3xl">Reviews e Comentários</h2>
        {media !== null ? (
          <>
            <p className="mt-2 text-4xl font-medium">
              {media.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
            </p>
            <div className="mt-2">
              <Estrelas nota={media} tamanho="h-8 w-8" />
            </div>
          </>
        ) : (
          <p className="mt-2 text-sm text-white/70">Este produto ainda não tem avaliações.</p>
        )}

        <BotaoAvaliacao
          onClick={handleAbrirModalAvaliacao}
          jaAvaliou={Boolean(minhaAvaliacao)}
          className="mt-6"
        />
      </section>

      {/* Lista de avaliações do produto */}
      {avaliacoes && avaliacoes.length > 0 && (
        <ul className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-2">
          {avaliacoes.map((avaliacao) => (
            <li key={avaliacao.id}>
              <CardAvaliacao
                href={`/perfil/${avaliacao.usuarioId}`}
                imagem={<FotoAutor autor={avaliacao.usuario} />}
                titulo={avaliacao.usuario.nome}
                subtitulo={`@${avaliacao.usuario.username}`}
                nota={avaliacao.nota}
                comentario={avaliacao.comentario}
                data={avaliacao.createdAt}
                onEditar={idLogado === avaliacao.usuarioId ? () => setModalAvaliacaoAberto(true) : undefined}
              />
            </li>
          ))}
        </ul>
      )}

      <ProdutosDaMesmaLoja lojaId={produto.loja.id} produtoAtualId={produto.id} />

      {modalAvaliacaoAberto && produto && (
        <ModalAvaliacao
          tipo="produto"
          nomeAlvo={produto.nome}
          avaliacaoExistente={minhaAvaliacao}
          onSalvar={handleSalvarAvaliacao}
          onDeletar={minhaAvaliacao ? handleDeletarAvaliacao : undefined}
          onFechar={() => setModalAvaliacaoAberto(false)}
        />
      )}
    </div>
  );
}
