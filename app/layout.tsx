import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
              <Header />
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