import Link from "next/link";

const businesses: Record<string, {
  id: string;
  name: string;
  category: string;
  town: string;
  tier: "free" | "standard" | "premium";
  description: string;
  fullDescription: string;
  address: string;
  phone: string;
  website: string;
  email: string;
  openingHours: { day: string; hours: string }[];
  imageUrl: string;
  galleryImages: string[];
}> = {
  "main-studio-gmbh": {
    id: "main-studio-gmbh",
    name: "Main-Studio GmbH",
    category: "Architektur & Design",
    town: "Raunheim",
    tier: "premium",
    description: "Exzellente Raumgestaltung und zukunftsweisende Bürokonzepte für den Main-Taunus-Kreis.",
    fullDescription: "Main-Studio GmbH steht seit über 15 Jahren für erstklassige Innenarchitektur und Bürokonzepte im Main-Taunus-Kreis. Unser Team aus erfahrenen Architekten und Designern entwickelt maßgeschneiderte Lösungen für Gewerbeflächen, Büros und öffentliche Räume. Wir verbinden ästhetische Perfektion mit funktionaler Exzellenz und begleiten unsere Kunden vom ersten Entwurf bis zur schlüsselfertigen Übergabe.",
    address: "Industriestraße 24, 65479 Raunheim",
    phone: "+49 6142 123456",
    website: "www.main-studio.de",
    email: "info@main-studio.de",
    openingHours: [
      { day: "Montag – Freitag", hours: "08:00 – 18:00 Uhr" },
      { day: "Samstag", hours: "09:00 – 13:00 Uhr" },
      { day: "Sonntag", hours: "Geschlossen" },
    ],
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1497366754035-f200581399c2?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop",
    ],
  },
  "lumina-fine-dining": {
    id: "lumina-fine-dining",
    name: "Lumina Fine Dining",
    category: "Gastronomie",
    town: "Rüsselsheim",
    tier: "premium",
    description: "Kulinarische Erlebnisse auf Sterneniveau im Herzen von Rüsselsheim. Regional & Saisonal.",
    fullDescription: "Lumina Fine Dining vereint moderne Küche mit regionalen Produkten zu einem unvergleichlichen kulinarischen Erlebnis. Unser Küchenchef setzt auf saisonale Zutaten aus der unmittelbaren Umgebung und interpretiert klassische Gerichte auf zeitgenössische Art. Das Ambiente verbindet historische Architektur mit modernem Design und schafft eine einzigartige Atmosphäre für besondere Anlässe.",
    address: "Opelstraße 8, 65428 Rüsselsheim am Rhein",
    phone: "+49 6142 987654",
    website: "www.lumina-dining.de",
    email: "reservierung@lumina-dining.de",
    openingHours: [
      { day: "Dienstag – Freitag", hours: "12:00 – 14:30 & 18:00 – 22:30 Uhr" },
      { day: "Samstag", hours: "18:00 – 23:00 Uhr" },
      { day: "Sonntag & Montag", hours: "Geschlossen" },
    ],
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1600&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop",
    ],
  },
  "handwerksbetrieb-mueller": {
    id: "handwerksbetrieb-mueller",
    name: "Handwerksbetrieb Müller",
    category: "Sanitär & Heizung",
    town: "Kelsterbach",
    tier: "standard",
    description: "Zuverlässige Sanitär- und Heizungsarbeiten für Privat- und Gewerbekunden.",
    fullDescription: "Handwerksbetrieb Müller ist seit 1985 Ihr verlässlicher Partner für alle Sanitär- und Heizungsarbeiten im Kreis Groß-Gerau. Ob Neuinstallation, Wartung oder Notdienst – wir sind schnell, sauber und fair. Alle Arbeiten werden von qualifizierten Fachkräften ausgeführt.",
    address: "Kelsterbacher Straße 45, 65451 Kelsterbach",
    phone: "+49 6107 234567",
    website: "www.mueller-sanitaer.de",
    email: "info@mueller-sanitaer.de",
    openingHours: [
      { day: "Montag – Freitag", hours: "07:00 – 17:00 Uhr" },
      { day: "Samstag", hours: "08:00 – 12:00 Uhr (Notdienst)" },
      { day: "Sonntag", hours: "Notdienst auf Anfrage" },
    ],
    imageUrl: "",
    galleryImages: [],
  },
};

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
  const business = businesses[id];

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

  const tier = tierLabels[business.tier];

  return (
    <main className="w-full pb-16">

      {/* ── Hero ── */}
      <div className="relative h-[35vw] min-h-[220px] max-h-[440px] bg-surface-container-high overflow-hidden">
        {business.imageUrl ? (
          <img
            src={business.imageUrl}
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

        {/* Back link */}
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

            {/* Name + category */}
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
              <p className="text-on-surface-variant text-base sm:text-lg leading-relaxed mb-3">
                {business.description}
              </p>
              <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed">
                {business.fullDescription}
              </p>
            </div>

            {/* Photo gallery */}
            {business.galleryImages.length > 0 && (
              <div>
                <h2 className="text-[12px] font-black tracking-[0.1em] text-primary uppercase mb-4 lg:mb-6 flex items-center gap-3">
                  <span className="w-5 h-[2px] bg-outline-variant flex-shrink-0" />
                  Galerie
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:gap-4">
                  {business.galleryImages.map((src, i) => (
                    <div key={i} className="aspect-square bg-surface-container-high overflow-hidden">
                      <img
                        src={src}
                        alt={`${business.name} – Foto ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
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

            {/* Address */}
            <div className="bg-surface-container-lowest border border-outline-variant/10 p-5 lg:p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Adresse</p>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-xl flex-shrink-0">location_on</span>
                <div>
                  <p className="font-bold text-primary text-sm">{business.town}</p>
                  <p className="text-on-surface-variant text-xs mt-0.5">{business.address}</p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-surface-container-lowest border border-outline-variant/10 p-5 lg:p-6 flex flex-col gap-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Kontakt</p>
              <a href={`tel:${business.phone}`} className="flex items-center gap-3 group">
                <span className="material-symbols-outlined text-secondary text-xl flex-shrink-0">call</span>
                <span className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">{business.phone}</span>
              </a>
              <a href={`mailto:${business.email}`} className="flex items-center gap-3 group">
                <span className="material-symbols-outlined text-secondary text-xl flex-shrink-0">mail</span>
                <span className="text-sm text-on-surface-variant group-hover:text-primary transition-colors truncate">{business.email}</span>
              </a>
              <a href={`https://${business.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                <span className="material-symbols-outlined text-secondary text-xl flex-shrink-0">language</span>
                <span className="text-sm text-on-surface-variant group-hover:text-primary transition-colors truncate">{business.website}</span>
              </a>
            </div>

            {/* Opening hours */}
            <div className="bg-surface-container-lowest border border-outline-variant/10 p-5 lg:p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">Öffnungszeiten</p>
              <div className="flex flex-col gap-2.5">
                {business.openingHours.map((row) => (
                  <div key={row.day} className="flex justify-between items-start gap-4">
                    <span className="text-xs font-bold text-primary flex-shrink-0">{row.day}</span>
                    <span className="text-xs text-on-surface-variant text-right">{row.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-surface-container-high h-36 lg:h-44 flex items-center justify-center">
              <div className="text-center">
                <span className="material-symbols-outlined text-outline/40 text-3xl block mb-1">map</span>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Karte folgt</p>
              </div>
            </div>

          </aside>
        </div>
      </div>

    </main>
  );
}
