import Link from "next/link";
import { BusinessSubmitModal } from "@/components/ui/BusinessSubmitModal";
import { TownTag } from "@/components/ui/TownTag";
import { supabase } from "@/lib/supabase";
import { toDisplayTown } from "@/lib/towns";

export default async function GewerbePage({
  searchParams,
}: {
  searchParams: Promise<{ town?: string; category?: string }>;
}) {
  const { town, category } = await searchParams;

  let query = supabase
    .from("businesses")
    .select("id, slug, name, category, town, tier, description, hero_image_url")
    .eq("status", "active")
    .order("name");

  if (town) query = query.eq("town", town);
  if (category) query = query.ilike("category", `%${category}%`);

  const { data: businesses } = await query;

  const premium = businesses?.filter((b) => b.tier === "premium") ?? [];
  const others = businesses?.filter((b) => b.tier !== "premium") ?? [];

  const townLabel = town ? toDisplayTown(town) : null;

  return (
    <main className="w-full">

      {/* ── Page Header ── */}
      <header className="px-4 sm:px-8 lg:px-12 pt-6 lg:pt-14 pb-10 lg:pb-16">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {townLabel ? (
            <TownTag town={townLabel} />
          ) : (
            <span className="bg-surface-container-highest text-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">Region</span>
          )}
          {category && (
            <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
              {category}
            </span>
          )}
          <span className="text-on-surface-variant font-medium text-xs tracking-widest uppercase">
            Gewerbeindex 2026
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-black tracking-tighter text-primary leading-none mb-4">
          Gewerbeverzeichnis
        </h1>
        <p className="text-on-surface-variant text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed">
          {townLabel
            ? `Unternehmen in ${townLabel} — kuratierte Qualität aus Ihrer Nachbarschaft.`
            : "Entdecken Sie die wirtschaftliche Vielfalt der Region Groß-Gerau. Kuratierte Qualität aus Ihrer Nachbarschaft."}
        </p>
      </header>

      {/* ── Premium Partner ── */}
      {premium.length > 0 && (
        <section className="px-4 sm:px-8 lg:px-12 mb-16 lg:mb-20">
          <div className="flex items-center gap-4 mb-6 lg:mb-8">
            <h2 className="text-[12px] font-black tracking-[0.1em] text-tertiary uppercase flex items-center gap-2 flex-shrink-0">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              Premium Partner
            </h2>
            <div className="flex-grow h-[1px] bg-tertiary-container/30" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {premium.map((business) => (
              <Link
                key={business.slug}
                href={`/gewerbe/${business.slug}`}
                className="group relative bg-surface-container-lowest border border-tertiary-container/40 hover:bg-surface-bright transition-all duration-300 block"
              >
                <div className="absolute -top-3 right-6 bg-tertiary text-white text-[10px] font-bold px-3 py-1 tracking-widest uppercase z-10">
                  TOP-PARTNER
                </div>
                <div className="h-44 sm:h-48 lg:h-52 overflow-hidden bg-surface-container-high">
                  {business.hero_image_url ? (
                    <img
                      src={business.hero_image_url}
                      alt={business.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-outline/30 text-5xl">storefront</span>
                    </div>
                  )}
                </div>
                <div className="p-6 lg:p-8">
                  <span className="text-secondary font-bold text-[10px] tracking-widest uppercase">
                    {business.category}
                  </span>
                  <h3 className="text-xl lg:text-2xl font-black tracking-tight text-primary mt-1 mb-3 group-hover:text-secondary transition-colors">
                    {business.name}
                  </h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-5 lg:mb-6">
                    {business.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <TownTag town={toDisplayTown(business.town)} />
                    <span className="material-symbols-outlined text-secondary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Alle Unternehmen ── */}
      <section className="px-4 sm:px-8 lg:px-12 pb-16">
        <div className="flex items-center justify-between mb-8 lg:mb-10 gap-3 flex-wrap">
          <h2 className="text-[12px] font-black tracking-[0.1em] text-primary uppercase">
            {townLabel ? `Unternehmen in ${townLabel}` : "Alle Unternehmen"}
          </h2>
        </div>

        {businesses?.length === 0 && (
          <p className="text-on-surface-variant text-sm py-8 text-center">
            Keine Einträge gefunden.
          </p>
        )}

        <div className="flex flex-col gap-2 lg:gap-3">
          {others.map((business) => (
            <Link
              key={business.slug}
              href={`/gewerbe/${business.slug}`}
              className="group bg-surface-container-low hover:bg-surface-container-lowest p-4 sm:p-5 lg:p-6 flex items-center gap-4 sm:gap-6 lg:gap-8 transition-colors"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-surface-container-highest flex-shrink-0 flex items-center justify-center overflow-hidden">
                {business.hero_image_url ? (
                  <img src={business.hero_image_url} alt={business.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-on-surface-variant text-xl lg:text-2xl">storefront</span>
                )}
              </div>
              <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 items-center gap-2">
                <div className="col-span-2">
                  <h4 className="font-bold text-primary tracking-tight text-sm sm:text-base truncate">
                    {business.name}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-on-surface-variant uppercase tracking-wider mt-0.5">
                    {business.category}
                  </p>
                </div>
                <div className="hidden sm:block">
                  <TownTag town={toDisplayTown(business.town)} />
                </div>
                <div className="hidden sm:flex justify-end">
                  <span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                    arrow_forward
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <BusinessSubmitModal />

    </main>
  );
}
