export type BundleId = "pack_3_pares" | "pack_1_par" | "pack_frasco_30";

export type ProductBundle = {
  id: BundleId;
  name: string;
  orderName: string;
  unitLabel: string;
  gummies: number;
  price: number;
  cryptoPrice: number;
  regularPrice: number;
  savings: string;
  shipping: number;
  shippingLabel: string;
  hasFreeShipping: boolean;
  recommended: boolean;
  badge: string;
  perDose: string;
};

export const PRODUCT_BUNDLES: readonly ProductBundle[] = [
  {
    id: "pack_3_pares",
    name: "3 Pares (6 Gomitas)",
    orderName: "Combo 3 Pares (6 Gomitas Masticables) · $25 Envío Gratis",
    unitLabel: "3 Sobres de Bolsillo",
    gummies: 6,
    price: 25,
    cryptoPrice: 21,
    regularPrice: 42,
    savings: "¡Por solo $4 más que 1 par te llevas 3!",
    shipping: 0,
    shippingLabel: "ENVÍO GRATIS POR TEALCA",
    hasFreeShipping: true,
    recommended: true,
    badge: "MÁS POPULAR · MEJOR PRECIO",
    perDose: "$8 por cita"
  },
  {
    id: "pack_1_par",
    name: "1 Par (2 Gomitas)",
    orderName: "Pack 1 Par (2 Gomitas Masticables) · $21 Envío Gratis",
    unitLabel: "1 Sobre Individual",
    gummies: 2,
    price: 21,
    cryptoPrice: 18,
    regularPrice: 28,
    savings: "Sobre para 1 cita",
    shipping: 0,
    shippingLabel: "ENVÍO GRATIS POR TEALCA",
    hasFreeShipping: true,
    recommended: false,
    badge: "INDIVIDUAL",
    perDose: "$21 por cita"
  },
  {
    id: "pack_frasco_30",
    name: "Pote de 30 Gomitas",
    orderName: "Pote de 30 Gomitas Masticables · $45 Envío Gratis",
    unitLabel: "1 Frasco Completo",
    gummies: 30,
    price: 45,
    cryptoPrice: 38,
    regularPrice: 70,
    savings: "Tratamiento de 15 a 30 dosis",
    shipping: 0,
    shippingLabel: "ENVÍO GRATIS POR TEALCA",
    hasFreeShipping: true,
    recommended: false,
    badge: "MÁXIMA DURACIÓN",
    perDose: "$1.50 por dosis"
  }
];

export const DEFAULT_BUNDLE = PRODUCT_BUNDLES[0]; // 3 Pares x $25

export function getBundle(id: unknown): ProductBundle | undefined {
  return PRODUCT_BUNDLES.find((bundle) => bundle.id === id);
}

export function money(value: number): string {
  return `$${Math.round(value)}`;
}
