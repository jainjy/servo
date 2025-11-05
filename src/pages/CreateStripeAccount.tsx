import { useState } from "react";

export default function StripeConnectButton({ user }) {
  const [loading, setLoading] = useState(false);

  const createAccount = async () => {
    setLoading(true);
    const res = await fetch(
      "https://e5f1-102-12-45-17.ngrok-free.app/api/stripe/connect-account",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      }
    );

    const data = await res.json();
    window.location.href = data.url; // Redirige vers Stripe
  };

  return (
    <button
      onClick={createAccount}
      disabled={loading}
      className="bg-blue-600 text-white px-4 py-2 rounded-md"
    >
      {loading ? "Connexion à Stripe..." : "Créer mon compte Stripe"}
    </button>
  );
}
