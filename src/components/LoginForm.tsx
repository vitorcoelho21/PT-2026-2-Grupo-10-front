"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AuthLayout from "@/components/AuthLayout";
import Input from "@/components/Input";
import { login } from "@/utils/auth";

export default function LoginForm({ cadastroRealizado }: { cadastroRealizado: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!email.trim()) newErrors.email = "Informe seu email.";
    if (!senha) newErrors.senha = "Informe sua senha.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await login(email, senha);
      router.push("/");
    } catch (err) {
      setErrors({ geral: (err as Error).message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Bem vindo de volta!" image="/images/login.svg">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {cadastroRealizado && !errors.geral && (
          <p className="rounded-xl bg-[#1C3A28] px-4 py-2 text-center text-sm text-green-300">
            Conta criada com sucesso! Faça login para continuar.
          </p>
        )}

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

        <Input
          name="senha"
          label="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          error={errors.senha}
        />

        {/* TODO: recuperação de senha (ciclo 4) */}
        <Link href="#" className="self-center text-xs text-white underline hover:text-gray-300">
          Esqueceu sua senha?
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-[#FF6B45] py-3 text-sm font-bold uppercase text-[#14201B] hover:bg-[#FF845F] disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className="text-sm text-white">
          Não possui uma conta?{" "}
          <Link href="/cadastro" className="font-semibold text-[#FF6B45] hover:underline">
            Cadastre-se
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
