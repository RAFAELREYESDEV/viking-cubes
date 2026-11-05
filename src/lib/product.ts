export type BundleId = "pack_1" | "pack_3" | "pack_5";

export type ProductBundle = {
  id: BundleId;
  name: string;
  orderName: string;
  quantity: number; // número de sobres (cada sobre trae 2 gomitas)
  gummies: number;  // total de gomitas
  price: number;
  cryptoPrice: number; // 15% de descuento en USDT
  regularPrice: number;
  savings: string;
  shipping: number;
  shippingLabel: string;
  hasFreeShipping: boolean;
  recommended: boolean;
  badge: string;
  dailyCost: string;
};

export const PRODUCT_BUNDLES: readonly ProductBundle[] = [
  {
    id: "pack_3",
    name: "Pack Pareja (3 Sobres)",
    orderName: "Combo Estrella · 3 Sobres (6 Gomitas) · ENVÍO GRATIS",
    quantity: 3,
    gummies: 6,
    price: 25.00,
    cryptoPrice: 21.25,
    regularPrice: 45.00,
    savings: "Ahorras $20.00 + Envío Gratis",
    shipping: 0,
    shippingLabel: "ENVÍO 100% GRATIS POR TEALCA A TODA VENEZUELA",
    hasFreeShipping: true,
    recommended: true,
    badge: "🔥 MÁS ELEGIDO · 3 SOBRES CON ENVÍO GRATIS",
    dailyCost: "$8.33 por cita"
  },
  {
    id: "pack_1",
    name: "Pack Prueba (1 Sobre)",
    orderName: "Combo Prueba · 1 Sobre (2 Gomitas Vigorizantes)",
    quantity: 1,
    gummies: 2,
    price: 15.00,
    cryptoPrice: 12.75,
    regularPrice: 20.00,
    savings: "Ahorras $5.00",
    shipping: 0,
    shippingLabel: "Envío NO incluido (Flete cobro a destino por Tealca)",
    hasFreeShipping: false,
    recommended: false,
    badge: "PRUEBA INICIAL",
    dailyCost: "$15.00 por cita"
  },
  {
    id: "pack_5",
    name: "Pack Escapada (5 Sobres)",
    orderName: "Pack Escapada VIP · 5 Sobres (10 Gomitas) · ENVÍO GRATIS",
    quantity: 5,
    gummies: 10,
    price: 35.00,
    cryptoPrice: 29.75,
    regularPrice: 75.00,
    savings: "Ahorras $40.00 + Envío VIP Gratis",
    shipping: 0,
    shippingLabel: "ENVÍO VIP 100% GRATIS POR TEALCA A TODA VENEZUELA",
    hasFreeShipping: true,
    recommended: false,
    badge: "MÁXIMO AHORRO",
    dailyCost: "$7.00 por cita"
  }
];

export const DEFAULT_BUNDLE = PRODUCT_BUNDLES[0]; // Pack 3 Sobres ($25)

export function getBundle(id: unknown): ProductBundle | undefined {
  return PRODUCT_BUNDLES.find((bundle) => bundle.id === id);
}

export function money(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function cryptoMoney(value: number): string {
  return `${value.toFixed(2)} USDT`;
}
