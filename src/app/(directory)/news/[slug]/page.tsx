import type { Metadata } from "next";
import Link from "next/link";

const articles: Record<string, {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  town: string;
  category: string;
  date: string;
  dateFormatted: string;
  readingTime: string;
  imageUrl: string;
  relatedSlugs: string[];
}> = {
  "neues-gewerbegebiet-raunheim-2025": {
    slug: "neues-gewerbegebiet-raunheim-2025",
    title: "Raunheim plant neues Gewerbegebiet am Stadtrand",
    excerpt: "Die Stadt Raunheim hat grünes Licht für ein 12 Hektar großes Gewerbegebiet im Norden gegeben. Ansiedlungen aus Logistik und Leichtindustrie sind vorgesehen.",
    body: [
      "Der Stadtrat Raunheim hat in seiner Sitzung vom 15. September einstimmig den Aufstellungsbeschluss für ein neues Gewerbegebiet im nördlichen Stadtgebiet verabschiedet. Das rund 12 Hektar große Areal soll vorrangig für Betriebe aus Logistik, Leichtindustrie und dem Dienstleistungssektor erschlossen werden.",
      "Bürgermeisterin Andrea Klein zeigte sich erfreut über das Ergebnis: \"Dieses Gewerbegebiet ist ein wichtiger Schritt für die wirtschaftliche Entwicklung Raunheims. Wir schaffen damit attraktive Flächen für lokale Unternehmen und neue Arbeitsplätze für unsere Bürgerinnen und Bürger.\"",
      "Der Bebauungsplan sieht eine Mischung aus kleinen und mittelgroßen Parzellen vor. Ein besonderes Augenmerk liegt auf der Ansiedlung von Unternehmen, die bereits in der Region verwurzelt sind und Expansionsflächen suchen. Großflächige Einzelhandel und Verbrauchermärkte sind ausdrücklich ausgeschlossen.",
      "Die Erschließung soll schrittweise ab dem zweiten Quartal 2026 beginnen. Parallel laufen Gespräche mit mehreren Interessenten aus dem Logistikbereich. Anwohner werden im Rahmen einer öffentlichen Auslegung des Bebauungsplanentwurfs in das Verfahren einbezogen.",
    ],
    town: "Raunheim",
    category: "Wirtschaft",
    date: "2025-09-18",
    dateFormatted: "18. September 2025",
    readingTime: "3 Min.",
    imageUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1600&auto=format&fit=crop",
    relatedSlugs: ["main-taunus-gastro-award-2025", "kelsterbach-fahrradwege-ausbau"],
  },
  "kelsterbach-fahrradwege-ausbau": {
    slug: "kelsterbach-fahrradwege-ausbau",
    title: "Kelsterbach erweitert sein Fahrradwegenetz deutlich",
    excerpt: "Bis 2026 sollen 8 Kilometer neue Radwege entstehen. Das Projekt verbindet erstmals alle Stadtteile mit dem Mainufer.",
    body: [
      "Die Stadt Kelsterbach investiert in den kommenden zwei Jahren rund 2,4 Millionen Euro in den Ausbau ihres Fahrradwegenetzes. Insgesamt sollen 8 Kilometer neue, teils baulich getrennte Radwege entstehen, die alle Stadtteile miteinander und mit dem Mainufer verbinden.",
      "Das Herzstück des Projekts ist eine neue Fahrradachse vom Bahnhof Kelsterbach bis zum Rhein-Main-Radweg entlang des Mains. Dieser Abschnitt wird als zwei Meter breiter, beleuchteter Radweg ausgebaut und soll auch in den Abendstunden sicher befahrbar sein.",
      "\"Wir möchten das Fahrrad als echte Alternative zum Auto stärken\", erklärt Stadtrat Jochen Burkhardt. \"Mit diesem Ausbau schaffen wir die Grundlage dafür, dass mehr Menschen sicher und komfortabel mit dem Rad zur Arbeit, zur Schule oder an den Main fahren können.\"",
      "Die Arbeiten beginnen voraussichtlich im Frühjahr 2026. Anwohner der betroffenen Straßen werden rechtzeitig über Bauzeiträume und Umleitungen informiert.",
    ],
    town: "Kelsterbach",
    category: "Stadtentwicklung",
    date: "2025-09-14",
    dateFormatted: "14. September 2025",
    readingTime: "2 Min.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1600&auto=format&fit=crop",
    relatedSlugs: ["kelsterbach-fluglaerm-initiative", "neues-gewerbegebiet-raunheim-2025"],
  },
  "ruesselsheim-opel-museum-erweiterung": {
    slug: "ruesselsheim-opel-museum-erweiterung",
    title: "Opel-Museum Rüsselsheim: Neue Dauerausstellung zur Elektromobilität",
    excerpt: "Das Museum zeigt ab Oktober eine umfassende Schau zur Geschichte und Zukunft des Elektroantriebs — von den Anfängen bis zur Gegenwart.",
    body: [
      "Das Opel-Museum in Rüsselsheim eröffnet am 1. Oktober eine neue Dauerausstellung, die sich der Geschichte und Zukunft der Elektromobilität widmet. Auf 800 Quadratmetern beleuchtet die Schau die Entwicklung des Elektroantriebs vom frühen 20. Jahrhundert bis zu den modernsten Modellen der Gegenwart.",
      "Besonderes Highlight ist ein restaurierter Opel P4 Elektro aus dem Jahr 1936, der erstmals öffentlich ausgestellt wird. Daneben zeigt die Ausstellung historische Patente, Prototypen und interaktive Stationen, an denen Besucher die Funktionsweise von Elektromotoren selbst erfahren können.",
      "Museumsleiter Dr. Klaus Hofmann betont die Bedeutung der Ausstellung: \"Rüsselsheim hat eine einzigartige Automobilgeschichte. Mit dieser Schau zeigen wir, dass die Zukunft des Elektroantriebs hier schon vor fast hundert Jahren begann.\"",
      "Die Ausstellung ist dienstags bis sonntags von 10 bis 18 Uhr geöffnet. Der Eintritt beträgt 9 Euro, ermäßigt 6 Euro. Führungen können unter museum@ruesselsheim.de gebucht werden.",
    ],
    town: "Rüsselsheim",
    category: "Kultur",
    date: "2025-09-10",
    dateFormatted: "10. September 2025",
    readingTime: "4 Min.",
    imageUrl: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1600&auto=format&fit=crop",
    relatedSlugs: ["main-taunus-gastro-award-2025", "kelsterbach-fahrradwege-ausbau"],
  },
  "main-taunus-gastro-award-2025": {
    slug: "main-taunus-gastro-award-2025",
    title: "Main-Taunus Gastro Award: Drei lokale Betriebe ausgezeichnet",
    excerpt: "Beim diesjährigen Gastronomiepreis des Kreises konnten sich Betriebe aus allen drei Dreigewinnt-Städten durchsetzen.",
    body: [
      "Der Main-Taunus Gastro Award, der jährlich vom Kreisverband Gastronomie und Tourismus vergeben wird, ging in diesem Jahr an drei Betriebe aus der Dreigewinnt-Region. Die Preisverleihung fand im Rahmen eines festlichen Abendessens in Hofheim statt.",
      "In der Kategorie \"Beste regionale Küche\" überzeugte das Restaurant Zum Goldenen Anker in Raunheim die Jury mit seinem konsequent regionalen Speiseangebot. Das Gourmet Eck Kelsterbach wurde für seinen exzellenten Service mit dem Publikumspreis ausgezeichnet. Den Sonderpreis Innovation erhielt das Lumina Fine Dining in Rüsselsheim für sein innovatives Konzept saisonaler Degustationsmenüs.",
      "\"Diese Auszeichnungen zeigen, wie lebendig die Gastronomiekultur in unserer Region ist\", sagte Kreisbeigeordneter Ralf Hemberger bei der Verleihung. \"Wir sind stolz auf die Vielfalt und Qualität, die unsere lokalen Betriebe bieten.\"",
      "Alle Preisträger erhalten neben der Urkunde eine Präsenz in den touristischen Marketingmaterialien des Kreises sowie eine Listung auf der regionalen Gastronomieplatform.",
    ],
    town: "Raunheim",
    category: "Gastronomie",
    date: "2025-09-05",
    dateFormatted: "5. September 2025",
    readingTime: "3 Min.",
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1600&auto=format&fit=crop",
    relatedSlugs: ["neues-gewerbegebiet-raunheim-2025", "ruesselsheim-opel-museum-erweiterung"],
  },
  "kelsterbach-fluglaerm-initiative": {
    slug: "kelsterbach-fluglaerm-initiative",
    title: "Bürgerinitiative gegen Fluglärm übergibt 4.000 Unterschriften",
    excerpt: "Die Initiative Leiser Kelsterbach hat ihre Petition an den Kreistag übergeben. Eine Anhörung ist für November geplant.",
    body: [
      "Die Bürgerinitiative Leiser Kelsterbach hat am vergangenen Freitag dem Vorsitzenden des Kreistags Groß-Gerau eine Petition mit 4.217 Unterschriften übergeben. Die Initiative fordert eine Reduktion der Nachtflugbewegungen über Kelsterbach sowie eine Überprüfung der bestehenden Flugrouten.",
      "\"4.000 Unterschriften in weniger als drei Monaten zeigen, wie ernst das Problem von unseren Mitbürgerinnen und Mitbürgern genommen wird\", erklärte Initiativensprecherin Monika Schwarz bei der Übergabe. \"Wir erwarten eine ehrliche Auseinandersetzung mit unseren Forderungen.\"",
      "Der Kreistag hat zugesagt, die Petition in seiner November-Sitzung zu behandeln. Eine öffentliche Anhörung, zu der auch Vertreter der Fraport AG eingeladen werden, ist für den 12. November geplant.",
      "Die Initiative hatte sich im Juni gegründet, nachdem eine Änderung von Abflugrouten zu einer messbaren Zunahme des Fluglärms über dem südlichen Stadtgebiet geführt hatte. Lärmschutzmessungen der Stadt ergaben in Spitzenzeiten Werte von bis zu 72 Dezibel.",
    ],
    town: "Kelsterbach",
    category: "Bürger & Politik",
    date: "2025-08-28",
    dateFormatted: "28. August 2025",
    readingTime: "2 Min.",
    imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1600&auto=format&fit=crop",
    relatedSlugs: ["kelsterbach-fahrradwege-ausbau", "neues-gewerbegebiet-raunheim-2025"],
  },
};

