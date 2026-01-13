import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentRequestButtonElement,
  useStripe,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function PaymentRequestForm() {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);

  useEffect(() => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: "FR",
      currency: "eur",
      total: {
        label: "Paiement du cours",
        amount: 1000, // 10 €
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      if (result) setPaymentRequest(pr);
    });

    pr.on("paymentmethod", async (event) => {
      const res = await fetch("http://localhost:4242/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 1000 }),
      });

      const { clientSecret } = await res.json();

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: event.paymentMethod.id,
        }
      );

      if (error) {
        event.complete("fail");
        alert("❌ Paiement échoué");
      } else {
        event.complete("success");
        alert("✅ Paiement réussi !");
       
      }
    });
  }, [stripe]);

  return (
    <div style={styles.card}>
      <h2>Paiement sécurisé</h2>

      {paymentRequest ? (
        <PaymentRequestButtonElement options={{ paymentRequest }} />
      ) : (
        <p>Google Pay / Apple Pay non disponible</p>
      )}
    </div>
  );
}

export default function PaymentTest() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentRequestForm />
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
};
