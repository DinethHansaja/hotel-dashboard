import CafeDirectory from "@/components/cafes/CafeDirectory";
import type { DirectoryBusiness } from "@/components/directory/BusinessDirectory";
import { supabase } from "@/lib/supabase";

export default async function CafesPage() {
  const { data, error } = await supabase
    .from("cafes")
    .select(
      "business_id, cafe_name, business_type, address, area, telephone, email, website, image_url, google_maps_url, latitude, longitude, rating, review_count, price_range, opening_hours, specialties, source_url, verification_status, last_checked, notes"
    )
    .order("cafe_name", { ascending: true });

  if (error) {
    console.error("Unable to load cafes:", error.message);

    return (
      <main className="min-h-screen bg-slate-50 p-5 text-slate-900 md:p-8">
        <div className="mx-auto max-w-[1600px] rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          <h1 className="font-semibold">Unable to load cafes</h1>
          <p className="mt-2 text-sm">{error.message}</p>
        </div>
      </main>
    );
  }

  const cafes: DirectoryBusiness[] = (data ?? []).map((row) => ({
    id: String(row.business_id),
    name: row.cafe_name?.trim() || "Unnamed cafe",
    category: row.business_type ?? null,
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
    specialties: row.specialties ?? null,
    sourceUrl: row.source_url ?? null,
    verificationStatus: row.verification_status ?? null,
    lastChecked: row.last_checked ?? null,
    notes: row.notes ?? null,
  }));

  return <CafeDirectory cafes={cafes} />;
}