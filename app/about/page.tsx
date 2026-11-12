import Link from "next/link";
import { MapPin, MessageSquareText, Search, UtensilsCrossed } from "lucide-react";

const features = [
  { icon: Search, title: "Explore dining", text: "Browse hotel buffets, restaurants and cafés using the details available in our directory." },
  { icon: MapPin, title: "Compare locations", text: "Find addresses, areas and map links where those details have been provided." },
  { icon: MessageSquareText, title: "Share experiences", text: "Read community-submitted reviews and contribute your own visit feedback." },
];

export default function AboutPage() {
  return <main className="min-h-screen bg-[#f8f6f1] px-5 py-9 text-[#0b1728] md:px-8 md:py-12"><div className="page-container">
    <section className="overflow-hidden rounded-3xl bg-[#0b1728] px-7 py-10 text-white md:px-12 md:py-14"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#c5a46d]">Colombo Dining &amp; Events Guide</p><h1 className="editorial-title mt-3 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">A clearer way to explore Colombo hospitality</h1><p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">We bring hotel dining, restaurants, cafés, events information and guest feedback together so visitors can research local options in one place.</p></section>
    <section className="mt-8 grid gap-5 md:grid-cols-3">{features.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 surface-card"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#c5a46d]/10 text-[#806744]"><Icon className="h-5 w-5"/></span><h2 className="mt-4 text-lg font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></article>)}</section>
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 surface-card md:p-8"><div className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#c5a46d]/10 text-[#806744]"><UtensilsCrossed className="h-5 w-5"/></span><div><h2 className="text-lg font-semibold">Built around useful information</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Listings show the information available for each property or business. Prices, opening hours, ratings and event details can change, so contact the business directly when you need current details.</p><div className="mt-5 flex flex-wrap gap-3"><Link href="/hotels" className="ui-button ui-button-primary px-4 py-2.5 text-sm text-white">Explore hotels</Link><Link href="/restaurants" className="ui-button ui-button-secondary px-4 py-2.5 text-sm">Browse restaurants</Link></div></div></div></section>
  </div></main>;
}
