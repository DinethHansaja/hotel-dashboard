import type { DirectoryBusiness } from "@/components/directory/BusinessDirectory";
import RestaurantDirectory from "@/components/restaurants/RestaurantDirectory";
import { supabase } from "@/lib/supabase";

export default async function RestaurantsPage() {
  const { data, error } = await supabase
    .from("restaurants")
    .select(
      "business_id, restaurant_name, cuisine_or_category, address, area, telephone, website, google_maps_url, rating, review_count, price_range, opening_hours, signature_dishes"
    )
    .order("restaurant_name", { ascending: true });

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 p-5 text-slate-900 md:p-8">
        <div className="mx-auto max-w-[1600px] rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          <h1 className="font-semibold">
            Unable to load restaurants
          </h1>
          <p className="mt-2 text-sm">{error.message}</p>
        </div>
      </main>
    );
  }

  const restaurants: DirectoryBusiness[] = (
    data ?? []
  ).map((row, index) => ({
    id: String(row.business_id ?? `restaurant-${index}`),
    name:
      row.restaurant_name?.trim() ||
      "Unnamed restaurant",
    category: row.cuisine_or_category ?? null,
    address: row.address ?? null,
    area: row.area ?? null,
    telephone: row.telephone ?? null,
    website: row.website ?? null,
    mapsUrl: row.google_maps_url ?? null,
    rating:
      row.rating !== null &&
      row.rating !== undefined
        ? Number(row.rating)
        : null,
    reviewCount:
      row.review_count !== null &&
      row.review_count !== undefined
        ? Number(row.review_count)
        : null,
    priceRange: row.price_range ?? null,
    openingHours: row.opening_hours ?? null,
    specialties: row.signature_dishes ?? null,
  }));

  return <RestaurantDirectory restaurants={restaurants} />;
}