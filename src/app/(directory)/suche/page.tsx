import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { toDisplayTown } from "@/lib/towns";

export default async function SuchePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; town?: string }>;
}) {
  const { q, town } = await searchParams;
  const query = q?.trim() ?? "";
  const townFilter = town?.trim().toLowerCase();

  if (!query) {
    return (
      <main className="px-4 sm:px-8 lg:px-12 py-16 w-full">
        <h1 className="text-3xl font-headline font-black tracking-tighter text-primary mb-4">Suche</h1>
        <p className="text-on-surface-variant text-sm">Bitte Suchbegriff eingeben.</p>
      </main>
    );
  }

  const like = `%${query}%`;

  let bizQuery = supabase
      .from("businesses")
      .select("id, slug, name, category, town, tier")
      .eq("status", "active")
      .ilike("name", like)
      .limit(10);
      
  let evtQuery = supabase
      .from("events")
      .select("id, slug, title, town, date_start, category")
      .eq("status", "active")
      .ilike("title", like)
      .limit(10);
      
  let newsQuery = supabase
      .from("articles")
      .select("id, slug, title, towns, published_at")
      .eq("status", "published")
      .or(`title.ilike.${like},excerpt.ilike.${like}`)
      .limit(10);

  if (townFilter) {
    bizQuery = bizQuery.eq("town", townFilter);
    evtQuery = evtQuery.eq("town", townFilter);
    newsQuery = newsQuery.contains("towns", [townFilter]);
  }

  const [{ data: businesses }, { data: events }, { data: news }] = await Promise.all([
    bizQuery,
    evtQuery,
    newsQuery,
  ]);

  const total = (businesses?.length ?? 0) + (events?.length ?? 0) + (news?.length ?? 0);

  return (
    <main className="px-4 sm:px-8 lg:px-12 py-8 sm:py-12 w-full">
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Suchergebnisse</p>
        <h1 className="text-2xl sm:text-3xl font-headline font-black tracking-tighter text-primary mb-1">
          „{query}“
        </h1>
        <p className="text-on-surface-variant text-sm">{total} Ergebnis{total !== 1 ? "se" : ""} gefunden</p>
      </div>

      {total === 0 && (
        <div className="bg-surface-container-lowest p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3 block">search_off</span>
          <p className="text-on-surface-variant text-sm">Keine Ergebnisse für „{query}“.</p>
        </div>
      )}

      {(businesses?.length ?? 0) > 0 && (
        <section className="mb-6">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">storefront</span>
            Gewerbe ({businesses!.length})
          </h2>
          <div className="flex flex-col gap-0">
            {businesses!.map((b) => (
              <Link
                key={b.id}
                href={`/gewerbe/${b.slug}`}
                className="flex items-center gap-4 px-5 py-4 bg-surface-container-lowest border-b border-outline-variant/10 last:border-b-0 hover:bg-surface-container-low transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-primary text-sm truncate">{b.name}</p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">
                    {b.category} · {toDisplayTown(b.town)}
                  </p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-lg flex-shrink-0">arrow_forward</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {(events?.length ?? 0) > 0 && (
        <section className="mb-6">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">event</span>
            Veranstaltungen ({events!.length})
          </h2>
          <div className="flex flex-col gap-0">
            {events!.map((e) => (
              <Link
                key={e.id}
                href={`/events/${e.slug}`}
                className="flex items-center gap-4 px-5 py-4 bg-surface-container-lowest border-b border-outline-variant/10 last:border-b-0 hover:bg-surface-container-low transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-primary text-sm truncate">{e.title}</p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">
                    {toDisplayTown(e.town)}
                    {e.date_start && ` · ${new Date(e.date_start).toLocaleDateString("de-DE")}`}
                  </p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-lg flex-shrink-0">arrow_forward</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {(news?.length ?? 0) > 0 && (
        <section className="mb-6">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">newspaper</span>
            News ({news!.length})
          </h2>
          <div className="flex flex-col gap-0">
            {news!.map((n) => (
              <Link
                key={n.id}
                href={`/news/${n.slug}`}
                className="flex items-center gap-4 px-5 py-4 bg-surface-container-lowest border-b border-outline-variant/10 last:border-b-0 hover:bg-surface-container-low transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-primary text-sm truncate">{n.title}</p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">
                    {Array.isArray(n.towns) ? n.towns.join(", ") : ""}
                    {n.published_at && ` · ${new Date(n.published_at).toLocaleDateString("de-DE")}`}
                  </p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-lg flex-shrink-0">arrow_forward</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
