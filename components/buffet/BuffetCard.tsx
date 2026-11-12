"use client";

import Link from "next/link";
import { useSavedHotels } from "@/lib/useSavedHotels";
import { formatDataDate, toExternalUrl } from "@/lib/commercialData";

import {
  Heart,
  Star,
  Clock3,
  ArrowRight,
  ExternalLink,
  Utensils,
  MessageSquare,
  GitCompare,
} from "lucide-react";

type BuffetCardProps = {
  hotelId: number;
  hotelName: string;
  restaurantName?: string | null;
  imageUrl?: string | null;
  price?: number | null;
  lunchPrice?: number | null;
  dinnerPrice?: number | null;
  rating?: number | null;
  reviewCount?: number | null;
  buffetTime?: string | null;
  buffetTimes?: string[];
  description?: string | null;

  // Phase 1
  mealType?: string | null;
  googleReviewUrl?: string | null;
  rateVerifiedAt?: string | null;

  // Cash Cow
  cashCowDish?: string | null;
  cashCowDescription?: string | null;

  // Community Reviews
  communityRating?: number | null;
  communityReviewCount?: number | null;
  latestReview?: string | null;
  latestReviewGuest?: string | null;
  latestReviewRating?: number | null;

  // Comparison
  isSelectedForComparison?: boolean;
  onToggleCompare?: () => void;
  compareDisabled?: boolean;
};

// ======================================================
// RATING DATA FRESHNESS
// ======================================================

function getRatingCheckedText(dateString?: string | null) {
  const date = formatDataDate(dateString);
  return date ? `Rating information last checked ${date}` : null;
}

// ======================================================
// COMPONENT
// ======================================================

