"use client";

import { useRef, useEffect, useState, useCallback } from "react";

export function ScrollableRow({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const update = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });
  };

  return (
    <div className="relative group/row">
      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        aria-label="Zurück"
        className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-secondary text-white shadow-2xl transition-all duration-300 hover:bg-primary hover:scale-110 ${
          canScrollLeft ? "opacity-100" : "opacity-30 cursor-not-allowed"
        }`}
      >
        <span className="material-symbols-outlined text-2xl font-bold">chevron_left</span>
      </button>

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none -mx-6 md:-mx-12 px-6 md:px-12"
      >
        {children}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        aria-label="Weiter"
        className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-primary text-white shadow-2xl transition-all duration-300 hover:bg-secondary hover:scale-110 ${
          canScrollRight ? "opacity-100" : "opacity-30 cursor-not-allowed"
        }`}
      >
        <span className="material-symbols-outlined text-2xl font-bold">chevron_right</span>
      </button>
    </div>
  );
}
