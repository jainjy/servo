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
} from "lucide-react";

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

// ─── Sub-components ───────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#1a2410] pt-20 pb-16 px-6">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#556B2F] opacity-20 rounded-full blur-[120px]" />

      <div className="relative max-w-4xl mx-auto text-center">

        <h1 className="text-white font-bold text-5xl md:text-6xl leading-[1.1] mb-5 tracking-tight">
          Vendez votre bien,{" "}
          <span className="text-[#C0DD97]">à votre façon</span>
        </h1>

        <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed">
          Publication autonome ou accompagnement par un professionnel — choisissez la formule qui vous correspond.
        </p>

        <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-white/50">
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
}

function PlanCards({ selected, onSelect }: PlanCardProps) {
  return (
    <section className="max-w-4xl mx-auto px-6 -mt-6 relative z-10">
      <div className="grid md:grid-cols-2 gap-5">
        {/* ── Direct card ── */}
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
              {selected === "direct" && (
                <CheckCircle2 className="w-5 h-5 text-[#3B6D11]" />
              )}
            </div>
            <h2 className="text-[#1a2410] font-bold text-xl mb-1">
              Vendre en direct
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Publication autonome, messagerie directe. Vous fixez votre prix et vos créneaux.
            </p>
          </div>

          <div className="px-6 py-4 bg-[#F7FBF0] border-t border-[#E2EEC8]">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[#1a2410]">39 €</span>
              <span className="text-gray-400 text-sm">HT</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Paiement unique · par annonce publiée
            </p>
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
            <div
              className={[
                "w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors",
                selected === "direct"
                  ? "bg-[#3B6D11] text-white"
                  : "bg-[#EAF3DE] text-[#3B6D11] group-hover:bg-[#3B6D11] group-hover:text-white",
              ].join(" ")}
            >
              Publier mon annonce
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>

        {/* ── Pro card ── */}
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
          {/* Recommended badge */}
          <div className="absolute top-4 right-4 bg-[#8B4513] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Recommandé
          </div>

          <div className="p-6 pb-4">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#FAECE7] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[#8B4513]" />
              </div>
              {selected === "pro" && (
                <CheckCircle2 className="w-5 h-5 text-[#8B4513]" />
              )}
            </div>
            <h2 className="text-[#1a2410] font-bold text-xl mb-1">
              Vendre avec un pro
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Agence partenaire, estimation marché, visites qualifiées et sécurisation juridique.
            </p>
          </div>

          <div className="px-6 py-4 bg-[#FBF5F2] border-t border-[#F5D5C8]">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[#1a2410]">99 €</span>
              <span className="text-gray-400 text-sm">HT / mois</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Abonnement mensuel · annonces illimitées
            </p>
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
            <div
              className={[
                "w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors",
                selected === "pro"
                  ? "bg-[#8B4513] text-white"
                  : "bg-[#FAECE7] text-[#8B4513] group-hover:bg-[#8B4513] group-hover:text-white",
              ].join(" ")}
            >
              Trouver mon agence
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>
      </div>
    </section>
  );
}

interface EstimationFormProps {
  onSuccess: () => void;
}

function EstimationForm({ onSuccess }: EstimationFormProps) {
  const [propertyType, setPropertyType] = useState("");
  const [agencyId, setAgencyId] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedAgency = AGENCIES.find((a) => a.id === agencyId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyType || !agencyId) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      onSuccess();
    }, 1200);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-16 h-16 rounded-full bg-[#EAF3DE] flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-[#3B6D11]" />
        </div>
        <h3 className="text-[#1a2410] font-bold text-xl mb-2">
          Demande envoyée !
        </h3>
        <p className="text-gray-500 text-sm max-w-xs">
          Un conseiller de <span className="font-medium text-[#8B4513]">{selectedAgency?.name}</span> vous contactera sous 24h.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Property type */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Type de bien
          </label>
          <div className="relative">
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              required
              className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm text-gray-700 focus:outline-none focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/20 transition-all cursor-pointer"
            >
              <option value="">Sélectionner...</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Agency */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Professionnel partenaire
          </label>
          <div className="relative">
            <select
              value={agencyId}
              onChange={(e) => setAgencyId(e.target.value)}
              required
              className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm text-gray-700 focus:outline-none focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/20 transition-all cursor-pointer"
            >
              <option value="">Choisir un pro...</option>
              {AGENCIES.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} – {a.city}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Selected agency preview */}
      {selectedAgency && (
        <div className="bg-[#F7FBF0] border border-[#C0DD97] rounded-xl p-4 flex items-start gap-3 transition-all">
          <div className="w-10 h-10 rounded-lg bg-[#EAF3DE] flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-[#3B6D11]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[#1a2410] text-sm">{selectedAgency.name}</p>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />
                {selectedAgency.city}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                {selectedAgency.rating}
              </span>
              <span className="text-xs text-gray-500">
                {selectedAgency.deals} ventes
              </span>
              <span className="text-xs bg-[#EAF3DE] text-[#3B6D11] px-2 py-0.5 rounded-full">
                {selectedAgency.specialty}
              </span>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !propertyType || !agencyId}
        className="w-full md:w-auto px-8 py-3.5 bg-[#8B4513] hover:bg-[#712B13] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Phone className="w-4 h-4" />
            Demander l'estimation gratuite
          </>
        )}
      </button>
    </form>
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

// ─── Main component ───────────────────────────────────────────────────────────

export default function PropertySell() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(null);
  const [estimationDone, setEstimationDone] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <HeroSection />

      <PlanCards selected={selectedPlan} onSelect={setSelectedPlan} />

      <TrustStats />

      {/* Estimation section */}
      <section className="max-w-4xl mx-auto px-6 mt-10 pb-16">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#FAECE7] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-[#8B4513]" />
              </div>
              <div>
                <h2 className="text-[#1a2410] font-bold text-xl">
                  Demande d'estimation gratuite
                </h2>
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                  Obtenez une estimation de votre bien par l'un de nos professionnels partenaires — sans engagement, sous 24h.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <EstimationForm onSuccess={() => setEstimationDone(true)} />
          </div>

          {/* Footer trust */}
          <div className="px-6 md:px-8 py-4 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#97C459]" />
              Publication en moins de 5 min
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D85A30]" />
              Réseau de 48 agences certifiées
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#888780]" />
              Aucune commission cachée
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}