"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Produto } from "@/types/produto";

interface SecaoProdutosProps {
  tituloDestaque: string; // Ex: "em Mercado"
  categoria: string;      // Ex: "mercado" para a API
}

export default function SecaoProdutosDestaque({ tituloDestaque, categoria }: SecaoProdutosProps) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const resposta = await fetch(`http://localhost:3000/products?categoria=${categoria}`);
        if (resposta.ok) {
          const dados = await resposta.json();
          // O segredo para mostrar só 5 itens está aqui:
          setProdutos(dados.slice(0, 5));
        }
      } catch (erro) {
        console.error(`Erro ao carregar destaques de ${categoria}:`, erro);
      } finally {
        setLoading(false);
      }
    }

    carregarProdutos();
  }, [categoria]);

  if (loading) return <p className="py-8 text-center text-gray-400 text-sm">Carregando destaques...</p>;
  
  // Se não houver produtos cadastrados nesta categoria, a secção oculta-se sozinha
  if (produtos.length === 0) return null; 

  return (
    <div className="mb-12">
      {/* Cabeçalho da Secção */}
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-2xl font-bold text-black">
          Produtos <span className="text-purple-600 text-lg font-normal">{tituloDestaque}</span>
        </h2>
        <Link href={`/categorias/${categoria}`} className="text-sm font-medium text-purple-600 hover:underline">
          ver mais
        </Link>
      </div>

      {/* Grelha de 5 Produtos */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {produtos.map((produto) => (
          <Link
            href={`/produtos/${produto.id}`}
            key={produto.id} className="relative flex flex-col justify-between rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md h-[250px]">
             
            <div className="absolute right-3 top-3 rounded-md bg-gray-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-600">
              {produto.loja?.nome || "STOCK.IO"}
            </div>

            <div className="my-4 flex h-24 w-full items-center justify-center">
              <img
                src={produto.imagens?.[0]?.urlImagem || "/images/placeholder.svg"}
                alt={produto.nome}
                className="max-h-full object-contain"
              />
            </div>

            <div>
              <h3 className="mb-1 truncate text-sm font-semibold text-gray-900">{produto.nome}</h3>
              <p className="mb-1 text-base font-bold text-gray-900">
                R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
              </p>
              <span className={`text-[10px] font-bold tracking-wider ${produto.estoque > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {produto.estoque > 0 ? 'DISPONÍVEL' : 'INDISPONÍVEL'}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}