"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { ChevronLeft, Mail, User } from "lucide-react";

import Navbar from "@/components/Navbar";
import { getMe } from "@/services/authService";
import { getUserById } from "@/services/userService";
import { Usuario } from "@/types/user";
import { extrairMensagemErro } from "@/utils/erros";
import { getToken } from "@/utils/token";

export default function PerfilUsuario({ id }: { id?: number }) {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const buscarId = id !== undefined ? Promise.resolve(id) : getMe().then((me) => me.sub);

    buscarId
      .then((idUsuario) => {
        if (!Number.isInteger(idUsuario)) throw new Error("id inválido");
        return getUserById(idUsuario);
      })
      .then(setUsuario)
      .catch((err) => {
        if (!isAxiosError(err) || err.response?.status === 404 || err.response?.status === 400) {
          setErro("Usuário não encontrado.");
        } else if (err.response?.status === 401 && !getToken()) {
          setErro("Faça login para ver este perfil.");
        } else {
          setErro(extrairMensagemErro(err));
        }
      });
  }, [id]);

  return (
    <main className="min-h-screen bg-[#EEF3EC]">
      <Navbar />

      <div className="px-4 pb-16 md:px-20">
        <section className="relative h-40 rounded-[48px] bg-[#14201B] md:h-52">
          <button
            type="button"
            onClick={() => router.back()}
            title="Voltar"
            className="absolute left-6 top-6 text-white transition hover:text-[#FF6B45] md:left-10 md:top-8"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
        </section>

        <div className="relative -mt-16 px-6 md:-mt-20 md:px-16">
          <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-[#EEF3EC] bg-white md:h-40 md:w-40">
            {usuario?.fotoPerfilUrl ? (
              <img src={usuario.fotoPerfilUrl} alt={usuario.nome} className="h-full w-full object-cover" />
            ) : (
              <User className="h-16 w-16 text-[#14201B]/30 md:h-20 md:w-20" />
            )}
          </div>

          <div className="mt-4">
            {erro && (
              <p className="w-fit rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-600">{erro}</p>
            )}

            {!erro && !usuario && <p className="text-sm text-gray-600">Carregando perfil...</p>}

            {usuario && (
              <>
                <h1 className="text-3xl font-bold text-[#14201B]">{usuario.nome}</h1>
                <p className="text-sm text-gray-600">@{usuario.username}</p>
                <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  {usuario.email}
                </p>
              </>
            )}
          </div>

          {usuario && (
            <section className="mt-12">
              <h2 className="mb-6 text-2xl font-bold uppercase text-[#14201B]">Produtos</h2>
              <p className="rounded-[32px] bg-white px-6 py-10 text-center text-sm text-gray-600">
                Nenhum produto cadastrado ainda.
              </p>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
