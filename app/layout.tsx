import type { Metadata } from "next";
import Script from "next/script";
import { LanguageProvider } from "./context/LanguageContext";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://syai-ching.com'),
  title: {
    default: "SYA - Digital Oracle",
    template: "%s | SYA - Digital Oracle",
  },
  description: "See Your Answer",
  alternates: {
    canonical: 'https://syai-ching.com',
  },
  openGraph: {
    title: "SYA - Digital Oracle",
    description: "See Your Answer",
    url: 'https://syai-ching.com',
    siteName: 'SYA',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "SYA - Digital Oracle",
    description: "See Your Answer",
  },
  verification: {
    google: 'BtgXFV3ksF39O0M6t0_VU_IYokmC_9NWv61eya_Z_V0',
    other: {
      'naver-site-verification': '058bec7a7c599a534ac496acfa91eb4fe2c565cd',
    },
  },
  other: {
    'google-adsense-account': 'ca-pub-2863659088373549',
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: '/favicon.svg',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "SYA Digital Oracle",
  "alternateName": ["SYA AI 주역", "SYA AI I Ching Oracle"],
  "url": "https://syai-ching.com",
  "description": "AI 기반 동전 척전법(Coin Toss Method) 알고리즘과 첨단 LLM의 심층 연산을 결합하여, 동양의 고전 주역 64괘를 현대적 삶의 맥락에 맞춰 정교하고 입체적으로 해석해 주는 디지털 오라클 서비스 | An AI-powered I Ching oracle service combining traditional coin-toss algorithm with advanced LLM analysis for modern hexagram interpretations.",
  "inLanguage": ["ko", "en"],
  "applicationCategory": "LifestyleApplication",
  "operatingSystem": "All",
  "keywords": "I Ching, Asian Oracle, Coin Toss Method, 64 Hexagrams, AI Fortune, Digital Oracle, 주역 64괘, 디지털 척전법, AI 오라클",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "KRW"
  },
  "author": {
    "@type": "Organization",
    "name": "SYA"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-700 text-white">
        {/* 구글 애드센스 공식 스크립트 */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2863659088373549"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}