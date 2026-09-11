"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import BuffetCard from "./BuffetCard";

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
};

type BuffetGridProps = {
  buffets: Buffet[];
};

const ITEMS_PER_PAGE = 6;

export default function BuffetGrid({
  buffets,
}: BuffetGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(
    buffets.length / ITEMS_PER_PAGE
  );

  const currentBuffets = useMemo(() => {
    const startIndex =
      (currentPage - 1) * ITEMS_PER_PAGE;

    return buffets.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [buffets, currentPage]);

  const startItem =
    buffets.length === 0
      ? 0
      : (currentPage - 1) * ITEMS_PER_PAGE + 1;

  const endItem = Math.min(
    currentPage * ITEMS_PER_PAGE,
    buffets.length
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (buffets.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">
          No hotels found
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Try changing your filters or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Results information */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-800">
            {startItem}-{endItem}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-800">
            {buffets.length}
          </span>{" "}
          hotels
        </p>

        {totalPages > 1 && (
          <p className="text-sm text-slate-400">
            Page{" "}
            <span className="font-medium text-slate-700">
              {currentPage}
            </span>{" "}
            of {totalPages}
          </p>
        )}
      </div>

      {/* Hotel Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {currentBuffets.map((buffet) => (
          <BuffetCard
            key={buffet.hotel_id}
            hotelId={buffet.hotel_id}
            hotelName={buffet.hotel_name}
            restaurantName={buffet.restaurant_name}
            imageUrl={buffet.image_url}
            price={buffet.price}
            rating={buffet.rating}
            reviewCount={buffet.review_count}
            buffetTime={buffet.buffet_time}
            description={buffet.description}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center pt-4">
          <div className="flex items-center gap-2">

            {/* Previous */}
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() =>
                goToPage(currentPage - 1)
              }
              className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:border-[#c79a45] hover:text-[#9a742e] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition ${
                    currentPage === page
                      ? "bg-[#c79a45] text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-[#c79a45] hover:text-[#9a742e]"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Next */}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() =>
                goToPage(currentPage + 1)
              }
              className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:border-[#c79a45] hover:text-[#9a742e] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>

          </div>
        </div>
      )}
    </div>
  );
}