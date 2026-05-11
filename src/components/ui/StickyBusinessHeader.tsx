"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Props {
  businessName: string;
  town: string;
  slug: string;
  activeTab: "aktuelles" | "info";
  titleId: string;
}

export function StickyBusinessHeader({ businessName, town, slug, activeTab, titleId }: Props) {
  const [showName, setShowName] = useState(false);

  useEffect(() => {
    const title = document.getElementById(titleId);
    if (!title) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowName(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(title);
    return () => observer.disconnect();
  }, [titleId]);

  return (
    <div className="sticky top-20 z-20 -mx-4 sm:-mx-8 lg:-mx-12 px-4 sm:px-8 lg:px-12 bg-surface/95 backdrop-blur-[8px] pt-3 pb-4 mb-4 lg:mb-6 border-b border-outline-variant/10">
      <div className={`flex items-baseline gap-2 mb-2 transition-all duration-200 ${showName ? "opacity-100 max-h-8" : "opacity-0 max-h-0 mb-0 overflow-hidden"}`}>
        <p className="text-sm font-black text-primary tracking-tight truncate">{businessName}</p>
        <p className="text-[11px] font-bold text-on-surface-variant flex-shrink-0">· {town}</p>
      </div>
      <div className="bg-surface-container-high/50 p-1.5 rounded-none flex gap-1">
        <Link
          href={`/gewerbe/${slug}?tab=aktuelles`}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-none transition-all duration-300 ${
            activeTab === "aktuelles"
              ? "bg-white shadow-sm text-primary"
              : "text-on-surface-variant/60 hover:text-on-surface-variant hover:bg-white/40"
          }`}
        >
          <span
            className="material-symbols-outlined text-xl flex-shrink-0"
            style={{ fontVariationSettings: activeTab === "aktuelles" ? "'FILL' 1" : "" }}
          >
            campaign
          </span>
          <div className="text-left">
            <p className="text-[11px] font-black uppercase tracking-widest leading-none">
              Aktuelles
            </p>
            <p className="text-[9px] font-bold opacity-60 hidden sm:block mt-0.5">Angebote & Updates</p>
          </div>
        </Link>
        <Link
          href={`/gewerbe/${slug}?tab=info`}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-none transition-all duration-300 ${
            activeTab === "info"
              ? "bg-white shadow-sm text-primary"
              : "text-on-surface-variant/60 hover:text-on-surface-variant hover:bg-white/40"
          }`}
        >
          <span
            className="material-symbols-outlined text-xl flex-shrink-0"
            style={{ fontVariationSettings: activeTab === "info" ? "'FILL' 1" : "" }}
          >
            info
          </span>
          <div className="text-left">
            <p className="text-[11px] font-black uppercase tracking-widest leading-none">
              Info
            </p>
            <p className="text-[9px] font-bold opacity-60 hidden sm:block mt-0.5">Kontakt & Öffnungszeiten</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
