import type { Metadata } from "next";

import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Login | Stock.io",
};

export default async function Login({ searchParams }: PageProps<"/login">) {
  // Lê os parâmetros da URL:
  //   /login?cadastro=sucesso =  veio da tela de cadastro
  //   /login?senha=redefinida  = veio da tela de nova senha
  const { cadastro, senha } = await searchParams;

  return (
    <LoginForm
      cadastroRealizado={cadastro === "sucesso"}
      senhaRedefinida={senha === "redefinida"}
    />
  );
}
