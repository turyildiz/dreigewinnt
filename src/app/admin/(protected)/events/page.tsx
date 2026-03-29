import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";

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

export default async function AdminEventsPage() {
  const { data: events } = await supabaseAdmin
    .from("events")
    .select("id, slug, title, town, date_start, status, is_featured")
    .order("date_start", { ascending: false });

  return (
    <div className="p-8 lg:p-12">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Verwaltung</p>
          <h1 className="text-3xl font-headline font-black tracking-tighter text-primary">Veranstaltungen</h1>
          <p className="text-on-surface-variant text-sm mt-1">{events?.length ?? 0} Einträge</p>
        </div>
        <Link href="/admin/events/new" className="signature-gradient text-on-secondary px-5 py-2.5 font-bold uppercase text-xs tracking-widest hover:brightness-110 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>Neu
        </Link>
      </div>

      <div className="bg-surface-container-lowest">
        {events?.length === 0 && (
          <p className="text-on-surface-variant text-sm p-8 text-center">Noch keine Veranstaltungen eingetragen.</p>
        )}
        {events?.map((e) => (
          <div key={e.id} className="flex items-center gap-4 px-6 py-4 border-b border-outline-variant/10 last:border-b-0 hover:bg-surface-container-low transition-colors">
            <div className="flex-1 min-w-0">
              <p className="font-bold text-primary text-sm truncate flex items-center gap-2">
                {e.title}
                {e.is_featured && <span className="text-[9px] font-bold uppercase tracking-widest bg-tertiary/10 text-tertiary px-1.5 py-0.5">Featured</span>}
              </p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">
                {townLabels[e.town] ?? e.town} · {new Date(e.date_start).toLocaleDateString("de-DE")}
              </p>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${statusColors[e.status] ?? "bg-outline/10 text-on-surface-variant"}`}>
              {e.status}
            </span>
            <Link href={`/admin/events/${e.id}/edit`} className="material-symbols-outlined text-xl text-on-surface-variant hover:text-primary transition-colors">edit</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
