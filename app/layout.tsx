import type { Metadata } from "next";
import Script from "next/script";
import { LanguageProvider } from "./context/LanguageContext";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://syai-ching.com'),
  title: "SYA - Digital Oracle",
  description: "See Your Answer",
  alternates: {
    canonical: 'https://syai-ching.com',
  },
  openGraph: {
    url: 'https://syai-ching.com',
  },
  // 구글 애드센스 소유권 확인 메타태그
  other: {
    'google-adsense-account': 'ca-pub-2863659088373549',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
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
      <head>
        {/* 크롤러 수집용 애드센스 소유권 메타태그 */}
        <meta name="google-adsense-account" content="ca-pub-2863659088373549" />
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