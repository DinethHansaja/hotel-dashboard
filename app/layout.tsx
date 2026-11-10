import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import "./globals.css";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

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
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="h-screen overflow-hidden bg-slate-50 text-slate-900">
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
            <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
              {children}
            </main>

          </div>
        </div>
      </body>
    </html>
  );
}
