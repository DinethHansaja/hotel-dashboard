"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Star,
  MapPin,
  Phone,
  Globe,
  ChevronDown,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type Hotel = {
  hotel_id: number;
  hotel_name: string | null;
  restaurant_name: string | null;
  image_url: string | null;
  description: string | null;

  rating: number | string | null;
  review_count: number | string | null;
  price: number | string | null;

  buffet_time: string | null;

  address: string | null;
  location: string | null;

  phone: string | null;
  telephone: string | null;

  website: string | null;
  website_url: string | null;
};

type BuffetSchedule = {
  hotel_id: number;
  buffet_time: string | null;
};

export default function ComparePage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [buffetSchedules, setBuffetSchedules] = useState<BuffetSchedule[]>([]);

  const [selectedHotels, setSelectedHotels] = useState<Hotel[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectorOpen, setSelectorOpen] = useState(false);

  useEffect(() => {
    loadCompareData();
  }, []);

  async function loadCompareData() {
    setLoading(true);
    setError("");

    try {
      // ------------------------------------------
      // 1. Get hotel information
      // ------------------------------------------
      const { data: hotelData, error: hotelError } = await supabase
        .from("hotels")
        .select("*")
        .order("hotel_name", { ascending: true });

      if (hotelError) {
        throw hotelError;
      }

      // ------------------------------------------
      // 2. Get buffet schedule information
      // ------------------------------------------
      const { data: buffetData, error: buffetError } = await supabase
        .from("buffet_schedules")
        .select("hotel_id, buffet_time");

      if (buffetError) {
        console.warn("Buffet schedule error:", buffetError);
      }

      const hotelsList = (hotelData || []) as Hotel[];
      const buffetList = (buffetData || []) as BuffetSchedule[];

      setHotels(hotelsList);
      setBuffetSchedules(buffetList);

      // ------------------------------------------
      // Select first 3 hotels initially
      // ------------------------------------------
      setSelectedHotels(hotelsList.slice(0, 3));
    } catch (err) {
      console.error("Compare page error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load comparison data."
      );
    } finally {
      setLoading(false);
    }
  }

  // ------------------------------------------
  // Get buffet time for hotel
  // ------------------------------------------
  function getBuffetTime(hotel: Hotel) {
    // First check buffet_time directly in hotels
    if (hotel.buffet_time) {
      return hotel.buffet_time;
    }

    // Otherwise check buffet_schedules
    const schedules = buffetSchedules.filter(
      (item) => Number(item.hotel_id) === Number(hotel.hotel_id)
    );

    if (schedules.length === 0) {
      return null;
    }

    const times = schedules
      .map((item) => item.buffet_time)
      .filter(Boolean);

    if (times.length === 0) {
      return null;
    }

    return times.join(" • ");
  }

  // ------------------------------------------
  // Get rating
  // ------------------------------------------
  function getRating(hotel: Hotel) {
    if (
      hotel.rating === null ||
      hotel.rating === undefined ||
      hotel.rating === ""
    ) {
      return null;
    }

    const rating = Number(hotel.rating);

    if (Number.isNaN(rating)) {
      return null;
    }

    return rating;
  }

  // ------------------------------------------
  // Get price
  // ------------------------------------------
  function getPrice(hotel: Hotel) {
    if (
      hotel.price === null ||
      hotel.price === undefined ||
      hotel.price === ""
    ) {
      return null;
    }

    return String(hotel.price);
  }

  // ------------------------------------------
  // Get location
  // ------------------------------------------
  function getLocation(hotel: Hotel) {
    return hotel.address || hotel.location || null;
  }

  // ------------------------------------------
  // Get phone
  // ------------------------------------------
  function getPhone(hotel: Hotel) {
    return hotel.phone || hotel.telephone || null;
  }

  // ------------------------------------------
  // Get website
  // ------------------------------------------
  function getWebsite(hotel: Hotel) {
    return hotel.website || hotel.website_url || null;
  }

  // ------------------------------------------
  // Format website
  // ------------------------------------------
  function formatWebsite(url: string) {
    try {
      const cleanUrl = url.startsWith("http")
        ? url
        : `https://${url}`;

      return new URL(cleanUrl).hostname.replace("www.", "");
    } catch {
      return url;
    }
  }

  // ------------------------------------------
  // Add hotel
  // ------------------------------------------
  function addHotel(hotel: Hotel) {
    if (selectedHotels.some((item) => item.hotel_id === hotel.hotel_id)) {
      return;
    }

    if (selectedHotels.length >= 3) {
      return;
    }

    setSelectedHotels([...selectedHotels, hotel]);
    setSelectorOpen(false);
  }

  // ------------------------------------------
  // Remove hotel
  // ------------------------------------------
  function removeHotel(hotelId: number) {
    setSelectedHotels(
      selectedHotels.filter((hotel) => hotel.hotel_id !== hotelId)
    );
  }

  // ------------------------------------------
  // Available hotels for selector
  // ------------------------------------------
  const availableHotels = useMemo(() => {
    return hotels.filter(
      (hotel) =>
        !selectedHotels.some(
          (selected) => selected.hotel_id === hotel.hotel_id
        )
    );
  }, [hotels, selectedHotels]);

  // ------------------------------------------
  // Loading
  // ------------------------------------------
  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f8fa] px-6 py-8">
        <div className="mx-auto max-w-[1500px]">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
            <div className="animate-pulse">
              <div className="h-5 w-32 rounded bg-slate-200" />
              <div className="mt-3 h-8 w-64 rounded bg-slate-200" />

              <div className="mt-10 grid grid-cols-4">
                <div className="h-64 bg-slate-100" />
                <div className="h-64 bg-slate-100" />
                <div className="h-64 bg-slate-100" />
                <div className="h-64 bg-slate-100" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ------------------------------------------
  // Error
  // ------------------------------------------
  if (error) {
    return (
      <main className="min-h-screen bg-[#f7f8fa] px-6 py-8">
        <div className="mx-auto max-w-[1500px]">
          <div className="rounded-3xl border border-red-200 bg-white p-8">
            <h2 className="text-xl font-bold text-red-600">
              Unable to load comparison data
            </h2>

            <p className="mt-3 text-slate-600">{error}</p>

            <button
              onClick={loadCompareData}
              className="mt-6 rounded-xl bg-[#091423] px-5 py-3 font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">

        {/* =========================================
            HEADER
        ========================================= */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-7 sm:px-8">
            <p className="text-sm font-bold uppercase tracking-wider text-[#b1842f]">
              Comparison
            </p>

            <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-[#091423]">
                  Hotel details
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Compare dining, buffet, pricing and hotel information.
                </p>
              </div>

              {/* ADD HOTEL */}
              {selectedHotels.length < 3 && (
                <div className="relative">
                  <button
                    onClick={() => setSelectorOpen(!selectorOpen)}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#091423] shadow-sm transition hover:border-[#c79a45]"
                  >
                    Add hotel
                    <ChevronDown size={17} />
                  </button>

                  {selectorOpen && (
                    <div className="absolute right-0 z-30 mt-2 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                      <div className="border-b border-slate-100 px-4 py-3">
                        <p className="text-sm font-semibold text-[#091423]">
                          Select a hotel
                        </p>
                      </div>

                      <div className="max-h-72 overflow-y-auto">
                        {availableHotels.map((hotel) => (
                          <button
                            key={hotel.hotel_id}
                            onClick={() => addHotel(hotel)}
                            className="block w-full px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-[#f7f8fa]"
                          >
                            {hotel.hotel_name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* =========================================
              COMPARISON TABLE
          ========================================= */}
          <div className="overflow-x-auto">
            <div
              className="grid min-w-[1100px]"
              style={{
                gridTemplateColumns: `220px repeat(${Math.max(
                  selectedHotels.length,
                  1
                )}, minmax(280px, 1fr))`,
              }}
            >

              {/* =====================================
                  HOTEL HEADER
              ===================================== */}

              <div className="border-r border-slate-200 bg-[#f9fafb] p-6">
                <p className="text-lg font-bold text-slate-500">
                  Hotels
                </p>
              </div>

              {selectedHotels.map((hotel) => (
                <div
                  key={hotel.hotel_id}
                  className="relative border-r border-slate-200 p-6"
                >
                  {/* Remove */}
                  {selectedHotels.length > 1 && (
                    <button
                      onClick={() => removeHotel(hotel.hotel_id)}
                      className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 text-slate-400 shadow-sm transition hover:text-red-500"
                      title="Remove hotel"
                    >
                      <X size={17} />
                    </button>
                  )}

                  <div className="overflow-hidden rounded-2xl bg-slate-100">
                    {hotel.image_url ? (
                      <img
                        src={hotel.image_url}
                        alt={hotel.hotel_name || "Hotel"}
                        className="h-44 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-44 items-center justify-center text-sm text-slate-400">
                        No image available
                      </div>
                    )}
                  </div>

                  <h2 className="mt-5 text-xl font-bold text-[#091423]">
                    {hotel.hotel_name || "Hotel"}
                  </h2>

                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {hotel.restaurant_name || "Restaurant information unavailable"}
                  </p>
                </div>
              ))}

              {/* =====================================
                  RATING
              ===================================== */}

              <CompareLabel
                icon={<Star size={19} />}
                title="Rating"
              />

              {selectedHotels.map((hotel) => {
                const rating = getRating(hotel);

                return (
                  <CompareValue key={hotel.hotel_id}>
                    {rating !== null ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-[#091423]">
                          {rating.toFixed(1)}
                        </span>

                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={
                                star <= Math.round(rating)
                                  ? "fill-[#d1a044] text-[#d1a044]"
                                  : "text-slate-300"
                              }
                            />
                          ))}
                        </div>

                        {hotel.review_count && (
                          <span className="text-sm text-slate-500">
                            ({hotel.review_count})
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-500">
                        Not available
                      </span>
                    )}
                  </CompareValue>
                );
              })}

              {/* =====================================
                  PRICE
              ===================================== */}

              <CompareLabel title="Price" />

              {selectedHotels.map((hotel) => {
                const price = getPrice(hotel);

                return (
                  <CompareValue key={hotel.hotel_id}>
                    {price ? (
                      <span className="font-bold text-[#091423]">
                        {price}
                      </span>
                    ) : (
                      <span className="text-slate-500">
                        Not available
                      </span>
                    )}
                  </CompareValue>
                );
              })}

              {/* =====================================
                  BUFFET TIME
              ===================================== */}

              <CompareLabel title="Buffet time" />

              {selectedHotels.map((hotel) => {
                const buffetTime = getBuffetTime(hotel);

                return (
                  <CompareValue key={hotel.hotel_id}>
                    {buffetTime ? (
                      <span className="font-medium text-[#091423]">
                        {buffetTime}
                      </span>
                    ) : (
                      <span className="text-slate-500">
                        Not available
                      </span>
                    )}
                  </CompareValue>
                );
              })}

              {/* =====================================
                  RESTAURANT
              ===================================== */}

              <CompareLabel title="Restaurant" />

              {selectedHotels.map((hotel) => (
                <CompareValue key={hotel.hotel_id}>
                  <span>
                    {hotel.restaurant_name || "Not available"}
                  </span>
                </CompareValue>
              ))}

              {/* =====================================
                  LOCATION
              ===================================== */}

              <CompareLabel
                icon={<MapPin size={19} />}
                title="Location"
              />

              {selectedHotels.map((hotel) => {
                const location = getLocation(hotel);

                return (
                  <CompareValue key={hotel.hotel_id}>
                    {location || "Not available"}
                  </CompareValue>
                );
              })}

              {/* =====================================
                  CONTACT
              ===================================== */}

              <CompareLabel
                icon={<Phone size={19} />}
                title="Contact"
              />

              {selectedHotels.map((hotel) => {
                const phone = getPhone(hotel);

                return (
                  <CompareValue key={hotel.hotel_id}>
                    {phone ? (
                      <a
                        href={`tel:${phone}`}
                        className="font-medium text-[#a47720] hover:underline"
                      >
                        {phone}
                      </a>
                    ) : (
                      "Not available"
                    )}
                  </CompareValue>
                );
              })}

              {/* =====================================
                  WEBSITE
              ===================================== */}

              <CompareLabel
                icon={<Globe size={19} />}
                title="Website"
              />

              {selectedHotels.map((hotel) => {
                const website = getWebsite(hotel);

                return (
                  <CompareValue key={hotel.hotel_id}>
                    {website ? (
                      <a
                        href={
                          website.startsWith("http")
                            ? website
                            : `https://${website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[#a47720] hover:underline"
                      >
                        {formatWebsite(website)} →
                      </a>
                    ) : (
                      "Not available"
                    )}
                  </CompareValue>
                );
              })}

            </div>
          </div>

          {/* =========================================
              FOOTER
          ========================================= */}

          <div className="border-t border-slate-200 bg-[#fafafa] px-6 py-5 sm:px-8">
            <p className="text-sm text-slate-500">
              Hotel information, ratings and buffet details are
              loaded from the Colombo Dining & Events Guide database.
            </p>
          </div>

        </section>
      </div>
    </main>
  );
}

/* =================================================
   COMPARISON LABEL
================================================= */

function CompareLabel({
  title,
  icon,
}: {
  title: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[110px] items-center gap-3 border-r border-t border-slate-200 bg-[#f9fafb] px-6">
      {icon && (
        <span className="text-[#c08c29]">
          {icon}
        </span>
      )}

      <span className="font-bold text-slate-600">
        {title}
      </span>
    </div>
  );
}

/* =================================================
   COMPARISON VALUE
================================================= */

function CompareValue({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[110px] items-center border-r border-t border-slate-200 px-6 text-[16px] leading-7 text-slate-600">
      {children}
    </div>
  );
}