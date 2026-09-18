"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Star,
  Heart,
  MapPin,
  Phone,
  ExternalLink,
  CalendarDays,
  Users,
  Sparkles,
  ChevronDown,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type Hotel = {
  hotel_id: number;
  hotel_name: string;
  restaurant_name?: string | null;
  image_url?: string | null;
  description?: string | null;
  rating?: number | string | null;
  review_count?: number | string | null;
  address?: string | null;
  location?: string | null;
  phone?: string | null;
  telephone?: string | null;
  website?: string | null;
  website_url?: string | null;
};

type EventProfile = {
  keywords: string[];
  eventTypes: string[];
  venue: string;
  capacity: string;
  description: string;
  services: string[];
};

const eventProfiles: Record<string, EventProfile> = {
  "Shangri-La Colombo": {
    keywords: ["shangri", "shangri-la"],
    eventTypes: ["Weddings", "Corporate", "Celebrations", "Meetings"],
    venue: "Shangri-La Ballroom",
    capacity: "Up to 1,440 banquet / 3,000 reception",
    description:
      "A premium waterfront venue offering elegant wedding and event spaces with dedicated planning support and flexible layouts.",
    services: [
      "Wedding planning",
      "Custom menus",
      "Ballroom events",
      "Outdoor events",
    ],
  },

  "Cinnamon Grand Colombo": {
    keywords: ["cinnamon grand"],
    eventTypes: ["Weddings", "Corporate", "Celebrations", "Meetings"],
    venue: "Mahogany / Oak Room",
    capacity: "Up to 400 banquet / 800 cocktail",
    description:
      "A central Colombo venue with multiple ballroom and function spaces suitable for weddings, conferences and private celebrations.",
    services: [
      "Wedding events",
      "Corporate functions",
      "Private celebrations",
      "Custom catering",
    ],
  },

  "Cinnamon Life": {
    keywords: ["cinnamon life", "city of dreams"],
    eventTypes: ["Weddings", "Corporate", "Celebrations", "Meetings"],
    venue: "Lumina Ballroom",
    capacity: "Up to 1,040 banquet / 1,860 theatre",
    description:
      "A modern large-scale event destination featuring elegant ballrooms and flexible spaces for major celebrations and conferences.",
    services: [
      "Large weddings",
      "Corporate events",
      "Conferences",
      "Custom event planning",
    ],
  },

  "Cinnamon Lakeside Colombo": {
    keywords: ["cinnamon lakeside"],
    eventTypes: ["Weddings", "Corporate", "Celebrations", "Meetings"],
    venue: "Imperial Court",
    capacity: "Up to 650 banquet / 1,200 theatre",
    description:
      "A lakeside Colombo venue offering ballroom and outdoor-style event spaces for weddings, conferences and private functions.",
    services: [
      "Weddings",
      "Corporate events",
      "Private parties",
      "Banquets",
    ],
  },

  "Hilton Colombo": {
    keywords: ["hilton colombo"],
    eventTypes: ["Weddings", "Corporate", "Celebrations", "Meetings"],
    venue: "Grand Ballroom",
    capacity: "Up to 700 banquet / 900 theatre",
    description:
      "A major Colombo events venue with a pillarless ballroom, professional planners and flexible meeting spaces.",
    services: [
      "Wedding planning",
      "Corporate events",
      "AV facilities",
      "Private celebrations",
    ],
  },

  "Galle Face Hotel": {
    keywords: ["galle face"],
    eventTypes: ["Weddings", "Celebrations", "Corporate", "Outdoor Events"],
    venue: "Chequerboard / Grand Ballroom",
    capacity: "Up to 1,000 guests",
    description:
      "A historic oceanfront setting combining heritage character with indoor and outdoor spaces for weddings and celebrations.",
    services: [
      "Oceanfront weddings",
      "Outdoor events",
      "Wedding coordination",
      "Custom menus",
    ],
  },

  "The Kingsbury Colombo": {
    keywords: ["kingsbury"],
    eventTypes: ["Weddings", "Corporate", "Celebrations", "Meetings"],
    venue: "Balmoral",
    capacity: "Up to 850 theatre / 750 cocktail",
    description:
      "A central Colombo hotel with several function rooms designed for weddings, conferences, corporate events and celebrations.",
    services: [
      "Wedding planners",
      "Custom menus",
      "Corporate events",
      "Private celebrations",
    ],
  },

  "Courtyard by Marriott Colombo": {
    keywords: ["courtyard", "marriott"],
    eventTypes: ["Weddings", "Corporate", "Celebrations", "Meetings"],
    venue: "Grand Sapphire",
    capacity: "Up to 300 theatre / 200 banquet",
    description:
      "A modern event venue offering flexible meeting rooms, contemporary technology and custom catering options.",
    services: [
      "Corporate events",
      "Weddings",
      "Meetings",
      "Custom menus",
    ],
  },

  "Sheraton Colombo": {
    keywords: ["sheraton"],
    eventTypes: ["Weddings", "Corporate", "Celebrations", "Meetings"],
    venue: "Emerald",
    capacity: "Up to 250 guests",
    description:
      "A contemporary Colombo venue designed for weddings, meetings and corporate events with modern event facilities.",
    services: [
      "Wedding services",
      "Corporate meetings",
      "Event planning",
      "AV facilities",
    ],
  },

  "Water's Edge": {
    keywords: ["water's edge", "waters edge"],
    eventTypes: ["Weddings", "Corporate", "Celebrations", "Outdoor Events"],
    venue: "Grand Ballroom / Grand Lawn",
    capacity: "From intimate events to large celebrations",
    description:
      "A distinctive waterfront destination with ballroom, lawn and outdoor spaces for weddings, celebrations and corporate events.",
    services: [
      "Waterfront weddings",
      "Outdoor events",
      "Corporate functions",
      "Event planning",
    ],
  },
};

