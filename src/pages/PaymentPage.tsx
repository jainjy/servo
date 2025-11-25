// PaymentPage.jsx - Version améliorée
import React, { useEffect, useState } from "react";
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
import { useAuth } from "@/hooks/useAuth";
import { Progress } from "@/components/ui/progress";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ formData, subscriptionData, metiersLabel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const { signupPro, confirmPayment } = useAuth();
  const handlePayment = async () => {
    if (!stripe || !elements) return;
    setIsProcessing(true);
    setMessage("");

    try {
      // 1️⃣ Préparer les données avec métiers
      const userData = {
        ...formData,
        metiers: formData.metiers || [], // S'assurer que les métiers sont inclus
        userType: "professional",
      };

      // 2️⃣ Créer le PaymentIntent
      const response = await signupPro(
        userData,
        parseInt(subscriptionData.price),
        subscriptionData.truePlanId
      );

      const { clientSecret, paymentIntentId } = response;

      if (!clientSecret) {
        throw new Error("Client secret manquant");
      }

      // 3️⃣ Confirmer le paiement avec Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: `${userData.firstName} ${userData.lastName}`,
            email: userData.email,
            phone: userData.phone,
          },
        },
      });

      if (result.error) {
        setMessage(result.error.message || "Erreur lors du paiement");
      } else if (result.paymentIntent.status === "succeeded") {
        // 4️⃣ Confirmer le paiement côté serveur
        const confirmResponse = await confirmPayment(paymentIntentId);

        if (confirmResponse.success) {
          setMessage("✅ Paiement réussi !");

          // Redirection vers la page de succès
          navigate("/register/success", {
            state: {
              user: confirmResponse.user,
              plan: subscriptionData,
              paymentStatus: "completed",
              metiers: formData.metiers,
              metiersLabel:metiersLabel // Inclure les métiers dans la redirection
            },
          });
        } else {
          setMessage("Erreur lors de la confirmation du paiement");
        }
      }
    } catch (err) {
      console.error("Erreur paiement:", err);
      setMessage(
        err.response?.data?.message ||
          "Erreur lors du paiement. Veuillez réessayer."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () =>
    navigate("/register/professional/form", {
      state: {
        subscriptionData,
        formData,
      },
    });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full max-w-2xl">
        {/* En-tête avec progression */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Finalisation de votre inscription
          </h1>
          <Progress value={100} className="w-64 mx-auto h-2" />
          <p className="text-gray-600">Étape 3/3 - Paiement sécurisé</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

            <Button
              variant="outline"
              className="w-full h-11 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux informations
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

          {/* Récapitulatif */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl shadow-xl p-6 text-white">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <BadgeCheck className="h-5 w-5" />
              Récapitulatif de commande
            </h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                <span>Abonnement:</span>
                <span className="font-semibold">
                  {subscriptionData.planTitle}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                <span>Période:</span>
                <span className="font-semibold">
                  {subscriptionData.period === "month" ? "Mensuel" : "Annuel"}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                <span>Prix:</span>
                <span className="font-semibold text-xl">
                  {subscriptionData.price} €
                </span>
              </div>
            </div>

            {/* Métiers sélectionnés */}
            {formData.metiers && formData.metiers.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Métiers sélectionnés:</h4>
                <div className="space-y-2">
                  {formData.metiers.map((metier, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm bg-white/10 rounded-lg p-2"
                    >
                      <CheckCircle className="h-4 w-4 text-green-300" />
                      <span>{metiersLabel[metier]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Avantages inclus */}
            <div className="border-t border-white/20 pt-4">
              <h4 className="font-semibold mb-3">Avantages inclus:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-300" />
                  Profil professionnel visible
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-300" />
                  Gestion des devis et factures
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-300" />
                  Support prioritaire
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PaymentPage() {
  const location = useLocation();
  const { formData, subscriptionData, metiersLabel } = location.state || {};
  // Validation des données
  if (!formData || !subscriptionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Données manquantes
          </h2>
          <p className="text-gray-600 mb-4">
            Veuillez revenir à l'étape précédente pour compléter votre
            inscription
          </p>
          <Button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        formData={formData}
        subscriptionData={subscriptionData}
        metiersLabel={metiersLabel}
      />
    </Elements>
  );
}
