import Link from "next/link";
import { BadgePercent } from "lucide-react";

export default function OffersPage() {
  return <main className="min-h-screen bg-[#f8f6f1] px-5 py-10 text-[#0b1728] md:px-8"><section className="page-container rounded-2xl border border-slate-200 bg-white p-8 text-center surface-card md:p-14"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#c5a46d]/10 text-[#806744]"><BadgePercent className="h-6 w-6"/></span><p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-[#806744]">Offers &amp; promotions</p><h1 className="page-title mt-2">No current offers listed</h1><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">There are no sourced promotions to display right now. When an offer is available, its terms and validity dates will be shown with it.</p><Link href="/buffet" className="ui-button ui-button-primary mt-6 inline-flex px-5 py-3 text-sm text-white">Explore buffet guide</Link></section></main>;
}
