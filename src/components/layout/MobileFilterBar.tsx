"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

const towns = [
  { label: "Raunheim", value: "raunheim" },
  { label: "Kelsterbach", value: "kelsterbach" },
  { label: "Rüsselsheim", value: "ruesselsheim" },
];

const categories = [
  { label: "Gastronomie", value: "gastronomie" },
  { label: "Handwerk", value: "handwerk" },
  { label: "Kultur", value: "kultur" },
  { label: "Einzelhandel", value: "einzelhandel" },
  { label: "Sport & Freizeit", value: "sport" },
  { label: "Gesundheit", value: "gesundheit" },
  { label: "Dienstleistungen", value: "dienstleistungen" },
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const section = getSection(pathname);
  const activeTown = searchParams.get("town");
  const activeCategory = searchParams.get("category");

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    if (!val) {
      router.push(activeTown ? `${section}?town=${activeTown}` : section);
    } else {
      router.push(activeTown ? `${section}?town=${activeTown}&category=${val}` : `${section}?category=${val}`);
    }
  }

  return (
    <div className="lg:hidden sticky top-20 z-30 bg-surface/90 backdrop-blur-[12px] border-b border-outline-variant/10">

      {/* Town pills row */}
      <div className="flex items-center gap-2 px-4 pt-2.5 pb-2 overflow-x-auto scrollbar-none">
        {activeTown && (
          <Link
            href={activeCategory ? `${section}?category=${activeCategory}` : section}
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
      </div>

      {/* Category select row */}
      <div className="px-4 pb-2.5">
        <div className="relative">
          <select
            value={activeCategory ?? ""}
            onChange={handleCategoryChange}
            className="w-full bg-surface-container-low text-on-surface-variant text-[11px] font-bold uppercase tracking-wider px-3 py-2 appearance-none outline-none focus:ring-1 focus:ring-secondary/30 pr-8"
          >
            <option value="">Alle Kategorien</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-base pointer-events-none">
            expand_more
          </span>
        </div>
      </div>

    </div>
  );
}
