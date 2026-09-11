import { supabase } from "@/lib/supabase";

import HeroSection from "@/components/home/HeroSection";
import HotelMap from "@/components/home/HotelMap";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export default async function HomePage() {
  const { data: hotels, error } = await supabase
    .from("hotels")
    .select("*")
    .order("hotel_id");

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 md:p-8">
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

  const hotelLocations =
    hotels?.map((hotel) => ({
      hotel_id: hotel.hotel_id,
      hotel_name: hotel.hotel_name,
      restaurant_name: hotel.restaurant_name ?? null,
      image_url: hotel.image_url ?? null,
      latitude: hotel.latitude ?? null,
      longitude: hotel.longitude ?? null,
    })) ?? [];

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto max-w-[1500px] space-y-10 px-5 py-6 md:px-8 md:py-8">

        {/* HERO */}
        <HeroSection />

        {/* HOTEL MAP SECTION */}
        <section id="hotel-map" className="scroll-mt-24">
          {/* Section heading */}
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#c58d24]">
                Explore Colombo
              </p>

              <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#111827] md:text-4xl">
                Explore Hotels on the Map
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
                Find hotels and buffet experiences across Colombo.
                Click a location to learn more about each hotel.
              </p>
            </div>

            {/* Hotel count */}
            <div className="flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
              <span className="text-2xl font-bold text-slate-900">
                {hotelLocations.length}
              </span>

              <span className="text-sm text-slate-500">
                locations
              </span>
            </div>
          </div>

          {/* MAP + INFO */}
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.8fr)_minmax(320px,0.8fr)]">
            
            {/* MAP */}
            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white p-2 shadow-sm">
              <div className="h-[520px] overflow-hidden rounded-[18px] md:h-[560px]">
                <HotelMap hotels={hotelLocations} />
              </div>
            </div>

            {/* INFORMATION PANEL */}
            <WhyChooseUs />
          </div>
        </section>

        {/* INTRODUCTION */}
        <section className="rounded-[24px] border border-slate-200 bg-white px-6 py-8 shadow-sm md:px-8 md:py-10">
          <p className="text-sm font-semibold text-[#c58d24]">
            Colombo Dining Guide
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#111827] md:text-3xl">
            Everything you need for your next dining experience
          </h2>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-500 md:text-base">
            Discover hotels, restaurants, buffet experiences, events and
            dining options across Colombo. Compare places, explore locations
            and find the right experience for you.
          </p>
        </section>

      </div>
    </main>
  );
}