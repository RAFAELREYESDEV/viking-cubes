"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { PRODUCT_BUNDLES, DEFAULT_BUNDLE, ProductBundle } from "@/lib/product";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_STORE_WHATSAPP || "584121183463";

const GALLERY_IMAGES = [
  {
    src: "/viking/viking_pouch_front.jpg",
    alt: "Gummies Viking Sobre Individual",
    badge: "SOBRE INDIVIDUAL"
  },
  {
    src: "/viking/viking_bottle_splash.jpg",
    alt: "Gummies Viking Pote 30 Gomitas",
    badge: "POTE 30 GOMITAS"
  },
  {
    src: "/viking/viking_pouch_with_gummies.jpg",
    alt: "Gomitas en forma de león",
    badge: "DÚO DE PAREJA"
  },
  {
    src: "/viking/viking_bottle_benefits.jpg",
    alt: "Beneficios de Vigor",
    badge: "FÓRMULA ACTIVA"
  },
  {
    src: "/viking/viking_pouch_real_table.jpg",
    alt: "Gummies Viking Empaque Discreto",
    badge: "FOTO REAL"
  }
];

const VENEZUELA_STATES = [
  "Caracas (Distrito Capital)",
  "Miranda (Altos Mirandinos / Guarenas / Guatire)",
  "Zulia (Maracaibo / Cabimas / San Francisco)",
  "Carabobo (Valencia / Naguanagua / San Diego)",
  "Aragua (Maracay / Turmero / Cagua)",
  "Lara (Barquisimeto / Cabudare)",
  "Anzoátegui (Barcelona / Puerto La Cruz / Lechería)",
  "Bolívar (Puerto Ordaz / Ciudad Bolívar)",
  "Nueva Esparta (Margarita / Porlamar)",
  "Táchira (San Cristóbal)",
  "Mérida (Mérida)",
  "Falcón (Coro / Punto Fijo)",
  "Monagas (Maturín)",
  "Sucre (Cumaná)",
  "Barinas (Barinas)",
  "Portuguesa (Acarigua / Guanare)",
  "Trujillo (Valera)",
  "Yaracuy (San Felipe)",
  "Guárico (San Juan / Calabozo)",
  "La Guaira (Catia La Mar / Maiquetía)",
  "Otro Estado de Venezuela"
];

const TESTIMONIALS = [
  {
    quote: "La rutina del trabajo nos dejaba agotados a los dos. Pedimos el combo de 3 pares para probar y el cambio en energía fue brutal, cero dolor de cabeza ni taquicardia.",
    author: "Valeria & Daniel",
    city: "Caracas",
    rating: 5,
    pack: "Combo 3 Pares ($25)"
  },
  {
    quote: "El paquete llegó sellado por Tealca al día siguiente a Valencia. Pagué en efectivo al recibirlo, super seguro y con total discreción.",
    author: "Marcos G.",
    city: "Valencia, Carabobo",
    rating: 5,
    pack: "Pote de 30 ($45)"
  },
  {
    quote: "Ella tomó la iniciativa y las pidió para una escapada de fin de semana. El sabor a frutos rojos es riquísimo y de verdad te da vitalidad toda la noche.",
    author: "Roberto & Andrea",
    city: "Lechería, Anzoátegui",
    rating: 5,
    pack: "Combo 3 Pares ($25)"
  }
];

