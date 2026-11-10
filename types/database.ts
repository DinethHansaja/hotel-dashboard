export type Hotel = {
  hotel_id: number;
  hotel_name: string;
  restaurant_name?: string | null;
  location?: string | null;
  address?: string | null;
  website?: string | null;
  contact_number?: string | null;
  image_url?: string | null;
  description?: string | null;
  special_notes?: string | null;
  buffet_status?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  price?: number | null;
  rating?: number | null;
  Rating?: number | string | null;
  review_count?: number | null;
  google_review_url?: string | null;
  rate_verified_at?: string | null;
  cash_cow_dish?: string | null;
  cash_cow_description?: string | null;
};

export type BuffetSchedule = {
  schedule_id: number;
  hotel_id: number;
  day_group?: string | null;
  meal_type?: string | null;
  buffet_name?: string | null;
  price_lkr?: number | null;
  buffet_time?: string | null;
  breakfast_included?: boolean | null;
  special_note?: string | null;
  source_value?: string | null;
};

export type HotelFeature = {
  feature_id: number;
  hotel_id: number;
  schedule_id?: number | null;
  feature_name: string;
  feature_description?: string | null;
};

export type FavoriteDish = {
  favorite_id: number;
  hotel_id: number;
  dish_name: string;
  customer_name?: string | null;
  created_at: string;
};

export type Review = {
  review_id: number;
  hotel_id: number;
  review_type: "dining" | "stay";
  guest_name: string;
  rating: number;
  review_text: string;
  visit_date?: string | null;
  created_at: string;
};

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

