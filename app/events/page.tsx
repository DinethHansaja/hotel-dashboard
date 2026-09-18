"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Heart,
  MapPin,
  Phone,
  ExternalLink,
  Users,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type Hotel = {
  hotel_id?: number | string;
  hotel_name?: string;
  restaurant_name?: string;
  image_url?: string;
  description?: string;
  rating?: number | string;
  Rating?: number | string;
  review_count?: number | string;
  address?: string;
  website?: string;
  contact_number?: string;
  phone?: string;
};

type EventProfile = {
  types: string[];
  venue: string;
  capacity: string;
  venueDescription: string;
  highlights: string[];
  services: string[];
  verified: boolean;
  source?: string;
};

const eventProfiles: Record<string, EventProfile> = {
  "cinnamon grand colombo": {
    types: ["Weddings", "Corporate", "Celebrations"],
    venue: "Mahogany",
    capacity: "400 banquet • 800 cocktail",
    venueDescription:
      "A large event space at Cinnamon Grand Colombo suitable for weddings, banquets and large celebrations.",
    highlights: [
      "Multiple event rooms",
      "Large banquet spaces",
      "Central Colombo location",
    ],
    services: [
      "Wedding events",
      "Corporate functions",
      "Banquet events",
    ],
    verified: true,
    source:
      "https://www.cinnamonhotels.com/cinnamon-grand-colombo/weddings-and-events",
  },

  "cinnamon lakeside colombo": {
    types: ["Weddings", "Corporate", "Celebrations"],
    venue: "King's Court",
    capacity: "400 banquet • 600 theatre • 600 cocktail",
    venueDescription:
      "King's Court is one of several event venues at Cinnamon Lakeside. The hotel also lists Imperial Court and 8° on the Lake among its event spaces.",
    highlights: [
      "Lakeside setting",
      "Multiple event venues",
      "Large-capacity ballroom",
    ],
    services: [
      "Wedding events",
      "Corporate events",
      "Private parties",
    ],
    verified: true,
    source:
      "https://www.cinnamonhotels.com/cinnamon-lakeside-colombo/weddings-and-events",
  },

  "cinnamon life at city of dreams": {
    types: ["Weddings", "Corporate", "Luxury Events"],
    venue: "Lumina Ballroom",
    capacity: "1,040 banquet • 1,860 theatre",
    venueDescription:
      "A large modern ballroom designed for major weddings, conferences and large-scale celebrations.",
    highlights: [
      "Large luxury ballroom",
      "Modern event facilities",
      "City and ocean views",
    ],
    services: [
      "Wedding planning",
      "Large events",
      "Corporate functions",
    ],
    verified: true,
    source:
      "https://www.cinnamonhotels.com/cinnamon-life-city-of-dreams-sri-lanka/weddings-and-events",
  },

  "cinnamon red colombo": {
    types: ["Corporate", "Celebrations"],
    venue: "Event enquiries",
    capacity: "Contact hotel",
    venueDescription:
      "For the latest event spaces, availability and capacity information, contact the hotel directly.",
    highlights: [
      "Central Colombo location",
      "Contemporary hotel",
      "Easy city access",
    ],
    services: [
      "Corporate enquiries",
      "Private functions",
      "Hotel events",
    ],
    verified: false,
  },

  "nuwa hotel at city of dreams": {
    types: ["Luxury Events", "Celebrations"],
    venue: "City of Dreams event facilities",
    capacity: "Contact hotel",
    venueDescription:
      "Nuwa is part of the City of Dreams destination. Event requirements should be confirmed directly with the resort.",
    highlights: [
      "Ultra-luxury setting",
      "Integrated resort",
      "Premium Colombo location",
    ],
    services: [
      "Luxury functions",
      "Private events",
      "Resort events",
    ],
    verified: false,
  },

  "shangri-la colombo": {
    types: ["Weddings", "Corporate", "Celebrations"],
    venue: "Shangri-La Ballroom",
    capacity: "1,440 banquet • 3,000 reception",
    venueDescription:
      "The Shangri-La Ballroom is a major Colombo event space. The property also offers outdoor event options overlooking the waterfront.",
    highlights: [
      "Waterfront location",
      "Large ballroom",
      "Outdoor event options",
    ],
    services: [
      "Wedding celebrations",
      "Corporate events",
      "Outdoor functions",
    ],
    verified: true,
    source:
      "https://www.shangri-la.com/colombo/shangrila/weddings-celebrations/",
  },

  "the kingsbury colombo": {
    types: ["Weddings", "Corporate", "Celebrations"],
    venue: "The Balmoral",
    capacity: "850 theatre • 750 cocktail",
    venueDescription:
      "The Balmoral is one of the larger event venues at The Kingsbury, alongside Victorian, Winchester and Oval.",
    highlights: [
      "Multiple wedding venues",
      "Central Colombo location",
      "Large ballroom",
    ],
    services: [
      "Wedding specialists",
      "Wedding packages",
      "Event planning",
    ],
    verified: true,
    source: "https://www.thekingsburyhotel.com/weddings",
  },

  "taj samudra, colombo": {
    types: ["Weddings", "Corporate", "Celebrations"],
    venue: "Samudra Ballroom",
    capacity: "Contact hotel",
    venueDescription:
      "A seafront Colombo venue suitable for weddings, banquets and corporate functions.",
    highlights: [
      "Seafront setting",
      "Ocean-facing venue",
      "Banquet facilities",
    ],
    services: [
      "Wedding events",
      "Banquets",
      "Corporate events",
    ],
    verified: true,
    source:
      "https://www.tajhotels.com/en-in/hotels/taj-samudra-colombo",
  },

  "itc ratnadipa colombo": {
    types: ["Weddings", "Luxury Events", "Celebrations"],
    venue: "Wedding venues",
    capacity: "Contact hotel",
    venueDescription:
      "A luxury Colombo destination offering wedding experiences and professional event support.",
    highlights: [
      "Luxury wedding setting",
      "Event specialists",
      "Oceanfront location",
    ],
    services: [
      "Wedding planning",
      "Culinary experiences",
      "Event coordination",
    ],
    verified: true,
    source:
      "https://www.itchotels.com/in/en/itcratnadipa-colombo",
  },

  "galle face hotel": {
    types: ["Weddings", "Outdoor Events", "Celebrations"],
    venue: "The Chequerboard",
    capacity: "Up to 1,000 guests",
    venueDescription:
      "An outdoor seafront setting suitable for weddings, sundown events and large celebrations.",
    highlights: [
      "Historic Colombo hotel",
      "Seafront setting",
      "Outdoor wedding venue",
    ],
    services: [
      "Wedding packages",
      "Outdoor weddings",
      "Wedding coordination",
    ],
    verified: true,
    source: "https://gallefacehotel.com/weddings/",
  },

  "water's edge hotel": {
    types: ["Weddings", "Corporate", "Outdoor Events"],
    venue: "Grand Ballroom",
    capacity: "350+ guests",
    venueDescription:
      "Water's Edge offers a wide selection of indoor and outdoor venues including the Grand Ballroom, Grand Lawn, Jetty Green and Fiftykay Orchids.",
    highlights: [
      "Waterfront setting",
      "Indoor and outdoor venues",
      "Large landscaped grounds",
    ],
    services: [
      "Wedding planning",
      "Corporate events",
      "Private functions",
    ],
    verified: true,
    source: "https://www.watersedge.lk/wedding/",
  },

  "hilton colombo": {
    types: ["Weddings", "Corporate", "Meetings"],
    venue: "Grand Ballroom",
    capacity: "700 banquet • 900 theatre",
    venueDescription:
      "A major Colombo event venue with a pillar-free ballroom, professional planners and extensive event facilities.",
    highlights: [
      "Pillar-free ballroom",
      "Central Colombo location",
      "Large event capacity",
    ],
    services: [
      "Event planning",
      "Audio visual facilities",
      "Wedding events",
    ],
    verified: true,
    source:
      "https://www.hilton.com/en/hotels/colhitw-hilton-colombo/events/",
  },

  "pullman hotel kollupitiya": {
    types: ["Corporate", "Meetings", "Celebrations"],
    venue: "Event enquiries",
    capacity: "Contact hotel",
    venueDescription:
      "Contact the hotel for current meeting, event and private-function options.",
    highlights: [
      "Central Colombo",
      "Contemporary hotel",
      "Business-friendly location",
    ],
    services: [
      "Corporate events",
      "Meetings",
      "Private functions",
    ],
    verified: false,
  },

  "hilton colombo residences": {
    types: ["Weddings", "Corporate", "Meetings"],
    venue: "Union Ballroom",
    capacity: "850 banquet • 1,100 theatre",
    venueDescription:
      "A large Colombo ballroom suitable for weddings, conferences and other major events.",
    highlights: [
      "Large ballroom",
      "Flexible event spaces",
      "Central Colombo",
    ],
    services: [
      "Wedding events",
      "Corporate events",
      "Customized catering",
    ],
    verified: true,
    source:
      "https://www.hilton.com/en/hotels/coljttw-hilton-colombo-residences/events/",
  },

  "courtyard by marriott colombo": {
    types: ["Weddings", "Corporate", "Meetings"],
    venue: "Grand Sapphire",
    capacity: "200 banquet • 300 theatre",
    venueDescription:
      "A modern event venue with flexible spaces, professional planners, technology and custom menus.",
    highlights: [
      "Modern event spaces",
      "Professional planners",
      "Custom menus",
    ],
    services: [
      "Wedding planning",
      "Corporate events",
      "Custom catering",
    ],
    verified: true,
    source:
      "https://www.marriott.com/en-us/hotels/cmbcy-courtyard-colombo/events/",
  },

  "colombo court hotel & spa": {
    types: ["Weddings", "Corporate", "Celebrations"],
    venue: "Cloud Cafe",
    capacity: "Up to 100 cocktail",
    venueDescription:
      "A boutique Colombo venue offering rooftop and indoor spaces for private functions and celebrations.",
    highlights: [
      "Rooftop setting",
      "Boutique atmosphere",
      "Multiple event spaces",
    ],
    services: [
      "Private functions",
      "Corporate meetings",
      "Celebrations",
    ],
    verified: true,
    source:
      "https://www.colombocourthotel.com/meetings-events/plan-an-event.html",
  },

  "mandarina colombo": {
    types: ["Weddings", "Corporate", "Meetings"],
    venue: "Magnolia Ballroom",
    capacity: "Up to 250 guests",
    venueDescription:
      "A modern Colombo hotel with multiple flexible event spaces, including the Magnolia Ballroom.",
    highlights: [
      "Multiple event spaces",
      "250-person ballroom",
      "Central Colombo",
    ],
    services: [
      "Wedding events",
      "Corporate events",
      "Meetings",
    ],
    verified: true,
    source: "https://www.mandarinacolombo.com/events/",
  },

  "ramada hotel colombo": {
    types: ["Weddings", "Corporate", "Celebrations"],
    venue: "Liberty Ballroom",
    capacity: "Up to 900 guests",
    venueDescription:
      "A large ballroom designed for weddings, special occasions and other major functions.",
    highlights: [
      "Large ballroom",
      "Wedding facilities",
      "Central Colombo",
    ],
    services: [
      "Wedding packages",
      "Banquet functions",
      "Corporate meetings",
    ],
    verified: true,
    source: "https://www.ramadacolombo.com/banquets/",
  },

  "amari hotel": {
    types: ["Weddings", "Corporate", "Celebrations"],
    venue: "Saffira Ballroom",
    capacity: "250 theatre • 140 banquet",
    venueDescription:
      "A contemporary Colombo hotel with several function rooms, event planning and modern facilities.",
    highlights: [
      "Seafront location",
      "Modern event spaces",
      "Multiple function rooms",
    ],
    services: [
      "Wedding events",
      "Corporate events",
      "Event planning",
    ],
    verified: true,
    source: "https://www.amari.com/colombo/meetings-events",
  },

  "paradise road tintagel colombo": {
    types: ["Weddings", "Private Events", "Celebrations"],
    venue: "Tintagel Event Spaces",
    capacity: "Contact hotel",
    venueDescription:
      "An intimate boutique setting suited to private celebrations and tailored wedding experiences.",
    highlights: [
      "Boutique atmosphere",
      "Private celebrations",
      "Tailored events",
    ],
    services: [
      "Wedding planning",
      "Private events",
      "Celebrations",
    ],
    verified: true,
    source:
      "https://paradiseroadhotels.com/tintagel/plan_event/wedding/",
  },

  "granbell hotel colombo": {
    types: ["Weddings", "Corporate", "Celebrations"],
    venue: "Banquet Hall",
    capacity: "Up to 65 guests",
    venueDescription:
      "An intimate sea-view banquet space suitable for weddings, birthdays, conferences and private celebrations.",
    highlights: [
      "Sea views",
      "Intimate venue",
      "Audio visual facilities",
    ],
    services: [
      "Weddings",
      "Corporate events",
      "Private celebrations",
    ],
    verified: true,
    source:
      "https://granbellhotel.lk/facilities/banquet-hall/",
  },

  "marino beach colombo": {
    types: ["Weddings", "Corporate", "Celebrations"],
    venue: "Marino Banquet Hall",
    capacity: "Up to 500 guests",
    venueDescription:
      "A modern multipurpose banquet hall suitable for weddings, engagements, dinners, awards and conferences.",
    highlights: [
      "Large banquet hall",
      "Modern technology",
      "Multiple event types",
    ],
    services: [
      "Wedding events",
      "Engagement parties",
      "Corporate events",
    ],
    verified: true,
    source:
      "https://www.marinobeach.com/banquet_hall.php",
  },

  "sheraton hotel colombo": {
    types: ["Weddings", "Corporate", "Meetings"],
    venue: "Emerald",
    capacity: "Up to 250 guests",
    venueDescription:
      "A modern Colombo hotel with 7 event rooms, professional event services and wedding support.",
    highlights: [
      "Seven event rooms",
      "Wedding services",
      "Modern AV facilities",
    ],
    services: [
      "Wedding planning",
      "Corporate events",
      "Audio visual services",
    ],
    verified: true,
    source:
      "https://www.marriott.com/en-us/hotels/cmbsi-sheraton-colombo-hotel/events/",
  },
};

