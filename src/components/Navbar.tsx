"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { IconeLoja, IconePerfil, IconeSacola, IconeSair } from "@/components/IconesNavbar";
import { logout } from "@/services/authService";
import { getToken } from "@/utils/token";

function assinar(avisarMudanca: () => void) {
  window.addEventListener("storage", avisarMudanca);
  return () => window.removeEventListener("storage", avisarMudanca);
}

const ICONE = "h-6 w-6 transition md:h-7 md:w-7";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const token = useSyncExternalStore<string | null | undefined>(
    assinar,
    getToken,
    () => undefined,
  );

  function corIcone(ativo: boolean) {
    return ativo ? "text-[#C6E700]" : "text-white hover:text-[#6A38F3]";
  }

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <nav className="flex items-center justify-between gap-3 bg-black px-4 py-6 md:px-16">
      <Link href="/" className="flex shrink-0 items-center">
        <img
          src="/images/LOGOStock.io.svg"
          alt="Stock.io"
          className="h-5 w-auto object-contain sm:h-7 md:h-10"
        />
      </Link>

      <div className="flex items-center gap-2.5 whitespace-nowrap text-xs font-bold uppercase text-white sm:gap-4 md:gap-8 md:text-sm">
        <Link href="/" title="Início">
          <IconeSacola className={`${ICONE} ${corIcone(pathname === "/" || pathname === "/feed")}`} />
        </Link>

        <Link href="/lojas" title="Lojas">
          <IconeLoja className={`${ICONE} ${corIcone(pathname.startsWith("/lojas"))}`} />
        </Link>

        {token && (
          <>
            <Link href="/perfil" title="Meu perfil">
              <IconePerfil className={`${ICONE} ${corIcone(pathname === "/perfil")}`} />
            </Link>

            <button type="button" onClick={handleLogout} title="Sair">
              <IconeSair className={`${ICONE} text-white hover:text-red-500`} />
            </button>
          </>
        )}

        {token === null && (
          <>
            <Link href="/login" className="transition hover:text-[#6A38F3]">
              Login
            </Link>
            <Link
              href="/cadastro"
              className="rounded-full bg-[#6A38F3] px-3 py-1.5 transition hover:bg-white hover:text-[#6A38F3] md:px-8"
            >
              Cadastre-se
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
