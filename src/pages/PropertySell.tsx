import { useState } from "react";
import {
  Home,
  Building2,
  CheckCircle2,
  Star,
  ArrowRight,
  Phone,
  TrendingUp,
  Shield,
  Users,
  ChevronDown,
  Sparkles,
  MapPin,
  X,
} from "lucide-react";
import EstimationMultiStep from "./EstimationMultiStep";
import { Link } from "react-router-dom";
// ─── Types ────────────────────────────────────────────────────────────────────

type PlanType = "direct" | "pro" | null;

interface Agency {
  id: string;
  name: string;
  city: string;
  rating: number;
  deals: number;
  specialty: string;
}

interface PropertyType {
  value: string;
  label: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const AGENCIES: Agency[] = [
  { id: "1", name: "Île Verte Immobilier", city: "Saint-Denis", rating: 4.9, deals: 142, specialty: "Maisons & Villas" },
  { id: "2", name: "ImmoOcéan", city: "Saint-Pierre", rating: 4.8, deals: 98, specialty: "Appartements" },
  { id: "3", name: "Réunion Prestige", city: "Saint-Gilles", rating: 5.0, deals: 76, specialty: "Biens de prestige" },
  { id: "4", name: "Horizon Immo", city: "Le Port", rating: 4.7, deals: 115, specialty: "Terrains & Locaux" },
  { id: "5", name: "Côte Ouest", city: "Saint-Paul", rating: 4.8, deals: 89, specialty: "Résidentiel" },
];

const PROPERTY_TYPES: PropertyType[] = [
  { value: "maison", label: "Maison / Villa" },
  { value: "appartement", label: "Appartement" },
  { value: "terrain", label: "Terrain" },
  { value: "commercial", label: "Local commercial" },
  { value: "professionnel", label: "Local professionnel" },
];

const DIRECT_FEATURES = [
  "Annonce visible jusqu'à la vente",
  "Messagerie directe avec les acheteurs",
  "Gestion des créneaux de visite",
  "Photos, description, plan interactif",
  "Statistiques de vues en temps réel",
  "Modification illimitée de l'annonce",
];

const PRO_FEATURES = [
  "Estimation au prix du marché",
  "Visites qualifiées par l'agence",
  "Négociation et accompagnement",
  "Sécurisation juridique complète",
  "Annonces illimitées incluses",
  "Suivi personnalisé jusqu'au notaire",
];

// ─── Estimation Modal ─────────────────────────────────────────────────────────

function EstimationModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <EstimationMultiStep onClose={onClose} onSuccess={onClose} />
      </div>
    </div>
  );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────

