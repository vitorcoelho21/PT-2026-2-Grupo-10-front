import CardLojaPerfil from "@/components/perfil/CardLojaPerfil";
import { Loja } from "@/services/lojaService";

interface LojasDoUsuarioProps {
  lojas: Loja[] | null; // null = ainda carregando
  erro: string;
}

// Lojas de que o usuário do perfil é dono
export default function LojasDoUsuario({ lojas, erro }: LojasDoUsuarioProps) {
  return (
    <section className="mt-12">
      <h2 className="mb-6 text-2xl font-bold text-black">Lojas</h2>

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
