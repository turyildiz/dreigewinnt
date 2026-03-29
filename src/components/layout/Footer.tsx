import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-outline-variant/15 mt-20 bg-surface-container-lowest font-body text-sm tracking-wide z-10 relative">
      <div className="max-w-[1440px] mx-auto py-12 px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex items-center gap-1 h-4">
            <span className="w-[1.5px] h-[10px] bg-primary"></span>
            <span className="w-[1.5px] h-[16px] bg-secondary"></span>
            <span className="w-[1.5px] h-[13px] bg-tertiary"></span>
          </div>
          <div className="text-lg font-headline tracking-tighter uppercase flex items-baseline">
            <span className="font-bold text-primary">DREIGEWINNT</span>
            <span className="font-light text-tertiary">.COM</span>
          </div>
        </Link>
        <div className="flex flex-wrap justify-center gap-12 text-[12px] font-bold uppercase tracking-widest text-on-surface-variant/60">
          <Link className="hover:text-primary hover:underline decoration-tertiary-container underline-offset-4 transition-all duration-300" href="/impressum">Impressum</Link>
          <Link className="hover:text-primary hover:underline decoration-tertiary-container underline-offset-4 transition-all duration-300" href="/datenschutz">Datenschutz</Link>
          <Link className="hover:text-primary hover:underline decoration-tertiary-container underline-offset-4 transition-all duration-300" href="/kontakt">Kontakt</Link>
        </div>
        <div className="text-on-surface-variant/60 text-xs text-right">
          © {new Date().getFullYear()} Editorial Localism Hub.
        </div>
      </div>
    </footer>
  );
}
