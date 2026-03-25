import React, { useEffect, useState } from 'react';

const FacebookPrivacyPolicy: React.FC = () => {
  const [showBackTop, setShowBackTop] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('.section');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sections = [
    { id: 's1', num: '01', title: 'Données collectées' },
    { id: 's2', num: '02', title: 'Utilisation des données' },
    { id: 's3', num: '03', title: 'Partage des données' },
    { id: 's4', num: '04', title: 'Cookies' },
    { id: 's5', num: '05', title: 'Sécurité' },
    { id: 's6', num: '06', title: 'Vos droits' },
    { id: 's7', num: '07', title: 'Messenger' },
    { id: 's8', num: '08', title: 'Contact' },
  ];

  const dataCards = [
    { icon: '👤', title: 'Données d\'identité', desc: 'Nom, email, téléphone' },
    { icon: '💬', title: 'Messages', desc: 'Conversations via Messenger' },
    { icon: '📍', title: 'Localisation', desc: 'Ville, région, pays' },
    { icon: '🔧', title: 'Données techniques', desc: 'IP, navigateur' },
    { icon: '💳', title: 'Paiement', desc: 'Transactions sécurisées' },
    { icon: '📊', title: 'Données d\'usage', desc: 'Pages visitées, clics' },
  ];

  const rightsCards = [
    { icon: '👁️', title: 'Accès', desc: 'Obtenir une copie de vos données' },
    { icon: '✏️', title: 'Rectification', desc: 'Corriger des données inexactes' },
    { icon: '🗑️', title: 'Suppression', desc: 'Effacement de vos données' },
    { icon: '⛔', title: 'Opposition', desc: 'Vous opposer au traitement' },
    { icon: '📦', title: 'Portabilité', desc: 'Recevoir vos données' },
  ];

  return (
    <>
      {/* Header */}
      <header className="py-16 lg:py-20 text-center border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6">
          <div className="inline-flex items-center gap-3 mt-10 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              O
            </div>
            <span className="text-xl font-semibold text-gray-900">Oliplus</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Politique de <span className="text-blue-600">Confidentialité</span>
          </h1>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <span>📅 25 mars 2026</span>
            <span>🌍 Madagascar</span>
            <span>📖 5 min de lecture</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Table of Contents */}
        <nav className="bg-gray-50 border border-gray-200 rounded-2xl p-6 lg:p-8 mb-12">
          <div className="text-xs font-semibold tracking-wider uppercase text-gray-400 mb-5">
            Sommaire
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={(e) => scrollToSection(e, s.id)}
                className="flex items-center gap-3 text-sm text-gray-500 hover:text-blue-600 transition-colors py-2"
              >
                <span className="text-xs text-blue-600 min-w-7">{s.num}</span>
                {s.title}
              </a>
            ))}
          </div>
        </nav>

        {/* Intro */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-5 mb-12 text-blue-700">
          <strong>Oliplus</strong> protège vos données personnelles avec le plus grand soin.
        </div>

        {/* Section 1 - Données collectées */}
        <section id="s1" className="section mb-16 opacity-0 translate-y-5 transition-all duration-500">
          <div className="flex items-baseline gap-5 border-b border-gray-200 pb-3 mb-6">
            <span className="text-xl font-semibold text-blue-600 min-w-[50px]">01</span>
            <h2 className="text-2xl font-semibold text-gray-900">Données collectées</h2>
          </div>
          <div>
            <p className="text-gray-500 mb-6">Nous collectons uniquement les données nécessaires au bon fonctionnement de nos services.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dataCards.map((card, i) => (
                <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-all">
                  <div className="text-3xl mb-3">{card.icon}</div>
                  <div className="font-semibold text-gray-900 mb-1">{card.title}</div>
                  <div className="text-xs text-gray-400">{card.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2 - Utilisation des données */}
        <section id="s2" className="section mb-16 opacity-0 translate-y-5 transition-all duration-500">
          <div className="flex items-baseline gap-5 border-b border-gray-200 pb-3 mb-6">
            <span className="text-xl font-semibold text-blue-600 min-w-[50px]">02</span>
            <h2 className="text-2xl font-semibold text-gray-900">Utilisation des données</h2>
          </div>
          <div>
            <ul className="space-y-2">
              {['Créer et gérer votre compte utilisateur', 'Traiter vos commandes et réservations', 'Personnaliser votre expérience', 'Assurer la sécurité et prévenir les fraudes'].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-500">
                  <span className="text-blue-600">›</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Section 3 - Partage des données */}
        <section id="s3" className="section mb-16 opacity-0 translate-y-5 transition-all duration-500">
          <div className="flex items-baseline gap-5 border-b border-gray-200 pb-3 mb-6">
            <span className="text-xl font-semibold text-blue-600 min-w-[50px]">03</span>
            <h2 className="text-2xl font-semibold text-gray-900">Partage des données</h2>
          </div>
          <div>
            <p className="text-gray-500 mb-4">Nous ne vendons jamais vos données personnelles.</p>
            <ul className="space-y-2 mb-4">
              {[
                '<strong>Prestataires</strong> — hébergement, paiement, analytics',
                '<strong>Professionnels</strong> — pour la réalisation de vos demandes',
                '<strong>Autorités légales</strong> — uniquement si la loi l\'exige'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-500">
                  <span className="text-blue-600">›</span>
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg text-sm text-blue-700">
              Tout tiers recevant vos données est soumis à des garanties strictes.
            </div>
          </div>
        </section>

        {/* Section 4 - Cookies */}
        <section id="s4" className="section mb-16 opacity-0 translate-y-5 transition-all duration-500">
          <div className="flex items-baseline gap-5 border-b border-gray-200 pb-3 mb-6">
            <span className="text-xl font-semibold text-blue-600 min-w-[50px]">04</span>
            <h2 className="text-2xl font-semibold text-gray-900">Cookies & traceurs</h2>
          </div>
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="text-2xl mb-2">🔒</div>
                <div className="font-medium text-gray-900 text-sm mb-1">Essentiels</div>
                <div className="text-xs text-gray-400">Session, authentification</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="text-2xl mb-2">📈</div>
                <div className="font-medium text-gray-900 text-sm mb-1">Analytiques</div>
                <div className="text-xs text-gray-400">Mesure d'audience</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="text-2xl mb-2">⚙️</div>
                <div className="font-medium text-gray-900 text-sm mb-1">Fonctionnels</div>
                <div className="text-xs text-gray-400">Préférences utilisateur</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5 - Sécurité */}
        <section id="s5" className="section mb-16 opacity-0 translate-y-5 transition-all duration-500">
          <div className="flex items-baseline gap-5 border-b border-gray-200 pb-3 mb-6">
            <span className="text-xl font-semibold text-blue-600 min-w-[50px]">05</span>
            <h2 className="text-2xl font-semibold text-gray-900">Sécurité</h2>
          </div>
          <div>
            <ul className="space-y-2 mb-4">
              {['Chiffrement HTTPS/TLS', 'Hachage des mots de passe (bcrypt)', 'Protection XSS et injection SQL', 'Sauvegardes régulières et chiffrées'].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-500">
                  <span className="text-blue-600">›</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg text-sm text-green-700">
              En cas de violation, nous vous informerons dans les 72 heures.
            </div>
          </div>
        </section>

        {/* Section 6 - Vos droits */}
        <section id="s6" className="section mb-16 opacity-0 translate-y-5 transition-all duration-500">
          <div className="flex items-baseline gap-5 border-b border-gray-200 pb-3 mb-6">
            <span className="text-xl font-semibold text-blue-600 min-w-[50px]">06</span>
            <h2 className="text-2xl font-semibold text-gray-900">Vos droits</h2>
          </div>
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
              {rightsCards.map((right, i) => (
                <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center hover:border-blue-300 transition-all">
                  <div className="text-2xl mb-2">{right.icon}</div>
                  <div className="font-medium text-gray-900 text-sm mb-1">{right.title}</div>
                  <div className="text-xs text-gray-400">{right.desc}</div>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-sm">
              Contactez-nous pour exercer vos droits. Réponse sous <strong className="text-blue-600">30 jours</strong>.
            </p>
          </div>
        </section>

        {/* Section 7 - Messenger */}
        <section id="s7" className="section mb-16 opacity-0 translate-y-5 transition-all duration-500">
          <div className="flex items-baseline gap-5 border-b border-gray-200 pb-3 mb-6">
            <span className="text-xl font-semibold text-blue-600 min-w-[50px]">07</span>
            <h2 className="text-2xl font-semibold text-gray-900">Messenger & Facebook</h2>
          </div>
          <div>
            <ul className="space-y-2 mb-4">
              {['Messages transmis via webhook sécurisé (HTTPS + HMAC-SHA256)', 'PSID utilisé pour identifier vos conversations', 'Données non partagées avec Meta en dehors du service'].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-500">
                  <span className="text-blue-600">›</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg text-sm text-blue-700">
              Utilisation soumise à la{' '}
              <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
                Politique de confidentialité de Meta
              </a>.
            </div>
          </div>
        </section>

        {/* Section 8 - Contact */}
        <section id="s8" className="section mb-16 opacity-0 translate-y-5 transition-all duration-500">
          <div className="flex items-baseline gap-5 border-b border-gray-200 pb-3 mb-6">
            <span className="text-xl font-semibold text-blue-600 min-w-[50px]">08</span>
            <h2 className="text-2xl font-semibold text-gray-900">Contact</h2>
          </div>
          <div>
            <div className="flex flex-col sm:flex-row gap-5 bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">
                ✉️
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Délégué à la Protection des Données</p>
                <a href="mailto:privacy@oliplus.re" className="block text-blue-600 font-medium hover:underline mb-1">privacy@oliplus.re</a>
                <a href="https://oliplus.re" className="block text-blue-600 font-medium hover:underline">oliplus.re</a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6 mt-8">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">© 2026 Oliplus — Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-gray-400 hover:text-blue-600 transition-colors">Conditions</a>
            <a href="#" className="text-xs text-gray-400 hover:text-blue-600 transition-colors">Cookies</a>
            <a href="https://oliplus.re" className="text-xs text-gray-400 hover:text-blue-600 transition-colors">oliplus.re</a>
          </div>
        </div>
      </footer>

      {/* Back to Top */}
      <a
        href="#"
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 w-11 h-11 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all shadow-md ${
          showBackTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        ↑
      </a>

      <style>{`
        .section.visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </>
  );
};

export default FacebookPrivacyPolicy;