import { supabase } from "@/lib/supabase";

import BuffetFilters from "@/components/buffet/BuffetFilters";
import BuffetGrid from "@/components/buffet/BuffetGrid";

export default async function BuffetPage() {
  // --------------------------------------------------
  // 1. Get all hotels
  // --------------------------------------------------
  const { data: hotels, error: hotelError } = await supabase
    .from("hotels")
    .select("*")
    .order("hotel_id");

  if (hotelError) {
    return (
      <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
        <div className="mx-auto max-w-[1600px]">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            <h2 className="font-semibold">
              Unable to load hotels
            </h2>

            <p className="mt-2 text-sm">
              {hotelError.message}
            </p>
          </div>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // 2. Get all buffet schedules
  // --------------------------------------------------
  const hotelIds =
    hotels?.map((hotel) => hotel.hotel_id) ?? [];

  const { data: schedules, error: scheduleError } =
    hotelIds.length > 0
      ? await supabase
          .from("buffet_schedules")
          .select("*")
          .in("hotel_id", hotelIds)
          .order("schedule_id")
      : { data: [], error: null };

  if (scheduleError) {
    return (
      <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
        <div className="mx-auto max-w-[1600px]">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            <h2 className="font-semibold">
              Unable to load buffet schedules
            </h2>

            <p className="mt-2 text-sm">
              {scheduleError.message}
            </p>
          </div>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // 3. Group schedules by hotel
  // --------------------------------------------------
  const schedulesByHotel = new Map<
    number,
    typeof schedules
  >();

  schedules?.forEach((schedule) => {
    const existing =
      schedulesByHotel.get(schedule.hotel_id) ?? [];

    existing.push(schedule);

    schedulesByHotel.set(
      schedule.hotel_id,
      existing
    );
  });

  // --------------------------------------------------
  // 4. Prepare data for BuffetCard
  // --------------------------------------------------
  const buffets =
    hotels?.map((hotel) => {
      const hotelSchedules =
        schedulesByHotel.get(hotel.hotel_id) ?? [];

      // Find schedules that actually have a price
      const pricedSchedules = hotelSchedules.filter(
        (schedule) =>
          schedule.price_lkr !== null &&
          schedule.price_lkr !== undefined
      );

      // Show the lowest available buffet price on the card
      const lowestPrice =
        pricedSchedules.length > 0
          ? Math.min(
              ...pricedSchedules.map((schedule) =>
                Number(schedule.price_lkr)
              )
            )
          : null;

      // Find the first schedule with a time
      const scheduleWithTime =
        hotelSchedules.find(
          (schedule) =>
            schedule.buffet_time &&
            String(schedule.buffet_time).trim() !== ""
        );

      return {
        hotel_id: hotel.hotel_id,

        hotel_name: hotel.hotel_name,

        restaurant_name:
          hotel.restaurant_name ?? null,

        image_url:
          hotel.image_url ?? null,

        price: lowestPrice,

        rating:
          hotel.Rating !== null &&
          hotel.Rating !== undefined
            ? Number(hotel.Rating)
            : null,

        // There is currently no review_count column
        // in the hotels table.
        review_count: null,

        buffet_time:
          scheduleWithTime?.buffet_time ?? null,

        description:
          hotel.description ?? null,
      };
    }) ?? [];

  // --------------------------------------------------
  // 5. Page UI
  // --------------------------------------------------
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-[1600px] p-5 md:p-8">

        {/* Page Header */}
        <div className="mb-7">
          <div className="mb-3 text-sm text-slate-400">
            Home
            <span className="mx-2">›</span>

            <span className="text-slate-600">
              Buffet Guide
            </span>
          </div>

          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Buffet Guide
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 md:text-base">
                Discover the best buffet experiences in Colombo.
                Compare prices, varieties and reviews to find
                your perfect dining experience.
              </p>
            </div>

            <div className="rounded-xl bg-white px-4 py-3 text-sm shadow-sm ring-1 ring-slate-200">
              <span className="font-semibold text-slate-900">
                {buffets.length}
              </span>{" "}
              hotels available
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-7">
          <BuffetFilters />
        </div>

        {/* Hotels */}
        <BuffetGrid buffets={buffets} />
      </div>
    </main>
  );
}