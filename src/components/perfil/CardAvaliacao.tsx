import Link from "next/link";
import { Star } from "lucide-react";

import { AvaliacaoProduto, Produto } from "@/types/produto";

interface CardAvaliacaoProps {
  avaliacao: AvaliacaoProduto;
  produto?: Produto; // pode faltar se o produto não carregou
}

function formatarData(data: string) {
  return new Date(data).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

// Uma avaliação feita pelo usuário: produto avaliado, estrelas, comentário e data
export default function CardAvaliacao({ avaliacao, produto }: CardAvaliacaoProps) {
  return (
    <article className="flex gap-4 rounded-3xl bg-white p-4 md:p-5">
      <Link
        href={`/produtos/${avaliacao.produtoId}`}
        className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gray-50"
      >
        <img
          src={produto?.imagens?.[0]?.urlImagem || "/images/placeholder.svg"}
          alt={produto?.nome ?? "Produto"}
          className="max-h-full max-w-full object-contain"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4">
          <Link
            href={`/produtos/${avaliacao.produtoId}`}
            className="truncate font-bold text-black hover:text-[#6A38F3]"
          >
            {produto?.nome ?? `Produto #${avaliacao.produtoId}`}
          </Link>
          <time className="text-xs text-gray-500" dateTime={avaliacao.createdAt}>
            {formatarData(avaliacao.createdAt)}
          </time>
        </div>

        {produto && <p className="truncate text-xs text-gray-500">{produto.loja.nome}</p>}

        <div className="mt-1 flex gap-0.5" aria-label={`Nota ${avaliacao.nota} de 5`}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i <= avaliacao.nota ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </div>

        {avaliacao.comentario && <p className="mt-2 text-sm text-gray-700">{avaliacao.comentario}</p>}
      </div>
    </article>
  );
}
