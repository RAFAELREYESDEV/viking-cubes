import VikingLanding from "@/components/VikingLanding";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gummies Viking Borojó & Chontaduro | Gomitas Vigorizantes Pareja Venezuela",
  description: "Enciende la química y vitalidad en pareja con Gummies Viking. Extractos naturales de Borojó y Chontaduro. Pago contra entrega en toda Venezuela por Tealca.",
};

export default function HomePage() {
  return <VikingLanding />;
}
