import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { AdminSearch } from "@/components/admin/AdminSearch";
import { getSportLabel } from "@/lib/constants";

export default async function AdminVereinePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  let query = supabaseAdmin
    .from("clubs")
    .select("id, slug, name, sport, town, tier, status, is_spotlight");

  if (q) query = query.ilike("name", `%${q}%`);

  const { data: raw } = await query;

  const clubs = raw?.sort((a, b) => {
    if (a.is_spotlight !== b.is_spotlight) return a.is_spotlight ? -1 : 1;
    return a.name.localeCompare(b.name, "de");
  });

  const statusColors: Record<string, string> = {
    approved: "bg-secondary/10 text-secondary",
    active: "bg-secondary/10 text-secondary",
    pending: "bg-tertiary/10 text-tertiary",
    rejected: "bg-error/10 text-error",
    suspended: "bg-outline/10 text-on-surface-variant",
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
            Sport
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            {clubs?.length ?? 0} Einträge{q ? ` für „${q}"` : ""}
          </p>
        </div>
        <Link
          href="/admin/sport/new"
          className="signature-gradient text-on-secondary px-5 py-2.5 font-bold uppercase text-xs tracking-widest hover:brightness-110 transition-all flex items-center gap-2 flex-shrink-0"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Neu
        </Link>
      </div>

      <AdminSearch placeholder="Verein suchen…" />

      {/* Table */}
      <div className="flex flex-col gap-0.5">
        {clubs?.length === 0 && (
          <div className="bg-surface-container-lowest p-12 text-center rounded-2xl border-2 border-dashed border-outline-variant/10">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/20 mb-3 block">search_off</span>
            <p className="text-on-surface-variant text-sm font-medium">
              {q ? `Keine Ergebnisse für „${q}"` : "Noch keine Einträge vorhanden."}
            </p>
          </div>
        )}
        {clubs?.map((club, i) => {
          const prev = clubs[i - 1];
          const isSpotlightHeader = club.is_spotlight && (!prev || !prev.is_spotlight);
          const isRestHeader = !club.is_spotlight && (!prev || prev.is_spotlight);

          return (
            <div key={club.id}>
              {(isSpotlightHeader || isRestHeader) && (
                <div className="px-4 py-2 mt-4 mb-2 first:mt-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] opacity-40 flex items-center gap-2">
                    {isSpotlightHeader ? (
                      <>
                        <span className="material-symbols-outlined text-xs text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        Spotlight Clubs
                      </>
                    ) : "Alle Clubs"}
                  </p>
                </div>
              )}
              <div className="flex items-center gap-4 px-4 sm:px-6 py-4 border border-outline-variant/5 hover:border-outline-variant/20 hover:shadow-sm transition-all bg-surface-container-lowest rounded-xl mb-1 group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-black text-primary text-sm tracking-tight group-hover:text-secondary transition-colors">{club.name}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest">
                      {getSportLabel(club.sport)}
                    </p>
                    <span className="w-1 h-1 rounded-full bg-outline-variant/30" />
                    <p className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest">
                      {townLabels[club.town] ?? club.town}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${statusColors[club.status] ?? "bg-outline/10 text-on-surface-variant"}`}>
                      {club.status}
                    </span>
                  </div>
                  <Link
                    href={`/admin/sport/${club.id}/edit`}
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
