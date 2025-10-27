import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import  AuthService  from "@/services/authService";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isError, setIsError] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tk = params.get('token');
    setToken(tk);
  }, []);

  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const result = await AuthService.verifyResetToken(token!);
      if (result.valid && result.email) {
        setIsVerified(true);
        setEmail(result.email);
      } else {
        setIsError(true);
      }
    } catch {
      setIsError(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      alert('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (!token) {
      alert('Token manquant');
      return;
    }

    setIsLoading(true);

    try {
      await AuthService.resetPassword(token, password);
      setIsSubmitted(true);

      // Redirection automatique après 3 secondes
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);

    } catch (error) {
      console.error('Reset failed:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de la réinitialisation');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return <InvalidTokenView title="Lien invalide" message="Le lien de réinitialisation est manquant ou incorrect." />;
  }

  if (isError) {
    return <InvalidTokenView title="Lien expiré ou invalide" message="Ce lien de réinitialisation a expiré ou est invalide. Veuillez demander un nouveau lien." />;
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gray-50/30">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-center mt-4 text-gray-600">Vérification du lien en cours...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return <SuccessView email={email} />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar identique à la page de login */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <img src="/logo.png" className="h-10 w-10" alt="Logo" />
              </div>
              <h1 className="text-2xl font-bold">SERVO</h1>
            </div>
            <p className="text-xl font-semibold mb-2">Nouveau mot de passe</p>
            <p className="text-blue-100 text-lg">Choisissez un mot de passe sécurisé pour votre compte</p>
          </div>
        </div>
      </div>

      {/* Formulaire de réinitialisation */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50/30">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1 pb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <img src="/logo.png" className="h-10 w-10" alt="Logo" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-gray-900">Nouveau mot de passe</CardTitle>
              <CardDescription className="text-center text-gray-600">Pour {email}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimum 6 caractères"
                        className="pl-10 pr-10 h-11 bg-white border-gray-300 focus:border-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-11 w-11 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Retapez votre mot de passe"
                        className="pl-10 h-11 bg-white border-gray-300 focus:border-blue-500"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Réinitialisation...
                    </div>
                  ) : (
                    "Réinitialiser le mot de passe"
                  )}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Retour à la connexion
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InvalidTokenView({ title, message }: { title: string; message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gray-50/30">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1 pb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-gray-900">{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-gray-600">{message}</p>
            <a href="/forgot-password" className="block">
              <Button className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold">Demander un nouveau lien</Button>
            </a>
            <div className="text-center">
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium text-sm">Retour à la connexion</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SuccessView({ email }: { email: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gray-50/30">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1 pb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-gray-900">Mot de passe réinitialisé !</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-gray-600">Votre mot de passe a été réinitialisé avec succès pour <strong>{email}</strong>. Vous allez être redirigé vers la page de connexion.</p>
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-center">
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium text-sm">Se connecter maintenant</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
