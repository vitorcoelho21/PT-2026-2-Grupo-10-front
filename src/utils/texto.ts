// "Eletrônicos" -> "eletronicos", para comparar nomes vindos do back com os do front
export function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
