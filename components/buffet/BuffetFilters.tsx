"use client";

import {
  SlidersHorizontal,
  ChevronDown,
  X,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function BuffetFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const currentSort =
    searchParams.get("sort") || "popular";

  const currentPrice =
    searchParams.get("price") || "all";

  const currentCuisine =
    searchParams.get("cuisine") || "all";

  const currentRating =
    searchParams.get("rating") || "all";

  const currentAvailability =
    searchParams.get("availability") || "all";

  const updateFilter = (
    key: string,
    value: string
  ) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (value === "all" || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    // Always go back to page 1 when filtering
    params.delete("page");

    const queryString = params.toString();

    router.push(
      queryString
        ? `/buffet?${queryString}`
        : "/buffet"
    );
  };

  const handleSortChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    updateFilter("sort", event.target.value);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();

    const search = searchParams.get("search");

    if (search) {
      params.set("search", search);
    }

    const sort = searchParams.get("sort");

    if (sort) {
      params.set("sort", sort);
    }

    const queryString = params.toString();

    router.push(
      queryString
        ? `/buffet?${queryString}`
        : "/buffet"
    );
  };

  const hasExtraFilters =
    currentAvailability !== "all";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">

        {/* ============================= */}
        {/* SORT */}
        {/* ============================= */}

        <div className="relative">
          <select
            value={currentSort}
            onChange={handleSortChange}
            aria-label="Sort hotels"
            className="h-[50px] min-w-[190px] cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-700 outline-none transition hover:border-[#c79a45] focus:border-[#c79a45] focus:ring-2 focus:ring-[#c79a45]/20"
          >
            <option value="popular">
              Most Popular
            </option>

            <option value="rating-desc">
              Rating: High to Low
            </option>

            <option value="rating-asc">
              Rating: Low to High
            </option>

            <option value="price-asc">
              Price: Low to High
            </option>

            <option value="price-desc">
              Price: High to Low
            </option>

            <option value="name-asc">
              Hotel Name: A → Z
            </option>

            <option value="name-desc">
              Hotel Name: Z → A
            </option>
          </select>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <span className="pointer-events-none absolute left-4 top-[-7px] bg-white px-1 text-[11px] text-slate-400">
            Sort by
          </span>
        </div>

        {/* ============================= */}
        {/* PRICE */}
        {/* ============================= */}

        <div className="relative">
          <select
            value={currentPrice}
            onChange={(e) =>
              updateFilter(
                "price",
                e.target.value
              )
            }
            aria-label="Filter by price"
            className="h-[50px] min-w-[165px] cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-700 outline-none transition hover:border-[#c79a45] focus:border-[#c79a45] focus:ring-2 focus:ring-[#c79a45]/20"
          >
            <option value="all">
              All Prices
            </option>

            <option value="under-3000">
              Under LKR 3,000
            </option>

            <option value="3000-4000">
              LKR 3,000 - 4,000
            </option>

            <option value="4000-5000">
              LKR 4,000 - 5,000
            </option>

            <option value="5000-7500">
              LKR 5,000 - 7,500
            </option>

            <option value="7500-plus">
              LKR 7,500+
            </option>
          </select>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <span className="pointer-events-none absolute left-4 top-[-7px] bg-white px-1 text-[11px] text-slate-400">
            Price
          </span>
        </div>

        {/* ============================= */}
        {/* CUISINE */}
        {/* ============================= */}

        <div className="relative">
          <select
            value={currentCuisine}
            onChange={(e) =>
              updateFilter(
                "cuisine",
                e.target.value
              )
            }
            aria-label="Filter by cuisine"
            className="h-[50px] min-w-[170px] cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-700 outline-none transition hover:border-[#c79a45] focus:border-[#c79a45] focus:ring-2 focus:ring-[#c79a45]/20"
          >
            <option value="all">
              All Varieties
            </option>

            <option value="international">
              International
            </option>

            <option value="asian">
              Asian
            </option>

            <option value="indian">
              Indian
            </option>

            <option value="chinese">
              Chinese
            </option>

            <option value="japanese">
              Japanese
            </option>

            <option value="italian">
              Italian
            </option>

            <option value="seafood">
              Seafood
            </option>

            <option value="local">
              Sri Lankan
            </option>
          </select>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <span className="pointer-events-none absolute left-4 top-[-7px] bg-white px-1 text-[11px] text-slate-400">
            Cuisine
          </span>
        </div>

        {/* ============================= */}
        {/* RATING */}
        {/* ============================= */}

        <div className="relative">
          <select
            value={currentRating}
            onChange={(e) =>
              updateFilter(
                "rating",
                e.target.value
              )
            }
            aria-label="Filter by rating"
            className="h-[50px] min-w-[165px] cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-700 outline-none transition hover:border-[#c79a45] focus:border-[#c79a45] focus:ring-2 focus:ring-[#c79a45]/20"
          >
            <option value="all">
              All Ratings
            </option>

            <option value="4.5">
              4.5+ Stars
            </option>

            <option value="4">
              4.0+ Stars
            </option>

            <option value="3.5">
              3.5+ Stars
            </option>

            <option value="3">
              3.0+ Stars
            </option>
          </select>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <span className="pointer-events-none absolute left-4 top-[-7px] bg-white px-1 text-[11px] text-slate-400">
            Rating
          </span>
        </div>

        {/* ============================= */}
        {/* MORE FILTERS */}
        {/* ============================= */}

        <button
          type="button"
          onClick={() =>
            setShowMoreFilters(
              !showMoreFilters
            )
          }
          className={`flex h-[50px] items-center gap-2 rounded-xl border px-5 text-sm font-medium transition ${
            hasExtraFilters
              ? "border-[#c79a45] bg-[#c79a45]/10 text-[#9a742e]"
              : "border-slate-200 text-slate-700 hover:border-[#c79a45] hover:text-[#9a742e]"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />

          More Filters

          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              showMoreFilters
                ? "rotate-180"
                : ""
            }`}
          />
        </button>
      </div>

      {/* ============================= */}
      {/* MORE FILTERS PANEL */}
      {/* ============================= */}

      {showMoreFilters && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap items-end gap-4">

            {/* Buffet Availability */}

            <div className="min-w-[220px]">
              <label className="mb-2 block text-xs font-medium text-slate-500">
                Buffet Availability
              </label>

              <div className="relative">
                <select
                  value={currentAvailability}
                  onChange={(e) =>
                    updateFilter(
                      "availability",
                      e.target.value
                    )
                  }
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-700 outline-none focus:border-[#c79a45] focus:ring-2 focus:ring-[#c79a45]/20"
                >
                  <option value="all">
                    All Buffets
                  </option>

                  <option value="available">
                    Buffet Time Available
                  </option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Active Filters */}

            <button
              type="button"
              onClick={clearAllFilters}
              className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              <X className="h-4 w-4" />

              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}