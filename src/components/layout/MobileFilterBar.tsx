"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const towns = [
  { label: "Raunheim", value: "raunheim" },
  { label: "Kelsterbach", value: "kelsterbach" },
  { label: "Rüsselsheim", value: "ruesselsheim" },
];

const categories = [
  { label: "Gastronomie", value: "gastronomie" },
  { label: "Handwerk", value: "handwerk" },
  { label: "Kultur", value: "kultur" },
];

const townActiveClass = {
  raunheim: "bg-primary-fixed text-on-primary-fixed",
  kelsterbach: "bg-secondary-container text-on-secondary-container",
  ruesselsheim: "bg-tertiary-fixed text-on-tertiary-container",
} as Record<string, string>;

function getSection(pathname: string) {
  if (pathname.startsWith("/gewerbe")) return "/gewerbe";
  if (pathname.startsWith("/events")) return "/events";
  if (pathname.startsWith("/news")) return "/news";
  return "/gewerbe";
}

export function MobileFilterBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const section = getSection(pathname);
  const activeTown = searchParams.get("town");
  const activeCategory = searchParams.get("category");

  return (
    <div className="lg:hidden sticky top-20 z-30 bg-surface/90 backdrop-blur-[12px] border-b border-outline-variant/10">
      {/* Town row */}
      <div className="flex items-center gap-2 px-4 py-2.5 overflow-x-auto scrollbar-none">
        {activeTown && (
          <Link
            href={section}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-outline-variant/30 text-on-surface-variant"
          >
            Alle
          </Link>
        )}
        {towns.map((town) => {
          const isActive = activeTown === town.value;
          const href = activeCategory
            ? `${section}?town=${town.value}&category=${activeCategory}`
            : `${section}?town=${town.value}`;
          return (
            <Link
              key={town.value}
              href={href}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors ${
                isActive
                  ? townActiveClass[town.value]
                  : "bg-surface-container-low text-on-surface-variant"
              }`}
            >
              {town.label}
            </Link>
          );
        })}
        <span className="flex-shrink-0 w-[1px] h-4 bg-outline-variant/30 mx-1" />
        {categories.map((cat) => {
          const isActive = activeCategory === cat.value;
          const href = activeTown
            ? `${section}?town=${activeTown}&category=${cat.value}`
            : `${section}?category=${cat.value}`;
          return (
            <Link
              key={cat.value}
              href={href}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                isActive
                  ? "bg-secondary text-on-secondary"
                  : "bg-surface-container-low text-on-surface-variant"
              }`}
            >
              {cat.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
