"use client";

import { useEffect, useState } from "react";

import CardLoja from "@/components/loja/CardLoja";
import { getLojas, Loja } from "@/services/lojaService";

export default function SecaoLojas() {
  const [lojas, setLojas] = useState<Loja[]>([]);

  useEffect(() => {
    getLojas()
      .then((dados: Loja[]) => setLojas(Array.isArray(dados) ? dados : []))
      .catch(() => {
        // Se falhar, a secção simplesmente não aparece
      });
  }, []);

  if (lojas.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="mb-6 text-2xl font-bold text-black">Lojas</h2>

      <ul className="-mx-4 flex snap-x gap-10 overflow-x-auto px-4 pb-4">
        {lojas.map((loja) => (
          <li key={loja.id} className="w-40 shrink-0 snap-start md:w-44">
            <CardLoja loja={loja} />
          </li>
        ))}
      </ul>
    </section>
  );
}
