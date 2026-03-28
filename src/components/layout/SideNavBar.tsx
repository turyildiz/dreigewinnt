"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const towns = [
  { label: "Raunheim", value: "raunheim", icon: "location_city" },
  { label: "Kelsterbach", value: "kelsterbach", icon: "apartment" },
  { label: "Rüsselsheim", value: "ruesselsheim", icon: "corporate_fare" },
];

const categories = [
  { label: "Gastronomie", value: "gastronomie", icon: "restaurant" },
  { label: "Handwerk", value: "handwerk", icon: "build" },
  { label: "Kultur", value: "kultur", icon: "theater_comedy" },
];

function getSection(pathname: string) {
  if (pathname.startsWith("/gewerbe")) return "/gewerbe";
  if (pathname.startsWith("/events")) return "/events";
  if (pathname.startsWith("/news")) return "/news";
  return "/gewerbe";
}

export function SideNavBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const section = getSection(pathname);
  const activeTown = searchParams.get("town");
  const activeCategory = searchParams.get("category");

  return (
    <aside className="fixed hidden lg:flex h-[calc(100vh-80px)] w-72 bg-surface-container-lowest border-r border-outline-variant/15 flex-col py-10 z-40 overflow-y-auto mt-20 left-[max(0px,calc((100vw-1440px)/2))]">
      <div className="px-8 mb-4">
        <h3 className="font-headline uppercase tracking-[0.05em] text-[12px] font-bold text-primary">LOKALER FILTER</h3>
        <p className="text-[10px] text-on-surface-variant font-medium tracking-widest opacity-70">DREIGEWINNT REGION</p>
      </div>

      <nav className="flex flex-col gap-y-1">

        {/* All towns — only show when a filter is active */}
        {activeTown && (
          <Link
            href={section}
            className="flex items-center gap-4 py-3 px-8 text-secondary font-bold hover:bg-surface-container-low transition-all font-headline uppercase tracking-[0.05em] text-[12px]"
          >
            <span className="material-symbols-outlined text-xl">language</span>
            <span>Alle Städte</span>
          </Link>
        )}

        {towns.map((town) => {
          const isActive = activeTown === town.value;
          return (
            <Link
              key={town.value}
              href={`${section}?town=${town.value}`}
              className={`flex items-center gap-4 py-3 px-8 transition-all font-headline uppercase tracking-[0.05em] text-[12px] font-bold ${
                isActive
                  ? "text-secondary border-l-4 border-secondary bg-surface-container-low/30"
                  : "text-on-surface-variant opacity-70 hover:opacity-100 hover:bg-surface-container-low"
              }`}
            >
              <span className="material-symbols-outlined text-xl">{town.icon}</span>
              <span>{town.label}</span>
            </Link>
          );
        })}

        <div className="h-[1px] bg-outline-variant/10 my-4 mx-8" />

        {categories.map((cat) => {
          const isCatActive = activeCategory === cat.value;
          const href = activeTown
            ? `${section}?town=${activeTown}&category=${cat.value}`
            : `${section}?category=${cat.value}`;
          return (
            <Link
              key={cat.value}
              href={href}
              className={`flex items-center gap-4 py-3 px-8 transition-all font-headline uppercase tracking-[0.05em] text-[12px] font-bold ${
                isCatActive
                  ? "text-secondary border-l-4 border-secondary bg-surface-container-low/30"
                  : "text-on-surface-variant opacity-70 hover:opacity-100 hover:bg-surface-container-low"
              }`}
            >
              <span className="material-symbols-outlined text-xl">{cat.icon}</span>
              <span>{cat.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-8 pt-6">
        <div className="editorial-gradient p-6 rounded shadow-lg text-on-secondary">
          <p className="text-[10px] font-bold tracking-widest uppercase mb-2">Partner Programm</p>
          <h4 className="font-headline font-bold text-lg leading-tight mb-4">Premium Partner werden</h4>
          <Link href="/gewerbe/einreichen" className="block w-full bg-white text-secondary py-2 text-[12px] font-bold uppercase tracking-wider rounded-sm hover:bg-surface transition-colors text-center">
            Jetzt Anfragen
          </Link>
        </div>
      </div>
    </aside>
  );
}
