"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { PRODUCT_BUNDLES, DEFAULT_BUNDLE, ProductBundle } from "@/lib/product";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_STORE_WHATSAPP || "584121183463";

const VENEZUELA_STATES = [
  "Caracas (Distrito Capital)",
  "Miranda (Altos Mirandinos / Guarenas / Guatire / Valles del Tuy)",
  "Zulia (Maracaibo / San Francisco / Cabimas)",
  "Carabobo (Valencia / Naguanagua / San Diego / Puerto Cabello)",
  "Aragua (Maracay / Turmero / Cagua)",
  "Lara (Barquisimeto / Cabudare)",
  "Anzoátegui (Barcelona / Puerto La Cruz / Lechería / El Tigre)",
  "Bolívar (Puerto Ordaz / Ciudad Bolívar / San Félix)",
  "Nueva Esparta (Margarita / Porlamar / Pampatar)",
  "Táchira (San Cristóbal / Táriba)",
  "Mérida (Mérida / El Vigía)",
  "Falcón (Coro / Punto Fijo)",
  "Monagas (Maturín)",
  "Sucre (Cumaná / Carúpano)",
  "Barinas (Barinas)",
  "Portuguesa (Acarigua / Araure / Guanare)",
  "Trujillo (Valera / Trujillo)",
  "Yaracuy (San Felipe)",
  "Guárico (San Juan de los Morros / Calabozo / Valle de la Pascua)",
  "Apure (San Fernando de Apure)",
  "Cojedes (San Carlos)",
  "Delta Amacuro (Tucupita)",
  "Amazonas (Puerto Ayacucho)",
  "La Guaira (Catia La Mar / Maiquetía)"
];

const GALLERY_IMAGES = [
  {
    src: "/viking/viking_pouch_front.jpg",
    alt: "Gummies Viking Sobre Individual 2 Gomitas",
    tag: "SOBRES INDIVIDUALES",
    label: "Sobre de Bolsillo"
  },
  {
    src: "/viking/viking_bottle_splash.jpg",
    alt: "Gummies Viking Borojó y Chontaduro Pote 30 Gomitas",
    tag: "POTE 30 GOMITAS",
    label: "Pote de 30 Gomitas"
  },
  {
    src: "/viking/viking_pouch_with_gummies.jpg",
    alt: "Gomitas masticables en forma de león rosa y azul",
    tag: "DÚO DE PAREJA",
    label: "Gomitas en Forma de León"
  },
  {
    src: "/viking/viking_bottle_benefits.jpg",
    alt: "Fórmula de Energía y Vitalidad Gummies Viking",
    tag: "FÓRMULA ACTIVA",
    label: "Beneficios de Vigor"
  },
  {
    src: "/viking/viking_pouch_real_table.jpg",
    alt: "Gummies Viking Foto Real en Mano",
    tag: "FOTO REAL EN MANO",
    label: "Empaque Discreto"
  }
];

const TESTIMONIALS = [
  {
    quote: "La rutina de la oficina nos dejaba muertos a los dos por la noche. Pedimos el combo de 3 pares para probar y el cambio en energía fue brutal, cero dolor de cabeza ni taquicardia.",
    author: "Valeria & Daniel",
    city: "Caracas",
    rating: 5,
    combo: "3 Pares ($25)"
  },
  {
    quote: "El paquete llegó sellado por Tealca al día siguiente a Valencia. Pagué en efectivo al recibirlo, super seguro y con total discreción.",
    author: "Marcos G.",
    city: "Valencia, Carabobo",
    rating: 5,
    combo: "Frasco 30 ($45)"
  },
  {
    quote: "Ella tomó la iniciativa y las pidió para una escapada de fin de semana. El sabor es riquísimo y de verdad te da una vitalidad constante.",
    author: "Roberto & Andrea",
    city: "Lechería, Anzoátegui",
    rating: 5,
    combo: "3 Pares ($25)"
  }
];

