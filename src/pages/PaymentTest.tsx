import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href, // redirection après paiement
      },
    });

    if (error) {
      alert("❌ Paiement échoué : " + error.message);
      console.log(error);
    } else if (paymentIntent) {
      alert("✅ Paiement réussi !");
      console.log(paymentIntent);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.card}>
      <h2>Paiement sécurisé</h2>
      <PaymentElement /> {/* Affiche toutes les méthodes Stripe disponibles */}
      <button type="submit" disabled={!stripe} style={styles.button}>
        Payer
      </button>
    </form>
  );
}

export default function PaymentTest() {
  const [clientSecret, setClientSecret] = useState<string>("");

  useEffect(() => {
    // Crée le PaymentIntent côté serveur
    fetch("http://localhost:4242/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 1000 }), // 10 €
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  if (!clientSecret) return <p>Chargement...</p>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>
  );
}

const styles = {
  card: {
    width: "350px",
    margin: "100px auto",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#6772e5",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  },
};
