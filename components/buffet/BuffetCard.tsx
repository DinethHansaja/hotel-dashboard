import Link from "next/link";

import {
  Heart,
  Star,
  Clock3,
  CalendarDays,
  ArrowRight,
} from "lucide-react";

type BuffetCardProps = {
  hotelId: number;
  hotelName: string;
  restaurantName?: string | null;
  imageUrl?: string | null;
  price?: number | null;
  rating?: number | null;
  reviewCount?: number | null;
  buffetTime?: string | null;
  description?: string | null;
};

export default function BuffetCard({
  hotelId,
  hotelName,
  restaurantName,
  imageUrl,
  price,
  rating,
  reviewCount,
  buffetTime,
  description,
}: BuffetCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">

      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={hotelName}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <span className="text-sm font-medium text-slate-400">
              Hotel Image
            </span>

            <span className="mt-1 text-xs text-slate-400">
              Image unavailable
            </span>
          </div>
        )}

        {/* Image overlay */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Popular badge */}
        <div className="absolute left-3 top-3 rounded-full bg-[#c79a45] px-3 py-1 text-xs font-semibold text-white shadow-md">
          Popular
        </div>

        {/* Favourite */}
        <button
          type="button"
          aria-label={`Save ${hotelName}`}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-600 shadow-sm transition hover:bg-white hover:text-red-500"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">

        {/* Hotel information */}
        <div>
          <div className="flex items-start justify-between gap-4">

            {/* Hotel name */}
            <div className="min-w-0">
              <h3 className="line-clamp-1 text-lg font-bold text-slate-900">
                {hotelName}
              </h3>

              <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                {restaurantName ||
                  "Restaurant information unavailable"}
              </p>
            </div>

            {/* Starting price */}
            <div className="shrink-0 text-right">
              {price !== null && price !== undefined ? (
                <>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    From
                  </div>

                  <div className="text-base font-bold text-slate-900">
                    LKR {price.toLocaleString()}
                  </div>

                  <div className="text-[11px] text-slate-400">
                    per person
                  </div>
                </>
              ) : (
                <div className="text-xs text-slate-400">
                  Price unavailable
                </div>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="mt-4 flex items-center gap-2">
            <Star className="h-4 w-4 fill-[#c79a45] text-[#c79a45]" />

            <span className="text-sm font-semibold text-slate-800">
              {rating ?? "N/A"}
            </span>

            {reviewCount !== null &&
              reviewCount !== undefined && (
                <span className="text-xs text-slate-400">
                  ({reviewCount} reviews)
                </span>
              )}
          </div>

          {/* Description */}
          {description && (
            <p className="mt-3 line-clamp-2 text-sm leading-5 text-slate-500">
              {description}
            </p>
          )}
        </div>

        {/* Bottom section */}
        <div className="mt-auto pt-6">

          <div className="space-y-2">

            {/* Buffet time */}
            {buffetTime && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock3 className="h-4 w-4 shrink-0 text-[#c79a45]" />

                <span>
                  {buffetTime}
                </span>
              </div>
            )}

            {/* Buffet type */}
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <CalendarDays className="h-4 w-4 shrink-0 text-[#c79a45]" />

              <span>
                Buffet Experience
              </span>
            </div>
          </div>

          {/* View Details */}
          <Link
            href={`/hotels/${hotelId}`}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#c79a45] px-4 py-2.5 text-sm font-semibold text-[#9a742e] transition hover:bg-[#c79a45] hover:text-white"
          >
            View Details

            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}