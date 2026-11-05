"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { PRODUCT_BUNDLES, DEFAULT_BUNDLE, ProductBundle, money } from "@/lib/product";

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
    alt: "Gummies Viking Borojó y Chontaduro - Empaque Oficial Individual 2 Gomitas",
    tag: "EMPAQUE ORIGINAL"
  },
  {
    src: "/viking/viking_pouch_with_gummies.jpg",
    alt: "Gummies Viking con 2 Gomitas en Forma de León - Rosa y Cyan",
    tag: "2 GOMITAS EN FORMA DE LEÓN"
  },
  {
    src: "/viking/viking_pouch_real_table.jpg",
    alt: "Presentación Real Gummies Viking en Mano",
    tag: "FOTO REAL EN MANO"
  }
];

export default function VikingLanding() {
  const [selectedPack, setSelectedPack] = useState<ProductBundle>(DEFAULT_BUNDLE);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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

  // Pop-up 5s
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [hasShownDiscountModal, setHasShownDiscountModal] = useState(false);
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
    if (touchStartX.current - touchEndX.current > 50) {
      setCurrentSlide((prev) => (prev + 1) % GALLERY_IMAGES.length);
    }
    if (touchStartX.current - touchEndX.current < -50) {
      setCurrentSlide((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Sticky Bar en móvil
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

  // Meta Pixel ViewContent
  useEffect(() => {
    if (typeof window !== "undefined" && (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
      (window as unknown as { fbq: (...args: unknown[]) => void }).fbq("track", "ViewContent", {
        content_name: "Gummies Viking Borojó & Chontaduro",
        content_category: "Vitalidad y Pareja",
        content_ids: ["gummies_viking_2pack"],
        value: 25.00,
        currency: "USD"
      });
    }
  }, []);

  // Pop-up a los 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasShownDiscountModal && !isCheckoutOpen) {
        setShowDiscountModal(true);
        setHasShownDiscountModal(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [hasShownDiscountModal, isCheckoutOpen]);

  const openCheckout = (pack = selectedPack) => {
    setSelectedPack(pack);
    setIsCheckoutOpen(true);
    if (typeof window !== "undefined" && (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
      (window as unknown as { fbq: (...args: unknown[]) => void }).fbq("track", "InitiateCheckout", {
        content_name: pack.name,
        content_ids: [pack.id],
        value: pack.price,
        currency: "USD"
      });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.cityAddress.trim()) {
      setErrorMessage("Por favor completa tu nombre, teléfono y dirección o agencia Tealca.");
      return;
    }

    setFormStatus("submitting");
    setErrorMessage("");

    try {
      const eventId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `order_${Date.now()}`;

      const paymentLabel =
        formData.paymentMethod === "pagomovil"
          ? "Pago Móvil (Bs a tasa oficial)"
          : formData.paymentMethod === "binance_usdt"
          ? "Binance USDT (15% OFF)"
          : "Dólares en Efectivo ($)";

      const cleanState = formData.state.split("(")[0].trim();
      const messageLines = [
        "*SOLICITUD DE PEDIDO - GUMMIES VIKING VENEZUELA*",
        "------------------------------------",
        "*DETALLE DEL COMBO:*",
        `- Producto: Gummies Viking (Borojó & Chontaduro)`,
        `- Pack: ${selectedPack.name}`,
        `- Cantidad: ${selectedPack.quantity} ${selectedPack.quantity === 1 ? 'Sobre' : 'Sobres'} (${selectedPack.gummies} Gomitas Masticables)`,
        `- Total a Pagar: $${selectedPack.price.toFixed(2)} USD`,
        `- Despacho: ${selectedPack.hasFreeShipping ? 'ENVÍO GRATIS POR TEALCA' : 'Flete cobro en destino por Tealca'}`,
        "",
        "*DATOS PARA EL ENVÍO PRIVADO:*",
        `- Cliente: ${formData.fullName.trim()}`,
        `- Teléfono: ${formData.phone.trim()}`,
        `- Estado: ${cleanState}`,
        `- Dirección o Agencia Tealca: ${formData.cityAddress.trim()}`,
        `- Método de Pago al Recibir: ${paymentLabel}`,
        ...(formData.notes?.trim() ? [`- Nota: ${formData.notes.trim()}`] : []),
        "",
        "------------------------------------",
        "*MODALIDAD:* PAGO AL RECIBIR POR TEALCA",
        "Empaque 100% sellado y neutro (sobre ciego sin referencias exteriores).",
        "",
        "Hola, acabo de llenar mis datos en la web para pedir mis Gummies Viking. ¿Me confirman para coordinar el despacho por Tealca?"
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
      }, 300);
    } catch {
      setErrorMessage("Ocurrió un error. Escríbenos directamente al WhatsApp.");
      setFormStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#090b0e] text-slate-100 font-sans selection:bg-[#ff2d78] selection:text-white pb-24 md:pb-12">
      {/* 1. TOP MARQUEE BANNER DE URGENCIA */}
      <div className="bg-gradient-to-r from-[#ff007f] via-[#7928ca] to-[#00d4ff] text-white py-2 px-3 text-center text-xs md:text-sm font-black uppercase tracking-wider shadow-md overflow-hidden flex items-center justify-center gap-2">
        <span className="animate-pulse">🔥</span>
        <span>MÁS DE 1.000 PARES EN ALMACÉN NACIONAL • ENVÍO GRATIS EN COMBOS • PAGA EN CASA POR TEALCA</span>
        <span className="hidden sm:inline">🇻🇪</span>
      </div>

      {/* 2. HEADER MINIMALISTA DE MARCA */}
      <header className="border-b border-white/10 bg-[#0d1017]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff007f] to-[#00d4ff] flex items-center justify-center text-lg shadow-lg shadow-pink-500/20">
              👑
            </span>
            <div>
              <span className="font-black text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400 block leading-none">
                GUMMIES VIKING
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                Borojó & Chontaduro • 02 Gummies
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Almacén Nacional 🇻🇪
            </span>
          </div>
        </div>
      </header>

      {/* 3. HERO & PRODUCT PRESENTATION */}
      <main className="max-w-4xl mx-auto px-4 pt-4 md:pt-8 space-y-6">
        {/* TITULAR Y SUBTÍTULO */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pink-500/10 border border-pink-500/30 text-pink-300">
            <span>✨</span> Edición Especial Parejas • Sabor Frutal Vigorizante
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Enciende la Química de tus Noches con{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-300 to-cyan-400">
              Gummies Viking
            </span>
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Gomitas masticables de gelatina con extractos naturales de <strong>Borojó y Chontaduro</strong>. Diseñadas para disfrutar en pareja 30 minutos antes de la cita.
          </p>
        </div>

        {/* CARRUSEL DE FOTOS REALES */}
        <div className="relative max-w-md mx-auto">
          <div
            className="relative aspect-4/5 w-full rounded-2xl overflow-hidden bg-[#151922] border-2 border-white/10 shadow-2xl"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={GALLERY_IMAGES[currentSlide].src}
              alt={GALLERY_IMAGES[currentSlide].alt}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 450px"
            />
            {/* Tag flotante */}
            <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/20">
              {GALLERY_IMAGES[currentSlide].tag}
            </div>

            {/* Flechas de navegación */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length)}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-xs cursor-pointer border border-white/15"
              aria-label="Anterior"
            >
              ‹
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % GALLERY_IMAGES.length)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-xs cursor-pointer border border-white/15"
              aria-label="Siguiente"
            >
              ›
            </button>
          </div>

          {/* Miniaturas de fotos */}
          <div className="flex justify-center gap-2 mt-3">
            {GALLERY_IMAGES.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  currentSlide === idx ? "border-[#ff007f] scale-105 shadow-md shadow-pink-500/30" : "border-white/15 opacity-60"
                }`}
              >
                <Image src={img.src} alt={img.alt} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* 4. BENEFICIOS CLAVE EN 3 TARJETAS COMPACTAS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-[#121620] p-3.5 rounded-xl border border-white/10 flex items-center gap-3">
            <span className="text-2xl p-2 rounded-lg bg-pink-500/15 border border-pink-500/30">🦁</span>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Borojó & Chontaduro</h3>
              <p className="text-[11px] text-slate-300">Extractos naturales de máxima vitalidad y resistencia.</p>
            </div>
          </div>

          <div className="bg-[#121620] p-3.5 rounded-xl border border-white/10 flex items-center gap-3">
            <span className="text-2xl p-2 rounded-lg bg-cyan-500/15 border border-cyan-500/30">🔒</span>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Sobre 100% Ciego</h3>
              <p className="text-[11px] text-slate-300">Empaque neutro sin referencias ni logos externos.</p>
            </div>
          </div>

          <div className="bg-[#121620] p-3.5 rounded-xl border border-white/10 flex items-center gap-3">
            <span className="text-2xl p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30">🇻🇪</span>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Paga al Recibir</h3>
              <p className="text-[11px] text-slate-300">Tealca contra entrega en efectivo o Pago Móvil.</p>
            </div>
          </div>
        </div>

        {/* 5. SELECTOR DE OFERTAS Y COMBOS (DECOY EFFECT) */}
        <section className="bg-[#11141c] p-4 md:p-6 rounded-2xl border-2 border-white/10 shadow-xl space-y-4">
          <div className="text-center space-y-1">
            <span className="text-xs font-black text-pink-400 uppercase tracking-widest">Paso 1: Elige tu Combo</span>
            <h2 className="text-xl md:text-2xl font-black text-white">Selecciona tu Paquete de Gummies Viking</h2>
          </div>

          <div className="space-y-3">
            {PRODUCT_BUNDLES.map((pack) => {
              const isSelected = selectedPack.id === pack.id;
              return (
                <div
                  key={pack.id}
                  onClick={() => setSelectedPack(pack)}
                  className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-cyan-950/40 border-[#ff007f] shadow-lg shadow-pink-500/20 scale-[1.01]"
                      : "bg-[#161a24] border-white/10 hover:border-white/20"
                  }`}
                >
                  {pack.recommended && (
                    <span className="absolute -top-3 right-4 bg-gradient-to-r from-[#ff007f] to-[#00d4ff] text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
                      {pack.badge}
                    </span>
                  )}

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected ? "border-[#ff007f] bg-[#ff007f]" : "border-slate-500"
                        }`}
                      >
                        {isSelected && <span className="w-2 h-2 rounded-full bg-white"></span>}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm md:text-base text-white flex items-center gap-2">
                          {pack.name}
                        </h3>
                        <p className="text-xs text-slate-300">
                          {pack.quantity} {pack.quantity === 1 ? "Sobre individual" : "Sobres"} • {pack.gummies} Gomitas masticables
                        </p>
                        <span className="text-[11px] font-bold text-pink-400 block mt-0.5">
                          {pack.savings}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-baseline gap-1.5 justify-end">
                        <span className="text-xs text-slate-400 line-through">
                          {money(pack.regularPrice)}
                        </span>
                        <span className="text-xl md:text-2xl font-black text-white">
                          {money(pack.price)}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase block ${pack.hasFreeShipping ? "text-emerald-400" : "text-amber-400"}`}>
                        {pack.hasFreeShipping ? "Envío 100% Gratis" : "+ Flete cobro en destino"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* BOTÓN PRINCIPAL DE COMPRA */}
          <div ref={ctaButtonRef} className="pt-2">
            <button
              onClick={() => openCheckout()}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ff007f] via-[#d9006c] to-[#00d4ff] text-white font-black text-base md:text-lg uppercase tracking-wider shadow-xl shadow-pink-500/25 hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>¡PEDIR Y PAGAR AL RECIBIR POR TEALCA!</span>
              <span>→</span>
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2">
              🛡️ No pagas nada por adelantado • Pagas en efectivo o Pago Móvil en mano
            </p>
          </div>
        </section>

        {/* 6. GUÍA DE USO Y PREGUNTAS FRECUENTES */}
        <section className="bg-[#11141c] p-4 md:p-6 rounded-2xl border border-white/10 space-y-4">
          <h2 className="text-lg font-black text-white text-center">
            Todo lo que necesitas saber antes de pedir
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-[#161a24] p-3.5 rounded-xl border border-white/10 space-y-1">
              <h3 className="font-bold text-pink-300">¿Cómo y cuándo consumirlas?</h3>
              <p className="text-slate-300 leading-relaxed">
                Consume 1 o 2 gomitas masticables entre <strong>30 y 45 minutos antes</strong> de la cita. Su textura de gelatina permite una asimilación rápida.
              </p>
            </div>

            <div className="bg-[#161a24] p-3.5 rounded-xl border border-white/10 space-y-1">
              <h3 className="font-bold text-cyan-300">¿El empaque es discreto?</h3>
              <p className="text-slate-300 leading-relaxed">
                <strong>100% discreto.</strong> El paquete llega en un sobre neutro totalmente sellado, sin leyendas, logos ni referencias al contenido exterior.
              </p>
            </div>

            <div className="bg-[#161a24] p-3.5 rounded-xl border border-white/10 space-y-1">
              <h3 className="font-bold text-amber-300">¿Cuánto tarda en llegar por Tealca?</h3>
              <p className="text-slate-300 leading-relaxed">
                Despachamos desde el almacén central. El tiempo promedio de entrega a agencias o domicilio Tealca en Venezuela es de <strong>24 a 72 horas hábiles</strong>.
              </p>
            </div>

            <div className="bg-[#161a24] p-3.5 rounded-xl border border-white/10 space-y-1">
              <h3 className="font-bold text-emerald-300">¿Cómo realizo el pago?</h3>
              <p className="text-slate-300 leading-relaxed">
                Pagas únicamente cuando recibas el paquete en tus manos en Tealca: en dólares en efectivo, Pago Móvil (a tasa oficial) o por Binance USDT.
              </p>
            </div>
          </div>
        </section>

        {/* 7. FOOTER Y POLÍTICAS */}
        <footer className="border-t border-white/10 pt-6 text-center text-xs text-slate-500 space-y-3">
          <p>
            © {new Date().getFullYear()} Gummies Viking Venezuela. Suplemento alimenticio natural a base de Borojó y Chontaduro.
          </p>
          <div className="flex justify-center gap-4 text-[11px] text-slate-400">
            <button onClick={() => setActiveLegalModal("privacy")} className="hover:underline cursor-pointer">
              Privacidad y Discreción
            </button>
            <span>•</span>
            <button onClick={() => setActiveLegalModal("shipping")} className="hover:underline cursor-pointer">
              Envíos por Tealca
            </button>
            <span>•</span>
            <button onClick={() => setActiveLegalModal("guide")} className="hover:underline cursor-pointer">
              Guía de Consumo
            </button>
          </div>
        </footer>
      </main>

      {/* 8. STICKY DOCK EN MÓVIL */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d1017]/95 backdrop-blur-md border-t border-white/15 p-3 md:hidden shadow-2xl">
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div>
              <span className="text-[10px] text-pink-400 font-bold uppercase block leading-none">
                {selectedPack.name}
              </span>
              <span className="text-lg font-black text-white leading-tight">
                {money(selectedPack.price)}
              </span>
              <span className="text-[9px] text-slate-400 block">
                {selectedPack.hasFreeShipping ? "Envío Gratis Incluido" : "+ Flete en destino"}
              </span>
            </div>
            <button
              onClick={() => openCheckout()}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#ff007f] to-[#00d4ff] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-pink-500/20 active:scale-95 transition-all cursor-pointer text-center"
            >
              Pedir · Paga al Recibir →
            </button>
          </div>
        </div>
      )}

      {/* 9. MODAL DE CHECKOUT / PEDIDO */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-backdrop-fade">
          <div className="bg-[#11141c] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border-2 border-pink-500/40 p-5 space-y-4 relative animate-modal-pop max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white text-lg font-bold w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            <div className="border-b border-white/10 pb-3">
              <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest block">
                Solicitud Contra Entrega Tealca
              </span>
              <h3 className="text-lg font-black text-white">
                Completa tus datos de entrega
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Paquete: <strong className="text-white">{selectedPack.name}</strong> • Total: <strong className="text-pink-400">{money(selectedPack.price)}</strong> {selectedPack.hasFreeShipping ? "(Envío Gratis)" : "(Flete en destino)"}
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nombre y Apellido *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Alejandro Pérez"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-[#181d28] border border-white/15 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-hidden focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Teléfono WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="Ej: 0412 1234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#181d28] border border-white/15 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-hidden focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Estado de Entrega *</label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-[#181d28] border border-white/15 rounded-lg p-2.5 text-white focus:outline-hidden focus:border-pink-500"
                >
                  {VENEZUELA_STATES.map((st) => (
                    <option key={st} value={st} className="bg-[#181d28] text-white">
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Dirección exacta o Agencia Tealca preferida *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Tealca Las Mercedes, Caracas o Urb. El Rosal calle 4"
                  value={formData.cityAddress}
                  onChange={(e) => setFormData({ ...formData, cityAddress: e.target.value })}
                  className="w-full bg-[#181d28] border border-white/15 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-hidden focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Método de Pago al Recibir *</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full bg-[#181d28] border border-white/15 rounded-lg p-2.5 text-white focus:outline-hidden focus:border-pink-500"
                >
                  <option value="efectivo_divisas">Dólares en Efectivo ($)</option>
                  <option value="pagomovil">Pago Móvil (Bs a tasa oficial BCV)</option>
                  <option value="binance_usdt">Binance USDT (15% Descuento Especial)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Nota o punto de referencia (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: Entregar en horario de oficina"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-[#181d28] border border-white/15 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-hidden focus:border-pink-500"
                />
              </div>

              {errorMessage && (
                <p className="text-pink-400 font-bold text-xs bg-pink-950/40 border border-pink-500/30 p-2 rounded-lg">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={formStatus === "submitting"}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ff007f] via-[#d9006c] to-[#00d4ff] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-pink-500/30 hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
              >
                {formStatus === "submitting" ? "Procesando Pedido..." : `SOLICITAR PEDIDO (${money(selectedPack.price)}) →`}
              </button>

              <p className="text-center text-[10px] text-slate-400">
                🔒 Tus datos se usan exclusivamente para coordinar el despacho con Tealca.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* 10. POP-UP DE CORTESÍA A LOS 5 SEGUNDOS */}
      {showDiscountModal && !isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-backdrop-fade">
          <div className="bg-[#11141c] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border-2 border-pink-500/40 p-5 space-y-4 relative animate-modal-pop">
            <button
              onClick={() => setShowDiscountModal(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white text-lg font-bold w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center space-y-1.5 pt-1">
              <span className="inline-block bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                🎁 PROMO ESTRELLA VENEZUELA
              </span>
              <h3 className="text-lg md:text-xl font-black text-white leading-tight">
                ¡Lleva 3 Sobres por solo $25 y Envío Gratis!
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Asegura <strong>3 citas completas</strong> (6 gomitas masticables). Te ahorras $20 de producto y el flete por Tealca corre 100% por nuestra cuenta.
              </p>
            </div>

            <div className="bg-[#181d28] p-3.5 rounded-xl border border-white/15 space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-xs text-white block">Combo 3 Sobres (6 Gomitas)</span>
                  <span className="text-[11px] text-pink-400 font-semibold">Envío 100% Gratis por Tealca</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 line-through block">$45.00</span>
                  <span className="text-lg font-black text-white">$25.00</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowDiscountModal(false);
                openCheckout(PRODUCT_BUNDLES[0]);
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ff007f] to-[#00d4ff] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-pink-500/30 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
            >
              ¡APROVECHAR 3 SOBRES X $25 Y PEDIR!
            </button>
          </div>
        </div>
      )}

      {/* 11. MODALES LEGALES */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#11141c] w-full max-w-lg rounded-2xl p-5 border border-white/15 space-y-3 relative text-xs text-slate-300 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveLegalModal(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white font-bold w-7 h-7 rounded-full bg-white/10 flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-base font-bold text-white">
              {activeLegalModal === "privacy" && "Privacidad y Discreción Total"}
              {activeLegalModal === "shipping" && "Política de Envíos Tealca"}
              {activeLegalModal === "guide" && "Guía de Consumo Responsable"}
            </h3>
            {activeLegalModal === "privacy" && (
              <p>
                Todos los pedidos se despachan en empaque completamente neutro (sobre ciego sellado o caja sin rotulación exterior). Nadie sabrá qué contiene el paquete hasta que tú lo abras. Tus datos personales son tratados con estricta confidencialidad.
              </p>
            )}
            {activeLegalModal === "shipping" && (
              <p>
                Los despachos se realizan a través de Tealca a agencias u oficinas autorizadas a nivel nacional. El cliente paga al momento de retirar su paquete en efectivo o Pago Móvil. Los combos de 3 y 5 sobres incluyen el costo del flete nacional.
              </p>
            )}
            {activeLegalModal === "guide" && (
              <p>
                Gummies Viking es un suplemento alimenticio en gomitas masticables elaborado a base de borojó y chontaduro. Se recomienda consumir 1 o 2 unidades 30 a 45 minutos antes de la actividad. No consumir en exceso. Manténgase en lugar fresco y seco.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
