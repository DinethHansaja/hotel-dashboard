"use client";

import {
  Bell,
  ChevronDown,
  MapPin,
  Search,
  User,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams =
    useSearchParams();

  const existingSearch =
    searchParams.get("search") || "";

  const [search, setSearch] =
    useState(existingSearch);

  useEffect(() => {
    setSearch(existingSearch);
  }, [existingSearch]);

  const handleSearch = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const value =
      search.trim();

    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (value) {
      params.set(
        "search",
        value
      );
    } else {
      params.delete("search");
    }

    // Always start from first result page
    params.delete("page");

    const queryString =
      params.toString();

    router.push(
      queryString
        ? `/buffet?${queryString}`
        : "/buffet"
    );
  };

  const clearSearch = () => {
    setSearch("");

    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.delete("search");
    params.delete("page");

    const queryString =
      params.toString();

    if (pathname === "/buffet") {
      router.push(
        queryString
          ? `/buffet?${queryString}`
          : "/buffet"
      );
    }
  };

  return (
    <header className="z-40 shrink-0 border-b border-slate-200 bg-white">
      <div className="flex h-[76px] items-center gap-4 px-5 md:px-8">

        {/* ============================= */}
        {/* LOCATION */}
        {/* ============================= */}

        <button
          type="button"
          className="hidden shrink-0 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-[#c79a45] hover:shadow-md md:flex"
        >
          <MapPin className="h-5 w-5 text-[#b88b3d]" />

          <span className="text-sm font-medium text-slate-700">
            Colombo, Sri Lanka
          </span>

          <ChevronDown className="h-4 w-4 text-slate-500" />
        </button>

        {/* ============================= */}
        {/* SEARCH */}
        {/* ============================= */}

        <form
          onSubmit={handleSearch}
          className="relative flex-1"
        >
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search for hotels, restaurants, cuisines..."
            aria-label="Search hotels, restaurants and cuisines"
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-24 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#c79a45] focus:bg-white focus:ring-2 focus:ring-[#c79a45]/20"
          />

          {/* Clear */}

          {search.length > 0 && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-12 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Search button */}

          <button
            type="submit"
            aria-label="Search"
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-[#9a742e]"
          >
            <Search className="h-5 w-5" />
          </button>
        </form>

        {/* ============================= */}
        {/* NOTIFICATIONS */}
        {/* ============================= */}

        <button
          type="button"
          aria-label="Notifications"
          className="relative hidden h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 sm:flex"
        >
          <Bell className="h-5 w-5" />

          <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-[#c79a45]" />
        </button>

        {/* ============================= */}
        {/* PROFILE */}
        {/* ============================= */}

        <button
          type="button"
          aria-label="Profile"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#d4a84f] text-white shadow-sm transition hover:bg-[#bd913d]"
        >
          <User className="h-5 w-5" />
        </button>

      </div>
    </header>
  );
}