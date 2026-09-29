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
  useRef,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

type City = {
  name: string;
  country: string;
  available: boolean;
};

const cities: City[] = [
  {
    name: "Colombo",
    country: "Sri Lanka",
    available: true,
  },
  {
    name: "Kandy",
    country: "Sri Lanka",
    available: false,
  },
  {
    name: "Galle",
    country: "Sri Lanka",
    available: false,
  },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const existingSearch =
    searchParams.get("search") || "";

  const [search, setSearch] =
    useState(existingSearch);

  const [selectedCity, setSelectedCity] =
    useState("Colombo");

  const [cityOpen, setCityOpen] =
    useState(false);

  const cityRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearch(existingSearch);
  }, [existingSearch]);

  // Close city dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        cityRef.current &&
        !cityRef.current.contains(
          event.target as Node
        )
      ) {
        setCityOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

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

  const handleCitySelect = (
    city: City
  ) => {
    // Coming-soon cities cannot be selected
    if (!city.available) {
      return;
    }

    setSelectedCity(city.name);
    setCityOpen(false);
  };

  return (
    <header className="z-40 shrink-0 border-b border-slate-200 bg-white">
      <div className="flex h-[76px] items-center gap-4 px-5 md:px-8">

        {/* ============================= */}
        {/* LOCATION / CITY SELECTOR */}
        {/* ============================= */}

        <div
          ref={cityRef}
          className="relative hidden shrink-0 md:block"
        >
          <button
            type="button"
            onClick={() =>
              setCityOpen(
                (previous) => !previous
              )
            }
            aria-haspopup="listbox"
            aria-expanded={cityOpen}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-[#c79a45] hover:shadow-md"
          >
            <MapPin className="h-5 w-5 text-[#b88b3d]" />

            <div className="text-left">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Location
              </p>

              <p className="text-sm font-medium text-slate-700">
                {selectedCity}, Sri Lanka
              </p>
            </div>

            <ChevronDown
              className={`h-4 w-4 text-slate-500 transition-transform ${
                cityOpen
                  ? "rotate-180"
                  : ""
              }`}
            />
          </button>

          {/* ============================= */}
          {/* CITY DROPDOWN */}
          {/* ============================= */}

          {cityOpen && (
            <div
              role="listbox"
              className="absolute left-0 top-[calc(100%+8px)] z-50 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
            >
              {/* Header */}

              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Select City
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Choose a destination for your
                  buffet guide
                </p>
              </div>

              {/* Cities */}

              <div className="p-2">
                {cities.map((city) => {
                  const isSelected =
                    selectedCity ===
                    city.name;

                  return (
                    <button
                      key={city.name}
                      type="button"
                      role="option"
                      aria-selected={
                        isSelected
                      }
                      disabled={
                        !city.available
                      }
                      onClick={() =>
                        handleCitySelect(
                          city
                        )
                      }
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition ${
                        city.available
                          ? "cursor-pointer hover:bg-slate-50"
                          : "cursor-not-allowed opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                            isSelected
                              ? "bg-[#d4a84f]/15"
                              : "bg-slate-100"
                          }`}
                        >
                          <MapPin
                            className={`h-4 w-4 ${
                              isSelected
                                ? "text-[#b88b3d]"
                                : "text-slate-400"
                            }`}
                          />
                        </div>

                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {city.name}
                          </p>

                          <p className="text-xs text-slate-400">
                            {city.country}
                          </p>
                        </div>
                      </div>

                      {/* Status */}

                      {city.available ? (
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                            isSelected
                              ? "bg-[#d4a84f]/15 text-[#9a742e]"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {isSelected
                            ? "Selected"
                            : "Available"}
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                          Coming Soon
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Coming Soon Message */}

              <div className="border-t border-slate-100 bg-slate-50 px-4 py-3">
                <p className="text-xs leading-relaxed text-slate-500">
                  More cities will be added to
                  the buffet guide soon.
                </p>
              </div>
            </div>
          )}
        </div>

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