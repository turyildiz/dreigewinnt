import Link from "next/link";
import { TownTag } from "@/components/ui/TownTag";
import { supabase } from "@/lib/supabase";
import { toDisplayTown } from "@/lib/towns";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", id)
    .eq("status", "active")
    .single();

  if (!event) {
    return (
      <main className="px-4 sm:px-8 lg:px-12 py-20 text-center">
        <p className="text-on-surface-variant">Veranstaltung nicht gefunden.</p>
        <Link href="/events" className="text-secondary font-bold text-sm mt-4 inline-block hover:underline">
          ← Zurück zu Veranstaltungen
        </Link>
      </main>
    );
  }

  const date = new Date(event.date_start);
  const dateEnd = event.date_end ? new Date(event.date_end) : null;
  const displayTown = toDisplayTown(event.town);

  const dateStr = date.toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });
  const timeStr = dateEnd
    ? `${date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} – ${dateEnd.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} Uhr`
    : `${date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} Uhr`;

  return (
    <main className="w-full pb-16">

      {/* ── Hero Image ── */}
      <div className="relative h-[45vw] min-h-[260px] max-h-[520px] overflow-hidden bg-surface-container-high">
        {event.image_url ? (
          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-outline/30 text-6xl">event</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/10 to-transparent" />

        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-12 flex items-center gap-2 flex-wrap">
          <TownTag town={displayTown} />
          {event.is_featured && (
            <span className="bg-tertiary text-on-tertiary px-2 py-1 text-[9px] font-bold uppercase tracking-widest">
              Featured Boost
            </span>
          )}
        </div>

        <div className="absolute bottom-0 left-4 sm:left-6 lg:left-12 bg-surface-container-lowest px-5 py-3 shadow-lg">
          <span className="block text-secondary font-black text-2xl sm:text-3xl leading-none">
            {date.getDate().toString().padStart(2, "0")}
          </span>
          <span className="block text-on-surface-variant text-[9px] uppercase font-bold tracking-widest">
            {date.toLocaleDateString("de-DE", { month: "long", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-4 sm:px-8 lg:px-12 pt-8 lg:pt-12">

        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors mb-6 lg:mb-8"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Alle Veranstaltungen
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">

          {/* ── Left: main content ── */}
          <div className="lg:col-span-2">
            {event.category && (
              <span className="text-secondary font-bold text-[10px] tracking-widest uppercase block mb-3">
                {event.category}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-black tracking-tighter text-primary leading-tight mb-6">
              {event.title}
            </h1>
            {event.description && (
              <p className="text-on-surface-variant text-base sm:text-lg leading-relaxed mb-4">
                {event.description}
              </p>
            )}
          </div>

          {/* ── Right: info sidebar ── */}
          <aside className="flex flex-col gap-4">

            <div className="bg-surface-container-lowest border border-outline-variant/10 p-5 lg:p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Datum & Zeit</p>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-xl flex-shrink-0">calendar_today</span>
                <div>
                  <p className="font-bold text-primary text-sm">{dateStr}</p>
                  <p className="text-on-surface-variant text-xs mt-0.5">{timeStr}</p>
                </div>
              </div>
            </div>

            {(event.venue || event.address) && (
              <div className="bg-surface-container-lowest border border-outline-variant/10 p-5 lg:p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Veranstaltungsort</p>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-xl flex-shrink-0">location_on</span>
                  <div>
                    {event.venue && <p className="font-bold text-primary text-sm">{event.venue}</p>}
                    {event.address && <p className="text-on-surface-variant text-xs mt-0.5">{event.address}</p>}
                  </div>
                </div>
              </div>
            )}

            {(event.organiser_name || event.organiser_email) && (
              <div className="bg-surface-container-lowest border border-outline-variant/10 p-5 lg:p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Veranstalter</p>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-xl flex-shrink-0">group</span>
                  <div>
                    {event.organiser_name && <p className="font-bold text-primary text-sm">{event.organiser_name}</p>}
                    {event.organiser_email && <p className="text-on-surface-variant text-xs mt-0.5">{event.organiser_email}</p>}
                  </div>
                </div>
              </div>
            )}

            <a
              href={`/api/events/${event.slug}/calendar.ics`}
              className="signature-gradient text-on-secondary flex items-center justify-center gap-2 py-4 font-bold text-[11px] uppercase tracking-widest hover:brightness-110 transition-all"
            >
              <span className="material-symbols-outlined text-lg">event_available</span>
              Zum Kalender hinzufügen
            </a>

          </aside>
        </div>
      </div>

    </main>
  );
}
