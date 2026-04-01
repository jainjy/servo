// SubscriptionImmobilierPage.tsx
// Page d'abonnement 35€ HT pour accéder à la vente de biens immobiliers
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Home,
  CheckCircle,
  Lock,
  Shield,
  Star,
  ArrowRight,
  Building2,
  TrendingUp,
  Users,
  Eye,
  Camera,
  BarChart3,
  MessageSquare,
  Zap,
  Crown,
  X,
  AlertCircle,
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// ─── Hook: Vérifier si l'utilisateur a un abonnement ───────────────────────
const useSubscriptionCheck = () => {
  const [hasSubscription, setHasSubscription] = React.useState<boolean | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
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

// ─── Prix & TVA ─────────────────────────────────────────────────────────────
const PRIX_HT = 35;
const TVA_RATE = 0.2;
const PRIX_TTC = parseFloat((PRIX_HT * (1 + TVA_RATE)).toFixed(2)); // 42€

// ─── Features incluses ───────────────────────────────────────────────────────
const FEATURES = [
  { icon: Home, label: "Publication d'annonces immobilières illimitées" },
  { icon: Camera, label: "Jusqu'à 20 photos par annonce" },
  { icon: Eye, label: "Visibilité dans les résultats de recherche" },
  { icon: MessageSquare, label: "Messagerie avec les acheteurs potentiels" },
  { icon: BarChart3, label: "Statistiques de vues de vos annonces" },
  { icon: TrendingUp, label: "Mise en avant de votre bien" },
  { icon: Users, label: "Accès au réseau d'acheteurs qualifiés" },
  { icon: Zap, label: "Support prioritaire" },
];

// ─── PaymentForm ─────────────────────────────────────────────────────────────
const PaymentForm: React.FC<{ onSuccess: () => void; onCancel: () => void }> = ({
  onSuccess,
  onCancel,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setIsProcessing(true);
    setErrorMsg("");

    try {
      // 1. Créer le PaymentIntent côté serveur
      // On crée un plan spécifique "immobilier-user" à 35€ HT (42€ TTC)
      // Dans votre backend, assurez-vous d'avoir ce plan (planId = celui correspondant à l'abonnement vente immobilier user)
      const response = await api.post("/subscription-payments/create-payment-intent", {
        planId: "10", // ID du plan dans votre BDD
        visibilityOption: "standard",
      });

      const { clientSecret, paymentIntentId } = response.data;

      // 2. Confirmer le paiement
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setErrorMsg(result.error.message || "Erreur lors du paiement");
      } else if (result.paymentIntent.status === "succeeded") {
        // 3. Confirmer l'abonnement
        await api.post("/subscription-payments/confirm-upgrade", {
          paymentIntentId,
        });
        toast.success("Abonnement activé ! Vous pouvez maintenant publier vos annonces.");
        onSuccess();
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || "Une erreur est survenue.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full">
      {/* Card Input */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-[#6B8E23] mb-2 tracking-wide uppercase">
          Informations de carte
        </label>
        <div className="border-2 border-amber-200 bg-amber-50/60 rounded-xl px-4 py-4 focus-within:border-amber-400 transition-colors">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#292524",
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  "::placeholder": { color: "#a8a29e" },
                },
              },
              hidePostalCode: true,
            }}
          />
        </div>
      </div>

      {/* Error */}
      {errorMsg && (
        <div className="mb-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Résumé */}
      <div className="mb-5 bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2 text-sm">
        <div className="flex justify-between text-[#8B4513]">
          <span>Abonnement Vente Immobilière</span>
          <span>{PRIX_HT} € HT</span>
        </div>
        <div className="flex justify-between text-[#6B8E23] text-xs">
          <span>TVA 20 %</span>
          <span>{(PRIX_HT * TVA_RATE).toFixed(2)} €</span>
        </div>
        <div className="flex justify-between font-bold text-[#6B8E23] border-t border-stone-200 pt-2">
          <span>Total TTC</span>
          <span className="text-amber-700">{PRIX_TTC} €</span>
        </div>
        <p className="text-[#8B4513] text-xs">Facturation mensuelle · Résiliable à tout moment</p>
      </div>

      {/* Boutons */}
      <button
        onClick={handlePay}
        disabled={isProcessing || !stripe}
        className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-amber-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <span className="h-5 w-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Traitement…
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" />
            Payer {PRIX_TTC} € · Activer mon abonnement
          </>
        )}
      </button>

      <button
        onClick={onCancel}
        className="w-full mt-3 py-3 text-[#6B8E23] hover:text-[#6B8E23] text-sm transition-colors"
      >
        Annuler
      </button>

      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-[#8B4513]">
        <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> SSL sécurisé</span>
        <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Stripe certifié PCI</span>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const SubscriptionImmobilierPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);
  const { hasSubscription, loading } = useSubscriptionCheck();

  // Vérifier si l'utilisateur a déjà un abonnement
  React.useEffect(() => {
    if (!loading && hasSubscription) {
      navigate("/mon-compte/immobilier/nouvelle-annonce");
    }
  }, [hasSubscription, loading, navigate]);

  return (
    <div
      className="min-h-screen bg-stone-50"
      style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .sans { font-family: 'DM Sans', sans-serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          from { background-position: -200% center; }
          to   { background-position: 200% center; }
        }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .fade-up-d1 { animation: fadeUp 0.6s 0.1s ease forwards; opacity: 0; }
        .fade-up-d2 { animation: fadeUp 0.6s 0.2s ease forwards; opacity: 0; }
        .fade-up-d3 { animation: fadeUp 0.6s 0.3s ease forwards; opacity: 0; }
        .shimmer-text {
          background: linear-gradient(90deg, #92400e, #f59e0b, #d97706, #92400e);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
      `}</style>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="h-10 w-10 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mb-4" />
          <p className="sans text-[#6B8E23]">Vérification de votre abonnement…</p>
        </div>
      )}

      {/* Content - afficher seulement si pas en cours de chargement */}
      {!loading && !hasSubscription && (
        <>
      <div className="max-w-2xl mx-auto px-6 py-20 text-center mt-40">
        <Building2 className="h-12 w-12 text-amber-400 mx-auto mb-6" />
        <h3 className="text-3xl font-bold text-[#6B8E23] mb-3">
          Prêt à mettre votre bien en vente ?
        </h3>
        <p className="sans text-[#6B8E23] mb-8">
          Rejoignez des centaines de propriétaires qui font confiance à notre plateforme
          pour vendre leur bien au meilleur prix.
        </p>
        <button
          onClick={() => setShowPayment(true)}
          className="sans inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
        >
          S'abonner maintenant · {PRIX_TTC}€ TTC/mois
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* ── Modal paiement ── */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-[fadeUp_0.3s_ease]">
            {/* Modal header */}
            <div className="bg-gradient-to-r from-stone-900 to-stone-800 p-6 text-white flex items-start justify-between">
              <div>
                <p className="sans text-[#8B4513] text-sm uppercase tracking-widest mb-1">Activation</p>
                <h3 className="text-2xl font-bold">Abonnement Immobilier</h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-amber-400">{PRIX_HT}€</span>
                  <span className="sans text-[#8B4513] text-sm">HT / mois</span>
                </div>
              </div>
              <button
                onClick={() => setShowPayment(false)}
                className="mt-1 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5 text-[#8B4513]" />
              </button>
            </div>

            {/* Included features mini */}
            <div className="px-6 py-4 bg-amber-50/60 border-b border-amber-100">
              <p className="sans text-xs text-[#6B8E23] uppercase tracking-wide font-semibold mb-2">Inclus dans votre abonnement</p>
              <div className="grid grid-cols-2 gap-y-1 gap-x-3">
                {["Annonces illimitées", "20 photos/annonce", "Messagerie acheteurs", "Statistiques"].map((f) => (
                  <div key={f} className="sans flex items-center gap-1.5 text-xs text-[#8B4513]">
                    <CheckCircle className="h-3 w-3 text-amber-500 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="p-6">
              <Elements stripe={stripePromise}>
                <PaymentForm
                  onSuccess={() => {
                    setShowPayment(false);
                    navigate("/mon-compte/immobilier/nouvelle-annonce");
                  }}
                  onCancel={() => setShowPayment(false)}
                />
              </Elements>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default SubscriptionImmobilierPage;