"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, User } from "lucide-react";

import CampoModal from "@/components/perfil/CampoModal";
import { deleteUser, updateUser } from "@/services/userService";
import { updateFormato, Usuario } from "@/types/user";
import { extrairMensagemErro } from "@/utils/erros";
import { clearToken } from "@/utils/token";

type Props = {
  usuario: Usuario;
  onAlterarSenha: () => void; // troca para a tela "Alterar senha"
  onAtualizado?: (usuarioAtualizado: Usuario) => void;
  onFechar?: () => void;
};

// Conteúdo do modal "Editar perfil". A casca (fundo, X) vem do <Modal>.
export default function ModalEditarPerfil({ usuario, onAlterarSenha, onAtualizado, onFechar }: Props) {
  const router = useRouter();
  const inputArquivoRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    nome: usuario.nome,
    username: usuario.username,
    email: usuario.email,
    fotoPerfilUrl: usuario.fotoPerfilUrl ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  // Foto escolhida pela pessoa: guardamos o arquivo (para prévia) ou usamos a URL informada.
  const [, setArquivoFoto] = useState<File | null>(null);
  const [previaFoto, setPreviaFoto] = useState<string | null>(null);
  const fotoExibida = previaFoto ?? (form.fotoPerfilUrl.trim() || usuario.fotoPerfilUrl);

  // Libera da memória a prévia anterior quando troca de foto e quando o modal fecha.
  useEffect(() => {
    return () => {
      if (previaFoto) URL.revokeObjectURL(previaFoto);
    };
  }, [previaFoto]);

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

  function handleEscolherFoto(e: ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
      setErrors((atuais) => ({ ...atuais, foto: "Escolha um arquivo de imagem." }));
      return;
    }

    setErrors((atuais) => ({ ...atuais, foto: "" }));
    setArquivoFoto(arquivo);
    setPreviaFoto(URL.createObjectURL(arquivo));
  }

  function validate() {
    const newErrors: Record<string, string> = {};

    if (!form.nome.trim()) newErrors.nome = "Informe seu nome completo.";
    if (!form.username.trim()) newErrors.username = "Informe um nome de usuário.";

    if (!form.email.trim()) {
      newErrors.email = "Informe seu email.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Email inválido. Use o formato correto (ex: nome@email.com).";
    }

    if (form.fotoPerfilUrl && form.fotoPerfilUrl.trim().length > 255) {
      newErrors.fotoPerfilUrl = "A URL da foto deve ter no máximo 255 caracteres.";
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
      const payload: updateFormato = {
        nome: form.nome.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        fotoPerfilUrl: form.fotoPerfilUrl.trim() || undefined,
      };

      const usuarioAtualizado = await updateUser(usuario.id, payload);
      setMensagemSucesso("Perfil atualizado com sucesso!");

      onAtualizado?.(usuarioAtualizado);

      setTimeout(() => {
        onFechar?.();
      }, 1000);
    } catch (err: unknown) {
      const msg = extrairMensagemErro(err, "Não foi possível atualizar o perfil.");
      if (msg.toLowerCase().includes("username")) {
        setErrors((atuais) => ({ ...atuais, username: msg }));
      } else if (msg.toLowerCase().includes("email")) {
        setErrors((atuais) => ({ ...atuais, email: msg }));
      } else {
        setErrors((atuais) => ({ ...atuais, geral: msg }));
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletarConta() {
    const confirmou = window.confirm(
      "Tem certeza que deseja deletar sua conta? Esta ação é irreversível.",
    );
    if (!confirmou) return;

    setLoading(true);
    try {
      await deleteUser(usuario.id);
      clearToken();
      router.push("/login");
    } catch (err: unknown) {
      const msg = extrairMensagemErro(err, "Não foi possível deletar a conta.");
      setErrors((atuais) => ({ ...atuais, geral: msg }));
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto flex w-full max-w-[385px] flex-col items-center">
      <h2 className="sr-only">Editar perfil</h2>

      <div className="relative h-32 w-32 md:h-[150px] md:w-[150px]">
        <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
          {fotoExibida ? (
            <img src={fotoExibida} alt={usuario.nome} className="h-full w-full object-cover" />
          ) : (
            <User className="h-16 w-16 text-gray-300 md:h-20 md:w-20" />
          )}
        </div>

        <button
          type="button"
          onClick={() => inputArquivoRef.current?.click()}
          title="Trocar foto"
          aria-label="Trocar foto de perfil"
          className="absolute -bottom-6 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-white text-black transition hover:text-[#6A38F3] md:h-[60px] md:w-[60px]"
        >
          <Camera className="h-6 w-6 md:h-8 md:w-8" fill="currentColor" stroke="white" />
        </button>

        <input
          ref={inputArquivoRef}
          type="file"
          accept="image/*"
          onChange={handleEscolherFoto}
          className="hidden"
        />
      </div>

      <p className="mt-8 h-4 text-xs text-red-600" role="alert">
        {errors.foto}
      </p>

      <div className="mt-4 flex w-full flex-col gap-4">
        <CampoModal
          name="nome"
          label="Nome"
          value={form.nome}
          onChange={handleChange}
          error={errors.nome}
          disabled={loading || Boolean(mensagemSucesso)}
        />
        <CampoModal
          name="username"
          label="Username"
          value={form.username}
          onChange={handleChange}
          error={errors.username}
          disabled={loading || Boolean(mensagemSucesso)}
        />
        <CampoModal
          name="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          disabled={loading || Boolean(mensagemSucesso)}
        />
        <CampoModal
          name="fotoPerfilUrl"
          label="URL da Foto de Perfil"
          value={form.fotoPerfilUrl}
          onChange={handleChange}
          error={errors.fotoPerfilUrl}
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

      <div className="mt-12 flex w-full max-w-[373px] flex-col gap-2.5 md:mt-16">
        <button
          type="button"
          onClick={handleDeletarConta}
          disabled={loading || Boolean(mensagemSucesso)}
          className="rounded-full border border-[#A8062B] py-3 text-base font-medium text-[#A8062B] transition hover:bg-[#A8062B] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Deletar conta
        </button>

        <button
          type="button"
          onClick={onAlterarSenha}
          disabled={loading || Boolean(mensagemSucesso)}
          className="rounded-full border border-[#6A38F3] py-3 text-base font-medium text-[#6A38F3] transition hover:bg-[#6A38F3] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Alterar senha
        </button>

        <button
          type="submit"
          disabled={loading || Boolean(mensagemSucesso)}
          className="rounded-full bg-[#6A38F3] py-3 text-base font-medium text-white shadow-md transition hover:bg-[#7B4FF5] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
