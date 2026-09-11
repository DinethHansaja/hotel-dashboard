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
      <div className="flex h-full items-center justify-center bg-slate-100">
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
    <div className="h-[500px] w-full overflow-hidden rounded-xl">
      <HotelMapClient hotels={hotels} />
    </div>
  );
}