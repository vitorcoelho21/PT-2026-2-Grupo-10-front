"use client";

import { useState } from "react";

import Modal from "@/components/perfil/Modal";
import ModalAlterarSenha from "@/components/perfil/ModalAlterarSenha";
import ModalEditarPerfil from "@/components/perfil/ModalEditarPerfil";
import { Usuario } from "@/types/user";

type Props = {
  usuario: Usuario;
  onFechar: () => void;
};

// Controla qual das duas telas aparece. "Alterar senha" abre dentro do mesmo modal
// e a seta "<" volta para "Editar perfil" (como no design).
export default function ModaisConta({ usuario, onFechar }: Props) {
  const [tela, setTela] = useState<"perfil" | "senha">("perfil");

  if (tela === "senha") {
    return (
      <Modal titulo="Alterar senha" onFechar={onFechar} onVoltar={() => setTela("perfil")}>
        <ModalAlterarSenha />
      </Modal>
    );
  }

  return (
    <Modal titulo="Editar perfil" onFechar={onFechar}>
      <ModalEditarPerfil usuario={usuario} onAlterarSenha={() => setTela("senha")} />
    </Modal>
  );
}
