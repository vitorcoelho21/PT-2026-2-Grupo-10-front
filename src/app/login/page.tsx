import type { Metadata } from "next";

import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Login | Stock.io",
};

export default async function Login({ searchParams }: PageProps<"/login">) {
  const { cadastro } = await searchParams;

  return <LoginForm cadastroRealizado={cadastro === "sucesso"} />;
}
