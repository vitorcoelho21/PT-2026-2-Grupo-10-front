import type { Metadata } from "next";

import PerfilUsuario from "@/components/perfil/PerfilUsuario";
import RotaProtegida from "@/components/RotaProtegida";

export const metadata: Metadata = {
  title: "Meu perfil | Stock.io",
};

export default function MeuPerfil() {
  return (
    <RotaProtegida>
      <PerfilUsuario />
    </RotaProtegida>
  );
}
