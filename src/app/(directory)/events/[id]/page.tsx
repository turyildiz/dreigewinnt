import Link from "next/link";

const events: Record<string, {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  dateStr: string;
  time: string;
  venue: string;
  address: string;
  town: string;
  category: string;
  organiser: string;
  organiserContact: string;
  imageUrl: string;
  isFeatured: boolean;
}> = {
  "jazz-im-rathausgarten": {
    id: "jazz-im-rathausgarten",
    title: "Jazz im Rathausgarten",
    description: "Ein Abend voller Eleganz und rhythmischer Raffinesse im Herzen von Rüsselsheim.",
    fullDescription: "Erleben Sie einen unvergesslichen Abend unter freiem Himmel im historischen Rathausgarten von Rüsselsheim. Renommierte Jazzmusiker aus der gesamten Rhein-Main-Region präsentieren ein Programm, das von klassischem Swing bis zu modernem Jazz reicht. Genießen Sie exzellente Musik, regionale Weine und die einzigartige Atmosphäre eines der schönsten Orte der Stadt.",
    dateStr: "24. September 2025",
    time: "19:00 Uhr",
    venue: "Rathausgarten Rüsselsheim",
    address: "Marktplatz 1, 65428 Rüsselsheim am Rhein",
    town: "Rüsselsheim",
    category: "Konzert & Musik",
    organiser: "Kulturbüro Rüsselsheim",
    organiserContact: "kultur@ruesselsheim.de",
    imageUrl: "https://images.unsplash.com/photo-1540039155733-d730a53ca30f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    isFeatured: true,
  },
  "main-taunus-genussmarkt": {
    id: "main-taunus-genussmarkt",
    title: "Main-Taunus Genussmarkt",
    description: "Exzellente Weine und regionale Spezialitäten direkt von den Erzeugern der Region.",
    fullDescription: "Der Main-Taunus Genussmarkt bringt die besten Erzeuger der Region zusammen. Über 40 Aussteller präsentieren Weine, Käse, Wurstwaren, Honig und handwerkliche Spezialitäten. Ein besonderes Highlight: geführte Verkostungen mit Sommeliers und Direktgespräche mit den Erzeugern. Für Liebhaber regionaler Produkte ein Pflichttermin.",
    dateStr: "28. September 2025",
    time: "10:00 – 18:00 Uhr",
    venue: "Marktplatz Raunheim",
    address: "Marktplatz, 65479 Raunheim",
    town: "Raunheim",
    category: "Markt & Kulinarik",
    organiser: "Stadtmarketing Raunheim",
    organiserContact: "info@raunheim.de",
    imageUrl: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    isFeatured: true,
  },
  "krimidinner-stadtbuecherei": {
    id: "krimidinner-stadtbuecherei",
    title: "Krimidinner in der Stadtbücherei",
    description: "Ein spannender Abend mit Mord, Rätsel und kulinarischen Überraschungen.",
    fullDescription: "Erleben Sie einen unvergesslichen Abend in der Stadtbücherei Rüsselsheim: Ein professionelles Schauspielensemble führt Sie durch einen packenden Kriminalfall, während Sie ein Drei-Gänge-Menü genießen. Die Gäste sind eingeladen, mitzurätseln und den Fall gemeinsam zu lösen. Tickets sind im Vorverkauf in der Bücherei erhältlich.",
    dateStr: "5. Oktober 2025",
    time: "19:00 Uhr",
    venue: "Stadtbücherei Rüsselsheim",
    address: "Marktplatz 5, 65428 Rüsselsheim am Rhein",
    town: "Rüsselsheim",
    category: "Lesung",
    organiser: "Stadtbücherei Rüsselsheim",
    organiserContact: "buecherei@ruesselsheim.de",
    imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1600&auto=format&fit=crop",
    isFeatured: false,
  },
  "digital-hub-networking": {
    id: "digital-hub-networking",
    title: "Digital Hub: Main-Taunus Networking",
    description: "Der regionale Treffpunkt für Gründer, Unternehmer und digitale Talente.",
    fullDescription: "Das monatliche Networking-Event im Technologiezentrum bringt Gründer, Unternehmen und Digitaltalente aus dem Main-Taunus-Kreis zusammen. Nach kurzen Impulsvorträgen zu aktuellen Themen der Digitalwirtschaft gibt es ausreichend Zeit für informellen Austausch. Kostenfrei, ohne Anmeldung.",
    dateStr: "8. Oktober 2025",
    time: "18:30 Uhr",
    venue: "Technologiezentrum Rüsselsheim",
    address: "Rüsselsheimer Straße 100, 65428 Rüsselsheim am Rhein",
    town: "Rüsselsheim",
    category: "Gewerbe",
    organiser: "Digital Hub Main-Taunus e.V.",
    organiserContact: "hello@digitalhub-maintaunus.de",
    imageUrl: "https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=1600&auto=format&fit=crop",
    isFeatured: false,
  },
  "lichterfest-stadtpark": {
    id: "lichterfest-stadtpark",
    title: "Lichterfest im Stadtpark",
    description: "Kelsterbach erstrahlt in einem Meer aus Lichtern, Musik und Atmosphäre.",
    fullDescription: "Das jährliche Lichterfest verwandelt den Stadtpark Kelsterbach in eine magische Kulisse. Hunderte von Lichtinstallationen, Live-Musik auf zwei Bühnen und ein umfangreiches Speisen- und Getränkeangebot machen diesen Tag zu einem Erlebnis für die ganze Familie. Eintritt frei.",
    dateStr: "12. Oktober 2025",
    time: "Ganztägig (ab 14:00 Uhr)",
    venue: "Stadtpark Kelsterbach",
    address: "Parkstraße 1, 65451 Kelsterbach",
    town: "Kelsterbach",
    category: "Stadtfest",
    organiser: "Stadt Kelsterbach",
    organiserContact: "veranstaltungen@kelsterbach.de",
    imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop",
    isFeatured: false,
  },
  "vernissage-lokale-moderne": {
    id: "vernissage-lokale-moderne",
    title: "Vernissage: Lokale Moderne",
    description: "Zeitgenössische Kunst aus Kelsterbach und Umgebung.",
    fullDescription: "Die Vernissage \u201ELokale Moderne\u201C versammelt 15 Künstlerinnen und Künstler aus Kelsterbach und dem Main-Taunus-Kreis. Malerei, Fotografie und Skulptur treffen aufeinander. Die Ausstellung läuft bis Ende Oktober und ist dienstags bis sonntags von 10 bis 18 Uhr geöffnet. Der Eintritt ist frei.",
    dateStr: "2. Oktober 2025",
    time: "18:00 Uhr (Vernissage)",
    venue: "Kunsthaus Kelsterbach",
    address: "Frankfurter Straße 14, 65451 Kelsterbach",
    town: "Kelsterbach",
    category: "Kunst & Ausstellung",
    organiser: "Kulturverein Kelsterbach e.V.",
    organiserContact: "kunst@kelsterbach-kultur.de",
    imageUrl: "https://images.unsplash.com/photo-1551043047-1d2adf00f3fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    isFeatured: false,
  },
};

