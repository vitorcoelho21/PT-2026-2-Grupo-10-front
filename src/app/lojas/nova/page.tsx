"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createLoja } from "@/services/lojaService";
import Link from "next/link";

export default function NovaLojaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    logoUrl: "",
    bannerUrl: "",
    stickerUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
     
      await createLoja( formData );
      router.push("/lojas");
      router.refresh(); // Força a atualização da lista ao voltar
    } catch (err) {
      console.error(err);
      setError("Erro ao criar a loja. Confirma se o backend está a aceitar os dados.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 text-white">
      <div className="mx-auto max-w-2xl rounded-xl border border-gray-800 bg-[#1A1A1A] p-6">
        <h1 className="mb-6 text-2xl font-bold">Registar Nova Loja</h1>

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

          <div>
            <label className="mb-1 block text-sm text-gray-400">URL do Logótipo</label>
            <input
              type="text"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-700 bg-transparent p-2 text-white outline-none focus:border-[#FF6B45]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-gray-400">URL do Banner</label>
              <input
                type="text"
                name="bannerUrl"
                value={formData.bannerUrl}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-700 bg-transparent p-2 text-white outline-none focus:border-[#FF6B45]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">URL do Sticker</label>
              <input
                type="text"
                name="stickerUrl"
                value={formData.stickerUrl}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-700 bg-transparent p-2 text-white outline-none focus:border-[#FF6B45]"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <Link
              href="/lojas"
              className="rounded-full px-5 py-2 text-sm font-bold text-gray-400 hover:text-white"
            >
              CANCELAR
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-[#FF6B45] px-5 py-2 text-sm font-bold uppercase text-[#14201B] hover:bg-[#FF845F] disabled:opacity-50"
            >
              {loading ? "A GUARDAR..." : "SALVAR LOJA"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}