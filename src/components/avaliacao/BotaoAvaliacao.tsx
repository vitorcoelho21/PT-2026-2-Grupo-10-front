type BotaoAvaliacaoProps = {
  onClick: () => void;
  jaAvaliou?: boolean;
  className?: string;
};

export default function BotaoAvaliacao({ onClick, jaAvaliou, className = "" }: BotaoAvaliacaoProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mx-auto flex w-full max-w-4xl items-center justify-center rounded-full bg-[#6A38F3] py-3.5 px-6 text-base font-medium text-white shadow-[0_6.8px_6.8px_rgba(0,0,0,0.25)] transition hover:bg-[#592be3] active:scale-[0.99] md:text-lg ${className}`}
    >
      {jaAvaliou ? "Editar Review" : "Adicionar Review"}
    </button>
  );
}
