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

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role: "particular" | "professional") => {
    const url = role === "particular" ? "/register/particular" : "/register/professional/subscription";
    navigate(url);
  };

  const roleOptions = [
    {
      id: "particular",
      title: "Particulier",
      description: "Propriétaire, locataire ou chercheur de bien",
      icon: <User className="h-16 w-16" />,
      color: "blue",
      features: [
        "Recherche de biens immobiliers",
        "Réservation de services",
        "Gestion de vos locations",
        "Accès aux activités locales",
        "Alertes personnalisées",
        "Assistance dédiée"
      ],
      buttonText: "Choisir Particulier",
      popular: false
    },
    {
      id: "professional",
      title: "Professionnel",
      description: "Agent immobilier, prestataire de services ou loueur",
      icon: <Building className="h-16 w-16" />,
      color: "emerald",
      features: [
        "Gestion de vos biens et services",
        "Publication d'annonces illimitées",
        "Outils de gestion professionnels",
        "Accès à une clientèle qualifiée",
        "Tableaux de bord analytiques",
        "Support prioritaire"
      ],
      buttonText: "Choisir Professionnel",
      popular: true
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
        gradient: "from-red-500 to-red-600"
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen flex overflow-hidden relative">
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
        <div className="text-center my-4">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center shadow-lg">
              <img
                src="/logo.png"
                className="h-full w-full rounded-lg"
                alt="Logo SERVO"
              />
            </div>
          </div>
          <CardTitle className="text-xl lg:text-4xl font-bold text-gray-100 tracking-wide mb-4">
            Choisissez votre profil
          </CardTitle>
          <CardDescription className="text-sm lg:text-md font-extralight text-gray-400 max-w-2xl mx-auto">
            Sélectionnez le type de compte qui correspond le mieux à vos besoins.
            Vous pourrez toujours ajuster vos préférences plus tard.
          </CardDescription>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {roleOptions.map((role) => {
            const color = getColorClasses(role.color);
            return (
              <div
                key={role.id}
                className={`lg:m-0 m-4 relative border-2 ${color.border} rounded-2xl p-8 hover:${color.hoverBorder} transition-all duration-500 cursor-pointer group bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-sm h-full flex flex-col shadow-xl hover:shadow-2xl border-opacity-20 hover:border-opacity-40`}
                onClick={() => handleRoleSelection(role.id as "particular" | "professional")}
              >
                {/* Badge populaire amélioré */}
                {role.popular && (
                  <div className="absolute -top-5 right-2 transform z-10">
                    <div className={`bg-gradient-to-r ${color.gradient} overflow-hidden text-white px-2 py-1 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 backdrop-blur-sm border border-white/10`}>
                      <img src="/fire.gif" alt=""  className="w-6 h-6"/> 
                      Le plus populaire
                    </div>
                  </div>
                )}

                <div className="flex flex-col items-center text-center space-y-6 flex-1">
                  {/* Icon Container avec effets avancés */}
                  <div className={`${color.text} text-3xl filter drop-shadow-lg`}>
                    {role.icon}
                  </div>


                  {/* Titre et description */}
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-white group-hover:scale-105 transition-transform duration-300 tracking-wide bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {role.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed font-light">
                      {role.description}
                    </p>
                  </div>

                  {/* Features avec style moderne */}
                  <ul className="text-sm text-gray-300 space-y-3 text-left flex-1 w-full">
                    {role.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-all duration-300 group/item">
                        <CheckCircle className={`h-5 w-5 ${color.text} shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform duration-300`} />
                        <span className="leading-relaxed font-light">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Bouton avec effets avancés */}
                  <Button
                    className={`w-full ${color.button} bg-gradient-to-r ${color.gradient} text-white font-bold py-4 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 group-hover:scale-105 mt-auto transform hover:-translate-y-1 border border-white/10 hover:border-white/30`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoleSelection(role.id as "particular" | "professional");
                    }}
                  >
                    <span className="flex items-center justify-center gap-3 text-base">
                      {role.buttonText}
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Button>
                </div>

                {/* Effet de fond animé */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${color.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10`}></div>

                {/* Effet de bordure lumineuse */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${color.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-20 blur-sm`}></div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 lg:mb-2 mb-8 space-y-4">
          <div className="text-lg text-gray-600">
           Vous avez déjà un compte ?{" "}
            <a
              href="/login"
              className="text-blue-600 ml-2 hover:underline hover:text-blue-700 font-semibold transition-colors duration-200"
            >
              Se connecter
            </a>
          </div>

          <div className="lg:flex hidden items-center justify-between px-2 gap-6 text-sm text-gray-500">
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
    </div>
  );
};

export default RoleSelectionPage;