const defaultEventProfile: EventProfile = {
  keywords: [],
  eventTypes: ["Weddings", "Corporate", "Celebrations"],
  venue: "Event & Function Spaces",
  capacity: "Contact hotel for capacity",
  description:
    "Contact the hotel directly for current event packages, venue availability, capacities and event arrangements.",
  services: [
    "Private events",
    "Corporate functions",
    "Celebrations",
  ],
};

const filters = [
  "All",
  "Weddings",
  "Corporate",
  "Celebrations",
  "Meetings",
  "Outdoor Events",
];

function getProfile(hotelName: string): EventProfile {
  const lowerName = hotelName.toLowerCase();

  const exactProfile = Object.entries(eventProfiles).find(
    ([name]) => name.toLowerCase() === lowerName
  );

  if (exactProfile) {
    return exactProfile[1];
  }

  const partialProfile = Object.entries(eventProfiles).find(
    ([, profile]) =>
      profile.keywords.some((keyword) => lowerName.includes(keyword))
  );

  return partialProfile?.[1] ?? defaultEventProfile;
}

function getRating(rating: Hotel["rating"]) {
  if (rating === null || rating === undefined || rating === "") {
    return null;
  }

  const value = Number(rating);

  return Number.isNaN(value) ? null : value;
}

function getPhone(hotel: Hotel) {
  return hotel.phone || hotel.telephone || null;
}

function getWebsite(hotel: Hotel) {
  return hotel.website || hotel.website_url || null;
}

function getLocation(hotel: Hotel) {
  return hotel.address || hotel.location || "Colombo, Sri Lanka";
}

