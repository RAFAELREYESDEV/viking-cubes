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
    alt: "Gummies Viking - Sobre Individual de 2 Gomitas",
    tag: "SOBRES INDIVIDUALES",
    caption: "Empaque hermético individual para llevar en el bolsillo"
  },
  {
    src: "/viking/viking_bottle_splash.jpg",
    alt: "Gummies Viking Borojó y Chontaduro - Pote 30 Gomitas",
    tag: "POTE 30 GOMITAS",
    caption: "Frasco completo para tratamiento diario continuo"
  },
  {
    src: "/viking/viking_pouch_with_gummies.jpg",
    alt: "Gomitas en Forma de León - Rosa y Azul",
    tag: "DÚO DE PAREJA",
    caption: "Textura masticable suave con extractos naturales"
  },
  {
    src: "/viking/borojo_chontaduro_fruits.jpg",
    alt: "Superfrutas Naturales: Borojó y Chontaduro",
    tag: "EXTRACTO PURO",
    caption: "Borojó amazónico y chontaduro fresco del pacífico"
  },
  {
    src: "/viking/viking_bottle_benefits.jpg",
    alt: "Fórmula de Energía y Vitalidad Gummies Viking",
    tag: "VITALIDAD & RESISTENCIA",
    caption: "Rendimiento y energía sostenida sin bajones"
  },
  {
    src: "/viking/viking_pouch_real_table.jpg",
    alt: "Gummies Viking Foto Real en Mano",
    tag: "FOTO REAL EN MANO",
    caption: "Diseño ergonómico discreto y confidencial"
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
  const [activeIngredientTab, setActiveIngredientTab] = useState<number>(0);

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
  const heroCtaRef = useRef<HTMLDivElement>(null);

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

  // Sticky Bar inteligente en scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!heroCtaRef.current) return;
      const rect = heroCtaRef.current.getBoundingClientRect();
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
        content_category: "Vitalidad y Bienestar",
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
      setErrorMessage("Por favor completa tu nombre, teléfono y dirección.");
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

      const messageLines = [
        "👑 *NUEVO PEDIDO - GUMMIES VIKING VENEZUELA*",
        "-----------------------------------",
        `*Presentación:* ${selectedPack.orderName}`,
        `*Total a pagar:* $${selectedPack.price} (PAGO EN LA ENTREGA)`,
        `*Envío:* 100% GRATIS POR TEALCA`,
        "-----------------------------------",
        `*Cliente:* ${formData.fullName.trim()}`,
        `*Teléfono:* ${formData.phone.trim()}`,
        `*Estado:* ${formData.state}`,
        `*Dirección / Agencia:* ${formData.cityAddress.trim()}`,
        `*Método de pago:* ${
          formData.paymentMethod === "efectivo_divisas"
            ? "Efectivo en Divisas al recibir"
            : "Pago Móvil al recibir"
        }`,
        formData.notes.trim() ? `*Notas:* ${formData.notes.trim()}` : "",
        "-----------------------------------",
        "Hola, acabo de registrar mi pedido en la web oficial de Gummies Viking. ¿Me confirman para coordinar el envío por Tealca?"
      ];

      const message = messageLines.filter(Boolean).join("\n");
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
      }, 700);
    } catch {
      setErrorMessage("Ocurrió un error al procesar tu solicitud. Intenta de nuevo o contáctanos por WhatsApp.");
      setFormStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-neutral-100 font-sans selection:bg-rose-500 selection:text-white relative overflow-hidden">
      {/* GLOWS AMBIENTALES DE ALTO IMPACTO (MUDAN EL FEELING ESTÁTICO A SENSORIAL PRO) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-cyan-600/15 via-rose-600/15 to-transparent blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-[1200px] right-0 w-[500px] h-[500px] bg-rose-600/10 blur-[140px] pointer-events-none -z-10" />

      {/* 1. TOP ANNOUNCEMENT BAR CON MICRO-INTERACCIÓN */}
      <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border-b border-white/[0.08] py-2 px-4 text-center text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-neutral-300">
        <div className="flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
          <span>Envío 100% Gratis a toda Venezuela • Pago en la Entrega (Tealca)</span>
        </div>
      </div>

      {/* 2. HEADER MINIMALISTA & EDITORIAL */}
      <header className="sticky top-0 z-30 bg-[#07080c]/80 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-cyan-500 p-[1px] flex items-center justify-center shadow-lg shadow-rose-500/20">
              <span className="w-full h-full bg-[#090a10] rounded-[7px] flex items-center justify-center text-xs font-black text-white">
                🦁
              </span>
            </span>
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight text-white uppercase block leading-none">
                Gummies Viking
              </span>
              <span className="text-[9px] font-bold tracking-widest text-cyan-400 uppercase">
                Borojó & Chontaduro
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-widest uppercase text-neutral-400">
            <a href="#presentaciones" className="hover:text-white transition-colors">Catálogo</a>
            <a href="#formula" className="hover:text-white transition-colors">Fórmula</a>
            <a href="#proceso" className="hover:text-white transition-colors">Pago en Entrega</a>
            <a href="#opiniones" className="hover:text-white transition-colors">Opiniones</a>
          </div>

          <div>
            <button
              onClick={() => openCheckout()}
              className="relative inline-flex items-center justify-center p-[1px] overflow-hidden rounded-full font-bold group shadow-lg shadow-rose-500/10 active:scale-95 transition-all"
            >
              <span className="w-full h-full bg-gradient-to-br from-rose-500 via-purple-500 to-cyan-500 absolute group-hover:opacity-100 opacity-70 transition-opacity" />
              <span className="relative px-4 py-2 transition-all ease-out bg-[#090a10] rounded-full group-hover:bg-opacity-0 text-white text-[11px] uppercase tracking-wider font-black">
                Pedir con Pago en Entrega
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION (EDITORIAL WOW) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 md:pt-16 pb-12 text-center relative">
        <div className="space-y-5 max-w-3xl mx-auto">
          {/* Micro-pill de status */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-neutral-300 text-[11px] font-medium tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>Fórmula Sensorial 100% Natural • Edición Parejas</span>
          </div>

          {/* Titular Grande con Gradiente Sutil */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.08] uppercase">
            Menos cansancio. <br />
            <span className="bg-gradient-to-r from-rose-400 via-fuchsia-300 to-cyan-400 bg-clip-text text-transparent">
              Más química en pareja.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto leading-relaxed font-normal">
            Gomitas masticables fortificadas con <strong>Borojó, Chontaduro, Colágeno y Vitaminas C & E</strong>.
            Diseñadas para romper la rutina laboral, elevar tu vitalidad y disfrutar al máximo sin efectos secundarios.
          </p>

          {/* Tarjeta de Obsequio Congruente con los Videos */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-rose-950/40 via-neutral-900 to-cyan-950/40 border border-white/15 max-w-lg mx-auto flex items-center gap-3 text-left shadow-xl">
            <span className="text-2xl shrink-0 p-2 rounded-lg bg-white/5 border border-white/10">🎁</span>
            <div className="text-xs">
              <span className="font-black text-rose-300 block uppercase tracking-wider text-[10px]">
                Regalo Especial Incluido Hoy
              </span>
              <p className="text-neutral-300 text-[11px] leading-tight">
                Recibe acceso a la <strong>Guía Digital: Vitalidad, Resistencia & Hábitos en Pareja</strong> + Envío 100% Gratis a toda Venezuela.
              </p>
            </div>
          </div>

          {/* Botones de Acción */}
          <div ref={heroCtaRef} className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a
              href="#presentaciones"
              className="w-full sm:w-auto bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs sm:text-sm px-8 py-3.5 rounded-xl tracking-wider uppercase transition-all shadow-xl shadow-rose-600/25 active:scale-95 animate-cta-shimmer"
            >
              Ver Presentaciones y Precios
            </a>
            <button
              onClick={() => openCheckout(PRODUCT_BUNDLES[0])}
              className="w-full sm:w-auto bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/20 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl tracking-wider uppercase transition-all active:scale-95"
            >
              Pedir 3 Pares ($25)
            </button>
          </div>
        </div>

        {/* GALERÍA INTERACTIVA DE PRODUCTO (LOOK & FEEL PROFESIONAL) */}
        <div className="mt-10 max-w-lg mx-auto">
          <div
            className="relative aspect-square w-full rounded-2xl overflow-hidden border border-white/15 bg-neutral-900/60 shadow-2xl select-none group"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={GALLERY_IMAGES[currentSlide].src}
              alt={GALLERY_IMAGES[currentSlide].alt}
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Overlay sutil */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

            {/* Badge de diapositiva */}
            <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full">
              {GALLERY_IMAGES[currentSlide].tag}
            </div>

            {/* Caption inferior */}
            <div className="absolute bottom-3 inset-x-4 text-left">
              <p className="text-xs text-neutral-200 font-medium drop-shadow-md">
                {GALLERY_IMAGES[currentSlide].caption}
              </p>
            </div>

            {/* Flechas de navegación elegantes */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-neutral-950/70 hover:bg-neutral-900 border border-white/20 text-white flex items-center justify-center text-sm font-bold shadow-lg transition-all active:scale-90"
              aria-label="Anterior"
            >
              ‹
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % GALLERY_IMAGES.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-neutral-950/70 hover:bg-neutral-900 border border-white/20 text-white flex items-center justify-center text-sm font-bold shadow-lg transition-all active:scale-90"
              aria-label="Siguiente"
            >
              ›
            </button>
          </div>

          {/* Miniaturas interactivas */}
          <div className="flex gap-2.5 mt-3.5 overflow-x-auto pb-1 justify-center">
            {GALLERY_IMAGES.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                  currentSlide === idx
                    ? "border-rose-500 ring-2 ring-rose-500/40 scale-105"
                    : "border-white/10 opacity-50 hover:opacity-80"
                }`}
              >
                <Image src={img.src} alt={img.alt} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MARQUEE INFINITO FLUIDO (EL TOQUE DINÁMICO STREETWEAR / WELLNESS) */}
      <div className="py-3 bg-neutral-950 border-y border-white/[0.08] overflow-hidden select-none">
        <div className="animate-marquee text-xs font-black tracking-widest uppercase text-neutral-400 gap-8">
          <span>✦ BOROJÓ & CHONTADURO AMAZÓNICO</span>
          <span className="text-rose-400">✦ 0% AZÚCAR AÑADIDA</span>
          <span>✦ PAGO EN LA ENTREGA VÍA TEALCA</span>
          <span className="text-cyan-400">✦ ENVÍO 100% GRATIS A TODA VENEZUELA</span>
          <span>✦ EMPAQUE 100% DISCRETO & CONFIDENCIAL</span>
          <span className="text-rose-400">✦ SIN EFECTOS SECUNDARIOS</span>
          <span>✦ BOROJÓ & CHONTADURO AMAZÓNICO</span>
          <span className="text-rose-400">✦ 0% AZÚCAR AÑADIDA</span>
          <span>✦ PAGO EN LA ENTREGA VÍA TEALCA</span>
          <span className="text-cyan-400">✦ ENVÍO 100% GRATIS A TODA VENEZUELA</span>
        </div>
      </div>

      {/* 5. SECCIÓN CATÁLOGO: PRESENTACIONES & PRECIOS REDONDOS ($25 / $21 / $45) */}
      <section id="presentaciones" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
          <span className="text-[11px] font-black uppercase tracking-widest text-cyan-400">
            Catálogo Oficial • Venezuela
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Elige tu Presentación
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Todos los combos incluyen <strong>Envío Gratis por Tealca</strong> y <strong>Pago en la Entrega</strong>.
          </p>
        </div>

        {/* GRID DE PRODUCTOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {PRODUCT_BUNDLES.map((pack) => {
            const isRecommended = pack.recommended;

            return (
              <div
                key={pack.id}
                className={`relative rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 group ${
                  isRecommended
                    ? "bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 border-rose-500/70 shadow-2xl shadow-rose-950/40 md:-translate-y-2 ring-1 ring-rose-500/40"
                    : "bg-neutral-900/40 border-white/10 hover:border-white/20 hover:bg-neutral-900/70"
                }`}
              >
                {/* Header de la tarjeta */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-wider ${
                        isRecommended
                          ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/30"
                          : pack.id === "pack_frasco_30"
                          ? "bg-cyan-950 border border-cyan-500/50 text-cyan-300"
                          : "bg-white/10 text-neutral-300"
                      }`}
                    >
                      {pack.badge}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                      Envío Gratis
                    </span>
                  </div>

                  {/* Imagen */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black/40 border border-white/10 mb-4 group-hover:border-white/25 transition-colors">
                    <Image
                      src={
                        pack.id === "pack_frasco_30"
                          ? "/viking/viking_bottle_splash.jpg"
                          : pack.id === "pack_3_pares"
                          ? "/viking/viking_pouch_with_gummies.jpg"
                          : "/viking/viking_pouch_front.jpg"
                      }
                      alt={pack.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Título y detalles */}
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">
                    {pack.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {pack.unitLabel} • <span className="text-neutral-300 font-medium">{pack.perDose}</span>
                  </p>

                  <p className="text-xs font-bold text-rose-400 mt-2 bg-rose-950/30 border border-rose-900/40 px-2.5 py-1 rounded-lg inline-block">
                    {pack.savings}
                  </p>

                  <ul className="text-xs text-neutral-300 space-y-2 mt-4 pt-4 border-t border-white/10">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓</span> Extracto puro de Borojó & Chontaduro
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓</span> 0% Azúcar (Solo 0,5 kcal)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓</span> Despacho confidencial por Tealca
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓</span> Pagas en la entrega (Cero riesgo)
                    </li>
                  </ul>
                </div>

                {/* Precios y Botón */}
                <div className="pt-6 mt-6 border-t border-white/10 space-y-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-neutral-500 line-through">
                      ${pack.regularPrice} USD
                    </span>
                    <div className="text-right">
                      <span className="text-3xl font-black text-white">
                        ${pack.price}
                      </span>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-bold">
                        USD • Pago al recibir
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => openCheckout(pack)}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-lg ${
                      isRecommended
                        ? "bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white shadow-rose-900/40 animate-cta-shimmer"
                        : "bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/15"
                    }`}
                  >
                    Pedir esta Presentación
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. SECCIÓN FÓRMULA & CIENCIA EDITORIAL */}
      <section id="formula" className="py-16 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
          <span className="text-[11px] font-black uppercase tracking-widest text-rose-400">
            Fórmula & Respaldo
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            Qué llevas por dentro, sin letra chica
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Ingredientes botánicos tradicionales combinados con micronutrientes esenciales de grado alimenticio.
          </p>
        </div>

        {/* TABS DE INGREDIENTES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-white/15 bg-neutral-900 shadow-2xl">
            <Image
              src="/viking/borojo_chontaduro_fruits.jpg"
              alt="Frutos de Borojó y Chontaduro frescos"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md p-3 rounded-xl border border-white/10">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block">
                Origen 100% Botánico
              </span>
              <p className="text-xs text-white font-bold">
                Borojó del Amazonas y Chontaduro del Pacífico Colombiano
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                icon: "🥭",
                name: "Borojó Silvestre",
                tag: "ENERGÍA & VIGOR",
                desc: "Superfruta amazónica rica en fósforo, aminoácidos y minerales hidrosolubles. Tradicionalmente consumido para revitalizar el organismo y combatir el agotamiento mental y físico."
              },
              {
                icon: "🌴",
                name: "Chontaduro Puro",
                tag: "VITALIDAD CELULAR",
                desc: "Fruto de palma valorado por su alta concentración de ácidos grasos saludables, fibra y carotenos. Estimula la resistencia física y apoya el equilibrio metabólico."
              },
              {
                icon: "⚡",
                name: "Vitaminas C, E & Zinc",
                tag: "ANTIOXIDANTE & DEFENSAS",
                desc: "Micronutrientes clave que potencian la absorción celular, protegen contra el estrés oxidativo y ayudan a mantener la stamina y el rendimiento diario."
              },
              {
                icon: "🛡️",
                name: "0% Azúcar Añadida + Colágeno",
                tag: "CERO PICOS DE GLUCEMIA",
                desc: "Solo 0,5 kcal por gomita con colágeno hidrolizado. Endulzado con edulcorantes certificados de grado dietético, seguro y ligero."
              }
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => setActiveIngredientTab(idx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  activeIngredientTab === idx
                    ? "bg-white/[0.08] border-white/25 shadow-lg"
                    : "bg-white/[0.02] border-white/5 hover:border-white/15"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.icon}</span>
                    <strong className="text-sm font-black text-white">{item.name}</strong>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded">
                    {item.tag}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed pl-7">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* TABLA NUTRICIONAL OFICIAL EN FORMATO EDITORIAL */}
        <div className="mt-12 max-w-xl mx-auto border border-white/15 rounded-2xl overflow-hidden bg-neutral-900/60 shadow-2xl backdrop-blur-sm text-xs">
          <div className="bg-neutral-950 p-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                Etiquetado Oficial Verificable
              </span>
              <strong className="text-sm text-white font-black uppercase">Información Nutricional</strong>
            </div>
            <span className="text-[11px] font-bold text-neutral-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
              Por gomita (1 g)
            </span>
          </div>

          <div className="divide-y divide-white/[0.08] p-2 text-neutral-300">
            <div className="flex justify-between py-2 px-3">
              <span>Valor Energético (Calorías)</span>
              <strong className="text-white font-black">0,5 kcal</strong>
            </div>
            <div className="flex justify-between py-2 px-3">
              <span>Azúcares añadidos</span>
              <strong className="text-emerald-400 font-black">0 g</strong>
            </div>
            <div className="flex justify-between py-2 px-3">
              <span>Vitamina C</span>
              <strong className="text-white font-black">22 mg</strong>
            </div>
            <div className="flex justify-between py-2 px-3">
              <span>Vitamina E</span>
              <strong className="text-white font-black">1,9 mg</strong>
            </div>
            <div className="flex justify-between py-2 px-3">
              <span>Colágeno hidrolizado</span>
              <strong className="text-rose-400 font-black">4,45 mg</strong>
            </div>
            <div className="flex justify-between py-2 px-3">
              <span>Extracto puro de Borojó</span>
              <strong className="text-white font-black">1,25 mg</strong>
            </div>
            <div className="flex justify-between py-2 px-3">
              <span>Extracto puro de Chontaduro</span>
              <strong className="text-white font-black">0,35 mg</strong>
            </div>
            <div className="flex justify-between py-2 px-3">
              <span>Zinc</span>
              <strong className="text-white font-black">0,08 mg</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PROCESO DE COMPRA: PAGO EN LA ENTREGA (3 PASOS) */}
      <section id="proceso" className="py-16 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
          <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
            Cero Riesgo • Máxima Tranquilidad
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            Cómo Funciona el Pago en la Entrega
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            No necesitas tarjeta de crédito ni transferir por adelantado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900/40 border border-white/10 rounded-2xl p-6 relative group hover:border-white/20 transition-all">
            <span className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-black text-xs flex items-center justify-center mb-4">
              01
            </span>
            <h3 className="font-bold text-white text-base mb-1">Eliges tu Combo</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Selecciona tu presentación preferida (el favorito de las parejas es 3 Pares por $25 o Frasco de 30 por $45).
            </p>
          </div>

          <div className="bg-neutral-900/40 border border-white/10 rounded-2xl p-6 relative group hover:border-white/20 transition-all">
            <span className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-black text-xs flex items-center justify-center mb-4">
              02
            </span>
            <h3 className="font-bold text-white text-base mb-1">Completas tus Datos</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Indicas tu nombre, WhatsApp y dirección de entrega o agencia Tealca en menos de 30 segundos.
            </p>
          </div>

          <div className="bg-neutral-900/40 border border-white/10 rounded-2xl p-6 relative group hover:border-white/20 transition-all">
            <span className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black text-xs flex items-center justify-center mb-4">
              03
            </span>
            <h3 className="font-bold text-white text-base mb-1">Pagas al Recibir</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Tealca entrega tu paquete 100% sellado y confidencial. Pagas en efectivo en divisas o Pago Móvil únicamente en la entrega.
            </p>
          </div>
        </div>

        <div className="text-center pt-8">
          <button
            onClick={() => openCheckout()}
            className="bg-white hover:bg-neutral-200 text-neutral-950 font-black text-xs sm:text-sm px-8 py-3.5 rounded-xl uppercase tracking-wider transition-all shadow-xl active:scale-95"
          >
            Hacer Pedido con Pago en la Entrega
          </button>
        </div>
      </section>

      {/* 8. TESTIMONIOS VERIFICADOS */}
      <section id="opiniones" className="py-16 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
          <span className="text-[11px] font-black uppercase tracking-widest text-neutral-400">
            Opiniones Reales
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            Lo que dicen en Venezuela
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="bg-neutral-900/40 border border-white/10 p-5 rounded-2xl space-y-3">
              <div className="flex text-amber-400 text-sm">
                {"★".repeat(t.rating)}
              </div>
              <p className="text-xs text-neutral-300 italic leading-relaxed">
                "{t.quote}"
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                <strong className="text-white">{t.author}</strong>
                <span className="text-neutral-500">{t.city}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FOOTER EDITORIAL DE LUJO */}
      <footer className="bg-neutral-950 border-t border-white/[0.08] py-10 px-4 text-xs text-neutral-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <span className="text-xl">🦁</span>
            <div>
              <strong className="text-white block font-black uppercase tracking-wider">
                Gummies Viking Venezuela
              </strong>
              <p className="text-[11px] text-neutral-400">
                Suplemento vigorizante natural • Distribución oficial nacional.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-neutral-400">
            <button onClick={() => setActiveLegalModal("privacy")} className="hover:text-white transition-colors">Privacidad</button>
            <button onClick={() => setActiveLegalModal("shipping")} className="hover:text-white transition-colors">Despachos Tealca</button>
            <button onClick={() => setActiveLegalModal("guide")} className="hover:text-white transition-colors">Modo de Uso</button>
          </div>
        </div>
      </footer>

      {/* 10. STICKY DOCK FLOTANTE EN MÓVIL (THUMB-ZONE PRO) */}
      {showStickyBar && (
        <div className="fixed bottom-4 inset-x-4 max-w-md mx-auto z-40 bg-neutral-950/90 backdrop-blur-xl border border-white/20 rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-3 md:hidden">
          <div>
            <span className="text-[9px] text-cyan-400 font-bold block uppercase tracking-wider">
              {selectedPack.name}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-white">${selectedPack.price}</span>
              <span className="text-[9px] text-emerald-400 font-bold uppercase">Envío Gratis</span>
            </div>
          </div>

          <button
            onClick={() => openCheckout()}
            className="bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-black px-5 py-2.5 rounded-xl shadow-lg shadow-rose-950/50 uppercase tracking-wider active:scale-95 transition-all"
          >
            Pedir (Pago al Recibir)
          </button>
        </div>
      )}

      {/* 11. MODAL DE CHECKOUT COD (PAGO EN LA ENTREGA) */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0e1017] border border-white/20 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl relative my-8 animate-modal-pop text-neutral-100">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-colors"
            >
              ✕
            </button>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-0.5 rounded-full inline-block">
                Pago en la Entrega • Cero Riesgo
              </span>
              <h2 className="text-xl font-black text-white mt-1.5 uppercase">
                Completa tu Pedido
              </h2>
              <p className="text-xs text-neutral-400">
                Pagas al mensajero de Tealca únicamente al recibir tu paquete sellado.
              </p>
            </div>

            {/* Selector de combo rápido dentro del modal */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Selecciona tu Combo:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {PRODUCT_BUNDLES.map((pack) => (
                  <button
                    key={pack.id}
                    type="button"
                    onClick={() => setSelectedPack(pack)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      selectedPack.id === pack.id
                        ? "border-rose-500 bg-rose-500/20 text-white font-black ring-1 ring-rose-500/50"
                        : "border-white/10 bg-white/5 text-neutral-400 hover:text-white"
                    }`}
                  >
                    <span className="block text-[10px] truncate">{pack.name.split("(")[0]}</span>
                    <span className="text-xs font-black text-white">${pack.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmitOrder} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-neutral-300 mb-1">
                  Nombre y Apellido *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Ej. Carlos Mendoza"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-2.5 rounded-xl border border-white/15 bg-white/5 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none text-white placeholder-neutral-500"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">
                  Teléfono / WhatsApp *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="Ej. 0412 1234567"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2.5 rounded-xl border border-white/15 bg-white/5 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none text-white placeholder-neutral-500"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">
                  Estado / Región *
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full p-2.5 rounded-xl border border-white/15 bg-[#141722] focus:border-rose-500 outline-none text-white"
                >
                  {VENEZUELA_STATES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">
                  Ciudad y Dirección exacta (o Agencia Tealca) *
                </label>
                <textarea
                  name="cityAddress"
                  required
                  rows={2}
                  placeholder="Ej. Maracay, Urb. Calicanto, Calle 5, Casa #12 (o retirar en Tealca Los Samanes)"
                  value={formData.cityAddress}
                  onChange={handleInputChange}
                  className="w-full p-2.5 rounded-xl border border-white/15 bg-white/5 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none text-white placeholder-neutral-500 resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">
                  Método de Pago en la Entrega
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className={`p-2.5 rounded-xl border text-center cursor-pointer flex items-center justify-center gap-1.5 transition-all ${
                    formData.paymentMethod === "efectivo_divisas"
                      ? "border-rose-500 bg-rose-500/20 font-bold text-white"
                      : "border-white/10 bg-white/5 text-neutral-400"
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

                  <label className={`p-2.5 rounded-xl border text-center cursor-pointer flex items-center justify-center gap-1.5 transition-all ${
                    formData.paymentMethod === "pago_movil"
                      ? "border-rose-500 bg-rose-500/20 font-bold text-white"
                      : "border-white/10 bg-white/5 text-neutral-400"
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
                <p className="text-rose-400 text-[11px] font-bold">{errorMessage}</p>
              )}

              {/* Resumen Total */}
              <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Total a pagar al recibir:</span>
                  <strong className="text-lg text-white font-black">${selectedPack.price} USD</strong>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-full font-bold uppercase">
                  Envío Gratis Incluido
                </span>
              </div>

              <button
                type="submit"
                disabled={formStatus === "submitting"}
                className="w-full bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 hover:opacity-90 disabled:opacity-50 text-white font-black text-xs sm:text-sm py-3.5 rounded-xl transition-all shadow-xl shadow-rose-950/60 uppercase tracking-wider animate-cta-shimmer"
              >
                {formStatus === "submitting" ? "Procesando pedido..." : "Confirmar Pedido (Pagas al Recibir)"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODALES LEGALES */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0e1017] border border-white/20 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl relative text-neutral-200">
            <button
              onClick={() => setActiveLegalModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>
            <h3 className="text-base font-black text-white uppercase tracking-tight">
              {activeLegalModal === "privacy" && "Política de Privacidad y Confidencialidad"}
              {activeLegalModal === "shipping" && "Información de Despachos Tealca"}
              {activeLegalModal === "guide" && "Guía de Consumo y Recomendaciones"}
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {activeLegalModal === "privacy" &&
                "Tus datos personales y de contacto se utilizan exclusivamente para coordinar el envío de tu paquete por Tealca. Tus datos nunca se comparten con terceros y tu paquete viaja en empaque 100% neutro y confidencial."}
              {activeLegalModal === "shipping" &&
                "Los despachos se realizan a nivel nacional a través de Tealca hacia tu dirección de residencia o para retirar en la agencia Tealca más cercana de tu ciudad. El envío es 100% gratuito en todas las presentaciones."}
              {activeLegalModal === "guide" &&
                "Mastica 1 o 2 gomitas antes del momento deseado o durante el día para mantener energía constante. Conservar en un lugar fresco y seco, lejos del calor excesivo. No recomendado para menores de 18 años ni mujeres embarazadas."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
