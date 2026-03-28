import Link from "next/link";

export function SideNavBar() {
  return (
    <aside className="fixed hidden lg:flex h-[calc(100vh-80px)] w-72 bg-surface-container-lowest border-r border-outline-variant/15 flex-col py-10 z-40 overflow-y-auto mt-20 left-[max(0px,calc((100vw-1440px)/2))]">
      <div className="px-8 mb-4">
        <h3 className="font-headline uppercase tracking-[0.05em] text-[12px] font-bold text-primary dark:text-white">LOKALER FILTER</h3>
        <p className="text-[10px] text-on-surface-variant font-medium tracking-widest opacity-70">DREIGEWINNT REGION</p>
      </div>
      
      <nav className="flex flex-col gap-y-1">
        <Link href="/region/raunheim" className="flex items-center gap-4 py-3 px-8 text-on-surface-variant opacity-70 hover:opacity-100 hover:bg-surface-container-low transition-all font-headline uppercase tracking-[0.05em] text-[12px] font-bold">
          <span className="material-symbols-outlined text-xl">location_city</span>
          <span>Raunheim</span>
        </Link>
        
        <Link href="/region/kelsterbach" className="flex items-center gap-4 py-3 px-8 text-on-surface-variant opacity-70 hover:opacity-100 hover:bg-surface-container-low transition-all font-headline uppercase tracking-[0.05em] text-[12px] font-bold">
          <span className="material-symbols-outlined text-xl">apartment</span>
          <span>Kelsterbach</span>
        </Link>
        
        <Link href="/region/ruesselsheim" className="flex items-center gap-4 py-3 px-8 text-on-surface-variant opacity-70 hover:opacity-100 hover:bg-surface-container-low transition-all font-headline uppercase tracking-[0.05em] text-[12px] font-bold">
          <span className="material-symbols-outlined text-xl">corporate_fare</span>
          <span>Rüsselsheim</span>
        </Link>
        
        <div className="h-[1px] bg-outline-variant/10 my-4 mx-8"></div>
        
        <Link href="/gewerbe?category=gastronomie" className="flex items-center gap-4 py-3 px-8 text-on-surface-variant opacity-70 hover:opacity-100 hover:bg-surface-container-low transition-all font-headline uppercase tracking-[0.05em] text-[12px] font-bold">
          <span className="material-symbols-outlined text-xl">restaurant</span>
          <span>Gastronomie</span>
        </Link>
        
        <Link href="/gewerbe?category=handwerk" className="flex items-center gap-4 py-3 px-8 text-on-surface-variant opacity-70 hover:opacity-100 hover:bg-surface-container-low transition-all font-headline uppercase tracking-[0.05em] text-[12px] font-bold">
          <span className="material-symbols-outlined text-xl">build</span>
          <span>Handwerk</span>
        </Link>
        
        <Link href="/events?category=kultur" className="flex items-center gap-4 py-3 px-8 text-on-surface-variant opacity-70 hover:opacity-100 hover:bg-surface-container-low transition-all font-headline uppercase tracking-[0.05em] text-[12px] font-bold">
          <span className="material-symbols-outlined text-xl">theater_comedy</span>
          <span>Kultur</span>
        </Link>
      </nav>

      <div className="mt-auto px-8 pt-6">
        <div className="editorial-gradient p-6 rounded shadow-lg text-on-secondary">
          <p className="text-[10px] font-bold tracking-widest uppercase mb-2">Partner Programm</p>
          <h4 className="font-headline font-bold text-lg leading-tight mb-4">Premium Partner werden</h4>
          <button className="w-full bg-white text-secondary py-2 text-[12px] font-bold uppercase tracking-wider rounded-sm hover:bg-surface transition-colors">Jetzt Anfragen</button>
        </div>
      </div>
    </aside>
  );
}
