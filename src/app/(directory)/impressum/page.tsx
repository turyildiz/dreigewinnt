export default function ImpressumPage() {
  return (
    <main className="px-4 sm:px-8 lg:px-12 pt-8 lg:pt-14 pb-20 max-w-3xl">
      <div className="mb-10">
        <span className="bg-surface-container-highest text-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">Rechtliches</span>
        <h1 className="text-4xl sm:text-5xl font-headline font-black tracking-tighter text-primary leading-none mt-4 mb-2">Impressum</h1>
        <p className="text-on-surface-variant text-sm">Angaben gemäß § 5 TMG</p>
      </div>

      <div className="prose prose-sm max-w-none space-y-8 text-on-surface-variant leading-relaxed">

        <section>
          <h2 className="text-base font-black text-primary uppercase tracking-widest mb-3">Betreiber</h2>
          <p>
            Turgay Yildiz<br />
            [Straße und Hausnummer]<br />
            [PLZ] [Stadt]<br />
            Deutschland
          </p>
        </section>

        <section>
          <h2 className="text-base font-black text-primary uppercase tracking-widest mb-3">Kontakt</h2>
          <p>
            E-Mail: <a href="mailto:info@dreigewinnt.com" className="text-secondary hover:underline">info@dreigewinnt.com</a>
          </p>
        </section>

        <section>
          <h2 className="text-base font-black text-primary uppercase tracking-widest mb-3">Verantwortlich für den Inhalt</h2>
          <p>
            Turgay Yildiz<br />
            (Anschrift wie oben)
          </p>
        </section>

        <section>
          <h2 className="text-base font-black text-primary uppercase tracking-widest mb-3">Haftungsausschluss</h2>
          <h3 className="font-bold text-primary mb-1">Haftung für Inhalte</h3>
          <p className="mb-4">
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
          </p>
          <h3 className="font-bold text-primary mb-1">Haftung für Links</h3>
          <p>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
          </p>
        </section>

        <section>
          <h2 className="text-base font-black text-primary uppercase tracking-widest mb-3">Urheberrecht</h2>
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>
        </section>

      </div>
    </main>
  );
}
