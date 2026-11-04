"use client";

import { useEffect, useState } from "react";

export default function ListaProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarProdutos() {
      try {
        // Substitui pelo endpoint real da tua API do backend
        const resposta = await fetch("https://tua-api.com/produtos?categoria=eletronicos");
        const dados = await resposta.json();
        setProdutos(dados);
      } catch (erro) {
        console.error("Erro ao carregar produtos do banco de dados:", erro);
      } finally {
        setLoading(false);
      }
    }

    carregarProdutos();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 py-12">A carregar produtos do banco de dados...</p>;
  }

  if (produtos.length === 0) {
    return <p className="text-center text-gray-500 py-12">Nenhum produto encontrado.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {produtos.map((produto: any) => (
        <div 
          key={produto.id} 
          className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between relative"
        >
          {/* Loja vinda do banco */}
          <div className="absolute top-4 right-4 bg-gray-100 px-2 py-1 rounded-md text-[10px] font-bold text-gray-600 uppercase tracking-wider">
            {produto.lojaNome || "STOCK.IO"}
          </div>

          {/* Foto vinda do banco */}
          <div className="w-full h-36 flex items-center justify-center my-4">
            <img 
              src={produto.fotoUrl || "/images/placeholder.png"} 
              alt={produto.nome} 
              className="max-h-full object-contain"
            />
          </div>

          {/* Nome e Valor vindos do banco */}
          <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">{produto.nome}</h3>
            <p className="font-bold text-gray-900 text-base mb-3">
              R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
            </p>
            <span className={`text-[10px] font-bold tracking-wider ${produto.quantidade > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {produto.quantidade > 0 ? 'DISPONÍVEL' : 'INDISPONÍVEL'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}