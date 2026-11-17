"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Camera, User } from "lucide-react";

import CampoModal from "@/components/perfil/CampoModal";
import { Usuario } from "@/types/user";

type Props = {
  usuario: Usuario;
  onAlterarSenha: () => void; // troca para a tela "Alterar senha"
};

// Conteúdo do modal "Editar perfil". A casca (fundo, X) vem do <Modal>.
export default function ModalEditarPerfil({ usuario, onAlterarSenha }: Props) {
  const inputArquivoRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    nome: usuario.nome,
    username: usuario.username,
    email: usuario.email,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Foto escolhida pela pessoa: guardamos o arquivo (para enviar depois) e uma prévia local.
  const [, setArquivoFoto] = useState<File | null>(null);
  const [previaFoto, setPreviaFoto] = useState<string | null>(null);
  const fotoExibida = previaFoto ?? usuario.fotoPerfilUrl;

  // Libera da memória a prévia anterior quando troca de foto e quando o modal fecha.
  useEffect(() => {
    return () => {
      if (previaFoto) URL.revokeObjectURL(previaFoto);
    };
  }, [previaFoto]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
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

    return newErrors;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // TODO(integração): enviar form (e o arquivo da foto, guardado em arquivoFoto) ao back-end
    // e atualizar o usuário exibido na página com o resultado.
  }

  function handleDeletarConta() {
    // TODO(integração): deletar a conta (idealmente pedindo confirmação antes), limpar o token e ir para /home.
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
        <CampoModal name="nome" label="Nome" value={form.nome} onChange={handleChange} error={errors.nome} />
        <CampoModal
          name="username"
          label="Username"
          value={form.username}
          onChange={handleChange}
          error={errors.username}
        />
        <CampoModal
          name="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
      </div>

      <div className="mt-12 flex w-full max-w-[373px] flex-col gap-2.5 md:mt-16">
        <button
          type="button"
          onClick={handleDeletarConta}
          className="rounded-full border border-[#A8062B] py-3 text-base font-medium text-[#A8062B] transition hover:bg-[#A8062B] hover:text-white"
        >
          Deletar conta
        </button>

        <button
          type="button"
          onClick={onAlterarSenha}
          className="rounded-full border border-[#6A38F3] py-3 text-base font-medium text-[#6A38F3] transition hover:bg-[#6A38F3] hover:text-white"
        >
          Alterar senha
        </button>

        <button
          type="submit"
          className="rounded-full bg-[#6A38F3] py-3 text-base font-medium text-white shadow-md transition hover:bg-[#7B4FF5]"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}
