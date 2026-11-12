export const SAVED_HOTELS_KEY = "colombo-guide:saved-hotels";

export function readSavedHotels(): number[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(SAVED_HOTELS_KEY) ?? "[]");
    return Array.isArray(value) ? value.map(Number).filter(Number.isFinite) : [];
  } catch {
    return [];
  }
}

export function toggleSavedHotel(id: number): number[] {
  const current = readSavedHotels();
  const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
  localStorage.setItem(SAVED_HOTELS_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("saved-hotels-change"));
  return next;
}
