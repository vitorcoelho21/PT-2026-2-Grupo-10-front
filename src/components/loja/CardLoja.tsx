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

// Card de loja (logo redondo, nome e categoria principal). Usado na home, no perfil e na tela de lojas.
// `pequeno` deixa logo e textos menores (tela de lojas).
export default function CardLoja({ loja, pequeno = false }: { loja: Loja; pequeno?: boolean }) {
  const tamanhoLogo = pequeno ? "h-28 w-28 md:h-32 md:w-32" : "h-40 w-40 md:h-44 md:w-44";
  const tamanhoNome = pequeno ? "text-base" : "text-xl";
  const tamanhoCategoria = pequeno ? "text-sm" : "text-lg";

  return (
    <Link href={`/lojas/${loja.id}`} className="group flex flex-col items-center text-center">
      <div className={`mb-3 flex ${tamanhoLogo} items-center justify-center overflow-hidden rounded-full bg-[#6A38F3] shadow-sm transition group-hover:scale-105`}>
        <LogoLoja loja={loja} tamanhoInicial={pequeno ? "text-4xl" : "text-5xl"} />
      </div>
      <span className={`w-full truncate ${tamanhoNome} text-black`} title={loja.nome}>
        {loja.nome}
      </span>
      {(loja.categoria?.nome || loja.categoriaPrincipal?.nome) && (
        <span className={`${tamanhoCategoria} lowercase leading-tight text-[#6A38F3]`}>
          {loja.categoria?.nome || loja.categoriaPrincipal?.nome}
        </span>
      )}
    </Link>
  );
}
