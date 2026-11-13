import Link from "next/link";
import { Coffee, Hotel, Search, UtensilsCrossed } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

type SearchPageProps = { searchParams: Promise<{ q?: string | string[] }> };

type HotelResult = {
  hotel_id: number;
  hotel_name: string;
  restaurant_name?: string | null;
  location?: string | null;
  address?: string | null;
  image_url?: string | null;
};

function cleanQuery(value: string) {
  return value.replace(/[^\p{L}\p{N}\s'&-]/gu, " ").replace(/\s+/g, " ").trim().slice(0, 80);
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params.q) ? params.q[0] ?? "" : params.q ?? "";
  const query = cleanQuery(rawQuery);

  let hotels: HotelResult[] = [];
  let restaurants: Array<{ business_id: number; restaurant_name: string; cuisine_or_category?: string | null; area?: string | null }> = [];
  let cafes: Array<{ business_id: number; cafe_name: string; business_type?: string | null; area?: string | null }> = [];
  const buffetLabelsByHotel = new Map<number, string[]>();
  let dataUnavailable = false;

  if (query) {
    const pattern = `%${query}%`;
    const [hotelRequest, restaurantRequest, cafeRequest, scheduleRequest] = await Promise.all([
      supabase.from("hotels").select("hotel_id, hotel_name, restaurant_name, location, address, image_url").or(`hotel_name.ilike.${pattern},restaurant_name.ilike.${pattern},location.ilike.${pattern},address.ilike.${pattern}`).limit(8),
      supabase.from("restaurants").select("business_id, restaurant_name, cuisine_or_category, area").or(`restaurant_name.ilike.${pattern},cuisine_or_category.ilike.${pattern},area.ilike.${pattern},address.ilike.${pattern},signature_dishes.ilike.${pattern}`).limit(8),
      supabase.from("cafes").select("business_id, cafe_name, business_type, area").or(`cafe_name.ilike.${pattern},business_type.ilike.${pattern},area.ilike.${pattern},address.ilike.${pattern},specialties.ilike.${pattern}`).limit(8),
      supabase.from("buffet_schedules").select("hotel_id, meal_type, buffet_name, buffet_time").or(`meal_type.ilike.${pattern},buffet_name.ilike.${pattern},buffet_time.ilike.${pattern}`).limit(12),
    ]);

    dataUnavailable = Boolean(hotelRequest.error || restaurantRequest.error || cafeRequest.error || scheduleRequest.error);
    hotels = (hotelRequest.data ?? []) as HotelResult[];
    restaurants = restaurantRequest.data ?? [];
    cafes = cafeRequest.data ?? [];

    const scheduleHotelIds = [...new Set((scheduleRequest.data ?? []).map((row) => Number(row.hotel_id)).filter(Number.isFinite))];
    for (const schedule of scheduleRequest.data ?? []) {
      const label = [schedule.meal_type, schedule.buffet_name, schedule.buffet_time].filter(Boolean).join(" · ");
      const id = Number(schedule.hotel_id);
      if (!label || !Number.isFinite(id)) continue;
      buffetLabelsByHotel.set(id, [...(buffetLabelsByHotel.get(id) ?? []), label]);
    }
    if (scheduleHotelIds.length) {
      const { data: buffetHotels, error } = await supabase.from("hotels").select("hotel_id, hotel_name, restaurant_name, location, address, image_url").in("hotel_id", scheduleHotelIds);
      if (error) dataUnavailable = true;
      const existingIds = new Set(hotels.map((hotel) => hotel.hotel_id));
      hotels = [...hotels, ...((buffetHotels ?? []) as HotelResult[]).filter((hotel) => !existingIds.has(hotel.hotel_id))];
    }
  }

  const hasResults = hotels.length + restaurants.length + cafes.length > 0;

  return (
    <main className="min-h-screen bg-[#f8f6f1] px-5 py-8 text-[#0b1420] md:px-8">
      <div className="page-container">
        <Breadcrumbs items={[{ label: "Search" }]} />
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8b682b]">Colombo directory</p>
        <h1 className="page-title mt-2">{query ? `Search results for “${query}”` : "Search the guide"}</h1>
        <p className="mt-2 text-sm text-slate-500">Search hotels, buffet meals, restaurants and cafés in one place.</p>

        {!query ? (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-7 surface-card">
            <div className="flex items-start gap-4"><Search className="mt-1 h-5 w-5 text-[#8b682b]"/><div><h2 className="font-semibold">Enter a search above</h2><p className="mt-1 text-sm text-slate-500">You can also browse a directory directly:</p><div className="mt-4 flex flex-wrap gap-3"><Link className="ui-button ui-button-secondary px-4 py-2.5 text-sm" href="/hotels">Hotels</Link><Link className="ui-button ui-button-secondary px-4 py-2.5 text-sm" href="/buffet">Buffets</Link><Link className="ui-button ui-button-secondary px-4 py-2.5 text-sm" href="/restaurants">Restaurants</Link><Link className="ui-button ui-button-secondary px-4 py-2.5 text-sm" href="/cafes">Cafés</Link></div></div></div>
          </section>
        ) : dataUnavailable && !hasResults ? (
          <section role="alert" className="mt-8 rounded-2xl border border-rose-200 bg-white p-8 text-center"><h2 className="font-semibold">Search is temporarily unavailable</h2><p className="mt-2 text-sm text-slate-500">Please try again, or browse one of the directories directly.</p></section>
        ) : !hasResults ? (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center surface-card"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500"><Search className="h-5 w-5"/></span><h2 className="mt-4 text-lg font-semibold">No matching listings</h2><p className="mt-2 text-sm text-slate-500">Try another hotel, meal, cuisine or neighbourhood.</p><div className="mt-5 flex justify-center gap-3"><Link className="ui-button ui-button-secondary px-4 py-2 text-sm" href="/buffet">Buffets</Link><Link className="ui-button ui-button-secondary px-4 py-2 text-sm" href="/restaurants">Restaurants</Link></div></section>
        ) : (
          <div className="mt-8 space-y-9">
            {hotels.length > 0 && <section aria-labelledby="hotel-results"><div className="mb-4 flex items-end justify-between gap-4"><h2 id="hotel-results" className="section-title">Hotels &amp; buffets</h2><Link href="/hotels" className="text-sm font-semibold text-[#8b682b] hover:underline">Browse hotels</Link></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{hotels.map((hotel) => <Link key={hotel.hotel_id} href={`/hotels/${hotel.hotel_id}`} className="group flex overflow-hidden rounded-2xl border border-slate-200 bg-white surface-card transition hover:border-[#c79a45]"><div className="h-28 w-32 shrink-0 bg-slate-100 sm:h-32">{hotel.image_url ? <img src={hotel.image_url} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover"/> : <div className="flex h-full items-center justify-center"><Hotel className="h-6 w-6 text-[#8b682b]"/></div>}</div><div className="min-w-0 p-4"><h3 className="font-semibold text-slate-900 group-hover:text-[#8b682b]">{hotel.hotel_name}</h3>{hotel.restaurant_name && <p className="mt-1 text-sm text-slate-600">{hotel.restaurant_name}</p>}<p className="mt-2 line-clamp-2 text-xs text-slate-500">{hotel.location || hotel.address || "Hotel listing"}</p>{buffetLabelsByHotel.has(hotel.hotel_id) && <p className="mt-2 line-clamp-2 text-xs font-medium text-[#8b682b]">Buffet: {buffetLabelsByHotel.get(hotel.hotel_id)?.join(", ")}</p>}</div></Link>)}</div></section>}
            {restaurants.length > 0 && <section aria-labelledby="restaurant-results"><div className="mb-4 flex items-end justify-between gap-4"><h2 id="restaurant-results" className="section-title">Restaurants</h2><Link href={`/restaurants?search=${encodeURIComponent(query)}`} className="text-sm font-semibold text-[#8b682b] hover:underline">Browse restaurant results</Link></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{restaurants.map((item) => <Link key={item.business_id} href={`/restaurants?search=${encodeURIComponent(query)}`} className="group rounded-xl border border-slate-200 bg-white p-4 surface-card hover:border-[#c79a45]"><span className="flex items-center gap-2"><UtensilsCrossed className="h-4 w-4 text-[#8b682b]"/><span className="font-semibold group-hover:text-[#8b682b]">{item.restaurant_name}</span></span><span className="mt-2 block text-sm text-slate-500">{[item.cuisine_or_category, item.area].filter(Boolean).join(" · ")}</span></Link>)}</div></section>}
            {cafes.length > 0 && <section aria-labelledby="cafe-results"><div className="mb-4 flex items-end justify-between gap-4"><h2 id="cafe-results" className="section-title">Cafés</h2><Link href={`/cafes?search=${encodeURIComponent(query)}`} className="text-sm font-semibold text-[#8b682b] hover:underline">Browse café results</Link></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{cafes.map((item) => <Link key={item.business_id} href={`/cafes?search=${encodeURIComponent(query)}`} className="group rounded-xl border border-slate-200 bg-white p-4 surface-card hover:border-[#c79a45]"><span className="flex items-center gap-2"><Coffee className="h-4 w-4 text-[#8b682b]"/><span className="font-semibold group-hover:text-[#8b682b]">{item.cafe_name}</span></span><span className="mt-2 block text-sm text-slate-500">{[item.business_type, item.area].filter(Boolean).join(" · ")}</span></Link>)}</div></section>}
            {dataUnavailable && <p role="status" className="text-sm text-slate-500">Some listing sources could not be searched. Results shown may be incomplete.</p>}
          </div>
        )}
      </div>
    </main>
  );
}