const townColors: Record<string, string> = {
  Raunheim: "bg-surface-container-highest text-primary",
  Kelsterbach: "bg-secondary-container text-on-secondary-container",
  Rüsselsheim: "bg-tertiary-fixed text-on-tertiary-container",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articles[slug];

  if (!article) {
    return { title: "Artikel nicht gefunden | DREIGEWINNT.COM" };
  }

  return {
    title: `${article.title} | DREIGEWINNT.COM`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.imageUrl }],
      type: "article",
      publishedTime: article.date,
      tags: [article.town, article.category],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles[slug];

  if (!article) {
    return (
      <main className="px-4 sm:px-8 lg:px-12 py-20 text-center">
        <p className="text-on-surface-variant">Artikel nicht gefunden.</p>
        <Link href="/news" className="text-secondary font-bold text-sm mt-4 inline-block hover:underline">
          ← Zurück zu Nachrichten
        </Link>
      </main>
    );
  }

  const related = article.relatedSlugs
    .map((s) => articles[s])
    .filter(Boolean);

  return (
    <main className="w-full pb-16">

      {/* ── Hero ── */}
      <div className="relative h-[40vw] min-h-[240px] max-h-[500px] overflow-hidden bg-surface-container-high">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent" />

        {/* Town + category over image */}
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 lg:bottom-8 lg:left-12 flex items-center gap-2 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${townColors[article.town]}`}>
            {article.town}
          </span>
          <span className="text-on-primary/80 font-bold text-[10px] tracking-widest uppercase">
            {article.category}
          </span>
        </div>
      </div>

      {/* ── Article content ── */}
      <div className="px-4 sm:px-8 lg:px-12 pt-8 lg:pt-12">

        {/* Back link */}
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors mb-6 lg:mb-8"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Alle Nachrichten
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">

          {/* ── Article body ── */}
          <article className="lg:col-span-2">
            {/* Meta */}
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-5">
              <span>{article.dateFormatted}</span>
              <span className="w-1 h-1 rounded-full bg-outline-variant" />
              <span>{article.readingTime} Lesezeit</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-black tracking-tighter text-primary leading-tight mb-8">
              {article.title}
            </h1>

            {/* Lead paragraph */}
            <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed mb-6 font-medium border-l-2 border-secondary pl-4 lg:pl-6">
              {article.excerpt}
            </p>

            {/* Body paragraphs */}
            <div className="flex flex-col gap-5">
              {article.body.map((paragraph, i) => (
                <p key={i} className="text-on-surface text-sm sm:text-base leading-relaxed lg:leading-loose">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Source note */}
            <div className="mt-10 pt-6 border-t border-outline-variant/15 flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary text-sm">verified</span>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Redaktionell geprüft · DREIGEWINNT.COM Editorial
              </p>
            </div>
          </article>

          {/* ── Sidebar ── */}
          <aside className="flex flex-col gap-6">

            {/* Share */}
            <div className="bg-surface-container-lowest border border-outline-variant/10 p-5 lg:p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">Teilen</p>
              <div className="flex gap-2">
                {["link", "mail", "share"].map((icon) => (
                  <button
                    key={icon}
                    className="flex-1 flex items-center justify-center gap-2 border border-outline-variant/20 py-2.5 text-[10px] font-bold uppercase tracking-wide hover:bg-surface-container-low transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">{icon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Related articles */}
            {related.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-3">
                  <span className="w-5 h-[2px] bg-outline-variant flex-shrink-0" />
                  Weitere Berichte
                </p>
                <div className="flex flex-col gap-3">
                  {related.map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/news/${rel.slug}`}
                      className="group flex gap-3 bg-surface-container-lowest border border-outline-variant/10 p-3 hover:shadow-md transition-all"
                    >
                      <div className="w-16 h-16 flex-shrink-0 overflow-hidden bg-surface-container-high">
                        <img
                          src={rel.imageUrl}
                          alt={rel.title}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`inline-block px-1.5 py-0.5 rounded-full text-[8px] font-bold tracking-wider uppercase mb-1 ${townColors[rel.town]}`}>
                          {rel.town}
                        </span>
                        <p className="text-xs font-bold text-primary leading-tight group-hover:text-secondary transition-colors line-clamp-2">
                          {rel.title}
                        </p>
                      </div>
                    </Link>
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
