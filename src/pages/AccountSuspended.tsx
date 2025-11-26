// src/pages/AccountSuspended.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Mail, Phone, Clock, Shield, Lock } from "lucide-react";

const AccountSuspended = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    // Rediriger si l'utilisateur n'est pas suspendu/inactif
    if (user?.status !== "inactive") {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleContactSupport = () => {
    window.open("mailto:support@votredomaine.com", "_blank");
  };

  const handleCallSupport = () => {
    window.open("tel:+33123456789", "_blank");
  };

  return (
    <div className="min-h-screen  bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-100 dark:bg-red-900/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-100 dark:bg-purple-900/10 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="w-full max-w-full mx-auto grid grid-cols-1 gap-6 lg:gap-12 items-center h-full lg:h-auto px-4 sm:px-6 lg:px-12">
        {/* GIF Section */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl blur-lg opacity-20 animate-pulse"></div>
            <img
              src="/suspend.gif"
              alt="Compte suspendu"
              className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-2xl object-cover border-4 sm:border-8 border-white/50 dark:border-slate-700/50 shadow-2xl transform hover:scale-105 transition-transform duration-300"
            />
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-6 h-6 sm:w-8 sm:h-8 bg-red-500 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-4 -left-4 w-4 h-4 sm:w-6 sm:h-6 bg-blue-500 rounded-full animate-bounce delay-300"></div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col justify-center">
          <Card className="w-full shadow-2xl border-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl relative overflow-hidden">
            {/* Card decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-pink-500"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-100 dark:bg-red-900/20 rounded-full blur-2xl"></div>

            <CardContent className="p-4 sm:p-6 lg:p-10 relative">
              {/* Header with icon */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-lg mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-2 sm:mb-4">
                  Compte Suspendu
                </h1>
                <div className="flex items-center justify-center gap-2 text-red-500 dark:text-red-400 mb-2 text-sm sm:text-base">
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="font-semibold">
                    Accès temporairement restreint
                  </span>
                </div>
              </div>

              {/* Message */}
              <div className="text-center mb-6 sm:mb-8">
                <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-3 sm:mb-4">
                  Votre compte a été temporairement suspendu pour des raisons de
                  sécurité ou de conformité.
                </p>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  Veuillez contacter notre équipe de support pour plus
                  d'informations et pour régulariser votre situation.
                </p>
              </div>
              {/* Actions */}
              <div className="space-y-2 sm:space-y-4">
                <Button
                  onClick={handleContactSupport}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 sm:py-6 text-sm sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  size="lg"
                >
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                  Contacter par email
                </Button>

                <Button
                  onClick={handleCallSupport}
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white py-4 sm:py-6 text-sm sm:text-lg font-semibold transition-all duration-200 hover:scale-105"
                  size="lg"
                >
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                  Appeler le support
                </Button>

                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 py-4 sm:py-6 text-sm sm:text-lg transition-all duration-200"
                  size="lg"
                >
                  Se déconnecter
                </Button>
              </div>

              {/* Additional Info */}
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>Support disponible du lundi au vendredi, 9h - 18h</span>
                </div>
                <p className="text-center text-slate-400 dark:text-slate-500 text-xs mt-2">
                  Temps de réponse moyen : 2 heures ouvrables
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating help text */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center pointer-events-none">
        <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-xs sm:text-sm animate-pulse">
          <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>Votre sécurité est notre priorité</span>
        </div>
      </div>
    </div>
  );
};

export default AccountSuspended;
