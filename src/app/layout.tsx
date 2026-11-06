import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gummies Viking Borojó & Chontaduro | Tienda Oficial Venezuela",
  description: "Gomitas masticables de gelatina con extractos naturales de Borojó y Chontaduro. Envío gratis y pago en la entrega por Tealca en toda Venezuela.",
  applicationName: "Gummies Viking Venezuela",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Gummies Viking Borojó & Chontaduro | Edición Parejas",
    description: "Enciende la química y vitalidad en pareja. Paga en la entrega por Tealca en toda Venezuela.",
    locale: "es_VE",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || "2395875734496328";

  return (
    <html lang="es-VE" className="scroll-smooth dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView',{},{eventID:'pv-'+Date.now()+'-'+Math.random().toString(36).slice(2,9)});`,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      </head>
      <body className="antialiased bg-[#07080c] text-neutral-100 selection:bg-rose-500 selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
