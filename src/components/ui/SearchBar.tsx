"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const cities = ["Alle Städte", "Raunheim", "Kelsterbach", "Rüsselsheim"];

export function SearchBar() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState("Alle Städte");
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearch() {
    if (!query.trim()) return;
    const params = new URLSearchParams();
    params.set("q", query.trim());
    if (selectedCity && selectedCity !== "Alle Städte") {
      params.set("town", selectedCity.toLowerCase());
    }
    router.push(`/suche?${params.toString()}`);
  }

  return (
    <div className="w-full relative z-10 glass-morphism bg-surface/85 p-2 rounded-lg shadow-[0_40px_40px_rgba(2,5,17,0.06)] border border-outline-variant/20">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">

        {/* Custom City Picker */}
        <div className="flex-1 relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center px-4 md:px-6 py-4 bg-surface-container-low rounded-sm gap-3 md:gap-4 group hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-outline text-sm flex-shrink-0">apartment</span>
            <span className="text-primary font-bold uppercase text-[10px] md:text-xs tracking-widest flex-1 text-left">
              {selectedCity}
            </span>
            <span
              className={`material-symbols-outlined text-outline text-sm flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            >
              expand_more
            </span>
          </button>

          {/* Dropdown panel */}
          {isOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-surface border border-outline-variant/20 rounded-sm shadow-2xl z-50 overflow-hidden">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => { setSelectedCity(city); setIsOpen(false); }}
                  className={`w-full flex items-center gap-4 px-4 md:px-6 py-3.5 text-left font-bold uppercase text-[10px] tracking-widest transition-colors ${
                    selectedCity === city
                      ? "bg-secondary text-on-secondary"
                      : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                  }`}
                >
                  {selectedCity === city && (
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  )}
                  <span className={selectedCity === city ? "" : "ml-[28px]"}>{city}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search input */}
        <div className="flex-[2] flex items-center px-4 md:px-6 py-4 bg-surface-container-low rounded-sm">
          <span className="material-symbols-outlined text-outline mr-3 md:mr-4 text-sm">category</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="bg-transparent border-none outline-none focus:ring-0 text-primary font-bold w-full placeholder:text-outline/60 uppercase text-[10px] md:text-xs tracking-widest"
            placeholder="WONACH SUCHST DU?"
            type="text"
          />
        </div>

        {/* Search button */}
        <button 
          onClick={handleSearch}
          disabled={!query.trim()}
          className="signature-gradient text-on-secondary px-8 md:px-10 py-5 rounded-sm font-black uppercase text-xs md:text-sm tracking-[0.2em] shadow-lg hover:brightness-110 transition-all text-center disabled:opacity-40"
        >
          Suchen
        </button>
      </div>
    </div>
  );
}
