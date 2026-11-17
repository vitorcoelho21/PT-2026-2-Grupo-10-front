import { useEffect, useState } from "react";

// Devolve o valor só depois que ele parar de mudar por `atraso` ms.
// Usado na busca para não disparar uma requisição a cada tecla digitada.
export function useDebounce<T>(valor: T, atraso = 300): T {
  const [valorDebounced, setValorDebounced] = useState(valor);

  useEffect(() => {
    const timer = setTimeout(() => setValorDebounced(valor), atraso);
    return () => clearTimeout(timer);
  }, [valor, atraso]);

  return valorDebounced;
}
