import type { DirectoryBusiness } from "@/components/directory/BusinessDirectory";
import RestaurantDirectory from "@/components/restaurants/RestaurantDirectory";
import { supabase } from "@/lib/supabase";

export default async function RestaurantsPage() {
  const { data, error } = await supabase
    .from("restaurants")
    .select(
      "business_id, restaurant_name, cuisine_or_category, address, area, telephone, email, website, google_maps_url, image_url, latitude, longitude, rating, review_count, price_range, opening_hours, signature_dishes, source_url, verification_status, last_checked, notes"
    )
    .order("restaurant_name", { ascending: true });

  if (error) {
    console.error("Unable to load restaurants:", error.message);

    return (
      <main className="min-h-screen bg-slate-50 p-5 text-slate-900 md:p-8">
        <div className="mx-auto max-w-[1600px] rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          <h1 className="font-semibold">Unable to load restaurants</h1>
          <p className="mt-2 text-sm">{error.message}</p>
        </div>
      </main>
    );
  }

  const restaurants: DirectoryBusiness[] = (data ?? []).map((row) => ({
    id: String(row.business_id),
    name: row.restaurant_name?.trim() || "Unnamed restaurant",
    category: row.cuisine_or_category ?? null,
    address: row.address ?? null,
    area: row.area ?? null,
    telephone: row.telephone ?? null,
    email: row.email ?? null,
    website: row.website ?? null,
    imageUrl: row.image_url ?? null,
    mapsUrl: row.google_maps_url ?? null,
    latitude: row.latitude == null ? null : Number(row.latitude),
    longitude: row.longitude == null ? null : Number(row.longitude),
    rating: row.rating == null ? null : Number(row.rating),
    reviewCount: row.review_count == null ? null : Number(row.review_count),
    priceRange: row.price_range ?? null,
    openingHours: row.opening_hours ?? null,
    specialties: row.signature_dishes ?? null,
    sourceUrl: row.source_url ?? null,
    verificationStatus: row.verification_status ?? null,
    lastChecked: row.last_checked ?? null,
    notes: row.notes ?? null,
  }));

  return <RestaurantDirectory restaurants={restaurants} />;
}