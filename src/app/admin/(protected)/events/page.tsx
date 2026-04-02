import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { AdminSearch } from "@/components/admin/AdminSearch";

const townLabels: Record<string, string> = {
  raunheim: "Raunheim",
  kelsterbach: "Kelsterbach",
  ruesselsheim: "Rüsselsheim",
};

const statusColors: Record<string, string> = {
  active: "bg-secondary/10 text-secondary",
  pending: "bg-tertiary/10 text-tertiary",
  expired: "bg-outline/10 text-on-surface-variant",
  rejected: "bg-error/10 text-error",
};

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  let query = supabaseAdmin
    .from("events")
    .select("id, slug, title, town, date_start, status, is_featured")
    .order("date_start", { ascending: false });

  if (q) query = query.ilike("title", `%${q}%`);

  const { data: events } = await query;

  return (
    <div className="p-5 sm:p-8 lg:p-12">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Verwaltung</p>
          <h1 className="text-3xl font-headline font-black tracking-tighter text-primary">Veranstaltungen</h1>
          <p className="text-on-surface-variant text-sm mt-1">{events?.length ?? 0} Einträge{q ? ` für „${q}"` : ""}</p>
        </div>
        <Link href="/admin/events/new" className="signature-gradient text-on-secondary px-5 py-2.5 font-bold uppercase text-xs tracking-widest hover:brightness-110 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>Neu
        </Link>
      </div>

      <AdminSearch placeholder="Veranstaltung suchen…" />

      <div className="flex flex-col gap-0.5">
        {events?.length === 0 && (
          <div className="bg-surface-container-lowest p-12 text-center rounded-2xl border-2 border-dashed border-outline-variant/10">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/20 mb-3 block">search_off</span>
            <p className="text-on-surface-variant text-sm font-medium">
              {q ? `Keine Ergebnisse für „${q}“` : "Noch keine Veranstaltungen eingetragen."}
            </p>
          </div>
        )}
        {events?.map((e) => (
          <div key={e.id} className="flex items-center gap-4 px-4 sm:px-6 py-4 border border-outline-variant/5 hover:border-outline-variant/20 hover:shadow-sm transition-all bg-surface-container-lowest rounded-xl mb-1 group">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <p className="font-black text-primary text-sm tracking-tight group-hover:text-secondary transition-colors truncate">{e.title}</p>
                {e.is_featured && (
                  <span className="text-[9px] font-black uppercase tracking-wider text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-md flex-shrink-0">
                    Featured
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest">{townLabels[e.town] ?? e.town}</p>
                <span className="w-1 h-1 rounded-full bg-outline-variant/30" />
                <p className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest">
                  {new Date(e.date_start).toLocaleDateString("de-DE")}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex flex-col items-end">
                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${statusColors[e.status] ?? "bg-outline/10 text-on-surface-variant"}`}>
                  {e.status}
                </span>
              </div>
              <Link
                href={`/admin/events/${e.id}/edit`}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container hover:bg-secondary hover:text-on-secondary transition-all"
              >
                <span className="material-symbols-outlined text-xl text-on-surface-variant group-hover:text-inherit">edit</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
