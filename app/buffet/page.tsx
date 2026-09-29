import { supabase } from "@/lib/supabase";

import BuffetFilters from "@/components/buffet/BuffetFilters";
import BuffetGrid from "@/components/buffet/BuffetGrid";

type BuffetPageProps = {
  searchParams: Promise<{
    search?: string;
    sort?: string;
    price?: string;
    cuisine?: string;
    rating?: string;
    availability?: string;
  }>;
};

type Buffet = {
  hotel_id: number;
  hotel_name: string;
  restaurant_name?: string | null;
  image_url?: string | null;
  price?: number | null;
  rating?: number | null;
  review_count?: number | null;
  buffet_time?: string | null;
  description?: string | null;
  cuisine?: string | null;

  // Phase 1
  meal_type?: string | null;
  google_review_url?: string | null;
  rate_verified_at?: string | null;
  cash_cow_dish?: string | null;
  cash_cow_description?: string | null;

  // Community reviews
  community_rating?: number | null;
  community_review_count?: number | null;
  latest_review?: string | null;
};

type Schedule = {
  schedule_id: number;
  hotel_id: number;
  price_lkr?: number | null;
  buffet_time?: string | null;
  meal_type?: string | null;
};

type Review = {
  hotel_id: number;
  rating?: number | null;
  review_text?: string | null;
  created_at?: string | null;
};

