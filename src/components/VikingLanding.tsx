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
    alt: "Gummies Viking - Sobre Individual de 2 Gomitas",
    tag: "SOBRES INDIVIDUALES"
  },
  {
    src: "/viking/viking_bottle_splash.jpg",
    alt: "Gummies Viking Borojó y Chontaduro - Pote 30 Gomitas",
    tag: "POTE 30 GOMITAS"
  },
  {
    src: "/viking/viking_pouch_with_gummies.jpg",
    alt: "Gomitas en Forma de León - Rosa y Azul",
    tag: "GOMITAS LEÓN EN PAREJA"
  },
  {
    src: "/viking/borojo_chontaduro_fruits.jpg",
    alt: "Superfrutas Naturales: Borojó y Chontaduro",
    tag: "BOROJÓ & CHONTADURO"
  },
  {
    src: "/viking/viking_bottle_benefits.jpg",
    alt: "Fórmula de Energía y Vitalidad Gummies Viking",
    tag: "BENEFICIOS ACTIVOS"
  },
  {
    src: "/viking/viking_pouch_real_table.jpg",
    alt: "Gummies Viking Foto Real en Mano",
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
        content_category: "Suplementos de Vitalidad",
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
            : "Pago Móvil (tasa del día) al recibir"
        }`,
        formData.notes.trim() ? `*Notas adicionales:* ${formData.notes.trim()}` : "",
        "-----------------------------------",
        "Hola, acabo de llenar mis datos en la página web para pedir mis Gummies Viking. ¿Me confirman para coordinar el despacho por Tealca?"
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
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 font-sans">
      {/* 1. TOP ANNOUNCEMENT BAR (WIX STYLE) */}
      <div className="bg-neutral-900 text-neutral-100 text-[11px] md:text-xs py-2 px-4 text-center font-semibold tracking-wider uppercase">
        <span>🚚 Envío Gratis a toda Venezuela • Pago en la Entrega (Tealca)</span>
      </div>

      {/* 2. HEADER MINIMALISTA (WIX 3304 WIREFRAME) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
            <a href="#presentaciones" className="hover:text-black transition-colors">Presentaciones</a>
            <a href="#formula" className="hover:text-black transition-colors">Fórmula</a>
            <a href="#como-funciona" className="hover:text-black transition-colors">Cómo Comprar</a>
          </div>

          {/* Logo Tipográfico Editorial */}
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xl md:text-2xl font-black tracking-tight text-neutral-950 uppercase">
              Gummies Viking
            </span>
            <span className="text-[9px] font-bold tracking-widest text-neutral-500 uppercase -mt-0.5">
              Borojó & Chontaduro
            </span>
          </div>

          <div>
            <button
              onClick={() => openCheckout()}
              className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2 rounded transition-all"
            >
              Pedir Ahora
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION (EDITORIAL & CLEAN) */}
      <section className="max-w-5xl mx-auto px-4 pt-8 md:pt-14 pb-10">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-block text-[10px] md:text-xs font-bold tracking-widest uppercase bg-neutral-100 border border-neutral-300 text-neutral-700 px-3 py-1 rounded-full">
            Suplemento Natural en Gomitas • Edición Parejas
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-950 leading-[1.12]">
            Recupera tu energía. <br />
            Disfruta tu tiempo en pareja.
          </h1>

          <p className="text-sm md:text-base text-neutral-600 leading-relaxed font-normal">
            Gomitas masticables fortificadas con extracto de <strong>Borojó, Chontaduro, Colágeno y Vitaminas C y E</strong>. 
            Dile adiós a la fatiga del trabajo y enciende la vitalidad diaria.
          </p>

          {/* Banner de Obsequio Congruente con los Videos */}
          <div className="bg-amber-50 border border-amber-200 text-amber-950 text-xs p-3 rounded-lg flex items-center justify-center gap-2 max-w-lg mx-auto text-left">
            <span className="text-xl shrink-0">🎁</span>
            <p className="text-[12px] leading-tight">
              <strong>Regalo Especial Hoy:</strong> Recibe de obsequio la <strong>Guía Digital: Hábitos de Vitalidad & Bienestar en Pareja</strong> con cualquier presentación.
            </p>
          </div>

          {/* Botones de Acción */}
          <div ref={heroCtaRef} className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#presentaciones"
              className="w-full sm:w-auto bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-sm px-7 py-3 rounded transition-all text-center shadow-sm"
            >
              Ver Presentaciones y Precios
            </a>
            <button
              onClick={() => openCheckout(PRODUCT_BUNDLES[0])}
              className="w-full sm:w-auto bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300 font-bold text-sm px-6 py-3 rounded transition-all text-center"
            >
              Pedir con Pago en la Entrega
            </button>
          </div>
        </div>

        {/* GALERÍA / CAROUSEL DE FOTOS REALES */}
        <div className="mt-8 max-w-lg mx-auto">
          <div
            className="relative aspect-square w-full rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 select-none shadow-sm"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={GALLERY_IMAGES[currentSlide].src}
              alt={GALLERY_IMAGES[currentSlide].alt}
              fill
              priority
              className="object-cover"
            />
            {/* Tag de imagen */}
            <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-sm text-white text-[10px] font-black uppercase px-2.5 py-1 rounded">
              {GALLERY_IMAGES[currentSlide].tag}
            </div>

            {/* Flechas de navegación */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length)}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center text-sm font-black shadow"
              aria-label="Anterior"
            >
              ‹
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % GALLERY_IMAGES.length)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center text-sm font-black shadow"
              aria-label="Siguiente"
            >
              ›
            </button>
          </div>

          {/* Miniaturas */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 justify-center">
            {GALLERY_IMAGES.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                  currentSlide === idx ? "border-neutral-950 scale-105" : "border-neutral-200 opacity-60"
                }`}
              >
                <Image src={img.src} alt={img.alt} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN "MÁS VENDIDOS" / CATÁLOGO (WIX STUDIO 3304 STYLE) */}
      <section id="presentaciones" className="bg-white border-y border-neutral-200 py-12 px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-neutral-500">
              Catálogo Oficial
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-neutral-950 tracking-tight">
              Más Vendidos
            </h2>
            <p className="text-xs md:text-sm text-neutral-600">
              Todas las presentaciones incluyen <strong>Envío Gratis por Tealca</strong> y <strong>Pago en la entrega</strong>.
            </p>
          </div>

          {/* GRID DE PRODUCTOS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {PRODUCT_BUNDLES.map((pack) => {
              const isSelected = selectedPack.id === pack.id;
              const isRecommended = pack.recommended;

              return (
                <div
                  key={pack.id}
                  className={`relative rounded-xl border flex flex-col justify-between p-5 bg-neutral-50/50 transition-all ${
                    isRecommended
                      ? "border-neutral-950 shadow-md ring-1 ring-neutral-950 bg-white"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[9px] font-black uppercase px-2.5 py-1 rounded tracking-wide ${
                        isRecommended
                          ? "bg-neutral-950 text-white"
                          : pack.id === "pack_frasco_30"
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : "bg-neutral-200 text-neutral-800"
                      }`}
                    >
                      {pack.badge}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      Envío Gratis
                    </span>
                  </div>

                  {/* Imagen y Detalles */}
                  <div className="space-y-3">
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
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
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <h3 className="font-black text-base text-neutral-950">
                        {pack.name}
                      </h3>
                      <p className="text-xs text-neutral-600 font-medium">
                        {pack.unitLabel} • <span className="text-neutral-500">{pack.perDose}</span>
                      </p>
                      <p className="text-[11px] font-bold text-rose-600 mt-1">
                        {pack.savings}
                      </p>
                    </div>

                    <ul className="text-xs text-neutral-600 space-y-1.5 pt-2 border-t border-neutral-200">
                      <li className="flex items-center gap-1.5">
                        <span className="text-emerald-600 font-bold">✓</span> Borojó y Chontaduro puros
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="text-emerald-600 font-bold">✓</span> 0% Azúcar añadida
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="text-emerald-600 font-bold">✓</span> Pago en la entrega con Tealca
                      </li>
                    </ul>
                  </div>

                  {/* Precios y Botón */}
                  <div className="pt-5 mt-4 border-t border-neutral-200 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-neutral-400 line-through">
                        ${pack.regularPrice}
                      </span>
                      <div className="text-right">
                        <span className="text-2xl font-black text-neutral-950">
                          ${pack.price}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-semibold block">
                          USD / Pago al recibir
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => openCheckout(pack)}
                      className={`w-full py-2.5 px-4 rounded text-xs font-black uppercase tracking-wider transition-all ${
                        isRecommended
                          ? "bg-neutral-950 hover:bg-neutral-800 text-white shadow"
                          : "bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-300"
                      }`}
                    >
                      Pedir este Combo
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. SECCIÓN FÓRMULA Y RESPALDO (EDITORIAL MINIMALISTA) */}
      <section id="formula" className="py-12 px-4 max-w-5xl mx-auto space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[11px] font-black uppercase tracking-widest text-neutral-500">
            Composición & Respaldo
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-neutral-950 tracking-tight">
            Qué llevas por dentro, sin letra chica
          </h2>
          <p className="text-xs md:text-sm text-neutral-600">
            Formulado a base de frutas energéticas tradicionales, colágeno y vitaminas esenciales.
          </p>
        </div>

        {/* FOTO REAL DE LAS FRUTAS + 4 TARJETAS EDITORIALES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="relative aspect-video md:aspect-square w-full rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100">
            <Image
              src="/viking/borojo_chontaduro_fruits.jpg"
              alt="Frutos de Borojó y Chontaduro frescos"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-neutral-950/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded font-bold">
              Extracto Puro de Borojó & Chontaduro
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white border border-neutral-200 p-4 rounded-xl space-y-1">
              <span className="text-xl">🥭</span>
              <strong className="text-neutral-950 block text-sm">Borojó</strong>
              <p className="text-neutral-600 text-[11px] leading-tight">
                Superfruta amazónica asociada ancestralmente al vigor y la energía natural.
              </p>
            </div>

            <div className="bg-white border border-neutral-200 p-4 rounded-xl space-y-1">
              <span className="text-xl">🌴</span>
              <strong className="text-neutral-950 block text-sm">Chontaduro</strong>
              <p className="text-neutral-600 text-[11px] leading-tight">
                Fruto del Pacífico rico en ácidos grasos saludables y nutrientes esenciales.
              </p>
            </div>

            <div className="bg-white border border-neutral-200 p-4 rounded-xl space-y-1">
              <span className="text-xl">⚡</span>
              <strong className="text-neutral-950 block text-sm">Vit. C, E & Zinc</strong>
              <p className="text-neutral-600 text-[11px] leading-tight">
                Minerales y vitaminas que apoyan la resistencia física y reducen la fatiga.
              </p>
            </div>

            <div className="bg-white border border-neutral-200 p-4 rounded-xl space-y-1">
              <span className="text-xl">🛡️</span>
              <strong className="text-neutral-950 block text-sm">0% Azúcar</strong>
              <p className="text-neutral-600 text-[11px] leading-tight">
                Solo 0,5 kcal por gomita con colágeno hidrolizado y edulcorantes seguros.
              </p>
            </div>
          </div>
        </div>

        {/* TABLA NUTRICIONAL OFICIAL EN BLANCO Y NEGRO */}
        <div className="max-w-xl mx-auto border border-neutral-300 rounded-xl overflow-hidden bg-white text-xs">
          <div className="bg-neutral-950 text-white font-bold p-3 flex justify-between">
            <span className="uppercase tracking-wider">Información Nutricional Oficial</span>
            <span className="text-neutral-400">Por gomita (1 g)</span>
          </div>
          <div className="divide-y divide-neutral-200">
            <div className="flex justify-between p-2.5">
              <span className="text-neutral-700">Calorías</span>
              <strong className="text-neutral-950">0,5 kcal</strong>
            </div>
            <div className="flex justify-between p-2.5">
              <span className="text-neutral-700">Azúcares añadidos</span>
              <strong className="text-neutral-950">0 g</strong>
            </div>
            <div className="flex justify-between p-2.5">
              <span className="text-neutral-700">Vitamina C</span>
              <strong className="text-neutral-950">22 mg</strong>
            </div>
            <div className="flex justify-between p-2.5">
              <span className="text-neutral-700">Vitamina E</span>
              <strong className="text-neutral-950">1,9 mg</strong>
            </div>
            <div className="flex justify-between p-2.5">
              <span className="text-neutral-700">Colágeno hidrolizado</span>
              <strong className="text-neutral-950">4,45 mg</strong>
            </div>
            <div className="flex justify-between p-2.5">
              <span className="text-neutral-700">Borojó</span>
              <strong className="text-neutral-950">1,25 mg</strong>
            </div>
            <div className="flex justify-between p-2.5">
              <span className="text-neutral-700">Chontaduro</span>
              <strong className="text-neutral-950">0,35 mg</strong>
            </div>
            <div className="flex justify-between p-2.5">
              <span className="text-neutral-700">Zinc</span>
              <strong className="text-neutral-950">0,08 mg</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CÓMO FUNCIONA LA COMPRA SEGURA (PAGO EN LA ENTREGA) */}
      <section id="como-funciona" className="bg-neutral-100 border-y border-neutral-200 py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-neutral-500">
              Cero Riesgo
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-neutral-950 tracking-tight">
              Compra Segura con Pago en la Entrega
            </h2>
            <p className="text-xs md:text-sm text-neutral-600">
              No necesitas tarjeta de crédito ni hacer transferencias previas para pedir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-neutral-200 space-y-2 text-center md:text-left">
              <span className="w-8 h-8 rounded-full bg-neutral-950 text-white font-black text-xs flex items-center justify-center mx-auto md:mx-0">
                1
              </span>
              <h3 className="font-bold text-neutral-950 text-sm">Eliges tu Presentación</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Selecciona la opción que prefieras (Recomendado: 3 Pares por $25 o Frasco de 30 por $45).
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-neutral-200 space-y-2 text-center md:text-left">
              <span className="w-8 h-8 rounded-full bg-neutral-950 text-white font-black text-xs flex items-center justify-center mx-auto md:mx-0">
                2
              </span>
              <h3 className="font-bold text-neutral-950 text-sm">Completas tus Datos</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Indicas tu nombre, teléfono y ciudad. Despachamos tu paquete 100% sellado y discreto por Tealca.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-neutral-200 space-y-2 text-center md:text-left">
              <span className="w-8 h-8 rounded-full bg-neutral-950 text-white font-black text-xs flex items-center justify-center mx-auto md:mx-0">
                3
              </span>
              <h3 className="font-bold text-neutral-950 text-sm">Pago en la Entrega</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Recibes en tu dirección o agencia más cercana y pagas en ese momento en divisas o Pago Móvil.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => openCheckout()}
              className="bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-sm px-8 py-3.5 rounded transition-all shadow"
            >
              Pedir Ahora con Pago en la Entrega
            </button>
          </div>
        </div>
      </section>

      {/* 7. PREGUNTAS FRECUENTES (ACORDEÓN SENCILLO) */}
      <section className="py-12 px-4 max-w-3xl mx-auto space-y-6">
        <h2 className="text-xl md:text-2xl font-black text-center text-neutral-950">
          Preguntas Frecuentes
        </h2>

        <div className="space-y-3 text-xs md:text-sm">
          <div className="bg-white border border-neutral-200 p-4 rounded-xl space-y-1">
            <strong className="text-neutral-950 block">¿Cómo se consumen las gomitas?</strong>
            <p className="text-neutral-600">
              Consume 1 o 2 gomitas masticables unos 30 a 45 minutos antes de la actividad o como complemento en tu rutina matutina para tener energía todo el día.
            </p>
          </div>

          <div className="bg-white border border-neutral-200 p-4 rounded-xl space-y-1">
            <strong className="text-neutral-950 block">¿El paquete es discreto?</strong>
            <p className="text-neutral-600">
              Sí, 100% confidencial. Se envía en bolsa de seguridad opaca y sellada de Tealca, sin imágenes ni texto explícito en el exterior.
            </p>
          </div>

          <div className="bg-white border border-neutral-200 p-4 rounded-xl space-y-1">
            <strong className="text-neutral-950 block">¿Cuánto tarda en llegar mi pedido?</strong>
            <p className="text-neutral-600">
              Generalmente entre 24 y 48 horas hábiles a las principales ciudades del país mediante Tealca.
            </p>
          </div>
        </div>
      </section>

      {/* 8. FOOTER EDITORIAL (WIX 3304) */}
      <footer className="bg-white border-t border-neutral-200 py-8 px-4 text-xs text-neutral-500">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <strong className="text-neutral-950 block">Gummies Viking Venezuela</strong>
            <p className="text-[11px] text-neutral-400">Distribución oficial a nivel nacional con pago en la entrega.</p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => setActiveLegalModal("privacy")} className="hover:underline">Privacidad</button>
            <button onClick={() => setActiveLegalModal("shipping")} className="hover:underline">Envíos Tealca</button>
            <button onClick={() => setActiveLegalModal("guide")} className="hover:underline">Modo de Uso</button>
          </div>
        </div>
      </footer>

      {/* 9. STICKY BOTTOM BAR (EN MÓVIL) */}
      {showStickyBar && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 p-3 flex items-center justify-between gap-3 md:hidden shadow-lg">
          <div>
            <span className="text-[10px] text-neutral-500 font-bold block uppercase">
              {selectedPack.name}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-neutral-950">${selectedPack.price}</span>
              <span className="text-[9px] text-emerald-700 font-bold uppercase">Envío Gratis</span>
            </div>
          </div>
          <button
            onClick={() => openCheckout()}
            className="bg-neutral-950 text-white text-xs font-black px-5 py-2.5 rounded shadow"
          >
            Pedir (Pago al Recibir)
          </button>
        </div>
      )}

      {/* 10. MODAL DE CHECKOUT COD (PAGO EN LA ENTREGA) */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-neutral-200 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl relative my-8">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Pago en la Entrega • Cero Riesgo
              </span>
              <h2 className="text-lg font-black text-neutral-950 mt-1">
                Completa tu Pedido
              </h2>
              <p className="text-xs text-neutral-500">
                Pagas al mensajero o en la agencia de Tealca únicamente al recibir.
              </p>
            </div>

            {/* Selector de combo rápido dentro del modal */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-700 uppercase">
                Presentación Seleccionada:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {PRODUCT_BUNDLES.map((pack) => (
                  <button
                    key={pack.id}
                    type="button"
                    onClick={() => setSelectedPack(pack)}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      selectedPack.id === pack.id
                        ? "border-neutral-950 bg-neutral-950 text-white font-bold"
                        : "border-neutral-200 bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    <span className="block text-[11px] truncate">{pack.name.split("(")[0]}</span>
                    <span className="text-xs font-black">${pack.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmitOrder} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  Nombre y Apellido *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Ej. Carlos Mendoza"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-2.5 rounded-lg border border-neutral-300 focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 outline-none text-neutral-900"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  Teléfono / WhatsApp *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="Ej. 0412 1234567"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2.5 rounded-lg border border-neutral-300 focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 outline-none text-neutral-900"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  Estado / Región *
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full p-2.5 rounded-lg border border-neutral-300 focus:border-neutral-950 outline-none bg-white text-neutral-900"
                >
                  {VENEZUELA_STATES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  Ciudad y Dirección exacta (o Agencia Tealca) *
                </label>
                <textarea
                  name="cityAddress"
                  required
                  rows={2}
                  placeholder="Ej. Maracay, Urb. Calicanto, Calle 5, Casa #12 (o retirar en Tealca Los Samanes)"
                  value={formData.cityAddress}
                  onChange={handleInputChange}
                  className="w-full p-2.5 rounded-lg border border-neutral-300 focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 outline-none text-neutral-900 resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  Método de Pago en la Entrega
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className={`p-2.5 rounded-lg border text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                    formData.paymentMethod === "efectivo_divisas"
                      ? "border-neutral-950 bg-neutral-100 font-bold"
                      : "border-neutral-200 text-neutral-600"
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="efectivo_divisas"
                      checked={formData.paymentMethod === "efectivo_divisas"}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    💵 Efectivo Divisas
                  </label>

                  <label className={`p-2.5 rounded-lg border text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                    formData.paymentMethod === "pago_movil"
                      ? "border-neutral-950 bg-neutral-100 font-bold"
                      : "border-neutral-200 text-neutral-600"
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
              <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-neutral-500 block">Total a pagar al recibir:</span>
                  <strong className="text-base text-neutral-950 font-black">${selectedPack.price} USD</strong>
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold uppercase">
                  Envío Gratis Incluido
                </span>
              </div>

              <button
                type="submit"
                disabled={formStatus === "submitting"}
                className="w-full bg-neutral-950 hover:bg-neutral-800 disabled:opacity-50 text-white font-black text-sm py-3 rounded-lg transition-all shadow-md mt-2 uppercase tracking-wide"
              >
                {formStatus === "submitting" ? "Procesando pedido..." : "Confirmar Pedido (Pagas al Recibir)"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODALES LEGALES / GUÍAS */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm">
          <div className="bg-white border border-neutral-200 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setActiveLegalModal(null)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>
            <h3 className="text-base font-black text-neutral-950">
              {activeLegalModal === "privacy" && "Política de Privacidad y Confidencialidad"}
              {activeLegalModal === "shipping" && "Información de Despachos Tealca"}
              {activeLegalModal === "guide" && "Guía de Consumo y Recomendaciones"}
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {activeLegalModal === "privacy" &&
                "Tus datos personales y de contacto se utilizan exclusivamente para coordinar el envío de tu paquete por Tealca. Tus datos no se comparten con terceros y tu paquete viaja en empaque 100% neutro y confidencial."}
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
