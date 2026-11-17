import Link from "next/link";

import BadgeLoja from "@/components/produto/BadgeLoja";
import { Produto } from "@/types/produto";

function formatarPreco(preco: string) {
  return Number(preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Card de produto: imagem com o logo da loja no canto, nome, preço e disponibilidade.
export default function CardProduto({ produto }: { produto: Produto }) {
  const disponivel = produto.estoque > 0;

  return (
    <Link
      href={`/produtos/${produto.id}`}
      className="group relative flex h-full flex-col rounded-[28px] bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <div className="absolute right-3 top-3 z-10">
        <BadgeLoja loja={produto.loja} />
      </div>

      <div className="mb-3 flex aspect-square items-center justify-center">
        <img
          src={produto.imagens?.[0]?.urlImagem || "/images/placeholder.svg"}
          alt={produto.nome}
          className="max-h-full max-w-full object-contain transition group-hover:scale-105"
        />
      </div>

      <h3 className="truncate text-base font-medium text-black" title={produto.nome}>
        {produto.nome}
      </h3>
      <p className="text-base text-black">{formatarPreco(produto.preco)}</p>
      <span className={`text-xs font-medium uppercase ${disponivel ? "text-[#A3C200]" : "text-[#C4003A]"}`}>
        {disponivel ? "Disponível" : "Indisponível"}
      </span>
    </Link>
  );
}
