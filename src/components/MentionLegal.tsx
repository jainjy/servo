import { useState } from 'react';
import { 
  Building2, 
  FileText, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Scale, 
  Shield,
  BookOpen,
  ChevronDown,
  ExternalLink,
  User,
  Banknote,
  AlertTriangle,
  Clock
} from 'lucide-react';

const LegalMentionsWidget = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const legalSections = [
    {
      id: 'company',
      title: 'Informations Société',
      icon: Building2,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Identité
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><strong>Raison sociale :</strong> VOTRE ENTREPRISE SAS</li>
                <li><strong>Forme juridique :</strong> Société par Actions Simplifiée</li>
                <li><strong>Capital social :</strong> 50 000 €</li>
                <li><strong>SIRET :</strong> 123 456 789 00012</li>
                <li><strong>RCS :</strong> Paris B 123 456 789</li>
                <li><strong>Code APE :</strong> 6201Z</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Siège Social
              </h4>
              <address className="not-italic text-sm text-gray-700 space-y-2">
                <p>123 Avenue des Champs-Élysées</p>
                <p>75008 Paris</p>
                <p>France</p>
              </address>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'publication',
      title: 'Directeur de la Publication',
      icon: User,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-5 rounded-xl">
            <div className="flex items-start gap-4">
              <User className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Monsieur Jean Dupont</h4>
                <p className="text-gray-700 text-sm mb-3">Président Directeur Général</p>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <a href="mailto:contact@entreprise.com" className="hover:text-blue-600">
                      contact@entreprise.com
                    </a>
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <a href="tel:+33123456789" className="hover:text-blue-600">
                      +33 1 23 45 67 89
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'hosting',
      title: 'Hébergement',
      icon: Globe,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-gray-50 to-white p-5 rounded-xl border">
            <div className="flex items-start gap-4">
              <Globe className="w-5 h-5 text-gray-700 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-2">Prestataire d'Hébergement</h4>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-900">OVH SAS</p>
                    <p className="text-sm text-gray-600">2 rue Kellermann - 59100 Roubaix - France</p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">99,9% Uptime</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-700">Certifié ISO 27001</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Garanties Techniques
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                Serveurs localisés en France (RGPD compliant)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                Certificats SSL 256-bit pour toutes les connexions
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                Sauvegardes quotidiennes automatisées
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                Protection DDoS avancée
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'intellectual',
      title: 'Propriété Intellectuelle',
      icon: BookOpen,
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-purple-50 to-white p-5 rounded-xl border border-purple-100">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Droits d'Auteur
            </h4>
            <div className="space-y-3 text-gray-700">
              <p>
                L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur 
                et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les 
                documents téléchargeables et les représentations iconographiques et photographiques.
              </p>
              <div className="bg-white p-4 rounded-lg border">
                <p className="font-medium text-gray-900 mb-2">Utilisation autorisée :</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Consultation privée et usage personnel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Citations courtes avec mention de la source</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Reproduction interdite sans autorisation écrite</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Marques déposées</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded border flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded">
                  <span className="text-blue-600 font-bold">®</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Nom du Site</p>
                  <p className="text-xs text-gray-500">INPI 2023-123456</p>
                </div>
              </div>
              <div className="bg-white p-3 rounded border flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded">
                  <span className="text-green-600 font-bold">™</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Logo et identité</p>
                  <p className="text-xs text-gray-500">Dépôt 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'liability',
      title: 'Limitations de Responsabilité',
      icon: Scale,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-50 to-white p-6 rounded-xl border border-red-100">
            <div className="flex items-start gap-4">
              <Scale className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Clause de non-responsabilité</h4>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Les informations contenues sur ce site sont présentées à titre indicatif et peuvent être modifiées 
                    sans préavis. L'éditeur ne saurait garantir l'exactitude, l'exhaustivité ou l'actualité des 
                    informations diffusées.
                  </p>
                  <div className="bg-white p-4 rounded-lg border">
                    <p className="font-medium text-gray-900 mb-2">Exclusions :</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>Dommages indirects ou consécutifs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>Pertes de données ou d'exploitation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>Liens hypertextes vers sites tiers</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Mises à jour
              </h4>
              <p className="text-sm text-gray-700">
                Le site est mis à jour régulièrement. En cas de divergence, les versions PDF datées 
                font foi sur les versions en ligne.
              </p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Liens externes
              </h4>
              <p className="text-sm text-gray-700">
                Les liens vers des sites externes n'engagent pas notre responsabilité quant à leur contenu 
                ou leur disponibilité.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'compliance',
      title: 'Conformité Réglementaire',
      icon: Shield,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-50 to-white p-6 rounded-xl border border-emerald-100">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-3">Cadre Légal</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-emerald-600 font-bold text-lg mb-2">RGPD</div>
                    <p className="text-sm text-gray-600">Règlement Général sur la Protection des Données</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-blue-600 font-bold text-lg mb-2">LCEN</div>
                    <p className="text-sm text-gray-600">Loi pour la Confiance dans l'Économie Numérique</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-purple-600 font-bold text-lg mb-2">DMCA</div>
                    <p className="text-sm text-gray-600">Digital Millennium Copyright Act</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 text-white p-5 rounded-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  Médiation des litiges
                </h4>
                <p className="text-gray-300 text-sm">
                  En cas de litige, les tribunaux compétents sont ceux du ressort de la Cour d'Appel de Paris.
                </p>
              </div>
              <a 
                href="https://www.economie.gouv.fr/mediation-conso"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-gray-900 hover:bg-gray-100 px-4 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
              >
                Médiateur de la consommation
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )
    }
  ];

  const contactInfo = {
    email: 'legal@entreprise.com',
    phone: '+33 1 23 45 67 90',
    address: 'Service Juridique - 123 Avenue des Champs-Élysées, 75008 Paris',
    hours: 'Lundi au Vendredi, 9h-18h'
  };

  return (
    <div className="w-full mt-16 max-w-7xl mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                Mentions Légales
              </h1>
              <p className="text-gray-600 mt-1">
                Conformément aux dispositions de la loi n°2004-575 du 21 juin
                2004
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-sm text-gray-500 mb-2">
              Version en vigueur au
            </div>
            <div className="px-4 py-2 bg-gray-100 rounded-lg font-medium text-gray-900">
              {new Date().toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Bandeau d'information */}
        <div className="bg-gradient-to-r from-blue-900 to-gray-900 text-white rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-3">
                Informations Légales Complètes
              </h2>
              <p className="text-blue-100">
                Ce document constitue les mentions légales du site. Pour toute
                question relative à ces informations, veuillez contacter notre
                service juridique.
              </p>
            </div>
            <div className="flex gap-4">
              <a
                href="/mentions-legales.pdf"
                className="px-5 py-3 bg-white text-gray-900 hover:bg-gray-100 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-md"
              >
                <FileText className="w-5 h-5" />
                Version PDF
              </a>
              <a
                href="/confidentialite"
                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Shield className="w-5 h-5" />
                Vie Privée
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Sections principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {legalSections.map((section) => (
              <div
                key={section.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-gray-100 rounded-lg">
                      <section.icon className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {section.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Cliquez pour{" "}
                        {expandedSections[section.id]
                          ? "réduire"
                          : "développer"}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedSections[section.id] ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedSections[section.id]
                      ? "max-h-[2000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                    {section.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar avec informations de contact */}
        <div className="space-y-6">
          <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Juridique
            </h3>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email légal</p>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="font-medium text-gray-900 hover:text-blue-600"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Phone className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="font-medium text-gray-900 hover:text-blue-600"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <MapPin className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Adresse postale</p>
                  <p className="font-medium text-gray-900">
                    {contactInfo.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Horaires</p>
                  <p className="font-medium text-gray-900">
                    {contactInfo.hours}
                  </p>
                </div>
              </div>
            </div>

            {/* <div className="mt-8 pt-6 border-t border-gray-200">
              <a 
                href="/contact-juridique"
                className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                Formulaire de contact
                <ExternalLink className="w-4 h-4" />
              </a>
            </div> */}
          </div>

          {/* Documents légaux */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-6">
              Documents Officiels
            </h3>
            <div className="space-y-3">
              {[
                {
                  name: "Statuts de la société",
                  format: "PDF",
                  size: "2.4 MB",
                },
                { name: "Procès-verbal AG", format: "PDF", size: "1.8 MB" },
                { name: "Attestation RCS", format: "PDF", size: "1.2 MB" },
                { name: "Certificat INSEE", format: "PDF", size: "0.9 MB" },
              ].map((doc, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 rounded">
                      <FileText className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-blue-600">
                        {doc.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {doc.format} • {doc.size}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalMentionsWidget;