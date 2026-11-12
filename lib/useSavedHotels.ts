"use client";

import { useEffect, useState } from "react";
import { readSavedHotels, toggleSavedHotel } from "./savedHotels";

export function useSavedHotels() {
  const [savedHotelIds, setSavedHotelIds] = useState<number[]>([]);

  useEffect(() => {
    const refresh = () => setSavedHotelIds(readSavedHotels());
    refresh();
    window.addEventListener("saved-hotels-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("saved-hotels-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return {
    savedHotelIds,
    toggleHotel: (id: number) => setSavedHotelIds(toggleSavedHotel(id)),
  };
}
