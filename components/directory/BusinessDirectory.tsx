"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Clock3,
  Coffee,
  Globe,
  MapPin,
  Phone,
  Star,
  Utensils,
} from "lucide-react";
import BusinessMap from "@/components/directory/BusinessMap";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import type { DirectoryBusiness } from "@/types/database";
import { formatDataDate, toExternalUrl } from "@/lib/commercialData";

export type { DirectoryBusiness };

type BusinessDirectoryProps = {
  businesses: DirectoryBusiness[];
  kind: "cafe" | "restaurant";
  initialArea?: string;
  initialSearch?: string;
};

function getWebsiteUrl(value: string) {
  return toExternalUrl(value) ?? "#";
}

function getMapUrl(business: DirectoryBusiness) {
  if (business.mapsUrl) return business.mapsUrl;

  if (business.latitude !== null && business.longitude !== null) {
    return (
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(business.latitude + "," + business.longitude)
    );
  }

  if (business.address) {
    return (
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(business.name + " " + business.address)
    );
  }

  return null;
}

export default function BusinessDirectory({
  businesses,
  kind,
  initialArea = "all",
  initialSearch = "",
}: BusinessDirectoryProps) {
  const [search, setSearch] = useState(initialSearch);
  const [selectedArea, setSelectedArea] = useState(initialArea);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sort, setSort] = useState("popular");
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);

  const title = kind === "cafe" ? "Cafés" : "Restaurants";
  const singular = kind === "cafe" ? "café" : "restaurant";
  const Icon = kind === "cafe" ? Coffee : Utensils;

  const areas = useMemo(
    () =>
      [
        ...new Set(
          businesses
            .map((business) => business.area?.trim())
            .filter((area): area is string => Boolean(area))
        ),
      ].sort((a, b) => a.localeCompare(b)),
    [businesses]
  );

  const categories = useMemo(
    () =>
      [
        ...new Set(
          businesses
            .map((business) => business.category?.trim())
            .filter((category): category is string => Boolean(category))
        ),
      ].sort((a, b) => a.localeCompare(b)),
    [businesses]
  );

  const filteredBusinesses = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    const results = businesses.filter((business) => {
      const searchableText = [
        business.id,
        business.name,
        business.category,
        business.address,
        business.area,
        business.telephone,
        business.email,
        business.specialties,
        business.notes,
      ]
        .filter((value): value is string => Boolean(value))
        .join(" ")
        .toLowerCase();

      return (
        (!searchText || searchableText.includes(searchText)) &&
        (selectedArea === "all" || business.area === selectedArea) &&
        (selectedCategory === "all" || business.category === selectedCategory)
      );
    });

    return [...results].sort((first, second) => {
      if (sort === "rating") {
        return (second.rating ?? -1) - (first.rating ?? -1);
      }

      if (sort === "reviews") {
        return (second.reviewCount ?? -1) - (first.reviewCount ?? -1);
      }

      if (sort === "name") {
        return first.name.localeCompare(second.name);
      }

      return 0;
    });
  }, [businesses, search, selectedArea, selectedCategory, sort]);

  const selectedBusiness =
    filteredBusinesses.find((business) => business.id === selectedBusinessId) ??
    filteredBusinesses[0] ??
    null;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="page-container p-5 md:p-8">
        <div className="mb-7">
          <Breadcrumbs items={[{ label: title }]} />

          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <h1 className="page-title">
                {title}
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 md:text-base">
                Discover Colombo’s {singular}s. Explore locations, specialties,
                ratings, and contact details.
              </p>
            </div>

            <div className="rounded-xl bg-white px-4 py-3 text-sm shadow-sm ring-1 ring-slate-200">
              <span className="font-semibold text-slate-900">
                {filteredBusinesses.length}
              </span>{" "}
              {singular}
              {filteredBusinesses.length === 1 ? "" : "s"} available
            </div>
          </div>
        </div>

        <section
          aria-label={title + " search and filters"}
          className="mb-7 rounded-2xl border border-slate-200 bg-white surface-card p-3 shadow-sm"
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="flex h-[50px] items-center rounded-xl border border-slate-200 px-4 focus-within:border-[#c5a46d] focus-within:ring-2 focus-within:ring-[#c5a46d]/20">
              <span className="sr-only">Search businesses</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={
                  "Search " +
                  (kind === "cafe" ? "cafes" : "restaurants") +
                  "..."
                }
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </label>

            <label className="flex h-[50px] items-center rounded-xl border border-slate-200 px-4">
              <span className="sr-only">Filter by area</span>
              <select
                value={selectedArea}
                onChange={(event) => setSelectedArea(event.target.value)}
                className="w-full bg-white text-sm text-slate-700 outline-none"
              >
                <option value="all">All Colombo Areas</option>
                {areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex h-[50px] items-center rounded-xl border border-slate-200 px-4">
              <span className="sr-only">
                Filter by {kind === "cafe" ? "cafe type" : "cuisine"}
              </span>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="w-full bg-white text-sm text-slate-700 outline-none"
              >
                <option value="all">
                  {kind === "cafe" ? "All Cafe Types" : "All Cuisines"}
                </option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex h-[50px] items-center rounded-xl border border-slate-200 px-4">
              <span className="sr-only">Sort businesses</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="w-full bg-white text-sm text-slate-700 outline-none"
              >
                <option value="popular">Default Order</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
                <option value="name">Name A–Z</option>
              </select>
            </label>
          </div>
        </section>

        {(
          kind === "cafe" || kind === "restaurant"
        ) ? (
          <section className="mb-8">
            <div className="mb-3">
              <h2 className="text-xl font-semibold text-slate-900">{title} map</h2>
              <p className="mt-1 text-sm text-slate-500">Hover over a marker for a preview, or select one to see the {singular} details.</p>
            </div>
            <div className="grid min-w-0 grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
              <BusinessMap businesses={filteredBusinesses} kind={kind} selectedBusinessId={selectedBusiness?.id ?? null} onSelectBusiness={setSelectedBusinessId} />
              <article className="flex min-h-[380px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white surface-card shadow-sm lg:h-[560px]">
              {selectedBusiness ? (
                <>
                  <div className="relative h-56 shrink-0 bg-slate-100">
                    {selectedBusiness.imageUrl ? <img src={selectedBusiness.imageUrl} alt={selectedBusiness.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center bg-[#f3eee4]"><Coffee className="h-14 w-14 text-[#806744]" /></div>}
                    {selectedBusiness.area && <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700 shadow">{selectedBusiness.area}</span>}
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto p-5 md:p-6">
                    <h3 className="text-2xl font-bold text-slate-900">{selectedBusiness.name}</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                      {selectedBusiness.rating !== null && <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 fill-amber-500 text-amber-500" />{selectedBusiness.rating.toFixed(1)}<span>listed rating{selectedBusiness.reviewCount !== null ? ` · ${selectedBusiness.reviewCount.toLocaleString()} listed reviews` : ""}</span></span>}
                      {selectedBusiness.category && <span className="inline-flex items-center gap-1"><Coffee className="h-4 w-4 text-[#806744]" />{selectedBusiness.category}</span>}
                      {selectedBusiness.area && <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4 text-[#806744]" />{selectedBusiness.area}</span>}
                    </div>
                    {selectedBusiness.address && <p className="mt-4 text-sm leading-6 text-slate-600">{selectedBusiness.address}</p>}
                    {selectedBusiness.specialties && <p className="mt-3 text-sm leading-6 text-slate-600"><strong className="text-slate-800">Specialties:</strong> {selectedBusiness.specialties}</p>}
                    <div className="mt-5 flex flex-wrap gap-2 border-b border-slate-100 pb-5">
                      {selectedBusiness.telephone && <a href={`tel:${selectedBusiness.telephone}`} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium hover:border-[#c5a46d]"><Phone className="mr-2 inline h-4 w-4" />{selectedBusiness.telephone}</a>}
                      {toExternalUrl(selectedBusiness.website) && <a href={getWebsiteUrl(selectedBusiness.website!)} target="_blank" rel="noopener noreferrer" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium hover:border-[#c5a46d]"><Globe className="mr-2 inline h-4 w-4" />Website</a>}
                      {getMapUrl(selectedBusiness) && toExternalUrl(getMapUrl(selectedBusiness)) && <a href={toExternalUrl(getMapUrl(selectedBusiness))!} target="_blank" rel="noopener noreferrer" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium hover:border-[#c5a46d]"><MapPin className="mr-2 inline h-4 w-4" />Google Maps</a>}
                      {selectedBusiness.email && <a href={`mailto:${selectedBusiness.email}`} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium hover:border-[#c5a46d]">Email</a>}
                    </div>
                    {formatDataDate(selectedBusiness.lastChecked) && <p className="mt-4 text-xs text-slate-500">Listing information last checked {formatDataDate(selectedBusiness.lastChecked)}.</p>}
                    <div className="grid gap-5 pt-4 sm:grid-cols-2">
                      <div><h4 className="font-semibold text-slate-800"><Clock3 className="mr-2 inline h-4 w-4 text-[#806744]" />Opening hours</h4><p className="mt-2 text-sm text-slate-600">{selectedBusiness.openingHours || "Hours not provided"}</p></div>
                      <div><h4 className="font-semibold text-slate-800"><Icon className="mr-2 inline h-4 w-4 text-[#806744]" />{kind === "cafe" ? "Cafe details" : "Restaurant details"}</h4><p className="mt-2 text-sm text-slate-600">{selectedBusiness.priceRange || "Price range not provided"}</p></div>
                    </div>
                  </div>
                </>
              ) : <div className="flex h-full items-center justify-center p-8 text-center text-slate-500">No {singular}s match the selected filters.</div>}
              </article>
            </div>
          </section>
        ) : (
        <section className="mb-8">
          <div className="mb-3">
            <h2 className="text-xl font-semibold text-slate-900">{title} map</h2>
            <p className="mt-1 text-sm text-slate-500">
              Showing businesses with valid coordinates. Select a marker to
              view its details.
            </p>
          </div>

          <BusinessMap businesses={filteredBusinesses} kind={kind} />
        </section>
        )}

        {filteredBusinesses.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white surface-card p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Icon className="h-6 w-6" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No {singular}s found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {filteredBusinesses.length}
              </span>{" "}
              {singular}
              {filteredBusinesses.length === 1 ? "" : "s"}
            </p>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredBusinesses.map((business) => {
                const mapUrl = getMapUrl(business);

                return (
                  <article
                    key={business.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white surface-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="relative h-40 bg-gradient-to-br from-[#14243a] to-[#24364a]">
                      {business.imageUrl ? (
                        <img
                          src={business.imageUrl}
                          alt={business.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Icon className="h-12 w-12 text-[#c5a46d]" />
                        </div>
                      )}

                      {business.area && (
                        <span className="absolute right-4 top-4 rounded-full bg-[#c5a46d] px-3 py-1 text-xs font-semibold text-[#0b1728]">
                          {business.area}
                        </span>
                      )}
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold text-slate-900">
                            {business.name}
                          </h3>

                          {business.category && (
                            <p className="mt-1 text-sm text-slate-500">
                              {business.category}
                            </p>
                          )}

                        </div>

                        {business.priceRange && (
                          <span className="shrink-0 rounded-lg bg-[#c5a46d]/10 px-2.5 py-1 text-xs font-medium text-[#806744]">
                            {business.priceRange}
                          </span>
                        )}
                      </div>

                      {(business.rating !== null ||
                        business.reviewCount !== null) && (
                        <div className="mt-4 flex items-center gap-2 text-sm">
                          {business.rating !== null && (
                            <>
                              <Star className="h-4 w-4 fill-[#c5a46d] text-[#c5a46d]" />
                              <span className="font-semibold text-slate-800">
                                {business.rating.toFixed(1)}
                              </span>
                              <span className="text-xs text-slate-500">listed rating</span>
                            </>
                          )}

                          {business.reviewCount !== null && (
                            <span className="text-slate-500">
                              {business.reviewCount.toLocaleString()} listed reviews
                            </span>
                          )}
                        </div>
                      )}

                      {business.address && (
                        <p className="mt-4 flex gap-2 text-sm leading-5 text-slate-600">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#c5a46d]" />
                          <span>{business.address}</span>
                        </p>
                      )}

                      {business.specialties && (
                        <p className="mt-3 text-sm leading-5 text-slate-600">
                          <span className="font-medium text-slate-800">Specialties: </span>
                          {business.specialties}
                        </p>
                      )}

                      {business.openingHours && (
                        <p className="mt-3 flex gap-2 text-sm leading-5 text-slate-600">
                          <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#c5a46d]" />
                          <span>{business.openingHours}</span>
                        </p>
                      )}

                      <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                        {business.telephone && (
                          <a
                            href={"tel:" + business.telephone}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:border-[#c5a46d] hover:text-[#806744]"
                          >
                            <Phone className="h-3.5 w-3.5" />
                            Call
                          </a>
                        )}

                        {business.email && (
                          <a
                            href={"mailto:" + business.email}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:border-[#c5a46d] hover:text-[#806744]"
                          >
                            Email
                          </a>
                        )}

                        {toExternalUrl(business.website) && (
                          <a
                            href={getWebsiteUrl(business.website!)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:border-[#c5a46d] hover:text-[#806744]"
                          >
                            <Globe className="h-3.5 w-3.5" />
                            Website
                            <ArrowUpRight className="h-3 w-3" />
                          </a>
                        )}

                        {toExternalUrl(business.sourceUrl) && (
                          <a
                            href={toExternalUrl(business.sourceUrl)!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:border-[#c5a46d] hover:text-[#806744]"
                          >
                            Information source
                            <ArrowUpRight className="h-3 w-3" />
                          </a>
                        )}

                        {mapUrl && toExternalUrl(mapUrl) && (
                          <a
                            href={toExternalUrl(mapUrl)!}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:border-[#c5a46d] hover:text-[#806744]"
                          >
                            <MapPin className="h-3.5 w-3.5" />
                            Google Maps
                            <ArrowUpRight className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      {formatDataDate(business.lastChecked) && <p className="mt-3 text-xs text-slate-500">Listing information last checked {formatDataDate(business.lastChecked)}.</p>}
                      {!business.telephone && !business.email && !business.website && <p className="mt-3 text-xs text-slate-500">Contact details are not currently listed.</p>}

                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
