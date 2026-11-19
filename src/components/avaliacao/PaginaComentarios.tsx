"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Pencil, SendHorizontal, Star, User } from "lucide-react";

import Navbar from "@/components/Navbar";
import ModalEditarComentario from "./ModalEditarComentario";
import { getMe } from "@/services/authService";
import {
  atualizarComentario,
  Comentario,
  criarComentario,
  deletarComentario,
  getComentarios,
} from "@/services/comentarioService";
import { getAvaliacaoLoja } from "@/services/lojaService";
import { getAvaliacaoProduto } from "@/services/produtoService";
import { extrairMensagemErro } from "@/utils/erros";
import { formatarTempoRelativo } from "@/utils/texto";
import { getToken } from "@/utils/token";

function Estrelas({ nota, tamanho }: { nota: number; tamanho: string }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Nota ${nota.toFixed(1)} de 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${tamanho} ${
            i <= Math.round(nota) ? "fill-[#FFEB3A] text-[#FFEB3A]" : "text-gray-600"
          }`}
        />
      ))}
    </div>
  );
}

interface AvaliacaoGenerica {
  id: number;
  usuarioId: number;
  nota: number;
  comentario: string | null;
  createdAt: string;
  usuario: {
    id: number;
    username: string;
    nome: string;
    fotoPerfilUrl: string | null;
  };
  loja?: { id: number; nome: string; usuarioId?: number; logoUrl: string | null } | null;
  produto?: {
    id: number;
    nome: string;
    loja?: { id: number; nome: string; usuarioId?: number } | null;
  } | null;
  comentarios?: Comentario[];
}

interface PaginaComentariosProps {
  avaliacaoId: number;
  tipoInicial?: "loja" | "produto";
}

export default function PaginaComentarios({
  avaliacaoId,
  tipoInicial,
}: PaginaComentariosProps) {
  const router = useRouter();

  const [tipo, setTipo] = useState<"loja" | "produto">(tipoInicial ?? "loja");
  const [avaliacao, setAvaliacao] = useState<AvaliacaoGenerica | null>(null);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [idLogado, setIdLogado] = useState<number | null>(null);
  const [novoComentario, setNovoComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [comentarioParaEditar, setComentarioParaEditar] = useState<Comentario | null>(null);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      setLoading(true);
      setErro("");

      try {
        let tipoFinal = tipoInicial;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let dados: any = null;

        if (tipoFinal === "loja") {
          dados = await getAvaliacaoLoja(avaliacaoId);
        } else if (tipoFinal === "produto") {
          dados = await getAvaliacaoProduto(avaliacaoId);
        } else {
          // Se não especificado na URL, tenta buscar loja e depois produto
          try {
            dados = await getAvaliacaoLoja(avaliacaoId);
            tipoFinal = "loja";
          } catch {
            dados = await getAvaliacaoProduto(avaliacaoId);
            tipoFinal = "produto";
          }
        }

        if (!ativo) return;
        setTipo(tipoFinal as "loja" | "produto");
        setAvaliacao(dados);

        // Busca lista de comentários
        let lista: Comentario[] = [];
        try {
          lista = await getComentarios(
            tipoFinal === "loja"
              ? { avaliacaoLojaId: avaliacaoId }
              : { avaliacaoProdutoId: avaliacaoId }
          );
        } catch {
          lista = dados?.comentarios ?? [];
        }

        if (!ativo) return;
        setComentarios(lista);
      } catch (err) {
        if (!ativo) return;
        setErro(
          extrairMensagemErro(
            err,
            "Não foi possível carregar a avaliação e seus comentários."
          )
        );
      } finally {
        if (ativo) setLoading(false);
      }
    }

    carregar();

    if (getToken()) {
      getMe()
        .then((me) => {
          if (ativo) setIdLogado(me.sub);
        })
        .catch(() => {});
    }

    return () => {
      ativo = false;
    };
  }, [avaliacaoId, tipoInicial]);

  // Identifica se o usuário que comentou é o dono da loja avaliada (ou da loja do produto)
  function ehDonoDaLoja(usuarioId: number): boolean {
    if (!avaliacao) return false;
    if (avaliacao.loja?.usuarioId === usuarioId) return true;
    if (avaliacao.produto?.loja?.usuarioId === usuarioId) return true;
    return false;
  }

  async function handleEnviarComentario(e: FormEvent) {
    e.preventDefault();
    if (!novoComentario.trim()) return;

    if (!getToken()) {
      router.push("/login");
      return;
    }

    setEnviando(true);
    try {
      const criado = await criarComentario({
        conteudo: novoComentario.trim(),
        avaliacaoLojaId: tipo === "loja" ? avaliacaoId : undefined,
        avaliacaoProdutoId: tipo === "produto" ? avaliacaoId : undefined,
      });

      setComentarios((prev) => [...prev, criado]);
      setNovoComentario("");
    } catch (err) {
      alert(extrairMensagemErro(err, "Não foi possível enviar o comentário."));
    } finally {
      setEnviando(false);
    }
  }

  async function handleSalvarEdicao(novoConteudo: string) {
    if (!comentarioParaEditar) return;
    const atualizado = await atualizarComentario(comentarioParaEditar.id, {
      conteudo: novoConteudo,
    });
    setComentarios((prev) =>
      prev.map((c) => {
        if (c.id === comentarioParaEditar.id) {
          return { ...c, ...atualizado };
        }
        if (c.respostas) {
          return {
            ...c,
            respostas: c.respostas.map((r) =>
              r.id === comentarioParaEditar.id ? { ...r, ...atualizado } : r
            ),
          };
        }
        return c;
      })
    );
  }

  async function handleDeletarComentario() {
    if (!comentarioParaEditar) return;
    await deletarComentario(comentarioParaEditar.id);
    setComentarios((prev) =>
      prev
        .filter((c) => c.id !== comentarioParaEditar.id)
        .map((c) => ({
          ...c,
          respostas: c.respostas?.filter((r) => r.id !== comentarioParaEditar.id),
        }))
    );
  }

  function renderItemComentario(c: Comentario, ehResposta = false) {
    const ehMeu = idLogado !== null && c.usuarioId === idLogado;
    const ehDono = ehDonoDaLoja(c.usuarioId);

    return (
      <article
        key={c.id}
        className={`group relative flex items-start justify-between gap-4 ${
          ehResposta ? "ml-8 sm:ml-12" : ""
        }`}
      >
        <div className="flex flex-1 items-start gap-3 sm:gap-4">
          {/* Foto do autor do comentário */}
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200 sm:h-12 sm:w-12">
            {c.usuario.fotoPerfilUrl ? (
              <img
                src={c.usuario.fotoPerfilUrl}
                alt={c.usuario.nome}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-300">
                <User className="h-6 w-6 text-gray-600" />
              </div>
            )}
          </div>

          {/* Dados do comentário */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-base font-semibold text-black sm:text-lg">
                {c.usuario.nome}
              </span>
              <span className="text-xs font-normal text-gray-500">
                {formatarTempoRelativo(c.createdAt)}
              </span>
            </div>

            {/* Tag "dona da loja" destacada em roxo */}
            {ehDono && (
              <span className="-mt-0.5 mb-1 block text-xs font-medium text-[#6A38F3]">
                dona da loja
              </span>
            )}

            <p className="mt-1 text-sm leading-snug text-gray-800 break-words sm:text-base">
              {c.conteudo}
            </p>
          </div>
        </div>

        {/* Mini lápis no hover se for o autor do comentário */}
        {ehMeu && (
          <button
            type="button"
            onClick={() => setComentarioParaEditar(c)}
            title="Editar comentário"
            aria-label="Editar comentário"
            className="shrink-0 p-1.5 text-black transition-opacity hover:text-[#6A38F3] opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
          >
            <Pencil className="h-4 w-4" strokeWidth={2} />
          </button>
        )}
      </article>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F3E4]">
      {/* Navbar escura padrão do projeto */}
      <div className="bg-black">
        <Navbar />
      </div>

      {/* Seção Superior Preta: Review em destaque (exatamente como em pagina comentário.svg) */}
      <section className="bg-black px-6 py-8 text-white md:px-16 md:py-12">
        <div className="mx-auto max-w-5xl">
          {loading && <p className="text-gray-400">Carregando avaliação...</p>}

          {erro && (
            <div className="rounded-xl bg-red-500/20 px-4 py-3 text-sm text-red-300">
              {erro}
            </div>
          )}

          {avaliacao && (
            <div>
              {/* Linha superior: Voltar, Avatar, Nome, Tempo e Estrelas */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    title="Voltar"
                    aria-label="Voltar"
                    className="text-[#F6F3E4] transition hover:text-[#6A38F3]"
                  >
                    <ChevronLeft className="h-9 w-9" strokeWidth={2} />
                  </button>

                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gray-200 md:h-20 md:w-20">
                    {avaliacao.usuario.fotoPerfilUrl ? (
                      <img
                        src={avaliacao.usuario.fotoPerfilUrl}
                        alt={avaliacao.usuario.nome}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#F6F3E4]">
                        <User className="h-8 w-8 text-gray-500" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-medium text-white md:text-2xl">
                      {avaliacao.usuario.nome}
                    </span>
                    <span className="text-sm font-light text-white/80">
                      {formatarTempoRelativo(avaliacao.createdAt)}
                    </span>
                  </div>
                </div>

                <Estrelas nota={avaliacao.nota} tamanho="h-7 w-7" />
              </div>

              {/* Comentário da avaliação */}
              {avaliacao.comentario && (
                <p className="mt-8 max-w-4xl text-base leading-relaxed text-white/95 md:text-lg">
                  {avaliacao.comentario}
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Seção Inferior Bege: Lista de Comentários */}
      <main className="mx-auto max-w-5xl px-6 py-10 pb-36 md:px-16">
        {loading && <p className="text-sm text-gray-500">Carregando comentários...</p>}

        {!loading && comentarios.length === 0 && (
          <p className="text-sm text-gray-600">
            Ainda não há comentários nesta avaliação. Seja o primeiro a comentar!
          </p>
        )}

        {/* Linha vertical de thread como no design SVG */}
        {comentarios.length > 0 && (
          <div className="relative ml-2 space-y-8 border-l-2 border-black/40 pl-6 sm:ml-4 sm:pl-8">
            {comentarios.map((c) => (
              <div key={c.id} className="space-y-6">
                {renderItemComentario(c)}
                {c.respostas?.map((r) => renderItemComentario(r, true))}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Barra de Adicionar Comentário no rodapé (como no design SVG) */}
      <div className="fixed bottom-6 left-0 right-0 z-20 px-4 pointer-events-none">
        <form
          onSubmit={handleEnviarComentario}
          className="pointer-events-auto mx-auto flex w-full max-w-4xl items-center rounded-full bg-white px-6 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
        >
          <input
            type="text"
            value={novoComentario}
            onChange={(e) => setNovoComentario(e.target.value)}
            placeholder="Adicionar comentário"
            disabled={enviando}
            className="flex-1 bg-transparent text-base text-black outline-none placeholder:text-[#999797]"
          />
          <button
            type="submit"
            disabled={enviando || !novoComentario.trim()}
            title="Enviar comentário"
            aria-label="Enviar comentário"
            className="ml-3 text-gray-400 transition hover:text-[#6A38F3] disabled:opacity-30 disabled:hover:text-gray-400"
          >
            <SendHorizontal className="h-6 w-6" />
          </button>
        </form>
      </div>

      {/* Modal de Editar Comentário (como no design SVG) */}
      {comentarioParaEditar && (
        <ModalEditarComentario
          comentario={comentarioParaEditar}
          onSalvar={handleSalvarEdicao}
          onDeletar={handleDeletarComentario}
          onFechar={() => setComentarioParaEditar(null)}
        />
      )}
    </div>
  );
}
