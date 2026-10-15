"use client";

import { useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import type { DirectoryBusiness } from "@/components/directory/BusinessDirectory";
import "leaflet/dist/leaflet.css";

const businessIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function websiteUrl(value: string) {
  return /^https?:\/\//i.test(value) ? value : "https://" + value;
}

export default function BusinessMapClient({
  businesses,
  kind,
}: {
  businesses: DirectoryBusiness[];
  kind: "cafe" | "restaurant";
}) {
  const locatedBusinesses = useMemo(
    () =>
      businesses.filter(
        (business) =>
          business.latitude !== null &&
          business.longitude !== null &&
          Number.isFinite(Number(business.latitude)) &&
          Number.isFinite(Number(business.longitude)) &&
          Number(business.latitude) >= -90 &&
          Number(business.latitude) <= 90 &&
          Number(business.longitude) >= -180 &&
          Number(business.longitude) <= 180
      ),
    [businesses]
  );

  if (locatedBusinesses.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-100 p-6 text-center">
        <div>
          <p className="font-semibold text-slate-800">No mapped locations</p>
          <p className="mt-1 text-sm text-slate-500">
            There are no {kind === "cafe" ? "cafés" : "restaurants"} with valid
            coordinates in the current results.
          </p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={[6.9271, 79.8612]}
      zoom={12}
      scrollWheelZoom={true}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {locatedBusinesses.map((business) => {
        const mapsUrl =
          business.mapsUrl ||
          "https://www.google.com/maps/search/?api=1&query=" +
            encodeURIComponent(
              Number(business.latitude) + "," + Number(business.longitude)
            );

        return (
          <Marker
            key={business.id}
            position={[Number(business.latitude), Number(business.longitude)]}
            icon={businessIcon}
          >
            <Popup closeButton={true} maxWidth={330}>
              <div className="w-[280px] overflow-hidden rounded-xl">
                {business.imageUrl && (
                  <div className="h-36 w-full overflow-hidden bg-slate-100">
                    <img
                      src={business.imageUrl}
                      alt={business.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="p-3">
                  <span className="mb-2 inline-flex rounded-full bg-[#c79a45] px-3 py-1 text-xs font-semibold text-white">
                    {business.category ||
                      (kind === "cafe" ? "Cafe" : "Restaurant")}
                  </span>

                  <h3 className="text-base font-bold text-slate-900">
                    {business.name}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    ID: {business.id}
                  </p>

                  {business.rating !== null && (
                    <p className="mt-2 text-sm text-slate-700">
                      ★ {business.rating.toFixed(1)}
                      {business.reviewCount !== null
                        ? " · " +
                          business.reviewCount.toLocaleString() +
                          " reviews"
                        : ""}
                    </p>
                  )}

                  {business.address && (
                    <p className="mt-2 text-sm text-slate-600">
                      {business.address}
                      {business.area ? " · " + business.area : ""}
                    </p>
                  )}

                  {business.priceRange && (
                    <p className="mt-2 text-sm text-slate-600">
                      <strong>Price:</strong> {business.priceRange}
                    </p>
                  )}

                  {business.openingHours && (
                    <p className="mt-2 text-sm text-slate-600">
                      <strong>Hours:</strong> {business.openingHours}
                    </p>
                  )}

                  {business.specialties && (
                    <p className="mt-2 text-sm text-slate-600">
                      <strong>
                        {kind === "cafe" ? "Specialties" : "Signature dishes"}:
                      </strong>{" "}
                      {business.specialties}
                    </p>
                  )}

                  {business.telephone && (
                    <p className="mt-2 text-sm text-slate-600">
                      <strong>Phone:</strong> {business.telephone}
                    </p>
                  )}

                  {business.email && (
                    <p className="mt-1 break-all text-sm text-slate-600">
                      <strong>Email:</strong> {business.email}
                    </p>
                  )}

                  {business.verificationStatus && (
                    <p className="mt-2 text-xs text-slate-500">
                      <strong>Verification:</strong>{" "}
                      {business.verificationStatus}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm font-semibold">
                    {business.website && (
                      <a
                        href={websiteUrl(business.website)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Website
                      </a>
                    )}

                    <a href={mapsUrl} target="_blank" rel="noreferrer">
                      Open map
                    </a>

                    {business.sourceUrl && (
                      <a
                        href={business.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Source
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}