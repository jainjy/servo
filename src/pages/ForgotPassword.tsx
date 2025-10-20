import React, { useState, useEffect } from "react";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // S'assurer que nous sommes côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isClient) return;

    setIsLoading(true);

    try {
      // Simulation d'envoi d'email - à remplacer par votre backend
      console.log('Envoi du lien de réinitialisation à:', email);

      // Simuler un délai d'envoi
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsSubmitted(true);

    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
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
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                    <img src="/logo.png" className="h-10 w-10" alt="Logo" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center text-gray-900">
                  Mot de passe oublié
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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
      <div className="absolute inset-0 bg-black/80 backdrop-blur-lg -z-10"></div>
      <div className="absolute inset-0 -z-20">
        <img
          src="/nature.jpeg"
          alt="Login Illustration"
          className="opacity-70 w-full h-full object-cover"
        />
      </div>

      {/* Formes décoratives */}
      <div className="absolute top-0 left-[-5rem] w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 right-[-5rem] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

      {/* Contenu principal */}
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center gap-10 px-6 py-16 lg:py-24 z-10 max-w-7xl">
        {/* Texte à gauche (caché sur petits écrans) */}
        <div className="hidden lg:block text-white max-w-lg space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <img src="/logo.png" className="h-10 w-10" alt="Logo" />
            </div>
            <h1 className="text-3xl font-bold tracking-wide">SERVO</h1>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Super-app de l'habitat</h2>
            <p className="text-blue-100 text-lg">
              Retrouvez l'accès à votre compte en toute sécurité
            </p>
          </div>

          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Processus sécurisé</h3>
                <p className="text-blue-100 text-sm">
                  Lien de réinitialisation envoyé par email
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Rapide et simple</h3>
                <p className="text-blue-100 text-sm">Recevez le lien en quelques minutes</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white rounded-sm transform rotate-45"></div>
              </div>
              <div>
                <h3 className="font-semibold">Support 24/7</h3>
                <p className="text-blue-100 text-sm">Notre équipe est là pour vous aider</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire à droite dans une card */}
        <div className="flex justify-center w-full max-w-md">
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-md">
            <CardHeader className="pt-8 px-8 pb-4">

              {/* Retour */}
              <div className="flex items-center mb-1">
                <a
                  href="/login"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour à la connexion
                </a>
              </div>

              {/* Logo au-dessus du titre sur petits écrans */}
              <div className="flex justify-center mb-4 lg:hidden">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <img src="/logo.png" className="h-10 w-10" alt="Logo" />
                </div>
              </div>

              <CardTitle className="text-2xl font-bold text-center text-gray-900">
                {isSubmitted ? "Email envoyé !" : "Mot de passe oublié"}
              </CardTitle>

              <CardDescription className="text-center text-gray-600">
                {isSubmitted
                  ? "Consultez votre boîte mail pour réinitialiser votre mot de passe"
                  : "Entrez votre email pour recevoir un lien de réinitialisation"}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="votre@email.mg"
                        className="pl-10 h-11 bg-white border border-gray-300 focus:border-blue-500 rounded-md"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="font-medium text-blue-800 mb-1">Important :</p>
                    <p>
                      Le lien de réinitialisation sera envoyé à l'adresse email associée à votre compte
                      SERVO.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-md"
                    disabled={isLoading || !isClient}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Envoi en cours...
                      </div>
                    ) : (
                      "Envoyer le lien de réinitialisation"
                    )}
                  </Button>

                  <div className="text-center text-sm text-gray-600">
                    Vous vous souvenez de votre mot de passe ?{" "}
                    <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                      Se connecter
                    </a>
                  </div>
                </form>
              ) : (
                <div className="space-y-6 text-center px-4">
                  {/* Icône de succès */}
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                  </div>

                  {/* Message de confirmation */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Lien envoyé avec succès !</h3>
                    <p className="text-gray-600">
                      Nous avons envoyé un lien de réinitialisation à <strong>{email}</strong>.
                      Consultez votre boîte de réception et suivez les instructions.
                    </p>
                  </div>

                  {/* Conseils */}
                  <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200 text-left">
                    <p className="font-medium text-gray-800 mb-2">Conseils :</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Vérifiez votre dossier spam si vous ne trouvez pas l'email</li>
                      <li>Le lien est valable pendant 24 heures</li>
                      <li>Contactez le support si vous rencontrez des problèmes</li>
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                      className="w-full h-11"
                    >
                      Réessayer avec un autre email
                    </Button>

                    <a href="/login" className="block">
                      <Button
                        variant="ghost"
                        className="w-full h-11 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        Retour à la connexion
                      </Button>
                    </a>
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
