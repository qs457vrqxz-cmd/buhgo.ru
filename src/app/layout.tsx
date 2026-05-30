import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientBody } from "./ClientBody";
import { Toaster } from "sonner";
import { GoogleAnalytics } from "@/components/Analytics";
import { ChatbotWrapper } from "@/components/ChatbotWrapper";
import { ServiceWorkerInit } from "@/components/ServiceWorkerInit";

// Optimize font loading
const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://buhgalter.tech"),
  title: {
    default: "BuhGo - Бухгалтерское сопровождение под ключ в Москве",
    template: "%s | BuhGo",
  },
  description:
    "Профессиональные бухгалтерские услуги в Москве: ведение бухучёта от 1500 руб/мес, регистрация ИП/ООО, нулевая отчётность, 1С программирование. Надёжный бухгалтер для вашего бизнеса.",
  keywords: [
    "бухгалтерские услуги",
    "бухгалтер Москва",
    "ведение бухгалтерии",
    "регистрация ИП",
    "регистрация ООО",
    "нулевая отчётность",
    "1С бухгалтерия",
    "аутсорсинг бухгалтерии",
    "бухгалтерское сопровождение",
    "налоговая отчётность",
  ],
  authors: [{ name: "BuhGo" }],
  creator: "BuhGo",
  publisher: "BuhGo",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://buhgalter.tech",
    siteName: "BuhGo",
    title: "BuhGo - Бухгалтерское сопровождение под ключ",
    description:
      "Профессиональные бухгалтерские услуги в Москве. Ведение бухучёта, регистрация ИП/ООО, налоговая отчётность.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BuhGo - Бухгалтерские услуги",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BuhGo - Бухгалтерское сопровождение",
    description:
      "Профессиональные бухгалтерские услуги в Москве от 1500 руб/мес",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  alternates: {
    canonical: "https://buhgalter.tech",
  },
  other: {
    "yandex-verification": "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0039A6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Buhgalter.tech" />

        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://mc.yandex.ru" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />

        {/* Yandex.Metrika counter - deferred loading */}
        <script
          defer
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
              ym(89113684, "init", {
                clickmap:true,
                trackLinks:true,
                accurateTrackBounce:true,
                webvisor:true
              });
            `,
          }}
        />
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/89113684"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AccountingService",
              name: "BuhGo",
              description:
                "Профессиональные бухгалтерские услуги в Москве: ведение бухучёта, регистрация ИП/ООО, налоговая отчётность",
              url: "https://buhgalter.tech",
              telephone: "+7-963-963-96-66",
              email: "info@buhgalter.tech",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Москва",
                addressCountry: "RU",
              },
              priceRange: "от 1500 руб/мес",
              openingHours: "Mo-Fr 09:00-17:00",
              sameAs: ["https://vk.com/buhgalter.tech"],
              areaServed: {
                "@type": "City",
                name: "Москва",
              },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Бухгалтерские услуги",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Ведение бухгалтерского учёта",
                      description: "Полное ведение бухгалтерии под ключ",
                    },
                    price: "10 000",
                    priceCurrency: "RUB",
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Нулевая отчётность",
                      description: "Сдача нулевой отчётности для ИП и ООО",
                    },
                    price: "5000",
                    priceCurrency: "RUB",
                  },
                ],
              },
            }),
          }}
        />
      </head>
      <ClientBody>
        <GoogleAnalytics />
        <ServiceWorkerInit />
        {children}
        <ChatbotWrapper />
        <Toaster position="top-right" richColors />
      </ClientBody>
    </html>
  );
}
