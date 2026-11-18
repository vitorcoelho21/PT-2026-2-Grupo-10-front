"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  valor: string;
  onChange: (valor: string) => void;
}

export default function SearchBar({ valor, onChange }: SearchBarProps) {
  return (
    <div className="relative z-10 mx-auto -mt-6 max-w-3xl px-4">
      <div className="pointer-events-auto flex items-center rounded-full bg-white px-4 py-3 shadow-lg">
        <input
          type="search"
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Procurar por..."
          aria-label="Procurar produtos"
          className="flex-1 bg-transparent px-2 text-gray-700 outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {valor ? (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Limpar busca"
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        ) : (
          <Search className="h-5 w-5 text-gray-400" />
        )}
      </div>
    </div>
  );
}
