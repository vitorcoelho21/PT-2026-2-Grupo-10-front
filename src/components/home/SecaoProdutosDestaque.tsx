"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import CardProduto from "@/components/produtos/CardProduto";
import { getProdutos } from "@/services/produtoService";
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
        const dados = await getProdutos({ categoria });
        // O segredo para mostrar só 5 itens está aqui:
        setProdutos(dados.slice(0, 5));
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
          <CardProduto key={produto.id} produto={produto} />
        ))}
      </div>
    </div>
  );
}