const filters = [
  "All",
  "Weddings",
  "Corporate",
  "Celebrations",
  "Meetings",
  "Outdoor Events",
];

function normalizeName(name?: string) {
  return (name || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[.,]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getProfile(hotelName?: string) {
  const normalized = normalizeName(hotelName);

  if (eventProfiles[normalized]) {
    return eventProfiles[normalized];
  }

  const key = Object.keys(eventProfiles).find(
    (item) =>
      normalized.includes(item) ||
      item.includes(normalized)
  );

  return key ? eventProfiles[key] : null;
}

export default function EventsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [favourites, setFavourites] = useState<string[]>([]);

  useEffect(() => {
    async function loadHotels() {
      const { data, error } = await supabase
        .from("hotels")
        .select("*")
        .order("hotel_name", { ascending: true });

      if (error) {
        console.error("Error loading hotels:", error);
        setHotels([]);
      } else {
        setHotels(data || []);
      }

      setLoading(false);
    }

    loadHotels();
  }, []);

  const hotelsWithEvents = useMemo(() => {
    return hotels.map((hotel) => ({
      hotel,
      profile: getProfile(hotel.hotel_name),
    }));
  }, [hotels]);

  const filteredHotels = useMemo(() => {
    const query = search.toLowerCase().trim();

    return hotelsWithEvents.filter(({ hotel, profile }) => {
      const hotelName = hotel.hotel_name || "";

      const searchableText = [
        hotelName,
        hotel.address || "",
        hotel.description || "",
        profile?.venue || "",
        ...(profile?.types || []),
        ...(profile?.services || []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      const matchesFilter =
        activeFilter === "All" ||
        profile?.types.includes(activeFilter);

      return matchesSearch && matchesFilter;
    });
  }, [hotelsWithEvents, search, activeFilter]);

  const toggleFavourite = (hotelId: string) => {
    setFavourites((current) =>
      current.includes(hotelId)
        ? current.filter((id) => id !== hotelId)
        : [...current, hotelId]
    );
  };

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#101828]">

      {/* HERO */}
      <section className="bg-[#091423]">
        <div className="mx-auto max-w-[1500px] px-6 py-12 lg:px-10 lg:py-16">

          <div className="max-w-3xl">

            <div className="mb-5 inline-flex items-center rounded-full border border-[#d1a044]/40 bg-[#d1a044]/10 px-4 py-2 text-sm font-semibold text-[#e2b85d]">
              Colombo Events & Weddings
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find the perfect
              <span className="block text-[#d1a044]">
                place to celebrate.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Explore wedding venues, event spaces, corporate
              functions and celebrations across Colombo.
            </p>

            {/* SEARCH */}
            <div className="mt-8 max-w-3xl">
              <div className="flex items-center rounded-2xl bg-white px-4 py-2 shadow-xl">

                <Search
                  size={21}
                  className="shrink-0 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search hotels, venues or event types..."
                  className="w-full bg-transparent px-4 py-3 text-sm outline-none placeholder:text-slate-400"
                />

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FILTER / HEADER */}
      <section className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-[1500px] px-6 py-5 lg:px-10">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="text-2xl font-bold text-[#091423]">
                Events & Weddings
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredHotels.length} hotels available
              </p>
            </div>

            <div className="flex flex-wrap gap-2">

              {filters.map((filter) => {
                const active =
                  activeFilter === filter;

                return (
                  <button
                    key={filter}
                    onClick={() =>
                      setActiveFilter(filter)
                    }
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      active
                        ? "border-[#091423] bg-[#091423] text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-[#c99a3e] hover:text-[#091423]"
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}

            </div>

          </div>

        </div>

      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-[1500px] px-6 py-8 lg:px-10 lg:py-10">

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <div className="h-56 animate-pulse bg-slate-200" />

                  <div className="space-y-4 p-6">
                    <div className="h-6 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 animate-pulse rounded bg-slate-200" />
                    <div className="h-20 animate-pulse rounded bg-slate-200" />
                  </div>
                </div>
              )
            )}

          </div>
        ) : filteredHotels.length === 0 ? (

          <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center">

            <Search
              size={36}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 text-lg font-semibold text-[#091423]">
              No hotels found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try another hotel name or event category.
            </p>

          </div>

        ) : (

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {filteredHotels.map(
              ({ hotel, profile }) => {

                const hotelId = String(
                  hotel.hotel_id ??
                    hotel.hotel_name ??
                    ""
                );

                const rating =
                  hotel.rating ??
                  hotel.Rating ??
                  null;

                const phone =
                  hotel.contact_number ??
                  hotel.phone ??
                  "";

                const isFavourite =
                  favourites.includes(hotelId);

                return (
                  <article
                    key={hotelId}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >

                    {/* IMAGE */}
                    <div className="relative h-60 overflow-hidden bg-slate-200">

                      {hotel.image_url ? (
                        <img
                          src={hotel.image_url}
                          alt={
                            hotel.hotel_name ||
                            "Hotel"
                          }
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-[#091423] text-sm text-slate-400">
                          No hotel image
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent" />

                      <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">

                        <div>
                          <span className="rounded-full bg-[#d1a044] px-3 py-1 text-xs font-semibold text-[#091423]">
                            Events & Weddings
                          </span>
                        </div>

                        <button
                          onClick={() =>
                            toggleFavourite(
                              hotelId
                            )
                          }
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md transition hover:scale-105"
                          aria-label="Favourite hotel"
                        >
                          <Heart
                            size={18}
                            className={
                              isFavourite
                                ? "fill-red-500 text-red-500"
                                : "text-slate-600"
                            }
                          />
                        </button>

                      </div>

                    </div>

                    {/* BODY */}
                    <div className="p-6">

                      {/* TITLE */}
                      <div className="flex items-start justify-between gap-4">

                        <div className="min-w-0">

                          <h3 className="text-xl font-bold leading-tight text-[#091423]">
                            {hotel.hotel_name}
                          </h3>

                          {hotel.address && (
                            <div className="mt-2 flex items-start gap-1.5 text-sm text-slate-500">
                              <MapPin
                                size={15}
                                className="mt-0.5 shrink-0"
                              />

                              <span className="line-clamp-2">
                                {hotel.address}
                              </span>
                            </div>
                          )}

                        </div>

                        {rating && (
                          <div className="shrink-0 rounded-lg bg-[#fff8e8] px-2.5 py-1.5 text-sm font-semibold text-[#966d22]">
                            ★ {rating}
                          </div>
                        )}

                      </div>

                      {/* DESCRIPTION */}
                      {hotel.description && (
                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                          {hotel.description}
                        </p>
                      )}

                      {/* TYPES */}
                      {profile && (
                        <div className="mt-5 flex flex-wrap gap-2">

                          {profile.types.map(
                            (type) => (
                              <span
                                key={type}
                                className="rounded-full bg-[#f4f5f7] px-3 py-1.5 text-xs font-medium text-slate-600"
                              >
                                {type}
                              </span>
                            )
                          )}

                        </div>
                      )}

                      {/* EVENT INFORMATION */}
                      {profile ? (
                        <div className="mt-5 border-t border-slate-100 pt-5">

                          <div className="flex items-start gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#091423] text-[#d1a044]">
                              <CalendarDays
                                size={17}
                              />
                            </div>

                            <div className="min-w-0">

                              <p className="text-xs font-semibold uppercase tracking-wider text-[#a77c2c]">
                                Featured venue
                              </p>

                              <p className="mt-1 font-semibold text-[#091423]">
                                {profile.venue}
                              </p>

                              <p className="mt-1 text-sm font-medium text-slate-700">
                                {profile.capacity}
                              </p>

                            </div>

                          </div>

                          <p className="mt-3 text-sm leading-6 text-slate-500">
                            {profile.venueDescription}
                          </p>

                        </div>
                      ) : (
                        <div className="mt-5 rounded-xl bg-slate-50 p-4">

                          <p className="text-sm font-semibold text-[#091423]">
                            Event information
                          </p>

                          <p className="mt-1 text-sm leading-5 text-slate-500">
                            Contact the hotel directly for current
                            wedding and event venue information.
                          </p>

                        </div>
                      )}

                      {/* SERVICES */}
                      {profile && (
                        <div className="mt-5">

                          <p className="mb-3 text-sm font-semibold text-[#091423]">
                            What they provide
                          </p>

                          <div className="grid grid-cols-2 gap-2">

                            {profile.services.map(
                              (service) => (
                                <div
                                  key={service}
                                  className="flex items-center gap-2 text-sm text-slate-600"
                                >
                                  <CheckCircle2
                                    size={15}
                                    className="shrink-0 text-[#bd8d31]"
                                  />

                                  <span>
                                    {service}
                                  </span>
                                </div>
                              )
                            )}

                          </div>

                        </div>
                      )}

                      {/* ACTIONS */}
                      <div className="mt-6 flex gap-2 border-t border-slate-100 pt-5">

                        {hotel.website ? (
                          <a
                            href={
                              hotel.website
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#091423] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#16263a]"
                          >
                            Official Website
                            <ExternalLink
                              size={15}
                            />
                          </a>
                        ) : profile?.source ? (
                          <a
                            href={
                              profile.source
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#091423] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#16263a]"
                          >
                            Event Details
                            <ExternalLink
                              size={15}
                            />
                          </a>
                        ) : (
                          <div className="flex flex-1 items-center justify-center rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-500">
                            Contact Hotel
                          </div>
                        )}

                        {phone && (
                          <a
                            href={`tel:${phone.replace(
                              /\s/g,
                              ""
                            )}`}
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-[#091423] transition hover:border-[#d1a044] hover:bg-[#fff9ed]"
                            aria-label={`Call ${hotel.hotel_name}`}
                          >
                            <Phone
                              size={17}
                            />
                          </a>
                        )}

                      </div>

                    </div>
                  </article>
                );
              }
            )}

          </div>
        )}

      </section>

      {/* FOOTER NOTE */}
      <section className="mx-auto max-w-[1500px] px-6 pb-10 lg:px-10">

        <div className="border-t border-slate-200 pt-6">

          <p className="text-xs leading-5 text-slate-400">
            Hotel information is displayed from the Colombo hotel
            dataset. Event and wedding details are shown where they
            could be verified from hotel or venue sources. Capacities,
            packages and availability may change, so users should
            confirm current details directly with the venue.
          </p>

        </div>

      </section>

    </main>
  );
}