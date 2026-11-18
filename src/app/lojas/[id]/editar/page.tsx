"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getLoja, updateLoja } from "@/services/lojaService";
import Link from "next/link";

export default function EditarLojaPage() {
  const router = useRouter();
  const params = useParams();
  const lojaId = Number(params.id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    logoUrl: "",
    bannerUrl: "",
    stickerUrl: "",
  });

  useEffect(() => {
    async function fetchDados() {
      try {
        const dados = await getLoja(lojaId);
        // Preenche o formulário garantindo que campos nulos viram strings vazias
        setFormData({
          nome: dados.nome || "",
          descricao: dados.descricao || "",
          logoUrl: dados.logoUrl || "",
          bannerUrl: dados.bannerUrl || "",
          stickerUrl: dados.stickerUrl || "",
        });
      } catch (err) {
        setError("Erro ao carregar os dados da loja.");
      } finally {
        setFetching(false);
      }
    }
    if (lojaId) fetchDados();
  }, [lojaId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await updateLoja(lojaId, formData);
      router.push("/lojas");
      router.refresh();
    } catch (err) {
      setError("Erro ao guardar as alterações. Confirma se tens permissão.");
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-8 text-white">A carregar dados da loja...</div>;
  }

  return (
    <div className="min-h-screen p-8 text-white">
      <div className="mx-auto max-w-2xl rounded-xl border border-gray-800 bg-[#1A1A1A] p-6">
        <h1 className="mb-6 text-2xl font-bold">Editar Loja</h1>

        {error && <p className="mb-4 rounded-xl bg-red-500/10 px-4 py-2 text-red-300">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-400">Nome da Loja *</label>
            <input
              type="text"
              name="nome"
              required
              value={formData.nome}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-700 bg-transparent p-2 text-white outline-none focus:border-[#FF6B45]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-400">Descrição</label>
            <textarea
              name="descricao"
              rows={3}
              value={formData.descricao}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-700 bg-transparent p-2 text-white outline-none focus:border-[#FF6B45]"
            />
          </div>

          {/* Pode adicionar os campos de logo, banner e sticker aqui com a mesma estrutura do formulário de criação */}

          <div className="mt-8 flex justify-end gap-4">
            <Link href="/lojas" className="rounded-full px-5 py-2 text-sm font-bold text-gray-400 hover:text-white">
              CANCELAR
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-[#FF6B45] px-5 py-2 text-sm font-bold uppercase text-[#14201B] hover:bg-[#FF845F] disabled:opacity-50"
            >
              {loading ? "A GUARDAR..." : "SALVAR ALTERAÇÕES"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}