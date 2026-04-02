import Link from "next/link";
import { EventCard } from "@/components/ui/EventCard";
import { TownTag } from "@/components/ui/TownTag";
import { supabase } from "@/lib/supabase";
import { toDisplayTown } from "@/lib/towns";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ town?: string; category?: string }>;
}) {
  const { town, category } = await searchParams;
  const townLabel = town ? toDisplayTown(town) : null;

  // Featured events
  let featuredQuery = supabase
    .from("events")
    .select("id, slug, title, description, town, date_start, image_url, is_featured, category")
    .eq("status", "active")
    .eq("is_featured", true)
    .gte("date_start", new Date().toISOString())
    .order("date_start");
  if (town) featuredQuery = featuredQuery.eq("town", town);

  // Upcoming events
  let upcomingQuery = supabase
    .from("events")
    .select("id, slug, title, town, date_start, venue, image_url, category")
    .eq("status", "active")
    .gte("date_start", new Date().toISOString())
    .order("date_start");
  if (town) upcomingQuery = upcomingQuery.eq("town", town);
  if (category) upcomingQuery = upcomingQuery.ilike("category", `%${category}%`);

  const [{ data: featuredEvents }, { data: upcomingEvents }] = await Promise.all([
    featuredQuery,
    upcomingQuery,
  ]);

  const featured = featuredEvents ?? [];
  const upcoming = upcomingEvents ?? [];

  return (
    <main className="w-full">

      {/* ── Page Header ── */}
      <header className="px-4 sm:px-8 lg:px-12 pt-6 lg:pt-14 pb-8 lg:pb-10">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {townLabel ? (
            <TownTag town={townLabel} />
          ) : (
            <span className="bg-surface-container-highest text-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">Dreigewinnt Region</span>
          )}
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
      {featured.length > 0 && (
        <section className="mb-10 lg:mb-20">
          <div className="px-4 sm:px-8 lg:px-12 flex items-center justify-between mb-5 lg:mb-8">
            <h2 className="font-headline font-bold text-sm sm:text-base uppercase tracking-widest text-primary flex items-center gap-3">
              <span className="w-6 h-[2px] bg-tertiary-container flex-shrink-0"></span>
              Featured Boost
            </h2>
            <span className="text-tertiary font-bold text-[10px] tracking-widest uppercase italic">Premium</span>
          </div>

          <div className="lg:hidden flex flex-col gap-4 px-4 sm:px-8">
            {featured.map((event) => (
              <EventCard
                key={event.slug}
                id={event.slug}
                title={event.title}
                dateStr={new Date(event.date_start).toLocaleDateString("de-DE", { day: "numeric", month: "short" })}
                town={toDisplayTown(event.town)}
                description={event.description ?? ""}
                imageUrl={event.image_url ?? ""}
                isFeatured={true}
                variant="directory"
              />
            ))}
          </div>

          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8 px-12">
            {featured.map((event) => (
              <EventCard
                key={event.slug}
                id={event.slug}
                title={event.title}
                dateStr={new Date(event.date_start).toLocaleDateString("de-DE", { day: "numeric", month: "short" })}
                town={toDisplayTown(event.town)}
                description={event.description ?? ""}
                imageUrl={event.image_url ?? ""}
                isFeatured={true}
                variant="directory"
              />
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
        </div>

        {upcoming.length === 0 && (
          <p className="text-on-surface-variant text-sm py-8 text-center">
            Keine Termine gefunden.
          </p>
        )}

        <div className="flex flex-col gap-2 lg:gap-3">
          {upcoming.map((event) => {
            const date = new Date(event.date_start);
            return (
              <Link
                key={event.slug}
                href={`/events/${event.slug}`}
                className="group bg-surface-container-lowest flex items-stretch hover:bg-surface-bright transition-colors overflow-hidden"
              >
                <div className="w-20 sm:w-28 lg:w-36 flex-shrink-0 self-stretch">
                  <img
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    alt={event.title}
                    src={event.image_url ?? ""}
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center px-3 sm:px-5 lg:px-8 py-3 lg:py-4">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <TownTag town={toDisplayTown(event.town)} />
                    {event.category && (
                      <span className="text-secondary font-bold text-[9px] sm:text-[10px] tracking-widest uppercase">
                        {event.category}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm sm:text-base lg:text-lg font-headline font-bold text-primary leading-tight line-clamp-1">
                    {event.title}
                  </h4>
                  <p className="text-on-surface-variant text-[10px] sm:text-xs mt-0.5 line-clamp-1">
                    {event.venue ?? toDisplayTown(event.town)} · {date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} Uhr
                  </p>
                </div>
                <div className="flex-shrink-0 flex flex-col sm:flex-row items-center gap-2 sm:gap-6 pr-3 sm:pr-5 lg:pr-8 py-3">
                  <div className="text-center sm:text-right">
                    <span className="block font-black text-base sm:text-xl text-primary leading-none">
                      {date.getDate().toString().padStart(2, "0")}
                    </span>
                    <span className="block text-[9px] uppercase font-bold text-on-surface-variant">
                      {date.toLocaleDateString("de-DE", { month: "short" }).toUpperCase().replace(".", "")}
                    </span>
                  </div>
                  <button className="flex items-center gap-1 border border-outline-variant/20 px-2 sm:px-4 py-2 sm:py-2.5 text-[9px] font-bold uppercase tracking-wide hover:bg-primary hover:text-white transition-all whitespace-nowrap">
                    <span className="material-symbols-outlined text-xs sm:text-sm">calendar_today</span>
                    <span className="hidden sm:inline ml-1">Kalender</span>
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FAB — Veranstaltung einreichen */}
      <Link
        href="/events/einreichen"
        className="fixed bottom-6 right-6 z-50 signature-gradient text-on-secondary px-5 py-3 shadow-lg flex items-center gap-2 font-black uppercase text-[11px] tracking-widest hover:brightness-110 transition-all"
      >
        <span className="material-symbols-outlined text-lg">event</span>
        Einreichen
      </Link>

    </main>
  );
}
