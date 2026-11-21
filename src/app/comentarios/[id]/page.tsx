import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PaginaComentarios from "@/components/avaliacao/PaginaComentarios";

export const metadata: Metadata = {
  title: "Comentários da Avaliação | Stock.io",
};

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ tipo?: "loja" | "produto" }>;
}

export default async function PaginaComentariosRota({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const sp = searchParams ? await searchParams : undefined;
  const avaliacaoId = Number(id);

  if (!Number.isInteger(avaliacaoId) || avaliacaoId <= 0) {
    notFound();
  }

  return (
    <PaginaComentarios
      avaliacaoId={avaliacaoId}
      tipoInicial={sp?.tipo}
    />
  );
}
