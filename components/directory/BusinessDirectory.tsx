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

export type DirectoryBusiness = {
  id: string;
  name: string;
  category: string | null;
  address: string | null;
  area: string | null;
  telephone: string | null;
  email: string | null;
  website: string | null;
  imageUrl: string | null;
  mapsUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  rating: number | null;
  reviewCount: number | null;
  priceRange: string | null;
  openingHours: string | null;
  specialties: string | null;
  sourceUrl: string | null;
  verificationStatus: string | null;
  lastChecked: string | null;
  notes: string | null;
};

type BusinessDirectoryProps = {
  businesses: DirectoryBusiness[];
  kind: "cafe" | "restaurant";
};

function getWebsiteUrl(value: string) {
  return /^https?:\/\//i.test(value) ? value : "https://" + value;
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

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-slate-100 py-2 last:border-0 sm:grid-cols-[150px_1fr] sm:gap-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="break-words text-sm text-slate-700">
        {value === null || value === "" ? "Not provided" : String(value)}
      </dd>
    </div>
  );
}

export default function BusinessDirectory({
  businesses,
  kind,
}: BusinessDirectoryProps) {
  const [search, setSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sort, setSort] = useState("popular");

  const title = kind === "cafe" ? "Cafe Guide" : "Restaurant Guide";
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

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-[1600px] p-5 md:p-8">
        <div className="mb-7">
          <div className="mb-3 text-sm text-slate-400">
            Home <span className="mx-2">›</span>
            <span className="text-slate-600">{title}</span>
          </div>

          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
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
          className="mb-7 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="flex h-[50px] items-center rounded-xl border border-slate-200 px-4 focus-within:border-[#c79a45] focus-within:ring-2 focus-within:ring-[#c79a45]/20">
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

        {filteredBusinesses.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
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
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="relative h-40 bg-gradient-to-br from-[#0c1725] to-[#24364a]">
                      {business.imageUrl ? (
                        <img
                          src={business.imageUrl}
                          alt={business.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Icon className="h-12 w-12 text-[#d2a64d]" />
                        </div>
                      )}

                      {business.area && (
                        <span className="absolute right-4 top-4 rounded-full bg-[#c79a45] px-3 py-1 text-xs font-semibold text-white">
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

                          <p className="mt-1 text-xs text-slate-400">
                            ID: {business.id}
                          </p>
                        </div>

                        {business.priceRange && (
                          <span className="shrink-0 rounded-lg bg-[#c79a45]/10 px-2.5 py-1 text-xs font-medium text-[#8b682b]">
                            {business.priceRange}
                          </span>
                        )}
                      </div>

                      {(business.rating !== null ||
                        business.reviewCount !== null) && (
                        <div className="mt-4 flex items-center gap-2 text-sm">
                          {business.rating !== null && (
                            <>
                              <Star className="h-4 w-4 fill-[#c79a45] text-[#c79a45]" />
                              <span className="font-semibold text-slate-800">
                                {business.rating.toFixed(1)}
                              </span>
                            </>
                          )}

                          {business.reviewCount !== null && (
                            <span className="text-slate-500">
                              {business.reviewCount.toLocaleString()} reviews
                            </span>
                          )}
                        </div>
                      )}

                      {business.address && (
                        <p className="mt-4 flex gap-2 text-sm leading-5 text-slate-600">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#c79a45]" />
                          <span>{business.address}</span>
                        </p>
                      )}

                      {business.specialties && (
                        <p className="mt-3 text-sm leading-5 text-slate-600">
                          <span className="font-medium text-slate-800">
                            {kind === "cafe"
                              ? "Specialties: "
                              : "Signature dishes: "}
                          </span>
                          {business.specialties}
                        </p>
                      )}

                      {business.openingHours && (
                        <p className="mt-3 flex gap-2 text-sm leading-5 text-slate-600">
                          <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#c79a45]" />
                          <span>{business.openingHours}</span>
                        </p>
                      )}

                      <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                        {business.telephone && (
                          <a
                            href={"tel:" + business.telephone}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:border-[#c79a45] hover:text-[#8b682b]"
                          >
                            <Phone className="h-3.5 w-3.5" />
                            Call
                          </a>
                        )}

                        {business.email && (
                          <a
                            href={"mailto:" + business.email}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:border-[#c79a45] hover:text-[#8b682b]"
                          >
                            Email
                          </a>
                        )}

                        {business.website && (
                          <a
                            href={getWebsiteUrl(business.website)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:border-[#c79a45] hover:text-[#8b682b]"
                          >
                            <Globe className="h-3.5 w-3.5" />
                            Website
                            <ArrowUpRight className="h-3 w-3" />
                          </a>
                        )}

                        {mapUrl && (
                          <a
                            href={mapUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:border-[#c79a45] hover:text-[#8b682b]"
                          >
                            <MapPin className="h-3.5 w-3.5" />
                            Map
                            <ArrowUpRight className="h-3 w-3" />
                          </a>
                        )}
                      </div>

                      <details className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4">
                        <summary className="cursor-pointer py-3 text-sm font-semibold text-slate-800">
                          Full record details
                        </summary>

                        <dl className="pb-3">
                          <DetailRow label="Business ID" value={business.id} />
                          <DetailRow
                            label={
                              kind === "cafe"
                                ? "Business type"
                                : "Cuisine or category"
                            }
                            value={business.category}
                          />
                          <DetailRow label="Address" value={business.address} />
                          <DetailRow label="Area" value={business.area} />
                          <DetailRow label="Telephone" value={business.telephone} />
                          <DetailRow label="Email" value={business.email} />
                          <DetailRow label="Website" value={business.website} />
                          <DetailRow label="Image URL" value={business.imageUrl} />
                          <DetailRow label="Google Maps URL" value={business.mapsUrl} />
                          <DetailRow label="Latitude" value={business.latitude} />
                          <DetailRow label="Longitude" value={business.longitude} />
                          <DetailRow label="Rating" value={business.rating} />
                          <DetailRow label="Review count" value={business.reviewCount} />
                          <DetailRow label="Price range" value={business.priceRange} />
                          <DetailRow label="Opening hours" value={business.openingHours} />
                          <DetailRow
                            label={
                              kind === "cafe" ? "Specialties" : "Signature dishes"
                            }
                            value={business.specialties}
                          />
                          <DetailRow label="Source URL" value={business.sourceUrl} />
                          <DetailRow
                            label="Verification status"
                            value={business.verificationStatus}
                          />
                          <DetailRow label="Last checked" value={business.lastChecked} />
                          <DetailRow label="Notes" value={business.notes} />
                        </dl>
                      </details>
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