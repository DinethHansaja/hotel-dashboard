"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  X,
  Star,
  Plus,
  GitCompare,
  Utensils,
  Clock3,
  BadgeDollarSign,
  MessageSquare,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type Hotel = {
  hotel_id?: number | string;
  hotel_name?: string | null;
  restaurant_name?: string | null;
  image_url?: string | null;
  description?: string | null;
  rating?: number | null;
  review_count?: number | null;
  buffet_time?: string | null;
  price?: number | string | null;

  // These are optional in case your table already contains them
  address?: string | null;
  location?: string | null;
  telephone?: string | null;
  phone?: string | null;
  website?: string | null;
};

function getHotelId(hotel: Hotel) {
  return String(hotel.hotel_id ?? hotel.hotel_name ?? "");
}

function formatPrice(price: Hotel["price"]) {
  if (price === null || price === undefined || price === "") {
    return "Not available";
  }

  if (typeof price === "number") {
    return `LKR ${price.toLocaleString()}`;
  }

  return String(price).startsWith("LKR")
    ? String(price)
    : `LKR ${String(price)}`;
}

function getImage(hotel: Hotel) {
  return (
    hotel.image_url ||
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
  );
}

export default function ComparePage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotels, setSelectedHotels] = useState<Hotel[]>([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHotels() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("hotels")
        .select("*")
        .order("hotel_name", { ascending: true });

      if (error) {
        console.error("Error loading hotels:", error);
        setError("Unable to load hotel information.");
        setHotels([]);
      } else {
        setHotels((data || []) as Hotel[]);
      }

      setLoading(false);
    }

    loadHotels();
  }, []);

  const filteredHotels = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return hotels;
    }

    return hotels.filter((hotel) => {
      const hotelName = hotel.hotel_name?.toLowerCase() || "";
      const restaurantName = hotel.restaurant_name?.toLowerCase() || "";

      return (
        hotelName.includes(value) ||
        restaurantName.includes(value)
      );
    });
  }, [hotels, search]);

  function isSelected(hotel: Hotel) {
    return selectedHotels.some(
      (item) => getHotelId(item) === getHotelId(hotel)
    );
  }

  function addHotel(hotel: Hotel) {
    if (isSelected(hotel)) return;

    if (selectedHotels.length >= 3) {
      return;
    }

    setSelectedHotels((current) => [...current, hotel]);
    setSearch("");
  }

  function removeHotel(hotel: Hotel) {
    setSelectedHotels((current) =>
      current.filter(
        (item) => getHotelId(item) !== getHotelId(hotel)
      )
    );
  }

  function clearComparison() {
    setSelectedHotels([]);
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#0b1625]">
      {/* HERO */}
      <section className="bg-[#091423] px-6 py-12 md:px-10 lg:px-14">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d1a044]/40 bg-[#d1a044]/10 px-4 py-2 text-sm font-medium text-[#d1a044]">
              <GitCompare size={16} />
              Compare Hotels
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
              Compare Colombo Hotels
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              Compare hotels, dining experiences, buffet information,
              ratings and prices in one place.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-8 md:px-10 lg:px-14">
        {/* SEARCH / ADD SECTION */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#0b1625]">
                Select hotels to compare
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Choose up to 3 hotels for a side-by-side comparison.
              </p>
            </div>

            {selectedHotels.length > 0 && (
              <button
                type="button"
                onClick={clearComparison}
                className="text-sm font-medium text-slate-500 transition hover:text-red-600"
              >
                Clear comparison
              </button>
            )}
          </div>

          <div className="relative mt-5">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for a hotel or restaurant..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-[#0b1625] outline-none transition focus:border-[#d1a044] focus:bg-white focus:ring-2 focus:ring-[#d1a044]/10"
            />
          </div>

          {/* SEARCH RESULTS */}
          {search.trim() && (
            <div className="mt-3 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white">
              {filteredHotels.length === 0 ? (
                <div className="px-5 py-6 text-center text-sm text-slate-500">
                  No hotels found.
                </div>
              ) : (
                filteredHotels.map((hotel) => {
                  const selected = isSelected(hotel);
                  const disabled =
                    selectedHotels.length >= 3 && !selected;

                  return (
                    <div
                      key={getHotelId(hotel)}
                      className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-3 last:border-0"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <img
                          src={getImage(hotel)}
                          alt={hotel.hotel_name || "Hotel"}
                          className="h-12 w-12 rounded-lg object-cover"
                        />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#0b1625]">
                            {hotel.hotel_name || "Hotel"}
                          </p>

                          {hotel.restaurant_name && (
                            <p className="truncate text-xs text-slate-500">
                              {hotel.restaurant_name}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => {
                          if (selected) {
                            removeHotel(hotel);
                          } else {
                            addHotel(hotel);
                          }
                        }}
                        className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                          selected
                            ? "bg-[#091423] text-white"
                            : disabled
                            ? "cursor-not-allowed bg-slate-100 text-slate-400"
                            : "bg-[#d1a044] text-[#091423] hover:bg-[#c39336]"
                        }`}
                      >
                        {selected ? (
                          <>
                            <X size={14} />
                            Remove
                          </>
                        ) : (
                          <>
                            <Plus size={14} />
                            Add
                          </>
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* SELECTED HOTEL COUNT */}
        <div className="mt-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#0b1625]">
              Your comparison
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {selectedHotels.length} of 3 hotels selected
            </p>
          </div>
        </div>

        {/* EMPTY STATE */}
        {selectedHotels.length === 0 && !loading && (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#d1a044]/10 text-[#d1a044]">
              <GitCompare size={30} />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-[#0b1625]">
              Start your comparison
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Search for a hotel above and add up to three hotels
              to compare their dining and stay information.
            </p>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#d1a044]" />
            <p className="mt-4 text-sm text-slate-500">
              Loading hotels...
            </p>
          </div>
        )}

        {/* ERROR */}
        {error && !loading && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* COMPARISON */}
        {selectedHotels.length > 0 && !loading && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* HOTEL HEADERS */}
            <div
              className="grid"
              style={{
                gridTemplateColumns: `220px repeat(${selectedHotels.length}, minmax(240px, 1fr))`,
              }}
            >
              {/* LEFT TITLE */}
              <div className="border-b border-r border-slate-200 bg-[#091423] p-5">
                <div className="flex h-full items-end">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#d1a044]">
                      Comparison
                    </p>

                    <h3 className="mt-2 text-lg font-semibold text-white">
                      Hotel details
                    </h3>
                  </div>
                </div>
              </div>

              {/* HOTEL COLUMNS */}
              {selectedHotels.map((hotel) => (
                <div
                  key={getHotelId(hotel)}
                  className="relative border-b border-r border-slate-200 last:border-r-0"
                >
                  <div className="relative h-48">
                    <img
                      src={getImage(hotel)}
                      alt={hotel.hotel_name || "Hotel"}
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#091423]/90 via-[#091423]/20 to-transparent" />

                    <button
                      type="button"
                      onClick={() => removeHotel(hotel)}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#0b1625] shadow-sm transition hover:bg-white"
                      aria-label={`Remove ${
                        hotel.hotel_name || "hotel"
                      }`}
                    >
                      <X size={17} />
                    </button>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="line-clamp-2 text-lg font-semibold text-white">
                        {hotel.hotel_name || "Hotel"}
                      </h3>

                      {hotel.restaurant_name && (
                        <p className="mt-1 truncate text-xs text-slate-200">
                          {hotel.restaurant_name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RATING */}
            <ComparisonRow
              label="Rating"
              icon={<Star size={17} />}
              selectedHotels={selectedHotels}
              render={(hotel) => (
                <div className="flex items-center gap-2">
                  <Star
                    size={17}
                    className="fill-[#d1a044] text-[#d1a044]"
                  />

                  <span className="font-semibold text-[#0b1625]">
                    {hotel.rating !== null &&
                    hotel.rating !== undefined
                      ? Number(hotel.rating).toFixed(1)
                      : "N/A"}
                  </span>

                  <span className="text-xs text-slate-500">
                    / 5
                  </span>
                </div>
              )}
            />

            {/* REVIEW COUNT */}
            <ComparisonRow
              label="Reviews"
              icon={<MessageSquare size={17} />}
              selectedHotels={selectedHotels}
              render={(hotel) => (
                <span className="text-sm font-medium text-[#0b1625]">
                  {hotel.review_count !== null &&
                  hotel.review_count !== undefined
                    ? Number(hotel.review_count).toLocaleString()
                    : "No reviews"}
                </span>
              )}
            />

            {/* RESTAURANT */}
            <ComparisonRow
              label="Restaurant"
              icon={<Utensils size={17} />}
              selectedHotels={selectedHotels}
              render={(hotel) => (
                <span className="text-sm text-slate-700">
                  {hotel.restaurant_name || "Not available"}
                </span>
              )}
            />

            {/* BUFFET TIME */}
            <ComparisonRow
              label="Buffet Time"
              icon={<Clock3 size={17} />}
              selectedHotels={selectedHotels}
              render={(hotel) => (
                <span className="text-sm text-slate-700">
                  {hotel.buffet_time || "Not available"}
                </span>
              )}
            />

            {/* PRICE */}
            <ComparisonRow
              label="Buffet Price"
              icon={<BadgeDollarSign size={17} />}
              selectedHotels={selectedHotels}
              render={(hotel) => (
                <span className="text-sm font-semibold text-[#0b1625]">
                  {formatPrice(hotel.price)}
                </span>
              )}
            />

            {/* LOCATION */}
            {(selectedHotels.some(
              (hotel) => hotel.address || hotel.location
            )) && (
              <ComparisonRow
                label="Location"
                selectedHotels={selectedHotels}
                render={(hotel) => (
                  <span className="text-sm leading-6 text-slate-700">
                    {hotel.address ||
                      hotel.location ||
                      "Not available"}
                  </span>
                )}
              />
            )}

            {/* DESCRIPTION */}
            <ComparisonRow
              label="Description"
              selectedHotels={selectedHotels}
              render={(hotel) => (
                <p className="text-sm leading-6 text-slate-600">
                  {hotel.description ||
                    "No description available."}
                </p>
              )}
            />
          </div>
        )}

        {/* ADD MORE */}
        {selectedHotels.length > 0 && selectedHotels.length < 3 && (
          <div className="mt-6 rounded-2xl border border-[#d1a044]/30 bg-[#d1a044]/5 p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-semibold text-[#0b1625]">
                  Add another hotel
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  You can compare up to{" "}
                  {3 - selectedHotels.length} more hotel
                  {3 - selectedHotels.length > 1 ? "s" : ""}.
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-[#8b6825]">
                <Plus size={17} />
                Use the search box above
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function ComparisonRow({
  label,
  icon,
  selectedHotels,
  render,
}: {
  label: string;
  icon?: React.ReactNode;
  selectedHotels: Hotel[];
  render: (hotel: Hotel) => React.ReactNode;
}) {
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `220px repeat(${selectedHotels.length}, minmax(240px, 1fr))`,
      }}
    >
      <div className="border-b border-r border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#0b1625]">
          {icon && (
            <span className="text-[#b48732]">
              {icon}
            </span>
          )}

          {label}
        </div>
      </div>

      {selectedHotels.map((hotel) => (
        <div
          key={`${getHotelId(hotel)}-${label}`}
          className="border-b border-r border-slate-200 p-5 last:border-r-0"
        >
          {render(hotel)}
        </div>
      ))}
    </div>
  );
}