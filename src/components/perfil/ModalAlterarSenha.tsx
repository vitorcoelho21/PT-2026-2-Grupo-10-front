"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import CampoModal from "@/components/perfil/CampoModal";
import { changePassword } from "@/services/userService";
import { extrairMensagemErro } from "@/utils/erros";
import { clearToken } from "@/utils/token";

type Props = {
  usuarioId: number;
  onSucesso?: () => void;
};

// Ícone de chave do design (desenhado em SVG para não depender de imagem externa).
function IconeChave() {
  return (
    <svg viewBox="0 0 150 150" className="h-28 w-28 md:h-[150px] md:w-[150px]" aria-hidden="true">
      <circle cx="113" cy="38" r="38" fill="#AD93F0" />
      <circle cx="124" cy="28" r="7" fill="#EDEDED" />
      <g stroke="#6A38F3" strokeWidth="14" strokeLinecap="round" fill="none">
        <line x1="92" y1="62" x2="12" y2="142" />
        <line x1="50" y1="104" x2="24" y2="90" />
        <line x1="30" y1="124" x2="10" y2="118" />
      </g>
    </svg>
  );
}

// Conteúdo do modal "Alterar senha". A casca (fundo, X, seta de voltar) vem do <Modal>.
export default function ModalAlterarSenha({ usuarioId, onSucesso }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({ senhaAntiga: "", novaSenha: "", confirmarSenha: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name] || errors.geral) {
      setErrors((atuais) => {
        const novos = { ...atuais };
        delete novos[e.target.name];
        delete novos.geral;
        return novos;
      });
    }
  }

  function validate() {
    const newErrors: Record<string, string> = {};

    if (!form.senhaAntiga) newErrors.senhaAntiga = "Informe sua senha atual.";

    // O mínimo de 8 caracteres é o mesmo usado no cadastro e na redefinição de senha.
    if (!form.novaSenha) {
      newErrors.novaSenha = "Crie uma nova senha.";
    } else if (form.novaSenha.length < 8) {
      newErrors.novaSenha = "A senha deve ter no mínimo 8 caracteres.";
    } else if (form.novaSenha === form.senhaAntiga) {
      newErrors.novaSenha = "A nova senha deve ser diferente da atual.";
    }

    if (!form.confirmarSenha) {
      newErrors.confirmarSenha = "Confirme sua nova senha.";
    } else if (form.novaSenha !== form.confirmarSenha) {
      newErrors.confirmarSenha = "As senhas não coincidem.";
    }

    return newErrors;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setMensagemSucesso("");

    try {
      await changePassword(usuarioId, form.senhaAntiga, form.novaSenha);
      setMensagemSucesso("Senha alterada com sucesso! Redirecionando para o login...");
      setForm({ senhaAntiga: "", novaSenha: "", confirmarSenha: "" });

      // O backend incrementa a versão da senha e invalida a sessão anterior.
      setTimeout(() => {
        clearToken();
        onSucesso?.();
        router.push("/login");
      }, 1500);
    } catch (err: unknown) {
      const msg = extrairMensagemErro(err, "Não foi possível alterar a senha.");
      if (msg.toLowerCase().includes("senha atual incorreta")) {
        setErrors({ senhaAntiga: "Senha atual incorreta." });
      } else {
        setErrors({ geral: msg });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto flex w-full max-w-[385px] flex-col items-center">
      <h2 className="sr-only">Alterar senha</h2>

      <IconeChave />

      <div className="mt-8 flex w-full flex-col gap-4">
        <CampoModal
          name="senhaAntiga"
          label="Senha Antiga"
          type="password"
          autoComplete="current-password"
          value={form.senhaAntiga}
          onChange={handleChange}
          error={errors.senhaAntiga}
          disabled={loading || Boolean(mensagemSucesso)}
        />
        <CampoModal
          name="novaSenha"
          label="Nova Senha"
          type="password"
          autoComplete="new-password"
          value={form.novaSenha}
          onChange={handleChange}
          error={errors.novaSenha}
          disabled={loading || Boolean(mensagemSucesso)}
        />
        <CampoModal
          name="confirmarSenha"
          label="Confirmar Senha"
          type="password"
          autoComplete="new-password"
          value={form.confirmarSenha}
          onChange={handleChange}
          error={errors.confirmarSenha}
          disabled={loading || Boolean(mensagemSucesso)}
        />
      </div>

      {errors.geral && (
        <p className="mt-4 text-center text-xs text-red-600" role="alert">
          {errors.geral}
        </p>
      )}

      {mensagemSucesso && (
        <p className="mt-4 text-center text-xs font-medium text-green-600" role="status">
          {mensagemSucesso}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || Boolean(mensagemSucesso)}
        className="mt-16 w-full max-w-[373px] rounded-full bg-[#6A38F3] py-3 text-base font-medium text-white shadow-md transition hover:bg-[#7B4FF5] disabled:cursor-not-allowed disabled:opacity-60 md:mt-24"
      >
        {loading ? "Salvando..." : "Salvar Senha"}
      </button>
    </form>
  );
}
