import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";

const townLabels: Record<string, string> = {
  raunheim: "Raunheim", kelsterbach: "Kelsterbach", ruesselsheim: "Rüsselsheim",
};

const statusColors: Record<string, string> = {
  active: "bg-secondary/10 text-secondary",
  pending: "bg-tertiary/10 text-tertiary",
  expired: "bg-outline/10 text-on-surface-variant",
  rejected: "bg-error/10 text-error",
};

export default async function AdminJobsPage() {
  const { data: jobs } = await supabaseAdmin
    .from("jobs")
    .select("id, title, company_name, town, job_type, status, is_featured")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 lg:p-12">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Verwaltung</p>
          <h1 className="text-3xl font-headline font-black tracking-tighter text-primary">Stellenanzeigen</h1>
          <p className="text-on-surface-variant text-sm mt-1">{jobs?.length ?? 0} Einträge</p>
        </div>
        <Link href="/admin/jobs/new" className="signature-gradient text-on-secondary px-5 py-2.5 font-bold uppercase text-xs tracking-widest hover:brightness-110 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>Neu
        </Link>
      </div>

      <div className="flex flex-col gap-0.5">
        {jobs?.length === 0 && (
          <div className="bg-surface-container-lowest p-12 text-center rounded-2xl border-2 border-dashed border-outline-variant/10">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/20 mb-3 block">search_off</span>
            <p className="text-on-surface-variant text-sm font-medium">Noch keine Stellenanzeigen vorhanden.</p>
          </div>
        )}
        {jobs?.map((j) => (
          <div key={j.id} className="flex items-center gap-4 px-4 sm:px-6 py-4 border border-outline-variant/5 hover:border-outline-variant/20 hover:shadow-sm transition-all bg-surface-container-lowest rounded-xl mb-1 group">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <p className="font-black text-primary text-sm tracking-tight group-hover:text-secondary transition-colors truncate">{j.title}</p>
                {j.is_featured && (
                  <span className="text-[9px] font-black uppercase tracking-wider text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-md flex-shrink-0">
                    Boost
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest">{j.company_name}</p>
                <span className="w-1 h-1 rounded-full bg-outline-variant/30" />
                <p className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest">{townLabels[j.town] ?? j.town}</p>
                <span className="w-1 h-1 rounded-full bg-outline-variant/30" />
                <p className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest">{j.job_type}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex flex-col items-end">
                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${statusColors[j.status] ?? "bg-outline/10 text-on-surface-variant"}`}>
                  {j.status}
                </span>
              </div>
              <Link
                href={`/admin/jobs/${j.id}/edit`}
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
