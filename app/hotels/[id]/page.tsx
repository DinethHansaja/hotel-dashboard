import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";

import FavoriteDishForm from "@/components/home/FavoriteDishForm";

import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Globe,
  UtensilsCrossed,
  CalendarDays,
  Clock3,
  Info,
  CheckCircle2,
} from "lucide-react";

type HotelPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type FavoriteDish = {
  favorite_id: number;
  hotel_id: number;
  dish_name: string;
  customer_name: string | null;
  created_at: string;
};

export default async function HotelDetailsPage({
  params,
}: HotelPageProps) {
  const { id } = await params;

  const hotelId = Number(id);

  // ------------------------------------------------------------
  // INVALID HOTEL ID
  // ------------------------------------------------------------

  if (Number.isNaN(hotelId)) {
    notFound();
  }

  // ------------------------------------------------------------
  // FETCH ALL HOTEL DATA IN PARALLEL
  // ------------------------------------------------------------

  const [
    { data: hotel, error: hotelError },
    { data: schedules },
    { data: features },
    { data: favoriteDishes },
  ] = await Promise.all([
    // ----------------------------------------------------------
    // HOTEL
    // ----------------------------------------------------------

    supabase
      .from("hotels")
      .select(`
        hotel_id,
        hotel_name,
        restaurant_name,
        location,
        address,
        website,
        contact_number,
        image_url,
        description,
        special_notes,
        buffet_status,
        latitude,
        longitude,
        Rating,
        google_review_url,
        rate_verified_at,
        cash_cow_dish,
        cash_cow_description
      `)
      .eq("hotel_id", hotelId)
      .single(),

    // ----------------------------------------------------------
    // BUFFET SCHEDULES
    // ----------------------------------------------------------

    supabase
      .from("buffet_schedules")
      .select(`
        schedule_id,
        hotel_id,
        day_group,
        meal_type,
        buffet_name,
        price_lkr,
        buffet_time,
        breakfast_included,
        special_note,
        source_value
      `)
      .eq("hotel_id", hotelId)
      .order("schedule_id"),

    // ----------------------------------------------------------
    // FEATURES
    // ----------------------------------------------------------

    supabase
      .from("features")
      .select(`
        feature_id,
        hotel_id,
        schedule_id,
        feature_name,
        feature_description
      `)
      .eq("hotel_id", hotelId)
      .order("feature_id"),

    // ----------------------------------------------------------
    // CUSTOMER FAVORITE DISHES
    // ----------------------------------------------------------

    supabase
      .from("favorite_dishes")
      .select(`
        favorite_id,
        hotel_id,
        dish_name,
        customer_name,
        created_at
      `)
      .eq("hotel_id", hotelId)
      .order("created_at", { ascending: false }),
  ]);

  // ------------------------------------------------------------
  // HOTEL NOT FOUND
  // ------------------------------------------------------------

  if (hotelError || !hotel) {
    notFound();
  }

  // ------------------------------------------------------------
  // SEPARATE NORMAL FEATURES FROM HOTEL NOTES
  // ------------------------------------------------------------

  const hotelFeatures =
    features?.filter(
      (feature) => feature.feature_name !== "Hotel Note"
    ) ?? [];

  const featureNotes =
    features?.filter(
      (feature) => feature.feature_name === "Hotel Note"
    ) ?? [];

  // ------------------------------------------------------------
  // FORMAT RATING
  // ------------------------------------------------------------

  const rating =
    hotel.Rating !== null &&
    hotel.Rating !== undefined
      ? Number(hotel.Rating).toFixed(1)
      : "N/A";

  // ------------------------------------------------------------
  // CUSTOMER FAVORITE DISHES
  // ------------------------------------------------------------

  const customerFavorites: FavoriteDish[] =
    (favoriteDishes as FavoriteDish[] | null) ?? [];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* ========================================================
          BACK BUTTON
      ========================================================= */}

      <div className="px-6 pt-6">
        <Link
          href="/buffet"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-[#9a742e]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Buffet Guide
        </Link>
      </div>

      {/* ========================================================
          HERO SECTION
      ========================================================= */}

      <section className="mx-6 mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="relative h-[360px] w-full">

          {hotel.image_url ? (
            <img
              src={hotel.image_url}
              alt={hotel.hotel_name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
              No hotel image available
            </div>
          )}

          {/* Image overlay */}

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

          {/* Hotel name */}

          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">

            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#c79a45] px-3 py-1 text-xs font-semibold shadow-sm">
              Popular Hotel
            </div>

            <h1 className="text-3xl font-bold md:text-4xl">
              {hotel.hotel_name}
            </h1>

            {hotel.restaurant_name && (
              <p className="mt-2 flex items-center gap-2 text-white/90">
                <UtensilsCrossed className="h-4 w-4" />
                {hotel.restaurant_name}
              </p>
            )}

          </div>
        </div>

        {/* ======================================================
            HOTEL SUMMARY
        ======================================================= */}

        <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">

          {/* Rating */}

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#c79a45]/10">
              <Star className="h-5 w-5 fill-[#c79a45] text-[#c79a45]" />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Rating
              </p>

              <p className="font-semibold text-slate-900">
                {rating}
              </p>
            </div>

          </div>

          {/* Location */}

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#c79a45]/10">
              <MapPin className="h-5 w-5 text-[#c79a45]" />
            </div>

            <div className="min-w-0">

              <p className="text-sm text-slate-500">
                Location
              </p>

              <p className="truncate font-semibold text-slate-900">
                {hotel.location || "Colombo"}
              </p>

            </div>

          </div>

          {/* Telephone */}

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#c79a45]/10">
              <Phone className="h-5 w-5 text-[#c79a45]" />
            </div>

            <div className="min-w-0">

              <p className="text-sm text-slate-500">
                Telephone
              </p>

              <p className="truncate font-semibold text-slate-900">
                {hotel.contact_number?.trim() ||
                  "Not available"}
              </p>

            </div>

          </div>

          {/* Website */}

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#c79a45]/10">
              <Globe className="h-5 w-5 text-[#c79a45]" />
            </div>

            <div className="min-w-0">

              <p className="text-sm text-slate-500">
                Website
              </p>

              {hotel.website ? (
                <a
                  href={hotel.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate font-semibold text-[#9a742e] hover:underline"
                >
                  Visit Website
                </a>
              ) : (
                <p className="font-semibold text-slate-900">
                  Not available
                </p>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          MAIN CONTENT
      ========================================================= */}

      <div className="mx-6 mt-6 grid gap-6 lg:grid-cols-3">

        {/* ======================================================
            ABOUT HOTEL
        ======================================================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c79a45]/10">
              <Info className="h-5 w-5 text-[#c79a45]" />
            </div>

            <div>

              <h2 className="text-xl font-bold">
                About {hotel.hotel_name}
              </h2>

              <p className="text-sm text-slate-500">
                Hotel information
              </p>

            </div>

          </div>

          <div className="mt-6 space-y-5">

            {hotel.description ? (
              <p className="whitespace-pre-line leading-7 text-slate-600">
                {hotel.description}
              </p>
            ) : (
              <p className="text-slate-400">
                Hotel description is currently unavailable.
              </p>
            )}

            {hotel.address && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

                <div className="flex items-start gap-3">

                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#c79a45]" />

                  <div>

                    <p className="text-sm font-semibold text-slate-900">
                      Address
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {hotel.address}
                    </p>

                  </div>

                </div>

              </div>
            )}

          </div>
        </section>

        {/* ======================================================
            BUFFET EXPERIENCE
        ======================================================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c79a45]/10">
              <UtensilsCrossed className="h-5 w-5 text-[#c79a45]" />
            </div>

            <div>

              <h2 className="text-xl font-bold">
                Buffet Experience
              </h2>

              <p className="text-sm text-slate-500">
                Dining information
              </p>

            </div>

          </div>

          <div className="mt-6 space-y-3">

            {schedules && schedules.length > 0 ? (
              schedules.slice(0, 5).map((schedule) => (

                <div
                  key={schedule.schedule_id}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div>

                      <p className="font-semibold text-slate-900">
                        {schedule.meal_type || "Buffet"}
                      </p>

                      <p className="mt-1 text-xs font-medium text-[#9a742e]">
                        {schedule.day_group}
                      </p>

                    </div>

                    {schedule.price_lkr ? (
                      <p className="shrink-0 text-sm font-bold text-slate-900">
                        LKR{" "}
                        {Number(
                          schedule.price_lkr
                        ).toLocaleString()}
                      </p>
                    ) : null}

                  </div>

                  {schedule.buffet_time && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">

                      <Clock3 className="h-4 w-4 text-[#c79a45]" />

                      {schedule.buffet_time}

                    </div>
                  )}

                  {schedule.buffet_name && (
                    <p className="mt-2 text-sm text-slate-500">
                      {schedule.buffet_name}
                    </p>
                  )}

                </div>

              ))
            ) : (

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-5 text-center">

                <CalendarDays className="mx-auto h-6 w-6 text-slate-300" />

                <p className="mt-2 text-sm text-slate-400">
                  No buffet schedule available.
                </p>

              </div>

            )}

            {schedules && schedules.length > 5 && (
              <p className="pt-1 text-center text-xs text-slate-400">
                Showing 5 of {schedules.length} buffet schedules
              </p>
            )}

          </div>
        </section>

      </div>

      {/* ========================================================
          FEATURES
      ========================================================= */}

      {hotelFeatures.length > 0 && (
        <section className="mx-6 mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c79a45]/10">
              <CheckCircle2 className="h-5 w-5 text-[#c79a45]" />
            </div>

            <div>

              <h2 className="text-xl font-bold">
                Special Features
              </h2>

              <p className="text-sm text-slate-500">
                Available dining features and benefits
              </p>

            </div>

          </div>

          <div className="mt-5 flex flex-wrap gap-3">

            {hotelFeatures.map((feature) => (

              <div
                key={feature.feature_id}
                className="rounded-xl border border-[#c79a45]/20 bg-[#c79a45]/5 px-4 py-3"
              >

                <p className="text-sm font-semibold text-slate-800">
                  {feature.feature_name}
                </p>

                {feature.feature_description && (
                  <p className="mt-1 text-xs text-slate-500">
                    {feature.feature_description}
                  </p>
                )}

              </div>

            ))}

          </div>

        </section>
      )}

      {/* ========================================================
          CASH COW DISH
      ========================================================= */}

      <section className="mx-6 mt-6 rounded-2xl border border-amber-200 bg-amber-50/50 p-6 shadow-sm">

        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#c79a45]/10 text-lg">
            🐄
          </div>

          <div className="min-w-0">

            <h2 className="text-xl font-bold text-slate-900">
              Cash Cow Dish
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              The restaurant&apos;s highlighted popular dish
            </p>

          </div>

        </div>

        {hotel.cash_cow_dish ? (

          <div className="mt-5 rounded-xl border border-amber-200 bg-white p-4">

            <p className="text-base font-bold text-[#9a742e]">
              {hotel.cash_cow_dish}
            </p>

            {hotel.cash_cow_description && (
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {hotel.cash_cow_description}
              </p>
            )}

          </div>

        ) : (

          <div className="mt-5 rounded-xl border border-amber-100 bg-white p-4">

            <p className="text-sm text-slate-500">
              Popular dish information coming soon.
            </p>

          </div>

        )}

      </section>

      {/* ========================================================
          SPECIAL NOTES
      ========================================================= */}

      <section className="mx-6 mb-6 mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="text-xl font-bold">
          Special Notes
        </h2>

        <div className="mt-4 space-y-3">

          {hotel.special_notes && (
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

              <p className="whitespace-pre-line text-sm leading-6 text-slate-600">
                {hotel.special_notes}
              </p>

            </div>
          )}

          {featureNotes.map((note) => (

            <div
              key={note.feature_id}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4"
            >

              <p className="text-sm font-semibold text-slate-800">
                {note.feature_name}
              </p>

              <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-600">
                {note.feature_description}
              </p>

            </div>

          ))}

          {!hotel.special_notes &&
            featureNotes.length === 0 && (
              <p className="text-sm text-slate-400">
                No special notes available for this hotel.
              </p>
            )}

        </div>

      </section>

      {/* ========================================================
          FAVORITE DISH FORM
      ========================================================= */}

      <section className="mx-6 mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <FavoriteDishForm
          hotelId={hotel.hotel_id}
          hotelName={hotel.hotel_name}
        />

      </section>

      {/* ========================================================
          CUSTOMER FAVORITE DISHES
      ========================================================= */}

      <section className="mx-6 mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#c79a45]/10">
            <UtensilsCrossed className="h-5 w-5 text-[#c79a45]" />
          </div>

          <div>

            <h2 className="text-xl font-bold text-slate-900">
              Customer Favorite Dishes
            </h2>

            <p className="text-sm text-slate-500">
              Dishes recommended by visitors to{" "}
              {hotel.hotel_name}
            </p>

          </div>

        </div>

        {/* ======================================================
            NO SUBMISSIONS
        ======================================================= */}

        {customerFavorites.length === 0 ? (

          <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-6 text-center">

            <UtensilsCrossed className="mx-auto h-7 w-7 text-slate-300" />

            <p className="mt-3 text-sm font-medium text-slate-600">
              No customer favorites yet.
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Be the first person to recommend a dish.
            </p>

          </div>

        ) : (

          /* ====================================================
             SUBMISSIONS
          ===================================================== */

          <div className="mt-5 space-y-3">

            {customerFavorites.map((favorite) => (

              <div
                key={favorite.favorite_id}
                className="rounded-xl border border-slate-100 bg-slate-50 p-4"
              >

                <div className="flex items-start justify-between gap-4">

                  <div className="min-w-0">

                    <p className="text-base font-semibold text-slate-900">
                      {favorite.dish_name}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">

                      {favorite.customer_name?.trim()
                        ? `Recommended by ${favorite.customer_name}`
                        : "Recommended by a guest"}

                    </p>

                  </div>

                  <div className="shrink-0 text-right">

                    <p className="text-xs text-slate-400">
                      {new Date(
                        favorite.created_at
                      ).toLocaleDateString("en-LK", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}