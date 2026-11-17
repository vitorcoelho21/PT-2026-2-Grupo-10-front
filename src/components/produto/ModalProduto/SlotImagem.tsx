import { Camera, Plus } from "lucide-react";

interface SlotImagemProps {
  url: string;
  ativo: boolean;
  onClick: () => void;
  className?: string;
  legenda?: string;
}

// Um espaço de foto: mostra a foto se tiver link, ou o ícone de câmera se estiver vazio
export default function SlotImagem({ url, ativo, onClick, className = "", legenda }: SlotImagemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed border-[#6A38F3] hover:bg-white/50 ${ativo ? "bg-white/60" : ""} ${className}`}
    >
      {url ? (
        <img src={url} alt="Foto do produto" className="h-full w-full object-cover" />
      ) : (
        <>
          <span className="relative text-[#6A38F3]">
            <Camera size={34} fill="currentColor" stroke="#EDEDED" />
            <span className="absolute -bottom-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-white">
              <Plus size={12} />
            </span>
          </span>
          {legenda && <span className="text-xs text-black">{legenda}</span>}
        </>
      )}
    </button>
  );
}
