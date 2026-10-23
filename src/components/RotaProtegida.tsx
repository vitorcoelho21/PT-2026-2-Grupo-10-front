"use client";

import { ReactNode, useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

import { getToken } from "@/utils/token";


// se o usuário clicar em "Sair" numa aba, as outras abas também voltam para o login.
function assinar(avisarMudanca: () => void) {
  window.addEventListener("storage", avisarMudanca);
  return () => window.removeEventListener("storage", avisarMudanca);
}

export default function RotaProtegida({ children }: { children: ReactNode }) {
  const router = useRouter();

  const token = useSyncExternalStore<string | null | undefined>(
    assinar,
    getToken, // valor no navegador
    () => undefined, // valor no servidor
  );

  useEffect(() => {
    if (token === null) router.replace("/login");
  }, [token, router]);

  // Enquanto não sabemos (undefined) ou não há token (null), não mostra nada.
  if (!token) return null;

  return <>{children}</>;
}
