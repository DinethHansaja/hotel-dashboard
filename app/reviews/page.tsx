"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Search,
  Star,
  MapPin,
  Utensils,
  BedDouble,
  MessageSquareText,
  SlidersHorizontal,
  PenLine,
  X,
  CalendarDays,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import WriteReviewModal from "@/components/reviews/WriteReviewModal";

type Hotel = {
  hotel_id?: number | string;
  hotel_name?: string;
  restaurant_name?: string;
  image_url?: string;
  description?: string;
  rating?: number | string;
  Rating?: number | string;
  review_count?: number | string;
  address?: string;
};

type Review = {
  review_id: number;
  hotel_id: number;
  review_type: "dining" | "stay";
  guest_name: string;
  rating: number;
  review_text: string;
  visit_date?: string | null;
  created_at: string;
};

type ReviewType = "all" | "dining" | "stay";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80";

function getRating(hotel: Hotel) {
  const value = hotel.rating ?? hotel.Rating ?? 0;
  const rating = Number(value);

  return Number.isFinite(rating) ? rating : 0;
}

function getHotelId(hotel: Hotel, index: number) {
  return String(
    hotel.hotel_id ?? `${hotel.hotel_name}-${index}`
  );
}

function formatDate(date: string | null | undefined) {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ReviewsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [search, setSearch] = useState("");
  const [reviewType, setReviewType] =
    useState<ReviewType>("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  const [showReviewModal, setShowReviewModal] =
    useState(false);

  // --------------------------------------------------
  // LOAD DATA
  // --------------------------------------------------

  async function loadData() {
    setLoading(true);
    setErrorMessage("");

    const [
      { data: hotelData, error: hotelError },
      { data: reviewData, error: reviewError },
    ] = await Promise.all([
      supabase
        .from("hotels")
        .select("*")
        .order("hotel_name", {
          ascending: true,
        }),

      supabase
        .from("reviews")
        .select("*")
        .order("created_at", {
          ascending: false,
        }),
    ]);

    if (hotelError) {
      console.error(
        "Error loading hotels:",
        hotelError
      );

      setErrorMessage(
        "We couldn't load the hotel information right now."
      );

      setHotels([]);
    } else {
      setHotels(hotelData ?? []);
    }

    if (reviewError) {
      console.error(
        "Error loading reviews:",
        reviewError
      );

      /*
       * We still allow the hotel page to work if the
       * reviews table cannot be read.
       */
      setReviews([]);
    } else {
      setReviews(
        (reviewData ?? []) as Review[]
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  // --------------------------------------------------
  // FILTER HOTELS
  // --------------------------------------------------

  const filteredHotels = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return hotels.filter((hotel) => {
      const hotelName =
        hotel.hotel_name?.toLowerCase() ?? "";

      const restaurantName =
        hotel.restaurant_name?.toLowerCase() ?? "";

      const address =
        hotel.address?.toLowerCase() ?? "";

      const matchesSearch =
        !searchValue ||
        hotelName.includes(searchValue) ||
        restaurantName.includes(searchValue) ||
        address.includes(searchValue);

      const rating = getRating(hotel);

      const matchesRating =
        ratingFilter === "all" ||
        (ratingFilter === "4+" && rating >= 4) ||
        (ratingFilter === "4.5+" && rating >= 4.5);

      return matchesSearch && matchesRating;
    });
  }, [
    hotels,
    search,
    ratingFilter,
  ]);

  // --------------------------------------------------
  // HOTEL RATING SUMMARY
  // --------------------------------------------------

  const averageRating = useMemo(() => {
    if (!hotels.length) return 0;

    const ratedHotels = hotels.filter(
      (hotel) => getRating(hotel) > 0
    );

    if (!ratedHotels.length) return 0;

    const total = ratedHotels.reduce(
      (sum, hotel) =>
        sum + getRating(hotel),
      0
    );

    return total / ratedHotels.length;
  }, [hotels]);

  // --------------------------------------------------
  // COMMUNITY REVIEW SUMMARY
  // --------------------------------------------------

  const communityAverage = useMemo(() => {
    if (!reviews.length) return 0;

    const total = reviews.reduce(
      (sum, review) =>
        sum + Number(review.rating),
      0
    );

    return total / reviews.length;
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      if (
        reviewType !== "all" &&
        review.review_type !== reviewType
      ) {
        return false;
      }

      return true;
    });
  }, [reviews, reviewType]);

  // --------------------------------------------------
  // REVIEWS BY HOTEL
  // --------------------------------------------------

  const reviewsByHotel = useMemo(() => {
    const map = new Map<number, Review[]>();

    reviews.forEach((review) => {
      const existing =
        map.get(review.hotel_id) ?? [];

      existing.push(review);

      map.set(review.hotel_id, existing);
    });

    return map;
  }, [reviews]);

  // --------------------------------------------------
  // CLEAR FILTERS
  // --------------------------------------------------

  function clearFilters() {
    setSearch("");
    setReviewType("all");
    setRatingFilter("all");
  }

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-slate-900">
      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative overflow-hidden bg-[#091423]">
        <div className="absolute inset-0">
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#d1a044]/10 blur-3xl" />

          <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d1a044]/30 bg-[#d1a044]/10 px-4 py-2 text-sm font-medium text-[#e3bd6d]">
              <MessageSquareText className="h-4 w-4" />

              Dining & Stay Reviews
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Discover what guests

              <span className="block text-[#d1a044]">
                think about Colombo hotels.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Explore hotel ratings and real guest
              experiences across Colombo. Share your own
              dining or stay experience with other visitors.
            </p>
          </div>

          {/* SEARCH */}
          <div className="mt-10 max-w-3xl">
            <div className="flex items-center rounded-2xl border border-white/10 bg-white p-2 shadow-2xl">
              <Search className="ml-3 h-5 w-5 shrink-0 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search hotels, restaurants or locations..."
                className="w-full bg-transparent px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mr-2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          OVERVIEW
      ================================================== */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Guest feedback across our hotel collection
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-5">
                {/* HOTEL RATING */}
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-[#d1a044] text-[#d1a044]" />

                  <span className="text-xl font-bold text-[#091423]">
                    {averageRating > 0
                      ? averageRating.toFixed(1)
                      : "—"}
                  </span>

                  <span className="text-sm text-slate-500">
                    hotel average
                  </span>
                </div>

                <div className="hidden h-5 w-px bg-slate-200 sm:block" />

                {/* HOTELS */}
                <div className="text-sm text-slate-500">
                  <span className="font-semibold text-slate-900">
                    {hotels.length}
                  </span>{" "}
                  hotels
                </div>

                <div className="hidden h-5 w-px bg-slate-200 sm:block" />

                {/* COMMUNITY REVIEWS */}
                <div className="flex items-center gap-2">
                  <MessageSquareText className="h-4 w-4 text-[#d1a044]" />

                  <span className="text-sm text-slate-500">
                    <span className="font-semibold text-slate-900">
                      {reviews.length}
                    </span>{" "}
                    guest reviews
                  </span>
                </div>

                {reviews.length > 0 && (
                  <>
                    <div className="hidden h-5 w-px bg-slate-200 sm:block" />

                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-[#d1a044] text-[#d1a044]" />

                      <span className="text-sm text-slate-500">
                        <span className="font-semibold text-slate-900">
                          {communityAverage.toFixed(1)}
                        </span>{" "}
                        community rating
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* WRITE REVIEW */}
            <button
              type="button"
              onClick={() =>
                setShowReviewModal(true)
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#091423] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#12233a]"
            >
              <PenLine className="h-4 w-4" />

              Write a Review
            </button>
          </div>
        </div>
      </section>

      {/* ==================================================
          FILTERS
      ================================================== */}

      <section className="sticky top-0 z-20 border-b border-slate-200 bg-[#f7f8fa]/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            {/* TYPE */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="mr-1 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <SlidersHorizontal className="h-4 w-4" />

                Reviews
              </div>

              {[
                {
                  value: "all",
                  label: "All",
                },
                {
                  value: "dining",
                  label: "Dining",
                },
                {
                  value: "stay",
                  label: "Stay",
                },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    setReviewType(
                      item.value as ReviewType
                    )
                  }
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    reviewType === item.value
                      ? "bg-[#091423] text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* RATING */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-sm font-medium text-slate-500">
                Hotel Rating
              </span>

              {[
                {
                  value: "all",
                  label: "All ratings",
                },
                {
                  value: "4+",
                  label: "4.0+",
                },
                {
                  value: "4.5+",
                  label: "4.5+",
                },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    setRatingFilter(item.value)
                  }
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    ratingFilter === item.value
                      ? "border border-[#d1a044] bg-[#d1a044]/10 text-[#8a651c]"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {(search ||
                reviewType !== "all" ||
                ratingFilter !== "all") && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="ml-1 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#091423]">
              {reviewType === "dining"
                ? "Dining experiences"
                : reviewType === "stay"
                  ? "Stay experiences"
                  : "Hotel reviews"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredHotels.length}{" "}
              {filteredHotels.length === 1
                ? "hotel"
                : "hotels"}{" "}
              available
            </p>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <div className="h-56 animate-pulse bg-slate-200" />

                  <div className="space-y-4 p-6">
                    <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />

                    <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />

                    <div className="h-12 animate-pulse rounded bg-slate-100" />

                    <div className="h-10 animate-pulse rounded bg-slate-200" />
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* ERROR */}
        {!loading && errorMessage && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h3 className="font-semibold text-red-900">
              Unable to load hotels
            </h3>

            <p className="mt-2 text-sm text-red-700">
              {errorMessage}
            </p>
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !errorMessage &&
          filteredHotels.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <Search className="h-6 w-6 text-slate-500" />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-[#091423]">
                No hotels found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Try changing your search or removing one
                of the filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-[#091423] px-5 py-3 text-sm font-semibold text-white"
              >
                Clear filters
              </button>
            </div>
          )}

        {/* HOTEL CARDS */}
        {!loading &&
          !errorMessage &&
          filteredHotels.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredHotels.map(
                (hotel, index) => {
                  const rating =
                    getRating(hotel);

                  const hotelId =
                    Number(hotel.hotel_id);

                  const hotelReviews =
                    reviewsByHotel.get(
                      hotelId
                    ) ?? [];

                  const visibleReviews =
                    hotelReviews.filter(
                      (review) =>
                        reviewType === "all" ||
                        review.review_type ===
                          reviewType
                    );

                  return (
                    <article
                      key={getHotelId(
                        hotel,
                        index
                      )}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      {/* IMAGE */}
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={
                            hotel.image_url ||
                            FALLBACK_IMAGE
                          }
                          alt={
                            hotel.hotel_name ||
                            "Colombo hotel"
                          }
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                          onError={(
                            event
                          ) => {
                            event.currentTarget.src =
                              FALLBACK_IMAGE;
                          }}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                        {/* RATING */}
                        <div className="absolute bottom-4 left-4">
                          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-[#091423] shadow-lg">
                            <Star className="h-4 w-4 fill-[#d1a044] text-[#d1a044]" />

                            {rating > 0
                              ? rating.toFixed(
                                  1
                                )
                              : "No rating"}
                          </div>
                        </div>

                        {/* TYPE */}
                        <div className="absolute right-4 top-4">
                          <span className="rounded-full border border-white/20 bg-[#091423]/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                            {reviewType ===
                            "dining"
                              ? "Dining"
                              : reviewType ===
                                  "stay"
                                ? "Stay"
                                : "Dining & Stay"}
                          </span>
                        </div>
                      </div>

                      {/* BODY */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold tracking-tight text-[#091423]">
                          {hotel.hotel_name ||
                            "Hotel"}
                        </h3>

                        {hotel.restaurant_name && (
                          <p className="mt-1 text-sm font-medium text-[#a47a27]">
                            {
                              hotel.restaurant_name
                            }
                          </p>
                        )}

                        {/* ADDRESS */}
                        {hotel.address && (
                          <div className="mt-4 flex items-start gap-2 text-sm text-slate-500">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#d1a044]" />

                            <span>
                              {hotel.address}
                            </span>
                          </div>
                        )}

                        {/* HOTEL RATING */}
                        <div className="mt-5 rounded-xl bg-[#f7f8fa] p-4">
                          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                            Hotel rating
                          </p>

                          <div className="mt-1 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-[#091423]">
                                {rating > 0
                                  ? rating.toFixed(
                                      1
                                    )
                                  : "—"}
                              </span>

                              {rating > 0 && (
                                <div className="flex items-center gap-0.5">
                                  {[1, 2, 3, 4, 5].map(
                                    (star) => (
                                      <Star
                                        key={
                                          star
                                        }
                                        className={`h-3.5 w-3.5 ${
                                          star <=
                                          Math.round(
                                            rating
                                          )
                                            ? "fill-[#d1a044] text-[#d1a044]"
                                            : "text-slate-300"
                                        }`}
                                      />
                                    )
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="text-right">
                              <p className="text-xs text-slate-400">
                                Community
                              </p>

                              <p className="mt-1 text-sm font-semibold text-slate-700">
                                {
                                  visibleReviews.length
                                }{" "}
                                reviews
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* EXPERIENCE TYPES */}
                        <div className="mt-5 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
                            <Utensils className="h-3.5 w-3.5 text-[#d1a044]" />

                            Dining
                          </span>

                          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
                            <BedDouble className="h-3.5 w-3.5 text-[#d1a044]" />

                            Stay
                          </span>
                        </div>

                        {/* DESCRIPTION */}
                        {hotel.description && (
                          <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-500">
                            {hotel.description}
                          </p>
                        )}

                        {/* COMMUNITY REVIEWS */}
                        {visibleReviews.length >
                          0 && (
                          <div className="mt-6 border-t border-slate-100 pt-5">
                            <div className="mb-4 flex items-center justify-between">
                              <p className="text-sm font-semibold text-[#091423]">
                                Recent guest reviews
                              </p>

                              <span className="text-xs text-slate-400">
                                {
                                  visibleReviews.length
                                }{" "}
                                total
                              </span>
                            </div>

                            <div className="space-y-4">
                              {visibleReviews
                                .slice(0, 2)
                                .map(
                                  (
                                    review
                                  ) => (
                                    <div
                                      key={
                                        review.review_id
                                      }
                                      className="rounded-xl bg-[#f7f8fa] p-4"
                                    >
                                      <div className="flex items-start justify-between gap-3">
                                        <div>
                                          <p className="text-sm font-semibold text-[#091423]">
                                            {
                                              review.guest_name
                                            }
                                          </p>

                                          <div className="mt-1 flex items-center gap-1">
                                            {[
                                              1,
                                              2,
                                              3,
                                              4,
                                              5,
                                            ].map(
                                              (
                                                star
                                              ) => (
                                                <Star
                                                  key={
                                                    star
                                                  }
                                                  className={`h-3.5 w-3.5 ${
                                                    star <=
                                                    review.rating
                                                      ? "fill-[#d1a044] text-[#d1a044]"
                                                      : "text-slate-300"
                                                  }`}
                                                />
                                              )
                                            )}
                                          </div>
                                        </div>

                                        <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold capitalize text-slate-500">
                                          {
                                            review.review_type
                                          }
                                        </span>
                                      </div>

                                      <p className="mt-3 text-sm leading-6 text-slate-600">
                                        {
                                          review.review_text
                                        }
                                      </p>

                                      {review.visit_date && (
                                        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                                          <CalendarDays className="h-3.5 w-3.5" />

                                          Visited{" "}
                                          {formatDate(
                                            review.visit_date
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )
                                )}
                            </div>
                          </div>
                        )}

                        {/* ACTIONS */}
                        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                          <button
                            type="button"
                            onClick={() =>
                              setShowReviewModal(
                                true
                              )
                            }
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#091423] transition hover:text-[#a47a27]"
                          >
                            <MessageSquareText className="h-4 w-4" />

                            Write a review
                          </button>

                          <span className="text-xs text-slate-400">
                            {visibleReviews.length >
                            0
                              ? `${visibleReviews.length} guest ${
                                  visibleReviews.length ===
                                  1
                                    ? "review"
                                    : "reviews"
                                }`
                              : "No guest reviews yet"}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}
      </section>

      {/* ==================================================
          INFORMATION SECTION
      ================================================== */}

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#a47a27]">
                About our reviews
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#091423]">
                Real hotel information,
                <span className="block">
                  real guest experiences.
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-500">
                Hotel ratings come from your existing hotel
                data, while written guest reviews are stored
                separately in our community review system.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-[#f7f8fa] p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#091423] text-white">
                  <Star className="h-5 w-5" />
                </div>

                <h3 className="mt-5 font-semibold text-[#091423]">
                  Hotel ratings
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Existing hotel ratings remain connected
                  to the hotel information in your database.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#f7f8fa] p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d1a044] text-[#091423]">
                  <MessageSquareText className="h-5 w-5" />
                </div>

                <h3 className="mt-5 font-semibold text-[#091423]">
                  Guest reviews
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Visitors can submit dining and stay
                  experiences directly through the website.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          WRITE REVIEW MODAL
      ================================================== */}

      <WriteReviewModal
        isOpen={showReviewModal}
        onClose={() =>
          setShowReviewModal(false)
        }
        onReviewSubmitted={loadData}
      />
    </main>
  );
}