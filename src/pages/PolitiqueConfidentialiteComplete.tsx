import React, { useState } from "react";
import {
  Lock,
  Shield,
  Eye,
  Database,
  Cookie,
  Users,
  Mail,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function PolitiqueConfidentialiteComplete() {
  const navigate = useNavigate();

  // 👉 première section ouverte par défaut
  const [activeSection, setActiveSection] = useState<string | null>("intro");

 const sections = [
    {
      id: "intro",
      title: "Introduction",
      icon: Shield,
      content: `SERVO Platform (ci-après "nous", "notre" ou "la plateforme") accorde la plus haute importance à la protection de vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos informations en conformité avec le Règlement Général sur la Protection des Données (RGPD) et la législation applicable.`,
    },
    {
      id: "collecte",
      title: "1. Collecte des Données Personnelles",
      icon: Database,
      content: `Nous collectons les données suivantes :

• Données d'inscription : nom, prénom, email, téléphone, mot de passe
• Données de profil : adresse, code postal, ville, photo de profil
• Données professionnelles : SIRET, raison sociale, secteur d'activité (pour professionnels)
• Données de navigation : pages visitées, durée de visite, clics, localisation GPS
• Données de transaction : historique des achats/réservations, paiements
• Données de communication : messages, avis, évaluations
• Données techniques : adresse IP, navigateur, appareil, cookies

Ces données sont collectées via : inscription, formulaires, cookies, suivi d'utilisation, paiements, et importation de contacts (avec consentement).`,
    },
    {
      id: "base",
      title: "2. Base Légale du Traitement",
      icon: FileText,
      content: `Vos données sont traitées sur les bases légales suivantes :

• Consentement explicite (cookies, géolocalisation, marketing)
• Exécution du contrat (création de compte, transactions)
• Obligation légale (impôts, fraude, sécurité)
• Intérêts légitimes (amélioration du service, sécurité)
• Intérêt public (compliance, audit)

Vous pouvez retirer votre consentement à tout moment via vos paramètres.`,
    },
    {
      id: "utilisation",
      title: "3. Utilisation de Vos Données",
      icon: Eye,
      content: `Vos données sont utilisées pour :

• Fournir le service (création compte, transactions, support)
• Améliorer l'expérience (personnalisation, recommandations)
• Communication (confirmations, newsletters, alertes)
• Analyse statistique (amélioration du service)
• Sécurité (prévention fraude, détection anomalies)
• Conformité légale (obligations légales et réglementaires)
• Marketing (si consentement donné)

Les données sont traitées uniquement pour les finalités pour lesquelles elles ont été collectées.`,
    },
    {
      id: "partage",
      title: "4. Partage des Données avec des Tiers",
      icon: Users,
      content: `Vos données peuvent être partagées avec :

• Partenaires de paiement (traitement des transactions)
• Prestataires techniques (hébergement, support)
• Autorités légales (si obligatoire par la loi)
• Partenaires commerciaux (uniquement avec consentement)
• Autres utilisateurs (profil public, si applicable)

En aucun cas, vos données ne sont vendues ou louées à des tiers à des fins marketing.`,
    },
    {
      id: "cookies",
      title: "5. Cookies et Suivi",
      icon: Cookie,
      content: `Nous utilisons les types de cookies suivants :

• Cookies essentiels : nécessaires au fonctionnement du site
• Cookies de performance : analyse du trafic (avec consentement)
• Cookies de marketing : publicités personnalisées (avec consentement)
• Cookies de session : conservation de votre session

Vous pouvez gérer vos préférences de cookies depuis la banneau de consentement en bas de page. Vous pouvez également désactiver les cookies dans les paramètres de votre navigateur.`,
    },
    {
      id: "retention",
      title: "6. Durée de Conservation des Données",
      icon: Database,
      content: `Vos données sont conservées pendant :

• Données de compte : durée de votre compte + 3 ans après suppression
• Données transactionnelles : 6 ans (obligations légales)
• Données de logs : 6 mois
• Données de cookies : selon le type (de la session à 24 mois)
• Données de marketing : jusqu'à désabonnement
• Données de géolocalisation : temps réel, non stockées

Les données archivées pour conformité légale sont inaccessibles mais conservées.`,
    },
    {
      id: "droits",
      title: "7. Vos Droits RGPD",
      icon: Shield,
      content: `Vous disposez des droits suivants :

• Droit d'accès : obtenir copie de vos données
• Droit de rectification : corriger vos données incorrectes
• Droit à l'oubli : faire supprimer vos données
• Droit à la portabilité : récupérer vos données en format structuré
• Droit d'opposition : refuser un traitement (marketing, profilage)
• Droit à la limitation : arrêter temporairement un traitement
• Droit à la non-décision automatisée : refuser profilage automatique

Pour exercer ces droits, contactez notre DPO : dpo@servo.mg ou accédez à votre section "Gestion des droits RGPD".`,
    },
    {
      id: "securite",
      title: "8. Sécurité des Données",
      icon: Lock,
      content: `Nous implémentons des mesures de sécurité strictes :

• Chiffrement SSL/TLS pour toutes les transmissions
• Chiffrement des données sensibles en base de données
• Authentification multi-facteurs disponible
• Contrôle d'accès basé sur les rôles
• Audit régulier de sécurité
• Politique de mot de passe fort
• Sauvegarde régulière et redondance
• Formation équipe sur protection des données

Malgré ces mesures, aucune transmission internet n'est 100% sécurisée.`,
    },
    {
      id: "contact",
      title: "9. Nous Contacter",
      icon: Mail,
      content: `Pour toute question concernant cette politique :

Délégué à la Protection des Données (DPO)
Email : dpo@servo.mg
Téléphone : +261 XX XX XX XX

Responsable Traitement
Email : legal@servo.mg
Adresse : Madagascar

Autorité de Protection des Données
Vous avez également le droit de saisir votre autorité nationale de protection des données.`,
    },
  ];

  // toggle au clic mais aussi ouverture au hover
  const handleOpen = (id: string) => setActiveSection(id);
  const handleLeave = (id: string) => {
    // si tu veux qu’il se referme quand on sort de la ligne
    if (id !== "intro") setActiveSection("intro");
  };

  return (
    <div className="min-h-screen bg-[#f3efe7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto pt-10">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>

        {/* header */}
        <div className="mb-10 grid lg:flex gap-2 items-center justify-between">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">
            Politique de Confidentialité
          </h1>
          <p className="animate-pulse w-72 rounded-full py-2 text-center bg-logo text-xs text-slate-100">
            Dernière mise à jour :{" "}
            {new Date().toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* layout type "services" */}
        <div className="bg-secondary-text rounded-2xl overflow-hidden shadow-sm">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isOpen = activeSection === section.id;
            const isFirst = index === 0;

            return (
              <div
                key={section.id}
                onMouseEnter={() => handleOpen(section.id)}
                onMouseLeave={() => handleLeave(section.id)}
                className={`grid transition-all duration-300 cursor-pointer
                  ${isOpen ? "md:grid-cols-[1.2fr_2fr_60px]" : "md:grid-cols-[0.15fr_2fr_60px]"}
                  grid-cols-[1fr]`}
              >
                {/* bloc gauche (icône ou image) */}
                <div
                  className={`
                    relative overflow-hidden 
                    ${isOpen ? "h-44 md:h-full rounded-e-lg" : "h-20"}
                  `}
                >
                  <div className="h-full w-full bg-logo flex items-center justify-center">
                    <Icon className={`text-white transition-all ${isOpen ? "w-10 h-10" : "w-6 h-6"}`} />
                  </div>
                </div>

                {/* texte au centre */}
                <div
                  className={`
                    flex flex-col justify-center px-6 py-5
                    border-t border-[#d7cfbf]
                    bg-[#f5efe3]
                    ${isOpen ? "space-y-3" : ""}
                  `}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h2
                      className={`
                        font-serif text-slate-900 transition-all
                        ${isOpen ? "text-2xl" : "text-xl"}
                      `}
                    >
                      {section.title}
                    </h2>
                    <span className="text-sm text-slate-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {isOpen && (
                    <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line max-w-2xl">
                      {section.content}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
