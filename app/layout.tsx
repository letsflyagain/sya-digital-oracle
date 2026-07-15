import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SYA - Digital Oracle",
  description: "See Your Answer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-700 text-white">
        {children}
      </body>
    </html>
  );
}
