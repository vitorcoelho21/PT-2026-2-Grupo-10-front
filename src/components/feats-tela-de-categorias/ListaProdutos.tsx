"use client";

import { useEffect, useState } from "react";

interface ListaProdutosProps {
  categoria?: string; // sem categoria = busca em todos os produtos (usado na home)
  busca?: string;     // termo digitado na search bar (já com debounce)
}

export default function ListaProdutos({ categoria, busca = "" }: ListaProdutosProps) {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Evita que uma resposta antiga sobrescreva a da busca mais recente
    const controller = new AbortController();

    async function carregarProdutos() {
      try {
        const params = new URLSearchParams();
        if (categoria) params.set("categoria", categoria);
        if (busca.trim()) params.set("busca", busca.trim());

        const resposta = await fetch(`http://localhost:3000/products?${params}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });

        const dados = await resposta.json();
        setProdutos(dados);
        setLoading(false);
      } catch (erro) {
        if (controller.signal.aborted) return;
        console.error("Erro ao carregar produtos:", erro);
        setLoading(false);
      }
    }

    carregarProdutos();
    return () => controller.abort();
  }, [categoria, busca]);

  if (loading) {
    return <p className="text-center text-gray-500 py-12">Carregando produtos do banco de dados...</p>;
  }

  if (produtos.length === 0) {
    return (
      <p className="text-center text-gray-500 py-12">
        {busca.trim()
          ? `Nenhum produto encontrado para "${busca.trim()}".`
          : "Nenhum produto encontrado nesta categoria."}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {Array.isArray(produtos) && produtos.map((produto: any) => (
        <div 
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
              src={produto.fotoUrl || "/images/placeholder.png"} 
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
        </div>
      ))}
    </div>
  );
}