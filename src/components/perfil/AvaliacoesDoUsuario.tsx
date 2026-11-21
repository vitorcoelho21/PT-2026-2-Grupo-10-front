"use client";

import { useEffect, useState } from "react";

import { LogoLoja } from "@/components/loja/CardLoja";
import CardAvaliacao from "@/components/perfil/CardAvaliacao";
import { AvaliacaoLoja, getAvaliacoesLojaDoUsuario } from "@/services/lojaService";
import { getAvaliacoesDoUsuario } from "@/services/produtoService";
import { AvaliacaoProduto } from "@/types/produto";
import { extrairMensagemErro } from "@/utils/erros";

// As duas listas viram uma só, ordenada da mais nova para a mais antiga
type Item = { tipo: "produto"; avaliacao: AvaliacaoProduto } | { tipo: "loja"; avaliacao: AvaliacaoLoja };

function CardDoItem({ item }: { item: Item }) {
  if (item.tipo === "loja") {
    const { avaliacao } = item;
    return (
      <CardAvaliacao
        href={`/lojas/${avaliacao.lojaId}`}
        imagem={
          <div className="flex h-full w-full items-center justify-center rounded-full bg-[#6A38F3]">
            <LogoLoja loja={avaliacao.loja} tamanhoInicial="text-2xl" />
          </div>
        }
        titulo={avaliacao.loja.nome}
        subtitulo="Loja"
        nota={avaliacao.nota}
        comentario={avaliacao.comentario}
        data={avaliacao.createdAt}
        linkVerMais={`/comentarios/${avaliacao.id}?tipo=loja`}
      />
    );
  }

  const { avaliacao } = item;
  const produto = avaliacao.produto;
  return (
    <CardAvaliacao
      href={`/produtos/${avaliacao.produtoId}`}
      imagem={
        <img
          src={produto?.imagens?.[0]?.urlImagem || "/images/placeholder.svg"}
          alt={produto?.nome ?? "Produto"}
          className="max-h-full max-w-full object-contain"
        />
      }
      titulo={produto?.nome ?? `Produto #${avaliacao.produtoId}`}
      subtitulo={produto?.loja.nome}
      nota={avaliacao.nota}
      comentario={avaliacao.comentario}
      data={avaliacao.createdAt}
      linkVerMais={`/comentarios/${avaliacao.id}?tipo=produto`}
      arredondamentoImagem="rounded-2xl"
    />
  );
}

// Avaliações de produtos e de lojas feitas pelo usuário do perfil
export default function AvaliacoesDoUsuario({ usuarioId }: { usuarioId: number }) {
  const [itens, setItens] = useState<Item[] | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    Promise.all([getAvaliacoesDoUsuario(usuarioId), getAvaliacoesLojaDoUsuario(usuarioId)])
      .then(([deProdutos, deLojas]) => {
        if (!ativo) return;
        const todos: Item[] = [
          ...deProdutos.map((avaliacao) => ({ tipo: "produto" as const, avaliacao })),
          ...deLojas.map((avaliacao) => ({ tipo: "loja" as const, avaliacao })),
        ];
        todos.sort((a, b) => b.avaliacao.createdAt.localeCompare(a.avaliacao.createdAt));
        setItens(todos);
      })
      .catch((err) => ativo && setErro(extrairMensagemErro(err, "Não foi possível carregar as avaliações.")));

    return () => {
      ativo = false;
    };
  }, [usuarioId]);

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-2xl font-bold text-black">Avaliações</h2>

      {erro && <p className="w-fit rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-600">{erro}</p>}

      {!erro && !itens && <p className="text-sm text-gray-600">Carregando avaliações...</p>}

      {itens?.length === 0 && (
        <p className="rounded-3xl bg-white px-6 py-10 text-center text-sm text-gray-600">
          Nenhuma avaliação feita ainda.
        </p>
      )}

      {itens && itens.length > 0 && (
        <ul className="grid gap-4 lg:grid-cols-2">
          {itens.map((item) => (
            <li key={`${item.tipo}-${item.avaliacao.id}`}>
              <CardDoItem item={item} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
