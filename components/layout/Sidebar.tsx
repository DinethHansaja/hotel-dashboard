"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  Home,
  UtensilsCrossed,
  CalendarDays,
  MessageSquare,
  Award,
  BarChart3,
  Tag,
  Heart,
  Info,
  Settings,
  Landmark,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const menuItems = [
  {
    label: "Welcome",
    description: "",
    href: "/",
    icon: Home,
  },
  {
    label: "Buffet Guide",
    description: "Hotel & Restaurant Buffets",
    href: "/buffet",
    icon: UtensilsCrossed,
  },
  {
    label: "Events & Weddings",
    description: "Prices & Packages",
    href: "/events",
    icon: CalendarDays,
  },
  {
    label: "Reviews",
    description: "Dine & Stay Reviews",
    href: "/reviews",
    icon: MessageSquare,
  },
  {
    label: "Best Products",
    description: "Top Picks & Recommendations",
    href: "/products",
    icon: Award,
  },
  {
    label: "Compare",
    description: "Compare Options",
    href: "/compare",
    icon: BarChart3,
  },
  {
    label: "Offers & Promotions",
    description: "Latest Deals",
    href: "/offers",
    icon: Tag,
  },
  {
    label: "Favourites",
    description: "Saved Places",
    href: "/favourites",
    icon: Heart,
  },
  {
    label: "About Us",
    description: "About this Platform",
    href: "/about",
    icon: Info,
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`relative hidden h-screen shrink-0 overflow-hidden bg-[#0c1725] text-white transition-all duration-300 lg:flex lg:flex-col ${
        collapsed ? "w-[82px]" : "w-[272px]"
      }`}
    >
      {/* Logo */}
      <div
        className={`flex shrink-0 items-center py-7 ${
          collapsed ? "justify-center px-3" : "px-6"
        }`}
      >
        {!collapsed ? (
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c79a45]">
              <Landmark className="h-6 w-6 text-[#d2a64d]" />
            </div>

            <div>
              <h1 className="font-serif text-[24px] leading-tight">
                Colombo
              </h1>

              <p className="text-sm tracking-wide text-[#d2a64d]">
                Dining & Events Guide
              </p>
            </div>
          </Link>
        ) : (
          <Link href="/">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c79a45]">
              <Landmark className="h-6 w-6 text-[#d2a64d]" />
            </div>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-3">
        <div className="space-y-1 pb-3">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.label}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`group flex items-center rounded-xl transition ${
                  collapsed
                    ? "justify-center px-3 py-3.5"
                    : "gap-4 px-4 py-3"
                } ${
                  isActive
                    ? "bg-[#8b682b] text-white"
                    : "text-slate-200 hover:bg-white/10"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />

                {!collapsed && (
                  <div className="min-w-0">
                    <div className="text-[15px] font-medium">
                      {item.label}
                    </div>

                    {item.description && (
                      <div className="mt-0.5 text-xs text-slate-400">
                        {item.description}
                      </div>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Settings */}
      <div className="shrink-0 border-t border-white/10 p-3">
        <Link
          href="/settings"
          title={collapsed ? "Settings" : undefined}
          className={`flex items-center rounded-xl text-slate-200 transition hover:bg-white/10 ${
            collapsed
              ? "justify-center px-3 py-3.5"
              : "gap-4 px-4 py-3"
          }`}
        >
          <Settings className="h-5 w-5 shrink-0" />

          {!collapsed && (
            <div>
              <div className="text-[15px] font-medium">
                Settings
              </div>

              <div className="text-xs text-slate-400">
                Preferences
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* Collapse */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute bottom-5 right-[-14px] z-50 flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-[#0c1725] text-slate-200 shadow-md transition hover:bg-[#1a293b] hover:text-white"
      >
        {collapsed ? (
          <PanelLeftOpen className="h-4 w-4" />
        ) : (
          <PanelLeftClose className="h-4 w-4" />
        )}
      </button>
    </aside>
  );
}