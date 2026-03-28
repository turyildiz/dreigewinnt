import Link from "next/link";
import Image from "next/image";
import { TownTag } from "@/components/ui/TownTag";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "@/components/ui/SearchBar";

export default function Home() {
  return (
    <>
    <main className="pt-16 md:pt-20 max-w-[1440px] w-full mx-auto overflow-hidden">
      
      {/* Hero Section */}
      <section className="px-6 md:px-12 pt-12 md:pt-16 pb-12 md:pb-16 border-b border-outline-variant/10 relative overflow-hidden">

        {/* Decorative large background text — purely CSS, never breaks */}
        <div className="absolute inset-0 flex items-center justify-end pointer-events-none select-none overflow-hidden" aria-hidden="true">
          <span className="text-[20vw] font-black text-primary/[0.03] tracking-tighter leading-none whitespace-nowrap pr-8">
            3GW
          </span>
        </div>

        <div className="relative z-10 grid lg:grid-cols-[2fr_1fr] items-stretch gap-0">

          {/* Left: text */}
          <div className="flex flex-col justify-between gap-8">
            <h1 className="text-[clamp(3rem,8vw,6.5rem)] font-black text-primary tracking-tighter leading-[0.9]">
              Drei Städte.<br />
              <span className="text-secondary">Eine</span> Plattform.<br />
              Drei Gewinner.
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
              <p className="text-base md:text-lg text-on-surface-variant font-medium leading-relaxed max-w-xs">
                Das lokale Verzeichnis für Raunheim, Kelsterbach und Rüsselsheim.
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <TownTag town="Raunheim" />
                <TownTag town="Kelsterbach" />
                <TownTag town="Rüsselsheim" />
              </div>
            </div>
          </div>

          {/* Right: logo mark — centered in the right grid column */}
          <div className="hidden lg:flex items-center justify-center gap-10 self-stretch">
            <span className="w-[6px] h-[55%] bg-primary" />
            <span className="w-[6px] self-stretch bg-secondary" />
            <span className="w-[6px] h-[70%] bg-tertiary" />
          </div>

        </div>
      </section>

      {/* Full-width Search Bar */}
      <div className="px-6 md:px-12 py-5 bg-surface-container-low border-b border-outline-variant/10 relative z-20">
        <SearchBar />
      </div>

      {/* Trust Bar */}
      <section className="bg-surface-container-low py-4 md:py-6 px-6 md:px-12 flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4 text-center md:text-left overflow-hidden">
        <span className="material-symbols-outlined text-secondary hidden md:inline-block" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
        <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.1em] md:tracking-[0.15em] text-on-surface-variant leading-relaxed">
          Trust First: Alle Inhalte werden von Menschen geprüft.
          <span className="hidden md:inline"> Echte Empfehlungen, kein Algorithmus.</span>
        </p>
        <span className="hidden md:inline w-12 h-px bg-outline-variant/30"></span>
        <span className="hidden md:inline text-[10px] font-bold text-outline uppercase tracking-widest">editorial quality guaranteed</span>
      </section>

      {/* Top-Partner Section */}
      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6 md:gap-4">
          <div>
            <span className="text-tertiary font-black text-[10px] md:text-xs uppercase tracking-[0.3em] block mb-3 md:mb-4">Gewerbeverzeichnis</span>
            <h2 className="text-4xl md:text-5xl font-black text-primary tracking-tighter">Top-Partner</h2>
          </div>
          <Link href="/gewerbe" className="text-[10px] md:text-sm font-bold uppercase tracking-widest border-b-2 border-secondary pb-1 hover:text-secondary transition-colors">Alle Unternehmen ansehen</Link>
        </div>

        {/* Row 1: tall LEFT + full-height RIGHT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">

          {/* Card 1 — tall left */}
          <Link href="/gewerbe/main-studio-gmbh" className="group relative overflow-hidden h-[480px] md:h-[600px] block md:col-span-1">
            <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop" alt="Gourmet Eck Raunheim" className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-tertiary px-3 py-1">
              <span className="material-symbols-outlined text-white text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="text-white text-[10px] font-black uppercase tracking-widest">Top-Partner</span>
            </div>
            <div className="absolute top-4 right-4"><TownTag town="Raunheim" /></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <span className="text-secondary-fixed text-[10px] font-bold uppercase tracking-widest block mb-2">Gastronomie</span>
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight mb-3 group-hover:text-secondary-fixed transition-colors">Gourmet Eck Raunheim</h3>
              <p className="text-white/70 text-sm leading-relaxed line-clamp-2 mb-5">Exzellente deutsche Küche mit regionalen Zutaten. Ein Muss für jeden Feinschmecker in der Region.</p>
              <div className="flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest group-hover:text-secondary-fixed transition-colors">
                <span>Zum Profil</span>
                <span className="material-symbols-outlined text-sm -translate-x-1 group-hover:translate-x-0 transition-transform duration-300">arrow_forward</span>
              </div>
            </div>
          </Link>

          {/* Card 2 — full height right */}
          <Link href="/gewerbe/lederwerk-taunus" className="group relative overflow-hidden h-[480px] md:h-[600px] block md:col-span-2">
            <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1400&auto=format&fit=crop" alt="Power Hub Kelsterbach" className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent" />
            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-tertiary px-3 py-1">
              <span className="material-symbols-outlined text-white text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="text-white text-[10px] font-black uppercase tracking-widest">Top-Partner</span>
            </div>
            <div className="absolute top-4 right-4"><TownTag town="Kelsterbach" /></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 md:max-w-lg">
              <span className="text-secondary-fixed text-[10px] font-bold uppercase tracking-widest block mb-2">Sport & Fitness</span>
              <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight mb-3 group-hover:text-secondary-fixed transition-colors">Power Hub Kelsterbach</h3>
              <p className="text-white/70 text-sm leading-relaxed line-clamp-2 mb-5">Modernstes Fitnessstudio der Region mit 24/7 Zugang und persönlicher Betreuung durch Experten.</p>
              <div className="flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest group-hover:text-secondary-fixed transition-colors">
                <span>Zum Profil</span>
                <span className="material-symbols-outlined text-sm -translate-x-1 group-hover:translate-x-0 transition-transform duration-300">arrow_forward</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Row 2: small LEFT + tall RIGHT (mirrored) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">

          {/* Cards 4 stacked left */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-rows-1 gap-0">
            <Link href="/gewerbe/handwerksbetrieb-mueller" className="group relative overflow-hidden h-[480px] md:h-[600px] block">
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1400&auto=format&fit=crop" alt="Handwerksbetrieb Müller" className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-l from-primary/80 via-primary/40 to-transparent" />
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-tertiary px-3 py-1">
                <span className="material-symbols-outlined text-white text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-white text-[10px] font-black uppercase tracking-widest">Top-Partner</span>
              </div>
              <div className="absolute top-4 right-4"><TownTag town="Kelsterbach" /></div>
              <div className="absolute bottom-0 right-0 left-0 p-6 md:p-8 md:text-right">
                <span className="text-secondary-fixed text-[10px] font-bold uppercase tracking-widest block mb-1.5">Handwerk & Bau</span>
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight mb-3 group-hover:text-secondary-fixed transition-colors">Handwerksbetrieb Müller</h3>
                <p className="text-white/70 text-sm leading-relaxed line-clamp-2 mb-5 hidden md:block">Sanitär, Heizung und Klimatechnik — seit über 20 Jahren der verlässliche Partner im Main-Taunus-Kreis.</p>
                <div className="flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest group-hover:text-secondary-fixed transition-colors md:justify-end">
                  <span>Zum Profil</span>
                  <span className="material-symbols-outlined text-sm -translate-x-1 group-hover:translate-x-0 transition-transform duration-300">arrow_forward</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Card 4 — tall right */}
          <Link href="/gewerbe/main-gym-fitness" className="group relative overflow-hidden h-[480px] md:h-[600px] block md:col-span-1">
            <img src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop" alt="Main-Gym Fitness" className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-tertiary px-3 py-1">
              <span className="material-symbols-outlined text-white text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="text-white text-[10px] font-black uppercase tracking-widest">Top-Partner</span>
            </div>
            <div className="absolute top-4 right-4"><TownTag town="Raunheim" /></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <span className="text-secondary-fixed text-[10px] font-bold uppercase tracking-widest block mb-2">Sport & Freizeit</span>
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight mb-3 group-hover:text-secondary-fixed transition-colors">Main-Gym Fitness</h3>
              <p className="text-white/70 text-sm leading-relaxed line-clamp-2 mb-5">Modern ausgestattetes Fitnesscenter mit Kursen für alle Altersgruppen — direkt im Herzen von Raunheim.</p>
              <div className="flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest group-hover:text-secondary-fixed transition-colors">
                <span>Zum Profil</span>
                <span className="material-symbols-outlined text-sm -translate-x-1 group-hover:translate-x-0 transition-transform duration-300">arrow_forward</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Event-Highlights Section */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-surface-container-low">
        <div className="mb-10 md:mb-16">
          <span className="text-secondary font-black text-[10px] md:text-xs uppercase tracking-[0.3em] block mb-3 md:mb-4">Stadtleben</span>
          <h2 className="text-4xl md:text-5xl font-black text-primary tracking-tighter">Veranstaltungen</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">

          {/* Event 1 — wide left */}
          <Link href="/events/jazz-im-rathausgarten" className="group relative overflow-hidden h-[420px] md:h-[540px] block md:col-span-2">
            <img
              src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1400&auto=format&fit=crop"
              alt="Main-Ufer Sommerfest"
              className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
            <div className="absolute top-4 left-4 bg-primary/60 backdrop-blur-sm px-3 py-1">
              <span className="text-white text-[10px] font-black uppercase tracking-widest">Featured Boost</span>
            </div>
            <div className="absolute top-4 right-4">
              <TownTag town="Kelsterbach" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <span className="text-secondary-fixed text-[10px] font-bold uppercase tracking-widest block mb-2">24. August · Stadtfest</span>
              <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight mb-3 group-hover:text-secondary-fixed transition-colors">
                Main-Ufer Sommerfest
              </h3>
              <p className="text-white/70 text-sm leading-relaxed line-clamp-2 mb-5 max-w-lg">
                Live-Musik, kulinarische Köstlichkeiten und ein spektakuläres Feuerwerk direkt am Mainufer von Kelsterbach.
              </p>
              <div className="flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest group-hover:text-secondary-fixed transition-colors">
                <span>Zur Veranstaltung</span>
                <span className="material-symbols-outlined text-sm -translate-x-1 group-hover:translate-x-0 transition-transform duration-300">arrow_forward</span>
              </div>
            </div>
          </Link>

          {/* Event 2 — tall right */}
          <Link href="/events/main-taunus-genussmarkt" className="group relative overflow-hidden h-[420px] md:h-[540px] block md:col-span-1">
            <img
              src="https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=800&auto=format&fit=crop"
              alt="Industrie-Kultur Tage"
              className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
            <div className="absolute top-4 left-4 bg-primary/60 backdrop-blur-sm px-3 py-1">
              <span className="text-white text-[10px] font-black uppercase tracking-widest">Featured Boost</span>
            </div>
            <div className="absolute top-4 right-4">
              <TownTag town="Rüsselsheim" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <span className="text-secondary-fixed text-[10px] font-bold uppercase tracking-widest block mb-2">12. September · Kultur</span>
              <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-tight mb-3 group-hover:text-secondary-fixed transition-colors">
                Industrie-Kultur Tage
              </h3>
              <p className="text-white/70 text-sm leading-relaxed line-clamp-2 mb-5">
                Erleben Sie die faszinierende Geschichte der Opel-Stadt durch exklusive Führungen.
              </p>
              <div className="flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest group-hover:text-secondary-fixed transition-colors">
                <span>Zur Veranstaltung</span>
                <span className="material-symbols-outlined text-sm -translate-x-1 group-hover:translate-x-0 transition-transform duration-300">arrow_forward</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-10 md:mt-12 text-center">
          <Link href="/events" className="inline-block bg-primary text-on-primary px-8 md:px-12 py-4 font-black uppercase text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] hover:bg-on-surface-variant transition-colors w-full md:w-auto">
            Alle Veranstaltungen entdecken
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 md:py-32 px-6 md:px-12">
        <div className="bg-primary text-on-primary p-8 md:p-16 lg:p-24 relative overflow-hidden rounded-lg md:rounded-none">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 md:mb-8 leading-tight">Bleibe informiert über deine Heimat.</h2>
            <p className="text-on-primary-container text-base md:text-lg mb-8 md:mb-12">Erhalte wöchentlich die wichtigsten News und exklusive Angebote deiner lokalen Partner direkt in dein Postfach.</p>
            <div className="flex flex-col md:flex-row gap-4">
              <input className="flex-1 outline-none bg-primary-container border-none p-4 md:p-5 text-on-primary focus:ring-1 focus:ring-secondary uppercase font-bold text-[10px] md:text-xs tracking-widest w-full" placeholder="DEINE E-MAIL ADRESSE" type="email" />
              <button className="signature-gradient text-on-secondary px-8 md:px-12 py-4 md:py-5 font-black uppercase text-[10px] md:text-xs tracking-[0.2em] hover:brightness-110 transition-all w-full md:w-auto">Abonnieren</button>
            </div>
          </div>
          {/* Abstract visual element */}
          <div className="absolute top-0 right-0 w-full md:w-1/3 h-full bg-secondary/10 opacity-30 md:opacity-100 skew-y-12 md:-skew-x-12 translate-x-1/2"></div>
        </div>
      </section>
    </main>
    <Footer />
    </>
  );
}
