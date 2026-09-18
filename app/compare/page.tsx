"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Globe,
  MapPin,
  Phone,
  Star,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type Hotel = {
  [key: string]: any;

  hotel_id: number;
  hotel_name?: string | null;
  restaurant_name?: string | null;
  image_url?: string | null;
  description?: string | null;

  rating?: number | string | null;
  review_count?: number | string | null;

  buffet_time?: string | null;
  price?: number | string | null;

  website?: string | null;
  website_url?: string | null;
  phone?: string | null;
  telephone?: string | null;
  address?: string | null;
  location?: string | null;
};

/* -------------------------------------------------------
   HELPER: Find the first available value
------------------------------------------------------- */

function getValue(
  hotel: Hotel,
  possibleColumns: string[]
): any {
  for (const column of possibleColumns) {
    const value = hotel[column];

    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    ) {
      return value;
    }
  }

  return null;
}

/* -------------------------------------------------------
   RATING
------------------------------------------------------- */

function getRating(hotel: Hotel) {
  const value = getValue(hotel, [
    "rating",
    "ratings",
    "hotel_rating",
    "average_rating",
    "star_rating",
  ]);

  if (value === null) {
    return null;
  }

  const rating = Number(value);

  if (Number.isNaN(rating)) {
    return null;
  }

  return rating;
}

/* -------------------------------------------------------
   REVIEW COUNT
------------------------------------------------------- */

function getReviewCount(hotel: Hotel) {
  const value = getValue(hotel, [
    "review_count",
    "reviews_count",
    "number_of_reviews",
    "reviewcount",
  ]);

  if (value === null) {
    return null;
  }

  const count = Number(value);

  return Number.isNaN(count) ? null : count;
}

/* -------------------------------------------------------
   PRICE
------------------------------------------------------- */

function getPrice(hotel: Hotel) {
  const value = getValue(hotel, [
    "price",
    "buffet_price",
    "price_range",
    "buffet_price_lkr",
    "price_lkr",
  ]);

  if (value === null) {
    return null;
  }

  return value;
}

/* -------------------------------------------------------
   BUFFET TIME
------------------------------------------------------- */

function getBuffetTime(hotel: Hotel) {
  const value = getValue(hotel, [
    "buffet_time",
    "buffet_times",
    "buffet_schedule",
    "time",
  ]);

  if (value === null) {
    return null;
  }

  return String(value);
}

/* -------------------------------------------------------
   WEBSITE
------------------------------------------------------- */

function getWebsite(hotel: Hotel) {
  return getValue(hotel, [
    "website",
    "website_url",
    "hotel_website",
    "official_website",
  ]);
}

/* -------------------------------------------------------
   PHONE
------------------------------------------------------- */

function getPhone(hotel: Hotel) {
  return getValue(hotel, [
    "phone",
    "telephone",
    "phone_number",
    "telephone_number",
    "contact_number",
  ]);
}

/* -------------------------------------------------------
   LOCATION
------------------------------------------------------- */

function getLocation(hotel: Hotel) {
  return getValue(hotel, [
    "address",
    "location",
    "hotel_address",
  ]);
}

/* -------------------------------------------------------
   PRICE FORMAT
------------------------------------------------------- */

function formatPrice(value: any) {
  if (value === null || value === undefined) {
    return "Not available";
  }

  const stringValue = String(value).trim();

  if (!stringValue) {
    return "Not available";
  }

  // If already contains LKR
  if (stringValue.toLowerCase().includes("lkr")) {
    return stringValue;
  }

  // Numeric price
  const numericValue = Number(value);

  if (!Number.isNaN(numericValue)) {
    return `LKR ${numericValue.toLocaleString()}`;
  }

  return stringValue;
}

/* -------------------------------------------------------
   WEBSITE FORMAT
------------------------------------------------------- */

