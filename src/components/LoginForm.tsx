"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { login } from "@/services/authService";

import AuthLayout from "@/components/AuthLayout";
import Input from "@/components/Input";

// "senhaRedefinida" indica que o usuário acabou de trocar a senha (veio de /redefinir-senha)
export default function LoginForm({
  cadastroRealizado,
  senhaRedefinida,
}: {
  cadastroRealizado: boolean;
  senhaRedefinida: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = "Informe o seu email.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Email inválido. Use o formato correto.";
    }

    if (!senha) {
      newErrors.senha = "Informe a sua senha.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await login({ email, senhaHash: senha });
      //  antes ia para "/", que redireciona de volta ao /login, agora vai pra /home
      router.push("/home");
    } catch (err: any) {
      if (err.response) {
        const status = err.response.status;

        if (status === 401) {
          setErrors({ geral: "Email ou senha incorretos." });
        } else if (status === 409) {
          setErrors({ geral: "Este email já está cadastrado." });
        } else if (status === 429) {
          // limite de tentativas do back-end (3)
          setErrors({ geral: "Muitas tentativas seguidas. Aguarde um minuto e tente de novo." });
        } else {
          // o back-end pode mandar "message" como LISTA de erros, só aparece o primeiro;
          const mensagemBack = err.response.data?.message;
          setErrors({
            geral: (Array.isArray(mensagemBack) ? mensagemBack[0] : mensagemBack) || "Ocorreu um erro no servidor.",
          });
        }
      } else {
        setErrors({ geral: "Erro de conexão. Tente novamente." });
      }
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

        {/* o aviso exibido depois de redefinir a senha */}
        {senhaRedefinida && !errors.geral && (
          <p className="rounded-xl bg-[#1C3A28] px-4 py-2 text-center text-sm text-green-300">
            Senha redefinida com sucesso! Entre com a nova senha.
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

        {/* Mudei: o link agora leva à tela de recuperação de senha */}
        <Link href="/esqueci-senha" className="self-center text-xs text-white underline hover:text-gray-300">
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
