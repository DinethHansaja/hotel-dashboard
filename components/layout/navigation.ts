import {
  BarChart3,
  BadgePercent,
  CalendarDays,
  Coffee,
  Heart,
  Home,
  Hotel,
  Info,
  MessageSquare,
  Utensils,
  UtensilsCrossed,
} from "lucide-react";

export const menuItems = [
  { label: "Home", description: "", href: "/", icon: Home },
  { label: "Hotels", description: "Find hotel listings", href: "/hotels", icon: Hotel },
  { label: "Buffet Guide", description: "Hotel buffet dining", href: "/buffet", icon: UtensilsCrossed },
  { label: "Restaurants", description: "Restaurants around Colombo", href: "/restaurants", icon: Utensils },
  { label: "Cafés", description: "Cafés around Colombo", href: "/cafes", icon: Coffee },
  { label: "Events & weddings", description: "Hotel contacts", href: "/events", icon: CalendarDays },
  { label: "Guest reviews", description: "Dining and stay feedback", href: "/reviews", icon: MessageSquare },
  { label: "Compare hotels", description: "Compare listed details", href: "/compare", icon: BarChart3 },
  { label: "Saved hotels", description: "Your shortlist", href: "/favourites", icon: Heart },
  { label: "Offers", description: "Current promotions", href: "/offers", icon: BadgePercent },
  { label: "About", description: "About the guide", href: "/about", icon: Info },
] as const;
