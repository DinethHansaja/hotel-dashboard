"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Landmark, Settings } from "lucide-react";
import { menuItems } from "@/components/layout/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  // Whether the mouse is currently over the sidebar
  const [isHovered, setIsHovered] = useState(false);

  // Whether the user manually collapsed the sidebar
  const [manuallyCollapsed, setManuallyCollapsed] =
    useState(false);

  /*
   * If the user clicks Collapse, we want the sidebar
   * to collapse immediately even though the mouse is
   * still technically inside the sidebar.
   */
  const [ignoreHover, setIgnoreHover] =
    useState(false);

  /*
   * Sidebar is expanded when:
   *
   * 1. Mouse is hovering AND hover isn't ignored
   * OR
   * 2. User hasn't manually collapsed it
   *
   * This gives us the desired hover behavior.
   */
  const expanded =
    !manuallyCollapsed &&
    (isHovered || !ignoreHover);

  const handleMouseEnter = () => {
    setIsHovered(true);

    /*
     * Once the mouse leaves and comes back,
     * hover is allowed to expand the sidebar again.
     */
    setIgnoreHover(false);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);

    /*
     * Once the mouse leaves, remove the temporary
     * manual-collapse lock.
     */
    setIgnoreHover(false);
  };

  const handleCollapse = () => {
    /*
     * Collapse immediately.
     */
    setManuallyCollapsed(true);

    /*
     * Ignore the current hover state so the sidebar
     * doesn't immediately open again.
     */
    setIgnoreHover(true);
  };

  const handleExpand = () => {
    setManuallyCollapsed(false);
    setIgnoreHover(false);
  };

  const handleToggle = () => {
    if (expanded) {
      handleCollapse();
    } else {
      handleExpand();
    }
  };

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative hidden h-screen shrink-0 overflow-visible bg-[#14243a] text-white transition-[width] duration-150 ease-out lg:flex lg:flex-col ${
        expanded ? "w-[272px]" : "w-[82px]"
      }`}
    >
      {/* LOGO */}
      <div
        className={`flex shrink-0 items-center py-7 transition-[padding] duration-150 ease-out ${
          expanded
            ? "justify-start px-6"
            : "justify-center px-3"
        }`}
      >
        <Link
          href="/"
          className={`flex items-center ${
            expanded ? "gap-3" : "justify-center"
          }`}
        >
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#c5a46d] transition hover:bg-white/10"
            aria-label="Colombo Dining & Events Guide"
          >
            <Landmark className="h-6 w-6 text-[#c5a46d]" />
          </div>

          {expanded && (
            <div className="min-w-0 whitespace-nowrap">
              <h1 className="font-serif text-[24px] leading-tight">
                Colombo
              </h1>

              <p className="text-sm tracking-wide text-[#c5a46d]">
                Dining & Events Guide
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* NAVIGATION */}
      <nav aria-label="Main navigation" className="min-h-0 flex-1 overflow-y-auto px-3">
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
                title={!expanded ? item.label : undefined}
                aria-current={isActive ? "page" : undefined}
                className={`group flex items-center rounded-xl transition-colors duration-150 ${
                  expanded
                    ? "gap-4 px-4 py-3"
                    : "justify-center px-3 py-3.5"
                } ${
                  isActive
                    ? "bg-[#806744] text-white shadow-sm"
                    : "text-slate-200 hover:bg-white/10"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />

                {expanded && (
                  <div className="min-w-0 whitespace-nowrap">
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

      {/* BOTTOM CONTROLS */}
      <div className="shrink-0 border-t border-white/10 p-3">
        <Link
          href="/settings"
          title={!expanded ? "Settings" : undefined}
          aria-current={pathname === "/settings" ? "page" : undefined}
          className={`mb-2 flex items-center rounded-xl transition ${pathname === "/settings" ? "bg-[#806744] text-white" : "text-slate-200 hover:bg-white/10"} ${
            expanded
              ? "gap-4 px-4 py-3"
              : "justify-center px-3 py-3.5"
          }`}
        >
          <Settings className="h-5 w-5 shrink-0" />

          {expanded && (
            <div className="whitespace-nowrap">
              <div className="text-[15px] font-medium">
                Settings
              </div>

              <div className="text-xs text-slate-400">
                Preferences
              </div>
            </div>
          )}
        </Link>

        <button
          type="button"
          onClick={handleToggle}
          className={`flex w-full items-center rounded-xl text-slate-300 transition hover:bg-white/10 hover:text-white ${
            expanded
              ? "gap-4 px-4 py-3"
              : "justify-center px-3 py-3.5"
          }`}
          aria-label={
            expanded ? "Collapse sidebar" : "Expand sidebar"
          }
          title={
            expanded ? "Collapse sidebar" : "Expand sidebar"
          }
        >
          {expanded ? (
            <>
              <ChevronLeft className="h-5 w-5 shrink-0" />

              <span className="whitespace-nowrap text-sm font-medium">
                Collapse menu
              </span>
            </>
          ) : (
            <ChevronRight className="h-5 w-5 shrink-0" />
          )}
        </button>
      </div>
    </aside>
  );
}
