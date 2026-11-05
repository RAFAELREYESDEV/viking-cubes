export type BundleId = "pack_sobres" | "pack_frasco_regalo" | "pack_doble_frasco";

export type ProductBundle = {
  id: BundleId;
  name: string;
  orderName: string;
  bottles: number;
  sachets: number;
  totalGummies: number;
  price: number;
  cryptoPrice: number;
  regularPrice: number;
  savings: string;
  shipping: number;
  shippingLabel: string;
  hasFreeShipping: boolean;
  recommended: boolean;
  badge: string;
  giftTag: string;
  dailyCost: string;
};

export const PRODUCT_BUNDLES: readonly ProductBundle[] = [
  {
    id: "pack_frasco_regalo",
    name: "1 Frasco (30 Gomitas) + 1 Sachet de Regalo",
    orderName: "Combo Estrella: 1 Frasco (30 Gummies) + 1 Sachet Obsequio · ENVÍO GRATIS",
    bottles: 1,
    sachets: 1,
    totalGummies: 32,
    price: 34.99,
    cryptoPrice: 29.75,
    regularPrice: 55.00,
    savings: "Ahorras $20.01 + Sachet de Regalo + Envío Gratis",
    shipping: 0,
    shippingLabel: "ENVÍO 100% GRATIS POR TEALCA A TODA VENEZUELA",
    hasFreeShipping: true,
    recommended: true,
    badge: "🔥 COMBO MÁS VENDIDO · INCLUYE SACHET DE REGALO",
    giftTag: "🎁 1 Sachet de Bolsillo (2 Gomitas) de REGALO",
    dailyCost: "$1.09 por día de tratamiento"
  },
  {
    id: "pack_sobres",
    name: "Pack Pareja: 3 Sobres (6 Gomitas)",
    orderName: "Pack Pareja: 3 Sobres Sachets (6 Gomitas Masticables) · ENVÍO GRATIS",
    bottles: 0,
    sachets: 3,
    totalGummies: 6,
    price: 25.00,
    cryptoPrice: 21.25,
    regularPrice: 40.00,
    savings: "Ahorras $15.00 + Envío Gratis",
    shipping: 0,
    shippingLabel: "ENVÍO 100% GRATIS POR TEALCA A TODA VENEZUELA",
    hasFreeShipping: true,
    recommended: false,
    badge: "IDEAL PARA PROBAR EN PAREJA",
    giftTag: "3 Sobres de Bolsillo (3 Citas)",
    dailyCost: "$8.33 por cita"
  },
  {
    id: "pack_doble_frasco",
    name: "2 Frascos (60 Gomitas) + 2 Sachets de Regalo",
    orderName: "Pack Dúo VIP: 2 Frascos (60 Gummies) + 2 Sachets Obsequio · ENVÍO GRATIS",
    bottles: 2,
    sachets: 2,
    totalGummies: 64,
    price: 49.99,
    cryptoPrice: 42.50,
    regularPrice: 85.00,
    savings: "Ahorras $35.01 + 2 Sachets de Regalo + Envío VIP Gratis",
    shipping: 0,
    shippingLabel: "ENVÍO VIP 100% GRATIS POR TEALCA A TODA VENEZUELA",
    hasFreeShipping: true,
    recommended: false,
    badge: "MÁXIMO AHORRO FAMILIAR / PAREJA",
    giftTag: "🎁 2 Sachets de Bolsillo (4 Gomitas) de REGALO",
    dailyCost: "$0.78 por día de tratamiento"
  }
];

export const DEFAULT_BUNDLE = PRODUCT_BUNDLES[0]; // Frasco + Sachet de regalo

export function getBundle(id: unknown): ProductBundle | undefined {
  return PRODUCT_BUNDLES.find((bundle) => bundle.id === id);
}

export function money(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function cryptoMoney(value: number): string {
  return `${value.toFixed(2)} USDT`;
}
