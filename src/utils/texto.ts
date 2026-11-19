// "Eletrônicos" -> "eletronicos", para comparar nomes vindos do back com os do front
export function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

export function formatarTempoRelativo(dataISO: string): string {
  const agora = new Date();
  const data = new Date(dataISO);
  const diffSegundos = Math.floor((agora.getTime() - data.getTime()) / 1000);

  if (isNaN(diffSegundos) || diffSegundos < 60) return "agora";
  const diffMinutos = Math.floor(diffSegundos / 60);
  if (diffMinutos < 60) return `${diffMinutos}m`;
  const diffHoras = Math.floor(diffMinutos / 60);
  if (diffHoras < 24) return `${diffHoras}h`;
  const diffDias = Math.floor(diffHoras / 24);
  if (diffDias < 7) return `${diffDias}d`;
  const diffSemanas = Math.floor(diffDias / 7);
  if (diffSemanas < 4) return `${diffSemanas}sem`;
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

