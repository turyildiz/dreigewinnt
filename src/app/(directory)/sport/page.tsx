import Link from "next/link";
import { TownTag } from "@/components/ui/TownTag";
import { supabase } from "@/lib/supabase";
import { toDisplayTown } from "@/lib/towns";
import { getSportIcon, getSportLabel } from "@/lib/constants";

const PAGE_SIZE = 50;

export default async function VereinePage({
  searchParams,
}: {
  searchParams: Promise<{ town?: string; sport?: string; search?: string; page?: string }>;
}) {
  const { town, sport, search, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // Featured clubs — 6 random for page 1
  let featuredQuery = supabase
    .from("clubs")
    .select("id, slug, name, sport, town, tier, description, hero_image_url, logo_url")
    .eq("status", "approved")
    .limit(6);

  if (town) featuredQuery = featuredQuery.eq("town", town);
  if (sport) featuredQuery = featuredQuery.ilike("sport", `%${sport}%`);
  if (search) featuredQuery = featuredQuery.ilike("name", `%${search}%`);

  // All clubs — paginated
  let othersQuery = supabase
    .from("clubs")
    .select("id, slug, name, sport, town, tier, description, hero_image_url, logo_url", { count: "exact" })
    .eq("status", "approved")
    .order("name")
    .range(from, to);

  if (town) othersQuery = othersQuery.eq("town", town);
  if (sport) othersQuery = othersQuery.ilike("sport", `%${sport}%`);
  if (search) othersQuery = othersQuery.ilike("name", `%${search}%`);

  const [{ data: featuredRaw }, { data: others, count: totalOthers }] = await Promise.all([
    featuredQuery,
    othersQuery,
  ]);

  // Shuffle featured clubs for randomness
  const spotlight = featuredRaw ? [...featuredRaw].sort(() => Math.random() - 0.5) : [];

  const totalPages = Math.ceil((totalOthers ?? 0) / PAGE_SIZE);
  const townLabel = town ? toDisplayTown(town) : null;

  function pageHref(p: number) {
    const params = new URLSearchParams();
    if (town) params.set("town", town);
    if (sport) params.set("sport", sport);
    if (search) params.set("search", search);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/sport${qs ? `?${qs}` : ""}`;
  }

  return (
    <main className="w-full">

      {/* ── Page Header ── */}
      <header className="px-4 sm:px-8 lg:px-12 pt-6 lg:pt-14 pb-10 lg:pb-16">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {townLabel ? (
            <TownTag town={townLabel} />
          ) : (
            <span className="bg-surface-container-highest text-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">Region</span>
          )}
          {sport && (
            <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
              {getSportLabel(sport)}
            </span>
          )}
          <span className="text-on-surface-variant font-medium text-xs tracking-widest uppercase">
            Vereinsverzeichnis 2026
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-black tracking-tighter text-primary leading-none mb-4">
          Sport
        </h1>
        <p className="text-on-surface-variant text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed">
          {townLabel
            ? `Sport in ${townLabel} — aktive Clubs aus Ihrer Nachbarschaft.`
            : "Entdecken Sie die Sport der Region. Fußball, Volleyball, Wassersport und mehr."}
        </p>
      </header>

      {/* ── Spotlight Clubs ── */}
      {page === 1 && spotlight.length > 0 && (
        <section className="px-4 sm:px-8 lg:px-12 mb-16 lg:mb-20">
          <div className="flex items-center gap-4 mb-6 lg:mb-8">
            <h2 className="text-[12px] font-black tracking-[0.1em] text-secondary uppercase flex items-center gap-2 flex-shrink-0">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>sports</span>
              Entdecke Vereine
            </h2>
            <div className="flex-grow h-[1px] bg-secondary/20" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {spotlight.map((club) => (
              <Link
                key={club.slug}
                href={`/sport/${club.slug}`}
                className="group bg-surface-container-lowest border border-outline-variant/10 hover:shadow-lg transition-all duration-300 block"
              >
                <div className="h-44 sm:h-48 lg:h-52 overflow-hidden bg-surface-container-high">
                  {club.hero_image_url ? (
                    <img
                      src={club.hero_image_url}
                      alt={club.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-outline/30 text-5xl">{getSportIcon(club.sport)}</span>
                    </div>
                  )}
                </div>
                <div className="p-6 lg:p-8">
                  <span className="text-secondary font-bold text-[10px] tracking-widest uppercase">
                    {getSportLabel(club.sport)}
                  </span>
                  <h3 className="text-xl lg:text-2xl font-black tracking-tight text-primary mt-1 mb-3 group-hover:text-secondary transition-colors">
                    {club.name}
                  </h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-5 lg:mb-6">
                    {club.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <TownTag town={toDisplayTown(club.town)} />
                    <span className="material-symbols-outlined text-secondary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Alle Clubs ── */}
      <section className="px-4 sm:px-8 lg:px-12 pb-16">
        <div className="flex items-center justify-between mb-8 lg:mb-10 gap-3 flex-wrap">
          <h2 className="text-[12px] font-black tracking-[0.1em] text-primary uppercase">
            {townLabel ? `Clubs in ${townLabel}` : "Alle Clubs"}
            {totalOthers != null && (
              <span className="ml-2 text-on-surface-variant font-medium normal-case tracking-normal">
                ({totalOthers.toLocaleString("de-DE")})
              </span>
            )}
          </h2>
        </div>

        {(others?.length ?? 0) === 0 && (
          <p className="text-on-surface-variant text-sm py-8 text-center">
            Keine Clubs gefunden.
          </p>
        )}

        <div className="flex flex-col gap-2 lg:gap-3">
          {others?.map((club, index) => (
            <Link
              key={club.slug}
              href={`/sport/${club.slug}`}
              className={`group ${index % 2 === 0 ? "bg-surface-container-low" : "bg-white"} hover:bg-surface-bright p-4 sm:p-5 lg:p-6 flex items-center gap-4 sm:gap-6 lg:gap-8 transition-colors`}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-surface-container-highest flex-shrink-0 flex items-center justify-center overflow-hidden">
                {club.logo_url ? (
                  <img src={club.logo_url} alt={club.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-on-surface-variant text-xl lg:text-2xl">{getSportIcon(club.sport)}</span>
                )}
              </div>
              <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 items-center gap-2">
                <div className="col-span-2">
                  <h4 className="font-bold text-primary tracking-tight text-sm sm:text-base truncate">
                    {club.name}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-on-surface-variant uppercase tracking-wider mt-0.5">
                    {getSportLabel(club.sport)}
                  </p>
                </div>
                <div className="hidden sm:block">
                  <TownTag town={toDisplayTown(club.town)} />
                </div>
                <div className="hidden sm:flex justify-end">
                  <span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                    arrow_forward
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-10 gap-4">
            <Link
              href={pageHref(page - 1)}
              className={`flex items-center gap-2 px-5 py-3 text-[11px] font-black uppercase tracking-widest transition-colors ${
                page <= 1
                  ? "pointer-events-none opacity-30 bg-surface-container-low text-on-surface-variant"
                  : "bg-surface-container-low hover:bg-surface-container text-primary"
              }`}
              aria-disabled={page <= 1}
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Zurück
            </Link>

            <p className="text-xs text-on-surface-variant font-medium">
              Seite {page} von {totalPages}
            </p>

            <Link
              href={pageHref(page + 1)}
              className={`flex items-center gap-2 px-5 py-3 text-[11px] font-black uppercase tracking-widest transition-colors ${
                page >= totalPages
                  ? "pointer-events-none opacity-30 bg-surface-container-low text-on-surface-variant"
                  : "bg-surface-container-low hover:bg-surface-container text-primary"
              }`}
              aria-disabled={page >= totalPages}
            >
              Weiter
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
        )}
      </section>

      {/* FAB — Verein einreichen */}
      <Link
        href="/sport/einreichen"
        className="fixed bottom-6 right-6 z-50 signature-gradient text-on-secondary px-5 py-3 shadow-lg flex items-center gap-2 font-black uppercase text-[11px] tracking-widest hover:brightness-110 transition-all"
      >
        <span className="material-symbols-outlined text-lg">group_add</span>
        Verein eintragen
      </Link>

    </main>
  );
}
