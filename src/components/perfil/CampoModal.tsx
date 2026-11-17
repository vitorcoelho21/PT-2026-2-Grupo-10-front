"use client";

import { InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type Props = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string };

// Campo de texto no estilo dos modais (fundo branco sobre o cartão cinza).
// O "Input" que já existe no projeto é feito para fundo escuro (fundo bege, erro em vermelho claro),
// por isso este é separado. Como no design, o nome do campo aparece como placeholder.
export default function CampoModal({ label, error, type, ...props }: Props) {
  const [visivel, setVisivel] = useState(false);
  const isSenha = type === "password";

  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        <input
          {...props}
          type={isSenha && visivel ? "text" : type}
          placeholder={label}
          aria-label={label}
          aria-invalid={error ? true : undefined}
          className={`w-full rounded-2xl bg-white px-4 py-3.5 text-base text-black outline-none placeholder:text-[#999797] focus:ring-2 focus:ring-[#6A38F3] ${
            isSenha ? "pr-12" : ""
          } ${error ? "ring-2 ring-red-400" : ""}`}
        />
        {isSenha && (
          <button
            type="button"
            onClick={() => setVisivel(!visivel)}
            aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#6A38F3]"
          >
            {visivel ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <span className="px-2 text-xs text-red-600">{error}</span>}
    </div>
  );
}
