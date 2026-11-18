"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ChevronDown, FileUp } from "lucide-react";

import CampoModal from "@/components/perfil/CampoModal";
import Modal from "@/components/perfil/Modal";
import { Categoria, getCategorias } from "@/services/categoriaService";
import { createLoja, deleteLoja, Loja, updateLoja } from "@/services/lojaService";
import { extrairMensagemErro } from "@/utils/erros";

type CampoImagem = "logoUrl" | "stickerUrl" | "bannerUrl";

const AREAS_IMAGEM: { campo: CampoImagem; texto: string; rotulo: string }[] = [
  { campo: "logoUrl", texto: "Anexe a foto de perfil de sua loja", rotulo: "URL da foto de perfil" },
  { campo: "stickerUrl", texto: "Anexe a logo em SVG de sua loja", rotulo: "URL da logo em SVG" },
  { campo: "bannerUrl", texto: "Anexe o banner de sua loja", rotulo: "URL do banner" },
];

type Props = {
  loja?: Loja;
  onSalva: (loja: Loja) => void;
  onDeletada?: () => void;
  onFechar: () => void;
};

function AreaImagem({
  texto,
  rotulo,
  valor,
  erro,
  disabled,
  onChange,
}: {
  texto: string;
  rotulo: string;
  valor: string;
  erro?: string;
  disabled: boolean;
  onChange: (valor: string) => void;
}) {
  const [erroPrevia, setErroPrevia] = useState(false);
  const url = valor.trim();

  return (
    <div className="flex flex-col gap-1">
      <div
        className={`flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-4 py-4 ${
          erro ? "border-red-400" : "border-[#6A38F3]/60"
        }`}
      >
        {url && !erroPrevia ? (
          <img
            src={url}
            alt=""
            onError={() => setErroPrevia(true)}
            className="h-12 max-w-full rounded-lg object-contain"
          />
        ) : (
          <FileUp className="h-8 w-8 text-[#6A38F3]" fill="currentColor" stroke="white" />
        )}
        <p className="text-center text-xs text-black">{texto}</p>
        <input
          type="url"
          value={valor}
          onChange={(e) => {
            setErroPrevia(false);
            onChange(e.target.value);
          }}
          placeholder="Cole aqui o link da imagem"
          aria-label={rotulo}
          aria-invalid={erro ? true : undefined}
          disabled={disabled}
          className="w-full rounded-xl bg-white px-3 py-2 text-sm text-black outline-none placeholder:text-[#999797] focus:ring-2 focus:ring-[#6A38F3]"
        />
      </div>
      {erro && <span className="px-2 text-xs text-red-600">{erro}</span>}
    </div>
  );
}

export default function ModalLoja({ loja, onSalva, onDeletada, onFechar }: Props) {
  const editando = Boolean(loja);
  const [form, setForm] = useState({
    nome: loja?.nome ?? "",
    logoUrl: loja?.logoUrl ?? "",
    stickerUrl: loja?.stickerUrl ?? "",
    bannerUrl: loja?.bannerUrl ?? "",
  });
  const [categoriaId, setCategoriaId] = useState(loja?.categoriaPrincipal ? String(loja.categoriaPrincipal.id) : "");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategorias()
      .then((dados) => setCategorias([...dados].sort((a, b) => a.nome.localeCompare(b.nome))))
      .catch(() => {});
  }, []);

  function validate() {
    const novos: Record<string, string> = {};
    if (!form.nome.trim()) novos.nome = "Informe o nome da loja.";
    else if (form.nome.trim().length > 255) novos.nome = "O nome deve ter no máximo 255 caracteres.";
    for (const { campo } of AREAS_IMAGEM) {
      if (form[campo].trim().length > 255) novos[campo] = "O link deve ter no máximo 255 caracteres.";
    }
    return novos;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const novos = validate();
    setErrors(novos);
    if (Object.keys(novos).length > 0) return;

    const vazio = editando ? null : undefined;
    const dados = {
      nome: form.nome.trim(),
      logoUrl: form.logoUrl.trim() || vazio,
      stickerUrl: form.stickerUrl.trim() || vazio,
      bannerUrl: form.bannerUrl.trim() || vazio,
    };

    setLoading(true);
    try {
      const resposta = loja ? await updateLoja(loja.id, dados) : await createLoja(dados);
      onSalva({ ...resposta.data, categoriaPrincipal: loja?.categoriaPrincipal ?? null });
    } catch (err) {
      setErrors({ geral: extrairMensagemErro(err, "Não foi possível salvar a loja.") });
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletar() {
    if (!loja) return;
    const confirmou = window.confirm(`Tem certeza que deseja deletar a loja "${loja.nome}"? Esta ação é irreversível.`);
    if (!confirmou) return;

    setLoading(true);
    try {
      await deleteLoja(loja.id);
      onDeletada?.();
    } catch (err) {
      setErrors({ geral: extrairMensagemErro(err, "Não foi possível deletar a loja.") });
      setLoading(false);
    }
  }

  return (
    <Modal titulo={editando ? "Editar loja" : "Adicionar loja"} onFechar={onFechar}>
      <form onSubmit={handleSubmit} noValidate className="mx-auto flex w-full max-w-[460px] flex-col">
        <h2 className="mb-6 text-center text-3xl font-medium text-black">{editando ? "Editar loja" : "Adicionar loja"}</h2>

        <div className="flex flex-col gap-3">
          <CampoModal
            name="nome"
            label="Nome da loja"
            value={form.nome}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setForm({ ...form, nome: e.target.value });
              setErrors({ ...errors, nome: "" });
            }}
            error={errors.nome}
            disabled={loading}
          />

          <div className="relative">
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              aria-label="Categoria"
              disabled={loading}
              className={`w-full appearance-none rounded-2xl bg-white px-4 py-3.5 pr-12 text-base outline-none focus:ring-2 focus:ring-[#6A38F3] ${
                categoriaId ? "text-black" : "text-[#999797]"
              }`}
            >
              <option value="">Categoria</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          </div>

          {AREAS_IMAGEM.map(({ campo, texto, rotulo }) => (
            <AreaImagem
              key={campo}
              texto={texto}
              rotulo={rotulo}
              valor={form[campo]}
              erro={errors[campo]}
              disabled={loading}
              onChange={(valor) => {
                setForm({ ...form, [campo]: valor });
                setErrors({ ...errors, [campo]: "" });
              }}
            />
          ))}
        </div>

        {errors.geral && (
          <p className="mt-4 text-center text-xs text-red-600" role="alert">
            {errors.geral}
          </p>
        )}

        <div className="mx-auto mt-8 flex w-full max-w-[373px] flex-col gap-2.5">
          {editando && (
            <button
              type="button"
              onClick={handleDeletar}
              disabled={loading}
              className="rounded-full bg-[#FF0000] py-3 text-base font-medium uppercase text-white shadow-md transition hover:bg-[#D90000] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Deletar
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#6A38F3] py-3 text-base font-medium text-white shadow-md transition hover:bg-[#7B4FF5] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Salvando..." : editando ? "Salvar" : "Adicionar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
