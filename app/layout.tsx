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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark h-full antialiased">
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