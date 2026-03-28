import Link from "next/link";
import Image from "next/image";
import { TownTag } from "@/components/ui/TownTag";

export default function Home() {
  return (
    <main className="pt-20 max-w-[1440px] w-full mx-auto overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative px-12 pt-24 pb-32">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <TownTag town="Raunheim" />
            <TownTag town="Kelsterbach" />
            <TownTag town="Rüsselsheim" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-primary tracking-tighter leading-[0.9] mb-8">
            Drei Städte.<br />Eine Plattform.<br />Drei Gewinner.
          </h1>
          <p className="text-xl md:text-2xl text-on-surface-variant max-w-2xl font-medium leading-relaxed">
            Entdecke die besten Unternehmen und Events in Raunheim, Kelsterbach und Rüsselsheim.
          </p>
        </div>

        {/* Floating Search Interface */}
        <div className="mt-16 relative z-10 glass-morphism bg-surface/85 p-2 rounded-lg shadow-[0_40px_40px_rgba(2,5,17,0.06)] border border-outline-variant/20">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
            <div className="flex-1 flex items-center px-6 py-4 bg-surface-container-low rounded-sm">
              <span className="material-symbols-outlined text-outline mr-4">apartment</span>
              <select className="bg-transparent border-none outline-none focus:ring-0 text-primary font-bold w-full uppercase text-xs tracking-widest appearance-none">
                <option>Alle Städte</option>
                <option>Raunheim</option>
                <option>Kelsterbach</option>
                <option>Rüsselsheim</option>
              </select>
            </div>
            <div className="flex-[2] flex items-center px-6 py-4 bg-surface-container-low rounded-sm">
              <span className="material-symbols-outlined text-outline mr-4">category</span>
              <input className="bg-transparent border-none outline-none focus:ring-0 text-primary font-bold w-full placeholder:text-outline/60 uppercase text-xs tracking-widest" placeholder="WONACH SUCHST DU?" type="text" />
            </div>
            <button className="signature-gradient text-on-secondary px-10 py-5 rounded-sm font-black uppercase text-sm tracking-[0.2em] shadow-lg hover:brightness-110 transition-all">
              Suchen
            </button>
          </div>
        </div>

        {/* Background Aesthetic */}
        <div className="absolute top-0 right-0 w-1/2 h-full -z-10 opacity-5 pointer-events-none">
          <div className="w-full h-full bg-primary" style={{ maskImage: "radial-gradient(circle at center, black, transparent 70%)", WebkitMaskImage: "radial-gradient(circle at center, black, transparent 70%)" }}></div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-surface-container-low py-6 px-12 flex justify-center items-center gap-4 overflow-hidden whitespace-nowrap">
        <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant">
          Trust First: Alle Inhalte werden von Menschen geprüft. Echte Empfehlungen, kein Algorithmus.
        </p>
        <span className="hidden md:inline w-12 h-px bg-outline-variant/30"></span>
        <span className="hidden md:inline text-[10px] font-bold text-outline uppercase tracking-widest">editorial quality guaranteed</span>
      </section>

      {/* Top-Partner Section */}
      <section className="py-24 px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div>
            <span className="text-tertiary font-black text-xs uppercase tracking-[0.3em] block mb-4">Gewerbeverzeichnis</span>
            <h2 className="text-5xl font-black text-primary tracking-tighter">Top-Partner</h2>
          </div>
          <Link href="/gewerbe" className="text-sm font-bold uppercase tracking-widest border-b-2 border-secondary pb-1 hover:text-secondary transition-colors">Alle Unternehmen ansehen</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="group bg-surface-container-lowest p-8 border border-tertiary-container/40 relative hover:bg-surface-bright transition-all duration-300">
            <div className="absolute top-0 right-0 bg-tertiary px-3 py-1 text-[10px] font-bold text-on-tertiary uppercase tracking-widest">Top-Partner</div>
            <div className="w-16 h-16 bg-surface-container-high mb-8 flex items-center justify-center rounded-sm">
              <span className="material-symbols-outlined text-primary text-3xl">restaurant</span>
            </div>
            <h3 className="text-2xl font-bold mb-2 group-hover:text-secondary transition-colors">Gourmet Eck Raunheim</h3>
            <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">Exzellente deutsche Küche mit regionalen Zutaten. Ein Muss für jeden Feinschmecker in der Region.</p>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Gastronomie • Raunheim</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group bg-surface-container-lowest p-8 border border-tertiary-container/40 relative hover:bg-surface-bright transition-all duration-300">
            <div className="absolute top-0 right-0 bg-tertiary px-3 py-1 text-[10px] font-bold text-on-tertiary uppercase tracking-widest">Top-Partner</div>
            <div className="w-16 h-16 bg-surface-container-high mb-8 flex items-center justify-center rounded-sm">
              <span className="material-symbols-outlined text-primary text-3xl">fitness_center</span>
            </div>
            <h3 className="text-2xl font-bold mb-2 group-hover:text-secondary transition-colors">Power Hub Kelsterbach</h3>
            <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">Modernstes Fitnessstudio der Region mit 24/7 Zugang und persönlicher Betreuung durch Experten.</p>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Sport • Kelsterbach</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group bg-surface-container-lowest p-8 border border-tertiary-container/40 relative hover:bg-surface-bright transition-all duration-300">
            <div className="absolute top-0 right-0 bg-tertiary px-3 py-1 text-[10px] font-bold text-on-tertiary uppercase tracking-widest">Top-Partner</div>
            <div className="w-16 h-16 bg-surface-container-high mb-8 flex items-center justify-center rounded-sm">
              <span className="material-symbols-outlined text-primary text-3xl">architecture</span>
            </div>
            <h3 className="text-2xl font-bold mb-2 group-hover:text-secondary transition-colors">Design Studio Opel Altbau</h3>
            <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">Kreativ-Agentur im Herzen von Rüsselsheim. Spezialisiert auf Markenbildung und digitale Transformation.</p>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Kreativ • Rüsselsheim</span>
            </div>
          </div>
        </div>
      </section>

      {/* Event-Highlights Section */}
      <section className="py-24 px-12 bg-surface-container-low">
        <div className="mb-16">
          <span className="text-secondary font-black text-xs uppercase tracking-[0.3em] block mb-4">Stadtleben</span>
          <h2 className="text-5xl font-black text-primary tracking-tighter">Veranstaltungen</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Featured Event 1 */}
          <div className="relative group">
            <div className="aspect-[16/9] overflow-hidden rounded-sm bg-surface-container-highest flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1540039155733-d730a53ca30f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Vibrant outdoor summer festival" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
            <div className="absolute -bottom-6 left-6 right-6 md:right-12 bg-surface-container-lowest p-8 shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <span className="text-secondary font-bold text-xs uppercase tracking-widest">24. August • Kelsterbach</span>
                <div className="bg-primary text-white text-[10px] px-2 py-0.5 uppercase font-bold tracking-tighter">Featured Boost</div>
              </div>
              <h3 className="text-3xl font-black text-primary leading-tight mb-4 group-hover:text-secondary transition-colors">Main-Ufer Sommerfest</h3>
              <p className="text-on-surface-variant text-sm line-clamp-2">Live-Musik, kulinarische Köstlichkeiten und ein spektakuläres Feuerwerk direkt am Mainufer von Kelsterbach.</p>
            </div>
          </div>

          {/* Featured Event 2 */}
          <div className="relative group">
            <div className="aspect-[16/9] overflow-hidden rounded-sm bg-surface-container-highest flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1536924940846-227afb31e2a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Modern art gallery interior" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
            <div className="absolute -bottom-6 left-6 right-6 md:right-12 bg-surface-container-lowest p-8 shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <span className="text-secondary font-bold text-xs uppercase tracking-widest">12. September • Rüsselsheim</span>
                <div className="bg-primary text-white text-[10px] px-2 py-0.5 uppercase font-bold tracking-tighter">Featured Boost</div>
              </div>
              <h3 className="text-3xl font-black text-primary leading-tight mb-4 group-hover:text-secondary transition-colors">Industrie-Kultur Tage</h3>
              <p className="text-on-surface-variant text-sm line-clamp-2">Erleben Sie die faszinierende Geschichte der Opel-Stadt durch exklusive Führungen und Ausstellungen.</p>
            </div>
          </div>
        </div>

        <div className="mt-24 text-center">
          <Link href="/events" className="inline-block bg-primary text-on-primary px-12 py-4 rounded-sm font-black uppercase text-xs tracking-[0.3em] hover:bg-on-surface-variant transition-colors">
            Alle Veranstaltungen entdecken
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-32 px-12">
        <div className="bg-primary text-on-primary p-12 md:p-24 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">Bleibe informiert über deine Heimat.</h2>
            <p className="text-on-primary-container text-lg mb-12">Erhalte wöchentlich die wichtigsten News und exklusive Angebote deiner lokalen Partner direkt in dein Postfach.</p>
            <div className="flex flex-col md:flex-row gap-4">
              <input className="flex-1 outline-none bg-primary-container border-none p-5 text-on-primary focus:ring-1 focus:ring-secondary uppercase font-bold text-xs tracking-widest" placeholder="DEINE E-MAIL ADRESSE" type="email" />
              <button className="signature-gradient text-on-secondary px-12 py-5 font-black uppercase text-xs tracking-[0.2em] hover:brightness-110 transition-all">Abonnieren</button>
            </div>
          </div>
          {/* Abstract visual element */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/10 -skew-x-12 translate-x-1/2"></div>
        </div>
      </section>
    </main>
  );
}
