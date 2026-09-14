"use client";

import dynamic from "next/dynamic";

type Hotel = {
  hotel_id: number;
  hotel_name: string;
  restaurant_name?: string | null;
  image_url?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

type HotelMapProps = {
  hotels: Hotel[];
};

const HotelMapClient = dynamic(
  () => import("./HotelMapClient"),
  {
    ssr: false,

    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-slate-100">
        <div className="text-sm text-slate-500">
          Loading map...
        </div>
      </div>
    ),
  }
);

export default function HotelMap({
  hotels,
}: HotelMapProps) {
  return (
    <div className="h-full w-full overflow-hidden rounded-[18px]">
      <HotelMapClient hotels={hotels} />
    </div>
  );
}