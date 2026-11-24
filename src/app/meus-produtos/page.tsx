import type { Metadata } from "next";

import GerenciarProdutos from "@/components/produto/GerenciarProdutos";
import RotaProtegida from "@/components/RotaProtegida";

export const metadata: Metadata = {
  title: "Meus produtos | Stock.io",
};

export default function MeusProdutos() {
  return (
    <RotaProtegida>
      <GerenciarProdutos />
    </RotaProtegida>
  );
}
