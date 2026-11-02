"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLojas, deleteLoja } from "@/services/lojaService"; // Adicionado deleteLoja

export default function LojasPage() {
  const [lojas, setLojas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchLojas() {
      try {
        const data = await getLojas();
        const arrayDeLojas = Array.isArray(data) ? data : data?.data || data?.result || [];
        setLojas(arrayDeLojas);
      } catch (err) {
        setError("Erro ao carregar as lojas. Verifica se o backend está a correr.");
      } finally {
        setLoading(false);
      }
    }
    fetchLojas();
  }, []);

  // Nova função para apagar a loja
  const handleDelete = async (id: number) => {
    const confirmar = window.confirm("Tens a certeza que queres apagar esta loja?");
    if (!confirmar) return;

    try {
      await deleteLoja(id);
      // Atualiza o estado local para remover a loja do ecrã instantaneamente
      setLojas((prevLojas) => prevLojas.filter((loja) => loja.id !== id));
    } catch (err) {
      alert("Erro ao apagar a loja. Confirma se tens permissão.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen p-8 text-white">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">As Minhas Lojas</h1>
        <Link 
          href="/lojas/nova" 
          className="rounded-full bg-[#FF6B45] px-5 py-2 text-sm font-bold uppercase text-[#14201B] hover:bg-[#FF845F]"
        >
          + Nova Loja
        </Link>
      </div>

      {loading && <p className="text-gray-400">A carregar lojas...</p>}
      {error && <p className="rounded-xl bg-red-500/10 px-4 py-2 text-red-300">{error}</p>}

      {!loading && !error && lojas.length === 0 && (
        <p className="text-gray-400">Ainda não tens nenhuma loja registada.</p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lojas.map((loja) => (
          <div key={loja.id} className="rounded-xl border border-gray-800 bg-[#1A1A1A] p-5">
            <h2 className="mb-2 text-xl font-semibold">{loja.nome}</h2>
            <p className="mb-4 text-sm text-gray-400 line-clamp-2">
              {loja.descricao || "Sem descrição"}
            </p>
            <div className="flex gap-4">
              <Link href={`/lojas/${loja.id}`} className="text-sm text-blue-400 hover:underline">
                Editar
              </Link>
              {/* Evento onClick adicionado ao botão de apagar */}
              <button 
                onClick={() => handleDelete(loja.id)}
                className="text-sm text-red-400 hover:underline"
              >
                Apagar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}