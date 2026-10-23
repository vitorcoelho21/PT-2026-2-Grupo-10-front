"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AuthLayout from "@/components/AuthLayout";
import Input from "@/components/Input";
import { registerUser } from "@/services/userService";

export default function CadastroForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: "",
    username: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const newErrors: Record<string, string> = {};

    if (!form.nome.trim()) newErrors.nome = "Informe seu nome completo.";
    if (!form.username.trim()) newErrors.username = "Informe um nome de usuário.";

    if (!form.email.trim()) {
      newErrors.email = "Informe seu email.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Email inválido. Use o formato correto (ex: nome@email.com).";
    }

    if (!form.senha) {
      newErrors.senha = "Crie uma senha.";
    } else if (form.senha.length < 8) {
      // ALTERADO: era 6. O back-end (CreateUserDto) exige no mínimo 8 caracteres;
      // com 6 o formulário aceitava a senha e o back-end recusava com erro 400.
      newErrors.senha = "A senha deve ter no mínimo 8 caracteres.";
    }

    if (!form.confirmarSenha) {
      newErrors.confirmarSenha = "Confirme sua senha.";
    } else if (form.senha !== form.confirmarSenha) {
      newErrors.confirmarSenha = "As senhas não coincidem.";
    }

    return newErrors;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await registerUser({
        nome: form.nome,
        username: form.username,
        email: form.email,
        senhaHash: form.senha,
      });
      router.push("/login?cadastro=sucesso");
    } catch (err: any) {
      if (err.response) {
        const status = err.response.status;
        const mensagemBack = err.response.data?.message;

        if (status === 409) {
          setErrors({ geral: mensagemBack || "Este email ou nome de usuário já está em uso." });
        } else if (status === 400) {
          setErrors({ geral: Array.isArray(mensagemBack) ? mensagemBack[0] : (mensagemBack || "Dados inválidos.") });
        } else {
          setErrors({ geral: mensagemBack || "Ocorreu um erro no servidor ao criar a conta." });
        }
      } else {
        setErrors({ geral: "Erro de conexão. Tente novamente." });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Crie sua conta" image="/images/cadastro.svg" reverse>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {errors.geral && (
          <p className="rounded-xl bg-red-500/10 px-4 py-2 text-center text-sm text-red-300">
            {errors.geral}
          </p>
        )}

        <Input
          name="nome"
          label="Nome Completo"
          value={form.nome}
          onChange={handleChange}
          error={errors.nome}
        />

        <Input
          name="username"
          label="Username"
          value={form.username}
          onChange={handleChange}
          error={errors.username}
        />

        <Input
          name="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />

        <Input
          name="senha"
          label="Senha"
          type="password"
          value={form.senha}
          onChange={handleChange}
          error={errors.senha}
        />

        <Input
          name="confirmarSenha"
          label="Confirmar Senha"
          type="password"
          value={form.confirmarSenha}
          onChange={handleChange}
          error={errors.confirmarSenha}
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-3 rounded-full bg-[#FF6B45] py-3 text-sm font-bold uppercase text-[#14201B] hover:bg-[#FF845F] disabled:opacity-60"
        >
          {loading ? "Criando conta..." : "Criar conta"}
        </button>

        <p className="text-sm text-white">
          Já possui uma conta?{" "}
          <Link href="/login" className="font-semibold text-[#FF6B45] hover:underline">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}