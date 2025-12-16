// SubscriptionPaymentPage.jsx - Adaptation pour paiement d'abonnement
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Lock,
  CreditCard,
  CheckCircle,
  Shield,
  BadgeCheck,
  Clock,
  Copy,
  AlertCircle,
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ subscriptionData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const { confirmPayment } = useAuth();
  const [copiedCard, setCopiedCard] = useState(null);

const handlePayment = async () => {
  if (!stripe || !elements) return;
  setIsProcessing(true);
  setMessage("");
  try {
    // Utiliser la nouvelle route
    const response = await api.post(
      "/subscription-payments/create-payment-intent",
      {
        amount: parseInt(subscriptionData.price),
        planId: subscriptionData.truePlanId,
      }
    );
    const { clientSecret, paymentIntentId } = response.data;

    // Confirmer le paiement
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: "Nom du pro", // À adapter avec user data
        },
      },
    });

    if (result.error) {
      setMessage(result.error.message || "Erreur lors du paiement");
    } else if (result.paymentIntent.status === "succeeded") {
      // Utiliser la nouvelle route de confirmation
      const confirmResponse = await api.post(
        "/subscription-payments/confirm-upgrade",
        {
          paymentIntentId: paymentIntentId,
        }
      );

      if (confirmResponse.data.success) {
        setMessage("✅ Paiement réussi ! Abonnement mis à jour.");
        toast.success("Abonnement mis à jour avec succès");
        setTimeout(() => {
          navigate("/pro/subscription");
        }, 2000);
      }
    }
  } catch (err) {
    console.error("Erreur paiement:", err);
    setMessage(err.response?.data?.error || "Erreur lors du paiement.");
  } finally {
    setIsProcessing(false);
  }
};

  const copyToClipboard = (text, cardType) => {
    navigator.clipboard.writeText(text);
    setCopiedCard(cardType);
    toast.success("Copié dans le presse-papiers");
    setTimeout(() => setCopiedCard(null), 2000);
  };

  const testCards = [
    {
      type: "success",
      number: "4242 4242 4242 4242",
      description: "Paiement réussi",
      color: "bg-green-50 border-green-200",
      textColor: "text-green-700",
    },
    {
      type: "decline",
      number: "4000 0000 0000 0002",
      description: "Paiement refusé",
      color: "bg-red-50 border-red-200",
      textColor: "text-red-700",
    },
    {
      type: "3d",
      number: "4000 0025 0000 3155",
      description: "Authentification 3D",
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-700",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full max-w-4xl">
        {/* En-tête avec progression */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Finaliser votre abonnement
          </h1>
          <Progress value={100} className="w-64 mx-auto h-2" />
          <p className="text-gray-600">Paiement sécurisé</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne gauche - Formulaire de paiement */}
          <div className="lg:col-span-2">
            {/* Carte de paiement */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Paiement sécurisé
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Vos informations sont cryptées
                  </p>
                </div>
              </div>

              {/* Section carte bancaire */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Informations de carte bancaire
                </label>
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#1f2937",
                          "::placeholder": {
                            color: "#9ca3af",
                          },
                          fontFamily: "Inter, sans-serif",
                        },
                      },
                      hidePostalCode: true,
                    }}
                  />
                </div>
              </div>

              {/* Badges de sécurité */}
              <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Paiement sécurisé SSL</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-blue-500" />
                  <span>Chiffrement 256-bit</span>
                </div>
              </div>

              {/* Bouton de paiement */}
              <Button
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg rounded-xl shadow-lg transition-all duration-200 mb-4"
                onClick={handlePayment}
                disabled={isProcessing || !subscriptionData.price}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 animate-spin" />
                    Traitement en cours...
                  </div>
                ) : (
                  `Payer ${subscriptionData.price} € - Finaliser`
                )}
              </Button>

              {message && (
                <div
                  className={`mt-4 p-3 rounded-lg text-center ${
                    message.includes("✅")
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>

            {/* Numéros de test Stripe */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <h3 className="font-bold text-gray-900">
                  Numéros de test (Mode Test)
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Utilisez ces numéros pour tester différents scénarios. Mois : 12/34, CVV : 123
              </p>

              <div className="space-y-3">
                {testCards.map((card) => (
                  <div
                    key={card.type}
                    className={`p-4 rounded-lg border ${card.color}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className={`font-semibold ${card.textColor}`}>
                          {card.description}
                        </p>
                        <p className="text-sm font-mono text-gray-700 mt-1">
                          {card.number}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(card.number.replace(/\s/g, ""), card.type)}
                        className="flex-shrink-0"
                      >
                        {copiedCard === card.type ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Copy className="h-5 w-5 text-gray-600" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Colonne droite - Résumé de commande */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Résumé de votre abonnement
              </h2>

              {/* Détails du plan */}
              <div className="space-y-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Plan sélectionné</p>
                  <p className="text-lg font-bold text-gray-900">
                    {subscriptionData.planTitle}
                  </p>
                </div>

                {subscriptionData.description && (
                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-sm text-gray-700">
                      {subscriptionData.description}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600">Période</p>
                  <p className="text-sm font-medium text-gray-900">
                    {subscriptionData.period || "mensuel"}
                  </p>
                </div>
              </div>

              {/* Avantages */}
              {subscriptionData.features && (
                <div className="py-4 border-b border-gray-200">
                  <p className="text-sm font-bold text-gray-900 mb-3">
                    Avantages inclus :
                  </p>
                  <ul className="space-y-2">
                    {subscriptionData.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tarif */}
              <div className="py-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Montant</span>
                  <span className="font-medium text-gray-900">
                    {subscriptionData.price} €
                  </span>
                </div>

                {subscriptionData.isRenewal && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium text-blue-600">
                      Renouvellement
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      {subscriptionData.price} €
                    </span>
                  </div>
                </div>
              </div>

              {/* Conditions */}
              <p className="text-xs text-gray-500 text-center mt-4">
                En cliquant sur "Payer", vous acceptez nos{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  conditions d'utilisation
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SubscriptionPaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subscriptionData } = location.state || {};

  if (!subscriptionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Données manquantes
          </h2>
          <p className="text-gray-600 mb-6">
            Les données d'abonnement n'ont pas pu être chargées.
          </p>
          <Button onClick={() => navigate("/pro/subscription")}>
            Retourner à l'abonnement
          </Button>
        </div>
      </div>
    );
  }

  // console.log("Données d'abonnement reçues :", subscriptionData);

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm subscriptionData={subscriptionData} />
    </Elements>
  );
}
