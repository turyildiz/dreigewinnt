import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function QueuePage() {
  const { data: items } = await supabaseAdmin
    .from("queue_items")
    .select("id, content_type, source_type, status, created_at, payload")
    .eq("status", "pending")
    .order("created_at");

  return (
    <div className="p-8 lg:p-12">
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Verwaltung</p>
        <h1 className="text-3xl font-headline font-black tracking-tighter text-primary">Warteschlange</h1>
        <p className="text-on-surface-variant text-sm mt-1">{items?.length ?? 0} ausstehend</p>
      </div>

      {items?.length === 0 ? (
        <div className="bg-surface-container-lowest p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          <p className="text-on-surface-variant text-sm">Keine ausstehenden Einträge.</p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest">
          {items?.map((item) => (
            <div key={item.id} className="px-6 py-4 border-b border-outline-variant/10 last:border-b-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-secondary/10 text-secondary px-2 py-0.5">
                  {item.content_type}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-outline/10 text-on-surface-variant px-2 py-0.5">
                  {item.source_type}
                </span>
                <span className="text-[10px] text-on-surface-variant ml-auto">
                  {new Date(item.created_at).toLocaleString("de-DE")}
                </span>
              </div>
              <pre className="text-xs text-on-surface-variant bg-surface-container-low p-3 mt-2 overflow-x-auto">
                {JSON.stringify(item.payload, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
