import { Suspense } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopProgressBar from "@/components/TopProgressBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeveloperLogic — Product Engineer, Systems Architect & AI Platform",
  description: "Bexruz Boynazarov — Yuqori yuklamali backend tizimlar, AI orkestratsiyasi, dasturchilar hamjamiyati va biznes avtomatlashtirish platformasi.",
  keywords: ["Bexruz Boynazarov", "DeveloperLogic", "Systems Architect", "Backend Engineer", "FastAPI", "PostgreSQL", "Next.js", "AI Estimator", "O'zMU", "Dasturchilar forumi"],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  authors: [{ name: "Bexruz Boynazarov", url: "https://github.com/devbexruz" }],
  openGraph: {
    title: "DeveloperLogic — Systems Architect & Developer Community",
    description: "Biznesingiz uchun AI smeta va arxitektura, dasturchilar uchun esa real backend muammolar yechimi.",
    siteName: "DeveloperLogic",
    locale: "uz_UZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className="h-full bg-white text-slate-900 scroll-smooth">
      <body className="min-h-full flex flex-col bg-white">
        <Suspense fallback={null}>
          <TopProgressBar />
        </Suspense>
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
