import type { Metadata } from "next";

import EsqueciSenhaForm from "@/components/esquecisenha/EsqueciSenhaForm";

export const metadata: Metadata = {
  title: "Esqueci minha senha | Stock.io",
};

export default function EsqueciSenha() {
  return <EsqueciSenhaForm />;
}
