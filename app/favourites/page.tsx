"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, MapPin, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSavedHotels } from "@/lib/useSavedHotels";

type Hotel = { hotel_id: number; hotel_name: string; image_url?: string | null; address?: string | null; location?: string | null; restaurant_name?: string | null };

export default function FavouritesPage() {
  const { savedHotelIds, toggleHotel } = useSavedHotels();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    if (!savedHotelIds.length) { setHotels([]); setLoading(false); return; }
    setLoading(true);
    void supabase.from("hotels").select("hotel_id, hotel_name, image_url, address, location, restaurant_name").in("hotel_id", savedHotelIds)
      .then(({ data, error: requestError }) => {
        if (!active) return;
        setError(Boolean(requestError));
        setHotels((data ?? []) as Hotel[]);
        setLoading(false);
      });
    return () => { active = false; };
  }, [savedHotelIds]);

  return <main className="min-h-screen bg-[#f8f6f1] px-5 py-8 text-[#0b1728] md:px-8"><div className="page-container">
    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#806744]">Your shortlist</p><h1 className="page-title mt-2">Favourites</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Hotels you save on this device appear here.</p>
    {loading ? <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{[1,2,3].map((n) => <div key={n} className="h-64 animate-pulse rounded-2xl bg-white" />)}</div> : error ? <div role="alert" className="mt-8 rounded-2xl border border-rose-200 bg-white p-8 text-center"><h2 className="font-semibold">Saved hotels could not be loaded</h2><p className="mt-2 text-sm text-slate-500">Refresh the page to try again.</p></div> : !hotels.length ? <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#c5a46d]/10 text-[#806744]"><Heart className="h-5 w-5"/></span><h2 className="mt-4 text-lg font-semibold">No saved hotels yet</h2><p className="mt-2 text-sm text-slate-500">Save a hotel from the buffet guide to keep it here.</p><Link href="/buffet" className="ui-button ui-button-primary mt-5 inline-flex px-5 py-3 text-sm text-white">Explore buffets</Link></div> : <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{hotels.map((hotel) => <article key={hotel.hotel_id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white surface-card"><div className="aspect-[16/9] bg-slate-100">{hotel.image_url ? <img src={hotel.image_url} alt={hotel.hotel_name} className="h-full w-full object-cover"/> : <div className="flex h-full items-center justify-center text-sm text-slate-400">Image unavailable</div>}</div><div className="p-5"><h2 className="text-lg font-semibold">{hotel.hotel_name}</h2>{hotel.restaurant_name && <p className="mt-1 text-sm text-slate-500">{hotel.restaurant_name}</p>}{(hotel.address || hotel.location) && <p className="mt-3 flex gap-2 text-sm text-slate-500"><MapPin className="h-4 w-4 shrink-0 text-[#806744]"/>{hotel.address || hotel.location}</p>}<div className="mt-5 flex gap-2"><Link href={`/hotels/${hotel.hotel_id}`} className="ui-button ui-button-primary flex-1 px-3 py-2.5 text-center text-sm text-white">View hotel</Link><button type="button" onClick={() => toggleHotel(hotel.hotel_id)} className="ui-button ui-button-secondary px-3 py-2.5 text-sm" aria-label={`Remove ${hotel.hotel_name} from favourites`}><Trash2 className="h-4 w-4"/></button></div></div></article>)}</div>}
  </div></main>;
}
