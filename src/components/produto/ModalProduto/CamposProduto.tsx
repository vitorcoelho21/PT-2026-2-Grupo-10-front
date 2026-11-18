import { ChevronDown } from "lucide-react";
import { OpcaoCategoria } from "@/types/produto";
import { ESTILO_CAMPO, mascararPreco, ProdutoForm } from "./produtoForm";

interface CamposProdutoProps {
  form: ProdutoForm;
  categorias: OpcaoCategoria[];
  atualizar: <K extends keyof ProdutoForm>(campo: K, valor: ProdutoForm[K]) => void;
}

// Nome, categoria, descrição e preço
export default function CamposProduto({ form, categorias, atualizar }: CamposProdutoProps) {
  return (
    <>
      <input
        className={ESTILO_CAMPO}
        placeholder="Nome do produto"
        maxLength={255}
        value={form.nome}
        onChange={(e) => atualizar("nome", e.target.value)}
      />

      <div className="relative">
        <select
          className={`${ESTILO_CAMPO} appearance-none pr-12 ${form.categoriaId === "" ? "text-gray-400" : ""}`}
          value={form.categoriaId}
          onChange={(e) => atualizar("categoriaId", Number(e.target.value))}
        >
          <option value="" disabled>
            Categoria
          </option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id} className="text-black">
              {c.caminho}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-black"
          size={22}
        />
      </div>

      <textarea
        className={`${ESTILO_CAMPO} h-20 resize-none rounded-2xl`}
        placeholder="Descrição"
        value={form.descricao}
        onChange={(e) => atualizar("descricao", e.target.value)}
      />

      <input
        className={ESTILO_CAMPO}
        placeholder="R$ 0,00"
        inputMode="numeric"
        value={form.preco}
        onChange={(e) => atualizar("preco", mascararPreco(e.target.value))}
      />
    </>
  );
}
