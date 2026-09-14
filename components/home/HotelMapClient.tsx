"use client";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";

import L from "leaflet";
import Link from "next/link";

import "leaflet/dist/leaflet.css";

type Hotel = {
  hotel_id: number;
  hotel_name: string;
  restaurant_name?: string | null;
  image_url?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

type HotelMapClientProps = {
  hotels: Hotel[];
};

const hotelIcon = L.icon({
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

export default function HotelMapClient({
  hotels,
}: HotelMapClientProps) {
  const validHotels = hotels.filter(
    (hotel) =>
      hotel.latitude !== null &&
      hotel.latitude !== undefined &&
      hotel.longitude !== null &&
      hotel.longitude !== undefined
  );

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

      {validHotels.map((hotel) => (
        <Marker
          key={hotel.hotel_id}
          position={[
            Number(hotel.latitude),
            Number(hotel.longitude),
          ]}
          icon={hotelIcon}
        >
          <Popup>
            <div className="w-[280px] overflow-hidden rounded-xl">

              {/* Hotel Image */}
              <div className="h-36 w-full overflow-hidden bg-slate-100">
                {hotel.image_url ? (
                  <img
                    src={hotel.image_url}
                    alt={hotel.hotel_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    No image available
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">

                <div className="mb-2 inline-flex rounded-full bg-[#c79a45] px-3 py-1 text-xs font-semibold text-white">
                  Hotel
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  {hotel.hotel_name}
                </h3>

                {hotel.restaurant_name && (
                  <p className="mt-1 text-sm text-slate-500">
                    {hotel.restaurant_name}
                  </p>
                )}

                <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                  <span>📍</span>
                  <span>Colombo, Sri Lanka</span>
                </div>

                <Link
                  href={`/hotels/${hotel.hotel_id}`}
                  className="mt-4 block w-full rounded-lg bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  View Hotel →
                </Link>

              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}