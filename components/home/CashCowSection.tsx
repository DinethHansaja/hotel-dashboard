import Link from "next/link";
import { ArrowRight, UtensilsCrossed } from "lucide-react";

type CashCowHotel = {
  hotel_id: number;
  hotel_name: string;
  restaurant_name?: string | null;
  image_url?: string | null;
  cash_cow_dish?: string | null;
  cash_cow_description?: string | null;
};

type CashCowSectionProps = {
  hotels: CashCowHotel[];
};

export default function CashCowSection({
  hotels,
}: CashCowSectionProps) {
  const cashCowHotels = hotels.filter(
    (hotel) =>
      hotel.cash_cow_dish &&
      hotel.cash_cow_dish.trim() !== ""
  );

  if (cashCowHotels.length === 0) {
    return null;
  }

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      {/* Section Header */}
      <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#c58d24]">
            CashCow
          </p>

          <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#111827] md:text-4xl">
            Must-Try Dishes
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            Discover the signature dishes that make each dining
            experience worth trying.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5">
          <UtensilsCrossed
            size={18}
            className="text-[#c58d24]"
          />

          <span className="text-sm font-semibold text-slate-700">
            {cashCowHotels.length} featured
          </span>
        </div>
      </div>

      {/* CashCow Cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {cashCowHotels.slice(0, 6).map((hotel) => (
          <article
            key={hotel.hotel_id}
            className="group overflow-hidden rounded-[20px] border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden bg-slate-100">
              {hotel.image_url ? (
                <img
                  src={hotel.image_url}
                  alt={hotel.hotel_name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  No image available
                </div>
              )}

              {/* CashCow Badge */}
              <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#c58d24] shadow-sm backdrop-blur">
                ⭐ CashCow Pick
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {hotel.restaurant_name || "Restaurant"}
              </p>

              <h3 className="mt-1 line-clamp-1 text-lg font-bold text-slate-900">
                {hotel.hotel_name}
              </h3>

              <div className="mt-4 rounded-2xl bg-[#fffbf2] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#c58d24]">
                  Signature Dish
                </p>

                <p className="mt-1 text-base font-bold text-slate-900">
                  {hotel.cash_cow_dish}
                </p>

                {hotel.cash_cow_description && (
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                    {hotel.cash_cow_description}
                  </p>
                )}
              </div>

              {/* View Hotel */}
              <Link
                href={`/hotels/${hotel.hotel_id}`}
                className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#c58d24] hover:text-[#c58d24]"
              >
                <span>View Hotel</span>

                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}