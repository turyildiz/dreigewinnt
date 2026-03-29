import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function AdminGewerbePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const tierPriority: Record<string, number> = { premium: 1, standard: 2, free: 3 };

  let query = supabaseAdmin
    .from("businesses")
    .select("id, slug, name, category, town, tier, status, is_spotlight");

  if (q) query = query.ilike("name", `%${q}%`);

  const { data: raw } = await query;

  const businesses = raw?.sort((a, b) => {
    if (a.is_spotlight !== b.is_spotlight) return a.is_spotlight ? -1 : 1;
    const tp = (tierPriority[a.tier] ?? 9) - (tierPriority[b.tier] ?? 9);
    if (tp !== 0) return tp;
    return a.name.localeCompare(b.name, "de");
  });

  const statusColors: Record<string, string> = {
    active: "bg-secondary/10 text-secondary",
    pending: "bg-tertiary/10 text-tertiary",
    rejected: "bg-error/10 text-error",
    suspended: "bg-outline/10 text-on-surface-variant",
  };

  const tierLabels: Record<string, string> = {
    free: "Basis",
    standard: "Standard",
    premium: "Premium",
  };

  const townLabels: Record<string, string> = {
    raunheim: "Raunheim",
    kelsterbach: "Kelsterbach",
    ruesselsheim: "Rüsselsheim",
  };

  return (
    <div className="p-5 sm:p-8 lg:p-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">
            Verwaltung
          </p>
          <h1 className="text-3xl font-headline font-black tracking-tighter text-primary">
            Gewerbe
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            {businesses?.length ?? 0} Einträge{q ? ` für „${q}"` : ""}
          </p>
        </div>
        <Link
          href="/admin/gewerbe/new"
          className="signature-gradient text-on-secondary px-5 py-2.5 font-bold uppercase text-xs tracking-widest hover:brightness-110 transition-all flex items-center gap-2 flex-shrink-0"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Neu
        </Link>
      </div>

      {/* Search */}
      <form method="GET" className="mb-4">
        <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-3">
          <span className="material-symbols-outlined text-outline text-xl flex-shrink-0">search</span>
          <input
            name="q"
            type="text"
            defaultValue={q ?? ""}
            placeholder="Unternehmen suchen…"
            autoComplete="off"
            className="flex-1 bg-transparent text-sm text-primary placeholder:text-outline/50 outline-none font-medium"
          />
          {q && (
            <Link href="/admin/gewerbe" className="material-symbols-outlined text-outline hover:text-primary transition-colors text-xl">
              close
            </Link>
          )}
        </div>
      </form>

      {/* Table */}
      <div className="flex flex-col gap-0">
        {businesses?.length === 0 && (
          <div className="bg-surface-container-lowest p-8 text-center">
            <p className="text-on-surface-variant text-sm">
              {q ? `No results for "${q}".` : "No businesses yet."}
            </p>
          </div>
        )}
        {businesses?.map((b, i) => {
          const prev = businesses[i - 1];
          const isSpotlightHeader = b.is_spotlight && (!prev || !prev.is_spotlight);
          const isPremiumHeader = !b.is_spotlight && b.tier === "premium" && (!prev || prev.is_spotlight || prev.tier !== "premium");
          const isRestHeader = !b.is_spotlight && b.tier !== "premium" && (!prev || prev.is_spotlight || prev.tier === "premium");

          return (
            <div key={b.id}>
              {(isSpotlightHeader || isPremiumHeader || isRestHeader) && (
                <div className={`flex items-center gap-3 px-4 sm:px-6 py-2 mt-2 first:mt-0 ${isSpotlightHeader ? "bg-tertiary/5" : "bg-surface-container-low"}`}>
                  {isSpotlightHeader && <span className="material-symbols-outlined text-tertiary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>}
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isSpotlightHeader ? "text-tertiary" : "text-on-surface-variant/50"}`}>
                    {isSpotlightHeader ? "Top Partner (Spotlight)" : isPremiumHeader ? "Premium" : "Basis & Standard"}
                  </p>
                </div>
              )}
              <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-outline-variant/10 last:border-b-0 hover:bg-surface-container-low transition-colors bg-surface-container-lowest">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-primary text-sm truncate">{b.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                      {b.category} · {townLabels[b.town] ?? b.town}
                    </p>
                    <span className={`sm:hidden text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 ${statusColors[b.status] ?? "bg-outline/10 text-on-surface-variant"}`}>
                      {b.status}
                    </span>
                  </div>
                </div>
                <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                  {tierLabels[b.tier] ?? b.tier}
                </span>
                <span className={`hidden sm:inline text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${statusColors[b.status] ?? "bg-outline/10 text-on-surface-variant"}`}>
                  {b.status}
                </span>
                <Link
                  href={`/admin/gewerbe/${b.id}/edit`}
                  className="material-symbols-outlined text-xl text-on-surface-variant hover:text-primary transition-colors flex-shrink-0"
                >
                  edit
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
