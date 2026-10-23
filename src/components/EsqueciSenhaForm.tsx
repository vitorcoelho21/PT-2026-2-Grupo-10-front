"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

import AuthLayout from "@/components/AuthLayout";
import Input from "@/components/Input";
import { forgotPassword } from "@/services/authService";
import { extrairMensagemErro } from "@/utils/erros";

export default function EsqueciSenhaForm() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  // Vazio = ainda não enviou. Preenchido = mensagem de sucesso devolvida pelo back-end.
  const [mensagemEnviado, setMensagemEnviado] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // impede o navegador de recarregar a página

    // 1) Validação rápida no front (o back-end valida de novo, por segurança).
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = "Informe o seu email.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Email inválido. Use o formato correto.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // 2) Chama o back-end.
    setLoading(true);
    try {
      const resposta = await forgotPassword(email.trim());
      setMensagemEnviado(resposta.message);
    } catch (err) {
      // Cobre 400 (dados inválidos), 429 (muitas tentativas) e falta de conexão.
      setErrors({ geral: extrairMensagemErro(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Esqueceu sua senha?" image="/images/login.svg">
      {mensagemEnviado ? (
        // ---- Estado de SUCESSO: o pedido foi enviado ----
        <div className="flex flex-col gap-5">
          <p className="rounded-xl bg-[#1C3A28] px-4 py-3 text-center text-sm text-green-300">
            {mensagemEnviado}
          </p>

          <p className="text-center text-sm text-white">
            O link vale por 30 minutos. Se o e-mail não chegar, olhe a caixa de spam
            ou peça um novo link.
          </p>

          <button
            type="button"
            onClick={() => setMensagemEnviado("")}
            className="rounded-full border border-[#FF6B45] py-3 text-sm font-bold uppercase text-[#FF6B45] hover:bg-[#FF6B45]/10"
          >
            Pedir outro link
          </button>

          <Link href="/login" className="self-center text-sm text-white underline hover:text-gray-300">
            Voltar para o login
          </Link>
        </div>
      ) : (
        // ---- Estado INICIAL: formulário com o campo de e-mail ----
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <p className="text-center text-sm text-white">
            Informe o email da sua conta e enviaremos um link para você criar uma nova senha.
          </p>

          {errors.geral && (
            <p className="rounded-xl bg-red-500/10 px-4 py-2 text-center text-sm text-red-300">
              {errors.geral}
            </p>
          )}

          <Input
            name="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-[#FF6B45] py-3 text-sm font-bold uppercase text-[#14201B] hover:bg-[#FF845F] disabled:opacity-60"
          >
            {loading ? "Enviando..." : "Enviar link"}
          </button>

          <Link href="/login" className="self-center text-sm text-white underline hover:text-gray-300">
            Voltar para o login
          </Link>
        </form>
      )}
    </AuthLayout>
  );
}
