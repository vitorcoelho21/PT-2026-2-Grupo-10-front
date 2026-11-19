"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Star, Trash2, User } from "lucide-react";

import Navbar from "@/components/Navbar";
import { BotaoAvaliacao, ModalAvaliacao } from "@/components/avaliacao";
import ModalExcluirLoja from "@/components/loja/ModalExcluirLoja";
import ModalLoja from "@/components/loja/ModalLoja";
import CardAvaliacao from "@/components/perfil/CardAvaliacao";
import { getMe } from "@/services/authService";
import {
  atualizarAvaliacaoLoja,
  AvaliacaoLoja,
  criarAvaliacaoLoja,
  deletarAvaliacaoLoja,
  getAvaliacoesDaLoja,
  getLojas,
  Loja,
} from "@/services/lojaService";
import { getUserById } from "@/services/userService";
import { extrairMensagemErro } from "@/utils/erros";
import { getToken } from "@/utils/token";

function FotoAutor({ autor }: { autor: AvaliacaoLoja["usuario"] }) {
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

export default function PaginaLoja({ id }: { id: number }) {
  const router = useRouter();
  const [loja, setLoja] = useState<Loja | null>(null);
  const [erro, setErro] = useState("");
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoLoja[] | null>(null);
  const [erroAvaliacoes, setErroAvaliacoes] = useState("");
  const [nomeDono, setNomeDono] = useState("");
  const [idLogado, setIdLogado] = useState<number | null>(null);
  const [editando, setEditando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [modalAvaliacaoAberto, setModalAvaliacaoAberto] = useState(false);
  const idDono = loja?.usuarioId;

  useEffect(() => {
    getLojas()
      .then((lojas: Loja[]) => {
        const encontrada = Array.isArray(lojas) ? lojas.find((l) => l.id === id) : undefined;
        if (encontrada) setLoja(encontrada);
        else setErro("Loja não encontrada.");
      })
      .catch((err) => setErro(extrairMensagemErro(err, "Não foi possível carregar a loja.")));

    getAvaliacoesDaLoja(id)
      .then(setAvaliacoes)
      .catch((err) => setErroAvaliacoes(extrairMensagemErro(err, "Não foi possível carregar as avaliações.")));

    if (getToken()) {
      getMe()
        .then((me) => setIdLogado(me.sub))
        .catch(() => {});
    }
  }, [id]);

  useEffect(() => {
    if (idDono === undefined || !getToken()) return;
    getUserById(idDono)
      .then((dono) => setNomeDono(dono.nome))
      .catch(() => {});
  }, [idDono]);

  const ehDono = idLogado !== null && idLogado === idDono;
  const media = avaliacoes?.length ? avaliacoes.reduce((soma, a) => soma + a.nota, 0) / avaliacoes.length : null;
  const minhaAvaliacao = avaliacoes?.find((a) => idLogado !== null && a.usuarioId === idLogado) ?? null;

  function handleAbrirModalAvaliacao() {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    setModalAvaliacaoAberto(true);
  }

  async function handleSalvarAvaliacao(dados: { nota: number; comentario?: string }) {
    if (minhaAvaliacao) {
      const atualizada = await atualizarAvaliacaoLoja(minhaAvaliacao.id, dados);
      setAvaliacoes((prev) =>
        prev ? prev.map((a) => (a.id === minhaAvaliacao.id ? { ...a, ...atualizada } : a)) : [atualizada]
      );
    } else {
      const nova = await criarAvaliacaoLoja({ lojaId: id, ...dados });
      setAvaliacoes((prev) => (prev ? [nova, ...prev] : [nova]));
    }
  }

  async function handleDeletarAvaliacao() {
    if (!minhaAvaliacao) return;
    await deletarAvaliacaoLoja(minhaAvaliacao.id);
    setAvaliacoes((prev) => (prev ? prev.filter((a) => a.id !== minhaAvaliacao.id) : []));
  }

  return (
    <main className="min-h-screen bg-[#F6F3E4]">
      <Navbar />

      <section className="relative flex h-72 items-center justify-center overflow-hidden bg-gradient-to-br from-[#6A38F3] to-black md:h-[420px]">
        {loja?.bannerUrl && (
          <img src={loja.bannerUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/40" />

        {erro && <p className="relative rounded-xl bg-red-500/20 px-4 py-2 text-sm text-white">{erro}</p>}
        {!erro && !loja && <p className="relative text-sm text-white">Carregando loja...</p>}

        {loja && (
          <>
            <div className="relative px-4 text-center">
              <h1 className="text-4xl font-medium text-white md:text-6xl">{loja.nome}</h1>
              {(loja.categoria?.nome || loja.categoriaPrincipal?.nome) && (
                <p className="text-lg lowercase text-white/80 md:text-xl">
                  {loja.categoria?.nome || loja.categoriaPrincipal?.nome}
                </p>
              )}
            </div>

            {nomeDono && (
              <Link
                href={`/perfil/${loja.usuarioId}`}
                className="absolute bottom-4 right-4 text-xs text-white/80 hover:text-white md:bottom-6 md:right-8"
              >
                by {nomeDono}
              </Link>
            )}

            {ehDono && (
              <div className="absolute right-4 top-4 flex items-center gap-2 md:right-8 md:top-6">
                <button
                  type="button"
                  onClick={() => setEditando(true)}
                  title="Editar loja"
                  aria-label="Editar loja"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6A38F3] text-white shadow-md transition hover:bg-[#7B4FF5]"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setExcluindo(true)}
                  title="Excluir loja"
                  aria-label="Excluir loja"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF0000] text-white shadow-md transition hover:bg-[#D90000]"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <section className="bg-black px-4 pb-10 pt-8 text-center text-white">
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
          avaliacoes && <p className="mt-2 text-sm text-white/70">Esta loja ainda não tem avaliações.</p>
        )}

        <BotaoAvaliacao
          onClick={handleAbrirModalAvaliacao}
          jaAvaliou={Boolean(minhaAvaliacao)}
          className="mt-6"
        />
      </section>

      <div className="px-4 py-10 md:px-16">
        {erroAvaliacoes && (
          <p className="w-fit rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-600">{erroAvaliacoes}</p>
        )}

        {!erroAvaliacoes && !avaliacoes && <p className="text-sm text-gray-600">Carregando avaliações...</p>}

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
                  linkVerMais={`/comentarios/${avaliacao.id}?tipo=loja`}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {modalAvaliacaoAberto && loja && (
        <ModalAvaliacao
          tipo="loja"
          nomeAlvo={loja.nome}
          avaliacaoExistente={minhaAvaliacao}
          onSalvar={handleSalvarAvaliacao}
          onDeletar={minhaAvaliacao ? handleDeletarAvaliacao : undefined}
          onFechar={() => setModalAvaliacaoAberto(false)}
        />
      )}

      {editando && loja && (
        <ModalLoja
          loja={loja}
          onSalva={(atualizada) => {
            setLoja(atualizada);
            setEditando(false);
          }}
          onDeletada={() => router.replace("/perfil")}
          onFechar={() => setEditando(false)}
        />
      )}

      {excluindo && loja && (
        <ModalExcluirLoja
          loja={loja}
          onSucesso={() => router.replace("/perfil")}
          onFechar={() => setExcluindo(false)}
        />
      )}
    </main>
  );
}
