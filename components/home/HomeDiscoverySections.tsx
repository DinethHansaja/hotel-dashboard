import Link from "next/link";
import { ArrowRight, Coffee, MapPin, Star, Utensils } from "lucide-react";
import { menuItems } from "@/components/layout/navigation";

export type FeaturedPlace = {
  id: string;
  name: string;
  kind: "restaurant" | "cafe";
  area: string | null;
  category: string | null;
  imageUrl: string | null;
  rating: number | null;
  reviewCount: number | null;
  priceRange: string | null;
};

export type DiningArea = {
  name: string;
  restaurantCount: number;
  cafeCount: number;
};

export type FeaturedHotel = {
  hotel_id: number;
  hotel_name: string;
  restaurant_name: string | null;
  image_url: string | null;
  location: string | null;
  rating: number | null;
};

type DirectoryStats = {
  hotels: number | null;
  restaurants: number | null;
  cafes: number | null;
  reviews: number | null;
};

function PlaceCard({ place }: { place: FeaturedPlace }) {
  const Icon = place.kind === "cafe" ? Coffee : Utensils;
  const directoryHref = place.kind === "cafe" ? "/cafes" : "/restaurants";
  const href = place.area
    ? `${directoryHref}?area=${encodeURIComponent(place.area)}`
    : directoryHref;

  return (
    <article className="surface-card group overflow-hidden">
      <Link
        href={href}
        aria-label={`Explore ${place.name} in the ${place.kind} guide`}
        className="block"
      >
        <div className="relative h-44 overflow-hidden bg-slate-100">
          {place.imageUrl ? (
            <img
              src={place.imageUrl}
              alt={place.name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#f3eee4]">
              <Icon className="h-10 w-10 text-[#8b682b]" aria-hidden="true" />
            </div>
          )}
          {place.area && <span className="ui-badge absolute left-4 top-4">{place.area}</span>}
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                {place.category || (place.kind === "cafe" ? "Café" : "Restaurant")}
              </p>
              <h3 className="mt-1 truncate text-lg font-semibold text-slate-900">
                {place.name}
              </h3>
            </div>
            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#8b682b] transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
            {place.rating !== null && (
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-[#c79a45] text-[#c79a45]" aria-hidden="true" />
                {place.rating.toFixed(1)}
                {place.reviewCount !== null && place.reviewCount > 0 && (
                  <span className="text-slate-500">({place.reviewCount.toLocaleString()})</span>
                )}
              </span>
            )}
            {place.priceRange && <span>{place.priceRange}</span>}
          </div>
        </div>
      </Link>
    </article>
  );
}

export function FeaturedHotelsPanel({ hotels }: { hotels: FeaturedHotel[] }) {
  return (
    <aside className="surface-card h-full min-w-0 p-5 md:p-6" aria-labelledby="featured-hotels-heading">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8b682b]">Stay and dine</p>
          <h3 id="featured-hotels-heading" className="mt-1 text-xl font-semibold tracking-tight text-slate-900">Hotels around Colombo</h3>
        </div>
        <Link href="/hotels" className="text-sm font-semibold text-slate-600 hover:text-[#8b682b]">View all</Link>
      </div>

      {hotels.length > 0 ? (
        <div className="mt-5 divide-y divide-slate-200">
          {hotels.slice(0, 4).map((hotel) => (
            <Link key={hotel.hotel_id} href={`/hotels/${hotel.hotel_id}`} className="group flex gap-3 py-3 first:pt-0 last:pb-0">
              <div className="h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                {hotel.image_url ? (
                  <img src={hotel.image_url} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-[#f3eee4]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900 group-hover:text-[#8b682b]">{hotel.hotel_name}</p>
                <p className="mt-1 truncate text-xs text-slate-500">
                  {hotel.location || hotel.restaurant_name || "Colombo"}
                </p>
              </div>
              {hotel.rating !== null && hotel.rating > 0 && (
                <span className="flex shrink-0 items-start gap-1 text-sm font-semibold text-slate-700">
                  <Star className="mt-0.5 h-3.5 w-3.5 fill-[#c79a45] text-[#c79a45]" aria-hidden="true" />
                  {hotel.rating.toFixed(1)}
                </span>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Hotel listings will appear here when available.</p>
      )}
    </aside>
  );
}

export function FeaturedDiningSection({ places }: { places: FeaturedPlace[] }) {
  const restaurants = places.filter((place) => place.kind === "restaurant").slice(0, 2);
  const cafes = places.filter((place) => place.kind === "cafe").slice(0, 2);

  if (restaurants.length === 0 && cafes.length === 0) return null;

  return (
    <section aria-labelledby="featured-dining-heading" className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8b682b]">A good place to start</p>
          <h2 id="featured-dining-heading" className="section-title mt-1">Restaurants and cafés to explore</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Browse highly rated places from the Colombo directory.
          </p>
        </div>
        <div className="flex gap-3 text-sm font-semibold">
          <Link className="text-slate-700 transition hover:text-[#8b682b]" href="/restaurants">All restaurants</Link>
          <Link className="text-slate-700 transition hover:text-[#8b682b]" href="/cafes">All cafés</Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[...restaurants, ...cafes].map((place) => <PlaceCard key={`${place.kind}-${place.id}`} place={place} />)}
      </div>
    </section>
  );
}

export function DiningAreasSection({ areas }: { areas: DiningArea[] }) {
  if (areas.length === 0) return null;

  return (
    <section aria-labelledby="dining-areas-heading">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8b682b]">Explore by neighbourhood</p>
        <h2 id="dining-areas-heading" className="section-title mt-1">Find a table around Colombo</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {areas.map((area) => (
          <article key={area.name} className="surface-card p-5">
            <div className="flex items-center gap-2 text-[#8b682b]">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <h3 className="font-semibold text-slate-900">{area.name}</h3>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              {area.restaurantCount > 0 && (
                <Link href={`/restaurants?area=${encodeURIComponent(area.name)}`} className="font-medium text-slate-600 hover:text-[#8b682b]">
                  {area.restaurantCount} {area.restaurantCount === 1 ? "restaurant" : "restaurants"}
                </Link>
              )}
              {area.cafeCount > 0 && (
                <Link href={`/cafes?area=${encodeURIComponent(area.name)}`} className="font-medium text-slate-600 hover:text-[#8b682b]">
                  {area.cafeCount} {area.cafeCount === 1 ? "café" : "cafés"}
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function DirectoryTrustSection({ stats }: { stats: DirectoryStats }) {
  const entries = [
    { label: "hotels", value: stats.hotels },
    { label: "restaurants", value: stats.restaurants },
    { label: "cafés", value: stats.cafes },
    { label: "guest reviews", value: stats.reviews },
  ].filter((entry): entry is { label: string; value: number } => entry.value !== null);

  if (entries.length === 0) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-5 py-6 surface-card md:px-8" aria-label="Guide directory totals">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="max-w-md">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8b682b]">A local guide, at a glance</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">Colombo hospitality listings</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Counts reflect listings and visitor reviews currently available in the guide.</p>
        </div>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
          {entries.map((entry) => (
            <div key={entry.label}>
              <dd className="text-2xl font-semibold tabular-nums text-slate-900">{entry.value.toLocaleString()}</dd>
              <dt className="text-sm text-slate-500">{entry.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function SiteFooter() {
  const links = menuItems.filter((item) => item.href !== "/");

  return (
    <footer className="bg-[#0b1420] px-5 py-8 text-white md:px-8">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/" className="editorial-title text-xl hover:text-[#e5d2b1]">Colombo</Link>
          <p className="mt-1 text-sm text-slate-300">Dining &amp; Events Guide</p>
          <p className="mt-3 max-w-xl text-xs leading-5 text-slate-400">
            Prices, opening hours and venue details can change. Please confirm directly with a venue before making plans.
          </p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300">
          {links.map((item) => <Link key={item.href} href={item.href} className="hover:text-white">{item.label}</Link>)}
        </nav>
      </div>
    </footer>
  );
}
