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
    src: "/viking/viking_bottle_splash.jpg",
    alt: "Gummies Viking Borojó y Chontaduro - Pote 30 Gomitas",
    tag: "POTE 30 GOMITAS"
  },
  {
    src: "/viking/viking_pouch_front.jpg",
    alt: "Gummies Viking Sobre Individual 2 Gomitas",
    tag: "SOBRES INDIVIDUALES"
  },
  {
    src: "/viking/viking_pouch_with_gummies.jpg",
    alt: "Gomitas en Forma de León - Rosa y Azul",
    tag: "GOMITAS LEÓN EN PAREJA"
  },
  {
    src: "/viking/viking_bottle_benefits.jpg",
    alt: "Fórmula de Energía y Vitalidad Gummies Viking",
    tag: "BENEFICIOS ACTIVOS"
  },
  {
    src: "/viking/viking_pouch_real_table.jpg",
    alt: "Textura Real en Mano",
    tag: "FOTO REAL EN MANO"
  }
];

export default function VikingLanding() {
  const [selectedPack, setSelectedPack] = useState<ProductBundle>(DEFAULT_BUNDLE);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

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
    if (touchStartX.current - touchEndX.current > 40) {
      setCurrentSlide((prev) => (prev + 1) % GALLERY_IMAGES.length);
    }
    if (touchStartX.current - touchEndX.current < -40) {
      setCurrentSlide((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Sticky Bar inteligente en móvil
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
        content_ids: ["gummies_viking"],
        value: 25,
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
          ? "Binance USDT"
          : "Dólares en Efectivo ($)";

      const cleanState = formData.state.split("(")[0].trim();
      const messageLines = [
        "*SOLICITUD DE PEDIDO - GUMMIES VIKING VENEZUELA*",
        "------------------------------------",
        "*PRESENTACIÓN SELECCIONADA:*",
        `- Opción: ${selectedPack.name}`,
        `- Presentación: ${selectedPack.unitLabel}`,
        `- Contenido: ${selectedPack.gummies} Gomitas Masticables`,
        `- Total a Pagar: $${selectedPack.price} USD`,
        `- Flete: ENVÍO 100% GRATIS POR TEALCA`,
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
        "Empaque 100% neutro y sellado (sin marcas exteriores).",
        "",
        "Hola, acabo de llenar mis datos en la página web para pedir mis Gummies Viking. ¿Me confirman para coordinar el despacho por Tealca?"
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
    <div className="min-h-screen bg-[#0d0e12] text-slate-100 font-sans selection:bg-[#ff007f] selection:text-white pb-28 md:pb-12">
      {/* 1. BARRA SUPERIOR PLANA Y COLORIDA */}
      <div className="bg-[#ffe600] text-black font-black text-[11px] md:text-xs py-2 px-3 text-center uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 border-black">
        <span>⚡</span>
        <span>ENVÍO GRATIS A TODA VENEZUELA POR TEALCA • PAGA EN CASA AL RECIBIR</span>
        <span>🇻🇪</span>
      </div>

      {/* 2. HEADER PLANO MINIMALISTA */}
      <header className="bg-[#13151c] border-b border-slate-800 px-4 py-3 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 bg-[#ff007f] text-white flex items-center justify-center font-black rounded text-sm">
              👑
            </span>
            <span className="font-black text-base md:text-lg tracking-wide text-white uppercase">
              Gummies Viking
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              Pago Contra Entrega
            </span>
          </div>
        </div>
      </header>

      {/* 3. CONTENIDO PRINCIPAL MÓVIL DIRECTO */}
      <main className="max-w-xl mx-auto px-4 pt-4 space-y-5">
        {/* TITULAR Y SUBTÍTULO DIRECTOS */}
        <div className="space-y-1.5">
          <div className="inline-block bg-[#00f0ff] text-black text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wide">
            Borojó + Chontaduro Natural
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white leading-tight uppercase tracking-tight">
            Gomitas Vigorizantes para Parejas
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Energía, resistencia y química activa para tus momentos en pareja. Delicioso sabor frutal, textura masticable y efecto rápido en 30 minutos.
          </p>
        </div>

        {/* CARRUSEL PLANO DE FOTOS */}
        <div className="space-y-2.5">
          <div
            className="relative aspect-square w-full bg-[#181a24] border-2 border-slate-800 rounded-lg overflow-hidden"
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
              sizes="(max-width: 640px) 100vw, 550px"
            />
            {/* Tag plano */}
            <div className="absolute top-2.5 left-2.5 bg-black text-[#00f0ff] border border-[#00f0ff] text-[9px] font-black uppercase px-2 py-0.5 rounded">
              {GALLERY_IMAGES[currentSlide].tag}
            </div>

            {/* Flechas planas */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/80 text-white font-bold flex items-center justify-center border border-white/20 rounded cursor-pointer"
              aria-label="Anterior"
            >
              ‹
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % GALLERY_IMAGES.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/80 text-white font-bold flex items-center justify-center border border-white/20 rounded cursor-pointer"
              aria-label="Siguiente"
            >
              ›
            </button>
          </div>

          {/* Miniaturas planas */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {GALLERY_IMAGES.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`relative w-14 h-14 shrink-0 rounded border-2 transition-all cursor-pointer ${
                  currentSlide === idx ? "border-[#ff007f] opacity-100" : "border-slate-800 opacity-50"
                }`}
              >
                <Image src={img.src} alt={img.alt} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* 4. BLOQUES PLANOS DE BENEFICIOS (SIN GLOBOS NI DEGRADADOS EXCESIVOS) */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-[#141620] border border-slate-800 p-2.5 rounded">
            <span className="text-[#ff007f] font-black block text-[11px] uppercase">⚡ Efecto en 30 Minutos</span>
            <p className="text-[11px] text-slate-300 mt-0.5">Asimilación rápida masticable.</p>
          </div>

          <div className="bg-[#141620] border border-slate-800 p-2.5 rounded">
            <span className="text-[#00f0ff] font-black block text-[11px] uppercase">👑 Borojó & Chontaduro</span>
            <p className="text-[11px] text-slate-300 mt-0.5">Extractos naturales energéticos.</p>
          </div>

          <div className="bg-[#141620] border border-slate-800 p-2.5 rounded">
            <span className="text-[#ffe600] font-black block text-[11px] uppercase">🔒 Paquete 100% Ciego</span>
            <p className="text-[11px] text-slate-300 mt-0.5">Sobre neutro sin marcas exteriores.</p>
          </div>

          <div className="bg-[#141620] border border-slate-800 p-2.5 rounded">
            <span className="text-emerald-400 font-black block text-[11px] uppercase">🇻🇪 Paga al Recibir</span>
            <p className="text-[11px] text-slate-300 mt-0.5">Efectivo o Pago Móvil por Tealca.</p>
          </div>
        </div>

        {/* 5. SELECTOR DE PRESENTACIONES Y PRECIOS REDONDOS CON ENVÍO GRATIS */}
        <section className="bg-[#141722] border-2 border-slate-700 rounded-lg p-3.5 md:p-4 space-y-3">
          <div>
            <span className="text-[10px] font-black uppercase text-[#00f0ff] tracking-widest block">
              Paso 1: Elige tu Presentación
            </span>
            <h2 className="text-base md:text-lg font-black text-white uppercase">
              Opciones con Envío Gratis Incluido
            </h2>
          </div>

          <div className="space-y-2.5">
            {PRODUCT_BUNDLES.map((pack) => {
              const isSelected = selectedPack.id === pack.id;
              return (
                <div
                  key={pack.id}
                  onClick={() => setSelectedPack(pack)}
                  className={`relative p-3 rounded-lg border-2 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#1c2030] border-[#ff007f]"
                      : "bg-[#10121a] border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {/* Badge plano de esquina */}
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                        pack.recommended
                          ? "bg-[#ff007f] text-white"
                          : pack.id === "pack_frasco_30"
                          ? "bg-[#00f0ff] text-black"
                          : "bg-slate-700 text-slate-200"
                      }`}
                    >
                      {pack.badge}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">
                      Envío Gratis
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? "border-[#ff007f] bg-[#ff007f]" : "border-slate-600"
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                      </div>
                      <div>
                        <h3 className="font-black text-sm text-white">
                          {pack.name}
                        </h3>
                        <p className="text-[11px] text-slate-300">
                          {pack.unitLabel} • <span className="text-slate-400">{pack.perDose}</span>
                        </p>
                        <p className="text-[10px] font-bold text-pink-400 mt-0.5">
                          {pack.savings}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-slate-500 line-through block">
                        {money(pack.regularPrice)}
                      </span>
                      <span className="text-2xl font-black text-white">
                        {money(pack.price)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* BOTÓN PRINCIPAL DE COMPRA */}
          <div ref={ctaButtonRef} className="pt-1">
            <button
              onClick={() => openCheckout()}
              className="w-full py-3.5 bg-[#ff007f] hover:bg-[#e0006f] text-white font-black text-sm md:text-base uppercase tracking-wider rounded-lg border-2 border-black active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[2px_2px_0px_#000]"
            >
              <span>PEDIR {selectedPack.name} ({money(selectedPack.price)})</span>
              <span>→</span>
            </button>
            <p className="text-center text-[10px] text-slate-400 mt-1.5">
              🛡️ No pagas nada por adelantado • Pagas en efectivo o Pago Móvil en mano
            </p>
          </div>
        </section>

        {/* 6. GUÍA DE USO Y PREGUNTAS CLAVE */}
        <section className="bg-[#141722] border border-slate-800 rounded-lg p-3.5 space-y-2.5 text-xs">
          <h2 className="font-black text-white text-sm uppercase">Preguntas Frecuentes</h2>

          <div className="space-y-2">
            <div className="border-b border-slate-800 pb-2">
              <strong className="text-[#00f0ff] block text-xs">¿Cómo se consumen?</strong>
              <p className="text-slate-300 text-[11px] mt-0.5">
                Consume 1 o 2 gomitas masticables entre 30 y 45 minutos antes de la cita.
              </p>
            </div>

            <div className="border-b border-slate-800 pb-2">
              <strong className="text-[#ffe600] block text-xs">¿El empaque es discreto?</strong>
              <p className="text-slate-300 text-[11px] mt-0.5">
                Totalmente discreto. Sobre neutro sellado sin leyendas ni fotos exteriores.
              </p>
            </div>

            <div>
              <strong className="text-emerald-400 block text-xs">¿Cómo se paga al recibir?</strong>
              <p className="text-slate-300 text-[11px] mt-0.5">
                Pagas al retirar en Tealca: dólares en efectivo o Pago Móvil a tasa oficial.
              </p>
            </div>
          </div>
        </section>

        {/* 7. FOOTER */}
        <footer className="border-t border-slate-800 pt-4 text-center text-[11px] text-slate-500 space-y-2">
          <p>© {new Date().getFullYear()} Gummies Viking Venezuela • Borojó & Chontaduro</p>
          <div className="flex justify-center gap-3 text-slate-400">
            <button onClick={() => setActiveLegalModal("privacy")} className="hover:underline cursor-pointer">
              Privacidad y Discreción
            </button>
            <span>•</span>
            <button onClick={() => setActiveLegalModal("shipping")} className="hover:underline cursor-pointer">
              Envíos Tealca
            </button>
            <span>•</span>
            <button onClick={() => setActiveLegalModal("guide")} className="hover:underline cursor-pointer">
              Uso Responsable
            </button>
          </div>
        </footer>
      </main>

      {/* 8. STICKY DOCK EN MÓVIL (PLANO Y DIRECTO) */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#13151c] border-t-2 border-slate-700 p-2.5 md:hidden">
          <div className="flex items-center justify-between gap-2.5 max-w-md mx-auto">
            <div>
              <span className="text-[10px] text-[#00f0ff] font-black uppercase block leading-none">
                {selectedPack.name}
              </span>
              <span className="text-lg font-black text-white leading-tight">
                {money(selectedPack.price)}
              </span>
              <span className="text-[9px] text-emerald-400 font-bold block">
                Envío Gratis
              </span>
            </div>
            <button
              onClick={() => openCheckout()}
              className="flex-1 py-3 bg-[#ff007f] hover:bg-[#e0006f] text-white font-black text-xs uppercase tracking-wider rounded border border-black cursor-pointer text-center"
            >
              Pedir Ahora · Paga en Mano →
            </button>
          </div>
        </div>
      )}

      {/* 9. MODAL DE CHECKOUT PLANO */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85">
          <div className="bg-[#141722] w-full max-w-md rounded-lg border-2 border-slate-600 p-4 space-y-3 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white font-bold w-7 h-7 bg-slate-800 rounded flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            <div className="border-b border-slate-800 pb-2">
              <span className="text-[9px] font-black text-[#00f0ff] uppercase tracking-widest block">
                Pago Contra Entrega Tealca
              </span>
              <h3 className="text-base font-black text-white">
                Datos de Entrega
              </h3>
              <p className="text-xs text-slate-300">
                Opción: <strong className="text-white">{selectedPack.name}</strong> • Total: <strong className="text-[#ff007f]">{money(selectedPack.price)}</strong> (Envío Gratis)
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-2.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nombre y Apellido *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Alejandro Pérez"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-[#0d0e14] border border-slate-700 rounded p-2 text-white placeholder-slate-500 focus:outline-hidden focus:border-[#ff007f]"
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
                  className="w-full bg-[#0d0e14] border border-slate-700 rounded p-2 text-white placeholder-slate-500 focus:outline-hidden focus:border-[#ff007f]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Estado de Entrega *</label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-[#0d0e14] border border-slate-700 rounded p-2 text-white focus:outline-hidden focus:border-[#ff007f]"
                >
                  {VENEZUELA_STATES.map((st) => (
                    <option key={st} value={st} className="bg-[#0d0e14] text-white">
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
                  className="w-full bg-[#0d0e14] border border-slate-700 rounded p-2 text-white placeholder-slate-500 focus:outline-hidden focus:border-[#ff007f]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Método de Pago al Recibir *</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full bg-[#0d0e14] border border-slate-700 rounded p-2 text-white focus:outline-hidden focus:border-[#ff007f]"
                >
                  <option value="efectivo_divisas">Dólares en Efectivo ($)</option>
                  <option value="pagomovil">Pago Móvil (Bs a tasa oficial BCV)</option>
                  <option value="binance_usdt">Binance USDT</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Nota o punto de referencia (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: Entregar en horario de oficina"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-[#0d0e14] border border-slate-700 rounded p-2 text-white placeholder-slate-500 focus:outline-hidden focus:border-[#ff007f]"
                />
              </div>

              {errorMessage && (
                <p className="text-pink-400 font-bold text-xs bg-pink-950/40 border border-pink-500/30 p-2 rounded">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={formStatus === "submitting"}
                className="w-full py-3 bg-[#ff007f] hover:bg-[#e0006f] text-white font-black text-sm uppercase tracking-wider rounded border border-black cursor-pointer disabled:opacity-50"
              >
                {formStatus === "submitting" ? "Procesando..." : `CONFIRMAR PEDIDO (${money(selectedPack.price)}) →`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 10. POP-UP DE CORTESÍA A LOS 5 SEGUNDOS (OFERTA 3 PARES POR $25) */}
      {showDiscountModal && !isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
          <div className="bg-[#141722] w-full max-w-sm rounded-lg border-2 border-[#ff007f] p-4 space-y-3 relative shadow-[4px_4px_0px_#000]">
            <button
              onClick={() => setShowDiscountModal(false)}
              className="absolute top-2.5 right-2.5 text-slate-400 hover:text-white font-bold w-7 h-7 bg-slate-800 rounded flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center space-y-1 pt-1">
              <span className="inline-block bg-[#ff007f] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                OFERTA ESTRELLA
              </span>
              <h3 className="text-base font-black text-white leading-tight">
                ¡Lleva 3 Pares por solo $25 y Envío Gratis!
              </h3>
              <p className="text-[11px] text-slate-300">
                Por solo <strong>$4 más que 1 par</strong> ($21), te llevas 3 pares completos (6 gomitas masticables).
              </p>
            </div>

            <div className="bg-[#0f1118] p-2.5 rounded border border-slate-800 flex justify-between items-center text-xs">
              <div>
                <strong className="text-white block">Combo 3 Pares (6 Gomitas)</strong>
                <span className="text-emerald-400 font-bold text-[10px]">Envío Gratis por Tealca</span>
              </div>
              <span className="text-lg font-black text-white">$25</span>
            </div>

            <button
              onClick={() => {
                setShowDiscountModal(false);
                openCheckout(PRODUCT_BUNDLES[0]);
              }}
              className="w-full py-3 bg-[#00f0ff] hover:bg-[#00d4e0] text-black font-black text-xs uppercase tracking-wider rounded border border-black cursor-pointer"
            >
              ¡APROVECHAR 3 PARES X $25!
            </button>
          </div>
        </div>
      )}

      {/* 11. MODALES LEGALES */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
          <div className="bg-[#141722] w-full max-w-md rounded-lg p-4 border border-slate-700 space-y-2.5 text-xs text-slate-300 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveLegalModal(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white font-bold w-6 h-6 bg-slate-800 rounded flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-sm font-black text-white uppercase">
              {activeLegalModal === "privacy" && "Privacidad y Discreción"}
              {activeLegalModal === "shipping" && "Política de Envíos Tealca"}
              {activeLegalModal === "guide" && "Guía de Consumo"}
            </h3>
            {activeLegalModal === "privacy" && (
              <p>
                Todos los pedidos se despachan en empaque completamente neutro (sobre ciego sellado sin leyendas ni fotos exteriores). Máxima confidencialidad.
              </p>
            )}
            {activeLegalModal === "shipping" && (
              <p>
                Despacho nacional por Tealca. Pagas al recibir en efectivo o Pago Móvil. Todos los paquetes incluyen flete gratis.
              </p>
            )}
            {activeLegalModal === "guide" && (
              <p>
                Gummies Viking es un suplemento alimenticio en gomitas masticables elaborado con borojó y chontaduro. Consumir 1 o 2 unidades 30 a 45 minutos antes de la cita.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
