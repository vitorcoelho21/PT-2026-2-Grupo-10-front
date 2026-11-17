"use client";

import { useEffect, useState } from "react";

import CardAvaliacao from "@/components/perfil/CardAvaliacao";
import { getAvaliacoesDoUsuario, getProduto } from "@/services/produtoService";
import { AvaliacaoProduto, Produto } from "@/types/produto";
import { extrairMensagemErro } from "@/utils/erros";

// Avaliações de produto feitas pelo usuário do perfil
export default function AvaliacoesDoUsuario({ usuarioId }: { usuarioId: number }) {
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoProduto[] | null>(null);
  const [produtos, setProdutos] = useState<Map<number, Produto>>(new Map());
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    getAvaliacoesDoUsuario(usuarioId)
      .then(async (lista) => {
        if (!ativo) return;
        setAvaliacoes(lista);

        // A avaliação só traz o id do produto: busca nome, foto e loja de cada um (sem repetir).
        // Se algum falhar (ex.: produto apagado), o card mostra só o id.
        const ids = [...new Set(lista.map((a) => a.produtoId))];
        const resultados = await Promise.allSettled(ids.map((id) => getProduto(id)));
        const mapa = new Map<number, Produto>();
        resultados.forEach((r) => r.status === "fulfilled" && mapa.set(r.value.id, r.value));
        if (ativo) setProdutos(mapa);
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

      {!erro && !avaliacoes && <p className="text-sm text-gray-600">Carregando avaliações...</p>}

      {avaliacoes?.length === 0 && (
        <p className="rounded-3xl bg-white px-6 py-10 text-center text-sm text-gray-600">
          Nenhuma avaliação feita ainda.
        </p>
      )}

      {avaliacoes && avaliacoes.length > 0 && (
        <ul className="grid gap-4 lg:grid-cols-2">
          {avaliacoes.map((avaliacao) => (
            <li key={avaliacao.id}>
              <CardAvaliacao avaliacao={avaliacao} produto={produtos.get(avaliacao.produtoId)} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