export default function VikingLanding() {
  const [selectedPack, setSelectedPack] = useState<ProductBundle>(DEFAULT_BUNDLE);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Formulario COD
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    state: "Caracas (Distrito Capital)",
    cityAddress: "",
    paymentMethod: "efectivo_divisas",
    notes: ""
  });
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeLegalModal, setActiveLegalModal] = useState<"privacy" | "shipping" | "guide" | null>(null);

  // Touch Swipe para móvil
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const ctaButtonRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 40) {
      setCurrentSlide((prev) => (prev + 1) % GALLERY_IMAGES.length);
    }
    if (touchStartX.current - touchEndX.current < -40) {
      setCurrentSlide((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Sticky bar inteligente
  useEffect(() => {
    const handleScroll = () => {
      if (!ctaButtonRef.current) return;
      const rect = ctaButtonRef.current.getBoundingClientRect();
      if (rect.bottom < 0) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Pixel ViewContent
  useEffect(() => {
    if (typeof window !== "undefined" && (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
      (window as unknown as { fbq: (...args: unknown[]) => void }).fbq("track", "ViewContent", {
        content_name: "Gummies Viking Borojó y Chontaduro",
        content_category: "Vitalidad y Parejas",
        value: 25,
        currency: "USD"
      });
    }
  }, []);

  const openCheckout = (pack?: ProductBundle) => {
    if (pack) setSelectedPack(pack);
    setIsCheckoutOpen(true);

    if (typeof window !== "undefined" && (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
      const targetPack = pack || selectedPack;
      (window as unknown as { fbq: (...args: unknown[]) => void }).fbq("track", "InitiateCheckout", {
        content_name: targetPack.name,
        content_ids: [targetPack.id],
        value: targetPack.price,
        currency: "USD"
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.cityAddress.trim()) {
      setErrorMessage("Por favor completa tu nombre, teléfono y dirección o agencia Tealca.");
      return;
    }
    setErrorMessage("");
    setFormStatus("submitting");

    const eventId = `ord-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          state: formData.state,
          address: formData.cityAddress.trim(),
          bundle: selectedPack.id,
          paymentMethod: formData.paymentMethod,
          deliveryNotes: formData.notes.trim(),
          eventId
        })
      });

      const cleanState = formData.state.split("(")[0].trim();
      const messageLines = [
        "👑 *SOLICITUD DE PEDIDO - GUMMIES VIKING VENEZUELA*",
        "------------------------------------",
        "*DETALLE DEL PEDIDO:*",
        `- Presentación: ${selectedPack.orderName}`,
        `- Total a Pagar: $${selectedPack.price} USD (PAGO EN LA ENTREGA)`,
        `- Despacho: 100% GRATIS POR TEALCA`,
        "",
        "*DATOS PARA EL ENVÍO:*",
        `- Cliente: ${formData.fullName.trim()}`,
        `- Teléfono: ${formData.phone.trim()}`,
        `- Estado: ${cleanState}`,
        `- Dirección / Agencia Tealca: ${formData.cityAddress.trim()}`,
        `- Método de Pago: ${
          formData.paymentMethod === "efectivo_divisas"
            ? "Efectivo Divisas ($) al recibir"
            : "Pago Móvil (tasa oficial) al recibir"
        }`,
        ...(formData.notes?.trim() ? [`- Nota: ${formData.notes.trim()}`] : []),
        "",
        "------------------------------------",
        "*MODALIDAD:* PAGO EN LA ENTREGA",
        "Pagas únicamente cuando recibas el paquete en tus manos por Tealca.",
        "",
        "Hola, acabo de registrar mi pedido en la página oficial de Gummies Viking. ¿Me confirman para coordinar el despacho por Tealca?"
      ];

      const message = messageLines.join("\n");
      const cleanPhone = WHATSAPP_NUMBER.replace(/\D/g, "");
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

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

      setFormStatus("success");
      setTimeout(() => {
        window.location.href = waUrl;
      }, 350);
    } catch {
      setErrorMessage("Ocurrió un inconveniente. Puedes escribirnos directo a WhatsApp.");
      setFormStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#221e1a] font-sans antialiased pb-24 md:pb-12 overflow-x-hidden w-full max-w-full">
      {/* 1. BARRA SUPERIOR DE GARANTÍA (PAGO EN LA ENTREGA TEALCA) */}
      <aside className="bg-[#18181b] text-[#f4efe8] text-[11px] sm:text-xs py-2 px-3 text-center font-medium tracking-wide border-b border-neutral-800">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-2 flex-wrap leading-tight">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-white uppercase tracking-wider">Pago en la Entrega en toda Venezuela:</span>
          <span className="text-neutral-300">No pagas nada por adelantado. Envíos 100% Gratis por <strong>Tealca</strong>.</span>
        </div>
      </aside>

      {/* 2. CABECERA LIMPIA Y EDITORIAL */}
      <header className="sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#eae3d7]">
        <div className="max-w-5xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl sm:text-2xl font-serif font-black tracking-tight text-[#18181b]">
              GUMMIES VIKING<span className="text-rose-600">.</span>
            </span>
            <span className="hidden sm:inline-block text-[11px] text-[#736a5f] border-l border-[#dcd3c5] pl-3 tracking-widest uppercase">
              Borojó & Chontaduro
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#2f5536] font-medium bg-[#eef5ee] border border-[#d2e4d0] px-3 py-1 rounded-full">
              <span>🚚</span>
              <span>Envío Gratis Tealca</span>
            </div>
            <button
              onClick={() => openCheckout()}
              className="bg-[#18181b] hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-xs cursor-pointer"
            >
              Pedir Ahora
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION (2 COLUMNAS EDITORIAL DE ALTA CONVERSIÓN) */}
      <main className="max-w-5xl mx-auto px-4 pt-6 md:pt-10 space-y-12">
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* COLUMNA IZQUIERDA: CARRUSEL DE PRODUCTO LIMPIO */}
          <div className="md:col-span-6 space-y-3">
            <div
              className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-[#e8e1d5] shadow-xs select-none group"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                src={GALLERY_IMAGES[currentSlide].src}
                alt={GALLERY_IMAGES[currentSlide].alt}
                fill
                priority
                className="object-contain p-3 md:p-5"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Tag / Badge flotante */}
              <div className="absolute top-4 left-3 z-20 bg-[#18181b]/90 backdrop-blur-xs text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-xs">
                {GALLERY_IMAGES[currentSlide].tag}
              </div>

              {/* Contador */}
              <div className="absolute bottom-3 right-3 z-20 bg-white/95 text-[#443e37] text-[10px] font-semibold px-2.5 py-1 rounded-md border border-[#e4ded3] shadow-xs">
                {currentSlide + 1} / {GALLERY_IMAGES.length}
              </div>

              {/* Flechas de navegación */}
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length)}
                aria-label="Anterior"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 text-[#18181b] shadow-md flex items-center justify-center opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-all cursor-pointer font-bold border border-[#eae2d5]"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev + 1) % GALLERY_IMAGES.length)}
                aria-label="Siguiente"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 text-[#18181b] shadow-md flex items-center justify-center opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-all cursor-pointer font-bold border border-[#eae2d5]"
              >
                ›
              </button>
            </div>

            {/* Miniaturas de Producto */}
            <div className="grid grid-cols-5 gap-1.5 md:gap-2">
              {GALLERY_IMAGES.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`relative aspect-square rounded-xl overflow-hidden bg-white border-2 transition-all cursor-pointer ${
                    currentSlide === idx 
                      ? "border-rose-600 ring-2 ring-rose-600/25 shadow-xs scale-102" 
                      : "border-[#e5ded2] opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img.src} alt={img.alt} fill className="object-cover p-0.5" sizes="20vw" />
                </button>
              ))}
            </div>
          </div>

          {/* COLUMNA DERECHA: INFORMACIÓN ESENCIAL, SELECTOR DE COMBOS Y COMPRA */}
          <div className="md:col-span-6 space-y-4">
            {/* Valoración y Título */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-medium text-[#6b6255]">
                <div className="flex text-amber-500 text-sm">★★★★★</div>
                <span className="font-bold text-[#221e1a]">4.9/5</span>
                <span>• +1,420 parejas en Venezuela</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[#18181b] leading-tight">
                Gummies Viking Borojó & Chontaduro
              </h1>

              <p className="text-xs sm:text-sm text-[#5c5449] leading-relaxed">
                Suplemento vigorizante masticable con <strong>extractos botánicos puros</strong>. 
                Elimina la fatiga laboral del día a día y enciende tu energía para disfrutar en pareja, sin efectos secundarios ni azúcar añadida.
              </p>
            </div>

            {/* 3 Bullets de Beneficios Rápidos */}
            <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#eae3d7] text-center text-xs">
              <div className="p-2 bg-white rounded-lg border border-[#e8e1d5]">
                <span className="block text-base">🥭</span>
                <strong className="block text-[11px] text-[#18181b] mt-0.5">100% Natural</strong>
                <span className="text-[10px] text-[#736a5f]">Borojó & Chontaduro</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-[#e8e1d5]">
                <span className="block text-base">⚡</span>
                <strong className="block text-[11px] text-[#18181b] mt-0.5">0% Azúcar</strong>
                <span className="text-[10px] text-[#736a5f]">Solo 0,5 kcal</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-[#e8e1d5]">
                <span className="block text-base">🛡️</span>
                <strong className="block text-[11px] text-[#18181b] mt-0.5">Cero Riesgo</strong>
                <span className="text-[10px] text-[#736a5f]">Pagas al recibir</span>
              </div>
            </div>

            {/* SELECTOR DE COMBOS CON PRECIOS REDONDOS ($25 / $21 / $45) */}
            <div className="space-y-2.5 pt-1">
              <span className="text-[11px] font-bold text-[#443e37] uppercase tracking-wider block">
                Selecciona tu Presentación (Envío Gratis Incluido):
              </span>

              {PRODUCT_BUNDLES.map((pack) => {
                const isSelected = selectedPack.id === pack.id;
                const isPopular = pack.recommended;

                return (
                  <div
                    key={pack.id}
                    onClick={() => setSelectedPack(pack)}
                    className={`relative p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-white border-rose-600 shadow-md ring-2 ring-rose-600/15"
                        : "bg-white/80 border-[#e5ded2] hover:border-[#cfc6b8]"
                    }`}
                  >
                    {/* Badge */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          isPopular
                            ? "bg-rose-600 text-white"
                            : pack.id === "pack_frasco_30"
                            ? "bg-neutral-800 text-white"
                            : "bg-[#e8e1d5] text-[#443e37]"
                        }`}
                      >
                        {pack.badge}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase">
                        Envío Gratis Tealca
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected ? "border-rose-600 bg-rose-600" : "border-[#b5aba0]"
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <strong className="text-sm font-bold text-[#18181b] block">
                            {pack.name}
                          </strong>
                          <span className="text-[11px] text-[#6b6255]">
                            {pack.unitLabel} • {pack.perDose}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs text-[#9c9184] line-through block leading-none">
                          ${pack.regularPrice}
                        </span>
                        <span className="text-xl font-black text-[#18181b] leading-tight">
                          ${pack.price}
                        </span>
                      </div>
                    </div>

                    {isPopular && (
                      <p className="text-[11px] font-bold text-rose-700 mt-1 pl-6">
                        ★ {pack.savings}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* BANNER DE REGALO CONGRUENTE CON LOS VIDEOS */}
            <div className="bg-[#fef9ee] border border-[#f5e6c4] p-3 rounded-xl flex items-center gap-2.5 text-xs text-[#735118]">
              <span className="text-xl shrink-0">🎁</span>
              <p className="text-[11px] leading-tight">
                <strong>Regalo Especial Hoy:</strong> Recibe de obsequio la <strong>Guía Digital: Hábitos de Vitalidad & Bienestar en Pareja</strong> con tu pedido.
              </p>
            </div>

            {/* BOTÓN PRINCIPAL DE COMPRA */}
            <div ref={ctaButtonRef} className="space-y-2 pt-1">
              <button
                onClick={() => openCheckout()}
                className="w-full bg-[#18181b] hover:bg-black text-white font-black text-sm py-3.5 px-6 rounded-xl transition-all shadow-lg active:scale-98 uppercase tracking-wider animate-cta-shimmer flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Solicitar Ahora • Pago en la Entrega</span>
                <span className="text-rose-400">→</span>
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-[#6b6255] pt-1">
                <span className="flex items-center gap-1">🛡️ Cero riesgo</span>
                <span className="flex items-center gap-1">🔒 Paquete discreto</span>
                <span className="flex items-center gap-1">🚚 Tealca a tu puerta</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. SECCIÓN DE HISTORIA & CONEXIÓN: EL CANSANCIO VS. TUS MEJORES NOCHES */}
        <section className="bg-white rounded-2xl p-5 md:p-8 border border-[#e8e1d5] shadow-xs space-y-6">
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
              Rompe la Rutina
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-[#18181b]">
              ¿El cansancio del día te está quitando tus mejores momentos?
            </h2>
            <p className="text-xs sm:text-sm text-[#5c5449] leading-relaxed">
              Trabajo en la mañana, tráfico y compromisos en la tarde. Llega la noche y ya no quedan ganas ni energía para compartir de verdad con tu pareja. Tu vida no debería ser solo trabajar y dormir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8e1d5] space-y-2 text-center md:text-left">
              <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center mx-auto md:mx-0">
                01
              </span>
              <strong className="block text-sm text-[#18181b]">Sin Estimulantes Agresivos</strong>
              <p className="text-xs text-[#6b6255] leading-relaxed">
                Olvídate de la taquicardia o dolores de cabeza. Gummies Viking actúa con nutrientes botánicos de absorción natural.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8e1d5] space-y-2 text-center md:text-left">
              <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center mx-auto md:mx-0">
                02
              </span>
              <strong className="block text-sm text-[#18181b]">Práctico y Discreto</strong>
              <p className="text-xs text-[#6b6255] leading-relaxed">
                Vienen en cómodos sobres de 2 gomitas masticables con sabor frutal. Llévalas en tu bolsillo y consúmelas cuando quieras.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8e1d5] space-y-2 text-center md:text-left">
              <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center mx-auto md:mx-0">
                03
              </span>
              <strong className="block text-sm text-[#18181b]">Complicidad en Pareja</strong>
              <p className="text-xs text-[#6b6255] leading-relaxed">
                Una opción perfecta para tomar la iniciativa, salir de la monotonía y encender la química en una cita especial.
              </p>
            </div>
          </div>
        </section>

        {/* 5. SECCIÓN DEDICADA: COMPONENTES 100% NATURALES (CON LA FOTO DE ESTUDIO GENERADA) */}
        <section className="bg-white rounded-2xl p-5 md:p-8 border border-[#e8e1d5] shadow-xs space-y-8">
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#2f5536] bg-[#eef5ee] border border-[#d2e4d0] px-3 py-1 rounded-full">
              Fórmula Botánica Certificada
            </span>
            <h2 className="text-xl sm:text-3xl font-serif font-black text-[#18181b]">
              Componentes 100% Naturales
            </h2>
            <p className="text-xs sm:text-sm text-[#5c5449] leading-relaxed">
              La sinergia de las dos superfrutas más poderosas del continente, combinadas con vitaminas esenciales para una vitalidad limpia y sostenida.
            </p>
          </div>

          {/* FOTO EDITORIAL DE ESTUDIO BOTÁNICO GENERADA */}
          <div className="relative aspect-video sm:aspect-[21/9] w-full rounded-2xl overflow-hidden border border-[#e8e1d5] shadow-sm bg-[#faf8f5]">
            <Image
              src="/viking/botanical_superfruits_studio.jpg"
              alt="Superfrutas botánicas frescas de Borojó y Chontaduro en estudio"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
              <span className="font-bold drop-shadow">Extractos Puros de Borojó Amazónico & Chontaduro</span>
              <span className="bg-white/90 text-[#18181b] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shadow">
                Grado Alimenticio
              </span>
            </div>
          </div>

          {/* 4 TARJETAS EDITORIALES DE INGREDIENTES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8e1d5] space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xl">🥭</span>
                <strong className="text-sm font-bold text-[#18181b]">Borojó Amazónico Silvestre</strong>
              </div>
              <p className="text-xs text-[#5c5449] leading-relaxed pl-7">
                Fruto tradicional del Amazonas conocido por su alta densidad de fósforo, aminoácidos y polifenoles. Aporta energía natural sin agotar tus reservas celulares.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8e1d5] space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌴</span>
                <strong className="text-sm font-bold text-[#18181b]">Chontaduro del Pacífico</strong>
              </div>
              <p className="text-xs text-[#5c5449] leading-relaxed pl-7">
                Considerado uno de los alimentos más nutritivos del trópico. Rico en ácidos grasos benéficos, carotenos y fibra que favorecen la stamina y la resistencia.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8e1d5] space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚡</span>
                <strong className="text-sm font-bold text-[#18181b]">Vitaminas C, E y Zinc</strong>
              </div>
              <p className="text-xs text-[#5c5449] leading-relaxed pl-7">
                Micronutrientes que combaten el estrés oxidativo celular derivado de la fatiga laboral y fortalecen la respuesta del sistema inmune.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8e1d5] space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛡️</span>
                <strong className="text-sm font-bold text-[#18181b]">0% Azúcar Añadida + Colágeno</strong>
              </div>
              <p className="text-xs text-[#5c5449] leading-relaxed pl-7">
                Aporte proteico funcional con solo 0,5 kcal por gomita. No genera pesadez, caries ni picos de insulina.
              </p>
            </div>
          </div>

          {/* TABLA NUTRICIONAL OFICIAL VERIFICABLE */}
          <div className="max-w-xl mx-auto border border-[#e4ded3] rounded-xl overflow-hidden bg-white text-xs">
            <div className="bg-[#18181b] text-white font-bold p-3 flex justify-between items-center">
              <span className="uppercase tracking-wider">Información Nutricional Oficial</span>
              <span className="text-neutral-400 text-[10px]">Por gomita (1 g)</span>
            </div>
            <div className="divide-y divide-[#eee9e0] text-[#332e29]">
              <div className="flex justify-between p-2.5">
                <span>Calorías</span>
                <strong className="text-[#18181b]">0,5 kcal</strong>
              </div>
              <div className="flex justify-between p-2.5">
                <span>Azúcares añadidos</span>
                <strong className="text-emerald-700">0 g</strong>
              </div>
              <div className="flex justify-between p-2.5">
                <span>Vitamina C</span>
                <strong className="text-[#18181b]">22 mg</strong>
              </div>
              <div className="flex justify-between p-2.5">
                <span>Vitamina E</span>
                <strong className="text-[#18181b]">1,9 mg</strong>
              </div>
              <div className="flex justify-between p-2.5">
                <span>Colágeno hidrolizado</span>
                <strong className="text-rose-700">4,45 mg</strong>
              </div>
              <div className="flex justify-between p-2.5">
                <span>Extracto de Borojó</span>
                <strong className="text-[#18181b]">1,25 mg</strong>
              </div>
              <div className="flex justify-between p-2.5">
                <span>Extracto de Chontaduro</span>
                <strong className="text-[#18181b]">0,35 mg</strong>
              </div>
              <div className="flex justify-between p-2.5">
                <span>Zinc</span>
                <strong className="text-[#18181b]">0,08 mg</strong>
              </div>
            </div>
          </div>
        </section>

        {/* 6. CÓMO FUNCIONA EL PAGO EN LA ENTREGA (3 PASOS CLAROS TEALCA) */}
        <section className="bg-white rounded-2xl p-5 md:p-8 border border-[#e8e1d5] shadow-xs space-y-6">
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#2f5536] bg-[#eef5ee] border border-[#d2e4d0] px-3 py-1 rounded-full">
              Paso a Paso
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-[#18181b]">
              Cómo Funciona el Pago en la Entrega
            </h2>
            <p className="text-xs sm:text-sm text-[#5c5449]">
              Comprar en línea en Venezuela nunca fue tan transparente y seguro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8e1d5] space-y-2 text-center md:text-left">
              <span className="w-8 h-8 rounded-full bg-[#18181b] text-white font-bold text-xs flex items-center justify-center mx-auto md:mx-0">
                1
              </span>
              <strong className="block text-sm text-[#18181b]">Eliges tu Combo</strong>
              <p className="text-xs text-[#6b6255] leading-relaxed">
                Seleccionas la presentación que prefieras (el más popular es 3 Pares por $25 o Frasco de 30 por $45).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8e1d5] space-y-2 text-center md:text-left">
              <span className="w-8 h-8 rounded-full bg-[#18181b] text-white font-bold text-xs flex items-center justify-center mx-auto md:mx-0">
                2
              </span>
              <strong className="block text-sm text-[#18181b]">Llenas tus Datos</strong>
              <p className="text-xs text-[#6b6255] leading-relaxed">
                Indicas tu nombre, WhatsApp y dirección o agencia Tealca. Coordinamos el despacho inmediato en sobre ciego sellado.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8e1d5] space-y-2 text-center md:text-left">
              <span className="w-8 h-8 rounded-full bg-[#18181b] text-white font-bold text-xs flex items-center justify-center mx-auto md:mx-0">
                3
              </span>
              <strong className="block text-sm text-[#18181b]">Pagas al Recibir</strong>
              <p className="text-xs text-[#6b6255] leading-relaxed">
                Recibes tu paquete en tu puerta o agencia Tealca y pagas en ese instante en divisas en efectivo o Pago Móvil.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => openCheckout()}
              className="bg-[#18181b] hover:bg-black text-white font-black text-xs sm:text-sm px-8 py-3.5 rounded-xl uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer"
            >
              Pedir Ahora con Pago en la Entrega
            </button>
          </div>
        </section>

        {/* 7. OPINIONES VERIFICADAS */}
        <section className="bg-white rounded-2xl p-5 md:p-8 border border-[#e8e1d5] shadow-xs space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-serif font-black text-[#18181b]">
              Experiencias de Clientes en Venezuela
            </h2>
            <p className="text-xs text-[#6b6255]">Parejas reales que han integrado Gummies Viking</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8e1d5] space-y-2.5">
                <div className="flex text-amber-500 text-xs">{"★".repeat(t.rating)}</div>
                <p className="text-xs text-[#443e37] italic leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="pt-2 border-t border-[#eae3d7] flex items-center justify-between text-[11px]">
                  <strong className="text-[#18181b]">{t.author}</strong>
                  <span className="text-[#736a5f]">{t.city}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. PREGUNTAS FRECUENTES */}
        <section className="bg-white rounded-2xl p-5 md:p-8 border border-[#e8e1d5] shadow-xs space-y-4">
          <h2 className="text-xl font-serif font-black text-center text-[#18181b]">
            Preguntas Frecuentes
          </h2>

          <div className="space-y-2 text-xs md:text-sm">
            {[
              {
                q: "¿Cómo se consumen las gomitas?",
                a: "Consume 1 o 2 gomitas masticables unos 30 a 45 minutos antes de la ocasión o en la mañana para mantener una vitalidad constante durante el día."
              },
              {
                q: "¿El paquete es 100% discreto?",
                a: "Totalmente. El envío se realiza en sobre opaco y sellado de seguridad de Tealca, sin logos externos ni menciones explícitas de producto."
              },
              {
                q: "¿Cuánto tarda el despacho a mi ciudad?",
                a: "Por lo general tarda de 24 a 48 horas hábiles por Tealca a las principales ciudades del país."
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="border border-[#e8e1d5] rounded-xl p-3.5 bg-[#faf8f5] cursor-pointer"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <div className="flex items-center justify-between font-bold text-[#18181b]">
                  <span>{faq.q}</span>
                  <span className="text-base leading-none">{activeFaq === idx ? "−" : "+"}</span>
                </div>
                {activeFaq === idx && (
                  <p className="text-xs text-[#5c5449] pt-2 leading-relaxed border-t border-[#eae3d7] mt-2">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 9. FOOTER EDITORIAL */}
      <footer className="mt-16 bg-[#18181b] text-neutral-400 py-10 px-4 text-xs border-t border-neutral-800">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <strong className="text-white block font-serif text-sm">GUMMIES VIKING VENEZUELA</strong>
            <p className="text-[11px] text-neutral-400">Distribución oficial a nivel nacional con pago en la entrega.</p>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <button onClick={() => setActiveLegalModal("privacy")} className="hover:text-white transition-colors cursor-pointer">Privacidad</button>
            <button onClick={() => setActiveLegalModal("shipping")} className="hover:text-white transition-colors cursor-pointer">Despachos Tealca</button>
            <button onClick={() => setActiveLegalModal("guide")} className="hover:text-white transition-colors cursor-pointer">Modo de Uso</button>
          </div>
        </div>
      </footer>

      {/* 10. STICKY BOTTOM BAR EN MÓVIL (THUMB-ZONE PRO) */}
      {showStickyBar && (
        <div className="fixed bottom-3 inset-x-3 max-w-md mx-auto z-40 bg-white/95 backdrop-blur-md border border-[#dcd3c5] rounded-2xl p-3 shadow-xl flex items-center justify-between gap-3 md:hidden">
          <div>
            <span className="text-[10px] text-[#6b6255] font-bold block uppercase leading-none">
              {selectedPack.name.split("(")[0]}
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-black text-[#18181b]">${selectedPack.price}</span>
              <span className="text-[9px] text-emerald-700 font-bold uppercase">Envío Gratis</span>
            </div>
          </div>

          <button
            onClick={() => openCheckout()}
            className="bg-[#18181b] hover:bg-black text-white text-xs font-black px-5 py-2.5 rounded-xl uppercase tracking-wider shadow-md active:scale-95 cursor-pointer"
          >
            Pedir (Pago al Recibir)
          </button>
        </div>
      )}

      {/* 11. MODAL DE CHECKOUT COD (PAGO EN LA ENTREGA) */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-[#e0d8cc] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl relative my-8 animate-modal-pop text-[#221e1a]">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f4efe8] hover:bg-[#eae3d7] text-[#443e37] flex items-center justify-center text-sm font-bold cursor-pointer"
            >
              ✕
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#2f5536] bg-[#eef5ee] border border-[#d2e4d0] px-2.5 py-0.5 rounded-full inline-block">
                Pago en la Entrega • Cero Riesgo
              </span>
              <h2 className="text-lg font-serif font-black text-[#18181b] mt-1.5">
                Completa tu Solicitud de Pedido
              </h2>
              <p className="text-xs text-[#6b6255]">
                Pagas únicamente al recibir tu paquete sellado por Tealca.
              </p>
            </div>

            {/* Selector rápido dentro del modal */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#443e37] uppercase tracking-wider">
                Presentación Seleccionada:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {PRODUCT_BUNDLES.map((pack) => (
                  <button
                    key={pack.id}
                    type="button"
                    onClick={() => setSelectedPack(pack)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedPack.id === pack.id
                        ? "border-rose-600 bg-rose-50 text-rose-900 font-bold ring-1 ring-rose-600/30"
                        : "border-[#e0d8cc] bg-[#faf8f5] text-[#5c5449]"
                    }`}
                  >
                    <span className="block text-[10px] truncate">{pack.name.split("(")[0]}</span>
                    <span className="text-xs font-black text-[#18181b]">${pack.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmitOrder} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#443e37] mb-1">
                  Nombre y Apellido *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Ej. Carlos Mendoza"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-2.5 rounded-lg border border-[#cfc6b8] focus:border-[#18181b] focus:ring-1 focus:ring-[#18181b] outline-none text-[#18181b] bg-[#faf8f5]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#443e37] mb-1">
                  Teléfono / WhatsApp *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="Ej. 0412 1234567"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2.5 rounded-lg border border-[#cfc6b8] focus:border-[#18181b] focus:ring-1 focus:ring-[#18181b] outline-none text-[#18181b] bg-[#faf8f5]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#443e37] mb-1">
                  Estado / Región *
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full p-2.5 rounded-lg border border-[#cfc6b8] focus:border-[#18181b] outline-none bg-[#faf8f5] text-[#18181b]"
                >
                  {VENEZUELA_STATES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#443e37] mb-1">
                  Ciudad y Dirección exacta (o Agencia Tealca) *
                </label>
                <textarea
                  name="cityAddress"
                  required
                  rows={2}
                  placeholder="Ej. Maracay, Urb. Calicanto, Calle 5, Casa #12 (o retirar en Tealca Los Samanes)"
                  value={formData.cityAddress}
                  onChange={handleInputChange}
                  className="w-full p-2.5 rounded-lg border border-[#cfc6b8] focus:border-[#18181b] focus:ring-1 focus:ring-[#18181b] outline-none text-[#18181b] bg-[#faf8f5] resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#443e37] mb-1">
                  Método de Pago al Recibir
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className={`p-2.5 rounded-lg border text-center cursor-pointer flex items-center justify-center gap-1.5 transition-all ${
                    formData.paymentMethod === "efectivo_divisas"
                      ? "border-[#18181b] bg-[#18181b] text-white font-bold"
                      : "border-[#cfc6b8] bg-[#faf8f5] text-[#5c5449]"
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="efectivo_divisas"
                      checked={formData.paymentMethod === "efectivo_divisas"}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    💵 Divisas al Recibir
                  </label>

                  <label className={`p-2.5 rounded-lg border text-center cursor-pointer flex items-center justify-center gap-1.5 transition-all ${
                    formData.paymentMethod === "pago_movil"
                      ? "border-[#18181b] bg-[#18181b] text-white font-bold"
                      : "border-[#cfc6b8] bg-[#faf8f5] text-[#5c5449]"
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="pago_movil"
                      checked={formData.paymentMethod === "pago_movil"}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    📲 Pago Móvil
                  </label>
                </div>
              </div>

              {errorMessage && (
                <p className="text-rose-600 text-[11px] font-bold">{errorMessage}</p>
              )}

              {/* Resumen Total */}
              <div className="bg-[#f4efe8] p-3 rounded-xl border border-[#e4ded3] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#736a5f] uppercase tracking-wider block">Total a pagar al recibir:</span>
                  <strong className="text-lg text-[#18181b] font-black">${selectedPack.price} USD</strong>
                </div>
                <span className="text-[10px] text-emerald-800 bg-[#eef5ee] border border-[#d2e4d0] px-2 py-0.5 rounded-full font-bold uppercase">
                  Envío Gratis Incluido
                </span>
              </div>

              <button
                type="submit"
                disabled={formStatus === "submitting"}
                className="w-full bg-[#18181b] hover:bg-black disabled:opacity-50 text-white font-black text-xs sm:text-sm py-3.5 rounded-xl transition-all shadow-md uppercase tracking-wider animate-cta-shimmer cursor-pointer"
              >
                {formStatus === "submitting" ? "Procesando solicitud..." : "Confirmar Pedido (Pagas al Recibir)"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODALES LEGALES */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#e0d8cc] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl relative text-[#221e1a]">
            <button
              onClick={() => setActiveLegalModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f4efe8] hover:bg-[#eae3d7] text-[#443e37] flex items-center justify-center text-sm font-bold cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-base font-serif font-black text-[#18181b]">
              {activeLegalModal === "privacy" && "Política de Privacidad y Confidencialidad"}
              {activeLegalModal === "shipping" && "Información de Despachos Tealca"}
              {activeLegalModal === "guide" && "Guía de Consumo y Recomendaciones"}
            </h3>
            <p className="text-xs text-[#5c5449] leading-relaxed">
              {activeLegalModal === "privacy" &&
                "Tus datos personales y de contacto se utilizan exclusivamente para coordinar el envío de tu paquete por Tealca. Tus datos nunca se comparten con terceros y tu paquete viaja en empaque 100% neutro y confidencial."}
              {activeLegalModal === "shipping" &&
                "Los despachos se realizan a nivel nacional a través de Tealca hacia tu dirección de residencia o para retirar en la agencia Tealca más cercana de tu ciudad. El envío es 100% gratuito en todas las presentaciones."}
              {activeLegalModal === "guide" &&
                "Mastica 1 o 2 gomitas unos 30 a 45 minutos antes del momento deseado o durante el día para mantener energía constante. Conservar en un lugar fresco y seco, lejos del calor excesivo. No recomendado para menores de 18 años ni mujeres embarazadas."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
