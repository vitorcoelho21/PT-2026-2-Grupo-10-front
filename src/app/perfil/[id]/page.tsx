import type { Metadata } from "next";

import PerfilUsuario from "@/components/perfil/PerfilUsuario";

export const metadata: Metadata = {
  title: "Perfil | Stock.io",
};

export default async function Perfil({ params }: PageProps<"/perfil/[id]">) {
  const { id } = await params;

  return <PerfilUsuario id={Number(id)} />;
}
