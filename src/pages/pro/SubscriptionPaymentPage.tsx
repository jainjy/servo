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
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Progress } from "@/components/ui/progress";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ subscriptionData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const { confirmPayment } = useAuth();

  const handlePayment = async () => {
    if (!stripe || !elements) return;
    setIsProcessing(true);
    setMessage("");
    try {
      // Créer le PaymentIntent pour l'upgrader
      const response = await api.post("/auth/create-payment-intent", {
        amount: parseInt(subscriptionData.price),
        planId: subscriptionData.truePlanId,
      });
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
        const confirmResponse = await confirmPayment(paymentIntentId);
        if (confirmResponse.success) {
          setMessage("✅ Paiement réussi ! Abonnement mis à jour.");
          navigate("/pro/subscription");
        }
      }
    } catch (err) {
      setMessage("Erreur lors du paiement.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full max-w-2xl">
        {/* En-tête avec progression */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Abonnement
          </h1>
          <Progress value={100} className="w-64 mx-auto h-2" />
          <p className="text-gray-600">Paiement sécurisé</p>
        </div>

        <div className="grid grid-cols-1">
          {/* Carte de paiement */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
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


        </div>
      </div>
    </div>
  );
};

export default function SubscriptionPaymentPage() {
  const location = useLocation();
  const { subscriptionData } = location.state || {};
  if (!subscriptionData) {
    return <div>Données manquantes. Retournez à l'abonnement.</div>;
  }
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm subscriptionData={subscriptionData} />
    </Elements>
  );
}
