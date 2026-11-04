import type { Metadata } from "next";

import CadastroForm from "@/components/cadastro/CadastroForm";

export const metadata: Metadata = {
  title: "Cadastro | Stock.io",
};

export default function Cadastro() {
  return <CadastroForm />;
}
