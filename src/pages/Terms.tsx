import React, { useState, useEffect } from "react";
import { ArrowLeft, Book, BookOpen, BookUp2Icon, CheckCheck, ChevronRight, CreditCard, DoorClosed, LampWallUp, Layers, PhoneCall, RefreshCcw, Scale, Scale3D, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Terms() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(1);
  const [isHovering, setIsHovering] = useState(false);

  const sections = [
    {
      id: 1,
      title: "1. Objet du service",
      icon: <BookOpen />,
      content: `OLIPLUS est une plateforme numérique intégrée mettant en relation des utilisateurs autour de multiples services :
      
      • Immobilier (vente, location, locations saisonnières)
      • Produits et équipements
      • Services professionnels et artisanaux
      • Bien-être et services associés
      • Tourisme et hébergement
      • Conseils et accompagnement
      • Financement et services bancaires
      
      L'accès au service est soumis à la création d'un compte utilisateur et au respect des présentes conditions.`,
    },
    {
      id: 2,
      title: "2. Création de compte et sécurité",
      icon: <Layers />,
      content: `Lors de votre inscription, vous vous engagez à fournir des informations exactes, complètes et à jour. Notamment :
      
      • Identité vérifiée
      • Adresse email valide
      • Numéro de téléphone actif
      • Données professionnelles (si applicable)
      
      Vous êtes entièrement responsable :
      • Du maintien de la confidentialité de vos identifiants
      • De la sécurité de votre compte
      • De toutes les activités réalisées sous votre compte
      
      En cas d'accès non autorisé, signalez-le immédiatement.`,
    },
    {
      id: 3,
      title: "3. Utilisation acceptable du service",
      icon: <CheckCheck />,
      content: `Vous vous engagez à utiliser OLIPLUS de manière :
      
      ✓ Légale et conforme à la loi
      ✓ Respectueuse envers les autres utilisateurs
      ✓ Cohérente avec l'objectif de la plateforme
      ✓ Honnête et transparente
      
      Sont strictement interdits :
      ✗ Fraude, malhonnêteté, tromperie
      ✗ Contenu illicite, violent ou discriminatoire
      ✗ Harcèlement, menaces, intimidation
      ✗ Usurpation d'identité
      ✗ Spam, manipulation d'annonces
      ✗ Blanchiment d'argent, fraude
      
      Toute violation entraîne la suspension ou suppression du compte.`,
    },
    {
      id: 4,
      title: "4. Contenus publiés par les utilisateurs",
      icon: <BookUp2Icon />,
      content: `Propriété intellectuelle :
      
      Vous restez propriétaire intégral des contenus que vous publiez (textes, photos, vidéos, descriptions).
      
      Licence accordée à OLIPLUS :
      Vous accordez à OLIPLUS une licence non-exclusive, gratuite et mondiale pour :
      • Afficher et distribuer votre contenu
      • Améliorer et adapter le service
      • Utiliser à des fins analytiques
      
      Responsabilité du contenu :
      Vous vous engagez à ne pas publier :
      • Contenu illicite ou contraire à la loi
      • Contenu diffamatoire ou calomnieux
      • Contenu violant les droits d'autrui
      • Spam ou contenu malveillant
      • Données personnelles d'autrui sans consentement
      
      OLIPLUS se réserve le droit de supprimer ou modérer tout contenu violant ces règles.`,
    },
    {
      id: 5,
      title: "5. Transactions et paiements",
      icon: <CreditCard />,
      content: `Responsabilité des transactions :
      
      OLIPLUS met en relation les utilisateurs mais n'est pas partie aux transactions.
      Les utilisateurs sont seuls responsables :
      • De la légalité des transactions
      • De la qualité des biens/services
      • Du règlement des litiges
      
      Paiements sécurisés :
      • Tous les paiements sont chiffrés (SSL/TLS)
      • Données bancaires jamais stockées
      • Conformité PCI-DSS garantie
      
      Annulations et remboursements :
      Soumis aux politiques spécifiques de chaque catégorie de service et aux dispositions légales applicables.`,
    },
    {
      id: 6,
      title: "6. Protection des données personnelles",
      icon: <Shield />,
      content: `Conformité RGPD :
      OLIPLUS collecte et traite vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD).
      
      Données collectées :
      • Données d'inscription (nom, email, téléphone)
      • Données de profil et professionnelles
      • Données de navigation et d'utilisation
      • Données de géolocalisation (avec consentement)
      • Données transactionnelles
      
      Vos droits :
      ✓ Droit d'accès à vos données
      ✓ Droit de rectification
      ✓ Droit à l'oubli (suppression)
      ✓ Droit à la portabilité
      ✓ Droit d'opposition
      ✓ Droit à la limitation du traitement
      
      Pour plus d'informations, consultez notre Politique de Confidentialité.`,
    },
    {
      id: 7,
      title: "7. Limitation de responsabilité",
      icon: <Scale />,
      content: `Limitation générale :
      OLIPLUS s'efforce de maintenir la plateforme en ligne 24h/24. Nous ne garantissons cependant pas :
      • L'absence d'interruptions
      • L'absence d'erreurs ou de bugs
      • La compatibilité avec tous les appareils
      • La disponibilité constante
      
      Non-responsabilité :
      En aucun cas, OLIPLUS ne saurait être tenue responsable des dommages :
      • Directs ou indirects
      • Résultant de l'utilisation ou de l'impossibilité d'utilisation
      • Résultant d'interactions entre utilisateurs
      • Résultant de pertes de données
      
      Les utilisateurs sont seuls responsables :
      • Des contenus publiés
      • Des interactions avec d'autres utilisateurs
      • Des données partagées sur la plateforme`,
    },
    {
      id: 8,
      title: "8. Propriété intellectuelle",
      icon: "©️",
      content: `Droits de OLIPLUS :
      L'ensemble du contenu de la plateforme (design, logo, code, textes, graphismes, vidéos) est la propriété exclusive de OLIPLUS ou de ses partenaires.
      
      Toute reproduction, représentation, modification ou exploitation non autorisée est strictement interdite.
      
      Licence utilisateur :
      Vous disposez d'une licence personnelle, non-exclusive et limitée pour accéder et utiliser la plateforme conformément à ces conditions.`,
    },
    {
      id: 9,
      title: "9. Modification des conditions",
      icon: <RefreshCcw />,
      content: `Droit de modification :
      OLIPLUS se réserve le droit de modifier à tout moment les présentes conditions d'utilisation.
      
      Notification :
      • Les modifications importantes seront notifiées aux utilisateurs
      • Un avis sera affiché sur la plateforme
      • Les utilisateurs auront un délai de 30 jours pour accepter
      
      Poursuite d'utilisation :
      La poursuite de l'utilisation de la plateforme après notification constitue l'acceptation des nouvelles conditions.`,
    },
    {
      id: 10,
      title: "10. Résiliation du compte",
      icon: <DoorClosed />,
      content: `Résiliation par l'utilisateur :
      Vous pouvez résilier votre compte à tout moment via vos paramètres de compte.
      
      Résiliation par OLIPLUS :
      OLIPLUS se réserve le droit de suspendre ou supprimer un compte en cas de :
      • Violation des présentes conditions
      • Activité frauduleuse
      • Non-paiement des frais
      • Menace ou harcèlement
      • Autres raisons légitimes
      
      Conséquences :
      • Accès aux données après délai légal
      • Suppression définitive possible
      • Conservation des données pour obligations légales`,
    },
    {
      id: 11,
      title: "11. Loi applicable et juridiction",
      icon: <LampWallUp />,
      content: `Loi applicable :
      Les présentes conditions sont régies par la législation de Madagascar.
      
      Juridiction :
      • En cas de litide, les tribunaux de Madagascar sont territorialement compétents
      • Vous acceptez la juridiction exclusive de ces tribunaux
      
      RGPD et autorités :
      • Conformément au RGPD, vous pouvez saisir votre autorité locale de protection des données
      • Contact DPO : dpo@servo.mg`,
    },
    {
      id: 12,
      title: "12. Contact et support",
      icon: <PhoneCall />,
      content: `Pour toute question concernant ces conditions d'utilisation :
      
      Support général
      Email : support@servo.mg
      
      Questions RGPD / Données personnelles
      Email : dpo@servo.mg
      
      Mentions légales
      Consultez nos mentions légales pour plus d'informations
      
      Politique de confidentialité
      Consultez notre politique complète`,
    },
  ];

  const handleMouseEnter = (id) => {
    setIsHovering(true);
    setActiveSection(id);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleSectionClick = (id) => {
    setActiveSection(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl pt-10 mx-auto">

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Conditions d'utilisation
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Plateforme OLIPLUS - {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        {/* Intro */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-8 mb-12 shadow-sm">
          <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
            Bienvenue sur <strong className="text-blue-600 dark:text-blue-400">SERVO</strong>. En accédant à notre plateforme ou en créant un compte,
            vous acceptez sans réserve les présentes conditions d'utilisation. Nous vous invitons à les lire attentivement
            et à les conserver pour référence.
          </p>
        </div>

        {/* Sections Container */}
        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Section Titles */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-2">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    onClick={() => handleSectionClick(section.id)}
                    onMouseEnter={() => handleMouseEnter(section.id)}
                    onMouseLeave={handleMouseLeave}
                    className={`relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${activeSection === section.id
                        ? "bg-gray-300 dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
                        : "hover:bg-white/50 dark:hover:bg-gray-800/50"
                      }`}
                  >
                    <div className="text-xl">{section.icon}</div>
                    <div className="flex-1">
                      <h3 className={`font-medium text-sm ${activeSection === section.id
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-600 dark:text-gray-400"
                        }`}>
                        {section.title}
                      </h3>
                    </div>
                    {activeSection === section.id && (
                      <ChevronRight className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Section Content */}
            <div className="lg:col-span-3 ">
              <div className=" relative min-h-full">
                
                  {sections.map((section, index) => (
                    <div
                      key={section.id}
                      className={`absolute top-0 left-0 w-full transition-all duration-500 ease-in-out ${activeSection === section.id
                          ? "opacity-100 translate-y-0 z-10"
                          : "opacity-0 translate-y-4 pointer-events-none"
                        }`}
                      style={{
                        transitionDelay: activeSection === section.id ? '0.1s' : '0s'
                      }}
                    >
                      <div
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
                        style={{
                          transform: activeSection === section.id
                            ? 'translateY(0)'
                            : `translateY(${index * 5}px)`,
                          zIndex: 12 - index
                        }}
                      >
                        {/* Card Header */}
                        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700">
                          <div className="flex items-center gap-4">
                            <div className="text-2xl">{section.icon}</div>
                            <div>
                              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {section.title}
                              </h2>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Section {section.id} sur {sections.length}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="px-8 py-6">
                          <div
                            className="prose prose-gray dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: section.content
                                .replace(/\n\s*\n/g, '</p><p class="mt-4">')
                                .replace(/\n/g, '<br>')
                                .replace(/•/g, '•')
                                .replace(/✓/g, '✓')
                                .replace(/✗/g, '✗')
                            }}
                          />
                        </div>

                        {/* Card Footer */}
                        <div className="px-8 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {index > 0 && (
                                <Button
                                  variant="ghost"
                                  onClick={() => handleSectionClick(section.id - 1)}
                                  className="text-sm"
                                >
                                  ← Précédent
                                </Button>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {section.id}/{sections.length}
                              </span>
                            </div>

                            <div className="flex items-center gap-4">
                              {index < sections.length - 1 && (
                                <Button
                                  variant="ghost"
                                  onClick={() => handleSectionClick(section.id + 1)}
                                  className="text-sm"
                                >
                                  Suivant →
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            En utilisant OLIPLUS, vous confirmez avoir lu, compris et accepté l'ensemble des conditions ci-dessus.
          </p>
        </div>
      </div>
    </div>
  );
}