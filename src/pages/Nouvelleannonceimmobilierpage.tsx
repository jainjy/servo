// NouvelleAnnonceImmobilierPage.tsx
// Page de création d'annonce immobilière avec :
//   - Vérification abonnement actif (35 € HT / 42 € TTC)
//   - Toutes les données du listing-modal.jsx (types bien, types sociaux, rentType…)
//   - LocationPickerModal pour lat/lng
//   - Gestion images temporaires + upload
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Euro,
  Ruler,
  MapPin,
  Upload,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  AlertTriangle,
  Crown,
  ArrowRight,
  X,
  Loader2,
  Image as ImageIcon,
  Bath,
  BedDouble,
  Building2,
  Tag,
  FileText,
  Lock,
  Sparkles,
  Navigation,
  Save,
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { LocationPickerModal } from "@/components/location-picker-modal";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES (alignées avec listing-modal.jsx + schema.prisma)
// ─────────────────────────────────────────────────────────────────────────────

const TYPE_BIEN: Record<string, string> = {
  house: "Maison / Villa",
  apartment: "Appartement",
  villa: "Villa",
  land: "Terrain",
  studio: "Studio",
  commercial: "Local commercial",
  professionnel: "Local professionnel",
  fonds_de_commerce: "Fonds de commerce",
  appartements_neufs: "Appartement neufs (VEFA)",
  scpi: "SCPI",
  villa_d_exception: "Villa d'exception",
  villas_neuves: "Villas neuves (VEFA)",
  parking: "Parking",
  hotel: "Hôtel",
  gite: "Gîte",
  maison_d_hote: "Maison d'hôte",
  domaine: "Domaine",
  appartement_meuble: "Appartement meublé",
  villa_meuble: "Villa meublée",
  villa_non_meuble: "Villa non meublée",
  cellier: "Cellier",
  cave: "Cave",
};

const LISTING_TYPE: Record<string, string> = {
  sale: "Vente",
  rent: "Location",
  both: "Vente et Location",
};

const TYPE_LOCATION: Record<string, string> = {
  longue_duree: "Longue durée",
  saisonniere: "Saisonnière",
};

const STATUT_ANNONCE: Record<string, { label: string; color: string }> = {
  pending:  { label: "Brouillon",            color: "bg-yellow-100 text-yellow-800" },
  for_sale: { label: "À vendre",             color: "bg-green-100 text-green-800"  },
  for_rent: { label: "À louer",              color: "bg-purple-100 text-purple-800"},
  both:     { label: "Vente et Location",    color: "bg-blue-100 text-blue-800"    },
};

// Types sociaux stockés dans features[]
const SOCIAL_TYPE_FEATURES = ["SHUR", "SIDR", "SODIAC", "SEDRE", "SEMAC"];

const EQUIPEMENTS = [
  { key: "pool",            label: "Piscine"        },
  { key: "garden",          label: "Jardin"         },
  { key: "parking",         label: "Parking"        },
  { key: "terrace",         label: "Terrasse"       },
  { key: "balcony",         label: "Balcon"         },
  { key: "elevator",        label: "Ascenseur"      },
  { key: "fireplace",       label: "Cheminée"       },
  { key: "air_conditioning",label: "Climatisation"  },
  { key: "fiber_optic",     label: "Fibre optique"  },
];

const STEPS = [
  { n: 1, label: "Type & Prix"       },
  { n: 2, label: "Caractéristiques"  },
  { n: 3, label: "Équipements"       },
  { n: 4, label: "Photos"            },
  { n: 5, label: "Publication"       },
];

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface TemporaryImage {
  file: File;
  previewUrl: string;
  id: string;
}

