import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, Trees, Car, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import AuthService from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from 'react-router-dom';
import { useRedirectPath } from '@/hooks/useRedirectPath';

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
      console.log('Login successful:', user);

      // Redirection intelligente
      if (redirectPath) {
        navigate(redirectPath);
      } else {
        const defaultPath = AuthService.redirectBasedOnRole();
        navigate(defaultPath);
      }
      
    } catch (error) {
      console.error('Login failed:', error);
      alert(error.message || 'Identifiants invalides. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden relative">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-lg -z-10"></div>
      <div className="absolute inset-0 -z-20">
        {/* Remplace cette image par un élément img classique */}
        <img src="/nature.jpeg" alt="Login Illustration" className="w-full h-full object-cover" />
      </div>

      <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full"></div>

      <div className="w-[80vw] lg:w-[60vw] h-[80vh] m-auto rounded-3xl shadow-xl flex flex-col lg:flex-row overflow-hidden bg-white/0">
        <div className="hidden lg:flex lg:flex-1 bg-gradient-to-r from-black via-gray-800 to-gray-900 relative overflow-hidden p-10 text-white flex-col justify-center max-w-md">
          <div className="relative z-10 flex flex-col justify-center h-full">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                  <img src="/logo.png" className="h-10 w-10 rounded-full" alt="Logo" />
                </div>
                <h1 className="text-2xl font-bold">SERVO</h1>
              </div>
              <p className="text-xl font-semibold mb-2">Super-app de l'habitat</p>
              <p className="text-blue-100 text-lg">
                Immobilier, services, produits et tourisme en un seul endroit
              </p>
            </div>

            <div className="space-y-6 mt-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <Home className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Immobilier Intelligent</h3>
                  <p className="text-blue-100 text-sm">Recherche IA et matching avancé</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <Car className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Services Qualifiés</h3>
                  <p className="text-blue-100 text-sm">Prestataires vérifiés et notés</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <Trees className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Réservations</h3>
                  <p className="text-blue-100 text-sm">Visites et activités touristiques</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className=" flex items-center justify-center bg-white overflow-auto rounded-lg py-6 px-6 lg:px-2">
          <div className="w-full max-w-md">
            <Card className="border-0 shadow-none px-0 lg:px-5 py-4 lg:py-0 bg-white">
              <CardHeader className="space-y-0">
                <div className="flex justify-center mb-4 lg:hidden">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                    <img src="/logo.png" className="h-10 w-10" alt="Logo" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center text-gray-900">
                  Connexion SERVO
                </CardTitle>
                <CardDescription className="text-center text-gray-600">
                  Accédez à votre espace personnel
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-2">
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

                  <div className="space-y-4">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Votre mot de passe"
                        className="pl-10 pr-10 h-11 bg-white border border-gray-300 focus:border-blue-500 rounded-md"
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
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
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
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Mot de passe oublié ?
                    </a>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-md"
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
                    <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                      Créer un compte
                    </a>
                  </div>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Accès rapide</span>
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
