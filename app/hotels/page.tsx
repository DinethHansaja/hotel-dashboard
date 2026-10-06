import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  Star,
  MapPin,
  UtensilsCrossed,
  ArrowRight,
} from "lucide-react";

export default async function HotelsPage() {
  // Fetch only the columns required by the hotel listing page.
  // This reduces the amount of data transferred from Supabase.
  const { data: hotels, error } = await supabase
    .from("hotels")
    .select(`
      hotel_id,
      hotel_name,
      restaurant_name,
      image_url,
      rating,
      price
    `)
    .order("hotel_id");

  // Handle Supabase errors
  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-8">
        <div className="mx-auto max-w-[1500px]">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            <h2 className="font-semibold">
              Unable to load hotels
            </h2>

            <p className="mt-2 text-sm">
              {error.message}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* =========================
          PAGE HEADER
      ========================== */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1500px] px-6 py-10 md:px-8">
          <p className="text-sm font-semibold text-[#c58d24]">
            Colombo Hotels
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Explore Hotels
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            Explore hotels, restaurants and buffet dining
            experiences across Colombo.
          </p>

          {/* Hotel Count */}
          <div className="mt-5 inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
            <span className="text-lg font-bold text-slate-900">
              {hotels?.length ?? 0}
            </span>

            <span className="ml-2 text-sm text-slate-500">
              hotels available
            </span>
          </div>
        </div>
      </section>

      {/* =========================
          HOTEL GRID
      ========================== */}
      <section className="mx-auto max-w-[1500px] px-6 py-8 md:px-8">
        {hotels && hotels.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {hotels.map((hotel) => (
              <article
                key={hotel.hotel_id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* =========================
                    HOTEL IMAGE
                ========================== */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  {hotel.image_url ? (
                    <img
                      src={hotel.image_url}
                      alt={hotel.hotel_name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                      No hotel image available
                    </div>
                  )}

                  {/* Hotel Badge */}
                  <div className="absolute left-4 top-4 rounded-full bg-[#c79a45] px-3 py-1 text-xs font-semibold text-white shadow-sm">
                    Hotel
                  </div>
                </div>

                {/* =========================
                    HOTEL CONTENT
                ========================== */}
                <div className="p-5">
                  {/* Hotel Name */}
                  <h2 className="line-clamp-2 text-xl font-bold text-slate-900">
                    {hotel.hotel_name}
                  </h2>

                  {/* Restaurant */}
                  {hotel.restaurant_name && (
                    <div className="mt-2 flex items-start gap-2 text-sm text-slate-500">
                      <UtensilsCrossed className="mt-0.5 h-4 w-4 shrink-0 text-[#c79a45]" />

                      <span className="line-clamp-2">
                        {hotel.restaurant_name}
                      </span>
                    </div>
                  )}

                  {/* Location */}
                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="h-4 w-4 shrink-0 text-[#c79a45]" />

                    <span>
                      Colombo, Sri Lanka
                    </span>
                  </div>

                  {/* Rating + Price */}
                  <div className="mt-4 flex items-center justify-between">
                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-[#c79a45] text-[#c79a45]" />

                      <span className="text-sm font-semibold text-slate-800">
                        {hotel.rating !== null &&
                        hotel.rating !== undefined
                          ? Number(hotel.rating).toFixed(1)
                          : "N/A"}
                      </span>
                    </div>

                    {/* Price */}
                    {hotel.price && (
                      <span className="text-sm font-semibold text-slate-700">
                        {hotel.price}
                      </span>
                    )}
                  </div>

                  {/* View Hotel Button */}
                  <Link
                    href={`/hotels/${hotel.hotel_id}`}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    View Hotel

                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* =========================
             NO HOTELS
          ========================== */
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              No hotels available
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              There are currently no hotels available to display.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}