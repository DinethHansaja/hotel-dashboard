import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { SiteFooter } from "@/components/home/HomeDiscoverySections";

const geistSans = localFont({
  src: "../public/fonts/geist-latin.woff2",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "../public/fonts/geist-mono-latin.woff2",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Colombo Dining & Events Guide",
  description:
    "Discover the best buffet experiences, restaurants, events and dining experiences in Colombo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="h-screen overflow-hidden bg-slate-50 text-slate-900">
        <Script id="theme-preference-init" strategy="beforeInteractive">
          {`try {
            const savedTheme = localStorage.getItem("colombo-guide-theme") || "system";
            const useDark = savedTheme === "dark" || (savedTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
            document.documentElement.dataset.theme = useDark ? "dark" : "light";
            document.documentElement.style.colorScheme = useDark ? "dark" : "light";
            document.documentElement.dataset.reduceMotion = localStorage.getItem("colombo-guide-reduce-motion") === "true" ? "true" : "false";
          } catch {}`}
        </Script>
        <ThemeProvider>
          <a href="#main-content" className="sr-only z-[100] rounded-lg bg-white px-4 py-3 text-sm font-semibold text-[#0b1420] focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
            Skip to content
          </a>
          <div className="flex h-screen overflow-hidden">

          {/* Fixed Sidebar */}
          <Sidebar />

          {/* Main Application Area */}
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

            {/* Fixed Header */}
            <div className="shrink-0">
              <Suspense fallback={<div className="h-16" />}>
                <Header />
              </Suspense>
            </div>

            {/* ONLY THIS AREA SCROLLS */}
            <div id="main-content" tabIndex={-1} className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden focus:outline-none">
              {children}
              <SiteFooter />
            </div>

          </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
