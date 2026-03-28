import Link from "next/link";
import { EventCard } from "@/components/ui/EventCard";
import { EventSubmitModal } from "@/components/ui/EventSubmitModal";
import { TownTag } from "@/components/ui/TownTag";

const featuredEvents = [
  {
    id: "jazz-im-rathausgarten",
    title: "Jazz im Rathausgarten",
    dateStr: "24. Sept",
    town: "Rüsselsheim" as "Rüsselsheim",
    description: "Ein Abend voller Eleganz und rhythmischer Raffinesse im Herzen von Rüsselsheim.",
    imageUrl: "https://images.unsplash.com/photo-1540039155733-d730a53ca30f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    isFeatured: true,
  },
  {
    id: "main-taunus-genussmarkt",
    title: "Main-Taunus Genussmarkt",
    dateStr: "28. Sept",
    town: "Raunheim" as "Raunheim",
    description: "Exzellente Weine und regionale Spezialitäten direkt von den Erzeugern der Region.",
    imageUrl: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    isFeatured: true,
  },
  {
    id: "vernissage-lokale-moderne",
    title: "Vernissage: Lokale Moderne",
    dateStr: "02. Okt",
    town: "Kelsterbach" as "Kelsterbach",
    description: "Zeitgenössische Kunst aus Kelsterbach und Umgebung.",
    imageUrl: "https://images.unsplash.com/photo-1551043047-1d2adf00f3fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    isFeatured: true,
  }
];

const upcomingEvents = [
  {
    id: "krimidinner-stadtbuecherei",
    town: "Rüsselsheim",
    category: "Lesung",
    title: "Krimidinner in der Stadtbücherei",
    locationTime: "Rüsselsheim · 19:00 Uhr",
    dateNum: "05",
    dateMonth: "OKT",
    imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "digital-hub-networking",
    town: "Rüsselsheim",
    category: "Gewerbe",
    title: "Digital Hub: Main-Taunus Networking",
    locationTime: "Technologiezentrum · 18:30 Uhr",
    dateNum: "08",
    dateMonth: "OKT",
    imageUrl: "https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "lichterfest-stadtpark",
    town: "Kelsterbach",
    category: "Stadtfest",
    title: "Lichterfest im Stadtpark",
    locationTime: "Kelsterbach · Ganztägig",
    dateNum: "12",
    dateMonth: "OKT",
    imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop"
  }
];

