"use client";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";

import L from "leaflet";
import Link from "next/link";
import { useRef } from "react";

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

/*
 * Leaflet marker icon
 */
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
  /*
   * Stores the current close timer.
   */
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  /*
   * Stores the marker whose popup is currently active.
   */
  const activeMarker = useRef<L.Marker | null>(null);

  /*
   * Cancel any scheduled popup close.
   */
  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  /*
   * Schedule popup closing.
   *
   * We wait 300ms so the user can move
   * from the marker into the popup.
   */
  const scheduleClose = () => {
    cancelClose();

    closeTimer.current = setTimeout(() => {
      if (activeMarker.current) {
        activeMarker.current.closePopup();
      }

      activeMarker.current = null;
      closeTimer.current = null;
    }, 300);
  };

  /*
   * Only show hotels with valid map coordinates.
   */
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
          eventHandlers={{
            /*
             * ==============================
             * MOUSE ENTERS MARKER
             * ==============================
             */
            mouseover: (event) => {
              cancelClose();

              activeMarker.current = event.target;

              event.target.openPopup();
            },

            /*
             * ==============================
             * MOUSE LEAVES MARKER
             * ==============================
             */
            mouseout: () => {
              scheduleClose();
            },
          }}
        >
          <Popup
            closeButton={true}
            eventHandlers={{
              /*
               * ==============================
               * MOUSE ENTERS POPUP
               * ==============================
               *
               * Cancel the closing timer.
               */
              mouseover: () => {
                cancelClose();
              },

              /*
               * ==============================
               * MOUSE LEAVES POPUP
               * ==============================
               *
               * Schedule popup closing.
               */
              mouseout: () => {
                scheduleClose();
              },
            }}
          >
            <div className="w-[280px] overflow-hidden rounded-xl">

              {/* ==============================
                  HOTEL IMAGE
              =============================== */}

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

              {/* ==============================
                  HOTEL CONTENT
              =============================== */}

              <div className="p-4">

                {/* Hotel Badge */}

                <div className="mb-2 inline-flex rounded-full bg-[#c79a45] px-3 py-1 text-xs font-semibold text-white">
                  Hotel
                </div>

                {/* Hotel Name */}

                <h3 className="text-lg font-bold text-slate-900">
                  {hotel.hotel_name}
                </h3>

                {/* Restaurant */}

                {hotel.restaurant_name && (
                  <p className="mt-1 text-sm text-slate-500">
                    {hotel.restaurant_name}
                  </p>
                )}

                {/* Location */}

                <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                  <span>📍</span>

                  <span>
                    Colombo, Sri Lanka
                  </span>
                </div>

                {/* View Hotel */}

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