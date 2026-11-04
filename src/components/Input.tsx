"use client";

import { InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type Props = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string };

export default function Input({ label, error, type, ...props }: Props) {
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
          className={`w-full rounded-full bg-[#F6F3E4] px-5 py-2.5 text-sm text-black placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#6A38F3] ${
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
      {error && <span className="px-5 text-xs text-red-300">{error}</span>}
    </div>
  );
}
