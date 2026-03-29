import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function AdminGewerbePage() {
  const { data: businesses } = await supabaseAdmin
    .from("businesses")
    .select("id, slug, name, category, town, tier, status")
    .order("name");

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
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">
            Verwaltung
          </p>
          <h1 className="text-3xl font-headline font-black tracking-tighter text-primary">
            Gewerbe
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            {businesses?.length ?? 0} Einträge
          </p>
        </div>
        <Link
          href="/admin/gewerbe/new"
          className="signature-gradient text-on-secondary px-5 py-2.5 font-bold uppercase text-xs tracking-widest hover:brightness-110 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Neu
        </Link>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest">
        {businesses?.length === 0 && (
          <p className="text-on-surface-variant text-sm p-8 text-center">
            Noch keine Unternehmen eingetragen.
          </p>
        )}
        {businesses?.map((b) => (
          <div
            key={b.id}
            className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-outline-variant/10 last:border-b-0 hover:bg-surface-container-low transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="font-bold text-primary text-sm truncate">{b.name}</p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                  {b.category} · {townLabels[b.town] ?? b.town}
                </p>
                <span
                  className={`sm:hidden text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 ${statusColors[b.status] ?? "bg-outline/10 text-on-surface-variant"}`}
                >
                  {b.status}
                </span>
              </div>
            </div>
            <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              {tierLabels[b.tier] ?? b.tier}
            </span>
            <span
              className={`hidden sm:inline text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${statusColors[b.status] ?? "bg-outline/10 text-on-surface-variant"}`}
            >
              {b.status}
            </span>
            <Link
              href={`/admin/gewerbe/${b.id}/edit`}
              className="material-symbols-outlined text-xl text-on-surface-variant hover:text-primary transition-colors flex-shrink-0"
            >
              edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