const townLabels: Record<string, string> = {
  raunheim: "Raunheim",
  kelsterbach: "Kelsterbach",
  ruesselsheim: "Rüsselsheim",
};

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ town?: string; category?: string }>;
}) {
  const { town, category } = await searchParams;
  const townLabel = town ? townLabels[town] : null;

  const matchesTown = (t: string) => !townLabel || t.toLowerCase() === townLabel.toLowerCase();
  const matchesCategory = (cat: string) => !category || cat.toLowerCase() === category.toLowerCase();

  const visibleFeatured = featuredEvents.filter(e => matchesTown(e.town));
  const visibleUpcoming = upcomingEvents.filter(
    e => matchesTown(e.town) && matchesCategory(e.category)
  );

  return (
    <main className="w-full">

      {/* ── Page Header ── */}
      <header className="px-4 sm:px-8 lg:px-12 pt-6 lg:pt-14 pb-8 lg:pb-10">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="bg-surface-container-highest text-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
            {townLabel ?? "Dreigewinnt Region"}
          </span>
          {category && (
            <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
              {category}
            </span>
          )}
          <span className="text-on-surface-variant/40 text-sm italic">— Lokal Kuratiert</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-black tracking-tighter text-primary leading-none">
          Was ist los?
        </h1>
        <p className="text-on-surface-variant mt-3 text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg">
          {townLabel
            ? `Kulturelle Highlights in ${townLabel}.`
            : "Entdecken Sie die wichtigsten kulturellen Highlights in Ihrer Region."}
        </p>
      </header>

      {/* ── Featured Boost ── */}
      {visibleFeatured.length > 0 && (
      <section className="mb-10 lg:mb-20">
        <div className="px-4 sm:px-8 lg:px-12 flex items-center justify-between mb-5 lg:mb-8">
          <h2 className="font-headline font-bold text-sm sm:text-base uppercase tracking-widest text-primary flex items-center gap-3">
            <span className="w-6 h-[2px] bg-tertiary-container flex-shrink-0"></span>
            Featured Boost
          </h2>
          <span className="text-tertiary font-bold text-[10px] tracking-widest uppercase italic">Premium</span>
        </div>

        <div className="lg:hidden flex flex-col gap-4 px-4 sm:px-8">
          {visibleFeatured.map(event => (
            <EventCard key={event.id} {...event} variant="directory" />
          ))}
        </div>

        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8 px-12">
          {visibleFeatured.map(event => (
            <EventCard key={event.id} {...event} variant="directory" />
          ))}
        </div>
      </section>
      )}

      {/* ── Aktuelle Termine ── */}
      <section className="px-4 sm:px-8 lg:px-12 pb-16">
        <div className="flex items-center justify-between mb-5 lg:mb-8 gap-3 flex-wrap">
          <h2 className="font-headline font-bold text-sm sm:text-base uppercase tracking-widest text-primary flex items-center gap-3">
            <span className="w-6 h-[2px] bg-outline-variant flex-shrink-0"></span>
            Aktuelle Termine
          </h2>
          <div className="flex gap-2">
            <button className="bg-surface-container-high px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest hover:bg-surface-container-highest transition-colors">
              Wochenende
            </button>
            <button className="bg-primary text-on-primary px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest">
              Alle anzeigen
            </button>
          </div>
        </div>

        {visibleUpcoming.length === 0 && (
          <p className="text-on-surface-variant text-sm py-8 text-center">
            Keine Termine in {townLabel} gefunden.
          </p>
        )}

        <div className="flex flex-col gap-2 lg:gap-3">
          {visibleUpcoming.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="group bg-surface-container-lowest flex items-stretch hover:bg-surface-bright transition-colors overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="w-20 sm:w-28 lg:w-36 flex-shrink-0 self-stretch">
                <img
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  alt={event.title}
                  src={event.imageUrl}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-center px-3 sm:px-5 lg:px-8 py-3 lg:py-4">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <TownTag town={event.town as "Raunheim" | "Kelsterbach" | "Rüsselsheim"} />
                  <span className="text-secondary font-bold text-[9px] sm:text-[10px] tracking-widest uppercase">
                    {event.category}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base lg:text-lg font-headline font-bold text-primary leading-tight line-clamp-1">
                  {event.title}
                </h4>
                <p className="text-on-surface-variant text-[10px] sm:text-xs mt-0.5 line-clamp-1">{event.locationTime}</p>
              </div>

              {/* Date + CTA */}
              <div className="flex-shrink-0 flex flex-col sm:flex-row items-center gap-2 sm:gap-6 pr-3 sm:pr-5 lg:pr-8 py-3">
                <div className="text-center sm:text-right">
                  <span className="block font-black text-base sm:text-xl text-primary leading-none">{event.dateNum}</span>
                  <span className="block text-[9px] uppercase font-bold text-on-surface-variant">{event.dateMonth}</span>
                </div>
                <button className="flex items-center gap-1 border border-outline-variant/20 px-2 sm:px-4 py-2 sm:py-2.5 text-[9px] font-bold uppercase tracking-wide hover:bg-primary hover:text-white transition-all whitespace-nowrap">
                  <span className="material-symbols-outlined text-xs sm:text-sm">calendar_today</span>
                  <span className="hidden sm:inline ml-1">Kalender</span>
                </button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <EventSubmitModal />

    </main>
  );
}
