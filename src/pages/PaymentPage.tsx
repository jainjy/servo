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
import { ArrowLeft, Lock, CreditCard } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ formData, subscriptionData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const handlePayment = async () => {
    if (!stripe || !elements) return;
    setIsProcessing(true);

    try {
      // 1️⃣ Créer le PaymentIntent côté serveur
      const res = await fetch("http://localhost:3001/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: formData.id,
          amount: subscriptionData.price,
          currency: "eur",
          description: `Abonnement: ${subscriptionData.planTitle}`,
          referenceType: "subscription",
          referenceId: subscriptionData.id,
        }),
      });

      const { clientSecret } = await res.json();

      // 2️⃣ Confirmer le paiement avec Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setMessage(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        setMessage("✅ Paiement réussi !");

        // Redirection vers succès
        navigate("/register/success", {
          state: {
            user: formData,
            plan: subscriptionData,
            paymentStatus: "completed",
          },
        });
      }
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors du paiement. Veuillez réessayer.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () =>
    navigate("/register/professional/form", { state: { subscriptionData } });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-blue-200">
      <div className="w-full max-w-md">
        <div className="bg-white p-6 rounded shadow-2xl">
          <div className="text-center mb-4">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">Paiement sécurisé</h2>
            <p className="text-gray-600">
              Finalisez votre inscription professionnelle
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold">Récapitulatif</h3>
            <div className="flex justify-between">
              <span>Abonnement:</span>
              <span className="font-semibold">
                {subscriptionData.planTitle}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Prix:</span>
              <span className="font-semibold">{subscriptionData.price} €</span>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold">Informations de paiement</h3>
            <div className="border p-3 rounded mb-2">
              <CardElement />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Lock className="h-4 w-4 text-green-500" />
            <span>Paiement 100% sécurisé et crypté</span>
          </div>

          {message && <p className="text-red-500 mb-2">{message}</p>}

          <Button
            className="w-full h-11 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold mb-2"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing
              ? "Traitement..."
              : `Payer ${subscriptionData.price} €`}
          </Button>
          <Button
            variant="outline"
            className="w-full h-11"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function PaymentPage() {
  const location = useLocation();
  const { formData, subscriptionData } = location.state || {};
  if (!formData || !subscriptionData) return null;

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm formData={formData} subscriptionData={subscriptionData} />
    </Elements>
  );
}
