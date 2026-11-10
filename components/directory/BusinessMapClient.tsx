"use client";

import { useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, Tooltip } from "react-leaflet";
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

const selectedBusinessIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [32, 49],
  iconAnchor: [16, 49],
  popupAnchor: [1, -42],
  shadowSize: [49, 49],
});

export default function BusinessMapClient({
  businesses,
  kind,
  selectedBusinessId,
  onSelectBusiness,
}: {
  businesses: DirectoryBusiness[];
  kind: "cafe" | "restaurant";
  selectedBusinessId?: string | null;
  onSelectBusiness?: (id: string) => void;
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
            icon={business.id === selectedBusinessId ? selectedBusinessIcon : businessIcon}
            eventHandlers={{ click: () => onSelectBusiness?.(business.id) }}
          >
            <Tooltip
              direction="top"
              offset={[0, -28]}
              sticky
              className="!border-0 !bg-transparent !p-0 !shadow-none"
            >
              <div className="w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                {business.imageUrl && (
                  <img
                    src={business.imageUrl}
                    alt=""
                    className="h-28 w-full object-cover"
                  />
                )}
                <div className="p-3">
                  <span className="inline-flex rounded-full bg-[#c79a45]/15 px-2.5 py-1 text-[11px] font-semibold text-[#805d26]">
                    {business.category || (kind === "cafe" ? "Cafe" : "Restaurant")}
                  </span>
                  <span className="mt-2 block font-semibold text-slate-900">{business.name}</span>
                  <span className="mt-1 block text-xs text-slate-500">
                    {business.area || business.address || "Colombo"}
                  </span>
                  {business.rating !== null && (
                    <span className="mt-2 block text-xs font-medium text-slate-700">
                      <span className="text-amber-500">★</span> {business.rating.toFixed(1)}
                      {business.reviewCount !== null && ` · ${business.reviewCount.toLocaleString()} reviews`}
                    </span>
                  )}
                </div>
              </div>
            </Tooltip>
            <Popup closeButton={true} maxWidth={280} minWidth={240}>
              <div className="w-[240px] overflow-hidden rounded-xl">
                {business.imageUrl && (
                  <div className="h-28 w-full overflow-hidden rounded-lg bg-slate-100">
                    <img
                      src={business.imageUrl}
                      alt={business.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="pt-3">
                  <span className="inline-flex rounded-full bg-[#c79a45]/15 px-2.5 py-1 text-[11px] font-semibold text-[#805d26]">
                    {business.category || (kind === "cafe" ? "Cafe" : "Restaurant")}
                  </span>
                  <h3 className="mt-2 text-base font-bold leading-5 text-slate-900">{business.name}</h3>
                  {business.rating !== null && (
                    <p className="mt-2 text-sm font-medium text-slate-700">
                      <span className="text-amber-500">★</span> {business.rating.toFixed(1)}
                      {business.reviewCount !== null && <span className="font-normal text-slate-500"> · {business.reviewCount.toLocaleString()} reviews</span>}
                    </p>
                  )}
                  {(business.address || business.area) && (
                    <p className="mt-2 text-xs leading-5 text-slate-600">
                      {business.address || business.area}
                      {business.address && business.area ? ` · ${business.area}` : ""}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => onSelectBusiness?.(business.id)}
                      className="rounded-lg bg-[#c79a45] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#a97f36]"
                    >
                      View details
                    </button>
                    <a href={mapsUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-slate-600 hover:text-[#805d26]">
                      Get directions
                    </a>
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
