import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { AdminSearch } from "@/components/admin/AdminSearch";

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

      <AdminSearch placeholder="Unternehmen suchen…" />

      {/* Table */}
      <div className="flex flex-col gap-0.5">
        {businesses?.length === 0 && (
          <div className="bg-surface-container-lowest p-12 text-center rounded-2xl border-2 border-dashed border-outline-variant/10">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/20 mb-3 block">search_off</span>
            <p className="text-on-surface-variant text-sm font-medium">
              {q ? `Keine Ergebnisse für „${q}“` : "Noch keine Einträge vorhanden."}
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
                <div className={`px-4 py-2 mt-4 mb-2 first:mt-0`}>
                  <p className={`text-[10px] font-black uppercase tracking-[0.15em] opacity-40 flex items-center gap-2`}>
                    {isSpotlightHeader ? (
                      <>
                        <span className="material-symbols-outlined text-xs text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        Top Partner (Spotlight)
                      </>
                    ) : isPremiumHeader ? "Premium Partner" : "Standard & Basis"}
                  </p>
                </div>
              )}
              <div className="flex items-center gap-4 px-4 sm:px-6 py-4 border border-outline-variant/5 hover:border-outline-variant/20 hover:shadow-sm transition-all bg-surface-container-lowest rounded-xl mb-1 group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-black text-primary text-sm tracking-tight group-hover:text-secondary transition-colors">{b.name}</p>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      b.tier === "premium" ? "bg-tertiary/10 text-tertiary" : 
                      b.tier === "standard" ? "bg-primary/10 text-primary" : 
                      "bg-outline-variant/20 text-on-surface-variant/60"
                    }`}>
                      {tierLabels[b.tier] ?? b.tier}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest">
                      {b.category}
                    </p>
                    <span className="w-1 h-1 rounded-full bg-outline-variant/30" />
                    <p className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest">
                      {townLabels[b.town] ?? b.town}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${statusColors[b.status] ?? "bg-outline/10 text-on-surface-variant"}`}>
                      {b.status}
                    </span>
                  </div>
                  <Link
                    href={`/admin/gewerbe/${b.id}/edit`}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container hover:bg-secondary hover:text-on-secondary transition-all"
                  >
                    <span className="material-symbols-outlined text-xl">edit</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
