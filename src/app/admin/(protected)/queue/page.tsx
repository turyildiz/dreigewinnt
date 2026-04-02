import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { approveItem, rejectItem, reinstateItem } from "./actions";

function Row({ label, value, highlight }: { label: string; value?: string | null; highlight?: boolean }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-0.5">{label}</p>
      <p className={`text-sm ${highlight ? "font-black text-secondary" : "font-medium text-primary"}`}>{value}</p>
    </div>
  );
}

export default async function QueuePage({
  searchParams,
}: {
  searchParams: Promise<{ approved?: string; rejected?: string; tab?: string }>;
}) {
  const { approved, rejected: rejectedParam, tab } = await searchParams;
  const activeTab = tab === "rejected" ? "rejected" : "pending";

  const [{ data: businesses }, { data: events }, { data: jobs }] = await Promise.all([
    supabaseAdmin
      .from("businesses")
      .select("id, name, town, category, tier, address, phone, website, description, hero_image_url, email, created_at")
      .eq("status", activeTab)
      .order("created_at"),
    supabaseAdmin
      .from("events")
      .select("id, title, town, category, date_start, venue, description, organiser_name, organiser_email, image_url, is_featured, created_at")
      .eq("status", activeTab)
      .order("created_at"),
    supabaseAdmin
      .from("jobs")
      .select("id, title, company_name, town, job_type, category, salary_range, contact_email, contact_phone, website_url, description, image_url, is_featured, created_at")
      .eq("status", activeTab)
      .order("created_at"),
  ]);

  // Counts for tab badges
  const [{ count: pendingBiz }, { count: pendingEv }, { count: pendingJobs }] = await Promise.all([
    supabaseAdmin.from("businesses").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabaseAdmin.from("events").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabaseAdmin.from("jobs").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ]);
  const pendingCount = (pendingBiz ?? 0) + (pendingEv ?? 0) + (pendingJobs ?? 0);

  const totalItems = (businesses?.length ?? 0) + (events?.length ?? 0) + (jobs?.length ?? 0);

  return (
    <div className="p-5 sm:p-8 lg:p-12">

      {approved && (
        <div className="flex items-center gap-3 bg-secondary/10 border border-secondary/20 px-5 py-4 mb-6">
          <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <p className="text-sm font-bold text-secondary">Eintrag freigeschaltet und veröffentlicht.</p>
        </div>
      )}
      {rejectedParam && (
        <div className="flex items-center gap-3 bg-error/10 border border-error/20 px-5 py-4 mb-6">
          <span className="material-symbols-outlined text-error">cancel</span>
          <p className="text-sm font-bold text-error">Eintrag abgelehnt.</p>
        </div>
      )}

      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Verwaltung</p>
        <h1 className="text-3xl font-headline font-black tracking-tighter text-primary">Warteschlange</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-outline-variant/15 mb-6">
        <Link
          href="/admin/queue"
          className={`flex items-center gap-2 px-5 py-3 text-[11px] font-black uppercase tracking-widest border-b-2 transition-colors ${
            activeTab === "pending"
              ? "border-secondary text-secondary"
              : "border-transparent text-on-surface-variant hover:text-primary"
          }`}
        >
          Ausstehend
          {pendingCount > 0 && (
            <span className="bg-secondary text-on-secondary text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
              {pendingCount}
            </span>
          )}
        </Link>
        <Link
          href="/admin/queue?tab=rejected"
          className={`flex items-center gap-2 px-5 py-3 text-[11px] font-black uppercase tracking-widest border-b-2 transition-colors ${
            activeTab === "rejected"
              ? "border-error text-error"
              : "border-transparent text-on-surface-variant hover:text-primary"
          }`}
        >
          Abgelehnt
        </Link>
      </div>

      {totalItems === 0 ? (
        <div className="bg-surface-container-lowest p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <p className="text-on-surface-variant text-sm">Keine ausstehenden Einträge.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">

          {/* Pending businesses */}
          {businesses?.map((biz) => (
            <div key={biz.id} className="bg-surface-container-lowest">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-outline-variant/10">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-primary truncate">{biz.name}</p>
                  <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-wider mt-0.5">
                    Unternehmen · {new Date(biz.created_at).toLocaleString("de-DE")}
                  </p>
                </div>
              </div>
              <div className="px-6 py-5 grid grid-cols-2 gap-x-8 gap-y-3">
                <Row label="Stadt" value={biz.town} />
                <Row label="Kategorie" value={biz.category} />
                <Row label="Paket" value={biz.tier} highlight />
                <Row label="Adresse" value={biz.address} />
                <Row label="Telefon" value={biz.phone} />
                <Row label="Website" value={biz.website} />
                <Row label="Kontakt-E-Mail" value={biz.email} />
                {biz.description && (
                  <div className="col-span-2"><Row label="Beschreibung" value={biz.description} /></div>
                )}
                {biz.hero_image_url && (
                  <div className="col-span-2 mt-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={biz.hero_image_url} alt="Titelbild" className="h-32 w-auto object-cover" />
                  </div>
                )}
              </div>
              <QueueActions id={biz.id} table="businesses" activeTab={activeTab} />
            </div>
          ))}

          {/* Events */}
          {events?.map((ev) => {
            const dateStr = ev.date_start
              ? new Date(ev.date_start).toLocaleString("de-DE", {
                  day: "2-digit", month: "long", year: "numeric",
                  hour: "2-digit", minute: "2-digit",
                })
              : null;

            return (
              <div key={ev.id} className="bg-surface-container-lowest">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-outline-variant/10">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>event</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-primary truncate">{ev.title}</p>
                    <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-wider mt-0.5">
                      Veranstaltung · {new Date(ev.created_at).toLocaleString("de-DE")}
                    </p>
                  </div>
                </div>
                <div className="px-6 py-5 grid grid-cols-2 gap-x-8 gap-y-3">
                  <Row label="Stadt" value={ev.town} />
                  <Row label="Kategorie" value={ev.category} />
                  <Row label="Datum" value={dateStr} />
                  <Row label="Veranstaltungsort" value={ev.venue} />
                  <Row label="Veranstalter" value={ev.organiser_name} />
                  <Row label="E-Mail" value={ev.organiser_email} />
                  {ev.is_featured && <Row label="Featured Boost" value="Ja (+€12)" highlight />}
                  {ev.description && (
                    <div className="col-span-2"><Row label="Beschreibung" value={ev.description} /></div>
                  )}
                  {ev.image_url && (
                    <div className="col-span-2 mt-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={ev.image_url} alt="Veranstaltungsbild" className="h-32 w-auto object-cover" />
                    </div>
                  )}
                </div>
                <QueueActions id={ev.id} table="events" activeTab={activeTab} />
              </div>
            );
          })}

          {/* Jobs */}
          {jobs?.map((job) => (
            <div key={job.id} className="bg-surface-container-lowest">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-outline-variant/10">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>work</span>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-primary truncate">{job.title}</p>
                  <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-wider mt-0.5">
                    Stelle · {new Date(job.created_at).toLocaleString("de-DE")}
                  </p>
                </div>
              </div>
              <div className="px-6 py-5 grid grid-cols-2 gap-x-8 gap-y-3">
                <Row label="Unternehmen" value={job.company_name} />
                <Row label="Stadt" value={job.town} />
                <Row label="Anstellungsart" value={job.job_type} />
                <Row label="Kategorie" value={job.category} />
                <Row label="Gehalt" value={job.salary_range} />
                <Row label="E-Mail" value={job.contact_email} />
                <Row label="Telefon" value={job.contact_phone} />
                <Row label="Website" value={job.website_url} />
                {job.is_featured && <Row label="Featured Boost" value="Ja (+€12)" highlight />}
                {job.description && (
                  <div className="col-span-2"><Row label="Beschreibung" value={job.description} /></div>
                )}
                {job.image_url && (
                  <div className="col-span-2 mt-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={job.image_url} alt="Stellenbild" className="h-32 w-auto object-cover" />
                  </div>
                )}
              </div>
              <QueueActions id={job.id} table="jobs" activeTab={activeTab} />
            </div>
          ))}

        </div>
      )}
    </div>
  );
}

