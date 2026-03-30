"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Props {
  businessName: string;
  slug: string;
  activeTab: "aktuelles" | "info";
  titleId: string;
}

export function StickyBusinessHeader({ businessName, slug, activeTab, titleId }: Props) {
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
      <p className={`text-xs font-black text-primary tracking-tight mb-2 truncate transition-all duration-200 ${showName ? "opacity-100 h-4" : "opacity-0 h-0 mb-0 overflow-hidden"}`}>
        {businessName}
      </p>
      <div className="grid grid-cols-2 gap-2">
        <Link
          href={`/gewerbe/${slug}?tab=aktuelles`}
          className={`flex items-center gap-3 px-4 py-3 transition-colors border-b-2 ${
            activeTab === "aktuelles"
              ? "bg-surface-container-lowest border-primary"
              : "bg-surface-container-low border-transparent hover:bg-surface-container-lowest"
          }`}
        >
          <span
            className={`material-symbols-outlined text-xl flex-shrink-0 ${activeTab === "aktuelles" ? "text-primary" : "text-on-surface-variant/50"}`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            campaign
          </span>
          <div>
            <p className={`text-[11px] font-black uppercase tracking-widest ${activeTab === "aktuelles" ? "text-primary" : "text-on-surface-variant"}`}>
              Aktuelles
            </p>
            <p className="text-[10px] text-on-surface-variant/60 font-medium hidden sm:block">Angebote & Updates</p>
          </div>
        </Link>
        <Link
          href={`/gewerbe/${slug}?tab=info`}
          className={`flex items-center gap-3 px-4 py-3 transition-colors border-b-2 ${
            activeTab === "info"
              ? "bg-surface-container-lowest border-primary"
              : "bg-surface-container-low border-transparent hover:bg-surface-container-lowest"
          }`}
        >
          <span
            className={`material-symbols-outlined text-xl flex-shrink-0 ${activeTab === "info" ? "text-primary" : "text-on-surface-variant/50"}`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            store
          </span>
          <div>
            <p className={`text-[11px] font-black uppercase tracking-widest ${activeTab === "info" ? "text-primary" : "text-on-surface-variant"}`}>
              Info
            </p>
            <p className="text-[10px] text-on-surface-variant/60 font-medium hidden sm:block">Kontakt & Öffnungszeiten</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
