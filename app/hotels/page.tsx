
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  MapPin,
  UtensilsCrossed,
  CalendarDays,
  Clock3,
  Info,
} from "lucide-react";

type HotelPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function HotelDetailsPage({
  params,
}: HotelPageProps) {
  const { id } = await params;

  const hotelId = Number(id);

  if (Number.isNaN(hotelId)) {
    notFound();
  }

  const { data: hotel, error } = await supabase
    .from("hotels")
    .select("*")
    .eq("hotel_id", hotelId)
    .single();

  if (error || !hotel) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* Back Button */}
      <div className="px-6 pt-6">
        <Link
          href="/buffet"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-[#9a742e]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Buffet Guide
        </Link>
      </div>

      {/* Hotel Hero Section */}
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

          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Hotel Name */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">

            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#c79a45] px-3 py-1 text-xs font-semibold">
              Popular Hotel
            </div>

            <h1 className="text-4xl font-bold">
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

        {/* Hotel Summary */}
        <div className="grid gap-6 p-6 md:grid-cols-3">

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#c79a45]/10">
              <Star className="h-5 w-5 fill-[#c79a45] text-[#c79a45]" />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Rating
              </p>

              <p className="font-semibold text-slate-900">
                N/A
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#c79a45]/10">
              <MapPin className="h-5 w-5 text-[#c79a45]" />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Location
              </p>

              <p className="font-semibold text-slate-900">
                Colombo, Sri Lanka
              </p>
            </div>
          </div>

          {/* Buffet */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#c79a45]/10">
              <CalendarDays className="h-5 w-5 text-[#c79a45]" />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Experience
              </p>

              <p className="font-semibold text-slate-900">
                Buffet Dining
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Main Content */}
      <div className="mx-6 mt-6 grid gap-6 lg:grid-cols-3">

        {/* Left - Description */}
        <section className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

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

          <div className="mt-6">
            {hotel.description ? (
              <p className="leading-7 text-slate-600">
                {hotel.description}
              </p>
            ) : (
              <p className="text-slate-400">
                Hotel description is currently unavailable.
              </p>
            )}
          </div>

        </section>

        {/* Right - Buffet Information */}
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

          <div className="mt-6 space-y-4">

            {/* Breakfast */}
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <Clock3 className="h-4 w-4 text-[#c79a45]" />

                <div>
                  <p className="font-semibold">
                    Breakfast
                  </p>

                  <p className="text-sm text-slate-500">
                    Schedule unavailable
                  </p>
                </div>
              </div>
            </div>

            {/* Lunch */}
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <Clock3 className="h-4 w-4 text-[#c79a45]" />

                <div>
                  <p className="font-semibold">
                    Lunch
                  </p>

                  <p className="text-sm text-slate-500">
                    Schedule unavailable
                  </p>
                </div>
              </div>
            </div>

            {/* Dinner */}
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <Clock3 className="h-4 w-4 text-[#c79a45]" />

                <div>
                  <p className="font-semibold">
                    Dinner
                  </p>

                  <p className="text-sm text-slate-500">
                    Schedule unavailable
                  </p>
                </div>
              </div>
            </div>

          </div>

        </section>

      </div>

      {/* Special Notes */}
      <section className="mx-6 mb-8 mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="text-xl font-bold">
          Special Notes
        </h2>

        <div className="mt-4">
          {hotel.special_notes ? (
            <p className="leading-7 text-slate-600">
              {hotel.special_notes}
            </p>
          ) : (
            <p className="text-slate-400">
              No special notes available for this hotel.
            </p>
          )}
        </div>

      </section>

    </main>
  );
}