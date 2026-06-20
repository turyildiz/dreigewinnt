"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { GewerbeSearch } from "@/components/ui/GewerbeSearch";
import { supabase } from "@/lib/supabase";
import { BUSINESS_CATEGORIES, SPORT_CATEGORIES } from "@/lib/constants";

const towns = [
  { label: "Raunheim", value: "raunheim" },
  { label: "Kelsterbach", value: "kelsterbach" },
  { label: "Rüsselsheim", value: "ruesselsheim" },
];

const categories = BUSINESS_CATEGORIES;

const townActiveClass = {
  raunheim: "bg-primary-fixed text-on-primary-fixed",
  kelsterbach: "bg-secondary-container text-on-secondary-container",
  ruesselsheim: "bg-tertiary-fixed text-on-tertiary-container",
} as Record<string, string>;

function getSection(pathname: string) {
  if (pathname.startsWith("/aktuelles")) return "/aktuelles";
  if (pathname.startsWith("/events")) return "/events";
  if (pathname.startsWith("/gewerbe")) return "/gewerbe";
  if (pathname.startsWith("/sport")) return "/sport";
  if (pathname.startsWith("/news")) return "/news";
  return "/gewerbe";
}

function isDetailPage(pathname: string) {
  return (
    /^\/gewerbe\/[^/]+/.test(pathname) ||
    /^\/events\/[^/]+/.test(pathname) ||
    /^\/sport\/[^/]+/.test(pathname) ||
    /^\/news\/[^/]+/.test(pathname) ||
    pathname.startsWith("/suche")
  );
}

export function MobileFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const section = getSection(pathname);
  const activeTown = searchParams.get("town");
  const filterParamName = section === "/sport" ? "sport" : "category";
  const activeCategory = searchParams.get(filterParamName);

  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Fetch category counts via parallel count queries
  useEffect(() => {
    if (section === "/gewerbe") {
      Promise.all(
        categories.map(async (cat) => {
          let q = supabase
            .from("businesses")
            .select("*", { count: "exact", head: true })
            .eq("status", "active")
            .ilike("category", `%${cat.value}%`);
          if (activeTown) q = q.eq("town", activeTown);
          const { count } = await q;
          return [cat.value, count ?? 0] as const;
        })
      ).then((results) => {
        setCounts(Object.fromEntries(results));
      });
    } else if (section === "/sport") {
      Promise.all(
        SPORT_CATEGORIES.map(async (sport) => {
          let q = supabase
            .from("clubs")
            .select("*", { count: "exact", head: true })
            .eq("status", "approved")
            .ilike("sport", `%${sport.value}%`);
          if (activeTown) q = q.eq("town", activeTown);
          const { count } = await q;
          return [sport.value, count ?? 0] as const;
        })
      ).then((results) => {
        setCounts(Object.fromEntries(results));
      });
    }
  }, [activeTown, section]);

  function selectCategory(value: string) {
    setCatOpen(false);
    const params = new URLSearchParams();
    if (activeTown) params.set("town", activeTown);
    if (value) params.set(filterParamName, value);
    const qs = params.toString();
    router.push(`${section}${qs ? `?${qs}` : ""}`);
  }

  if (isDetailPage(pathname)) return null;

  const currentCategories = section === "/sport" ? SPORT_CATEGORIES : categories;
  const activeCatLabel = currentCategories.find((c) => c.value === activeCategory)?.label ?? (section === "/sport" ? "Alle Sportarten" : "Alle Kategorien");

  return (
    <div className="lg:hidden sticky top-20 z-30 bg-surface/90 backdrop-blur-[12px] border-b border-outline-variant/10">

      {/* Town pills row */}
      <div className="flex items-center gap-2 px-4 pt-2.5 pb-2">
        <Link
          href={activeCategory ? `${section}?${filterParamName}=${activeCategory}` : section}
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            !activeTown
              ? "bg-primary text-on-primary"
              : "bg-surface-container-low text-on-surface-variant"
          }`}
          aria-label="Alle Städte"
        >
          <span className="material-symbols-outlined text-base">home</span>
        </Link>

        {towns.map((town) => {
          const isActive = activeTown === town.value;
          const href = activeCategory
            ? `${section}?town=${town.value}&${filterParamName}=${activeCategory}`
            : `${section}?town=${town.value}`;
          return (
            <Link
              key={town.value}
              href={href}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors ${
                isActive ? townActiveClass[town.value] : "bg-surface-container-low text-on-surface-variant"
              }`}
            >
              {town.label}
            </Link>
          );
        })}
      </div>

      {/* Category dropdown + search — gewerbe and vereine */}
      {(section === "/gewerbe" || section === "/sport") && (
        <div className="px-4 pb-2.5 flex flex-col gap-2">

          {/* Custom styled dropdown */}
          <div className="relative" ref={catRef}>
            <button
              onClick={() => setCatOpen(!catOpen)}
              className="w-full flex items-center px-4 py-3 bg-surface-container-low gap-3 hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-outline text-sm flex-shrink-0">{section === "/sport" ? "sports" : "category"}</span>
              <span className="text-primary font-bold uppercase text-[10px] tracking-widest flex-1 text-left">
                {activeCatLabel}
              </span>
              <span className={`material-symbols-outlined text-outline text-sm flex-shrink-0 transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`}>
                expand_more
              </span>
            </button>

            {catOpen && (
              <div className="absolute top-full left-0 right-0 bg-surface border border-outline-variant/20 shadow-2xl z-50 overflow-hidden max-h-64 overflow-y-auto">
                <button
                  onClick={() => selectCategory("")}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 text-left font-bold uppercase text-[10px] tracking-widest transition-colors ${
                    !activeCategory
                      ? "bg-secondary text-on-secondary"
                      : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                  }`}
                >
                  {!activeCategory && (
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  )}
                  <span className={!activeCategory ? "" : "ml-[28px]"}>{section === "/sport" ? "Alle Sportarten" : "Alle Kategorien"}</span>
                </button>
                {currentCategories.map((cat) => {
                  const isActive = activeCategory === cat.value;
                  return (
                    <button
                      key={cat.value}
                      onClick={() => selectCategory(cat.value)}
                      className={`w-full flex items-center gap-4 px-4 py-3.5 text-left font-bold uppercase text-[10px] tracking-widest transition-colors ${
                        isActive
                          ? "bg-secondary text-on-secondary"
                          : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                      }`}
                    >
                      {isActive && (
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      )}
                      <span className={isActive ? "" : "ml-[28px]"}>
                        {cat.label}
                        {counts[cat.value] != null && (
                          <span className="ml-1.5 opacity-60 font-medium normal-case tracking-normal">({counts[cat.value]})</span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {section === "/gewerbe" && <GewerbeSearch />}
        </div>
      )}

    </div>
  );
}