function EstimationCTABanner({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="max-w-4xl mx-auto px-6 mt-10">
      <div
        className="relative overflow-hidden rounded-2xl p-8 md:p-10"
        style={{
          background: "linear-gradient(135deg, #1a2410 0%, #2d3d1a 50%, #3B6D11 100%)",
        }}
      >
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C0DD97] opacity-10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 text-[#C0DD97] px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Gratuit · Sans engagement
            </div>
            <h2 className="text-white font-bold text-2xl md:text-3xl mb-3 leading-tight">
              Combien vaut votre bien ?
            </h2>
            <p className="text-white/60 text-sm leading-relaxed max-w-md">
              Obtenez une estimation précise de votre bien par nos professionnels partenaires en moins de 48h. Sélectionnez plusieurs agences et comparez.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-xs text-white/50">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#97C459]" />
                48 pros disponibles
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#97C459]" />
                Réponse sous 24–48h
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#97C459]" />
                Aucun frais cachés
              </span>
            </div>
          </div>

          <button
            onClick={onOpen}
            className="flex-shrink-0 group flex items-center gap-3 bg-white text-[#1a2410] px-8 py-4 rounded-2xl font-bold text-base shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 active:scale-[0.98]"
          >
            <Sparkles className="w-5 h-5 text-[#3B6D11] group-hover:rotate-12 transition-transform" />
            Demande d'estimation gratuite
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function HeroSection({ onEstimation }: { onEstimation: () => void }) {
  return (
    <section className="relative overflow-hidden bg-[#1a2410] pt-20 pb-16 px-6">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#556B2F] opacity-20 rounded-full blur-[120px]" />

      <div className="relative max-w-4xl mx-auto text-center">
        <h1 className="text-white font-bold text-5xl md:text-6xl leading-[1.1] mb-5 tracking-tight">
          Vendez votre bien,{" "}
          <span className="text-[#C0DD97]">à votre façon</span>
        </h1>

        <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed mb-8">
          Publication autonome ou accompagnement par un professionnel — choisissez la formule qui vous correspond.
        </p>

        {/* Hero CTA */}
        <button
          onClick={onEstimation}
          className="group inline-flex items-center gap-3 bg-white text-[#1a2410] px-8 py-4 rounded-2xl font-bold text-base shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 active:scale-[0.98] mb-10"
        >
          <Sparkles className="w-5 h-5 text-[#3B6D11]" />
          Demande d'estimation gratuite
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-white/50">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#97C459] inline-block" />
            +1 200 annonces publiées
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#97C459] inline-block" />
            48 agences partenaires
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#97C459] inline-block" />
            Satisfaction 4.8 / 5
          </span>
        </div>
      </div>
    </section>
  );
}

interface PlanCardProps {
  selected: PlanType;
  onSelect: (plan: PlanType) => void;
  onOpenEstimation: () => void;
}

function PlanCards({ selected, onSelect, onOpenEstimation }: PlanCardProps) {
  return (
    <section className="max-w-4xl mx-auto px-6 -mt-6 relative z-10">
      <div className="grid md:grid-cols-2 gap-5">
        {/* Direct */}
        <button
          type="button"
          onClick={() => onSelect(selected === "direct" ? null : "direct")}
          className={[
            "text-left rounded-2xl border-2 transition-all duration-300 overflow-hidden group",
            selected === "direct"
              ? "border-[#556B2F] shadow-[0_0_0_4px_rgba(85,107,47,0.15)]"
              : "border-transparent hover:border-[#556B2F]/40",
            "bg-white",
          ].join(" ")}
        >
          <div className="p-6 pb-4">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#EAF3DE] flex items-center justify-center">
                <Home className="w-6 h-6 text-[#3B6D11]" />
              </div>
              {selected === "direct" && <CheckCircle2 className="w-5 h-5 text-[#3B6D11]" />}
            </div>
            <h2 className="text-[#1a2410] font-bold text-xl mb-1">Vendre en direct</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Publication autonome, messagerie directe. Vous fixez votre prix et vos créneaux.
            </p>
          </div>
          <div className="px-6 py-4 bg-[#F7FBF0] border-t border-[#E2EEC8]">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[#1a2410]">39 €</span>
              <span className="text-gray-400 text-sm">HT</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Paiement unique · par annonce publiée</p>
          </div>
          <ul className="px-6 py-4 space-y-2.5">
            {DIRECT_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-[#639922] flex-shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>

          <div className="px-6 pb-6">
            <Link
              to={(() => {
                // Récupérer l'utilisateur depuis localStorage
                const userDataStr = localStorage.getItem('user-data');
                if (userDataStr) {
                  try {
                    const userData = JSON.parse(userDataStr);
                    // Redirection selon le rôle
                    if (userData.role === 'professional') {
                      return '/pro/listings';
                    } else if (userData.role === 'user') {
                      return '/mon-compte/immobilier/mes-annonces';
                    }
                  } catch (error) {
                    console.error('Erreur lors du parsing user-data:', error);
                  }
                }
                // Route par défaut si utilisateur non connecté ou rôle inconnu
                return '/connexion';
              })()}
              className={[
                "w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors no-underline",
                selected === "direct"
                  ? "bg-[#3B6D11] text-white hover:bg-[#2d5209]"
                  : "bg-[#EAF3DE] text-[#3B6D11] group-hover:bg-[#3B6D11] group-hover:text-white"
              ].join(" ")}
            >
              Publier mon annonce <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </button>

        {/* Pro */}
        <button
          type="button"
          onClick={() => onSelect(selected === "pro" ? null : "pro")}
          className={[
            "text-left rounded-2xl border-2 transition-all duration-300 overflow-hidden group relative",
            selected === "pro"
              ? "border-[#8B4513] shadow-[0_0_0_4px_rgba(139,69,19,0.15)]"
              : "border-transparent hover:border-[#8B4513]/40",
            "bg-white",
          ].join(" ")}
        >
          <div className="absolute top-4 right-4 bg-[#8B4513] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Recommandé
          </div>
          <div className="p-6 pb-4">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#FAECE7] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[#8B4513]" />
              </div>
              {selected === "pro" && <CheckCircle2 className="w-5 h-5 text-[#8B4513]" />}
            </div>
            <h2 className="text-[#1a2410] font-bold text-xl mb-1">Vendre avec un pro</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Agence partenaire, estimation marché, visites qualifiées et sécurisation juridique.
            </p>
          </div>
          <div className="px-6 py-4 bg-[#FBF5F2] border-t border-[#F5D5C8]">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[#1a2410]">99 €</span>
              <span className="text-gray-400 text-sm">HT / mois</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Abonnement mensuel · annonces illimitées</p>
          </div>
          <ul className="px-6 py-4 space-y-2.5">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-[#993C1D] flex-shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
          <div className="px-6 pb-6">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenEstimation();
              }}
              className={["w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer", selected === "pro" ? "bg-[#8B4513] text-white" : "bg-[#FAECE7] text-[#8B4513] group-hover:bg-[#8B4513] group-hover:text-white"].join(" ")}
            >
              Trouver mon agence <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </button>
      </div>
    </section>
  );
}

function TrustStats() {
  const stats = [
    { icon: TrendingUp, label: "Prix du marché", value: "Estimation précise", color: "text-[#3B6D11]", bg: "bg-[#EAF3DE]" },
    { icon: Shield, label: "Sécurité juridique", value: "Accompagnement notaire", color: "text-[#8B4513]", bg: "bg-[#FAECE7]" },
    { icon: Users, label: "Acheteurs qualifiés", value: "Réseau de +12 000", color: "text-[#185FA5]", bg: "bg-[#E6F1FB]" },
  ];
  return (
    <div className="grid md:grid-cols-3 gap-4 mt-12 max-w-4xl mx-auto px-6">
      {stats.map((s) => (
        <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
          <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
            <s.icon className={`w-5 h-5 ${s.color}`} />
          </div>
          <div>
            <p className="font-semibold text-[#1a2410] text-sm">{s.value}</p>
            <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function PropertySell() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(null);
  const [showEstimationModal, setShowEstimationModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <HeroSection onEstimation={() => setShowEstimationModal(true)} />

      <PlanCards
        selected={selectedPlan}
        onSelect={setSelectedPlan}
        onOpenEstimation={() => setShowEstimationModal(true)}
      />

      <TrustStats />

      {/* ── Estimation CTA Banner ── */}
      <EstimationCTABanner onOpen={() => setShowEstimationModal(true)} />

      {/* ── Lien suivi estimations ── */}
      <section className="max-w-4xl mx-auto px-6 mt-6 pb-16">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <span>Déjà fait une demande ?</span>
          <a
            href="/mon-compte/estimations"
            className="text-[#3B6D11] font-semibold underline underline-offset-2 hover:text-[#2d5209] flex items-center gap-1"
          >
            Voir mes estimations
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* ── Estimation Modal ── */}
      {showEstimationModal && (
        <EstimationModal onClose={() => setShowEstimationModal(false)} />
      )}
    </div>
  );
}