"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";

import AuthLayout from "@/components/AuthLayout";
import Input from "@/components/Input";
import { logout, resetPassword } from "@/services/authService";
import { extrairMensagemErro } from "@/utils/erros";

export default function RedefinirSenhaForm({ token }: { token: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ novaSenha: "", confirmarSenha: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  // Fica true quando o back-end disser que o token não serve mais.
  const [tokenInvalido, setTokenInvalido] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // 1) Validação no front. O mínimo de 8 caracteres é o mesmo do back-end.
    const newErrors: Record<string, string> = {};

    if (!form.novaSenha) {
      newErrors.novaSenha = "Crie uma nova senha.";
    } else if (form.novaSenha.length < 8) {
      newErrors.novaSenha = "A senha deve ter no mínimo 8 caracteres.";
    }

    if (!form.confirmarSenha) {
      newErrors.confirmarSenha = "Confirme sua nova senha.";
    } else if (form.novaSenha !== form.confirmarSenha) {
      newErrors.confirmarSenha = "As senhas não coincidem.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // 2) Chama o back-end.
    setLoading(true);
    try {
      await resetPassword(token, form.novaSenha);

      // Depois da troca, qualquer token de login antigo fica invalido
      logout();

      // Vai para o login, que mostra o aviso verde "Senha redefinida com sucesso".
      router.push("/login?senha=redefinida");
    } catch (err) {
      // Como diferenciar os dois tipos de 400?
      //   - senha inválida: "message" vem como LISTA (erros de validação)
      //   - token inválido: "message" vem como TEXTO ("Token inválido ou expirado")
      if (
        isAxiosError(err) &&
        err.response?.status === 400 &&
        !Array.isArray(err.response.data?.message)
      ) {
        setTokenInvalido(true);
      } else {
        setErrors({ geral: extrairMensagemErro(err) });
      }
    } finally {
      setLoading(false);
    }
  }

  
  if (!token || tokenInvalido) {
    return (
      <AuthLayout title="Link inválido" image="/images/login.svg">
        <div className="flex flex-col gap-5">
          <p className="rounded-xl bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
            Este link de recuperação é inválido ou expirou. Cada link vale por 30 minutos
            e só pode ser usado uma vez.
          </p>

          <Link
            href="/esqueci-senha"
            className="rounded-full bg-[#FF6B45] py-3 text-center text-sm font-bold uppercase text-[#14201B] hover:bg-[#FF845F]"
          >
            Pedir novo link
          </Link>

          <Link href="/login" className="self-center text-sm text-white underline hover:text-gray-300">
            Voltar para o login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Crie uma nova senha" image="/images/login.svg">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {errors.geral && (
          <p className="rounded-xl bg-red-500/10 px-4 py-2 text-center text-sm text-red-300">
            {errors.geral}
          </p>
        )}

        <Input
          name="novaSenha"
          label="Nova senha"
          type="password"
          value={form.novaSenha}
          onChange={(e) => setForm({ ...form, novaSenha: e.target.value })}
          error={errors.novaSenha}
        />

        <Input
          name="confirmarSenha"
          label="Confirmar nova senha"
          type="password"
          value={form.confirmarSenha}
          onChange={(e) => setForm({ ...form, confirmarSenha: e.target.value })}
          error={errors.confirmarSenha}
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-[#FF6B45] py-3 text-sm font-bold uppercase text-[#14201B] hover:bg-[#FF845F] disabled:opacity-60"
        >
          {loading ? "Salvando..." : "Salvar nova senha"}
        </button>
      </form>
    </AuthLayout>
  );
}