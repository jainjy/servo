import React, { useEffect, useState, useRef } from 'react';

const FacebookConditionsService: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  
  const accordionRefs = useRef<HTMLDivElement[]>([]);

  // Progress bar handler
  useEffect(() => {
    const handleScroll = () => {
      const h = document.documentElement;
      const pct = (window.scrollY / (h.scrollHeight - h.clientHeight)) * 100;
      setProgress(pct);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4 }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Scroll reveal observer
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    const sections = document.querySelectorAll('.section');
    sections.forEach((section) => revealObserver.observe(section));

    return () => revealObserver.disconnect();
  }, []);

  // Accordion toggle handler
  const toggleAccordion = (index: number) => {
    const item = accordionRefs.current[index];
    if (item) {
      const body = item.querySelector('.acc-body') as HTMLElement;
      const isOpen = item.classList.contains('open');

      accordionRefs.current.forEach((ref) => {
        if (ref) {
          ref.classList.remove('open');
          const bodyEl = ref.querySelector('.acc-body') as HTMLElement;
          if (bodyEl) bodyEl.style.maxHeight = '';
        }
      });

      if (!isOpen) {
        item.classList.add('open');
        if (body) body.style.maxHeight = body.scrollHeight + 'px';
      }
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setSidebarOpen(false);
    }
  };

  const sections = [
    { id: 's1', num: '01', title: 'Définitions' },
    { id: 's2', num: '02', title: 'Acceptation' },
    { id: 's3', num: '03', title: 'Services' },
    { id: 's4', num: '04', title: 'Compte utilisateur' },
    { id: 's5', num: '05', title: 'Obligations' },
    { id: 's6', num: '06', title: 'Contenu & propriété' },
    { id: 's7', num: '07', title: 'Paiements' },
    { id: 's8', num: '08', title: 'Responsabilité' },
    { id: 's9', num: '09', title: 'Résiliation' },
    { id: 's10', num: '10', title: 'Modifications' },
    { id: 's11', num: '11', title: 'Droit applicable' },
    { id: 's12', num: '12', title: 'Contact' },
  ];

  const services = [
    { name: 'Marketplace', desc: 'Achat et vente de produits', access: 'Gratuit', badge: 'green' },
    { name: 'Services professionnels', desc: 'Mise en relation avec des prestataires', access: 'Gratuit', badge: 'green' },
    { name: 'Tourisme & réservations', desc: 'Réservation d\'hébergements, activités', access: 'Gratuit', badge: 'green' },
    { name: 'Formations & alternance', desc: 'Formations professionnelles', access: 'Freemium', badge: 'yellow' },
    { name: 'Espace Pro', desc: 'Outils avancés pour professionnels', access: 'Premium', badge: 'red' },
    { name: 'Chatbot & IA', desc: 'Assistant intelligent', access: 'Gratuit', badge: 'green' },
  ];

  const definitions = [
    { term: 'Oliplus', desc: 'La plateforme numérique accessible à l\'adresse oliplus.re' },
    { term: 'Utilisateur', desc: 'Toute personne physique ou morale qui accède à la plateforme' },
    { term: 'Compte', desc: 'L\'espace personnel créé après inscription' },
    { term: 'Services', desc: 'L\'ensemble des fonctionnalités proposées par Oliplus' },
  ];

  return (
    <>
      {/* Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-blue-600 z-50 transition-all duration-100"
        style={{ width: `${progress}%` }}
      />

      {/* Mobile Menu Toggle */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 bg-blue-600 text-white rounded-lg w-11 h-11 flex items-center justify-center text-xl shadow-lg lg:hidden"
      >
        ☰
      </button>
      
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside 
        className={`fixed top-0  left-0 w-72 h-full bg-white border-r border-gray-200 p-8 overflow-y-auto z-40 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 mt-20 mb-10">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            O
          </div>
          <span className="text-lg font-semibold text-gray-900">Oliplus</span>
        </div>

        <div className="text-xs font-semibold tracking-wider uppercase text-gray-400 mb-3">Navigation</div>
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={(e) => scrollToSection(e, section.id)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-1 ${
              activeSection === section.id
                ? 'bg-gray-100 text-blue-600 font-medium'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="text-xs text-gray-400 w-6">{section.num}</span>
            {section.title}
          </a>
        ))}

        <div className="mt-10 pt-6 border-t border-gray-200 text-xs text-gray-400">
          Version 2.0 — 25 mars 2026<br />
          © 2026 Oliplus
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen">
        {/* Hero */}
        <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-200 px-6 py-16 lg:px-16 lg:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-blue-600 mb-6">
              Document légal
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Conditions<br />
              <span className="text-blue-600">de Service</span>
            </h1>
            <p className="text-gray-500 max-w-lg mb-8">
              Ces conditions régissent l'utilisation de la plateforme Oliplus.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 pt-6 border-t border-gray-200">
              <div>
                <div className="text-xs font-medium uppercase text-gray-400">Entrée en vigueur</div>
                <div className="text-sm font-medium text-gray-900">25 mars 2026</div>
              </div>
              <div>
                <div className="text-xs font-medium uppercase text-gray-400">Version</div>
                <div className="text-sm font-medium text-gray-900">2.0</div>
              </div>
              <div>
                <div className="text-xs font-medium uppercase text-gray-400">Juridiction</div>
                <div className="text-sm font-medium text-gray-900">Madagascar</div>
              </div>
            </div>
          </div>
        </div>

        {/* Alert */}
        <div className="bg-amber-50 border-l-4 border-amber-400 px-6 py-4 lg:px-16">
          <div className="max-w-4xl mx-auto flex gap-3 text-sm text-amber-700">
            <span>⚠️</span>
            <span>En utilisant Oliplus, vous acceptez intégralement ces conditions.</span>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-12 lg:px-16 lg:py-16">
          <div className="max-w-3xl mx-auto">
            {/* Section 1 - Définitions */}
            <section id="s1" className="section mb-16 opacity-0 translate-y-5 transition-all duration-500">
              <div className="flex items-baseline gap-5 border-b border-gray-200 pb-3 mb-6">
                <span className="text-xl font-semibold text-blue-600 min-w-[50px]">01</span>
                <h2 className="text-2xl font-semibold text-gray-900">Définitions</h2>
              </div>
              <div>
                <p className="text-gray-500 mb-4">Dans les présentes conditions, les termes ci-dessous ont la signification suivante :</p>
                <div className="space-y-3">
                  {definitions.map((def, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-4 py-3 border-b border-gray-100">
                      <span className="font-semibold text-gray-900">{def.term}</span>
                      <span className="text-gray-500 text-sm">{def.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 2 - Acceptation */}
            <section id="s2" className="section mb-16 opacity-0 translate-y-5 transition-all duration-500">
              <div className="flex items-baseline gap-5 border-b border-gray-200 pb-3 mb-6">
                <span className="text-xl font-semibold text-blue-600 min-w-[50px]">02</span>
                <h2 className="text-2xl font-semibold text-gray-900">Acceptation des conditions</h2>
              </div>
              <div>
                <p className="text-gray-500 mb-4">L'accès à la plateforme Oliplus implique l'acceptation pleine et entière des présentes CGS.</p>
                <ul className="space-y-2 mb-4">
                  {['La création d\'un compte utilisateur', 'La navigation sur le site ou l\'application', 'L\'utilisation de tout service proposé'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-500">
                      <span className="text-blue-600">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg text-sm text-amber-700">
                  Les mineurs doivent obtenir l'accord de leur représentant légal.
                </div>
              </div>
            </section>

            {/* Section 3 - Services */}
            <section id="s3" className="section mb-16 opacity-0 translate-y-5 transition-all duration-500">
              <div className="flex items-baseline gap-5 border-b border-gray-200 pb-3 mb-6">
                <span className="text-xl font-semibold text-blue-600 min-w-[50px]">03</span>
                <h2 className="text-2xl font-semibold text-gray-900">Description des services</h2>
              </div>
              <div>
                <p className="text-gray-500 mb-4">Oliplus est une plateforme multi-services qui propose notamment :</p>
                <div className="overflow-x-auto border border-gray-200 rounded-xl mb-4">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Service</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Description</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Accès</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((s, i) => (
                        <tr key={i} className="border-b border-gray-100 last:border-0">
                          <td className="px-4 py-3 text-gray-900">{s.name}</td>
                          <td className="px-4 py-3 text-gray-500">{s.desc}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              s.badge === 'green' ? 'bg-green-100 text-green-700' :
                              s.badge === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {s.access}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg text-sm text-blue-700">
                  Oliplus se réserve le droit de modifier ses services à tout moment.
                </div>
              </div>
            </section>

            {/* Section 4 - Compte utilisateur */}
            <section id="s4" className="section mb-16 opacity-0 translate-y-5 transition-all duration-500">
              <div className="flex items-baseline gap-5 border-b border-gray-200 pb-3 mb-6">
                <span className="text-xl font-semibold text-blue-600 min-w-[50px]">04</span>
                <h2 className="text-2xl font-semibold text-gray-900">Compte utilisateur</h2>
              </div>
              <div>
                <p className="text-gray-500 mb-4">En créant un compte, vous vous engagez à :</p>
                <ul className="space-y-2 mb-4">
                  {['Fournir des informations exactes et à jour', 'Maintenir la confidentialité de vos identifiants', 'Être responsable des activités sous votre compte'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-500">
                      <span className="text-blue-600">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg text-sm text-red-700">
                  Chaque personne ne peut détenir qu'un seul compte actif.
                </div>
              </div>
            </section>

            {/* Section 5 - Obligations */}
            <section id="s5" className="section mb-16 opacity-0 translate-y-5 transition-all duration-500">
              <div className="flex items-baseline gap-5 border-b border-gray-200 pb-3 mb-6">
                <span className="text-xl font-semibold text-blue-600 min-w-[50px]">05</span>
                <h2 className="text-2xl font-semibold text-gray-900">Obligations</h2>
              </div>
              <div>
                <p className="text-gray-500 mb-4">Comportements interdits :</p>
                <ul className="space-y-2">
                  {['Publier des contenus illicites ou diffamatoires', 'Tenter de pirater ou perturber la plateforme', 'Usurper l\'identité d\'une autre personne', 'Envoyer des communications non sollicitées (spam)'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-500">
                      <span className="text-blue-600">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Section 6 - Contenu & propriété */}
            <section id="s6" className="section mb-16 opacity-0 translate-y-5 transition-all duration-500">
              <div className="flex items-baseline gap-5 border-b border-gray-200 pb-3 mb-6">
                <span className="text-xl font-semibold text-blue-600 min-w-[50px]">06</span>
                <h2 className="text-2xl font-semibold text-gray-900">Contenu & propriété intellectuelle</h2>
              </div>
              <div>
                <p className="text-gray-500 mb-4">La plateforme Oliplus et ses éléments sont protégés par les droits de propriété intellectuelle.</p>
                
                <div className="space-y-2">
                  {[
                    { title: 'Contenu Oliplus', content: 'Toute reproduction est interdite sans autorisation.' },
                    { title: 'Contenu utilisateur', content: 'Vous accordez une licence pour l\'utilisation de votre contenu.' },
                    { title: 'Contenu interdit', content: 'Contenu illicite, violent ou discriminatoire interdit.' },
                  ].map((item, idx) => (
                    <div key={idx} className="acc-item border border-gray-200 rounded-xl overflow-hidden" ref={(el) => { if (el) accordionRefs.current[idx] = el; }}>
                      <div 
                        className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors font-medium text-gray-900"
                        onClick={() => toggleAccordion(idx)}
                      >
                        <span>{item.title}</span>
                        <span className="acc-arrow text-gray-400 transition-transform duration-200">▼</span>
                      </div>
                      <div className="acc-body max-h-0 overflow-hidden transition-all duration-300">
                        <div className="p-4 pt-0 border-t border-gray-200 text-sm text-gray-500">
                          {item.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 7 - Paiements */}
            <section id="s7" className="section mb-16 opacity-0 translate-y-5 transition-all duration-500">
              <div className="flex items-baseline gap-5 border-b border-gray-200 pb-3 mb-6">
                <span className="text-xl font-semibold text-blue-600 min-w-[50px]">07</span>
                <h2 className="text-2xl font-semibold text-gray-900">Paiements & abonnements</h2>
              </div>
              <div>
                <ul className="space-y-2 mb-4">
                  {['Prix affichés en Ariary (MGA) ou Euro (EUR) TTC', 'Paiement dû immédiatement lors de la commande', 'Transactions sécurisées par Stripe', 'Abonnements à renouvellement automatique'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-500">
                      <span className="text-blue-600">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg text-sm text-blue-700">
                  Contactez le support dans les 7 jours suivant l'achat pour toute demande de remboursement.
                </div>
              </div>
            </section>

            {/* Section 8 - Responsabilité */}
            <section id="s8" className="section mb-16 opacity-0 translate-y-5 transition-all duration-500">
              <div className="flex items-baseline gap-5 border-b border-gray-200 pb-3 mb-6">
                <span className="text-xl font-semibold text-blue-600 min-w-[50px]">08</span>
                <h2 className="text-2xl font-semibold text-gray-900">Limitation de responsabilité</h2>
              </div>
              <div>
                <ul className="space-y-2">
                  {['Oliplus agit en tant qu\'intermédiaire', 'Non responsable des dommages indirects', 'Non garantie de disponibilité continue'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-500">
                      <span className="text-blue-600">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Section 9 - Résiliation */}
            <section id="s9" className="section mb-16 opacity-0 translate-y-5 transition-all duration-500">
              <div className="flex items-baseline gap-5 border-b border-gray-200 pb-3 mb-6">
                <span className="text-xl font-semibold text-blue-600 min-w-[50px]">09</span>
                <h2 className="text-2xl font-semibold text-gray-900">Résiliation</h2>
              </div>
              <div>
                <ul className="space-y-2">
                  {['Suppression de compte à tout moment via les paramètres', 'Suspension en cas de violation des conditions', 'Suppression définitive en cas de violation grave'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-500">
                      <span className="text-blue-600">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Section 10 - Modifications */}
            <section id="s10" className="section mb-16 opacity-0 translate-y-5 transition-all duration-500">
              <div className="flex items-baseline gap-5 border-b border-gray-200 pb-3 mb-6">
                <span className="text-xl font-semibold text-blue-600 min-w-[50px]">10</span>
                <h2 className="text-2xl font-semibold text-gray-900">Modifications</h2>
              </div>
              <div>
                <ul className="space-y-2">
                  {['Notification 15 jours avant toute modification substantielle', 'Poursuite d\'utilisation = acceptation des nouvelles conditions'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-500">
                      <span className="text-blue-600">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Section 11 - Droit applicable */}
            <section id="s11" className="section mb-16 opacity-0 translate-y-5 transition-all duration-500">
              <div className="flex items-baseline gap-5 border-b border-gray-200 pb-3 mb-6">
                <span className="text-xl font-semibold text-blue-600 min-w-[50px]">11</span>
                <h2 className="text-2xl font-semibold text-gray-900">Droit applicable</h2>
              </div>
              <div>
                <p className="text-gray-500 mb-4">Les présentes CGS sont soumises au droit malgache.</p>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg text-sm text-blue-700">
                  Litiges soumis aux tribunaux d'Antananarivo.
                </div>
              </div>
            </section>

            {/* Section 12 - Contact */}
            <section id="s12" className="section mb-16 opacity-0 translate-y-5 transition-all duration-500">
              <div className="flex items-baseline gap-5 border-b border-gray-200 pb-3 mb-6">
                <span className="text-xl font-semibold text-blue-600 min-w-[50px]">12</span>
                <h2 className="text-2xl font-semibold text-gray-900">Contact</h2>
              </div>
              <div>
                <div className="flex flex-col sm:flex-row gap-5 bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">
                    ✉️
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Service juridique & Support</p>
                    <a href="mailto:legal@oliplus.re" className="block text-blue-600 font-medium hover:underline mb-1">legal@oliplus.re</a>
                    <a href="mailto:support@oliplus.re" className="block text-blue-600 font-medium hover:underline">support@oliplus.re</a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-200 px-6 py-6 lg:px-16">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-400">© 2026 Oliplus — Conditions de Service v2.0</p>
            <div className="flex gap-6">
              <a href="#" className="text-xs text-gray-400 hover:text-blue-600 transition-colors">Confidentialité</a>
              <a href="#" className="text-xs text-gray-400 hover:text-blue-600 transition-colors">Cookies</a>
              <a href="https://oliplus.re" className="text-xs text-gray-400 hover:text-blue-600 transition-colors">oliplus.re</a>
            </div>
          </div>
        </footer>
      </main>

      <style>{`
        .section.visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .acc-item.open .acc-arrow {
          transform: rotate(180deg);
        }
      `}</style>
    </>
  );
};

export default FacebookConditionsService;