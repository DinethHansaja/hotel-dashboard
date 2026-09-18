"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Globe,
  MapPin,
  Phone,
  Search,
  Star,
  X,
  Utensils,
  Clock3,
  Banknote,
  Hotel as HotelIcon,
  RefreshCw,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type Hotel = {
  hotel_id: number | string;
  hotel_name: string | null;
  restaurant_name?: string | null;
  image_url?: string | null;
  description?: string | null;

  // Your Supabase column is capital R: "Rating"
  Rating?: number | string | null;

  address?: string | null;
  location?: string | null;

  phone?: string | null;
  telephone?: string | null;

  website?: string | null;
  website_url?: string | null;
};

type BuffetSchedule = {
  schedule_id?: number | string;
  hotel_id: number | string;
  buffet_time?: string | null;
  price_lkr?: number | string | null;
};

type HotelWithSchedule = Hotel & {
  schedules: BuffetSchedule[];
};

const MAX_COMPARE = 3;

function normalizeId(value: number | string | null | undefined) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function getRating(hotel: Hotel) {
  const value = hotel.Rating;

  if (value === null || value === undefined || value === "") {
    return null;
  }

  const rating = Number(value);

  if (Number.isNaN(rating)) {
    return null;
  }

  return rating;
}

function getPrice(schedules: BuffetSchedule[]) {
  const prices = schedules
    .map((schedule) => Number(schedule.price_lkr))
    .filter((price) => !Number.isNaN(price) && price > 0);

  if (prices.length === 0) {
    return null;
  }

  return Math.min(...prices);
}

function getAllPrices(schedules: BuffetSchedule[]) {
  const prices = schedules
    .map((schedule) => Number(schedule.price_lkr))
    .filter((price) => !Number.isNaN(price) && price > 0);

  return [...new Set(prices)].sort((a, b) => a - b);
}

function getBuffetTimes(schedules: BuffetSchedule[]) {
  const times = schedules
    .map((schedule) => schedule.buffet_time?.trim())
    .filter(Boolean) as string[];

  return [...new Set(times)];
}

function formatPrice(price: number | null) {
  if (price === null) {
    return "Not available";
  }

  return `LKR ${price.toLocaleString("en-LK")}`;
}

function getWebsite(hotel: Hotel) {
  return hotel.website || hotel.website_url || null;
}

function getPhone(hotel: Hotel) {
  return hotel.phone || hotel.telephone || null;
}

function getLocation(hotel: Hotel) {
  return hotel.address || hotel.location || null;
}

