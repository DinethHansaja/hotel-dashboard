import { supabase } from "@/lib/supabase";

import HeroSection from "@/components/home/HeroSection";
import HotelMap from "@/components/home/HotelMap";
import CashCowSection from "@/components/home/CashCowSection";
import {
  DirectoryTrustSection,
  DiningAreasSection,
  FeaturedDiningSection,
  FeaturedHotelsPanel,
  type DiningArea,
  type FeaturedHotel,
  type FeaturedPlace,
} from "@/components/home/HomeDiscoverySections";

function toNumber(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function buildDiningAreas(
  restaurants: Array<{ area: string | null }>,
  cafes: Array<{ area: string | null }>
): DiningArea[] {
  const areas = new Map<string, DiningArea>();

  for (const restaurant of restaurants) {
    const name = restaurant.area?.trim();
    if (!name) continue;
    const key = name.toLocaleLowerCase();
    const entry = areas.get(key) ?? { name, restaurantCount: 0, cafeCount: 0 };
    entry.restaurantCount += 1;
    areas.set(key, entry);
  }

  for (const cafe of cafes) {
    const name = cafe.area?.trim();
    if (!name) continue;
    const key = name.toLocaleLowerCase();
    const entry = areas.get(key) ?? { name, restaurantCount: 0, cafeCount: 0 };
    entry.cafeCount += 1;
    areas.set(key, entry);
  }

  return [...areas.values()]
    .sort((first, second) =>
      second.restaurantCount + second.cafeCount - first.restaurantCount - first.cafeCount
      || first.name.localeCompare(second.name)
    )
    .slice(0, 4);
}

export default async function HomePage() {
  const [hotelResult, cashCowResult, restaurantResult, cafeResult, reviewResult] =
    await Promise.all([
      supabase
        .from("hotels")
        .select("hotel_id, hotel_name, restaurant_name, image_url, location, latitude, longitude, rating", { count: "exact" })
        .order("hotel_id"),
      supabase
        .from("hotels")
        .select("hotel_id, hotel_name, restaurant_name, image_url, cash_cow_dish, cash_cow_description")
        .not("cash_cow_dish", "is", null)
        .neq("cash_cow_dish", "")
        .limit(6),
      supabase
        .from("restaurants")
        .select("business_id, restaurant_name, cuisine_or_category, area, image_url, rating, review_count, price_range", { count: "exact" })
        .order("rating", { ascending: false, nullsFirst: false })
        .order("review_count", { ascending: false, nullsFirst: false }),
      supabase
        .from("cafes")
        .select("business_id, cafe_name, business_type, area, image_url, rating, review_count, price_range", { count: "exact" })
        .order("rating", { ascending: false, nullsFirst: false })
        .order("review_count", { ascending: false, nullsFirst: false }),
      supabase.from("reviews").select("review_id", { count: "exact", head: true }),
    ]);

  if (hotelResult.error) console.error("Unable to load homepage hotels:", hotelResult.error.message);
  if (restaurantResult.error) console.error("Unable to load homepage restaurants:", restaurantResult.error.message);
  if (cafeResult.error) console.error("Unable to load homepage cafes:", cafeResult.error.message);

  const hotels = hotelResult.data ?? [];
  const hotelLocations = hotels.map((hotel) => ({
    hotel_id: hotel.hotel_id,
    hotel_name: hotel.hotel_name,
    restaurant_name: hotel.restaurant_name ?? null,
    image_url: hotel.image_url ?? null,
    latitude: hotel.latitude ?? null,
    longitude: hotel.longitude ?? null,
  }));
  const mappedHotelCount = hotelLocations.filter(
    (hotel) => hotel.latitude != null && hotel.longitude != null
      && Number.isFinite(Number(hotel.latitude)) && Number.isFinite(Number(hotel.longitude))
  ).length;

  const featuredHotels: FeaturedHotel[] = [...hotels]
    .sort((first, second) => (toNumber(second.rating) ?? -1) - (toNumber(first.rating) ?? -1))
    .slice(0, 4)
    .map((hotel) => ({
      hotel_id: hotel.hotel_id,
      hotel_name: hotel.hotel_name,
      restaurant_name: hotel.restaurant_name ?? null,
      image_url: hotel.image_url ?? null,
      location: hotel.location ?? null,
      rating: toNumber(hotel.rating),
    }));

  const restaurants = restaurantResult.data ?? [];
  const cafes = cafeResult.data ?? [];
  const featuredPlaces: FeaturedPlace[] = [
    ...restaurants.slice(0, 2).map((place) => ({
      id: String(place.business_id),
      name: place.restaurant_name?.trim() || "Restaurant",
      kind: "restaurant" as const,
      area: place.area ?? null,
      category: place.cuisine_or_category ?? null,
      imageUrl: place.image_url ?? null,
      rating: toNumber(place.rating),
      reviewCount: toNumber(place.review_count),
      priceRange: place.price_range ?? null,
    })),
    ...cafes.slice(0, 2).map((place) => ({
      id: String(place.business_id),
      name: place.cafe_name?.trim() || "Café",
      kind: "cafe" as const,
      area: place.area ?? null,
      category: place.business_type ?? null,
      imageUrl: place.image_url ?? null,
      rating: toNumber(place.rating),
      reviewCount: toNumber(place.review_count),
      priceRange: place.price_range ?? null,
    })),
  ];

  const diningAreas = buildDiningAreas(restaurants, cafes);
  const { data: cashCowHotels } = cashCowResult;
  const heroImage = hotels.find((hotel) => hotel.image_url)?.image_url ?? null;

  return (
    <>
      <main className="min-h-screen bg-[#f8f6f1]">
        <div className="mx-auto max-w-[1500px] space-y-12 px-5 py-6 md:px-8 md:py-8">
          <HeroSection heroImage={heroImage} />

          <section id="hotel-map" className="scroll-mt-24" aria-labelledby="hotel-map-heading">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#806744]">Discover stays</p>
                <h2 id="hotel-map-heading" className="section-title mt-1">Find a hotel on the map</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
                  Explore hotel locations and open a listing for more details.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 surface-card">
                <span className="text-xl font-semibold tabular-nums text-slate-900">{mappedHotelCount}</span>
                <span className="text-sm text-slate-500">mapped hotels</span>
              </div>
            </div>

            {hotelResult.error && (
              <p role="status" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-slate-700">
                The hotel map is temporarily unavailable. Please try again later.
              </p>
            )}

            <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.8fr)]">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 surface-card">
                <div className="h-[360px] overflow-hidden rounded-xl sm:h-[400px] lg:h-[460px]" role="region" aria-label="Interactive map of Colombo hotels">
                  <HotelMap hotels={hotelLocations} />
                </div>
              </div>
              <FeaturedHotelsPanel hotels={featuredHotels} />
            </div>
          </section>

          <FeaturedDiningSection places={featuredPlaces} />

          {cashCowHotels && cashCowHotels.length > 0 && (
            <CashCowSection hotels={cashCowHotels} />
          )}

          <DiningAreasSection areas={diningAreas} />

          <DirectoryTrustSection
            stats={{
              hotels: hotelResult.error ? null : hotelResult.count ?? hotels.length,
              restaurants: restaurantResult.error ? null : restaurantResult.count ?? restaurants.length,
              cafes: cafeResult.error ? null : cafeResult.count ?? cafes.length,
              reviews: reviewResult.error ? null : reviewResult.count ?? 0,
            }}
          />
        </div>
      </main>
    </>
  );
}
