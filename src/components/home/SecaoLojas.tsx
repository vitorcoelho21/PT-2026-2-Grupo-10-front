"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getLojas, Loja } from "@/services/lojaService";

// Logo redondo da loja. Se não houver logo, ou a URL estiver quebrada, mostra a inicial.
function LogoLoja({ loja }: { loja: Loja }) {
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

  return <span className="text-5xl font-bold uppercase text-white">{loja.nome.charAt(0)}</span>;
}

export default function SecaoLojas() {
  const [lojas, setLojas] = useState<Loja[]>([]);

  useEffect(() => {
    getLojas()
      .then((dados: Loja[]) => setLojas(Array.isArray(dados) ? dados : []))
      .catch(() => {
        // Se falhar, a secção simplesmente não aparece
      });
  }, []);

  if (lojas.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="mb-6 text-2xl font-bold text-black">Lojas</h2>

      <ul className="-mx-4 flex snap-x gap-10 overflow-x-auto px-4 pb-4">
        {lojas.map((loja) => (
          <li key={loja.id} className="w-40 shrink-0 snap-start md:w-44">
            <Link href={`/lojas/${loja.id}`} className="group flex flex-col items-center text-center">
              <div className="mb-3 flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-[#6A38F3] shadow-sm transition group-hover:scale-105 md:h-44 md:w-44">
                <LogoLoja loja={loja} />
              </div>
              <span className="w-full truncate text-xl text-black" title={loja.nome}>
                {loja.nome}
              </span>
              {loja.categoriaPrincipal && (
                <span className="text-lg lowercase leading-tight text-[#6A38F3]">
                  {loja.categoriaPrincipal.nome}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
