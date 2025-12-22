import React, { useState, useEffect } from "react";
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(3); // AJOUT
  const [cooldownTime, setCooldownTime] = useState(null); // AJOUT

  const navigate = useNavigate();
  const { forgotPassword } = useAuth();

  // S'assurer que nous sommes côté client
  useEffect(() => {
    setIsClient(true);

    // 🔥 AJOUT: Vérifier le localStorage pour le nombre de tentatives
    const storedAttempts = localStorage.getItem("passwordResetAttempts");
    const storedTime = localStorage.getItem("passwordResetLastAttempt");

    if (storedAttempts && storedTime) {
      const lastAttemptTime = new Date(storedTime);
      const now = new Date();
      const hoursSinceLastAttempt = (now - lastAttemptTime) / (1000 * 60 * 60);

      // Réinitialiser après 1 heure
      if (hoursSinceLastAttempt >= 1) {
        localStorage.removeItem("passwordResetAttempts");
        localStorage.removeItem("passwordResetLastAttempt");
        setAttemptsLeft(3);
      } else {
        const attemptsUsed = parseInt(storedAttempts);
        setAttemptsLeft(3 - attemptsUsed);

        // Calculer le temps de recharge
        const cooldownEnd = new Date(
          lastAttemptTime.getTime() + 60 * 60 * 1000
        );
        setCooldownTime(cooldownEnd);
      }
    }
  }, []);

  // 🔥 AJOUT: Mettre à jour le compteur de cooldown
  useEffect(() => {
    if (!cooldownTime) return;

    const timer = setInterval(() => {
      const now = new Date();
      if (now >= cooldownTime) {
        setCooldownTime(null);
        setAttemptsLeft(3);
        localStorage.removeItem("passwordResetAttempts");
        localStorage.removeItem("passwordResetLastAttempt");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isClient) return;

    // 🔥 AJOUT: Vérifier les tentatives
    if (attemptsLeft <= 0) {
      toast.error("Trop de tentatives. Veuillez réessayer dans 1 heure.");
      return;
    }

    if (!email) {
      toast.error("Veuillez entrer votre adresse email");
      return;
    }

    setIsLoading(true);

    try {
      // Appel à l'API backend
      const response = await forgotPassword(email);

      // 🔥 AJOUT: Mettre à jour le localStorage
      const storedAttempts = localStorage.getItem("passwordResetAttempts") || 0;
      const newAttempts = parseInt(storedAttempts) + 1;
      localStorage.setItem("passwordResetAttempts", newAttempts);
      localStorage.setItem(
        "passwordResetLastAttempt",
        new Date().toISOString()
      );

      if (response.attemptsLeft !== undefined) {
        setAttemptsLeft(response.attemptsLeft);
      }

      setIsSubmitted(true);
      toast.success("Email envoyé ! Vérifiez votre boîte de réception.");
    } catch (error) {
      console.error("Erreur:", error);

      // 🔥 AJOUT: Gestion spécifique du rate limiting
      if (error.response?.status === 429) {
        const errorData = error.response.data;
        toast.error(
          errorData.message ||
            "Trop de tentatives. Veuillez réessayer dans 1 heure."
        );

        // Mettre en cooldown
        const cooldownEnd = new Date(Date.now() + 60 * 60 * 1000);
        setCooldownTime(cooldownEnd);
        setAttemptsLeft(0);
        localStorage.setItem("passwordResetAttempts", 3);
        localStorage.setItem(
          "passwordResetLastAttempt",
          new Date().toISOString()
        );
        return;
      }

      // Messages d'erreur plus spécifiques
      if (error.message.includes("Email requis")) {
        toast.error("Veuillez entrer votre adresse email");
      } else if (error.message.includes("non trouvé")) {
        // Pour des raisons de sécurité, on montre un message générique même si l'email n'existe pas
        toast.success(
          "Si votre email est enregistré, vous recevrez un lien de réinitialisation"
        );
        setIsSubmitted(true);
      } else {
        toast.error(
          error.message || "Une erreur est survenue. Veuillez réessayer."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 AJOUT: Fonction pour formater le temps restant
  const formatTimeRemaining = () => {
    if (!cooldownTime) return null;

    const now = new Date();
    const diffMs = cooldownTime - now;

    if (diffMs <= 0) return null;

    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);

    return `${diffMins}:${diffSecs.toString().padStart(2, "0")}`;
  };

  // Composant simple pendant le SSR ou chargement
  if (!isClient) {
    return (
      <div className="min-h-screen flex">
        <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50/30">
          <div className="w-full max-w-md">
            <Card className="border-0 shadow-lg">
              <CardHeader className="space-y-1 pb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#556B2F] to-[#6B8E23] rounded-2xl flex items-center justify-center">
                    <img src="/logo.png" className="h-10 w-10" alt="Logo" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center text-gray-900">
                  Mot de passe oublié
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div className="w-8 h-8 border-4 border-[#556B2F] border-t-transparent rounded-full animate-spin"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex relative overflow-hidden">
      {/* Effet de fond global */}
      <div className="absolute top-0 left-[-5rem] w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 right-[-5rem] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

      <div className="absolute inset-0 bg-black/80 backdrop-blur-lg -z-10"></div>
      <div className="absolute inset-0 -z-20">
        <img
          src="/nature.jpeg"
          alt="Login Illustration"
          className="opacity-70 w-full h-full object-cover"
        />
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center gap-10 px-6 py-16 lg:py-24 z-10 max-w-7xl">
        {/* Texte à gauche (caché sur petits écrans) */}
        <div className="hidden lg:block text-white max-w-lg space-y-6">
          {/* ... code existant ... */}
        </div>

        {/* Formulaire à droite dans une card */}
        <div className="flex justify-center w-full max-w-md">
          <Card className="border-0 shadow-2xl bg-[#FFFFFF]/95 backdrop-blur-md">
            <CardHeader className="pt-8 px-8 pb-4">
              {/* Retour */}
              <div className="flex items-center mb-1">
                <Link
                  to="/login"
                  className="inline-flex items-center text-sm text-[#556B2F] hover:text-[#556B2F]/90 font-medium"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour à la connexion
                </Link>
              </div>

              {/* 🔥 AJOUT: Indicateur de tentatives */}
              {attemptsLeft < 3 && (
                <div className="mb-4">
                  <div
                    className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${
                      attemptsLeft === 0
                        ? "bg-red-50 border border-red-200 text-red-700"
                        : "bg-yellow-50 border border-yellow-200 text-yellow-700"
                    }`}
                  >
                    {attemptsLeft === 0 ? (
                      <>
                        <AlertCircle className="h-4 w-4" />
                        <span className="flex-1">
                          Trop de tentatives
                          {cooldownTime && (
                            <span className="ml-1 font-medium">
                              (reprise dans {formatTimeRemaining()})
                            </span>
                          )}
                        </span>
                      </>
                    ) : (
                      <>
                        {/* <Clock className="h-4 w-4" />
                        <span>
                          Tentatives restantes :{" "}
                          <strong>{attemptsLeft}/3</strong>
                        </span> */}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Logo au-dessus du titre sur petits écrans */}
              <div className="flex justify-center mb-4 lg:hidden">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                  <img src="/logo.png" className="h-10 w-10" alt="Logo" />
                </div>
              </div>

              <CardTitle className="text-2xl font-bold text-center text-gray-900">
                {isSubmitted ? "Email envoyé !" : "Mot de passe oublié"}
              </CardTitle>

              <CardDescription className="text-center text-gray-600">
                {isSubmitted
                  ? "Consultez votre boîte mail pour réinitialiser votre mot de passe"
                  //: `Entrez votre email pour recevoir un lien de réinitialisation (${attemptsLeft}/3 tentatives)`}
                  : `Entrez votre email pour recevoir un lien de réinitialisation`}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700 block"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="votre@email.mg"
                        className="pl-10 h-11 bg-[#FFFFFF] border-[#D3D3D3] focus:border-[#556B2F] rounded-md"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={attemptsLeft <= 0 || isLoading}
                      />
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 bg-[#556B2F]/10 p-4 rounded-lg border border-[#556B2F]/20">
                    <p className="font-medium text-[#556B2F] mb-1">
                      Sécurité :
                    </p>
                    <p>
                      • Limité à 3 tentatives par heure
                      <br />
                      • Le lien est valable 24 heures
                      <br />• Vérifiez votre dossier spam
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-[#556B2F] to-[#6B8E23] hover:from-[#556B2F]/90 hover:to-[#6B8E23]/90 text-white font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || !isClient || attemptsLeft <= 0}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Envoi en cours...
                      </div>
                    ) : attemptsLeft <= 0 ? (
                      <div className="flex items-center gap-2 justify-center">
                        <Clock className="h-4 w-4" />
                        {cooldownTime
                          ? `Réessayer dans ${formatTimeRemaining()}`
                          : "Trop de tentatives"}
                      </div>
                    ) : (
                      "Envoyer le lien de réinitialisation"
                    )}
                  </Button>

                  <div className="text-center text-sm text-gray-600">
                    Vous vous souvenez de votre mot de passe ?{" "}
                    <Link
                      to="/login"
                      className="text-[#556B2F] hover:text-[#556B2F]/90 font-medium"
                    >
                      Se connecter
                    </Link>
                  </div>
                </form>
              ) : (
                <div className="space-y-6 text-center px-4">
                  {/* Icône de succès */}
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-[#6B8E23]/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-10 w-10 text-[#6B8E23]" />
                    </div>
                  </div>

                  {/* Message de confirmation */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {email
                        ? `Lien envoyé à ${email}`
                        : "Lien envoyé avec succès !"}
                    </h3>
                    <p className="text-gray-600">
                      Si votre email est enregistré dans notre système, vous
                      recevrez un lien de réinitialisation dans quelques
                      minutes.
                    </p>
                    {attemptsLeft > 0 && (
                      <div className="text-sm text-[#556B2F]">
                        Tentatives restantes : <strong>{attemptsLeft}/3</strong>
                      </div>
                    )}
                  </div>

                  {/* Conseils */}
                  <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-[#D3D3D3] text-left">
                    <p className="font-medium text-gray-800 mb-2">Conseils :</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>
                        Vérifiez votre dossier spam si vous ne trouvez pas
                        l'email
                      </li>
                      <li>Le lien est valable pendant 24 heures</li>
                      <li>
                        Contactez le support si vous rencontrez des problèmes
                      </li>
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <Button
                      onClick={() => {
                        setIsSubmitted(false);
                        setEmail("");
                      }}
                      variant="outline"
                      className="w-full h-11"
                      disabled={attemptsLeft <= 0}
                    >
                      {attemptsLeft <= 0 ? (
                        <div className="flex items-center gap-2 justify-center">
                          <Clock className="h-4 w-4" />
                          Tentatives épuisées
                        </div>
                      ) : (
                        "Réessayer avec un autre email"
                      )}
                    </Button>

                    <Link to="/login" className="block">
                      <Button
                        variant="ghost"
                        className="w-full h-11 text-[#556B2F] hover:text-[#556B2F]/90 hover:bg-[#556B2F]/10"
                      >
                        Retour à la connexion
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
