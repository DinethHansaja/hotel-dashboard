"use client";

import { SlidersHorizontal, ChevronDown } from "lucide-react";

export default function BuffetFilters() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        {/* Sort */}
        <button className="flex min-w-[150px] items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:border-[#c79a45]">
          <span>
            <span className="mr-2 text-slate-400">Sort by</span>
            Most Popular
          </span>

          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>

        {/* Price */}
        <button className="flex min-w-[150px] items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:border-[#c79a45]">
          <span>
            <span className="mr-2 text-slate-400">Price</span>
            All Prices
          </span>

          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>

        {/* Cuisine */}
        <button className="flex min-w-[160px] items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:border-[#c79a45]">
          <span>
            <span className="mr-2 text-slate-400">Cuisine</span>
            All Varieties
          </span>

          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>

        {/* Ratings */}
        <button className="flex min-w-[150px] items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:border-[#c79a45]">
          <span>
            <span className="mr-2 text-slate-400">Rating</span>
            All Ratings
          </span>

          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>

        {/* More filters */}
        <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-[#c79a45] hover:text-[#9a742e]">
          <SlidersHorizontal className="h-4 w-4" />
          More Filters
        </button>
      </div>
    </div>
  );
}