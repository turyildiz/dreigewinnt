"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function TopNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-primary/80 backdrop-blur-xl border-b border-outline-variant/15 shadow-[0_40px_40px_rgba(2,5,17,0.06)]">
      {/* Content container — matches the 1440px max-width of the rest of the page */}
      <div className="max-w-[1440px] mx-auto h-20 flex items-center relative">

        {/* Desktop Logo — absolutely positioned within the 1440px container, w-72, centered */}
        <div className="absolute left-0 top-0 h-20 w-72 hidden lg:flex items-center justify-center border-r border-outline-variant/15">
          <Link href="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="flex items-center gap-1.5 h-6">
              <span className="w-[2px] h-[16px] bg-primary dark:bg-white"></span>
              <span className="w-[2px] h-[24px] bg-secondary"></span>
              <span className="w-[2px] h-[20px] bg-tertiary"></span>
            </div>
            <div className="text-2xl font-headline tracking-tighter uppercase flex items-baseline">
              <span className="font-bold text-primary dark:text-white">DREIGEWINNT</span>
              <span className="font-light text-tertiary">.COM</span>
            </div>
          </Link>
        </div>

        {/* Main navbar content */}
        <div className="flex-1 lg:pl-72 flex items-center justify-between h-full px-6 lg:px-12">

          {/* Mobile logo */}
          <div className="lg:hidden">
            <Link href="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="flex items-center gap-1.5 h-6">
                <span className="w-[2px] h-[16px] bg-primary dark:bg-white"></span>
                <span className="w-[2px] h-[24px] bg-secondary"></span>
                <span className="w-[2px] h-[20px] bg-tertiary"></span>
              </div>
              <div className="text-xl font-headline tracking-tighter uppercase flex items-baseline">
                <span className="font-bold text-primary dark:text-white">DREIGEWINNT</span>
                <span className="font-light text-tertiary">.COM</span>
              </div>
            </Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3 ml-auto">
            <button className="material-symbols-outlined text-primary p-2 rounded-full hover:bg-surface-container-low transition-colors">search</button>
            <button className="hidden lg:block bg-secondary text-on-secondary px-6 py-2.5 rounded-sm font-bold uppercase text-xs tracking-widest hover:scale-95 transition-all">
              Anmelden
            </button>
            <div className="lg:hidden">
              <button
                className="material-symbols-outlined text-primary p-2 active:bg-surface-container-low rounded-full transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? 'close' : 'menu'}
              </button>
            </div>
          </div>

        </div>

        {/* Desktop nav links — absolutely centered in the full 1440px container */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-8 font-headline tracking-tight font-bold text-base">
          <Link
            className={`transition-colors duration-200 ${pathname?.startsWith('/gewerbe') ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`}
            href="/gewerbe"
          >
            Gewerbe
          </Link>
          <Link
            className={`transition-colors duration-200 ${pathname?.startsWith('/events') ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`}
            href="/events"
          >
            Events
          </Link>
          <Link
            className={`transition-colors duration-200 ${pathname?.startsWith('/news') ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`}
            href="/news"
          >
            News
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden absolute top-20 left-0 w-full bg-surface shadow-2xl transition-all duration-300 transform origin-top ${
          isMobileMenuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-6 px-6 py-8">
          <Link
            className={`transition-colors duration-200 text-2xl font-headline tracking-tight font-bold flex justify-between items-center ${pathname?.startsWith('/gewerbe') ? 'text-primary' : 'text-on-surface-variant'}`}
            href="/gewerbe"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Gewerbe
            <span className="material-symbols-outlined text-outline">arrow_forward_ios</span>
          </Link>
          <Link
            className={`transition-colors duration-200 text-2xl font-headline tracking-tight font-bold flex justify-between items-center ${pathname?.startsWith('/events') ? 'text-primary' : 'text-on-surface-variant'}`}
            href="/events"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Events
            <span className="material-symbols-outlined text-outline">arrow_forward_ios</span>
          </Link>
          <Link
            className={`transition-colors duration-200 text-2xl font-headline tracking-tight font-bold flex justify-between items-center ${pathname?.startsWith('/news') ? 'text-primary' : 'text-on-surface-variant'}`}
            href="/news"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            News
            <span className="material-symbols-outlined text-outline">arrow_forward_ios</span>
          </Link>

          <hr className="border-outline-variant/20 my-4" />

          <button
            className="bg-secondary text-on-secondary px-6 py-4 rounded-sm font-black uppercase text-sm tracking-widest hover:brightness-110 transition-all text-center w-full"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Anmelden
          </button>
        </div>
      </div>
    </nav>
  );
}