const townColors: Record<string, string> = {
  Rüsselsheim: "bg-surface-container-highest text-primary",
  Raunheim: "bg-surface-container-highest text-primary",
  Kelsterbach: "bg-secondary-container text-on-secondary-container",
};

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = events[id];

  if (!event) {
    return (
      <main className="px-4 sm:px-8 lg:px-12 py-20 text-center">
        <p className="text-on-surface-variant">Veranstaltung nicht gefunden.</p>
        <Link href="/events" className="text-secondary font-bold text-sm mt-4 inline-block hover:underline">
          ← Zurück zu Veranstaltungen
        </Link>
      </main>
    );
  }

  return (
    <main className="w-full pb-16">

      {/* ── Hero Image ── */}
      <div className="relative h-[45vw] min-h-[260px] max-h-[520px] overflow-hidden bg-surface-container-high">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/10 to-transparent" />

        {/* Badges over image */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-12 flex items-center gap-2 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${townColors[event.town] ?? "bg-surface-container-highest text-primary"}`}>
            {event.town}
          </span>
          {event.isFeatured && (
            <span className="bg-primary text-on-primary px-2 py-1 text-[9px] font-bold uppercase tracking-widest">
              Featured Boost
            </span>
          )}
        </div>

        {/* Date chip pinned to bottom-left of image */}
        <div className="absolute bottom-0 left-4 sm:left-6 lg:left-12 bg-surface-container-lowest px-5 py-3 shadow-lg">
          <span className="block text-secondary font-black text-2xl sm:text-3xl leading-none">{event.dateStr.slice(0, 2)}</span>
          <span className="block text-on-surface-variant text-[9px] uppercase font-bold tracking-widest">
            {event.dateStr.split(" ").slice(1).join(" ")}
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-4 sm:px-8 lg:px-12 pt-8 lg:pt-12">

        {/* Back link */}
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors mb-6 lg:mb-8"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Alle Veranstaltungen
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">

          {/* ── Left: main content ── */}
          <div className="lg:col-span-2">
            <span className="text-secondary font-bold text-[10px] tracking-widest uppercase block mb-3">
              {event.category}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-black tracking-tighter text-primary leading-tight mb-6">
              {event.title}
            </h1>
            <p className="text-on-surface-variant text-base sm:text-lg leading-relaxed mb-4">
              {event.description}
            </p>
            <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed">
              {event.fullDescription}
            </p>
          </div>

          {/* ── Right: info sidebar ── */}
          <aside className="flex flex-col gap-4">

            {/* Date & Time */}
            <div className="bg-surface-container-lowest border border-outline-variant/10 p-5 lg:p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Datum & Zeit</p>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-xl flex-shrink-0">calendar_today</span>
                <div>
                  <p className="font-bold text-primary text-sm">{event.dateStr}</p>
                  <p className="text-on-surface-variant text-xs mt-0.5">{event.time}</p>
                </div>
              </div>
            </div>

            {/* Venue */}
            <div className="bg-surface-container-lowest border border-outline-variant/10 p-5 lg:p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Veranstaltungsort</p>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-xl flex-shrink-0">location_on</span>
                <div>
                  <p className="font-bold text-primary text-sm">{event.venue}</p>
                  <p className="text-on-surface-variant text-xs mt-0.5">{event.address}</p>
                </div>
              </div>
            </div>

            {/* Organiser */}
            <div className="bg-surface-container-lowest border border-outline-variant/10 p-5 lg:p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Veranstalter</p>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-xl flex-shrink-0">group</span>
                <div>
                  <p className="font-bold text-primary text-sm">{event.organiser}</p>
                  <p className="text-on-surface-variant text-xs mt-0.5">{event.organiserContact}</p>
                </div>
              </div>
            </div>

            {/* .ics / Calendar CTA */}
            <a
              href={`/api/events/${event.id}/calendar.ics`}
              className="signature-gradient text-on-secondary flex items-center justify-center gap-2 py-4 font-bold text-[11px] uppercase tracking-widest hover:brightness-110 transition-all"
            >
              <span className="material-symbols-outlined text-lg">event_available</span>
              Zum Kalender hinzufügen
            </a>

            {/* Map placeholder */}
            <div className="bg-surface-container-high h-32 lg:h-40 flex items-center justify-center">
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
