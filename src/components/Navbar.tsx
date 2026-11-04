"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ShoppingBag, Store, User } from "lucide-react";

import { logout } from "@/services/authService";
import { getToken } from "@/utils/token";

function assinar(avisarMudanca: () => void) {
  window.addEventListener("storage", avisarMudanca);
  return () => window.removeEventListener("storage", avisarMudanca);
}

const ICONE = "h-6 w-6 transition";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const token = useSyncExternalStore<string | null | undefined>(
    assinar,
    getToken,
    () => undefined,
  );

  const inicio = token ? "/home" : "/";

  function corIcone(ativo: boolean) {
    return ativo ? "text-[#FF6B45]" : "text-[#14201B] hover:text-[#FF6B45]";
  }

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <nav className="flex items-center justify-between gap-3 px-4 py-6 md:px-20 md:py-10">
      <Link href={inicio} className="flex shrink-0 items-center">
        <img
          src="/images/logo.svg"
          alt="Stock.io"
          className="h-8 w-8 object-cover object-left sm:w-auto md:h-10"
        />
      </Link>

      <div className="flex items-center gap-3 whitespace-nowrap text-sm font-bold uppercase text-[#14201B] md:gap-6">
        <Link href={inicio} title="Início">
          <ShoppingBag className={`${ICONE} ${corIcone(pathname === "/home")}`} />
        </Link>

        <Link href="/lojas" title="Lojas">
          <Store className={`${ICONE} ${corIcone(pathname.startsWith("/lojas"))}`} />
        </Link>

        {token && (
          <>
            <Link href="/perfil" title="Meu perfil">
              <User className={`${ICONE} ${corIcone(pathname === "/perfil")}`} />
            </Link>

            <button type="button" onClick={handleLogout} title="Sair">
              <LogOut className={`${ICONE} text-[#14201B] hover:text-red-500`} />
            </button>
          </>
        )}

        {token === null && (
          <>
            <Link href="/login" className="transition hover:text-[#FF6B45]">
              Login
            </Link>
            <Link
              href="/cadastro"
              className="rounded-full bg-[#FF6B45] px-4 py-2.5 transition hover:bg-[#FF845F] md:px-6"
            >
              Cadastre-se
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
