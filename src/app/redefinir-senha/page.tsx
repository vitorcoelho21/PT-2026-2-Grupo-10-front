import type { Metadata } from "next";

import RedefinirSenhaForm from "@/components/RedefinirSenhaForm";

export const metadata: Metadata = {
  title: "Nova senha | Stock.io",
};

export default async function RedefinirSenha({ searchParams }: PageProps<"/redefinir-senha">) {
  const { token } = await searchParams;

  // Um parâmetro da URL pode ser texto, lista (?token=a&token=b) ou não existir.
  // Só aceita texto; qualquer outra coisa vira "" e o formulário mostra "Link inválido".
  return <RedefinirSenhaForm token={typeof token === "string" ? token : ""} />;
}
