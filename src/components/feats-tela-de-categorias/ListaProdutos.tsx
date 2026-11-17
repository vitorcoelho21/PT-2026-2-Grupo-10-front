"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Produto } from "@/types/produto";

// 1. Recebe a categoria como prop
export default function ListaProdutos({ categoria }: { categoria: string }) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarProdutos() {
      try {
        // 2. Coloca a variável dinâmica no fetch usando crases (template literals)
        const resposta = await fetch(`http://localhost:3000/products?categoria=${categoria}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });

        const dados = await resposta.json();
        setProdutos(dados);
      } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
      } finally {
        setLoading(false);
      }
    }

    carregarProdutos();
  }, [categoria]);

  if (loading) {
    return <p className="text-center text-gray-500 py-12">Carregando produtos do banco de dados...</p>;
  }

  if (produtos.length === 0) {
    return <p className="text-center text-gray-500 py-12">Nenhum produto encontrado nesta categoria.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {Array.isArray(produtos) && produtos.map((produto) => (
        <Link
          href={`/produtos/${produto.id}`}
          key={produto.id}
          className="relative flex flex-col justify-between rounded-3xl bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          {/* Badge da Loja usando produto.loja?.nome */}
          <div className="absolute right-4 top-4 rounded-md bg-gray-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-600">
            {produto.loja?.nome || "STOCK.IO"}
          </div>

          {/* Imagem do Produto */}
          <div className="my-4 flex h-36 w-full items-center justify-center">
            <img 
              src={produto.imagens?.[0]?.urlImagem || "/images/placeholder.svg"} 
              alt={produto.nome} 
              className="max-h-full object-contain"
            />
          </div>

          {/* Informações usando produto.estoque */}
          <div>
            <h3 className="mb-1 text-sm font-semibold text-gray-900">{produto.nome}</h3>
            <p className="mb-3 text-base font-bold text-gray-900">
              R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
            </p>
            <span className={`text-[10px] font-bold tracking-wider ${produto.estoque > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {produto.estoque > 0 ? 'DISPONÍVEL' : 'INDISPONÍVEL'}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}