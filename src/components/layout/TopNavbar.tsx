"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const quickLinks = [
  { label: "Raunheim", href: "/gewerbe?town=raunheim", icon: "location_city" },
  { label: "Kelsterbach", href: "/gewerbe?town=kelsterbach", icon: "apartment" },
  { label: "Rüsselsheim", href: "/gewerbe?town=ruesselsheim", icon: "corporate_fare" },
  { label: "Events", href: "/events", icon: "event" },
  { label: "Gewerbe", href: "/gewerbe", icon: "storefront" },
  { label: "Sport", href: "/sport", icon: "sports" },
  { label: "News", href: "/news", icon: "newspaper" },
];

export function TopNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  function handleSearch() {
    if (!query.trim()) return;
    setIsSearchOpen(false);
    router.push(`/suche?q=${encodeURIComponent(query.trim())}`);
  }

  // Autofocus input when search opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsSearchOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsMobileMenuOpen(false);
      setIsSearchOpen(false);
      setQuery("");
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant/15 shadow-[0_40px_40px_rgba(2,5,17,0.06)]">
        {/* Content container */}
        <div className="max-w-[1440px] mx-auto h-20 flex items-center relative">

          {/* Desktop Logo */}
          <div className="absolute left-0 top-0 h-20 w-72 hidden lg:flex items-center justify-center border-r border-outline-variant/15">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 h-6">
                <span className="w-[2px] h-[16px] bg-primary"></span>
                <span className="w-[2px] h-[24px] bg-secondary"></span>
                <span className="w-[2px] h-[20px] bg-tertiary"></span>
              </div>
              <div className="text-2xl font-headline tracking-tighter uppercase flex items-baseline">
                <span className="font-bold text-primary">DREIGEWINNT</span>
                <span className="font-light text-tertiary">.COM</span>
              </div>
            </Link>
          </div>

          {/* Main navbar content */}
          <div className="flex-1 lg:pl-72 flex items-center justify-between h-full px-6 lg:px-12">

            {/* Mobile logo */}
            <div className="lg:hidden">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 h-6">
                  <span className="w-[2px] h-[16px] bg-primary"></span>
                  <span className="w-[2px] h-[24px] bg-secondary"></span>
                  <span className="w-[2px] h-[20px] bg-tertiary"></span>
                </div>
                <div className="text-xl font-headline tracking-tighter uppercase flex items-baseline">
                  <span className="font-bold text-primary">DREIGEWINNT</span>
                  <span className="font-light text-tertiary">.COM</span>
                </div>
              </Link>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={() => { setIsSearchOpen(!isSearchOpen); setIsMobileMenuOpen(false); }}
                className={`cursor-pointer p-2 rounded-full transition-colors flex items-center justify-center ${isSearchOpen ? "bg-primary text-on-primary" : "text-primary hover:bg-surface-container-low"}`}
                aria-label="Suche öffnen"
              >
                <span className="material-symbols-outlined">{isSearchOpen ? "close" : "search"}</span>
              </button>
              <Link
                href="/gewerbe/einreichen"
                className="hidden lg:block signature-gradient text-on-secondary px-6 py-2.5 rounded-sm font-bold uppercase text-xs tracking-widest hover:brightness-110 transition-all"
              >
                Partner werden
              </Link>
              <div className="lg:hidden">
                <button
                  type="button"
                  className="cursor-pointer text-primary p-2 active:bg-surface-container-low rounded-full transition-colors flex items-center justify-center"
                  onClick={() => { setIsMobileMenuOpen(!isMobileMenuOpen); setIsSearchOpen(false); }}
                >
                  <span className="material-symbols-outlined">{isMobileMenuOpen ? "close" : "menu"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Desktop nav links */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-8 font-headline tracking-tight font-bold text-base">
            <Link
              className={`transition-colors duration-200 ${pathname?.startsWith("/aktuelles") ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary"}`}
              href="/aktuelles"
            >
              Aktuelles
            </Link>
            <Link
              className={`transition-colors duration-200 ${pathname?.startsWith("/events") ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary"}`}
              href="/events"
            >
              Events
            </Link>
            <Link
              className={`transition-colors duration-200 ${pathname?.startsWith("/gewerbe") ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary"}`}
              href="/gewerbe"
            >
              Gewerbe
            </Link>
            <Link
              className={`transition-colors duration-200 ${pathname?.startsWith("/sport") ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary"}`}
              href="/sport"
            >
              Sport
            </Link>
            <Link
              className={`transition-colors duration-200 ${pathname?.startsWith("/news") ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary"}`}
              href="/news"
            >
              News
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden absolute top-20 left-0 w-full bg-surface shadow-2xl transition-all duration-300 transform origin-top ${
            isMobileMenuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col gap-6 px-6 py-8">
            <Link
              className={`transition-colors duration-200 text-2xl font-headline tracking-tight font-bold flex justify-between items-center ${pathname?.startsWith("/aktuelles") ? "text-primary" : "text-on-surface-variant"}`}
              href="/aktuelles"
            >
              Aktuelles
              <span className="material-symbols-outlined text-outline">arrow_forward_ios</span>
            </Link>
            <Link
              className={`transition-colors duration-200 text-2xl font-headline tracking-tight font-bold flex justify-between items-center ${pathname?.startsWith("/events") ? "text-primary" : "text-on-surface-variant"}`}
              href="/events"
            >
              Events
              <span className="material-symbols-outlined text-outline">arrow_forward_ios</span>
            </Link>
            <Link
              className={`transition-colors duration-200 text-2xl font-headline tracking-tight font-bold flex justify-between items-center ${pathname?.startsWith("/gewerbe") ? "text-primary" : "text-on-surface-variant"}`}
              href="/gewerbe"
            >
              Gewerbe
              <span className="material-symbols-outlined text-outline">arrow_forward_ios</span>
            </Link>
            <Link
              className={`transition-colors duration-200 text-2xl font-headline tracking-tight font-bold flex justify-between items-center ${pathname?.startsWith("/sport") ? "text-primary" : "text-on-surface-variant"}`}
              href="/sport"
            >
              Sport
              <span className="material-symbols-outlined text-outline">arrow_forward_ios</span>
            </Link>
            <Link
              className={`transition-colors duration-200 text-2xl font-headline tracking-tight font-bold flex justify-between items-center ${pathname?.startsWith("/news") ? "text-primary" : "text-on-surface-variant"}`}
              href="/news"
            >
              News
              <span className="material-symbols-outlined text-outline">arrow_forward_ios</span>
            </Link>
            <hr className="border-outline-variant/20 my-2" />

            <Link
              href="/gewerbe/einreichen"
              className="signature-gradient text-on-secondary px-6 py-4 rounded-sm font-black uppercase text-sm tracking-widest hover:brightness-110 transition-all text-center w-full block"
            >
              Partner werden
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Search Overlay ── */}
      <div
        ref={overlayRef}
        className={`fixed top-20 left-0 w-full z-50 transition-all duration-300 ${
          isSearchOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="bg-surface/95 nav-blur border-b border-outline-variant/15 shadow-2xl">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-6 lg:py-8">

            {/* Search input */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 flex items-center gap-3 bg-surface-container-low px-4 sm:px-6 py-4">
                <span className="material-symbols-outlined text-outline text-xl flex-shrink-0">search</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Gewerbe, Events oder Nachrichten suchen…"
                  className="flex-1 bg-transparent border-none outline-none text-primary font-bold text-sm sm:text-base placeholder:text-outline/50 placeholder:font-normal"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="cursor-pointer material-symbols-outlined text-outline hover:text-primary transition-colors text-xl">
                    close
                  </button>
                )}
              </div>
              <button
                onClick={handleSearch}
                disabled={!query.trim()}
                className="cursor-pointer hidden sm:block signature-gradient text-on-secondary px-6 py-4 font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-default"
              >
                Suchen
              </button>
            </div>

            {/* Quick links */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">
                Schnellzugriff
              </p>
              <div className="flex flex-wrap gap-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/15 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant hover:bg-primary hover:text-on-primary hover:border-primary transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Backdrop — only mounted when open so it never blocks touch events */}
        {isSearchOpen && (
          <div
            className="h-screen bg-primary/20"
            onClick={() => setIsSearchOpen(false)}
          />
        )}
      </div>
    </>
  );
}
