import type { Metadata } from "next";

import PaginaLoja from "@/components/loja/PaginaLoja";

export const metadata: Metadata = {
  title: "Loja | Stock.io",
};

export default async function Loja({ params }: PageProps<"/lojas/[id]">) {
  const { id } = await params;

  return <PaginaLoja id={Number(id)} />;
}
