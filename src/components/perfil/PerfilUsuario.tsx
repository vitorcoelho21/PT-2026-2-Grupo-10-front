"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { ChevronLeft, Mail, User } from "lucide-react";

import Navbar from "@/components/Navbar";
import ModaisConta from "@/components/perfil/ModaisConta";
import AvaliacoesDoUsuario from "@/components/perfil/AvaliacoesDoUsuario";
import LojasDoUsuario from "@/components/perfil/LojasDoUsuario";
import { getMe } from "@/services/authService";
import { getLojas, Loja } from "@/services/lojaService";
import { getProdutos } from "@/services/produtoService";
import { getUserById } from "@/services/userService";
import { Produto } from "@/types/produto";
import { Usuario } from "@/types/user";
import { extrairMensagemErro } from "@/utils/erros";
import { getToken } from "@/utils/token";

function formatarPreco(preco: string) {
  return Number(preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function PerfilUsuario({ id }: { id?: number }) {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [erro, setErro] = useState("");
  const [lojas, setLojas] = useState<Loja[] | null>(null);
  const [produtos, setProdutos] = useState<Produto[] | null>(null);
  const [erroProdutos, setErroProdutos] = useState("");
  const idUsuario = usuario?.id;

  // Id de quem está logado (null = ninguém logado, ou ainda não sabemos).
  const [idLogado, setIdLogado] = useState<number | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  // O botão "Editar Perfil" só aparece se há alguém logado E o perfil exibido é o dele.
  const ehMeuPerfil = idLogado !== null && idUsuario === idLogado;

  // Lojas de que o usuário é dono e, a partir delas, os produtos
  useEffect(() => {
    if (idUsuario === undefined) return;

    getLojas()
      .then((todas: Loja[]) => {
        const minhas = todas.filter((loja) => loja.usuarioId === idUsuario);
        setLojas(minhas);
        return Promise.all(minhas.map((loja) => getProdutos({ lojaId: loja.id })));
      })
      .then((listas) => setProdutos(listas.flat()))
      .catch((err) => setErroProdutos(extrairMensagemErro(err, "Não foi possível carregar as lojas e produtos.")));
  }, [idUsuario]);

  useEffect(() => {
    // Em /perfil (sem id) o perfil é o de quem está logado: o getMe já diz quem é.
    const buscarId =
      id !== undefined
        ? Promise.resolve(id)
        : getMe().then((me) => {
            setIdLogado(me.sub);
            return me.sub;
          });

    // Em /perfil/[id] é preciso perguntar quem está logado (se houver token) para
    // comparar com o perfil exibido. Sem token, não há botão. Se a chamada falhar,
    // o botão simplesmente não aparece (um 401 já é tratado pelo interceptor do api.ts).
    if (id !== undefined && getToken()) {
      getMe()
        .then((me) => setIdLogado(me.sub))
        .catch(() => {});
    }

    buscarId
      .then((idUsuario) => {
        if (!Number.isInteger(idUsuario)) throw new Error("id inválido");
        return getUserById(idUsuario);
      })
      .then(setUsuario)
      .catch((err) => {
        if (!isAxiosError(err) || err.response?.status === 404 || err.response?.status === 400) {
          setErro("Usuário não encontrado.");
        } else if (err.response?.status === 401 && !getToken()) {
          setErro("Faça login para ver este perfil.");
        } else {
          setErro(extrairMensagemErro(err));
        }
      });
  }, [id]);

  return (
    <main className="min-h-screen bg-[#F6F3E4]">
      <div className="bg-black pb-20 md:pb-32">
        <Navbar />
      </div>

      <div className="px-4 pb-16 md:px-16">
        <div className="relative -mt-16 flex items-start gap-2 md:-mt-20 md:gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            title="Voltar"
            className="mt-4 text-white transition hover:text-[#6A38F3] md:mt-6"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[#F6F3E4] bg-white md:h-40 md:w-40">
            {usuario?.fotoPerfilUrl ? (
              <img src={usuario.fotoPerfilUrl} alt={usuario.nome} className="h-full w-full object-cover" />
            ) : (
              <User className="h-16 w-16 text-gray-300 md:h-20 md:w-20" />
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <section className="ml-10 md:ml-12">
            {erro && (
              <p className="w-fit rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-600">{erro}</p>
            )}

            {!erro && !usuario && <p className="text-sm text-gray-600">Carregando perfil...</p>}

            {usuario && (
              <>
                <h1 className="text-2xl font-bold text-black md:text-3xl">{usuario.nome}</h1>
                <p className="text-sm text-gray-600">@{usuario.username}</p>
                <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  {usuario.email}
                </p>
              </>
            )}
          </section>

          {ehMeuPerfil && (
            <button
              type="button"
              onClick={() => setModalAberto(true)}
              className="ml-10 w-fit rounded-full bg-[#6A38F3] px-10 py-2.5 text-base font-medium text-white shadow-md transition hover:bg-[#7B4FF5] md:ml-0 md:w-80 md:px-0"
            >
              Editar Perfil
            </button>
          )}
        </div>

        {usuario && (
          <section className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-black">Produtos</h2>

            {erroProdutos && (
              <p className="w-fit rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-600">{erroProdutos}</p>
            )}

            {!erroProdutos && !produtos && <p className="text-sm text-gray-600">Carregando produtos...</p>}

            {produtos?.length === 0 && (
              <p className="rounded-3xl bg-white px-6 py-10 text-center text-sm text-gray-600">
                Nenhum produto cadastrado ainda.
              </p>
            )}

            {produtos && produtos.length > 0 && (
              <ul className="flex gap-4 overflow-x-auto pb-4">
                {produtos.map((produto) => (
                  <li key={produto.id} className="w-44 shrink-0 md:w-52">
                    <Link
                      href={`/produtos/${produto.id}`}
                      className="flex h-full flex-col rounded-3xl bg-white p-4 transition hover:shadow-md"
                    >
                      <div className="mb-3 flex h-28 items-center justify-center overflow-hidden rounded-2xl bg-white md:h-32">
                        <img
                          src={produto.imagens?.[0]?.urlImagem || "/images/placeholder.svg"}
                          alt={produto.nome}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <p className="truncate text-sm font-bold text-black" title={produto.nome}>
                        {produto.nome}
                      </p>
                      <p className="text-sm font-bold text-black">{formatarPreco(produto.preco)}</p>
                      <p className="truncate text-xs text-gray-500">{produto.loja.nome}</p>
                      <span
                        className={`mt-2 text-[10px] font-bold uppercase tracking-wider ${
                          produto.estoque > 0 ? "text-[#6A38F3]" : "text-red-500"
                        }`}
                      >
                        {produto.estoque > 0 ? `${produto.estoque} em estoque` : "Esgotado"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {usuario && <LojasDoUsuario lojas={lojas} erro={lojas ? "" : erroProdutos} />}

        {usuario && <AvaliacoesDoUsuario usuarioId={usuario.id} />}
      </div>

      {modalAberto && usuario && (
        <ModaisConta
          usuario={usuario}
          onFechar={() => setModalAberto(false)}
          onUsuarioAtualizado={(atualizado) => setUsuario(atualizado)}
        />
      )}
    </main>
  );
}
