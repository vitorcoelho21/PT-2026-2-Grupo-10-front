"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getMe, logout } from "@/services/authService";
import { extrairMensagemErro } from "@/utils/erros";

export default function HomeProvisoria() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");

  // Roda uma vez quando a tela abre: pergunta ao back-end quem está logado.
  // (Se o token estiver vencido, o interceptor do api.ts já redireciona ao login.)
  useEffect(() => {
    getMe()
      .then((usuario) => setEmail(usuario.email))
      .catch((err) => setErro(extrairMensagemErro(err)));
  }, []);

  function handleSair() {
    logout(); // apaga o token do navegador
    router.replace("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#EEF3EC] px-4">
      <section className="flex w-full max-w-md flex-col gap-5 rounded-[32px] bg-[#14201B] p-10 text-center text-white">
        <h1 className="text-2xl font-bold">Você está conectado</h1>

        {erro ? (
          <p className="rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-300">{erro}</p>
        ) : (
          <p className="text-sm">
            {email ? `Conta: ${email}` : "Carregando seus dados..."}
          </p>
        )}

        <button
          type="button"
          onClick={handleSair}
          className="rounded-full bg-[#FF6B45] py-3 text-sm font-bold uppercase text-[#14201B] hover:bg-[#FF845F]"
        >
          Sair
        </button>
      </section>
    </main>
  );
}