"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, ExternalLink, Heart, MapPin, Phone, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSavedHotels } from "@/lib/useSavedHotels";
import { toExternalUrl } from "@/lib/commercialData";

type Hotel = {
  hotel_id: number;
  hotel_name: string;
  image_url?: string | null;
  address?: string | null;
  location?: string | null;
  contact_number?: string | null;
  website?: string | null;
};

export default function EventsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const { savedHotelIds, toggleHotel } = useSavedHotels();

  useEffect(() => {
    let active = true;
    void supabase.from("hotels").select("hotel_id, hotel_name, image_url, address, location, contact_number, website").order("hotel_name")
      .then(({ data, error }) => {
        if (!active) return;
        if (error) { setLoadError(true); }
        else setHotels((data ?? []) as Hotel[]);
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const visibleHotels = useMemo(() => {
    const query = search.trim().toLowerCase();
    return hotels.filter((hotel) => !query || [hotel.hotel_name, hotel.address, hotel.location].some((value) => value?.toLowerCase().includes(query)));
  }, [hotels, search]);

  return (
    <main className="min-h-screen bg-[#f8f6f1] text-[#0b1420]">
      <section className="bg-[#0b1420] text-white">
        <div className="page-container px-5 py-12 md:px-8 md:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#c79a45]">Events &amp; Weddings</p>
          <h1 className="editorial-title mt-3 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">Find a Colombo hotel to contact about your event</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">Browse hotel contact details and ask each property directly about event spaces, packages, capacity and dates.</p>
          <label className="mt-7 flex max-w-2xl items-center gap-3 rounded-xl bg-white px-4 py-3 text-slate-700">
            <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-slate-400" />
            <span className="sr-only">Search hotels</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search hotels or locations" className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" />
          </label>
        </div>
      </section>
      <section className="page-container px-5 py-9 md:px-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div><h2 className="text-xl font-semibold">Hotel contacts</h2><p className="mt-1 text-sm text-slate-500">Event-specific details are shown only when supplied by the property.</p></div>
          {!loading && !loadError && <span className="text-sm text-slate-500">{visibleHotels.length} properties</span>}
        </div>
        {loading ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{[1,2,3].map((n) => <div key={n} className="h-72 animate-pulse rounded-2xl bg-white" />)}</div> : loadError ? (
          <div role="alert" className="rounded-2xl border border-rose-200 bg-white p-8 text-center"><h2 className="font-semibold">Hotel contacts could not be loaded</h2><p className="mt-2 text-sm text-slate-500">Please refresh the page to try again.</p></div>
        ) : visibleHotels.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleHotels.map((hotel) => {
              const phone = hotel.contact_number;
              const website = toExternalUrl(hotel.website);
              return <article key={hotel.hotel_id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white surface-card">
                <div className="relative aspect-[16/9] bg-slate-100">{hotel.image_url ? <img src={hotel.image_url} alt={hotel.hotel_name} loading="lazy" decoding="async" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-slate-400"><CalendarDays className="mr-2 h-5 w-5"/>Hotel image unavailable</div>}<button type="button" aria-label={savedHotelIds.includes(hotel.hotel_id) ? `Remove ${hotel.hotel_name} from favourites` : `Save ${hotel.hotel_name} to favourites`} aria-pressed={savedHotelIds.includes(hotel.hotel_id)} onClick={() => toggleHotel(hotel.hotel_id)} className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm"><Heart className={`h-5 w-5 ${savedHotelIds.includes(hotel.hotel_id) ? "fill-rose-700 text-rose-700" : ""}`}/></button></div>
                <div className="p-5"><h3 className="text-lg font-semibold">{hotel.hotel_name}</h3>
                  {(hotel.address || hotel.location) && <p className="mt-2 flex gap-2 text-sm leading-5 text-slate-600"><MapPin className="h-4 w-4 shrink-0 text-[#8b682b]"/>{hotel.address || hotel.location}</p>}
                  <p className="mt-3 text-sm leading-6 text-slate-500">Contact the property to confirm event facilities, terms and availability.</p>
                  <div className="mt-4 flex flex-wrap gap-2">{phone && <a className="ui-button ui-button-secondary px-3 py-2 text-sm" href={`tel:${phone}`}><Phone className="mr-2 inline h-4 w-4"/>Call hotel</a>}{website && <a className="ui-button ui-button-secondary px-3 py-2 text-sm" href={website} target="_blank" rel="noopener noreferrer">Property website <ExternalLink className="ml-1 inline h-3.5 w-3.5"/></a>}</div>
                  <Link href={`/hotels/${hotel.hotel_id}`} className="mt-3 inline-flex text-sm font-semibold text-[#8b682b] hover:underline">View hotel details <span className="sr-only"> for {hotel.hotel_name}</span></Link>
                </div>
              </article>;
            })}
          </div>
        ) : <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center"><h2 className="font-semibold">No hotels match this search</h2><p className="mt-2 text-sm text-slate-500">Try another hotel or location.</p></div>}
      </section>
    </main>
  );
}