export default function VikingLanding() {
  const [selectedPack, setSelectedPack] = useState<ProductBundle>(DEFAULT_BUNDLE);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Formulario COD integrado en la página
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    state: "Caracas (Distrito Capital)",
    cityAddress: "",
    paymentMethod: "efectivo_divisas",
    notes: ""
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);
  const ctaHeroRef = useRef<HTMLDivElement>(null);

  // Scroll suave al formulario
  const scrollToForm = (pack?: ProductBundle) => {
    if (pack) setSelectedPack(pack);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Sticky bar cuando se scrollea pasando el botón del hero
  useEffect(() => {
    const handleScroll = () => {
      if (!ctaHeroRef.current) return;
      const rect = ctaHeroRef.current.getBoundingClientRect();
      setShowStickyBar(rect.bottom < 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Pixel ViewContent al cargar
  useEffect(() => {
    if (typeof window !== "undefined" && (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
      (window as unknown as { fbq: (...args: unknown[]) => void }).fbq("track", "ViewContent", {
        content_name: "Gummies Viking Borojó y Chontaduro",
        content_category: "Vitalidad en Pareja",
        value: 25,
        currency: "USD"
      });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.cityAddress.trim()) {
      setFormError("Por favor completa tu nombre, teléfono y dirección o agencia Tealca.");
      return;
    }
    setFormError("");
    setIsSubmitting(true);

    const eventId = `ord-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    // Disparar evento Purchase en el Píxel de Meta
    if (typeof window !== "undefined" && (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
      (window as unknown as { fbq: (...args: unknown[]) => void }).fbq(
        "track",
        "Purchase",
        {
          content_name: selectedPack.name,
          content_ids: [selectedPack.id],
          value: selectedPack.price,
          currency: "USD"
        },
        { eventID: eventId }
      );
    }

    const cleanState = formData.state.split("(")[0].trim();
    const messageLines = [
      "👑 *PEDIDO GUMMIES VIKING - PAGO EN LA ENTREGA*",
      "------------------------------------",
      `*PROMO SELECCIONADA:* ${selectedPack.orderName}`,
      `*TOTAL A PAGAR:* $${selectedPack.price} USD`,
      `*ENVÍO:* 100% GRATIS POR TEALCA`,
      "",
      "*DATOS DE ENVÍO:*",
      `• Nombre: ${formData.fullName.trim()}`,
      `• Teléfono: ${formData.phone.trim()}`,
      `• Estado: ${cleanState}`,
      `• Dirección / Agencia Tealca: ${formData.cityAddress.trim()}`,
      `• Pago al recibir: ${
        formData.paymentMethod === "efectivo_divisas"
          ? "Efectivo Divisas ($) al recibir"
          : "Pago Móvil (tasa oficial) al recibir"
      }`,
      ...(formData.notes.trim() ? [`• Nota: ${formData.notes.trim()}`] : []),
      "",
      "------------------------------------",
      "🤝 *PAGO EN LA ENTREGA:* Solo pago cuando el paquete llegue a mis manos por Tealca.",
      "",
      "¡Hola! Acabo de hacer mi pedido en la página. ¿Me confirman para coordinar el envío por Tealca?"
    ];

    const message = messageLines.join("\n");
    const cleanPhone = WHATSAPP_NUMBER.replace(/\D/g, "");
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    setTimeout(() => {
      window.location.href = waUrl;
      setIsSubmitting(false);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#221e1a] font-sans antialiased selection:bg-rose-500 selection:text-white pb-28 md:pb-16">
      {/* Top Banner de Confianza COD */}
      <aside aria-label="Aviso de Envío" className="bg-[#1f1b18] text-[#f5ebd9] text-xs font-semibold py-2.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>🇻🇪 <strong>PAGO EN LA ENTREGA</strong> EN TODA VENEZUELA · <strong>ENVÍO 100% GRATIS POR TEALCA</strong></span>
      </aside>

      {/* Header Limpio */}
      <header className="border-b border-[#e8e1d5] bg-white/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
              GV
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-sm text-[#1f1b18] block leading-tight">GUMMIES VIKING</span>
              <span className="text-[10px] text-[#857b70] tracking-wider uppercase block">Borojó & Chontaduro · Venezuela</span>
            </div>
          </div>
          <button
            onClick={() => scrollToForm()}
            className="text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-full transition-colors"
          >
            Pedir Ahora 🚚
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pt-4 md:pt-8">
        
        {/* HERO SECTION */}
        <section className="bg-white rounded-3xl border border-[#e8e1d5] p-4 md:p-8 shadow-xs mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
            
            {/* Galería Visual Limpia */}
            <div>
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#f3ede4] border border-[#e8e1d5] shadow-inner">
                <Image
                  src={GALLERY_IMAGES[currentSlide].src}
                  alt={GALLERY_IMAGES[currentSlide].alt}
                  fill
                  priority
                  className="object-cover transition-all duration-300"
                  sizes="(max-width: 768px) 100vw, 420px"
                />
                <span className="absolute top-3 left-3 bg-[#1f1b18]/85 text-white text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-md backdrop-blur-xs">
                  {GALLERY_IMAGES[currentSlide].badge}
                </span>
              </div>

              {/* Miniaturas de selección rápida */}
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {GALLERY_IMAGES.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      currentSlide === index ? "border-rose-600 ring-2 ring-rose-200 scale-95" : "border-[#e8e1d5] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img.src} alt="" fill className="object-cover" sizes="56px" />
                  </button>
                ))}
              </div>
            </div>

            {/* Información Principal y Gancho */}
            <div>
              <div className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
                <span>⭐⭐⭐⭐⭐</span>
                <span>4.9 / 5 (1,200+ clientes felices)</span>
              </div>

              <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-[#1f1b18] leading-tight mb-2">
                Gummies Viking Borojó & Chontaduro
              </h1>

              <p className="text-sm md:text-base text-[#5c5349] leading-relaxed mb-4">
                Deliciosas gomitas masticables formuladas con extracto puro de <strong>Borojó, Chontaduro y Zinc</strong>. Enciende la vitalidad, resistencia y conexión en pareja desde la primera toma.
              </p>

              {/* 3 Beneficios Clave */}
              <div className="space-y-2 mb-6">
                <div className="flex items-start gap-2.5 text-xs md:text-sm text-[#38322c]">
                  <span className="text-emerald-600 font-bold text-base leading-none">✓</span>
                  <span><strong>100% Natural:</strong> Sin taquicardia ni dolor de cabeza. 0% azúcar añadida.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs md:text-sm text-[#38322c]">
                  <span className="text-emerald-600 font-bold text-base leading-none">✓</span>
                  <span><strong>Envío 100% Gratis:</strong> Despacho prioritario por Tealca a toda Venezuela.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs md:text-sm text-[#38322c]">
                  <span className="text-emerald-600 font-bold text-base leading-none">✓</span>
                  <span><strong>Pago en la Entrega:</strong> No arriesgas nada. Pagas en efectivo al recibir.</span>
                </div>
              </div>

              {/* Botón directo al formulario */}
              <div ref={ctaHeroRef}>
                <button
                  onClick={() => scrollToForm()}
                  className="w-full bg-[#1b8a43] hover:bg-[#167438] active:scale-[0.99] text-white font-extrabold text-base md:text-lg py-4 px-6 rounded-2xl shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>SELECCIONAR PACK Y PEDIR</span>
                  <span>👇</span>
                </button>
                <p className="text-[11px] text-center text-[#857b70] mt-2">
                  🔒 Pedido seguro por WhatsApp · Envío gratis incluido
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* SELECTOR DE PACKS Y FORMULARIO DIRECTO */}
        <section ref={formRef} className="bg-white rounded-3xl border-2 border-rose-600/30 p-5 md:p-8 shadow-md mb-8 scroll-mt-20">
          
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="inline-block bg-rose-100 text-rose-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              Paso 1: Elige tu Promoción
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1f1b18]">
              Promociones Exclusivas con Envío Gratis
            </h2>
            <p className="text-xs md:text-sm text-[#6b6155] mt-1">
              Selecciona tu pack y completa tus datos abajo para despachar tu paquete por Tealca.
            </p>
          </div>

          {/* Cards de Packs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-8">
            {PRODUCT_BUNDLES.map((bundle) => {
              const isSelected = selectedPack.id === bundle.id;
              return (
                <div
                  key={bundle.id}
                  onClick={() => setSelectedPack(bundle)}
                  className={`relative rounded-2xl p-4 cursor-pointer transition-all border-2 ${
                    isSelected
                      ? "border-rose-600 bg-rose-50/60 shadow-md ring-2 ring-rose-200"
                      : "border-[#e8e1d5] bg-white hover:border-[#cfc4b2]"
                  }`}
                >
                  {bundle.recommended && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[10px] font-black tracking-wider uppercase px-3 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                      {bundle.badge}
                    </span>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-[#1f1b18]">{bundle.name}</span>
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? "border-rose-600 bg-rose-600" : "border-[#cfc4b2]"
                    }`}>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-2xl font-black text-rose-600">${bundle.price}</span>
                    <span className="text-xs text-[#857b70] line-through">${bundle.regularPrice}</span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded ml-auto">
                      {bundle.shippingLabel}
                    </span>
                  </div>

                  <p className="text-xs text-[#5c5349] leading-snug">{bundle.savings}</p>
                </div>
              );
            })}
          </div>

          {/* Formulario Integrado (Cero Popups) */}
          <div className="border-t border-[#e8e1d5] pt-6 max-w-xl mx-auto">
            <div className="text-center mb-5">
              <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-1">
                Paso 2: Datos de Entrega Tealca
              </span>
              <h3 className="font-bold text-lg text-[#1f1b18]">
                ¿A dónde enviamos tu pedido?
              </h3>
              <p className="text-xs text-[#6b6155]">
                Pagas en efectivo o pago móvil cuando Tealca te entregue el paquete en tus manos.
              </p>
            </div>

            {/* Resumen del Pack Activo */}
            <div className="bg-[#faf8f5] border border-[#e8e1d5] rounded-xl p-3 mb-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#857b70] block">Pack seleccionado:</span>
                <span className="font-bold text-sm text-[#1f1b18]">{selectedPack.name}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-700 font-bold block">ENVÍO GRATIS</span>
                <span className="text-lg font-black text-rose-600">${selectedPack.price} USD</span>
              </div>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#38322c] mb-1">
                  Nombre y Apellido *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Ej: Carlos Pérez"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-[#faf8f5] border border-[#d8cec0] focus:border-rose-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm outline-hidden transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#38322c] mb-1">
                  Número de WhatsApp * (Para coordinar la entrega)
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="Ej: 0412 123 4567"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-[#faf8f5] border border-[#d8cec0] focus:border-rose-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm outline-hidden transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#38322c] mb-1">
                    Estado *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full bg-[#faf8f5] border border-[#d8cec0] focus:border-rose-600 focus:bg-white rounded-xl px-3 py-2.5 text-xs outline-hidden transition-all"
                  >
                    {VENEZUELA_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#38322c] mb-1">
                    Método de Pago al Recibir *
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full bg-[#faf8f5] border border-[#d8cec0] focus:border-rose-600 focus:bg-white rounded-xl px-3 py-2.5 text-xs outline-hidden transition-all"
                  >
                    <option value="efectivo_divisas">💵 Efectivo Divisas ($) al recibir</option>
                    <option value="pago_movil">📲 Pago Móvil (tasa oficial) al recibir</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#38322c] mb-1">
                  Dirección exacta o Agencia Tealca más cercana *
                </label>
                <input
                  type="text"
                  name="cityAddress"
                  required
                  placeholder="Ej: Urb. Los Palos Grandes o Agencia Tealca Chacao"
                  value={formData.cityAddress}
                  onChange={handleInputChange}
                  className="w-full bg-[#faf8f5] border border-[#d8cec0] focus:border-rose-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm outline-hidden transition-all"
                />
              </div>

              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                  {formError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1b8a43] hover:bg-[#167438] active:scale-[0.99] text-white font-black text-base md:text-lg py-4 px-6 rounded-2xl shadow-xl shadow-emerald-900/25 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <span>{isSubmitting ? "REGISTRANDO PEDIDO..." : `PEDIR POR WHATSAPP ($${selectedPack.price})`}</span>
                <span>🚚</span>
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-[#857b70] pt-2">
                <span>🤝 Pago en la entrega</span>
                <span>•</span>
                <span>📦 Envío Gratis</span>
                <span>•</span>
                <span>🛡️ Cero riesgo</span>
              </div>
            </form>
          </div>
        </section>

        {/* COMPONENTES NATURALES */}
        <section className="bg-white rounded-3xl border border-[#e8e1d5] p-5 md:p-8 shadow-xs mb-8">
          <div className="max-w-xl mx-auto text-center mb-6">
            <span className="text-xs font-extrabold text-rose-600 uppercase tracking-wider block mb-1">
              Fórmula Limpia
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#1f1b18]">
              Componentes 100% Naturales
            </h3>
            <p className="text-xs md:text-sm text-[#5c5349] mt-1">
              Sin fármacos agresivos ni químicos sintéticos. Máxima potencia botanical en gomitas masticables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-[#e8e1d5] shadow-inner bg-[#f3ede4]">
              <Image
                src="/viking/botanical_superfruits_studio.jpg"
                alt="Borojó y Chontaduro ingredientes naturales de Gummies Viking"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#faf8f5] border border-[#e8e1d5] rounded-xl p-3.5">
                <span className="text-lg block mb-1">🌴</span>
                <h4 className="font-bold text-xs text-[#1f1b18]">Borojó Amazónico</h4>
                <p className="text-[11px] text-[#6b6155] mt-0.5">Alto en fósforo y vitaminas para energía física y resistencia.</p>
              </div>

              <div className="bg-[#faf8f5] border border-[#e8e1d5] rounded-xl p-3.5">
                <span className="text-lg block mb-1">🥥</span>
                <h4 className="font-bold text-xs text-[#1f1b18]">Chontaduro Puro</h4>
                <p className="text-[11px] text-[#6b6155] mt-0.5">Ácidos grasos esenciales y aminoácidos que despiertan el vigor.</p>
              </div>

              <div className="bg-[#faf8f5] border border-[#e8e1d5] rounded-xl p-3.5">
                <span className="text-lg block mb-1">⚡</span>
                <h4 className="font-bold text-xs text-[#1f1b18]">Zinc & Vitamina C</h4>
                <p className="text-[11px] text-[#6b6155] mt-0.5">Optimización hormonal natural y vitalidad inmunológica.</p>
              </div>

              <div className="bg-[#faf8f5] border border-[#e8e1d5] rounded-xl p-3.5">
                <span className="text-lg block mb-1">🍓</span>
                <h4 className="font-bold text-xs text-[#1f1b18]">0% Azúcar Añadida</h4>
                <p className="text-[11px] text-[#6b6155] mt-0.5">Endulzado natural con colágeno y rico sabor a frutos rojos.</p>
              </div>
            </div>
          </div>
        </section>

        {/* OPINIONES REALES */}
        <section className="bg-white rounded-3xl border border-[#e8e1d5] p-5 md:p-8 shadow-xs mb-8">
          <div className="text-center mb-6">
            <span className="text-xs font-extrabold text-rose-600 uppercase tracking-wider block mb-1">
              Experiencias en Venezuela
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#1f1b18]">
              Lo que dicen quienes ya las probaron
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="bg-[#faf8f5] border border-[#e8e1d5] rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <div className="text-rose-600 text-xs mb-2">★★★★★</div>
                  <p className="text-xs text-[#423b34] italic leading-relaxed mb-3">"{t.quote}"</p>
                </div>
                <div className="border-t border-[#e8e1d5] pt-2 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#1f1b18]">{t.author} · {t.city}</span>
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">{t.pack}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3 PASOS FÁCILES DE TEALCA */}
        <section className="bg-gradient-to-r from-[#221e1a] to-[#3a332d] text-white rounded-3xl p-6 md:p-8 text-center shadow-lg mb-8">
          <h3 className="font-serif text-xl md:text-2xl font-bold mb-2">
            ¿Cómo funciona el Pago en la Entrega?
          </h3>
          <p className="text-xs md:text-sm text-[#d4cbbf] max-w-lg mx-auto mb-6">
            Cero riesgos para ti. No tienes que transferir nada por adelantado.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
              <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-black text-xs flex items-center justify-center mb-2">1</span>
              <h4 className="font-bold text-sm mb-1">Pides en 30 segundos</h4>
              <p className="text-xs text-[#d4cbbf]">Seleccionas tu pack arriba y nos confirmas por WhatsApp.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
              <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-black text-xs flex items-center justify-center mb-2">2</span>
              <h4 className="font-bold text-sm mb-1">Tealca te lo lleva</h4>
              <p className="text-xs text-[#d4cbbf]">Despachamos de inmediato con número de guía a tu ciudad.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
              <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-black text-xs flex items-center justify-center mb-2">3</span>
              <h4 className="font-bold text-sm mb-1">Pagas al recibir</h4>
              <p className="text-xs text-[#d4cbbf]">Pagas en efectivo divisas ($) o pago móvil cuando tengas tu paquete.</p>
            </div>
          </div>

          <button
            onClick={() => scrollToForm()}
            className="mt-6 bg-[#1b8a43] hover:bg-[#167438] text-white font-extrabold text-sm md:text-base py-3 px-8 rounded-full transition-all inline-flex items-center gap-2"
          >
            <span>QUIERO PEDIR CON PAGO EN LA ENTREGA</span>
            <span>👉</span>
          </button>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="max-w-4xl mx-auto px-4 text-center text-xs text-[#857b70] border-t border-[#e8e1d5] pt-6 pb-12">
        <p className="font-bold text-[#1f1b18] mb-1">Gummies Viking Venezuela © {new Date().getFullYear()}</p>
        <p className="max-w-md mx-auto text-[11px] leading-relaxed">
          Suplemento alimenticio a base de Borojó, Chontaduro y Vitaminas. Este producto no sustituye una alimentación balanceada. Despacho nacional por Tealca.
        </p>
      </footer>

      {/* STICKY BOTTOM BAR EN MÓVIL */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e8e1d5] p-3 shadow-2xl">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-[#857b70] block uppercase font-bold">Pack Seleccionado:</span>
              <span className="text-xs font-black text-rose-600">{selectedPack.name} (${selectedPack.price})</span>
            </div>
            <button
              onClick={() => scrollToForm()}
              className="bg-[#1b8a43] hover:bg-[#167438] active:scale-[0.98] text-white font-black text-xs md:text-sm py-2.5 px-5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <span>PEDIR AHORA</span>
              <span>🚚</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
