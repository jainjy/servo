import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Trees,
  Car,
  Home,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import AuthService from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useRedirectPath } from "@/hooks/useRedirectPath";
import { toast } from "sonner";
import ServoLogo from "@/components/components/ServoLogo";
import AdvertisementPopup from "@/components/AdvertisementPopup";
const LoginPage = () => {
  const navigate = useNavigate();
  const redirectPath = useRedirectPath();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { user } = await login(email, password);
      console.log("Login successful:", user);
      // Redirection intelligente
      if (redirectPath) {
        navigate(redirectPath);
      } else {
        const defaultPath = AuthService.getRoleBasedRedirect();
        navigate(defaultPath);
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la connexion."
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex overflow-hidden relative">
      <div className="absolute inset-0 -z-10">
        <video
          className="absolute inset-0 w-full h-full object-cover -z-20"
          src="/wave.mp4" // ou une URL externe
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Overlay (ton div existant) */}
        <div className="absolute inset-0 backdrop-blur-md z-0" />
      </div>
      <div className="absolute inset-0 -z-20">
        {/* Remplace cette image par un élément img classique */}
        <img
          src="/nature.jpeg"
          alt="Login Illustration"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 -z-10 bg-white/5 rounded-full"></div>

      {/* Advertisement Popup - Absolute Position */}
      <div className="absolute top-4 left-4 right-4 z-50">
        <AdvertisementPopup />
      </div>

      <div className="w-[80vw] lg:w-[60vw] h-[80vh] m-auto rounded-3xl shadow-xl flex flex-col lg:flex-row overflow-hidden bg-white/0">
        <div className="hidden lg:flex lg:flex-1 bg-gradient-to-r from-black via-gray-800 to-gray-900 relative overflow-hidden p-10 text-white flex-col justify-center max-w-md">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 bg-gray-700 w-28 py-3 px-4 rounded-full text-gray-100 hover:text-gray-100 mb-4 mx-2 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </button>
          <div className="relative z-10 flex flex-col justify-center h-full">
            <div className="mb-8">
              <Link to="/">
                <div className="flex items-center gap-3 mb-6">
                  <ServoLogo />
                </div>
              </Link>
              <p className="text-[#8B4513] text-sm text-justify">
                Des biens immobiliers, ses services additionnels, produits
                adaptés à vos besoins et vos locations au sein d’une seule
                plateforme
              </p>
            </div>
            <div className="space-y-6 mt-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <Home className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Immobilier Intelligent</h3>
                  <p className="text-[#8B4513] text-sm">
                    Recherche IA et matching avancé
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <Car className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Services Qualifiés</h3>
                  <p className="text-[#8B4513] text-sm">
                    Prestataires vérifiés et notés
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <Trees className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Réservations</h3>
                  <p className="text-[#8B4513] text-sm">
                    Visites et activités touristiques
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" flex items-center justify-center bg-[#FFFFFF] overflow-auto rounded-lg py-2 lg:py-6 px-0 lg:px-2">
          <div className="w-full max-w-md">
            <Card className="border-0 shadow-none px-0 lg:px-5 py-4 lg:py-0 bg-[#FFFFFF]">
              <CardHeader className="space-y-0">
                <div className="flex justify-center mb-4 lg:hidden">
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                    <img src="/logo.png" className="h-10 w-10" alt="Logo" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center text-gray-900">
                  Connexion OLIPLUS
                </CardTitle>
                <CardDescription className="text-center text-gray-600">
                  Accédez à votre espace personnel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-2">
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
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700 block"
                    >
                      Mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Votre mot de passe"
                        className="pl-10 pr-10 h-11 bg-[#FFFFFF] border-[#D3D3D3] focus:border-[#556B2F] rounded-md"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-11 w-11 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) =>
                          setRememberMe(checked as boolean)
                        }
                      />
                      <label
                        htmlFor="remember"
                        className="text-xs text-gray-600 cursor-pointer"
                      >
                        Se souvenir de moi
                      </label>
                    </div>
                    {/* Remplace Link par un a classique */}
                    <a
                      href="/forgot-password"
                      className="text-xs text-[#556B2F] hover:text-[#556B2F]/90 font-medium"
                    >
                      Mot de passe oublié ?
                    </a>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-[#556B2F] to-[#6B8E23] hover:from-[#556B2F]/90 hover:to-[#6B8E23]/90 text-white font-semibold rounded-md"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Connexion...
                      </div>
                    ) : (
                      "Se connecter"
                    )}
                  </Button>
                  <div className="text-center text-sm text-gray-600">
                    Pas encore de compte ?{" "}
                    <a
                      href="/register"
                      className="text-[#556B2F] w-full cursor-pointer hover:text-[#556B2F]/90 font-medium"
                    >
                      Créer un compte
                    </a>
                  </div>
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#D3D3D3]"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-[#FFFFFF] text-gray-500">
                        Accès rapide
                      </span>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
