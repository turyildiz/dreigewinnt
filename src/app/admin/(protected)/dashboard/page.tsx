import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";

async function getStats() {
  const [businesses, events, articles, jobs, queue] = await Promise.all([
    supabaseAdmin.from("businesses").select("id, status", { count: "exact" }),
    supabaseAdmin.from("events").select("id, status", { count: "exact" }),
    supabaseAdmin.from("articles").select("id, status", { count: "exact" }),
    supabaseAdmin.from("jobs").select("id, status", { count: "exact" }),
    supabaseAdmin
      .from("queue_items")
      .select("id", { count: "exact" })
      .eq("status", "pending"),
  ]);

  return {
    businesses: businesses.count ?? 0,
    events: events.count ?? 0,
    articles: articles.count ?? 0,
    jobs: jobs.count ?? 0,
    pendingQueue: queue.count ?? 0,
    activeBusinesses:
      businesses.data?.filter((b) => b.status === "active").length ?? 0,
    activeEvents:
      events.data?.filter((e) => e.status === "active").length ?? 0,
  };
}

const statCards = [
  {
    label: "Unternehmen",
    href: "/admin/gewerbe",
    icon: "storefront",
    color: "text-secondary",
    key: "businesses" as const,
    sub: "activeBusinesses" as const,
    subLabel: "aktiv",
  },
  {
    label: "Veranstaltungen",
    href: "/admin/events",
    icon: "event",
    color: "text-tertiary",
    key: "events" as const,
    sub: "activeEvents" as const,
    subLabel: "aktiv",
  },
  {
    label: "Nachrichten",
    href: "/admin/articles",
    icon: "newspaper",
    color: "text-primary",
    key: "articles" as const,
  },
  {
    label: "Stellen",
    href: "/admin/jobs",
    icon: "work",
    color: "text-secondary",
    key: "jobs" as const,
  },
];

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="p-5 sm:p-8 lg:p-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">
          Redaktion
        </p>
        <h1 className="text-3xl font-headline font-black tracking-tighter text-primary">
          Übersicht
        </h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-surface-container-lowest p-6 hover:bg-surface-bright transition-colors group"
          >
            <span
              className={`material-symbols-outlined text-2xl ${card.color} mb-3 block`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {card.icon}
            </span>
            <div className="text-3xl font-black text-primary mb-0.5">
              {stats[card.key]}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              {card.label}
            </div>
            {card.sub && (
              <div className="text-[10px] text-secondary font-medium mt-1">
                {stats[card.sub]} {card.subLabel}
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Pending queue alert */}
      {stats.pendingQueue > 0 && (
        <Link
          href="/admin/queue"
          className="flex items-center gap-4 bg-secondary/10 border border-secondary/20 px-6 py-4 mb-10 hover:bg-secondary/15 transition-colors"
        >
          <span
            className="material-symbols-outlined text-secondary text-2xl flex-shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            pending_actions
          </span>
          <div className="flex-1">
            <p className="font-bold text-primary text-sm">
              {stats.pendingQueue}{" "}
              {stats.pendingQueue === 1 ? "Eintrag" : "Einträge"} in der
              Warteschlange
            </p>
            <p className="text-xs text-on-surface-variant">
              Auf Freigabe wartend — jetzt prüfen
            </p>
          </div>
          <span className="material-symbols-outlined text-secondary">
            arrow_forward
          </span>
        </Link>
      )}

      {/* Quick actions */}
      <div>
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">
          Schnellzugriff
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/gewerbe/new"
            className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2.5 text-sm font-bold text-primary hover:bg-surface-bright transition-colors"
          >
            <span className="material-symbols-outlined text-base text-secondary">
              add
            </span>
            Neues Unternehmen
          </Link>
          <Link
            href="/admin/events/new"
            className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2.5 text-sm font-bold text-primary hover:bg-surface-bright transition-colors"
          >
            <span className="material-symbols-outlined text-base text-secondary">
              add
            </span>
            Neue Veranstaltung
          </Link>
          <Link
            href="/admin/articles/new"
            className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2.5 text-sm font-bold text-primary hover:bg-surface-bright transition-colors"
          >
            <span className="material-symbols-outlined text-base text-secondary">
              add
            </span>
            Neuer Artikel
          </Link>
          <Link
            href="/admin/jobs/new"
            className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2.5 text-sm font-bold text-primary hover:bg-surface-bright transition-colors"
          >
            <span className="material-symbols-outlined text-base text-secondary">
              add
            </span>
            Neue Stellenanzeige
          </Link>
        </div>
      </div>
    </div>
  );
}
