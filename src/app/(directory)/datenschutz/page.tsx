export default function DatenschutzPage() {
  return (
    <main className="px-4 sm:px-8 lg:px-12 pt-8 lg:pt-14 pb-20 max-w-3xl">
      <div className="mb-10">
        <span className="bg-surface-container-highest text-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">Rechtliches</span>
        <h1 className="text-4xl sm:text-5xl font-headline font-black tracking-tighter text-primary leading-none mt-4 mb-2">Datenschutz&shy;erklärung</h1>
        <p className="text-on-surface-variant text-sm">Zuletzt aktualisiert: April 2026</p>
      </div>

      <div className="space-y-10 text-on-surface-variant leading-relaxed text-sm">

        <section>
          <h2 className="text-base font-black text-primary uppercase tracking-widest mb-3">1. Verantwortlicher</h2>
          <p>
            Verantwortlich im Sinne der DSGVO ist:<br /><br />
            Turgay Yildiz<br />
            [Straße und Hausnummer]<br />
            [PLZ] [Stadt]<br />
            E-Mail: <a href="mailto:info@dreigewinnt.com" className="text-secondary hover:underline">info@dreigewinnt.com</a>
          </p>
        </section>

        <section>
          <h2 className="text-base font-black text-primary uppercase tracking-widest mb-3">2. Erhebung und Verarbeitung personenbezogener Daten</h2>
          <h3 className="font-bold text-primary mb-2">Server-Logfiles</h3>
          <p className="mb-4">
            Beim Besuch unserer Website werden automatisch Informationen in Server-Logfiles gespeichert, die Ihr Browser übermittelt. Dies umfasst: IP-Adresse, Datum und Uhrzeit des Zugriffs, Name der abgerufenen Datei, Website von der der Zugriff erfolgte, verwendeter Browser und Betriebssystem. Diese Daten werden nicht mit anderen Datenquellen zusammengeführt und nach spätestens 7 Tagen gelöscht. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.
          </p>
          <h3 className="font-bold text-primary mb-2">Kontaktformulare & Einreichungen</h3>
          <p>
            Wenn Sie über unsere Formulare (z. B. Gewerbeeintrag einreichen, Veranstaltung einreichen) Daten übermitteln, werden diese zur Bearbeitung Ihrer Anfrage gespeichert. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO. Ihre Daten werden nicht ohne Ihre Einwilligung an Dritte weitergegeben.
          </p>
        </section>

        <section>
          <h2 className="text-base font-black text-primary uppercase tracking-widest mb-3">3. Datenbank & Hosting</h2>
          <p>
            Diese Website nutzt Supabase (Supabase Inc., USA) als Datenbankdienst sowie Vercel (Vercel Inc., USA) als Hosting-Dienstleister. Beide Anbieter verarbeiten Daten im Rahmen einer Auftragsverarbeitung gemäß Art. 28 DSGVO. Mit beiden Anbietern bestehen Datenschutzverträge (DPA). Die Datenübertragung in die USA erfolgt auf Grundlage der EU-Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO).
          </p>
        </section>

        <section>
          <h2 className="text-base font-black text-primary uppercase tracking-widest mb-3">4. Cookies</h2>
          <p>
            Diese Website verwendet ausschließlich technisch notwendige Cookies (z. B. für die Admin-Authentifizierung). Es werden keine Tracking- oder Marketing-Cookies eingesetzt. Technisch notwendige Cookies können nicht abgelehnt werden, da die Website ohne sie nicht funktioniert. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.
          </p>
        </section>

        <section>
          <h2 className="text-base font-black text-primary uppercase tracking-widest mb-3">5. Ihre Rechte</h2>
          <p className="mb-3">Sie haben das Recht auf:</p>
          <ul className="list-disc list-inside space-y-1.5 ml-2">
            <li><strong className="text-primary">Auskunft</strong> (Art. 15 DSGVO) — welche Daten wir über Sie gespeichert haben</li>
            <li><strong className="text-primary">Berichtigung</strong> (Art. 16 DSGVO) — Korrektur unrichtiger Daten</li>
            <li><strong className="text-primary">Löschung</strong> (Art. 17 DSGVO) — Löschung Ihrer Daten</li>
            <li><strong className="text-primary">Einschränkung</strong> (Art. 18 DSGVO) — Einschränkung der Verarbeitung</li>
            <li><strong className="text-primary">Datenübertragbarkeit</strong> (Art. 20 DSGVO)</li>
            <li><strong className="text-primary">Widerspruch</strong> (Art. 21 DSGVO) — gegen die Verarbeitung auf Basis von berechtigtem Interesse</li>
          </ul>
          <p className="mt-4">
            Zur Ausübung Ihrer Rechte wenden Sie sich an: <a href="mailto:info@dreigewinnt.com" className="text-secondary hover:underline">info@dreigewinnt.com</a>
          </p>
        </section>

        <section>
          <h2 className="text-base font-black text-primary uppercase tracking-widest mb-3">6. Beschwerderecht</h2>
          <p>
            Sie haben das Recht, sich bei der zuständigen Aufsichtsbehörde zu beschweren. Für Hessen ist dies der Hessische Beauftragte für Datenschutz und Informationsfreiheit (HBDI), Postfach 3163, 65021 Wiesbaden, <a href="https://datenschutz.hessen.de" className="text-secondary hover:underline" target="_blank" rel="noopener noreferrer">datenschutz.hessen.de</a>.
          </p>
        </section>

      </div>
    </main>
  );
}