interface FormState {
  // Étape 1
  title: string;
  type: string;
  description: string;
  price: string;
  listingType: string;
  rentType: string;
  // Étape 2
  surface: string;
  rooms: string;
  bedrooms: string;
  bathrooms: string;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  // Types sociaux
  socialLoan: boolean;  // PSLA
  isSHLMR: boolean;     // SHLMR
  // Étape 3
  features: string[];
  // Étape 5
  status: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK : vérification abonnement
// ─────────────────────────────────────────────────────────────────────────────

const useSubscriptionCheck = () => {
  const [hasSubscription, setHasSubscription] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/subscriptions/my-subscription");
        const sub = res.data?.subscription;
        const isValid =
          sub &&
          sub.status === "active" &&
          sub.endDate &&
          new Date(sub.endDate) > new Date() &&
          (sub.plan?.planType?.includes("immobilier") ||
            sub.plan?.professionalCategory?.includes("real-estate") ||
            sub.plan?.planType?.includes("immobilier_vente_user"));
        setHasSubscription(!!isValid);
      } catch {
        setHasSubscription(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { hasSubscription, loading };
};

// ─────────────────────────────────────────────────────────────────────────────
// GATE : bloque si pas d'abonnement actif
// ─────────────────────────────────────────────────────────────────────────────

const SubscriptionGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { hasSubscription, loading } = useSubscriptionCheck();

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="sans text-[#6B8E23] text-sm">Vérification de votre abonnement…</p>
        </div>
      </div>
    );
  }

  if (!hasSubscription) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
          <div className="relative mb-8 inline-block">
            <div className="w-28 h-28 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
              <Lock className="h-12 w-12 text-amber-600" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
              <Crown className="h-4 w-4 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-[#6B8E23] mb-3">Abonnement requis</h1>
          <p className="sans text-[#6B8E23] text-base leading-relaxed mb-8">
            Pour publier une annonce immobilière, vous devez disposer d'un abonnement actif à{" "}
            <strong className="text-[#6B8E23]">35 € HT / mois</strong> (42 € TTC).
          </p>

          <div className="bg-white border border-stone-100 rounded-2xl p-6 mb-8 text-left">
            <p className="sans text-xs font-semibold uppercase tracking-widest text-[#8B4513] mb-4">Ce qui est inclus</p>
            <ul className="space-y-3">
              {[
                "Annonces immobilières illimitées",
                "Jusqu'à 20 photos par annonce",
                "Messagerie avec les acheteurs",
                "Statistiques de vues",
                "Visibilité dans les résultats de recherche",
                "Support prioritaire",
              ].map((item) => (
                <li key={item} className="sans flex items-center gap-3 text-[#8B4513] text-sm">
                  <CheckCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => navigate("/abonnement-immobilier")}
            className="sans w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-amber-200 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="h-5 w-5" />
            S'abonner pour 42 € TTC / mois
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate(-1)}
            className="sans mt-3 w-full py-3 text-[#8B4513] hover:text-[#8B4513] text-sm transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// ─────────────────────────────────────────────────────────────────────────────
// BARRE DE PROGRESSION
// ─────────────────────────────────────────────────────────────────────────────

const StepBar: React.FC<{ current: number }> = ({ current }) => (
  <div className="flex items-center mb-10">
    {STEPS.map((s, i) => (
      <React.Fragment key={s.n}>
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              current > s.n
                ? "bg-amber-500 text-white"
                : current === s.n
                ? "bg-stone-900 text-white ring-4 ring-amber-200"
                : "bg-stone-100 text-[#8B4513]"
            }`}
          >
            {current > s.n ? <CheckCircle className="h-4 w-4" /> : s.n}
          </div>
          <span
            className={`sans text-xs hidden sm:block whitespace-nowrap ${
              current === s.n ? "text-[#6B8E23] font-semibold" : "text-[#8B4513]"
            }`}
          >
            {s.label}
          </span>
        </div>
        {i < STEPS.length - 1 && (
          <div
            className={`flex-1 h-0.5 mx-2 transition-colors duration-300 ${
              current > s.n ? "bg-amber-400" : "bg-stone-200"
            }`}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// FORMULAIRE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

const AnnonceForm: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep]             = useState(1);
  const [loading, setLoading]       = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [temporaryImages, setTemporaryImages] = useState<TemporaryImage[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    title: "", type: "apartment", description: "", price: "",
    listingType: "sale", rentType: "longue_duree",
    surface: "", rooms: "", bedrooms: "", bathrooms: "",
    address: "", city: "", latitude: null, longitude: null,
    socialLoan: false, isSHLMR: false,
    features: [], status: "pending",
  });

  // Sync status auto selon listingType (si déjà publié)
  useEffect(() => {
    if (form.status !== "pending") {
      const map: Record<string, string> = { sale: "for_sale", rent: "for_rent", both: "both" };
      const ns = map[form.listingType] || "for_sale";
      if (form.status !== ns) setForm((p) => ({ ...p, status: ns }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.listingType]);

  // Libérer les blob URLs
  useEffect(
    () => () => temporaryImages.forEach((i) => URL.revokeObjectURL(i.previewUrl)),
    [temporaryImages]
  );

  // ── Helper set ───────────────────────────────────────────────
  const set = <K extends keyof FormState>(field: K, value: FormState[K]) =>
    setForm((p) => ({ ...p, [field]: value }));

  // ── Types sociaux ────────────────────────────────────────────

  const currentDedicated = form.socialLoan ? "PSLA" : form.isSHLMR ? "SHLMR" : "none";

  const handleDedicatedSocial = (type: "PSLA" | "SHLMR" | "none") => {
    const cleaned = form.features.filter((f) => !SOCIAL_TYPE_FEATURES.includes(f.toUpperCase()));
    if (type === "PSLA")
      setForm((p) => ({ ...p, socialLoan: true,  isSHLMR: false, features: cleaned }));
    else if (type === "SHLMR")
      setForm((p) => ({ ...p, socialLoan: false, isSHLMR: true,  features: cleaned }));
    else
      setForm((p) => ({ ...p, socialLoan: false, isSHLMR: false, features: cleaned }));
  };

  const handleSocialFeatureToggle = (type: string, checked: boolean) => {
    const upper = type.toUpperCase();
    setForm((p) => {
      const features = checked
        ? p.features.some((f) => f.toUpperCase() === upper)
          ? p.features
          : [...p.features, upper]
        : p.features.filter((f) => f.toUpperCase() !== upper);
      return checked
        ? { ...p, socialLoan: false, isSHLMR: false, features }
        : { ...p, features };
    });
  };

  const isSocialFeatureSelected = (type: string) =>
    form.features.some((f) => f.toUpperCase() === type.toUpperCase());

  // ── Équipements ──────────────────────────────────────────────
  const toggleEquipement = (key: string) =>
    setForm((p) => ({
      ...p,
      features: p.features.includes(key)
        ? p.features.filter((f) => f !== key)
        : [...p.features, key],
    }));

  // ── Images ───────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newImgs: TemporaryImage[] = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      id: Math.random().toString(36).slice(2, 11),
    }));
    setTemporaryImages((prev) => [...prev, ...newImgs].slice(0, 20));
    e.target.value = "";
  };

  const removeTemporaryImage = (id: string) => {
    const img = temporaryImages.find((i) => i.id === id);
    if (img) URL.revokeObjectURL(img.previewUrl);
    setTemporaryImages((p) => p.filter((i) => i.id !== id));
  };

  const uploadAllImages = async (): Promise<string[]> => {
    if (temporaryImages.length === 0) return [];
    setUploadingImages(true);
    const urls: string[] = [];
    try {
      for (const img of temporaryImages) {
        const fd = new FormData();
        fd.append("file", img.file);
        const res = await api.post("/upload/property-image", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.data.url) urls.push(res.data.url);
      }
    } finally {
      setUploadingImages(false);
    }
    return urls;
  };

  // ── Location ─────────────────────────────────────────────────
  const handleLocationChange = (lat: number, lng: number) =>
    setForm((p) => ({ ...p, latitude: lat, longitude: lng }));

  // ── Validation ───────────────────────────────────────────────
  const validate = (): boolean => {
    if (step === 1) {
      if (!form.title.trim())       { toast.error("Titre requis");        return false; }
      if (!form.description.trim()) { toast.error("Description requise"); return false; }
      if (!form.price)              { toast.error("Prix requis");          return false; }
    }
    if (step === 2) {
      if (!form.surface)            { toast.error("Surface requise");           return false; }
      if (!form.rooms)              { toast.error("Nombre de pièces requis");   return false; }
      if (!form.address.trim())     { toast.error("Adresse requise");           return false; }
      if (!form.city.trim())        { toast.error("Ville requise");             return false; }
    }
    if (step === 4 && temporaryImages.length === 0) {
      toast.error("Ajoutez au moins 1 photo"); return false;
    }
    return true;
  };

  const next = () => { if (validate()) setStep((s) => Math.min(s + 1, 5)); };
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  // ── Soumission ───────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const uploadedUrls = await uploadAllImages();
      const payload = {
        title:       form.title,
        type:        form.type,
        description: form.description,
        price:       parseFloat(form.price)  || null,
        surface:     parseInt(form.surface)  || null,
        rooms:       parseInt(form.rooms)    || null,
        bedrooms:    form.bedrooms  ? parseInt(form.bedrooms)  : null,
        bathrooms:   form.bathrooms ? parseInt(form.bathrooms) : null,
        address:     form.address,
        city:        form.city,
        latitude:    form.latitude,
        longitude:   form.longitude,
        listingType: form.listingType,
        rentType:    form.rentType,
        features:    form.features,
        images:      uploadedUrls,
        status:      form.status,
        socialLoan:  form.socialLoan,
        isSHLMR:     form.isSHLMR,
      };
      await api.post("/properties", payload);
      toast.success("Annonce publiée avec succès !");
      navigate("/mon-compte/immobilier/mes-annonces");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Erreur lors de la publication");
    } finally {
      setLoading(false);
    }
  };

  // ── Statut courant ───────────────────────────────────────────
  const currentStatusInfo = STATUT_ANNONCE[form.status] ?? STATUT_ANNONCE["pending"];

  // ─────────────────────────────────────────────────────────────
  // RENDU
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .sans { font-family: 'DM Sans', sans-serif; }
        .field {
          font-family: 'DM Sans', sans-serif;
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e7e5e4;
          border-radius: 0.75rem;
          background: white;
          font-size: 0.95rem;
          color: #1c1917;
          transition: border-color 0.2s;
          outline: none;
        }
        .field:focus { border-color: #f59e0b; }
        .field::placeholder { color: #a8a29e; }
        select.field { cursor: pointer; appearance: auto; }
        textarea.field { resize: vertical; min-height: 140px; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.35s ease forwards; }
      `}</style>

      {/* ── LocationPickerModal ── */}
      <LocationPickerModal
        open={locationModalOpen}
        onOpenChange={setLocationModalOpen}
        latitude={form.latitude}
        longitude={form.longitude}
        onLocationChange={handleLocationChange}
      />

      <div className="w-ful h-[60px]">

      </div>

      {/* ── Header ── */}
      <div className="bg-white border-b border-stone-100 px-6 py-5 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Home className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#6B8E23]">Nouvelle annonce immobilière</h1>
              <p className="sans text-xs text-[#8B4513]">
                {LISTING_TYPE[form.listingType]} · {TYPE_BIEN[form.type]}
              </p>
            </div>
          </div>
          <div className="sans hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full px-3 py-1.5 text-xs font-medium">
            <CheckCircle className="h-3.5 w-3.5" />
            Abonnement actif
          </div>
        </div>
      </div>

      {/* ── Contenu ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <StepBar current={step} />

        {/* ══════════════════════════════════════════════════════════
            ÉTAPE 1 — Type d'annonce & Prix
        ══════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <div className="fade-up space-y-6">
            <h2 className="text-2xl font-bold text-[#6B8E23] flex items-center gap-3 mb-2">
              <Tag className="h-6 w-6 text-amber-500" />
              Type d'annonce & Prix
            </h2>

            {/* Type d'annonce */}
            <div>
              <label className="sans block text-xs font-semibold text-[#6B8E23] mb-2 uppercase tracking-wide">
                Type d'annonce *
              </label>
              <select
                className="field"
                value={form.listingType}
                onChange={(e) => set("listingType", e.target.value)}
              >
                {Object.entries(LISTING_TYPE).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            {/* Type de location (si location ou les deux) */}
            {(form.listingType === "rent" || form.listingType === "both") && (
              <div className="bg-purple-50/60 border-2 border-purple-100 rounded-xl p-4">
                <label className="sans block text-xs font-semibold text-purple-600 mb-2 uppercase tracking-wide">
                  Type de location *
                </label>
                <select
                  className="field"
                  value={form.rentType}
                  onChange={(e) => set("rentType", e.target.value)}
                >
                  {Object.entries(TYPE_LOCATION).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Type de bien */}
            <div>
              <label className="sans block text-xs font-semibold text-[#6B8E23] mb-2 uppercase tracking-wide">
                Type de bien *
              </label>
              <select
                className="field"
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
              >
                {Object.entries(TYPE_BIEN).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            {/* Prix */}
            <div>
              <label className="sans block text-xs font-semibold text-[#6B8E23] mb-2 uppercase tracking-wide">
                Prix (€) *
              </label>
              <div className="relative">
                <Euro className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B4513]" />
                <input
                  type="number"
                  className="field pl-11"
                  placeholder="350 000"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                />
              </div>
            </div>

            {/* Titre */}
            <div>
              <label className="sans block text-xs font-semibold text-[#6B8E23] mb-2 uppercase tracking-wide">
                Titre de l'annonce *
              </label>
              <input
                className="field"
                placeholder="Ex : Superbe villa avec vue mer à Saint-Gilles"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <label className="sans block text-xs font-semibold text-[#6B8E23] mb-2 uppercase tracking-wide">
                Description *
              </label>
              <textarea
                className="field"
                placeholder="Décrivez votre bien en détail : emplacement, état général, points forts, environnement…"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            ÉTAPE 2 — Caractéristiques + Position + Types sociaux
        ══════════════════════════════════════════════════════════ */}
        {step === 2 && (
          <div className="fade-up space-y-6">
            <h2 className="text-2xl font-bold text-[#6B8E23] flex items-center gap-3 mb-2">
              <Building2 className="h-6 w-6 text-amber-500" />
              Caractéristiques
            </h2>

            {/* Grille surface / pièces / chambres / sdb */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="sans block text-xs font-semibold text-[#6B8E23] mb-1.5 uppercase tracking-wide">
                  Surface (m²) *
                </label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8B4513]" />
                  <input
                    type="number" className="field pl-9" placeholder="85"
                    value={form.surface} onChange={(e) => set("surface", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="sans block text-xs font-semibold text-[#6B8E23] mb-1.5 uppercase tracking-wide">
                  Pièces *
                </label>
                <input
                  type="number" className="field" placeholder="4"
                  value={form.rooms} onChange={(e) => set("rooms", e.target.value)}
                />
              </div>
              <div>
                <label className="sans block text-xs font-semibold text-[#6B8E23] mb-1.5 uppercase tracking-wide">
                  Chambres
                </label>
                <div className="relative">
                  <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8B4513]" />
                  <input
                    type="number" className="field pl-9" placeholder="3"
                    value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="sans block text-xs font-semibold text-[#6B8E23] mb-1.5 uppercase tracking-wide">
                  Salles de bain
                </label>
                <div className="relative">
                  <Bath className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8B4513]" />
                  <input
                    type="number" className="field pl-9" placeholder="2"
                    value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Adresse */}
            <div>
              <label className="sans block text-xs font-semibold text-[#6B8E23] mb-1.5 uppercase tracking-wide">
                Adresse complète *
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B4513]" />
                <input
                  className="field pl-11"
                  placeholder="12 Rue des Bougainvilliers"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                />
              </div>
            </div>

            {/* Ville */}
            <div>
              <label className="sans block text-xs font-semibold text-[#6B8E23] mb-1.5 uppercase tracking-wide">
                Ville *
              </label>
              <input
                className="field"
                placeholder="Saint-Paul"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
              />
            </div>

            {/* ── Position GPS (LocationPickerModal) ── */}
            <div className="bg-white border-2 border-stone-100 rounded-xl p-5">
              <label className="sans block text-xs font-semibold text-[#6B8E23] mb-3 uppercase tracking-wide">
                Position GPS sur la carte
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setLocationModalOpen(true)}
                  className="sans flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  <Navigation className="h-4 w-4" />
                  {form.latitude && form.longitude
                    ? "Modifier la position"
                    : "Sélectionner sur la carte"}
                </button>

                {form.latitude && form.longitude ? (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block flex-shrink-0" />
                    <code className="sans text-xs bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200 text-[#8B4513]">
                      Lat&nbsp;{form.latitude.toFixed(6)}&nbsp;·&nbsp;Lng&nbsp;{form.longitude.toFixed(6)}
                    </code>
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, latitude: null, longitude: null }))}
                      className="p-1 hover:bg-stone-100 rounded-lg transition-colors"
                      title="Supprimer la position"
                    >
                      <X className="h-3.5 w-3.5 text-[#8B4513]" />
                    </button>
                  </div>
                ) : (
                  <p className="sans text-xs text-[#8B4513] italic">
                    Permet d'afficher le bien sur la carte interactive
                  </p>
                )}
              </div>
            </div>

            {/* ── Types sociaux ── */}
            <div className="bg-amber-50/60 border-2 border-amber-100 rounded-xl p-5">
              <h3 className="sans font-semibold text-[#6B8E23] mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Type de logement social (optionnel)
              </h3>

              {/* Radio PSLA / SHLMR / Aucun */}
              <div className="space-y-2 mb-4">
                {[
                  { val: "none",  label: "Aucun type social" },
                  { val: "PSLA",  label: "Prêt Social Location Accession (PSLA)" },
                  { val: "SHLMR", label: "SHLMR (Société Immobilière de La Réunion)" },
                ].map((opt) => (
                  <label
                    key={opt.val}
                    className={`sans flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${
                      currentDedicated === opt.val
                        ? "border-amber-400 bg-amber-50 text-amber-800 font-medium"
                        : "border-stone-200 bg-white text-[#8B4513] hover:border-stone-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="socialDedicated"
                      checked={currentDedicated === opt.val}
                      onChange={() => handleDedicatedSocial(opt.val as any)}
                      className="accent-amber-500"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>

              {/* Checkboxes SHUR / SIDR / SODIAC / SEDRE / SEMAC */}
              <p className="sans text-xs text-[#6B8E23] mb-2 font-semibold uppercase tracking-wide">
                Autres organismes sociaux
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SOCIAL_TYPE_FEATURES.map((type) => {
                  const selected = isSocialFeatureSelected(type);
                  return (
                    <label
                      key={type}
                      className={`sans flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${
                        selected
                          ? "border-amber-400 bg-amber-50 text-amber-800 font-medium"
                          : "border-stone-200 bg-white text-[#8B4513] hover:border-stone-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={(e) => handleSocialFeatureToggle(type, e.target.checked)}
                        className="accent-amber-500"
                      />
                      {type}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            ÉTAPE 3 — Équipements & Prestations
        ══════════════════════════════════════════════════════════ */}
        {step === 3 && (
          <div className="fade-up">
            <h2 className="text-2xl font-bold text-[#6B8E23] flex items-center gap-3 mb-6">
              <Sparkles className="h-6 w-6 text-amber-500" />
              Équipements & Prestations
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {EQUIPEMENTS.map(({ key, label }) => {
                const active = form.features.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleEquipement(key)}
                    className={`sans flex items-center gap-2.5 p-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                      active
                        ? "border-amber-400 bg-amber-50 text-amber-800"
                        : "border-stone-200 bg-white text-[#8B4513] hover:border-stone-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        active ? "border-amber-500 bg-amber-500" : "border-stone-300"
                      }`}
                    >
                      {active && <CheckCircle className="h-3 w-3 text-white" />}
                    </div>
                    {label}
                  </button>
                );
              })}
            </div>

            <p className="sans text-[#8B4513] text-xs mt-4">
              {form.features.filter((f) => !SOCIAL_TYPE_FEATURES.includes(f.toUpperCase())).length}{" "}
              équipement(s) sélectionné(s)
            </p>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            ÉTAPE 4 — Photos
        ══════════════════════════════════════════════════════════ */}
        {step === 4 && (
          <div className="fade-up">
            <h2 className="text-2xl font-bold text-[#6B8E23] flex items-center gap-3 mb-6">
              <ImageIcon className="h-6 w-6 text-amber-500" />
              Photos du bien
            </h2>

            {/* Zone de dépôt */}
            <div
              onClick={() => !uploadingImages && fileRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 mb-6 ${
                uploadingImages
                  ? "opacity-50 cursor-not-allowed border-stone-200"
                  : "border-amber-200 hover:border-amber-400 hover:bg-amber-50/40 cursor-pointer"
              }`}
            >
              {uploadingImages ? (
                <Loader2 className="h-10 w-10 text-amber-400 animate-spin mx-auto mb-3" />
              ) : (
                <Upload className="h-10 w-10 text-amber-400 mx-auto mb-3" />
              )}
              <p className="font-bold text-[#6B8E23] mb-1">
                {uploadingImages ? "Upload en cours…" : "Ajouter des photos"}
              </p>
              <p className="sans text-[#8B4513] text-sm">
                JPG, PNG, WEBP · max 5 Mo · jusqu'à 20 photos
              </p>
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploadingImages}
              />
            </div>

            {/* Compteur */}
            {temporaryImages.length > 0 && (
              <div className="sans flex items-center justify-between mb-3 text-sm">
                <span className="font-medium text-[#6B8E23]">
                  {temporaryImages.length} photo(s) sélectionnée(s)
                </span>
                <span className="text-[#8B4513] text-xs">
                  {20 - temporaryImages.length} emplacement(s) restant(s)
                </span>
              </div>
            )}

            {/* Grille */}
            {temporaryImages.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {temporaryImages.map((img, i) => (
                  <div
                    key={img.id}
                    className="relative group aspect-square rounded-xl overflow-hidden border-2 border-stone-100"
                  >
                    <img src={img.previewUrl} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeTemporaryImage(img.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-red-50 p-1.5 rounded-full"
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                    {i === 0 && (
                      <span className="sans absolute bottom-1.5 left-1.5 text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-medium">
                        Principale
                      </span>
                    )}
                    <span className="sans absolute top-1.5 right-1.5 text-xs bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-medium">
                      Nouveau
                    </span>
                  </div>
                ))}
              </div>
            )}

            {temporaryImages.length === 0 && (
              <div className="sans text-center text-[#8B4513] text-sm mt-4">
                <AlertTriangle className="h-5 w-5 mx-auto mb-1 text-amber-400" />
                Au moins 1 photo est requise pour publier
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            ÉTAPE 5 — Récapitulatif & Publication
        ══════════════════════════════════════════════════════════ */}
        {step === 5 && (
          <div className="fade-up">
            <h2 className="text-2xl font-bold text-[#6B8E23] flex items-center gap-3 mb-6">
              <FileText className="h-6 w-6 text-amber-500" />
              Récapitulatif & Publication
            </h2>

            {/* Tableau récap */}
            <div className="bg-white border border-stone-100 rounded-2xl p-6 mb-6">
              <div className="space-y-3">
                {(
                  [
                    ["Type d'annonce",  LISTING_TYPE[form.listingType]],
                    ...(form.listingType !== "sale"
                      ? [["Type de location", TYPE_LOCATION[form.rentType]]]
                      : []),
                    ["Type de bien",   TYPE_BIEN[form.type]],
                    ["Titre",          form.title],
                    ["Prix",           `${Number(form.price).toLocaleString("fr-FR")} €`],
                    ["Surface",        `${form.surface} m²`],
                    ["Pièces",         form.rooms],
                    ...(form.bedrooms  ? [["Chambres",     form.bedrooms]]  : []),
                    ...(form.bathrooms ? [["Salles de bain", form.bathrooms]] : []),
                    ["Adresse",        `${form.address}, ${form.city}`],
                    ...(form.latitude && form.longitude
                      ? [[
                          "Position GPS",
                          `${form.latitude.toFixed(5)}, ${form.longitude.toFixed(5)}`,
                        ]]
                      : []),
                    [
                      "Type social",
                      form.socialLoan
                        ? "PSLA"
                        : form.isSHLMR
                        ? "SHLMR"
                        : form.features
                            .filter((f) => SOCIAL_TYPE_FEATURES.includes(f.toUpperCase()))
                            .join(", ") || "Aucun",
                    ],
                    [
                      "Équipements",
                      form.features
                        .filter((f) => !SOCIAL_TYPE_FEATURES.includes(f.toUpperCase()))
                        .join(", ") || "Aucun",
                    ],
                    ["Photos", `${temporaryImages.length} photo(s)`],
                  ] as [string, string][]
                ).map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between text-sm gap-4 pb-2.5 border-b border-stone-50 last:border-0 last:pb-0"
                  >
                    <span className="sans text-[#6B8E23] flex-shrink-0">{k}</span>
                    <span className="sans font-medium text-[#6B8E23] text-right break-all">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Statut de publication */}
            <div className="mb-6">
              <p className="sans text-sm font-semibold text-[#8B4513] mb-3 uppercase tracking-wide">
                Statut de publication
              </p>
              <div className="space-y-2">
                {[
                  {
                    val:
                      form.listingType === "rent"
                        ? "for_rent"
                        : form.listingType === "both"
                        ? "both"
                        : "for_sale",
                    label: "Publier maintenant",
                    desc:
                      form.listingType === "rent"
                        ? "Visible immédiatement en tant qu'annonce de location"
                        : form.listingType === "both"
                        ? "Visible en vente et location"
                        : "Visible immédiatement en tant qu'annonce de vente",
                  },
                  {
                    val: "pending",
                    label: "Enregistrer comme brouillon",
                    desc: "Non visible publiquement · modifiable à tout moment",
                  },
                ].map((opt) => (
                  <label
                    key={opt.val}
                    className={`sans flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      form.status === opt.val
                        ? "border-amber-400 bg-amber-50"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={opt.val}
                      checked={form.status === opt.val}
                      onChange={(e) => set("status", e.target.value)}
                      className="mt-0.5 accent-amber-500"
                    />
                    <div>
                      <p className="font-semibold text-[#6B8E23] text-sm">{opt.label}</p>
                      <p className="text-[#6B8E23] text-xs mt-0.5">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Badge statut */}
            <div className="flex items-center justify-end gap-2">
              <span className="sans text-xs text-[#6B8E23]">Statut final :</span>
              <span className={`sans text-xs font-bold px-2.5 py-1 rounded-full ${currentStatusInfo.color}`}>
                {currentStatusInfo.label}
              </span>
            </div>
          </div>
        )}

        {/* ══ NAVIGATION ════════════════════════════════════════════════════ */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-stone-100">
          <button
            type="button"
            onClick={prev}
            disabled={step === 1 || loading || uploadingImages}
            className="sans flex items-center gap-2 px-5 py-3 border-2 border-stone-200 rounded-xl text-[#8B4513] hover:border-stone-300 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </button>

          {step < 5 ? (
            <button
              type="button"
              onClick={next}
              disabled={uploadingImages}
              className="sans flex items-center gap-2 px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || uploadingImages}
              className="sans flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg shadow-amber-200 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {loading || uploadingImages ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {uploadingImages ? "Upload en cours…" : "Publication…"}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {form.status === "pending"
                    ? "Enregistrer le brouillon"
                    : "Publier l'annonce"}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT — Gate abonnement + Formulaire
// ─────────────────────────────────────────────────────────────────────────────

const NouvelleAnnonceImmobilierPage: React.FC = () => (
  <SubscriptionGate>
    <AnnonceForm />
  </SubscriptionGate>
);

export default NouvelleAnnonceImmobilierPage;