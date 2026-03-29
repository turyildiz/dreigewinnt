import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";

const statusColors: Record<string, string> = {
  published: "bg-secondary/10 text-secondary",
  draft: "bg-outline/10 text-on-surface-variant",
};

export default async function AdminArticlesPage() {
  const { data: articles } = await supabaseAdmin
    .from("articles")
    .select("id, slug, title, towns, status, published_at")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 lg:p-12">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Verwaltung</p>
          <h1 className="text-3xl font-headline font-black tracking-tighter text-primary">Nachrichten</h1>
          <p className="text-on-surface-variant text-sm mt-1">{articles?.length ?? 0} Artikel</p>
        </div>
        <Link href="/admin/articles/new" className="signature-gradient text-on-secondary px-5 py-2.5 font-bold uppercase text-xs tracking-widest hover:brightness-110 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>Neu
        </Link>
      </div>

      <div className="bg-surface-container-lowest">
        {articles?.length === 0 && (
          <p className="text-on-surface-variant text-sm p-8 text-center">Noch keine Artikel vorhanden.</p>
        )}
        {articles?.map((a) => (
          <div key={a.id} className="flex items-center gap-4 px-6 py-4 border-b border-outline-variant/10 last:border-b-0 hover:bg-surface-container-low transition-colors">
            <div className="flex-1 min-w-0">
              <p className="font-bold text-primary text-sm truncate">{a.title}</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">
                {(a.towns as string[])?.join(", ")}
                {a.published_at && ` · ${new Date(a.published_at).toLocaleDateString("de-DE")}`}
              </p>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${statusColors[a.status] ?? "bg-outline/10 text-on-surface-variant"}`}>
              {a.status}
            </span>
            <Link href={`/admin/articles/${a.id}/edit`} className="material-symbols-outlined text-xl text-on-surface-variant hover:text-primary transition-colors">edit</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
