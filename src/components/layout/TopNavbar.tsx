"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function TopNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-primary/80 backdrop-blur-xl border-b border-outline-variant/15 shadow-[0_40px_40px_rgba(2,5,17,0.06)]">
      <div className="max-w-[1440px] mx-auto flex justify-between items-center h-20 px-12">
        
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-4">
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
        
        <div className="hidden md:flex items-center gap-8 font-headline tracking-tight font-bold text-sm">
          <Link 
            className={`transition-colors duration-200 ${pathname?.startsWith('/gewerbe') ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary dark:text-inverse-surface'}`} 
            href="/gewerbe"
          >
            Gewerbe
          </Link>
          <Link 
            className={`transition-colors duration-200 ${pathname?.startsWith('/events') ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary dark:text-inverse-surface'}`} 
            href="/events"
          >
            Events
          </Link>
          <Link 
            className={`transition-colors duration-200 ${pathname?.startsWith('/news') ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary dark:text-inverse-surface'}`} 
            href="/news"
          >
            News
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-primary p-2 rounded-full hover:bg-surface-container-low transition-colors">search</button>
          <button className="bg-secondary text-on-secondary px-6 py-2.5 rounded-sm font-bold uppercase text-xs tracking-widest hover:scale-95 transition-all">
            Anmelden
          </button>
        </div>

      </div>
    </nav>
  );
}
