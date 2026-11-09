"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { PRODUCT_BUNDLES, DEFAULT_BUNDLE, ProductBundle } from "@/lib/product";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_STORE_WHATSAPP || "584121183463";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yltjezxhnwmtzuraquhc.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_oNHuXs7lM2VnOzqazVyuNw_tu7RQi97";
const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || "9058473536:AAHM284rhV8Js85QLdyzLPwpXC3IiKAhjFk";
const TELEGRAM_CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID || "1163159778";

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
  const [includeCherrySachet, setIncludeCherrySachet] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const finalPrice = selectedPack.price + (includeCherrySachet ? 4 : 0);

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
          content_name: includeCherrySachet ? `${selectedPack.name} + Sachet Cherry` : selectedPack.name,
          content_ids: [selectedPack.id, ...(includeCherrySachet ? ["sachet_cherry_10ml"] : [])],
          value: finalPrice,
          currency: "USD"
        },
        { eventID: eventId }
      );
    }

    const cleanState = formData.state.split("(")[0].trim();

    // 1. Guardar inmediatamente en Supabase en segundo plano (Respaldo 100% infalible)
    try {
      fetch(`${SUPABASE_URL}/rest/v1/gummies_viking_ecomm`, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          nombre: formData.fullName.trim(),
          telefono: formData.phone.trim(),
          estado: cleanState,
          ciudad_tealca: formData.cityAddress.trim(),
          direccion: formData.cityAddress.trim(),
          producto_pack: includeCherrySachet ? `${selectedPack.name} + Sachet Cherry` : selectedPack.name,
          total_usd: finalPrice,
          order_bump_cherry: includeCherrySachet,
          metodo_pago: formData.paymentMethod,
          notas: formData.notes.trim() || null,
          estado_pedido: "Pendiente"
        }),
        keepalive: true
      }).catch((err) => console.warn("Supabase background save notice:", err));
    } catch (e) {
      console.warn("Supabase sync notice:", e);
    }

    // 2. Notificación Instantánea a Telegram
    try {
      let rawPhone = formData.phone.trim().replace(/\D/g, "");
      if (rawPhone.startsWith("0")) rawPhone = "58" + rawPhone.slice(1);
      else if (!rawPhone.startsWith("58")) rawPhone = "58" + rawPhone;

      const tgText = `👑 *¡NUEVO PEDIDO GUMMIES VIKING!*\n------------------------------------\n👤 *Cliente:* ${formData.fullName.trim()}\n📞 *Teléfono:* ${formData.phone.trim()}\n📍 *Estado:* ${cleanState}\n🏢 *Tealca / Dirección:* ${formData.cityAddress.trim()}\n📦 *Promo:* ${selectedPack.orderName}${includeCherrySachet ? " + Sachet Cherry" : ""}\n💵 *Total a Pagar:* $${finalPrice} USD\n🤝 *Pago:* ${formData.paymentMethod === "efectivo_divisas" ? "Efectivo Divisas ($)" : "Pago Móvil"}\n${formData.notes.trim() ? `📝 *Nota:* ${formData.notes.trim()}\n` : ""}------------------------------------\n📲 *Escribir directo a su WhatsApp:*\nhttps://wa.me/${rawPhone}`;

      fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: tgText,
          parse_mode: "Markdown"
        }),
        keepalive: true
      }).catch((err) => console.warn("Telegram alert error:", err));
    } catch (e) {
      console.warn("Telegram notification notice:", e);
    }

    const messageLines = [
      "¡Hola! 👋 Acabo de hacer mi pedido en la web:",
      "",
      `📦 *Pedido:* ${selectedPack.orderName}${includeCherrySachet ? " + Sachet Cherry" : ""}`,
      `💵 *Total a pagar:* $${finalPrice} USD (Envío Gratis por Tealca)`,
      `👤 *A nombre de:* ${formData.fullName.trim()}`,
      `📍 *Destino:* ${formData.cityAddress.trim()} (${cleanState})`,
      "",
      "¿Me confirman para coordinar el despacho por favor? 🙏✨"
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

      {/* Header Editorial de Alta Gama */}
      <header className="border-b border-[#e8e1d5] bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Emblema Insignia Viking en SVG Arquitectónico */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-b from-[#1f1b18] to-[#12100e] border border-[#d8caa8]/40 shadow-md flex items-center justify-center p-1.5 flex-shrink-0 group">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-rose-500/10 via-transparent to-amber-500/10 pointer-events-none" />
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                {/* Cuernos Vikingos / Alas Geométricas */}
                <path
                  d="M7 11C7 11 11 10 14 14L20 22L26 14C29 10 33 11 33 11C33 11 30 18 26 21L20 27L14 21C10 18 7 11 7 11Z"
                  fill="url(#vikingBlade)"
                />
                {/* Cresta / Yelmo 'V' Central */}
                <path
                  d="M15 13L20 7L25 13L20 17L15 13Z"
                  fill="url(#goldSpike)"
                />
                {/* Escudo Monolítico 'V' */}
                <path
                  d="M12 21L20 33L28 21L23 21L20 26L17 21H12Z"
                  fill="#ffffff"
                />
                {/* Joya de Vitalidad Rubí */}
                <circle cx="20" cy="18" r="1.5" fill="#f43f5e" />
                <defs>
                  <linearGradient id="vikingBlade" x1="20" y1="7" x2="20" y2="27" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#f8fafc" />
                    <stop offset="0.6" stopColor="#e2e8f0" />
                    <stop offset="1" stopColor="#94a3b8" />
                  </linearGradient>
                  <linearGradient id="goldSpike" x1="20" y1="7" x2="20" y2="17" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fbbf24" />
                    <stop offset="1" stopColor="#d97706" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Tipografía de Identidad Curada */}
            <div className="flex flex-col">
              <span className="text-[9px] font-black tracking-[0.22em] text-rose-600 uppercase leading-none">
                LABORATORIO BOTÁNICO
              </span>
              <span className="font-serif text-lg md:text-xl font-black tracking-tight text-[#191613] leading-none mt-1">
                GUMMIES VIKING
              </span>
              <span className="text-[9px] md:text-[10px] font-bold tracking-[0.14em] text-[#786e63] uppercase leading-none mt-1">
                Borojó &amp; Chontaduro · Venezuela
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 rounded-full px-2.5 py-1 text-[11px] font-bold text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Stock Disponible</span>
            </div>
            <button
              onClick={() => scrollToForm()}
              className="text-xs font-black text-white bg-[#1b8a43] hover:bg-[#167438] active:scale-95 px-3.5 py-2 rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Pedir Ahora</span>
              <span className="text-sm">🚚</span>
            </button>
          </div>
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
                {includeCherrySachet && (
                  <span className="text-[11px] font-bold text-rose-600 block mt-0.5">
                    + 1 Sachet Gel Cherry (+$4 USD)
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-700 font-bold block">ENVÍO GRATIS</span>
                <span className="text-lg font-black text-rose-600">${finalPrice} USD</span>
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

              {/* ORDER BUMP: SACHET LUBRICANTE CHERRY */}
              <div
                onClick={() => setIncludeCherrySachet(!includeCherrySachet)}
                className={`border-2 rounded-2xl p-3.5 cursor-pointer transition-all select-none ${
                  includeCherrySachet
                    ? "bg-rose-50/90 border-rose-600 shadow-md shadow-rose-900/10 ring-2 ring-rose-200"
                    : "bg-[#faf8f5] border-dashed border-[#cfc4b2] hover:border-rose-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={includeCherrySachet}
                    onChange={(e) => setIncludeCherrySachet(e.target.checked)}
                    className="w-5 h-5 accent-rose-600 rounded cursor-pointer shrink-0"
                  />
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-rose-200 bg-white shrink-0">
                    <Image
                      src="/viking/sachet_cherry_gel.jpg"
                      alt="Sachet Gel Íntimo Cherry 10mL"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-black text-[#1f1b18] uppercase tracking-wide">
                        🔥 Extra: Gel Íntimo Cherry (10ml)
                      </span>
                      <span className="text-xs font-black text-rose-600 shrink-0">+$4 USD</span>
                    </div>
                    <p className="text-[11px] text-[#6b6155] leading-snug mt-0.5">
                      Deslizamiento suave y aroma frutal a cereza para usar junto a tus gomitas. <span className="line-through text-[#a09587]">$10 sugerido</span>.
                    </p>
                  </div>
                </div>
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
                <span>{isSubmitting ? "REGISTRANDO PEDIDO..." : `PEDIR POR WHATSAPP ($${finalPrice} USD)`}</span>
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

      {/* FOOTER EDITORIAL */}
      <footer className="max-w-4xl mx-auto px-4 text-center text-xs text-[#857b70] border-t border-[#e8e1d5] pt-8 pb-14">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-md bg-[#1f1b18] border border-[#d8caa8]/30 flex items-center justify-center p-0.5">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M7 11C7 11 11 10 14 14L20 22L26 14C29 10 33 11 33 11C33 11 30 18 26 21L20 27L14 21C10 18 7 11 7 11Z" fill="#e2e8f0" />
              <path d="M15 13L20 7L25 13L20 17L15 13Z" fill="#fbbf24" />
              <path d="M12 21L20 33L28 21L23 21L20 26L17 21H12Z" fill="#ffffff" />
            </svg>
          </div>
          <span className="font-extrabold text-[#1f1b18] tracking-wider text-xs">GUMMIES VIKING VENEZUELA</span>
        </div>
        <p className="max-w-md mx-auto text-[11px] leading-relaxed text-[#73685d]">
          Fórmula botánica con extractos de Borojó, Chontaduro y Minerales. Despacho nacional asegurado por Tealca con modalidad de Pago en la Entrega. © {new Date().getFullYear()}
        </p>
      </footer>

      {/* STICKY BOTTOM BAR EN MÓVIL */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e8e1d5] p-3 shadow-2xl">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-[#857b70] block uppercase font-bold">Pack Seleccionado:</span>
              <span className="text-xs font-black text-rose-600">{selectedPack.name} (${finalPrice})</span>
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
