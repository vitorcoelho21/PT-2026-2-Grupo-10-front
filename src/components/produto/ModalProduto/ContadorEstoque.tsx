import { ReactNode } from "react";
import { Minus, Plus } from "lucide-react";

interface ContadorEstoqueProps {
  valor: number;
  onMudar: (valor: number) => void;
}

// Botões − e + com a quantidade em estoque no meio (nunca fica negativo)
export default function ContadorEstoque({ valor, onMudar }: ContadorEstoqueProps) {
  return (
    <div className="my-6 flex items-center justify-center gap-14">
      <BotaoContador onClick={() => onMudar(Math.max(0, valor - 1))} label="Diminuir estoque">
        <Minus size={28} />
      </BotaoContador>
      <span className="w-10 text-center text-4xl text-[#6A38F3]">{valor}</span>
      <BotaoContador onClick={() => onMudar(valor + 1)} label="Aumentar estoque">
        <Plus size={28} />
      </BotaoContador>
    </div>
  );
}

function BotaoContador({ onClick, label, children }: { onClick: () => void; label: string; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#6A38F3] text-[#6A38F3] hover:bg-[#6A38F3]/10"
    >
      {children}
    </button>
  );
}
