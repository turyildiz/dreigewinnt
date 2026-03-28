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
      <section className="relative px-6 md:px-12 pt-16 md:pt-24 pb-20 md:pb-32 min-h-[80vh] flex flex-col justify-center border-b border-outline-variant/10">
        
        {/* Abstract Background Base */}
        <div className="absolute top-0 right-0 w-full md:w-2/3 h-full -z-20 opacity-[0.03] pointer-events-none bg-primary" 
             style={{ maskImage: "radial-gradient(circle at right, black, transparent 80%)", WebkitMaskImage: "radial-gradient(circle at right, black, transparent 80%)" }}></div>
             
        <div className="w-full flex flex-col lg:flex-row justify-between items-center relative z-10 gap-12">
          
          {/* Left Content */}
          <div className="flex-1 max-w-2xl relative z-20 w-full">
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-6 md:mb-8">
              <TownTag town="Raunheim" />
              <TownTag town="Kelsterbach" />
              <TownTag town="Rüsselsheim" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-[5.5rem] font-black text-primary tracking-tighter leading-[1] md:leading-[0.9] mb-6 md:mb-8 relative">
              Drei Städte.<br />Eine Plattform.<br />Drei Gewinner.
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-xl font-medium leading-relaxed">
              Entdecke die besten Unternehmen und Events in Raunheim, Kelsterbach und Rüsselsheim.
            </p>
          </div>

          {/* Right Content: The Three Pillars */}
          <div className="hidden lg:flex flex-1 justify-end items-center gap-4 h-[550px] relative z-0 pr-8 w-full">
            <div className="w-24 xl:w-32 h-[80%] rounded-full overflow-hidden shadow-2xl mt-20 relative group">
              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 group-hover:bg-transparent transition-all duration-700"></div>
              <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-all duration-700" alt="Cafe in Raunheim" />
            </div>
            <div className="w-32 xl:w-40 h-[100%] rounded-full overflow-hidden shadow-2xl relative group">
              <div className="absolute inset-0 bg-tertiary/20 mix-blend-overlay z-10 group-hover:bg-transparent transition-all duration-700"></div>
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-all duration-700" alt="Tech Hub in Kelsterbach" />
            </div>
            <div className="w-24 xl:w-32 h-[80%] rounded-full overflow-hidden shadow-2xl -mt-20 relative group">
              <div className="absolute inset-0 bg-secondary/20 mix-blend-overlay z-10 group-hover:bg-transparent transition-all duration-700"></div>
              <img src="https://images.unsplash.com/photo-1540039155733-d730a53ca30f?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-all duration-700" alt="Concert in Rüsselsheim" />
            </div>
          </div>
        </div>

        <SearchBar />
      </section>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Card 1 */}
          <div className="group bg-surface-container-lowest p-6 md:p-8 border border-tertiary-container/40 relative hover:bg-surface-bright transition-all duration-300">
            <div className="absolute top-0 right-0 bg-tertiary px-3 py-1 text-[10px] font-bold text-on-tertiary uppercase tracking-widest">Top-Partner</div>
            <div className="w-12 h-12 md:w-16 md:h-16 bg-surface-container-high mb-6 md:mb-8 flex items-center justify-center rounded-sm">
              <span className="material-symbols-outlined text-primary text-2xl md:text-3xl">restaurant</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-secondary transition-colors">Gourmet Eck Raunheim</h3>
            <p className="text-on-surface-variant text-xs md:text-sm mb-6 leading-relaxed">Exzellente deutsche Küche mit regionalen Zutaten. Ein Muss für jeden Feinschmecker in der Region.</p>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary">Gastronomie • Raunheim</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group bg-surface-container-lowest p-6 md:p-8 border border-tertiary-container/40 relative hover:bg-surface-bright transition-all duration-300">
            <div className="absolute top-0 right-0 bg-tertiary px-3 py-1 text-[10px] font-bold text-on-tertiary uppercase tracking-widest">Top-Partner</div>
            <div className="w-12 h-12 md:w-16 md:h-16 bg-surface-container-high mb-6 md:mb-8 flex items-center justify-center rounded-sm">
              <span className="material-symbols-outlined text-primary text-2xl md:text-3xl">fitness_center</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-secondary transition-colors">Power Hub Kelsterbach</h3>
            <p className="text-on-surface-variant text-xs md:text-sm mb-6 leading-relaxed">Modernstes Fitnessstudio der Region mit 24/7 Zugang und persönlicher Betreuung durch Experten.</p>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary">Sport • Kelsterbach</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group bg-surface-container-lowest p-6 md:p-8 border border-tertiary-container/40 relative hover:bg-surface-bright transition-all duration-300">
            <div className="absolute top-0 right-0 bg-tertiary px-3 py-1 text-[10px] font-bold text-on-tertiary uppercase tracking-widest">Top-Partner</div>
            <div className="w-12 h-12 md:w-16 md:h-16 bg-surface-container-high mb-6 md:mb-8 flex items-center justify-center rounded-sm">
              <span className="material-symbols-outlined text-primary text-2xl md:text-3xl">architecture</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-secondary transition-colors">Design Studio Opel Altbau</h3>
            <p className="text-on-surface-variant text-xs md:text-sm mb-6 leading-relaxed">Kreativ-Agentur im Herzen von Rüsselsheim. Spezialisiert auf Markenbildung und digitale Transformation.</p>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary">Kreativ • Rüsselsheim</span>
            </div>
          </div>
        </div>
      </section>

      {/* Event-Highlights Section */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-surface-container-low">
        <div className="mb-10 md:mb-16">
          <span className="text-secondary font-black text-[10px] md:text-xs uppercase tracking-[0.3em] block mb-3 md:mb-4">Stadtleben</span>
          <h2 className="text-4xl md:text-5xl font-black text-primary tracking-tighter">Veranstaltungen</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-12">
          {/* Featured Event 1 */}
          <div className="relative group mb-8 md:mb-0">
            <div className="aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-sm bg-surface-container-highest flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1540039155733-d730a53ca30f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Vibrant outdoor summer festival" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
            <div className="absolute -bottom-8 md:-bottom-6 left-4 right-4 md:left-6 md:right-12 bg-surface-container-lowest p-6 md:p-8 shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <span className="text-secondary font-bold text-[10px] md:text-xs uppercase tracking-widest">24. August • Kelsterbach</span>
                <div className="bg-primary text-white text-[8px] md:text-[10px] px-2 py-0.5 uppercase font-bold tracking-tighter shadow-sm">Featured Boost</div>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-primary leading-tight mb-3 md:mb-4 group-hover:text-secondary transition-colors">Main-Ufer Sommerfest</h3>
              <p className="text-on-surface-variant text-xs md:text-sm line-clamp-2 md:line-clamp-3 leading-relaxed">Live-Musik, kulinarische Köstlichkeiten und ein spektakuläres Feuerwerk direkt am Mainufer von Kelsterbach.</p>
            </div>
          </div>

          {/* Featured Event 2 */}
          <div className="relative group mt-8 md:mt-0">
            <div className="aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-sm bg-surface-container-highest flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1536924940846-227afb31e2a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Modern art gallery interior" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
            <div className="absolute -bottom-8 md:-bottom-6 left-4 right-4 md:left-6 md:right-12 bg-surface-container-lowest p-6 md:p-8 shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <span className="text-secondary font-bold text-[10px] md:text-xs uppercase tracking-widest">12. September • Rüsselsheim</span>
                <div className="bg-primary text-white text-[8px] md:text-[10px] px-2 py-0.5 uppercase font-bold tracking-tighter shadow-sm">Featured Boost</div>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-primary leading-tight mb-3 md:mb-4 group-hover:text-secondary transition-colors">Industrie-Kultur Tage</h3>
              <p className="text-on-surface-variant text-xs md:text-sm line-clamp-2 md:line-clamp-3 leading-relaxed">Erleben Sie die faszinierende Geschichte der Opel-Stadt durch exklusive Führungen und Ausstellungen.</p>
            </div>
          </div>
        </div>

        <div className="mt-20 md:mt-24 text-center">
          <Link href="/events" className="inline-block bg-primary text-on-primary px-8 md:px-12 py-4 rounded-sm font-black uppercase text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] hover:bg-on-surface-variant transition-colors w-full md:w-auto">
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
