import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Building, Home, Car, Trees, CheckCircle, Star, Users, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginRoleSelectionPage = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role: "particular" | "professional") => {
    navigate("/login/" + role);
  };

  const roleOptions = [
    {
      id: "particular",
      title: "Particulier",
      description: "Propriétaire, locataire ou chercheur de bien",
      icon: <User className="h-16 w-16" />,
      color: "blue",
      buttonText: "Se connecter en Particulier"
    },
    {
      id: "professional",
      title: "Professionnel",
      description: "Agent immobilier, prestataire de services ou loueur",
      icon: <Building className="h-16 w-16" />,
      color: "emerald",
      buttonText: "Se connecter en Professionnel"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: "bg-blue-50",
        hoverBg: "bg-blue-100",
        text: "text-blue-600",
        border: "border-blue-200",
        hoverBorder: "border-blue-500",
        button: "bg-blue-600 hover:bg-blue-700",
        gradient: "from-blue-500 to-blue-600"
      },
      emerald: {
        bg: "bg-emerald-50",
        hoverBg: "bg-emerald-100",
        text: "text-emerald-600",
        border: "border-emerald-200",
        hoverBorder: "border-emerald-500",
        button: "bg-emerald-600 hover:bg-emerald-700",
        gradient: "from-emerald-500 to-emerald-600"
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };


  return (
    <div className="relative min-h-screen flex overflow-hidden ">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-lg -z-10"></div>
      <div className="absolute inset-0 -z-20">
        {/* Remplace cette image par un élément img classique */}
        <img
          src="/nature.jpeg"
          alt="Login Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full"></div>
      <div className="w-full">
        <div className="text-center">
          <div className="flex justify-center my-2">
            <div className="w-16 h-16  rounded-full overflow-hidden flex items-center justify-center shadow-lg">
              <img
                src="/logo.png"
                className="h-full w-ful rounded-lg"
                alt="Logo SERVO"
              />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold text-white tracking-wide mb-2">
            Connectez-vous à votre compte
          </CardTitle>
          <CardDescription className="mb-5 text-md text-gray-400 font-extralight max-w-2xl mx-auto">
            Sélectionnez le type de compte avec lequel vous souhaitez vous connecter.
            Votre expérience sera adaptée à votre profil.
          </CardDescription>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {roleOptions.map((role) => {
            const color = getColorClasses(role.color);
            return (
              <div
                key={role.id}
                className={`relative border-2 ${color.border} rounded-xl p-8 hover:${color.hoverBorder} transition-all duration-500 cursor-pointer group bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-sm h-full flex flex-col shadow-xl border-opacity-20 hover:border-opacity-40`}
                onClick={() => handleRoleSelection(role.id as "particular" | "professional")}
              >

                <div className="flex flex-col items-center text-center space-y-2 flex-1">
                  {/* Icon Container avec effet lumineux */}
                    <div className={`${color.text} filter drop-shadow-lg`}>
                      {role.icon}
                    </div>

                  {/* Titre et description */}
                  <div className="space-y-4 mt-4">
                    <h3 className="text-xl font-bold text-white transition-transform duration-300 tracking-wide">
                      {role.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-sm font-light">
                      {role.description}
                    </p>
                  </div>

                  {/* Bouton avec effet moderne */}
                  <Button
                    className={`w-full ${color.button} bg-gradient-to-r ${color.gradient} text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mt-auto transform hover:-translate-y-1 border border-white/10 hover:border-white/20`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoleSelection(role.id as "particular" | "professional");
                    }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {role.buttonText}
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Button>
                </div>

                {/* Effet de bordure animée */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${color.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 -z-10`}></div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 space-y-4">
          <div className="text-md text-gray-600">
            Pas encore de compte ?{" "}
            <a
              href="/register"
              className="text-blue-600 ml-4 hover:text-blue-700 font-semibold transition-colors duration-200"
            >
              Créer un compte
            </a>
          </div>

          
        </div>
        <div className="flex items-center mt-16  justify-between px-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>100% sécurisé</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Communauté vérifiée</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div>© 2025 SERVO . Tous droits réservés.</div>
          </div>
      </div>
    </div>
  );
};

export default LoginRoleSelectionPage;