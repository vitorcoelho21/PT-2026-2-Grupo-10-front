import Link from "next/link";

import { LogoLoja } from "@/components/loja/CardLoja";
import { Loja } from "@/services/lojaService";

// Card de loja do perfil: nome e categoria à esquerda, logo redondo à direita
export default function CardLojaPerfil({ loja }: { loja: Loja }) {
  return (
    <Link
      href={`/lojas/${loja.id}`}
      className="group flex h-full items-center justify-between gap-4 rounded-3xl bg-white p-5 transition hover:shadow-md"
    >
      <div className="min-w-0">
        <p className="truncate text-base font-bold text-black" title={loja.nome}>
          {loja.nome}
        </p>
        {(loja.categoria?.nome || loja.categoriaPrincipal?.nome) && (
          <p className="truncate text-sm lowercase text-[#6A38F3]">
            {loja.categoria?.nome || loja.categoriaPrincipal?.nome}
          </p>
        )}
      </div>

      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#6A38F3] transition group-hover:scale-105">
        <LogoLoja loja={loja} tamanhoInicial="text-2xl" />
      </div>
    </Link>
  );
}
