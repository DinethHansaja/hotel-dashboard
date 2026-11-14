"use client";

import { MapPin, Menu, Moon, Search, Settings, Sun, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { menuItems } from "@/components/layout/navigation";
import { useThemePreferences } from "@/components/layout/ThemeProvider";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useThemePreferences();
  const currentQuery = searchParams.get("q") ?? "";
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const syncResolvedTheme = () => {
      setResolvedTheme(
        theme === "system"
          ? mediaQuery.matches ? "dark" : "light"
          : theme
      );
    };

    syncResolvedTheme();
    if (theme !== "system") return;

    mediaQuery.addEventListener("change", syncResolvedTheme);
    return () => mediaQuery.removeEventListener("change", syncResolvedTheme);
  }, [theme]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileNavOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = String(form.get("q") ?? "").trim();
    router.push(value ? `/search?q=${encodeURIComponent(value)}` : "/search");
  }

  return (
    <header className="relative z-40 shrink-0 border-b border-slate-200 bg-white">
      <div className="flex h-[76px] items-center gap-2 px-3 sm:gap-3 sm:px-4 md:gap-4 md:px-8">
        <button
          type="button"
          onClick={() => setMobileNavOpen((open) => !open)}
          aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileNavOpen}
          aria-controls="mobile-site-navigation"
          className="ui-button ui-button-secondary flex h-11 w-11 shrink-0 items-center justify-center lg:hidden"
        >
          {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link href="/" className="shrink-0 font-semibold text-[#0c1725] lg:hidden" aria-label="Colombo Dining and Events Guide home">
          Colombo
        </Link>

        <div className="hidden shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 md:flex">
          <MapPin className="h-4 w-4 text-[#8b682b]" aria-hidden="true" />
          <span>Colombo, Sri Lanka</span>
        </div>

        <form onSubmit={handleSearch} role="search" className="relative ml-auto min-w-0 flex-1 lg:ml-0 xl:max-w-3xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            key={currentQuery}
            type="search"
            name="q"
            defaultValue={currentQuery}
            placeholder="Search hotels, buffets, restaurants or cafés"
            aria-label="Search hotels, buffets, restaurants and cafés"
            className="control h-12 w-full bg-slate-50 pl-12 pr-12 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#c79a45] focus:bg-white focus:ring-2 focus:ring-[#c79a45]/20"
          />
          <button type="submit" aria-label="Search" className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-[#8b682b]">
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>
        </form>

        <Link
          href="/settings"
          aria-label="Settings"
          title="Settings"
          className="ui-button ui-button-secondary hidden h-10 w-10 shrink-0 items-center justify-center lg:inline-flex"
        >
          <Settings className="h-4 w-4" aria-hidden="true" />
        </Link>

        <button
          type="button"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
          title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
          className="ui-button ui-button-secondary ml-auto inline-flex h-10 shrink-0 items-center justify-center gap-1.5 px-2.5 text-xs font-semibold sm:px-3 lg:ml-0"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Moon className="h-4 w-4" aria-hidden="true" />
          )}
          <span>{resolvedTheme === "dark" ? "Light" : "Dark"}</span>
        </button>
      </div>

      {mobileNavOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
          className="fixed inset-x-0 bottom-0 top-[76px] z-10 bg-[#0b1420]/20 lg:hidden"
        />
      )}

      <nav
        id="mobile-site-navigation"
        aria-label="Main navigation"
        hidden={!mobileNavOpen}
        className="absolute left-0 right-0 top-full z-50 max-h-[calc(100vh-76px)] overflow-y-auto border-t border-slate-200 bg-white px-4 py-4 shadow-xl lg:hidden"
      >
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-12 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-[#0c1725] text-white" : "text-slate-700 hover:bg-slate-100"}`}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <Link
              href="/settings"
              onClick={() => setMobileNavOpen(false)}
              aria-current={pathname === "/settings" ? "page" : undefined}
              className={`flex min-h-12 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium ${pathname === "/settings" ? "bg-[#0c1725] text-white" : "text-slate-700 hover:bg-slate-100"}`}
            >
              <Settings className="h-4 w-4 shrink-0" aria-hidden="true" /> Settings
            </Link>
          </div>
      </nav>
    </header>
  );
}