export default async function BuffetPage({
  searchParams,
}: BuffetPageProps) {
  // ==================================================
  // 1. URL PARAMETERS
  // ==================================================

  const params = await searchParams;

  const search =
    params.search?.trim().toLowerCase() || "";

  const sort =
    params.sort || "popular";

  const priceFilter =
    params.price || "all";

  const cuisineFilter =
    params.cuisine || "all";

  const ratingFilter =
    params.rating || "all";

  const availabilityFilter =
    params.availability || "all";

  // ==================================================
  // 2. GET HOTELS
  // ==================================================

  /*
   * Only request the hotel columns required by
   * the buffet page.
   *
   * This is already optimized and is kept as-is.
   */

  const {
    data: hotels,
    error: hotelError,
  } = await supabase
    .from("hotels")
    .select(`
      hotel_id,
      hotel_name,
      restaurant_name,
      image_url,
      description,
      Rating,
      review_count,
      google_review_url,
      rate_verified_at,
      cash_cow_dish,
      cash_cow_description
    `)
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

  // ==================================================
  // 3. HOTEL IDS
  // ==================================================

  const hotelIds =
    hotels?.map(
      (hotel) => hotel.hotel_id
    ) ?? [];

  // ==================================================
  // 4. GET BUFFET SCHEDULES
  // ==================================================

  /*
   * PERFORMANCE IMPROVEMENT:
   *
   * Previously:
   *
   * .select("*")
   *
   * Now we only request the fields actually
   * required by this page.
   */

  const {
    data: schedules,
    error: scheduleError,
  } =
    hotelIds.length > 0
      ? await supabase
          .from("buffet_schedules")
          .select(`
            schedule_id,
            hotel_id,
            price_lkr,
            buffet_time,
            meal_type
          `)
          .in("hotel_id", hotelIds)
          .order("schedule_id")
      : {
          data: [],
          error: null,
        };

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

  // ==================================================
  // 5. GET COMMUNITY REVIEWS
  // ==================================================

  /*
   * PERFORMANCE IMPROVEMENT:
   *
   * The page only needs:
   * - hotel_id
   * - rating
   * - review_text
   * - created_at
   *
   * So there is no reason to download:
   * - review_id
   * - review_type
   * - guest_name
   * - visit_date
   */

  const {
    data: reviews,
    error: reviewError,
  } =
    hotelIds.length > 0
      ? await supabase
          .from("reviews")
          .select(`
            hotel_id,
            rating,
            review_text,
            created_at
          `)
          .in("hotel_id", hotelIds)
          .order("created_at", {
            ascending: false,
          })
      : {
          data: [],
          error: null,
        };

  /*
   * Reviews should not prevent the buffet page
   * from loading.
   */

  if (reviewError) {
    console.error(
      "Unable to load community reviews:",
      reviewError.message
    );
  }

  // ==================================================
  // 6. GROUP SCHEDULES BY HOTEL
  // ==================================================

  /*
   * Explicit Schedule[] type.
   *
   * This also prevents the TypeScript error that
   * previously occurred on:
   *
   * existing.push(schedule)
   */

  const schedulesByHotel =
    new Map<number, Schedule[]>();

  (schedules as Schedule[] | null)?.forEach(
    (schedule) => {
      const existing =
        schedulesByHotel.get(
          schedule.hotel_id
        ) ?? [];

      existing.push(schedule);

      schedulesByHotel.set(
        schedule.hotel_id,
        existing
      );
    }
  );

  // ==================================================
  // 7. GROUP REVIEWS BY HOTEL
  // ==================================================

  const reviewsByHotel =
    new Map<number, Review[]>();

  (reviews as Review[] | null)?.forEach(
    (review) => {
      if (
        review.hotel_id === null ||
        review.hotel_id === undefined
      ) {
        return;
      }

      const existing =
        reviewsByHotel.get(
          review.hotel_id
        ) ?? [];

      existing.push(review);

      reviewsByHotel.set(
        review.hotel_id,
        existing
      );
    }
  );

  // ==================================================
  // 8. PREPARE BUFFET DATA
  // ==================================================

  const buffets: Buffet[] =
    hotels?.map((hotel) => {
      const hotelSchedules =
        schedulesByHotel.get(
          hotel.hotel_id
        ) ?? [];

      const hotelReviews =
        reviewsByHotel.get(
          hotel.hotel_id
        ) ?? [];

      // ----------------------------------------------
      // Prices
      // ----------------------------------------------

      const pricedSchedules =
        hotelSchedules.filter(
          (schedule) =>
            schedule.price_lkr !== null &&
            schedule.price_lkr !== undefined
        );

      const lowestPrice =
        pricedSchedules.length > 0
          ? Math.min(
              ...pricedSchedules.map(
                (schedule) =>
                  Number(
                    schedule.price_lkr
                  )
              )
            )
          : null;

      // ----------------------------------------------
      // Buffet time
      // ----------------------------------------------

      const scheduleWithTime =
        hotelSchedules.find(
          (schedule) =>
            schedule.buffet_time &&
            String(
              schedule.buffet_time
            ).trim() !== ""
        );

      // ----------------------------------------------
      // Meal type
      // ----------------------------------------------

      const scheduleWithMeal =
        hotelSchedules.find(
          (schedule) =>
            schedule.meal_type &&
            String(
              schedule.meal_type
            ).trim() !== ""
        );

      // ----------------------------------------------
      // Hotel record
      // ----------------------------------------------

      const hotelRecord =
        hotel as unknown as Record<
          string,
          unknown
        >;

      // ----------------------------------------------
      // Cuisine
      // ----------------------------------------------

      /*
       * Keep the existing dynamic lookup.
       *
       * We are not adding a potentially incorrect
       * cuisine column to the Supabase SELECT until
       * the exact database column is confirmed.
       */

      const cuisineValue =
        hotelRecord.cuisine ??
        hotelRecord.cuisine_type ??
        hotelRecord.food_type ??
        null;

      // ----------------------------------------------
      // Google Review URL
      // ----------------------------------------------

      const googleReviewUrl =
        hotelRecord.google_review_url
          ? String(
              hotelRecord.google_review_url
            )
          : null;

      // ----------------------------------------------
      // Rate verification
      // ----------------------------------------------

      const rateVerifiedAt =
        hotelRecord.rate_verified_at
          ? String(
              hotelRecord.rate_verified_at
            )
          : null;

      // ----------------------------------------------
      // Cash Cow Dish
      // ----------------------------------------------

      const cashCowDish =
        hotelRecord.cash_cow_dish
          ? String(
              hotelRecord.cash_cow_dish
            )
          : null;

      const cashCowDescription =
        hotelRecord.cash_cow_description
          ? String(
              hotelRecord.cash_cow_description
            )
          : null;

      // ----------------------------------------------
      // Community Reviews
      // ----------------------------------------------

      const validReviews =
        hotelReviews.filter(
          (review) =>
            review.rating !== null &&
            review.rating !== undefined &&
            !Number.isNaN(
              Number(review.rating)
            )
        );

      const reviewRatings =
        validReviews.map((review) =>
          Number(review.rating)
        );

      const communityRating =
        reviewRatings.length > 0
          ? Number(
              (
                reviewRatings.reduce(
                  (sum, rating) =>
                    sum + rating,
                  0
                ) /
                reviewRatings.length
              ).toFixed(1)
            )
          : null;

      const communityReviewCount =
        hotelReviews.length > 0
          ? hotelReviews.length
          : null;

      /*
       * Reviews are ordered by created_at
       * descending, so the first review
       * is the latest review.
       */

      const latestReview =
        hotelReviews.length > 0
          ? hotelReviews[0]
          : null;

      // ----------------------------------------------
      // Return buffet
      // ----------------------------------------------

      return {
        hotel_id:
          hotel.hotel_id,

        hotel_name:
          hotel.hotel_name,

        restaurant_name:
          hotel.restaurant_name ??
          null,

        image_url:
          hotel.image_url ??
          null,

        price:
          lowestPrice,

        rating:
          hotel.Rating !== null &&
          hotel.Rating !== undefined
            ? Number(hotel.Rating)
            : null,

        review_count:
          hotel.review_count !== null &&
          hotel.review_count !== undefined
            ? Number(
                hotel.review_count
              )
            : null,

        buffet_time:
          scheduleWithTime?.buffet_time ??
          null,

        description:
          hotel.description ??
          null,

        cuisine:
          cuisineValue
            ? String(cuisineValue)
            : null,

        // ------------------------------------------
        // Phase 1
        // ------------------------------------------

        meal_type:
          scheduleWithMeal?.meal_type
            ? String(
                scheduleWithMeal.meal_type
              )
            : null,

        google_review_url:
          googleReviewUrl,

        rate_verified_at:
          rateVerifiedAt,

        cash_cow_dish:
          cashCowDish,

        cash_cow_description:
          cashCowDescription,

        // ------------------------------------------
        // Community reviews
        // ------------------------------------------

        community_rating:
          communityRating,

        community_review_count:
          communityReviewCount,

        latest_review:
          latestReview?.review_text
            ? String(
                latestReview.review_text
              )
            : null,
      };
    }) ?? [];

  // ==================================================
  // 9. SEARCH
  // ==================================================

  let filteredBuffets =
    buffets;

  if (search) {
    filteredBuffets =
      filteredBuffets.filter(
        (buffet) => {
          const hotelName =
            buffet.hotel_name
              ?.toLowerCase() || "";

          const restaurantName =
            buffet.restaurant_name
              ?.toLowerCase() || "";

          const description =
            buffet.description
              ?.toLowerCase() || "";

          const cuisine =
            buffet.cuisine
              ?.toLowerCase() || "";

          const mealType =
            buffet.meal_type
              ?.toLowerCase() || "";

          const cashCowDish =
            buffet.cash_cow_dish
              ?.toLowerCase() || "";

          return (
            hotelName.includes(search) ||
            restaurantName.includes(search) ||
            description.includes(search) ||
            cuisine.includes(search) ||
            mealType.includes(search) ||
            cashCowDish.includes(search)
          );
        }
      );
  }

  // ==================================================
  // 10. PRICE FILTER
  // ==================================================

  switch (priceFilter) {
    case "under-3000":
      filteredBuffets =
        filteredBuffets.filter(
          (buffet) =>
            buffet.price !== null &&
            buffet.price !== undefined &&
            buffet.price < 3000
        );
      break;

    case "3000-4000":
      filteredBuffets =
        filteredBuffets.filter(
          (buffet) =>
            buffet.price !== null &&
            buffet.price !== undefined &&
            buffet.price >= 3000 &&
            buffet.price < 4000
        );
      break;

    case "4000-5000":
      filteredBuffets =
        filteredBuffets.filter(
          (buffet) =>
            buffet.price !== null &&
            buffet.price !== undefined &&
            buffet.price >= 4000 &&
            buffet.price < 5000
        );
      break;

    case "5000-7500":
      filteredBuffets =
        filteredBuffets.filter(
          (buffet) =>
            buffet.price !== null &&
            buffet.price !== undefined &&
            buffet.price >= 5000 &&
            buffet.price < 7500
        );
      break;

    case "7500-plus":
      filteredBuffets =
        filteredBuffets.filter(
          (buffet) =>
            buffet.price !== null &&
            buffet.price !== undefined &&
            buffet.price >= 7500
        );
      break;

    default:
      break;
  }

  // ==================================================
  // 11. CUISINE FILTER
  // ==================================================

  if (cuisineFilter !== "all") {
    filteredBuffets =
      filteredBuffets.filter(
        (buffet) => {
          const cuisine =
            buffet.cuisine
              ?.toLowerCase() || "";

          const restaurant =
            buffet.restaurant_name
              ?.toLowerCase() || "";

          const description =
            buffet.description
              ?.toLowerCase() || "";

          const searchText =
            `${cuisine} ${restaurant} ${description}`;

          switch (cuisineFilter) {
            case "international":
              return (
                searchText.includes(
                  "international"
                ) ||
                searchText.includes(
                  "western"
                )
              );

            case "asian":
              return searchText.includes(
                "asian"
              );

            case "indian":
              return searchText.includes(
                "indian"
              );

            case "chinese":
              return searchText.includes(
                "chinese"
              );

            case "japanese":
              return searchText.includes(
                "japanese"
              );

            case "italian":
              return searchText.includes(
                "italian"
              );

            case "seafood":
              return searchText.includes(
                "seafood"
              );

            case "local":
              return (
                searchText.includes(
                  "sri lankan"
                ) ||
                searchText.includes(
                  "local"
                )
              );

            default:
              return true;
          }
        }
      );
  }

  // ==================================================
  // 12. RATING FILTER
  // ==================================================

  if (ratingFilter !== "all") {
    const minimumRating =
      Number(ratingFilter);

    if (
      !Number.isNaN(
        minimumRating
      )
    ) {
      filteredBuffets =
        filteredBuffets.filter(
          (buffet) =>
            buffet.rating !== null &&
            buffet.rating !== undefined &&
            buffet.rating >=
              minimumRating
        );
    }
  }

  // ==================================================
  // 13. AVAILABILITY FILTER
  // ==================================================

  if (
    availabilityFilter ===
    "available"
  ) {
    filteredBuffets =
      filteredBuffets.filter(
        (buffet) =>
          buffet.buffet_time !== null &&
          buffet.buffet_time !== undefined &&
          String(
            buffet.buffet_time
          ).trim() !== ""
      );
  }

  // ==================================================
  // 14. SORTING
  // ==================================================

  filteredBuffets =
    [...filteredBuffets].sort(
      (a, b) => {
        switch (sort) {
          case "rating-desc":
            return (
              (b.rating ?? -1) -
              (a.rating ?? -1)
            );

          case "rating-asc":
            return (
              (a.rating ??
                Number.MAX_VALUE) -
              (b.rating ??
                Number.MAX_VALUE)
            );

          case "price-asc":
            return (
              (a.price ??
                Number.MAX_VALUE) -
              (b.price ??
                Number.MAX_VALUE)
            );

          case "price-desc":
            return (
              (b.price ?? -1) -
              (a.price ?? -1)
            );

          case "name-asc":
            return a.hotel_name.localeCompare(
              b.hotel_name
            );

          case "name-desc":
            return b.hotel_name.localeCompare(
              a.hotel_name
            );

          case "popular":
          default:
            return 0;
        }
      }
    );

  // ==================================================
  // 15. PAGE UI
  // ==================================================

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-[1600px] p-5 md:p-8">

        {/* PAGE HEADER */}

        <div className="mb-7">

          {/* Breadcrumb */}

          <div className="mb-3 text-sm text-slate-400">
            Home

            <span className="mx-2">
              ›
            </span>

            <span className="text-slate-600">
              Buffet Guide
            </span>
          </div>

          {/* TITLE */}

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

            {/* COUNT */}

            <div className="rounded-xl bg-white px-4 py-3 text-sm shadow-sm ring-1 ring-slate-200">
              <span className="font-semibold text-slate-900">
                {filteredBuffets.length}
              </span>{" "}
              hotels available
            </div>

          </div>
        </div>

        {/* FILTERS */}

        <div className="mb-7">
          <BuffetFilters />
        </div>

        {/* HOTELS */}

        <BuffetGrid
          buffets={filteredBuffets}
        />

      </div>
    </main>
  );
}