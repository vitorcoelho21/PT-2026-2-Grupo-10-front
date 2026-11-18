import { Plus } from "lucide-react";

import CardLojaPerfil from "@/components/perfil/CardLojaPerfil";
import { Loja } from "@/services/lojaService";

interface LojasDoUsuarioProps {
  lojas: Loja[] | null; // null = ainda carregando
  erro: string;
  onAdicionar?: () => void;
}

// Lojas de que o usuário do perfil é dono
export default function LojasDoUsuario({ lojas, erro, onAdicionar }: LojasDoUsuarioProps) {
  return (
    <section className="mt-12">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-black">Lojas</h2>
        {onAdicionar && (
          <button
            type="button"
            onClick={onAdicionar}
            title="Adicionar loja"
            aria-label="Adicionar loja"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6A38F3] text-white shadow-md transition hover:bg-[#7B4FF5]"
          >
            <Plus className="h-6 w-6" strokeWidth={3} />
          </button>
        )}
      </div>

      {erro && <p className="w-fit rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-600">{erro}</p>}

      {!erro && !lojas && <p className="text-sm text-gray-600">Carregando lojas...</p>}

      {lojas?.length === 0 && (
        <p className="rounded-3xl bg-white px-6 py-10 text-center text-sm text-gray-600">
          Nenhuma loja cadastrada ainda.
        </p>
      )}

      {lojas && lojas.length > 0 && (
        <ul className="flex gap-4 overflow-x-auto pb-4">
          {lojas.map((loja) => (
            <li key={loja.id} className="w-64 shrink-0 md:w-72">
              <CardLojaPerfil loja={loja} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
