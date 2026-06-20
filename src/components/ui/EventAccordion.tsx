"use client";

import { useState } from "react";
import Link from "next/link";
import { TownTag } from "@/components/ui/TownTag";

const townLabels: Record<string, "Raunheim" | "Kelsterbach" | "Rüsselsheim"> = {
  raunheim: "Raunheim",
  kelsterbach: "Kelsterbach",
  ruesselsheim: "Rüsselsheim",
};

function formatEventDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
  });
}

interface Event {
  id: string;
  slug: string;
  title: string;
  town: string | null;
  category: string | null;
  date_start: string | null;
  description: string | null;
  image_url: string | null;
  is_featured: boolean | null;
}

export function EventAccordion({ events }: { events: Event[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <>
      {/* Desktop: accordion panels */}
      <div className="hidden md:flex h-[540px] gap-0">
        {events.map((event, i) => {
          const isHovered = hoveredIndex === i;
          const someoneHovered = hoveredIndex !== null;

          let flexValue: string;
          if (!someoneHovered) {
            flexValue = "1 1 0%";
          } else if (isHovered) {
            flexValue = "2.5 1 0%";
          } else {
            flexValue = "0.5 1 0%";
          }

          return (
            <Link
              key={event.id}
              href={`/events/${event.slug}`}
              className="group relative overflow-hidden block cursor-pointer"
              style={{
                flex: flexValue,
                transition: "flex 500ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {event.image_url ? (
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700"
                  style={{ transform: isHovered ? "scale(1)" : "scale(1.05)" }}
                />
              ) : (
                <div className="w-full h-full bg-surface-container-high" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />

              {event.is_featured && (
                <div className="absolute top-4 left-4 bg-primary/60 backdrop-blur-sm px-3 py-1">
                  <span className="text-white text-[10px] font-black uppercase tracking-widest">Featured</span>
                </div>
              )}
              {event.town && (
                <div className="absolute top-4 right-4">
                  <TownTag town={townLabels[event.town] ?? event.town as "Raunheim"} />
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <span className="text-secondary-fixed text-[10px] font-bold uppercase tracking-widest block mb-2">
                  {event.date_start && formatEventDate(event.date_start)}
                  {event.category && ` · ${event.category}`}
                </span>
                <h3
                  className="font-black text-white tracking-tight leading-tight mb-3 transition-colors duration-300"
                  style={{
                    fontSize: isHovered ? "2rem" : "1.25rem",
                    transition: "font-size 500ms cubic-bezier(0.4, 0, 0.2, 1), color 300ms",
                    color: isHovered ? "var(--color-secondary-fixed, #74db9f)" : "white",
                  }}
                >
                  {event.title}
                </h3>
                <div
                  className="overflow-hidden transition-all duration-500"
                  style={{
                    maxHeight: isHovered ? "200px" : "0px",
                    opacity: isHovered ? 1 : 0,
                  }}
                >
                  {event.description && (
                    <p className="text-white/70 text-sm leading-relaxed line-clamp-2 mb-5 max-w-lg">
                      {event.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest">
                    <span>Zur Veranstaltung</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Mobile: stacked cards */}
      <div className="md:hidden flex flex-col gap-0">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/events/${event.slug}`}
            className="group relative overflow-hidden h-[300px] block"
          >
            {event.image_url ? (
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-surface-container-high" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
            {event.is_featured && (
              <div className="absolute top-4 left-4 bg-primary/60 backdrop-blur-sm px-3 py-1">
                <span className="text-white text-[10px] font-black uppercase tracking-widest">Featured</span>
              </div>
            )}
            {event.town && (
              <div className="absolute top-4 right-4">
                <TownTag town={townLabels[event.town] ?? event.town as "Raunheim"} />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="text-secondary-fixed text-[10px] font-bold uppercase tracking-widest block mb-2">
                {event.date_start && formatEventDate(event.date_start)}
                {event.category && ` · ${event.category}`}
              </span>
              <h3 className="text-xl font-black text-white tracking-tight leading-tight mb-3 group-hover:text-secondary-fixed transition-colors">
                {event.title}
              </h3>
              <div className="flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest group-hover:text-secondary-fixed transition-colors">
                <span>Zur Veranstaltung</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