function formatWebsite(url: string) {
  try {
    const formatted = url.startsWith("http")
      ? url
      : `https://${url}`;

    return new URL(formatted).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function getWebsiteUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `https://${url}`;
}

export default function ComparePage() {
  const [hotels, setHotels] = useState<HotelWithSchedule[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showHotelPicker, setShowHotelPicker] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAllDetails, setShowAllDetails] = useState(false);

  async function loadHotels() {
    try {
      setLoading(true);
      setError(null);

      /*
       * Get hotel information
       */
      const { data: hotelData, error: hotelError } = await supabase
        .from("hotels")
        .select("*")
        .order("hotel_name", { ascending: true });

      if (hotelError) {
        throw hotelError;
      }

      /*
       * Get buffet information
       */
      const { data: scheduleData, error: scheduleError } = await supabase
        .from("buffet_schedules")
        .select("*");

      if (scheduleError) {
        throw scheduleError;
      }

      const schedules = (scheduleData || []) as BuffetSchedule[];

      /*
       * Attach buffet schedules to each hotel
       */
      const combinedHotels: HotelWithSchedule[] = (
        (hotelData || []) as Hotel[]
      ).map((hotel) => {
        const hotelId = normalizeId(hotel.hotel_id);

        const hotelSchedules = schedules.filter(
          (schedule) =>
            normalizeId(schedule.hotel_id) === hotelId
        );

        return {
          ...hotel,
          schedules: hotelSchedules,
        };
      });

      setHotels(combinedHotels);

      /*
       * Automatically select the first 3 hotels
       * if nothing is currently selected.
       */
      setSelectedIds((current) => {
        if (current.length > 0) {
          return current.filter((id) =>
            combinedHotels.some(
              (hotel) => normalizeId(hotel.hotel_id) === id
            )
          );
        }

        return combinedHotels
          .slice(0, MAX_COMPARE)
          .map((hotel) => normalizeId(hotel.hotel_id));
      });
    } catch (err) {
      console.error("Error loading comparison data:", err);

      setError(
        "Unable to load hotel comparison data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHotels();
  }, []);

  const selectedHotels = useMemo(() => {
    return selectedIds
      .map((id) =>
        hotels.find(
          (hotel) => normalizeId(hotel.hotel_id) === id
        )
      )
      .filter(Boolean) as HotelWithSchedule[];
  }, [selectedIds, hotels]);

  const filteredHotels = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return hotels;
    }

    return hotels.filter((hotel) => {
      const hotelName =
        hotel.hotel_name?.toLowerCase() || "";

      const restaurant =
        hotel.restaurant_name?.toLowerCase() || "";

      return (
        hotelName.includes(query) ||
        restaurant.includes(query)
      );
    });
  }, [hotels, searchTerm]);

  function addHotel(hotelId: string) {
    if (selectedIds.includes(hotelId)) {
      return;
    }

    if (selectedIds.length >= MAX_COMPARE) {
      return;
    }

    setSelectedIds((current) => [...current, hotelId]);

    setSearchTerm("");
    setShowHotelPicker(false);
  }

  function removeHotel(hotelId: string) {
    setSelectedIds((current) =>
      current.filter((id) => id !== hotelId)
    );
  }

  function clearComparison() {
    setSelectedIds([]);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f8fa] px-4 py-6 md:px-8">
        <div className="mx-auto max-w-[1500px]">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="animate-pulse p-8">
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="mt-4 h-10 w-72 rounded bg-slate-200" />
              <div className="mt-3 h-5 w-96 max-w-full rounded bg-slate-200" />

              <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div key={item}>
                    <div className="h-52 rounded-2xl bg-slate-200" />
                    <div className="mt-4 h-6 w-3/4 rounded bg-slate-200" />
                    <div className="mt-2 h-4 w-1/2 rounded bg-slate-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#f7f8fa] px-4 py-6 md:px-8">
        <div className="mx-auto max-w-[1500px]">
          <div className="rounded-3xl border border-red-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <RefreshCw className="h-6 w-6 text-red-600" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-[#091423]">
              Something went wrong
            </h1>

            <p className="mx-auto mt-2 max-w-lg text-slate-500">
              {error}
            </p>

            <button
              onClick={loadHotels}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#091423] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#12243a]"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa] px-3 py-5 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">

        {/* ================= HEADER ================= */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-7 md:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#b48527]">
                  Comparison
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#091423] md:text-4xl">
                  Compare Hotels
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
                  Compare dining, buffet prices, ratings and hotel
                  information side by side.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#f8f3e8] px-4 py-2.5 text-sm font-semibold text-[#8d6824]">
                  {selectedHotels.length} of {MAX_COMPARE} selected
                </div>

                {selectedHotels.length > 0 && (
                  <button
                    onClick={clearComparison}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ================= HOTEL PICKER ================= */}

          <div className="border-b border-slate-200 bg-[#fbfcfd] px-6 py-5 md:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>
                <h2 className="font-semibold text-[#091423]">
                  Hotels to compare
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Select up to three hotels.
                </p>
              </div>

              <button
                onClick={() => setShowHotelPicker((value) => !value)}
                disabled={selectedHotels.length >= MAX_COMPARE}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#091423] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#15283e] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <HotelIcon className="h-4 w-4" />
                Add hotel

                {showHotelPicker ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>

            {showHotelPicker && selectedHotels.length < MAX_COMPARE && (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">

                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                    placeholder="Search hotel or restaurant..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#c79a45] focus:ring-2 focus:ring-[#c79a45]/10"
                  />
                </div>

                <div className="mt-3 max-h-64 overflow-y-auto">
                  {filteredHotels.length === 0 ? (
                    <p className="px-3 py-5 text-center text-sm text-slate-500">
                      No hotels found.
                    </p>
                  ) : (
                    filteredHotels.map((hotel) => {
                      const id = normalizeId(hotel.hotel_id);
                      const alreadySelected =
                        selectedIds.includes(id);

                      return (
                        <button
                          key={id}
                          onClick={() => addHotel(id)}
                          disabled={alreadySelected}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <div>
                            <p className="font-semibold text-[#091423]">
                              {hotel.hotel_name ||
                                "Unnamed hotel"}
                            </p>

                            {hotel.restaurant_name && (
                              <p className="mt-0.5 text-xs text-slate-500">
                                {hotel.restaurant_name}
                              </p>
                            )}
                          </div>

                          {alreadySelected && (
                            <span className="text-xs font-semibold text-[#b48527]">
                              Selected
                            </span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ================= COMPARISON ================= */}

          {selectedHotels.length === 0 ? (
            <div className="px-6 py-20 text-center md:px-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f8f3e8]">
                <HotelIcon className="h-7 w-7 text-[#b48527]" />
              </div>

              <h2 className="mt-5 text-xl font-bold text-[#091423]">
                Start your comparison
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Add two or three hotels to compare their
                ratings, prices, buffet times and contact
                information.
              </p>

              <button
                onClick={() => setShowHotelPicker(true)}
                className="mt-6 rounded-xl bg-[#091423] px-5 py-3 text-sm font-semibold text-white"
              >
                Add a hotel
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div
                className="min-w-[900px]"
                style={{
                  gridTemplateColumns: `220px repeat(${selectedHotels.length}, minmax(260px, 1fr))`,
                }}
              >

                {/* ================= HOTEL HEADER ================= */}

                <div
                  className="grid border-b border-slate-200"
                  style={{
                    gridTemplateColumns: `220px repeat(${selectedHotels.length}, minmax(260px, 1fr))`,
                  }}
                >
                  <div className="flex items-start bg-[#fbfcfd] p-6">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">
                        Hotels
                      </p>

                      <p className="mt-2 text-xs leading-5 text-slate-400">
                        Compare selected properties
                        side by side.
                      </p>
                    </div>
                  </div>

                  {selectedHotels.map((hotel) => {
                    const id = normalizeId(hotel.hotel_id);

                    return (
                      <div
                        key={id}
                        className="relative border-l border-slate-200 p-5"
                      >
                        <button
                          onClick={() => removeHotel(id)}
                          aria-label={`Remove ${
                            hotel.hotel_name || "hotel"
                          }`}
                          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>

                        <div className="overflow-hidden rounded-2xl bg-slate-100">
                          {hotel.image_url ? (
                            <img
                              src={hotel.image_url}
                              alt={hotel.hotel_name || "Hotel"}
                              className="h-52 w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-52 items-center justify-center">
                              <HotelIcon className="h-10 w-10 text-slate-300" />
                            </div>
                          )}
                        </div>

                        <h2 className="mt-4 pr-10 text-xl font-bold leading-7 text-[#091423]">
                          {hotel.hotel_name ||
                            "Unnamed hotel"}
                        </h2>

                        <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                          <Utensils className="h-4 w-4" />

                          <span>
                            {hotel.restaurant_name ||
                              "Restaurant information unavailable"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ================= RATING ================= */}

                <CompareRow
                  label="Rating"
                  icon={
                    <Star className="h-5 w-5" />
                  }
                  highlight
                  values={selectedHotels.map((hotel) => {
                    const rating = getRating(hotel);

                    if (rating === null) {
                      return (
                        <span className="text-slate-400">
                          Not available
                        </span>
                      );
                    }

                    return (
                      <span className="inline-flex items-center gap-2 font-semibold text-[#091423]">
                        <span>{rating.toFixed(1)}</span>

                        <span className="flex items-center gap-0.5">
                          {Array.from({
                            length: 5,
                          }).map((_, index) => (
                            <Star
                              key={index}
                              className={`h-3.5 w-3.5 ${
                                index <
                                Math.round(rating)
                                  ? "fill-[#d1a044] text-[#d1a044]"
                                  : "text-slate-200"
                              }`}
                            />
                          ))}
                        </span>
                      </span>
                    );
                  })}
                />

                {/* ================= PRICE ================= */}

                <CompareRow
                  label="Buffet price"
                  icon={
                    <Banknote className="h-5 w-5" />
                  }
                  values={selectedHotels.map((hotel) => {
                    const price = getPrice(
                      hotel.schedules
                    );

                    const allPrices =
                      getAllPrices(
                        hotel.schedules
                      );

                    if (price === null) {
                      return (
                        <span className="text-slate-400">
                          Not available
                        </span>
                      );
                    }

                    return (
                      <div>
                        <p className="font-bold text-[#091423]">
                          {formatPrice(price)}
                        </p>

                        {allPrices.length > 1 && (
                          <p className="mt-1 text-xs text-slate-500">
                            From lowest listed price
                          </p>
                        )}
                      </div>
                    );
                  })}
                />

                {/* ================= BUFFET TIME ================= */}

                <CompareRow
                  label="Buffet time"
                  icon={
                    <Clock3 className="h-5 w-5" />
                  }
                  values={selectedHotels.map((hotel) => {
                    const times = getBuffetTimes(
                      hotel.schedules
                    );

                    if (times.length === 0) {
                      return (
                        <span className="text-slate-400">
                          Not available
                        </span>
                      );
                    }

                    return (
                      <div className="space-y-2">
                        {times.map((time) => (
                          <div
                            key={time}
                            className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"
                          >
                            {time}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                />

                {/* ================= RESTAURANT ================= */}

                <CompareRow
                  label="Restaurant"
                  icon={
                    <Utensils className="h-5 w-5" />
                  }
                  values={selectedHotels.map((hotel) => (
                    <span>
                      {hotel.restaurant_name ||
                        "Not available"}
                    </span>
                  ))}
                />

                {/* ================= LOCATION ================= */}

                <CompareRow
                  label="Location"
                  icon={
                    <MapPin className="h-5 w-5" />
                  }
                  values={selectedHotels.map((hotel) => (
                    <span>
                      {getLocation(hotel) ||
                        "Not available"}
                    </span>
                  ))}
                />

                {/* ================= CONTACT ================= */}

                <CompareRow
                  label="Contact"
                  icon={
                    <Phone className="h-5 w-5" />
                  }
                  values={selectedHotels.map((hotel) => {
                    const phone = getPhone(hotel);

                    if (!phone) {
                      return (
                        <span className="text-slate-400">
                          Not available
                        </span>
                      );
                    }

                    return (
                      <a
                        href={`tel:${phone}`}
                        className="font-semibold text-[#a87822] hover:underline"
                      >
                        {phone}
                      </a>
                    );
                  })}
                />

                {/* ================= WEBSITE ================= */}

                <CompareRow
                  label="Website"
                  icon={
                    <Globe className="h-5 w-5" />
                  }
                  values={selectedHotels.map((hotel) => {
                    const website = getWebsite(hotel);

                    if (!website) {
                      return (
                        <span className="text-slate-400">
                          Not available
                        </span>
                      );
                    }

                    return (
                      <a
                        href={getWebsiteUrl(website)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-semibold text-[#a87822] hover:underline"
                      >
                        {formatWebsite(website)}
                        <span>↗</span>
                      </a>
                    );
                  })}
                />

                {/* ================= DESCRIPTION ================= */}

                {showAllDetails && (
                  <CompareRow
                    label="Description"
                    values={selectedHotels.map((hotel) => (
                      <span className="leading-6 text-slate-600">
                        {hotel.description ||
                          "No description available."}
                      </span>
                    ))}
                  />
                )}

                {/* ================= ACTION ================= */}

                <div
                  className="grid border-t border-slate-200"
                  style={{
                    gridTemplateColumns: `220px repeat(${selectedHotels.length}, minmax(260px, 1fr))`,
                  }}
                >
                  <div className="bg-[#fbfcfd] p-6" />

                  {selectedHotels.map((hotel) => {
                    const website = getWebsite(hotel);

                    return (
                      <div
                        key={normalizeId(hotel.hotel_id)}
                        className="border-l border-slate-200 p-5"
                      >
                        {website ? (
                          <a
                            href={getWebsiteUrl(website)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#091423] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#172b43]"
                          >
                            Visit website
                            <span>↗</span>
                          </a>
                        ) : (
                          <button
                            disabled
                            className="w-full cursor-not-allowed rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-400"
                          >
                            Website unavailable
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= MORE DETAILS ================= */}

          {selectedHotels.length > 0 && (
            <div className="border-t border-slate-200 bg-[#fbfcfd] px-6 py-5 md:px-8">
              <button
                onClick={() =>
                  setShowAllDetails((value) => !value)
                }
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#091423]"
              >
                {showAllDetails
                  ? "Hide additional details"
                  : "Show additional details"}

                {showAllDetails ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>
          )}
        </section>

        {/* ================= FOOTER NOTE ================= */}

        <div className="px-2 py-6 text-center text-xs leading-5 text-slate-400">
          Comparison information is retrieved from the hotel and
          buffet data stored in Supabase. Prices and buffet schedules
          may change when the underlying data is updated.
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   COMPARISON ROW
============================================================ */

function CompareRow({
  label,
  icon,
  values,
  highlight = false,
}: {
  label: string;
  icon?: React.ReactNode;
  values: React.ReactNode[];
  highlight?: boolean;
}) {
  return (
    <div
      className="grid border-t border-slate-200"
      style={{
        gridTemplateColumns: `220px repeat(${values.length}, minmax(260px, 1fr))`,
      }}
    >
      <div
        className={`flex items-start gap-3 p-6 ${
          highlight ? "bg-[#fbfcfd]" : "bg-white"
        }`}
      >
        {icon && (
          <span className="mt-0.5 text-[#bd8a2b]">
            {icon}
          </span>
        )}

        <span className="text-sm font-bold text-slate-600">
          {label}
        </span>
      </div>

      {values.map((value, index) => (
        <div
          key={index}
          className="flex min-h-[86px] items-center border-l border-slate-200 p-6 text-sm leading-6 text-slate-600"
        >
          {value}
        </div>
      ))}
    </div>
  );
}