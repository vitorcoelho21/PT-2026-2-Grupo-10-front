"use client";

import { useState } from "react";
import Link from "next/link";

import { Loja } from "@/services/lojaService";

// Logo redondo da loja. Se não houver logo, ou a URL estiver quebrada, mostra a inicial.
export function LogoLoja({
  loja,
  tamanhoInicial = "text-5xl",
}: {
  loja: { nome: Loja["nome"]; logoUrl?: string | null };
  tamanhoInicial?: string;
}) {
  const [erroImagem, setErroImagem] = useState(false);

  if (loja.logoUrl && !erroImagem) {
    return (
      <img
        src={loja.logoUrl}
        alt={`Logo da ${loja.nome}`}
        onError={() => setErroImagem(true)}
        className="h-full w-full object-cover"
      />
    );
  }

  return <span className={`${tamanhoInicial} font-bold uppercase text-white`}>{loja.nome.charAt(0)}</span>;
}

// Card de loja (logo redondo, nome e categoria principal). Usado na home e no perfil.
export default function CardLoja({ loja }: { loja: Loja }) {
  return (
    <Link href={`/lojas/${loja.id}`} className="group flex flex-col items-center text-center">
      <div className="mb-3 flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-[#6A38F3] shadow-sm transition group-hover:scale-105 md:h-44 md:w-44">
        <LogoLoja loja={loja} />
      </div>
      <span className="w-full truncate text-xl text-black" title={loja.nome}>
        {loja.nome}
      </span>
      {loja.categoriaPrincipal && (
        <span className="text-lg lowercase leading-tight text-[#6A38F3]">{loja.categoriaPrincipal.nome}</span>
      )}
    </Link>
  );
}
