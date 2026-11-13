"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import BadgeLoja from "@/components/produto/BadgeLoja";
import { getProdutos } from "@/services/produtoService";
import { Produto } from "@/types/produto";

function formatarPreco(preco: string) {
  return Number(preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

interface ProdutosDaMesmaLojaProps {
  lojaId: number;
  produtoAtualId: number; // não repete o produto que já está aberto
}

export default function ProdutosDaMesmaLoja({ lojaId, produtoAtualId }: ProdutosDaMesmaLojaProps) {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    let ativo = true;
    getProdutos({ lojaId })
      .then((dados) => {
        if (ativo) setProdutos(dados.filter((p) => p.id !== produtoAtualId));
      })
      .catch(() => {
        // Se falhar, a secção simplesmente não aparece
      });
    return () => {
      ativo = false;
    };
  }, [lojaId, produtoAtualId]);

  if (produtos.length === 0) return null;

  return (
    <section>
      <h2 className="mb-6 text-3xl font-medium text-black md:text-4xl">Da mesma loja</h2>

      <div className="-mx-4 flex snap-x gap-6 overflow-x-auto px-4 pb-4">
        {produtos.map((produto) => (
          <Link
            key={produto.id}
            href={`/produtos/${produto.id}`}
            className="group relative flex w-60 shrink-0 snap-start flex-col rounded-3xl bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="absolute right-4 top-4 z-10">
              <BadgeLoja loja={produto.loja} />
            </div>

            <div className="mb-4 flex aspect-square items-center justify-center">
              <img
                src={produto.imagens?.[0]?.urlImagem || "/images/placeholder.svg"}
                alt={produto.nome}
                className="max-h-full max-w-full object-contain transition group-hover:scale-105"
              />
            </div>

            <h3 className="truncate text-lg font-medium text-gray-900">{produto.nome}</h3>
            <span
              className={`mb-1 text-[10px] font-bold tracking-wider ${
                produto.estoque > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {produto.estoque > 0 ? "DISPONÍVEL" : "INDISPONÍVEL"}
            </span>
            <p className="text-lg font-bold text-gray-900">{formatarPreco(produto.preco)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