export default function BuffetCard({
  hotelId,
  hotelName,
  restaurantName,
  imageUrl,
  price,
  lunchPrice,
  dinnerPrice,
  rating,
  reviewCount,
  buffetTime,
  buffetTimes,
  description,
  mealType,
  googleReviewUrl,
  rateVerifiedAt,
  cashCowDish,
  cashCowDescription,
  communityRating,
  communityReviewCount,
  latestReview,
  latestReviewGuest,
  latestReviewRating,

  // Comparison
  isSelectedForComparison = false,
  onToggleCompare,
  compareDisabled = false,
}: BuffetCardProps) {
  const ratingCheckedText = getRatingCheckedText(rateVerifiedAt);
  const { savedHotelIds, toggleHotel } = useSavedHotels();
  const isSaved = savedHotelIds.includes(hotelId);

  // Latest individual review rating
  const formattedLatestReviewRating =
    latestReviewRating !== null &&
    latestReviewRating !== undefined &&
    !Number.isNaN(
      Number(latestReviewRating)
    )
      ? Number(
          latestReviewRating
        ).toFixed(1)
      : null;

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isSelectedForComparison
          ? "border-[#c5a46d] ring-2 ring-[#c5a46d]/20"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >

      {/* =====================================================
          IMAGE
      ====================================================== */}

      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${hotelName} buffet`}
            loading="lazy"
            decoding="async"
            width={800}
            height={450}
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

        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />

        <button
          type="button"
          aria-label={isSaved ? `Remove ${hotelName} from favourites` : `Save ${hotelName} to favourites`}
          aria-pressed={isSaved}
          onClick={() => toggleHotel(hotelId)}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-600 shadow-sm transition hover:text-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c5a46d]"
        >
          <Heart className={`h-5 w-5 ${isSaved ? "fill-rose-700 text-rose-700" : ""}`} />
        </button>

        {/* Comparison */}

        {isSelectedForComparison && (
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#806744] shadow-md">

            <GitCompare className="h-3.5 w-3.5" />

            Selected for comparison

          </div>
        )}

      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="flex flex-1 flex-col p-5">

        {/* HOTEL INFORMATION */}

        <div>

          <div className="flex items-start justify-between gap-4">

            {/* HOTEL NAME */}

            <div className="min-w-0 flex-1">

              <h3 className="break-words text-lg font-bold leading-6 text-slate-900">
                {hotelName}
              </h3>

              <p className="mt-1 break-words text-sm text-slate-500">
                {restaurantName ||
                  "Restaurant information unavailable"}
              </p>

            </div>

            {/* PRICE */}

            <div className="shrink-0 text-right">

              {price !== null &&
              price !== undefined ? (
                <>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    From
                  </div>

                  <div className="text-base font-bold text-slate-900">
                    LKR{" "}
                    {Number(
                      price
                    ).toLocaleString()}
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

          {/* =================================================
              RATING
          ================================================== */}

          {(rating !== null && rating !== undefined || (googleReviewUrl && googleReviewUrl.trim()) || ratingCheckedText) && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              {rating !== null && rating !== undefined && (
                <span className="inline-flex items-center gap-1.5 text-slate-700">
                  <Star className="h-4 w-4 fill-[#c5a46d] text-[#c5a46d]" />
                  <strong>{Number(rating).toFixed(1)}</strong>
                  <span className="text-xs text-slate-500">Listed hotel rating{reviewCount != null ? ` · ${reviewCount} reviews` : ""}</span>
                </span>
              )}
              {toExternalUrl(googleReviewUrl) && (
                <a href={toExternalUrl(googleReviewUrl)!} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-[#806744] hover:underline">
                  Google Reviews <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {ratingCheckedText && <span className="w-full text-xs text-slate-500">{ratingCheckedText}</span>}
            </div>
          )}

          {/* DESCRIPTION */}

          {description && (
            <p className="mt-3 line-clamp-2 text-sm leading-5 text-slate-500">
              {description}
            </p>
          )}

        </div>

        {/* ===================================================
            BOTTOM
        ==================================================== */}

        <div className="mt-auto pt-6">

          <div className="space-y-3">

            {/* MEAL TYPE */}

            {mealType && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Utensils className="h-4 w-4 shrink-0 text-[#c5a46d]" />
                <span>{mealType} buffet</span>
              </div>
            )}

            {(buffetTimes?.length ? buffetTimes : buffetTime ? [buffetTime] : []).map((time) => (
              <div key={time} className="flex items-center gap-2 text-sm text-slate-500">
                <Clock3 className="h-4 w-4 shrink-0 text-[#c5a46d]" />
                <span>{time}</span>
              </div>
            ))}

            {(lunchPrice !== null && lunchPrice !== undefined || dinnerPrice !== null && dinnerPrice !== undefined) && (
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-amber-50/70 p-3 text-xs">
                {lunchPrice !== null && lunchPrice !== undefined && (
                  <p className="text-slate-600">Lunch starting at <strong className="block text-sm text-slate-900">LKR {Number(lunchPrice).toLocaleString()}</strong></p>
                )}
                {dinnerPrice !== null && dinnerPrice !== undefined && (
                  <p className="text-slate-600">Dinner starting at <strong className="block text-sm text-slate-900">LKR {Number(dinnerPrice).toLocaleString()}</strong></p>
                )}
              </div>
            )}

            {/* =================================================
                RATING DATA CHECK
            ================================================== */}

            {/* HOTEL DINING HIGHLIGHT */}

            {cashCowDish &&
              cashCowDish.trim() !== "" && (
                <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50/60 p-3">

                  <div className="flex items-start gap-2">

                    <Utensils className="mt-0.5 h-4 w-4 shrink-0 text-[#806744]" />

                    <div className="min-w-0">

                      <p className="text-xs font-bold uppercase tracking-wide text-[#806744]">
                        Featured dish
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {cashCowDish}
                      </p>

                      {cashCowDescription &&
                        cashCowDescription.trim() !== "" && (
                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {cashCowDescription}
                          </p>
                        )}

                    </div>

                  </div>

                </div>
              )}

            {/* =================================================
                COMMUNITY REVIEWS
            ================================================== */}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">

              {/* REVIEW HEADER */}

              <div className="flex items-center justify-between gap-2">

                <div className="flex items-center gap-2">

                  <MessageSquare className="h-4 w-4 text-[#c5a46d]" />

                  <span className="text-xs font-bold uppercase tracking-wide text-slate-700">
                    Guest Reviews
                  </span>

                </div>

                {/* COMMUNITY AVERAGE */}

                {communityRating !== null &&
                  communityRating !== undefined &&
                  communityReviewCount !== null &&
                  communityReviewCount !== undefined &&
                  communityReviewCount > 0 && (
                    <div className="flex items-center gap-1">

                      <Star className="h-3.5 w-3.5 fill-[#c5a46d] text-[#c5a46d]" />

                      <span className="text-xs font-semibold text-slate-700">
                        {Number(
                          communityRating
                        ).toFixed(1)}
                      </span>

                    </div>
                  )}

              </div>

              {/* LATEST REVIEW */}

              {latestReview ? (
                <div className="mt-3">

                  <p className="line-clamp-3 text-xs italic leading-5 text-slate-600">
                    &ldquo;{latestReview}&rdquo;
                  </p>

                  {/* REVIEWER INFORMATION */}

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">

                    {latestReviewGuest ? (
                      <p className="text-[11px] font-semibold text-slate-700">
                        — {latestReviewGuest}
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400">
                        Guest
                      </p>
                    )}

                    {/* INDIVIDUAL REVIEW RATING */}

                    {formattedLatestReviewRating && (
                      <div className="flex items-center gap-1">

                        <Star className="h-3 w-3 fill-[#c5a46d] text-[#c5a46d]" />

                        <span className="text-[11px] font-semibold text-slate-600">
                          {formattedLatestReviewRating}
                        </span>

                      </div>
                    )}

                  </div>

                </div>
              ) : (
                <p className="mt-2 text-xs text-slate-400">
                  No community reviews yet.
                </p>
              )}

              {/* REVIEW COUNT */}

              {communityReviewCount !== null &&
                communityReviewCount !== undefined &&
                communityReviewCount > 0 && (
                  <p className="mt-2 text-[11px] text-slate-400">
                    {communityReviewCount}{" "}
                    {communityReviewCount ===
                    1
                      ? "review"
                      : "reviews"}
                  </p>
                )}

            </div>

          </div>

          {/* =================================================
              COMPARISON + VIEW DETAILS
          ================================================== */}

          <div className="mt-5 grid grid-cols-2 gap-2">

            {/* COMPARE */}

            {onToggleCompare && (
              <button
                type="button"
                onClick={
                  onToggleCompare
                }
                disabled={
                  compareDisabled &&
                  !isSelectedForComparison
                }
                aria-pressed={
                  isSelectedForComparison
                }
                className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                  isSelectedForComparison
                    ? "border-[#c5a46d] bg-[#c5a46d] text-[#0b1728] shadow-sm"
                    : compareDisabled
                      ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[#c5a46d] hover:text-[#806744]"
                }`}
              >

                <GitCompare className="h-4 w-4" />

                {isSelectedForComparison
                  ? "Selected"
                  : "Compare"}

              </button>
            )}

            {/* VIEW DETAILS */}

            <Link
              href={`/hotels/${hotelId}`}
              className={`flex items-center justify-center gap-2 rounded-xl border border-[#c5a46d] px-3 py-2.5 text-sm font-semibold text-[#806744] transition hover:bg-[#c5a46d] hover:text-[#0b1728] ${
                !onToggleCompare
                  ? "col-span-2"
                  : ""
              }`}
            >
              View Details

              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

          </div>

        </div>

      </div>

    </article>
  );
}