function formatWebsite(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

/* -------------------------------------------------------
   MAIN PAGE
------------------------------------------------------- */

export default function ComparePage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);

  const [selectedHotels, setSelectedHotels] = useState<
    (number | null)[]
  >([null, null, null]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* -----------------------------------------------------
     LOAD HOTELS FROM SUPABASE
  ----------------------------------------------------- */

  useEffect(() => {
    async function loadHotels() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("hotels")
        .select("*")
        .order("hotel_name", { ascending: true });

      if (error) {
        console.error("Supabase hotel error:", error);

        setError(
          "Unable to load hotel information from Supabase."
        );

        setLoading(false);
        return;
      }

      console.log("Hotels loaded from Supabase:", data);

      if (data) {
        setHotels(data as Hotel[]);
      }

      setLoading(false);
    }

    loadHotels();
  }, []);

  /* -----------------------------------------------------
     SELECTED HOTEL OBJECTS
  ----------------------------------------------------- */

  const selectedHotelObjects = useMemo(() => {
    return selectedHotels.map((hotelId) => {
      if (hotelId === null) {
        return null;
      }

      return (
        hotels.find(
          (hotel) =>
            Number(hotel.hotel_id) === Number(hotelId)
        ) || null
      );
    });
  }, [selectedHotels, hotels]);

  /* -----------------------------------------------------
     SELECT HOTEL
  ----------------------------------------------------- */

  function selectHotel(
    index: number,
    hotelId: string
  ) {
    setSelectedHotels((previous) => {
      const updated = [...previous];

      if (!hotelId) {
        updated[index] = null;
      } else {
        updated[index] = Number(hotelId);
      }

      return updated;
    });
  }

  /* -----------------------------------------------------
     REMOVE HOTEL
  ----------------------------------------------------- */

  function removeHotel(index: number) {
    setSelectedHotels((previous) => {
      const updated = [...previous];

      updated[index] = null;

      return updated;
    });
  }

  const hasSelectedHotels =
    selectedHotelObjects.some(Boolean);

  /* -----------------------------------------------------
     PAGE
  ----------------------------------------------------- */

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#0b1625]">

      {/* HERO */}
      <section className="bg-[#091423] px-6 py-14 text-white md:px-10 lg:px-14">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">

            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#d1a044]">
              Compare Hotels
            </p>

            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Compare your hotel options
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              Compare hotel ratings, reviews, buffet
              information, pricing and other available
              details in one place.
            </p>

          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8 lg:px-10">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#b48632]">
              Hotel comparison
            </p>

            <h2 className="mt-1 text-2xl font-semibold text-[#0b1625]">
              Choose up to three hotels
            </h2>
          </div>

          <p className="text-sm text-slate-500">
            {loading
              ? "Loading hotels..."
              : `${hotels.length} hotels available`}
          </p>

        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* HOTEL SELECTORS */}
        <div className="grid gap-5 md:grid-cols-3">

          {[0, 1, 2].map((index) => {
            const selectedHotel =
              selectedHotelObjects[index];

            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >

                <div className="mb-4 flex items-center justify-between">

                  <p className="text-sm font-semibold text-slate-500">
                    Hotel {index + 1}
                  </p>

                  {selectedHotel && (
                    <button
                      onClick={() => removeHotel(index)}
                      className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      <X size={17} />
                    </button>
                  )}

                </div>

                {/* SELECT */}
                <div className="relative">

                  <select
                    value={
                      selectedHotels[index] ?? ""
                    }
                    onChange={(event) =>
                      selectHotel(
                        index,
                        event.target.value
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-10 text-sm font-medium text-[#0b1625] outline-none transition focus:border-[#d1a044] focus:ring-2 focus:ring-[#d1a044]/20"
                  >

                    <option value="">
                      Select a hotel
                    </option>

                    {hotels.map((hotel) => {

                      const alreadySelected =
                        selectedHotels.includes(
                          Number(hotel.hotel_id)
                        ) &&
                        selectedHotels[index] !==
                          Number(hotel.hotel_id);

                      return (
                        <option
                          key={hotel.hotel_id}
                          value={hotel.hotel_id}
                          disabled={alreadySelected}
                        >
                          {hotel.hotel_name ||
                            "Unnamed Hotel"}
                        </option>
                      );
                    })}

                  </select>

                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                </div>

                {/* SELECTED HOTEL PREVIEW */}
                {selectedHotel && (
                  <div className="mt-4 overflow-hidden rounded-xl border border-slate-100">

                    <div className="relative h-40">

                      {selectedHotel.image_url ? (
                        <img
                          src={selectedHotel.image_url}
                          alt={
                            selectedHotel.hotel_name ||
                            "Hotel"
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-slate-100 text-sm text-slate-400">
                          No image available
                        </div>
                      )}

                    </div>

                    <div className="p-4">

                      <h3 className="line-clamp-2 text-base font-semibold text-[#0b1625]">
                        {selectedHotel.hotel_name ||
                          "Unnamed Hotel"}
                      </h3>

                      {selectedHotel.restaurant_name && (
                        <p className="mt-1 text-sm text-slate-500">
                          {selectedHotel.restaurant_name}
                        </p>
                      )}

                    </div>

                  </div>
                )}

              </div>
            );
          })}

        </div>

        {/* EMPTY */}
        {!hasSelectedHotels && !loading && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#d1a044]/10">
              <ArrowRight
                className="text-[#b48632]"
                size={24}
              />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-[#0b1625]">
              Start comparing hotels
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Select two or three hotels above to see
              their available information side by side.
            </p>

          </div>
        )}

        {/* COMPARISON */}
        {hasSelectedHotels && (
          <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* TITLE */}
            <div className="border-b border-slate-200 px-6 py-5">

              <p className="text-sm font-semibold uppercase tracking-wider text-[#b48632]">
                Comparison
              </p>

              <h2 className="mt-1 text-xl font-semibold text-[#0b1625]">
                Hotel details
              </h2>

            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">

              <div className="min-w-[850px]">

                {/* HOTEL HEADER */}
                <div className="grid grid-cols-[190px_repeat(3,minmax(210px,1fr))] border-b border-slate-200">

                  <div className="bg-slate-50 p-5">
                    <span className="text-sm font-semibold text-slate-500">
                      Hotels
                    </span>
                  </div>

                  {selectedHotelObjects.map(
                    (hotel, index) => (

                      <div
                        key={index}
                        className="border-l border-slate-200 p-5"
                      >

                        {hotel ? (
                          <>
                            <div className="relative h-32 overflow-hidden rounded-xl">

                              {hotel.image_url ? (
                                <img
                                  src={hotel.image_url}
                                  alt={
                                    hotel.hotel_name ||
                                    "Hotel"
                                  }
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center bg-slate-100 text-sm text-slate-400">
                                  No image
                                </div>
                              )}

                            </div>

                            <h3 className="mt-4 line-clamp-2 font-semibold text-[#0b1625]">
                              {hotel.hotel_name ||
                                "Unnamed Hotel"}
                            </h3>

                            {hotel.restaurant_name && (
                              <p className="mt-1 text-xs text-slate-500">
                                {hotel.restaurant_name}
                              </p>
                            )}

                          </>
                        ) : (
                          <div className="flex min-h-[180px] items-center justify-center text-sm text-slate-400">
                            Select a hotel
                          </div>
                        )}

                      </div>
                    )
                  )}

                </div>

                {/* RATING */}
                <ComparisonRow
                  label="Rating"
                  icon={
                    <Star size={17} />
                  }
                  values={selectedHotelObjects.map(
                    (hotel) => {

                      if (!hotel) {
                        return "—";
                      }

                      const rating =
                        getRating(hotel);

                      const reviewCount =
                        getReviewCount(hotel);

                      if (rating === null) {
                        return "Not available";
                      }

                      return (
                        <span className="inline-flex items-center gap-2">

                          <span className="flex items-center gap-1 font-semibold text-[#0b1625]">

                            <Star
                              size={16}
                              fill="currentColor"
                              className="text-[#d1a044]"
                            />

                            {rating.toFixed(1)}

                          </span>

                          {reviewCount !== null && (
                            <span className="text-slate-500">
                              (
                              {reviewCount.toLocaleString()}
                              {" "}
                              reviews)
                            </span>
                          )}

                        </span>
                      );
                    }
                  )}
                />

                {/* PRICE */}
                <ComparisonRow
                  label="Price"
                  values={selectedHotelObjects.map(
                    (hotel) => {

                      if (!hotel) {
                        return "—";
                      }

                      const price =
                        getPrice(hotel);

                      return (
                        <span className="font-semibold text-[#0b1625]">
                          {formatPrice(price)}
                        </span>
                      );
                    }
                  )}
                />

                {/* BUFFET TIME */}
                <ComparisonRow
                  label="Buffet time"
                  values={selectedHotelObjects.map(
                    (hotel) => {

                      if (!hotel) {
                        return "—";
                      }

                      const buffetTime =
                        getBuffetTime(hotel);

                      return (
                        buffetTime ||
                        "Not available"
                      );
                    }
                  )}
                />

                {/* RESTAURANT */}
                <ComparisonRow
                  label="Restaurant"
                  values={selectedHotelObjects.map(
                    (hotel) =>
                      hotel
                        ? hotel.restaurant_name ||
                          "Not available"
                        : "—"
                  )}
                />

                {/* LOCATION */}
                <ComparisonRow
                  label="Location"
                  icon={
                    <MapPin size={17} />
                  }
                  values={selectedHotelObjects.map(
                    (hotel) => {

                      if (!hotel) {
                        return "—";
                      }

                      return (
                        getLocation(hotel) ||
                        "Not available"
                      );
                    }
                  )}
                />

                {/* PHONE */}
                <ComparisonRow
                  label="Contact"
                  icon={
                    <Phone size={17} />
                  }
                  values={selectedHotelObjects.map(
                    (hotel) => {

                      if (!hotel) {
                        return "—";
                      }

                      const phone =
                        getPhone(hotel);

                      if (!phone) {
                        return "Not available";
                      }

                      return (
                        <a
                          href={`tel:${phone}`}
                          className="font-medium text-[#9b732b] hover:underline"
                        >
                          {phone}
                        </a>
                      );
                    }
                  )}
                />

                {/* WEBSITE */}
                <ComparisonRow
                  label="Website"
                  icon={
                    <Globe size={17} />
                  }
                  values={selectedHotelObjects.map(
                    (hotel) => {

                      if (!hotel) {
                        return "—";
                      }

                      const website =
                        getWebsite(hotel);

                      if (!website) {
                        return "Not available";
                      }

                      const finalUrl =
                        String(website).startsWith(
                          "http"
                        )
                          ? String(website)
                          : `https://${website}`;

                      return (
                        <a
                          href={finalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-medium text-[#9b732b] hover:underline"
                        >
                          {formatWebsite(
                            finalUrl
                          )}

                          <ArrowRight
                            size={14}
                          />
                        </a>
                      );
                    }
                  )}
                />

                {/* DESCRIPTION */}
                <ComparisonRow
                  label="Description"
                  values={selectedHotelObjects.map(
                    (hotel) =>
                      hotel
                        ? hotel.description ||
                          "Not available"
                        : "—"
                  )}
                  tall
                />

              </div>

            </div>

          </div>
        )}

        {/* INFO */}
        {hasSelectedHotels && (
          <div className="mt-6 flex gap-3 rounded-2xl border border-[#d1a044]/25 bg-[#d1a044]/5 p-5">

            <div className="mt-0.5 shrink-0">
              <Check
                size={18}
                className="text-[#b48632]"
              />
            </div>

            <div>

              <h3 className="text-sm font-semibold text-[#0b1625]">
                About the comparison data
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Ratings, prices, buffet information and
                other hotel details are loaded directly
                from your Supabase hotel data.
              </p>

            </div>

          </div>
        )}

      </section>
    </main>
  );
}

/* -------------------------------------------------------
   COMPARISON ROW
------------------------------------------------------- */

function ComparisonRow({
  label,
  icon,
  values,
  tall = false,
}: {
  label: string;
  icon?: React.ReactNode;
  values: React.ReactNode[];
  tall?: boolean;
}) {
  return (
    <div className="grid grid-cols-[190px_repeat(3,minmax(210px,1fr))] border-b border-slate-100 last:border-b-0">

      <div
        className={`flex gap-2 bg-slate-50 p-5 ${
          tall
            ? "items-start"
            : "items-center"
        }`}
      >

        {icon && (
          <span className="text-[#b48632]">
            {icon}
          </span>
        )}

        <span className="text-sm font-semibold text-slate-600">
          {label}
        </span>

      </div>

      {values.map((value, index) => (
        <div
          key={index}
          className={`border-l border-slate-100 p-5 text-sm leading-6 text-slate-600 ${
            tall
              ? "min-h-[130px]"
              : "min-h-[72px]"
          }`}
        >
          {value}
        </div>
      ))}

    </div>
  );
}