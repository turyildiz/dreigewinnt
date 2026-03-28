import { EventCard } from "@/components/ui/EventCard";
import Link from "next/link";

const featuredEvents = [
  {
    id: "jazz-im-rathausgarten",
    title: "Jazz im Rathausgarten",
    dateStr: "24. Sept",
    town: "Rüsselsheim" as "Rüsselsheim",
    description: "Ein Abend voller Eleganz und rhythmischer Raffinesse im Herzen von Rüsselsheim. Mit international besetzten Ensembles.",
    imageUrl: "https://images.unsplash.com/photo-1540039155733-d730a53ca30f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    isFeatured: true,
  },
  {
    id: "main-taunus-genussmarkt",
    title: "Main-Taunus Genussmarkt",
    dateStr: "28. Sept",
    town: "Raunheim" as "Raunheim",
    description: "Exzellente Weine und regionale Spezialitäten direkt von den Erzeugern aus der gesamten Main-Taunus Region.",
    imageUrl: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    isFeatured: true,
  },
  {
    id: "vernissage-lokale-moderne",
    title: "Vernissage: Lokale Moderne",
    dateStr: "02. Okt",
    town: "Kelsterbach" as "Kelsterbach",
    description: "Zeitgenössische Kunst aus Kelsterbach und Umgebung. Ein Dialog zwischen Tradition und digitalem Fortschritt.",
    imageUrl: "https://images.unsplash.com/photo-1551043047-1d2adf00f3fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    isFeatured: true,
  }
];

const upcomingEvents = [
  {
    category: "Lesung",
    title: "Krimidinner in der Stadtbücherei",
    locationTime: "Rüsselsheim | 19:00 Uhr",
    dateNum: "05",
    dateMonth: "OKT",
    imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop"
  },
  {
    category: "Gewerbe",
    title: "Digital Hub: Main-Taunus Networking",
    locationTime: "Technologiezentrum | 18:30 Uhr",
    dateNum: "08",
    dateMonth: "OKT",
    imageUrl: "https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=2000&auto=format&fit=crop"
  },
  {
    category: "Stadtfest",
    title: "Lichterfest im Stadtpark",
    locationTime: "Kelsterbach | Ganztägig",
    dateNum: "12",
    dateMonth: "OKT",
    imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2000&auto=format&fit=crop"
  }
];

export default function EventsPage() {
  return (
    <main className="px-12 py-16">
      <header className="mb-16">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-surface-container-highest text-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">Rüsselsheim</span>
          <span className="text-on-surface-variant/40 text-sm italic">— Lokal Kuratiert</span>
        </div>
        <h1 className="text-6xl font-headline font-black tracking-tighter text-primary">Was ist los?</h1>
        <p className="text-on-surface-variant mt-4 max-w-2xl text-lg">
          Entdecken Sie die wichtigsten kulturellen und gesellschaftlichen Highlights in Ihrer Region. Von exklusiven Konzerten bis hin zu lokalen Handwerksmärkten.
        </p>
      </header>

      {/* Featured Boost */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-headline font-bold text-xl uppercase tracking-widest text-primary flex items-center gap-3">
            <span className="w-8 h-[2px] bg-tertiary-container"></span>
            Featured Boost
          </h2>
          <span className="text-tertiary font-bold text-xs tracking-widest uppercase italic">Premium Selection</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featuredEvents.map(event => (
            <EventCard key={event.id} {...event} variant="directory" />
          ))}
        </div>
      </section>

      {/* Aktuelle Termine */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-headline font-bold text-xl uppercase tracking-widest text-primary flex items-center gap-3">
            <span className="w-8 h-[2px] bg-outline-variant"></span>
            Aktuelle Termine
          </h2>
          <div className="flex gap-4">
            <button className="bg-surface-container-high px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-surface-container-highest transition-colors">Wochenende</button>
            <button className="bg-primary text-on-primary px-4 py-2 text-[10px] font-bold uppercase tracking-widest">Alle anzeigen</button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {upcomingEvents.map((event, i) => (
            <div key={i} className="group bg-surface-container-lowest flex items-center hover:bg-surface-bright transition-colors">
              <div className="w-32 h-32 flex-shrink-0">
                <img 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" 
                  alt={event.title} 
                  src={event.imageUrl} 
                />
              </div>
              <div className="px-8 flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4 md:py-0">
                <div className="max-w-md">
                  <span className="text-secondary font-bold text-[10px] tracking-widest uppercase mb-1 block">{event.category}</span>
                  <h4 className="text-lg font-headline font-bold text-primary leading-tight">{event.title}</h4>
                  <p className="text-on-surface-variant text-sm mt-1">{event.locationTime}</p>
                </div>
                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <span className="block font-black text-xl text-primary leading-none">{event.dateNum}</span>
                    <span className="block text-[10px] uppercase font-bold text-on-surface-variant">{event.dateMonth}</span>
                  </div>
                  <button className="flex items-center gap-2 border border-outline-variant/15 px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                    <span className="hidden md:inline">Zum Kalender hinzufügen</span>
                    <span className="inline md:hidden">Speichern</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Floating Action Button */}
      <div className="fixed bottom-12 right-12 z-50">
        <button className="editorial-gradient text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform" aria-label="Event hinzufügen">
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>
    </main>
  );
}