function QueueActions({ id, table, activeTab }: { id: string; table: string; activeTab: string }) {
  if (activeTab === "rejected") {
    return (
      <div className="flex items-center gap-3 px-6 py-4 border-t border-outline-variant/10 bg-surface-container-low/50">
        <form action={reinstateItem}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="table" value={table} />
          <button type="submit"
            className="flex items-center gap-2 px-5 py-2.5 border border-secondary/30 text-secondary font-black uppercase text-[10px] tracking-widest hover:bg-secondary/5 transition-all">
            <span className="material-symbols-outlined text-sm">undo</span>
            Zurück in Warteschlange
          </button>
        </form>
        <form action={approveItem}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="table" value={table} />
          <button type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-on-secondary font-black uppercase text-[10px] tracking-widest hover:brightness-110 transition-all">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Direkt freischalten
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-6 py-4 border-t border-outline-variant/10 bg-surface-container-low/50">
      <form action={approveItem}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="table" value={table} />
        <button type="submit"
          className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-on-secondary font-black uppercase text-[10px] tracking-widest hover:brightness-110 transition-all">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          Freischalten
        </button>
      </form>
      <form action={rejectItem}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="table" value={table} />
        <button type="submit"
          className="flex items-center gap-2 px-5 py-2.5 border border-error/30 text-error font-black uppercase text-[10px] tracking-widest hover:bg-error/5 transition-all">
          <span className="material-symbols-outlined text-sm">cancel</span>
          Ablehnen
        </button>
      </form>
    </div>
  );
}
