export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <div className="relative h-[60vh] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1600" alt="JL Vintage" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1812] via-[#1C1812]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-8 pb-16">
          <p className="font-sans text-[10px] tracking-[4px] uppercase text-[#8B6914] mb-3 animate-fade-up">Uber Uns</p>
          <h1 className="font-display text-6xl md:text-8xl font-black text-white italic animate-fade-up stagger-2">
            Leandro<br />&amp; Justin
          </h1>
        </div>
      </div>

      {/* Story */}
      <section className="py-24 max-w-5xl mx-auto px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-up">
            <p className="font-sans text-[10px] tracking-[4px] uppercase text-[#8B6914] mb-6">Unsere Geschichte</p>
            <h2 className="font-display text-4xl font-bold italic mb-8 leading-tight">
              Wir sind JL Vintage. Zwei Freunde mit einer Leidenschaft.
            </h2>
            <div className="space-y-5 font-body text-base text-[#6B6560] leading-relaxed">
              <p>
                Was als Flohmarktbesuche an Wochenenden begann, wurde schnell zu einer echten Leidenschaft. Leandro und Justin — beide aufgewachsen mit dem Gefuhl, dass Kleidung mehr sein kann als Konsum — begannen, gezielt nach Stucken zu suchen, die Bestand haben.
              </p>
              <p>
                Jedes Stuck in unserem Shop haben wir personlich in der Hand gehalten, gepruft, gewaschen und fur gut befunden. Kein automatischer Einkauf, kein blindes Weiterverkaufen. Nur Sachen, die wir selbst tragen wurden.
              </p>
              <p>
                JL Vintage steht fur Authentizitat, Qualitat und den Glauben, dass echte Mode keine Saisons braucht.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[3/4] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600" alt="Vintage fashion" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 overflow-hidden border-4 border-[#F7F3EC]">
              <img src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=300" alt="Vintage detail" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-[#1C1812]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="divider-vintage mb-16" style={{ '--tw-text-opacity': '1', color: '#8B6914' } as React.CSSProperties}>
            <span className="font-display italic text-lg text-[#8B6914]">Was uns antreibt</span>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: 'Handverlesen', desc: 'Jedes Stuck wird personlich ausgesucht. Kein Massenimport, keine Filter-Algorithmen.' },
              { title: 'Authentisch', desc: 'Original-Vintage ohne Repros. Echte Geschichte, echtes Material, echte Patina.' },
              { title: 'Nachhaltig', desc: 'Secondhand ist nicht Kompromiss — es ist die beste Wahl fur Mensch und Planet.' },
            ].map((v, i) => (
              <div key={v.title} className="border-t border-[#E8DFC8]/20 pt-8">
                <span className="font-sans text-[10px] tracking-[4px] uppercase text-[#8B6914]">0{i + 1}</span>
                <h3 className="font-display text-2xl font-bold text-white mt-3 mb-4">{v.title}</h3>
                <p className="font-body text-[#E8DFC8]/60 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center px-8">
        <h2 className="font-display text-5xl font-bold italic mb-6">Bereit, dein Stuck zu finden?</h2>
        <p className="font-body text-lg text-[#6B6560] mb-10">Der Shop wartet auf dich.</p>
        <a href="/shop" className="btn-primary">Zum Shop</a>
      </section>
    </div>
  );
}
