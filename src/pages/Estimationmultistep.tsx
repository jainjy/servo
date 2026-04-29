import { useState, useEffect } from "react";
import {
  Home,
  MapPin,
  User,
  Phone,
  Mail,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Building2,
  Star,
  ArrowRight,
  Ruler,
  X,
  Check,
  Sparkles,
  Loader2,
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Agency {
  id: string;
  name: string;
  city: string;
  rating: number;
  deals: number;
  specialty: string;
  avatar?: string;
  email?: string;
  phone?: string;
}

interface FormData {
  // Étape 1
  propertyType: string;
  surface: string;
  rooms: string;
  // Étape 2
  address: string;
  commune: string;
  postalCode: string;
  // Étape 3
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  // Étape 4
  selectedAgencies: string[];
}

interface EstimationMultiStepProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROPERTY_TYPES = [
  { value: "maison", label: "Maison / Villa", icon: "🏡" },
  { value: "appartement", label: "Appartement", icon: "🏢" },
  { value: "terrain", label: "Terrain", icon: "🌿" },
  { value: "commercial", label: "Local commercial", icon: "🏬" },
  { value: "professionnel", label: "Local professionnel", icon: "🏛️" },
];

const COMMUNES_REUNION = [
  "Saint-Denis",
  "Saint-Paul",
  "Saint-Pierre",
  "Le Tampon",
  "Saint-Louis",
  "Saint-André",
  "Le Port",
  "Saint-Leu",
  "Saint-Benoît",
  "Sainte-Marie",
  "Sainte-Suzanne",
  "Saint-Joseph",
  "Bras-Panon",
  "La Plaine-des-Palmistes",
  "Cilaos",
  "Salazie",
  "Entre-Deux",
  "Petite-Île",
  "Les Avirons",
  "L'Étang-Salé",
  "Saint-Philippe",
  "La Possession",
  "Sainte-Rose",
  "Trois-Bassins",
  "Saint-Gilles",
];

// ─── Step indicator ────────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  const steps = [
    { label: "Votre bien" },
    { label: "Localisation" },
    { label: "Vos infos" },
    { label: "Professionnels" },
  ];

  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, i) => {
        const idx = i + 1;
        const done = idx < current;
        const active = idx === current;
        return (
          <div key={i} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={[
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                  done
                    ? "bg-[#3B6D11] text-white"
                    : active
                    ? "bg-[#1a2410] text-white ring-4 ring-[#C0DD97]/40"
                    : "bg-gray-100 text-gray-400",
                ].join(" ")}
              >
                {done ? <Check className="w-4 h-4" /> : idx}
              </div>
              <span
                className={[
                  "text-xs mt-1 hidden md:block font-medium",
                  active ? "text-[#1a2410]" : done ? "text-[#3B6D11]" : "text-gray-400",
                ].join(" ")}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={[
                  "flex-1 h-0.5 mx-2 transition-all duration-300",
                  done ? "bg-[#3B6D11]" : "bg-gray-200",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1: Type de bien + Surface ───────────────────────────────────────────

function Step1({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (key: keyof FormData, val: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[#1a2410] mb-1">Type de bien</h3>
        <p className="text-sm text-gray-500 mb-4">Sélectionnez le type de votre propriété</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {PROPERTY_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => onChange("propertyType", t.value)}
              className={[
                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 text-left",
                data.propertyType === t.value
                  ? "border-[#556B2F] bg-[#EAF3DE] shadow-md"
                  : "border-gray-200 hover:border-[#556B2F]/40 bg-white",
              ].join(" ")}
            >
              <span className="text-2xl">{t.icon}</span>
              <span className="text-xs font-semibold text-[#1a2410] text-center leading-tight">
                {t.label}
              </span>
              {data.propertyType === t.value && (
                <CheckCircle2 className="w-4 h-4 text-[#3B6D11]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Surface (m²)
          </label>
          <div className="relative">
            <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              min="1"
              value={data.surface}
              onChange={(e) => onChange("surface", e.target.value)}
              placeholder="Ex: 85"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/20 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Nb. de pièces
          </label>
          <select
            value={data.rooms}
            onChange={(e) => onChange("rooms", e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/20 transition-all appearance-none bg-white"
          >
            <option value="">—</option>
            {["1", "2", "3", "4", "5", "6+"].map((r) => (
              <option key={r} value={r}>{r} pièce{r !== "1" ? "s" : ""}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: Adresse ──────────────────────────────────────────────────────────

function Step2({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (key: keyof FormData, val: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-[#1a2410] mb-1">Localisation du bien</h3>
        <p className="text-sm text-gray-500 mb-4">Indiquez l'adresse de la propriété à estimer</p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Adresse
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={data.address}
            onChange={(e) => onChange("address", e.target.value)}
            placeholder="Numéro et nom de rue"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/20 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Commune *
          </label>
          <select
            value={data.commune}
            onChange={(e) => onChange("commune", e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/20 transition-all appearance-none bg-white"
          >
            <option value="">Choisir...</option>
            {COMMUNES_REUNION.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Code postal
          </label>
          <input
            type="text"
            value={data.postalCode}
            onChange={(e) => onChange("postalCode", e.target.value)}
            placeholder="974xx"
            maxLength={5}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/20 transition-all"
          />
        </div>
      </div>

      {data.commune && (
        <div className="flex items-center gap-2 text-sm text-[#3B6D11] bg-[#EAF3DE] px-4 py-2.5 rounded-xl border border-[#C0DD97]">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          Des professionnels sont disponibles à <strong>{data.commune}</strong>
        </div>
      )}
    </div>
  );
}

// ─── Step 3: Coordonnées ──────────────────────────────────────────────────────

function Step3({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (key: keyof FormData, val: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-[#1a2410] mb-1">Vos coordonnées</h3>
        <p className="text-sm text-gray-500 mb-4">Les pros vous contacteront directement</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Prénom *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={data.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
              placeholder="Jean"
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/20 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Nom *
          </label>
          <input
            type="text"
            value={data.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            placeholder="Dupont"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/20 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Téléphone *
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="0692 xx xx xx"
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/20 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Email *
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="jean.dupont@email.com"
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/20 transition-all"
          />
        </div>
      </div>

      <p className="text-xs text-gray-400 leading-relaxed">
        En soumettant ce formulaire, vous acceptez d'être contacté par les professionnels sélectionnés dans le cadre de votre demande d'estimation.
      </p>
    </div>
  );
}

// ─── Step 4: Choisir les agences (MODIFIÉE POUR UTILISER L'API) ────────────────

function Step4({
  data,
  onChange,
  professionnels,
  loadingPro,
}: {
  data: FormData;
  onChange: (key: keyof FormData, val: string) => void;
  professionnels: Agency[];
  loadingPro: boolean;
}) {
  const toggle = (id: string) => {
    const current = data.selectedAgencies || [];
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    onChange("selectedAgencies", next as any);
  };

  if (loadingPro) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#3B6D11]" />
        <span className="ml-3 text-gray-500">Chargement des professionnels...</span>
      </div>
    );
  }

  if (professionnels.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Aucun professionnel disponible dans cette zone</p>
        <p className="text-sm text-gray-400 mt-1">Essayez une autre commune</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-[#1a2410] mb-1">
          Professionnels disponibles
          {data.commune && (
            <span className="text-[#556B2F] ml-2 font-normal text-base">— {data.commune}</span>
          )}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Sélectionnez un ou plusieurs professionnels pour recevoir votre estimation
        </p>
      </div>

      <div className="space-y-3">
        {professionnels.map((agency) => {
          const selected = (data.selectedAgencies || []).includes(agency.id);
          return (
            <button
              key={agency.id}
              type="button"
              onClick={() => toggle(agency.id)}
              className={[
                "w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left",
                selected
                  ? "border-[#556B2F] bg-[#EAF3DE] shadow-sm"
                  : "border-gray-200 hover:border-[#556B2F]/40 bg-white",
              ].join(" ")}
            >
              <div className="w-10 h-10 rounded-lg bg-[#EAF3DE] flex items-center justify-center flex-shrink-0 mt-0.5">
                {agency.avatar ? (
                  <img src={agency.avatar} alt={agency.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <Building2 className="w-5 h-5 text-[#3B6D11]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-[#1a2410] text-sm">{agency.name}</p>
                  {selected && (
                    <CheckCircle2 className="w-5 h-5 text-[#3B6D11] flex-shrink-0" />
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" /> {agency.city}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    {agency.rating}
                  </span>
                  <span className="text-xs text-gray-500">{agency.deals} transactions</span>
                  <span className="text-xs bg-[#EAF3DE] text-[#3B6D11] px-2 py-0.5 rounded-full">
                    {agency.specialty}
                  </span>
                </div>
                {agency.services && agency.services.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {agency.services.slice(0, 2).map((service) => (
                      <span key={service.id} className="text-xs text-gray-400">
                        • {service.libelle}
                      </span>
                    ))}
                    {agency.services.length > 2 && (
                      <span className="text-xs text-gray-400">+{agency.services.length - 2}</span>
                    )}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {(data.selectedAgencies || []).length > 0 && (
        <div className="flex items-center gap-2 text-sm text-[#3B6D11] bg-[#EAF3DE] px-4 py-2.5 rounded-xl border border-[#C0DD97]">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>
            <strong>{(data.selectedAgencies || []).length} professionnel{(data.selectedAgencies || []).length > 1 ? "s" : ""}</strong> sélectionné{(data.selectedAgencies || []).length > 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Success screen ────────────────────────────────────────────────────────────

function SuccessScreen({ agencyCount }: { agencyCount: number }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="w-20 h-20 rounded-full bg-[#EAF3DE] flex items-center justify-center mb-6">
        <CheckCircle2 className="w-10 h-10 text-[#3B6D11]" />
      </div>
      <h3 className="text-[#1a2410] font-bold text-2xl mb-2">
        Demande envoyée !
      </h3>
      <p className="text-gray-500 text-sm max-w-xs mb-6 leading-relaxed">
        Votre demande d'estimation a été transmise à{" "}
        <strong className="text-[#3B6D11]">{agencyCount} professionnel{agencyCount > 1 ? "s" : ""}</strong>.
        Vous recevrez leurs réponses sous 24–48h.
      </p>
      <div className="flex flex-col gap-2 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#97C459]" />
          Suivi disponible dans « Mes estimations »
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#97C459]" />
          Messagerie interne avec les pros
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#97C459]" />
          Aucun engagement
        </div>
      </div>
      <a
        href="/mon-compte/estimations"
        className="mt-8 px-6 py-3 bg-[#3B6D11] text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#2d5209] transition-colors"
      >
        Voir mes estimations
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}

// ─── Main component (MODIFIÉ) ─────────────────────────────────────────────────

export default function EstimationMultiStep({
  onClose,
  onSuccess,
}: EstimationMultiStepProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPro, setLoadingPro] = useState(false);
  const [professionnels, setProfessionnels] = useState<Agency[]>([]);
  const [formData, setFormData] = useState<FormData>({
    propertyType: "",
    surface: "",
    rooms: "",
    address: "",
    commune: "",
    postalCode: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    selectedAgencies: [],
  });

  // Charger les professionnels depuis l'API
  const fetchProfessionnels = async (commune: string = "") => {
    setLoadingPro(true);
    try {
      const url = commune 
        ? `/estimations/professionnels?commune=${encodeURIComponent(commune)}`
        : "/estimations/professionnels";
      const response = await api.get(url);
      if (response.data.success) {
        setProfessionnels(response.data.professionnels);
      }
    } catch (error) {
      console.error("Erreur chargement professionnels:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les professionnels",
        variant: "destructive"
      });
    } finally {
      setLoadingPro(false);
    }
  };

  // Recharger quand la commune change
  useEffect(() => {
    if (formData.commune) {
      fetchProfessionnels(formData.commune);
    } else {
      fetchProfessionnels();
    }
  }, [formData.commune]);

  // Pré-remplir les infos utilisateur connecté
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (key: keyof FormData, val: any) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  const canNext = () => {
    if (step === 1) return !!formData.propertyType && !!formData.surface;
    if (step === 2) return !!formData.commune;
    if (step === 3)
      return (
        !!formData.firstName &&
        !!formData.lastName &&
        !!formData.phone &&
        !!formData.email
      );
    if (step === 4) return (formData.selectedAgencies || []).length > 0;
    return false;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await api.post("/estimations", {
        propertyType: formData.propertyType,
        surface: formData.surface,
        rooms: formData.rooms,
        address: formData.address,
        commune: formData.commune,
        postalCode: formData.postalCode,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        description: `Demande d'estimation pour ${formData.propertyType} de ${formData.surface}m²`,
        selectedAgencies: formData.selectedAgencies,
      });

      if (response.data.success) {
        setSubmitted(true);
        onSuccess?.();
        toast({
          title: "Succès",
          description: "Votre demande d'estimation a été envoyée avec succès",
          variant: "default"
        });
      }
    } catch (error: any) {
      console.error("Erreur création estimation:", error);
      toast({
        title: "Erreur",
        description: error.response?.data?.error || "Impossible d'envoyer la demande",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xl max-w-2xl w-full mx-auto">
      {/* Header */}
      <div className="p-6 md:p-8 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#FAECE7] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-[#8B4513]" />
            </div>
            <div>
              <h2 className="text-[#1a2410] font-bold text-xl">
                Demande d'estimation gratuite
              </h2>
              <p className="text-gray-500 text-sm mt-0.5">
                Sans engagement · Réponse sous 24–48h
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 md:p-8">
        {submitted ? (
          <SuccessScreen agencyCount={(formData.selectedAgencies || []).length} />
        ) : (
          <>
            <StepIndicator current={step} total={4} />

            {step === 1 && <Step1 data={formData} onChange={handleChange} />}
            {step === 2 && <Step2 data={formData} onChange={handleChange} />}
            {step === 3 && <Step3 data={formData} onChange={handleChange} />}
            {step === 4 && (
              <Step4
                data={formData}
                onChange={handleChange}
                professionnels={professionnels}
                loadingPro={loadingPro}
              />
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                className={[
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all",
                  step === 1
                    ? "opacity-0 pointer-events-none"
                    : "text-gray-600 hover:bg-gray-100 border border-gray-200",
                ].join(" ")}
              >
                <ChevronLeft className="w-4 h-4" />
                Retour
              </button>

              {step < 4 ? (
                <button
                  type="button"
                  disabled={!canNext()}
                  onClick={() => setStep((s) => s + 1)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#3B6D11] text-white rounded-xl text-sm font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#2d5209] transition-all active:scale-[0.98]"
                >
                  Continuer
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!canNext() || loading}
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#8B4513] text-white rounded-xl text-sm font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#712B13] transition-all active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      Envoyer ma demande
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer trust */}
      {!submitted && (
        <div className="px-6 md:px-8 py-4 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#97C459]" />
            Gratuit & sans engagement
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D85A30]" />
            48 agences certifiées Réunion
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#888780]" />
            Données confidentielles
          </span>
        </div>
      )}
    </div>
  );
}