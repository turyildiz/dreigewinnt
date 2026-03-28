import Link from "next/link";

export function TopNavbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-primary/80 backdrop-blur-xl border-b border-outline-variant/15 shadow-[0_40px_40px_rgba(2,5,17,0.06)]">
      <div className="max-w-[1280px] mx-auto flex justify-between items-center h-20 px-8">
        
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
        
        <div className="hidden md:flex items-center gap-8 font-headline tracking-tight font-bold uppercase text-sm">
          <Link className="text-on-surface-variant dark:text-inverse-surface hover:text-primary transition-colors duration-200" href="/gewerbe">Gewerbe</Link>
          <Link className="text-on-surface-variant dark:text-inverse-surface hover:text-primary transition-colors duration-200" href="/events">Events</Link>
          <Link className="text-on-surface-variant dark:text-inverse-surface hover:text-primary transition-colors duration-200" href="/news">News</Link>
          <Link className="text-on-surface-variant dark:text-inverse-surface hover:text-primary transition-colors duration-200" href="/region/raunheim">Raunheim</Link>
          <Link className="text-on-surface-variant dark:text-inverse-surface hover:text-primary transition-colors duration-200" href="/region/kelsterbach">Kelsterbach</Link>
          <Link className="text-on-surface-variant dark:text-inverse-surface hover:text-primary transition-colors duration-200" href="/region/ruesselsheim">Rüsselsheim</Link>
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