function getWebsiteName(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export default function EventsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [favourites, setFavourites] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    async function loadHotels() {
      setLoading(true);

      const { data, error } = await supabase
        .from("hotels")
        .select("*")
        .order("hotel_name", { ascending: true });

      if (error) {
        console.error("Error loading hotels:", error);
        setHotels([]);
      } else {
        setHotels((data || []) as Hotel[]);
      }

      setLoading(false);
    }

    loadHotels();
  }, []);

  const filteredHotels = useMemo(() => {
    let result = [...hotels];

    const searchText = search.trim().toLowerCase();

    if (searchText) {
      result = result.filter((hotel) => {
        const profile = getProfile(hotel.hotel_name);

        const searchableText = [
          hotel.hotel_name,
          hotel.restaurant_name,
          hotel.address,
          hotel.location,
          profile.venue,
          profile.description,
          ...profile.eventTypes,
          ...profile.services,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(searchText);
      });
    }

    if (activeFilter !== "All") {
      result = result.filter((hotel) => {
        const profile = getProfile(hotel.hotel_name);

        return profile.eventTypes.includes(activeFilter);
      });
    }

    if (sortBy === "rating") {
      result.sort((a, b) => {
        const ratingA = getRating(a.rating) ?? 0;
        const ratingB = getRating(b.rating) ?? 0;

        return ratingB - ratingA;
      });
    } else {
      result.sort((a, b) =>
        a.hotel_name.localeCompare(b.hotel_name)
      );
    }

    return result;
  }, [hotels, search, activeFilter, sortBy]);

  function toggleFavourite(hotelId: number) {
    setFavourites((current) =>
      current.includes(hotelId)
        ? current.filter((id) => id !== hotelId)
        : [...current, hotelId]
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#0b1625]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#091423]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#d1a044] blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-[#d1a044] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#d1a044]">
              Events & Weddings
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              Find the right venue for your next event
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              Explore hotels and event venues across Colombo for weddings,
              corporate functions, celebrations and private gatherings.
            </p>
          </div>

          {/* SEARCH */}
          <div className="mt-9 max-w-4xl">
            <div className="flex items-center rounded-2xl border border-white/10 bg-white p-2 shadow-2xl">
              <Search className="ml-3 h-5 w-5 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search hotels, venues, weddings, corporate events..."
                className="w-full bg-transparent px-4 py-3 text-sm text-[#0b1625] outline-none placeholder:text-slate-400"
              />

              <button
                onClick={() => setSearch("")}
                className="mr-1 rounded-xl bg-[#d1a044] px-5 py-3 text-sm font-semibold text-[#091423] transition hover:bg-[#e0b15a]"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* FILTER ROW */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const active = activeFilter === filter;

              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                    active
                      ? "border-[#d1a044] bg-[#d1a044] text-[#091423]"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[#d1a044] hover:text-[#091423]"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">
              {loading
                ? "Loading venues..."
                : `${filteredHotels.length} ${
                    filteredHotels.length === 1 ? "hotel" : "hotels"
                  } available`}
            </span>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 outline-none focus:border-[#d1a044]"
              >
                <option value="name">Sort by name</option>
                <option value="rating">Sort by rating</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {/* RESULTS */}
        <div className="mt-8">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
                >
                  <div className="h-64 animate-pulse bg-slate-200" />

                  <div className="space-y-4 p-6">
                    <div className="h-6 w-2/3 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredHotels.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center">
              <CalendarDays className="mx-auto h-10 w-10 text-[#d1a044]" />

              <h2 className="mt-4 text-2xl font-bold">
                No venues found
              </h2>

              <p className="mt-2 text-slate-500">
                Try another hotel name or choose a different event type.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setActiveFilter("All");
                }}
                className="mt-6 rounded-xl bg-[#091423] px-5 py-3 text-sm font-semibold text-white"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {filteredHotels.map((hotel) => {
                const profile = getProfile(hotel.hotel_name);
                const rating = getRating(hotel.rating);
                const phone = getPhone(hotel);
                const website = getWebsite(hotel);
                const isFavourite = favourites.includes(hotel.hotel_id);

                return (
                  <article
                    key={hotel.hotel_id}
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    {/* IMAGE */}
                    <div className="relative h-64 overflow-hidden bg-slate-200">
                      {hotel.image_url ? (
                        <img
                          src={hotel.image_url}
                          alt={hotel.hotel_name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-[#091423] text-sm text-slate-300">
                          No hotel image available
                        </div>
                      )}

                      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                        <span className="rounded-full bg-[#091423]/90 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                          Events & Weddings
                        </span>

                        <button
                          onClick={() =>
                            toggleFavourite(hotel.hotel_id)
                          }
                          aria-label="Favourite hotel"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-lg transition hover:bg-white"
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              isFavourite
                                ? "fill-[#d1a044] text-[#d1a044]"
                                : "text-[#091423]"
                            }`}
                          />
                        </button>
                      </div>

                      {rating !== null && (
                        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-white px-3 py-2 shadow-lg">
                          <Star className="h-4 w-4 fill-[#d1a044] text-[#d1a044]" />
                          <span className="text-sm font-bold text-[#091423]">
                            {rating.toFixed(1)}
                          </span>

                          {hotel.review_count !== null &&
                            hotel.review_count !== undefined && (
                              <span className="text-xs text-slate-500">
                                ({hotel.review_count})
                              </span>
                            )}
                        </div>
                      )}
                    </div>

                    {/* BODY */}
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-bold tracking-tight text-[#0b1625]">
                            {hotel.hotel_name}
                          </h2>

                          <div className="mt-2 flex items-start gap-2 text-sm text-slate-500">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#d1a044]" />

                            <span>{getLocation(hotel)}</span>
                          </div>
                        </div>
                      </div>

                      {/* EVENT TYPES */}
                      <div className="mt-5 flex flex-wrap gap-2">
                        {profile.eventTypes.map((eventType) => (
                          <span
                            key={eventType}
                            className="rounded-full bg-[#f8f3e8] px-3 py-1.5 text-xs font-semibold text-[#8c6826]"
                          >
                            {eventType}
                          </span>
                        ))}
                      </div>

                      {/* DESCRIPTION */}
                      <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">
                        {profile.description ||
                          hotel.description ||
                          "Contact the hotel for current event information."}
                      </p>

                      {/* VENUE */}
                      <div className="mt-6 rounded-2xl border border-[#ead9b4] bg-[#fcf8ef] p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d1a044]">
                            <Sparkles className="h-5 w-5 text-[#091423]" />
                          </div>

                          <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-[#9a742b]">
                              Featured venue
                            </p>

                            <p className="mt-1 font-semibold text-[#091423]">
                              {profile.venue}
                            </p>

                            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
                              <Users className="h-3.5 w-3.5" />
                              {profile.capacity}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SERVICES */}
                      <div className="mt-5">
                        <p className="text-sm font-bold text-[#091423]">
                          What they provide
                        </p>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {profile.services.slice(0, 4).map((service) => (
                            <div
                              key={service}
                              className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600"
                            >
                              {service}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="mt-6 flex gap-2">
                        {website && (
                          <a
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#091423] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#16263b]"
                          >
                            Event details
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}

                        {phone && (
                          <a
                            href={`tel:${phone}`}
                            className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#091423] transition hover:border-[#d1a044] hover:bg-[#fcf8ef]"
                            aria-label={`Call ${hotel.hotel_name}`}
                          >
                            <Phone className="h-5 w-5" />
                          </a>
                        )}
                      </div>

                      {/* WEBSITE */}
                      {website && (
                        <div className="mt-4 text-center">
                          <a
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-[#a57925] hover:underline"
                          >
                            {getWebsiteName(website)}
                          </a>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER NOTE */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-500">
          <strong className="text-[#091423]">
            Event information:
          </strong>{" "}
          Venue capacities, packages and availability can change. Please
          contact the hotel directly to confirm the latest event packages,
          pricing and availability.
        </div>
      </section>
    </main>
  );
}