import Link from "next/link";
import { GalleryLightbox } from "@/components/ui/GalleryLightbox";
import { supabase } from "@/lib/supabase";
import { toDisplayTown } from "@/lib/towns";

const tierLabels: Record<string, { label: string; classes: string }> = {
  premium: { label: "Premium Partner", classes: "bg-tertiary text-on-tertiary" },
  standard: { label: "Standard", classes: "bg-surface-container-high text-on-surface-variant" },
  free: { label: "Basiseintrag", classes: "bg-surface-container text-on-surface-variant" },
};

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", id)
    .eq("status", "active")
    .single();

  if (!business) {
    return (
      <main className="px-4 sm:px-8 lg:px-12 py-20 text-center">
        <p className="text-on-surface-variant">Unternehmen nicht gefunden.</p>
        <Link href="/gewerbe" className="text-secondary font-bold text-sm mt-4 inline-block hover:underline">
          ← Zurück zum Verzeichnis
        </Link>
      </main>
    );
  }

  const { data: photos } = await supabase
    .from("business_photos")
    .select("url")
    .eq("business_id", business.id)
    .order("sort_order");

  const galleryImages = photos?.map((p) => p.url) ?? [];
  const tier = tierLabels[business.tier];
  const openingHours: { day: string; hours: string }[] = business.opening_hours ?? [];

  return (
    <main className="w-full pb-16">

      {/* ── Hero ── */}
      <div className="relative h-[35vw] min-h-[220px] max-h-[440px] bg-surface-container-high overflow-hidden">
        {business.hero_image_url ? (
          <img
            src={business.hero_image_url}
            alt={business.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-outline/30 text-6xl">storefront</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-primary/5 to-transparent" />
        {business.tier === "premium" && (
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-12 bg-tertiary text-on-tertiary text-[10px] font-bold px-3 py-1 tracking-widest uppercase">
            TOP-PARTNER
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="px-4 sm:px-8 lg:px-12 pt-8 lg:pt-12">

        <Link
          href="/gewerbe"
          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors mb-6 lg:mb-8"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Gewerbeverzeichnis
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">

          {/* ── Left: description + gallery ── */}
          <div className="lg:col-span-2 flex flex-col gap-8 lg:gap-12">

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest ${tier.classes}`}>
                  {tier.label}
                </span>
                <span className="text-on-surface-variant text-xs uppercase tracking-widest font-bold">
                  {business.category}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-black tracking-tighter text-primary leading-tight mb-4">
                {business.name}
              </h1>
              {business.description && (
                <p className="text-on-surface-variant text-base sm:text-lg leading-relaxed mb-3">
                  {business.description}
                </p>
              )}
              {business.full_description && (
                <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed">
                  {business.full_description}
                </p>
              )}
            </div>

            {/* Gallery */}
            {galleryImages.length > 0 && (
              <div>
                <h2 className="text-[12px] font-black tracking-[0.1em] text-primary uppercase mb-4 lg:mb-6 flex items-center gap-3">
                  <span className="w-5 h-[2px] bg-outline-variant flex-shrink-0" />
                  Galerie
                </h2>
                <GalleryLightbox images={galleryImages} altPrefix={business.name} />
              </div>
            )}

            {/* Premium Telegram CTA */}
            {business.tier === "premium" && (
              <div className="bg-surface-container-low border border-outline-variant/10 p-5 lg:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <span className="material-symbols-outlined text-secondary text-2xl flex-shrink-0">send</span>
                <div className="flex-1">
                  <p className="font-bold text-primary text-sm mb-0.5">Eintrag aktualisieren</p>
                  <p className="text-on-surface-variant text-xs">Als Premium Partner können Sie Öffnungszeiten, Fotos und Angebote direkt via Telegram einreichen.</p>
                </div>
                <button className="signature-gradient text-on-secondary text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 hover:brightness-110 transition-all flex-shrink-0 w-full sm:w-auto text-center">
                  Via Telegram
                </button>
              </div>
            )}

          </div>

          {/* ── Right: contact sidebar ── */}
          <aside className="flex flex-col gap-4">

            <div className="bg-surface-container-lowest border border-outline-variant/10 p-5 lg:p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Adresse</p>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-xl flex-shrink-0">location_on</span>
                <div>
                  <p className="font-bold text-primary text-sm">{toDisplayTown(business.town)}</p>
                  <p className="text-on-surface-variant text-xs mt-0.5">{business.address}</p>
                </div>
              </div>
            </div>

            {(business.phone || business.email || business.website) && (
              <div className="bg-surface-container-lowest border border-outline-variant/10 p-5 lg:p-6 flex flex-col gap-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Kontakt</p>
                {business.phone && (
                  <a href={`tel:${business.phone}`} className="flex items-center gap-3 group">
                    <span className="material-symbols-outlined text-secondary text-xl flex-shrink-0">call</span>
                    <span className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">{business.phone}</span>
                  </a>
                )}
                {business.email && (
                  <a href={`mailto:${business.email}`} className="flex items-center gap-3 group">
                    <span className="material-symbols-outlined text-secondary text-xl flex-shrink-0">mail</span>
                    <span className="text-sm text-on-surface-variant group-hover:text-primary transition-colors truncate">{business.email}</span>
                  </a>
                )}
                {business.website && (
                  <a href={`https://${business.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                    <span className="material-symbols-outlined text-secondary text-xl flex-shrink-0">language</span>
                    <span className="text-sm text-on-surface-variant group-hover:text-primary transition-colors truncate">{business.website}</span>
                  </a>
                )}
              </div>
            )}

            {openingHours.length > 0 && (
              <div className="bg-surface-container-lowest border border-outline-variant/10 p-5 lg:p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">Öffnungszeiten</p>
                <div className="flex flex-col gap-2.5">
                  {openingHours.map((row) => (
                    <div key={row.day} className="flex justify-between items-start gap-4">
                      <span className="text-xs font-bold text-primary flex-shrink-0">{row.day}</span>
                      <span className="text-xs text-on-surface-variant text-right">{row.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </aside>
        </div>
      </div>

    </main>
  );
}
