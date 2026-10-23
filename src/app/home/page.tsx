import type { Metadata } from "next";

import HomeProvisoria from "@/components/HomeProvisoria";
import RotaProtegida from "@/components/RotaProtegida";

export const metadata: Metadata = {
  title: "Início | Stock.io",
};

export default function Home() {
  return (
    <RotaProtegida>
      <HomeProvisoria />
    </RotaProtegida>
  );
}
