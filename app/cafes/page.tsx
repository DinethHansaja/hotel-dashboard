import CafeDirectory from "@/components/cafes/CafeDirectory";
import type { DirectoryBusiness } from "@/components/directory/BusinessDirectory";
import { supabase } from "@/lib/supabase";

export default async function CafesPage() {
  const { data, error } = await supabase
    .from("cafes")
    .select(
      "business_id, cafe_name, business_type, address, area, telephone, website, google_maps_url, rating, review_count, price_range, opening_hours, specialties"
    )
    .order("cafe_name", { ascending: true });

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 p-5 text-slate-900 md:p-8">
        <div className="mx-auto max-w-[1600px] rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          <h1 className="font-semibold">
            Unable to load cafes
          </h1>
          <p className="mt-2 text-sm">{error.message}</p>
        </div>
      </main>
    );
  }

  const cafes: DirectoryBusiness[] = (data ?? []).map(
    (row, index) => ({
      id: String(row.business_id ?? `cafe-${index}`),
      name: row.cafe_name?.trim() || "Unnamed cafe",
      category: row.business_type ?? null,
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
      specialties: row.specialties ?? null,
    })
  );

  return <CafeDirectory cafes={cafes} />;
}