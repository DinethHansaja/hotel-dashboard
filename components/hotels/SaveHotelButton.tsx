"use client";

import { Heart } from "lucide-react";
import { useSavedHotels } from "@/lib/useSavedHotels";

export default function SaveHotelButton({ hotelId, hotelName }: { hotelId: number; hotelName: string }) {
  const { savedHotelIds, toggleHotel } = useSavedHotels();
  const saved = savedHotelIds.includes(hotelId);
  return <button type="button" aria-label={saved ? `Remove ${hotelName} from favourites` : `Save ${hotelName} to favourites`} aria-pressed={saved} onClick={() => toggleHotel(hotelId)} className="ui-button ui-button-secondary inline-flex h-11 w-12 shrink-0 items-center justify-center" title={saved ? "Remove from favourites" : "Save to favourites"}><Heart className={`h-5 w-5 ${saved ? "fill-rose-700 text-rose-700" : ""}`} /></button>;
}
