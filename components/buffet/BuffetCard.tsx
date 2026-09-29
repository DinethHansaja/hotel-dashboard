"use client";

import Link from "next/link";

import {
  Heart,
  Star,
  Clock3,
  CalendarDays,
  ArrowRight,
  ExternalLink,
  Utensils,
  CheckCircle2,
  MessageSquare,
  GitCompare,
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

  // Phase 1
  mealType?: string | null;
  googleReviewUrl?: string | null;
  rateVerifiedAt?: string | null;
  cashCowDish?: string | null;
  cashCowDescription?: string | null;

  // Community reviews
  communityRating?: number | null;
  communityReviewCount?: number | null;
  latestReview?: string | null;

  // Comparison
  isSelectedForComparison?: boolean;
  onToggleCompare?: () => void;
  compareDisabled?: boolean;
};

function getVerifiedText(
  dateString?: string | null
) {
  if (!dateString) {
    return null;
  }

  const verifiedDate = new Date(dateString);

  if (Number.isNaN(verifiedDate.getTime())) {
    return null;
  }

  const now = new Date();

  const differenceMs =
    now.getTime() -
    verifiedDate.getTime();

  if (differenceMs < 0) {
    return "Rates recently verified";
  }

  const minutes = Math.floor(
    differenceMs / (1000 * 60)
  );

  if (minutes < 60) {
    return `Rates last verified ${Math.max(
      minutes,
      1
    )} min ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `Rates last verified ${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 30) {
    return `Rates last verified ${days}d ago`;
  }

  const months = Math.floor(days / 30);

  return `Rates last verified ${months}mo ago`;
}

function getGoogleReviewUrl(
  hotelName: string,
  googleReviewUrl?: string | null
) {
  if (googleReviewUrl) {
    return googleReviewUrl;
  }

  return `https://www.google.com/search?q=${encodeURIComponent(
    `${hotelName} Google Reviews`
  )}`;
}

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
  mealType,
  googleReviewUrl,
  rateVerifiedAt,
  cashCowDish,
  cashCowDescription,
  communityRating,
  communityReviewCount,
  latestReview,

  // Comparison
  isSelectedForComparison = false,
  onToggleCompare,
  compareDisabled = false,
}: BuffetCardProps) {
  const verifiedText =
    getVerifiedText(rateVerifiedAt);

  const googleUrl = getGoogleReviewUrl(
    hotelName,
    googleReviewUrl
  );

  const displayCommunityRating =
    communityRating ?? rating;

  const displayCommunityReviewCount =
    communityReviewCount ?? reviewCount;

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isSelectedForComparison
          ? "border-[#c79a45] ring-2 ring-[#c79a45]/20"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      {/* IMAGE */}

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

        {/* Popular */}

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

        {/* Comparison selected badge */}

        {isSelectedForComparison && (
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#9a742e] shadow-md">
            <GitCompare className="h-3.5 w-3.5" />

            Selected for comparison
          </div>
        )}
      </div>

      {/* CONTENT */}

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

          {/* RATING */}

          <div className="mt-4 flex flex-wrap items-center gap-2">
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

            <span className="text-slate-300">
              |
            </span>

            {/* GOOGLE REVIEWS */}

            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 transition hover:text-blue-800 hover:underline"
            >
              Google Reviews

              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* DESCRIPTION */}

          {description && (
            <p className="mt-3 line-clamp-2 text-sm leading-5 text-slate-500">
              {description}
            </p>
          )}
        </div>

        {/* BOTTOM */}

        <div className="mt-auto pt-6">
          <div className="space-y-3">

            {/* MEAL TYPE */}

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Utensils className="h-4 w-4 shrink-0 text-[#c79a45]" />

              <span>
                {mealType
                  ? `${mealType} Buffet`
                  : "Buffet Experience"}
              </span>
            </div>

            {/* BUFFET TIME */}

            {buffetTime && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock3 className="h-4 w-4 shrink-0 text-[#c79a45]" />

                <span>
                  {buffetTime}
                </span>
              </div>
            )}

            {/* BUFFET TYPE */}

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <CalendarDays className="h-4 w-4 shrink-0 text-[#c79a45]" />

              <span>
                Buffet Experience
              </span>
            </div>

            {/* RATE VERIFIED */}

            {verifiedText && (
              <div className="flex items-center gap-2 text-xs text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />

                <span>
                  {verifiedText}
                </span>
              </div>
            )}

            {/* CASH COW DISH */}

            <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50/60 p-3">
              <div className="flex items-start gap-2">

                <span className="mt-0.5 text-base">
                  🐄
                </span>

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#9a742e]">
                    Cash Cow Dish
                  </p>

                  {cashCowDish ? (
                    <>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {cashCowDish}
                      </p>

                      {cashCowDescription && (
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {cashCowDescription}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="mt-1 text-xs text-slate-500">
                      Popular dish information coming soon.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* COMMUNITY REVIEWS */}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">

              <div className="flex items-center justify-between gap-2">

                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-[#c79a45]" />

                  <span className="text-xs font-bold uppercase tracking-wide text-slate-700">
                    Guest Reviews
                  </span>
                </div>

                {displayCommunityRating !== null &&
                  displayCommunityRating !==
                    undefined && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-[#c79a45] text-[#c79a45]" />

                      <span className="text-xs font-semibold text-slate-700">
                        {displayCommunityRating}
                      </span>
                    </div>
                  )}
              </div>

              {latestReview ? (
                <p className="mt-2 line-clamp-2 text-xs italic leading-5 text-slate-500">
                  "{latestReview}"
                </p>
              ) : (
                <p className="mt-2 text-xs text-slate-400">
                  Guest reviews coming soon.
                </p>
              )}

              {displayCommunityReviewCount !==
                null &&
                displayCommunityReviewCount !==
                  undefined && (
                  <p className="mt-2 text-[11px] text-slate-400">
                    {displayCommunityReviewCount} review
                    {displayCommunityReviewCount ===
                    1
                      ? ""
                      : "s"}
                  </p>
                )}
            </div>
          </div>

          {/* COMPARISON + VIEW DETAILS */}

          <div className="mt-5 grid grid-cols-2 gap-2">

            {/* COMPARE */}

            {onToggleCompare && (
              <button
                type="button"
                onClick={onToggleCompare}
                disabled={
                  compareDisabled &&
                  !isSelectedForComparison
                }
                aria-pressed={
                  isSelectedForComparison
                }
                className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                  isSelectedForComparison
                    ? "border-[#c79a45] bg-[#c79a45] text-white shadow-sm"
                    : compareDisabled
                      ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[#c79a45] hover:text-[#9a742e]"
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
              className={`flex items-center justify-center gap-2 rounded-xl border border-[#c79a45] px-3 py-2.5 text-sm font-semibold text-[#9a742e] transition hover:bg-[#c79a45] hover:text-white ${
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