import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  Building,
  Home,
  Car,
  Trees,
  CheckCircle,
  Star,
  Users,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ServoLogo from "../components/components/ServoLogo";
import AdvertisementPopup from "@/components/AdvertisementPopup";

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
      color: "olive",
      buttonText: "Se connecter en Particulier",
    },
    {
      id: "professional",
      title: "Professionnel",
      description: "Agent immobilier, prestataire de services ou loueur",
      icon: <Building className="h-16 w-16" />,
      color: "yellowgreen",
      buttonText: "Se connecter en Professionnel",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      olive: {
        bg: "bg-[#556B2F]/10",
        hoverBg: "bg-[#556B2F]/20",
        text: "text-[#556B2F]",
        border: "border-[#556B2F]/20",
        hoverBorder: "border-[#556B2F]/50",
        button: "bg-[#556B2F] hover:bg-[#556B2F]/90",
        gradient: "from-[#556B2F] to-[#556B2F]/90",
      },
      yellowgreen: {
        bg: "bg-[#6B8E23]/10",
        hoverBg: "bg-[#6B8E23]/20",
        text: "text-[#6B8E23]",
        border: "border-[#6B8E23]/20",
        hoverBorder: "border-[#6B8E23]/50",
        button: "bg-[#6B8E23] hover:bg-[#6B8E23]/90",
        gradient: "from-[#6B8E23] to-[#6B8E23]/90",
      },
    };
    return colors[color as keyof typeof colors] || colors.olive;
  };

  return (
    <div className="relative min-h-screen flex overflow-hidden pt-10">
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
      {/* Advertisement Popup - Absolute Position */}
      <div className="absolute top-4 left-4 right-4 z-50">
        <AdvertisementPopup />
      </div>
      <div className="absolute inset-0 -z-20">
        {/* Remplace cette image par un élément img classique */}
        <img
          src="/nature.jpeg"
          alt="Login Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bouton Retour stylé en haut à gauche */}
      <div className="absolute top-6 left-6 z-30">
        <Button
          variant="outline"
          className="px-6 py-3 border-white/30 bg-black/40 backdrop-blur-md text-white hover:bg-white/20 hover:text-white hover:border-white/50 transition-all duration-300 rounded-2xl shadow-2xl group"
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-semibold">Retour</span>
        </Button>
      </div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full"></div>
      <div className="w-full">


        <div className="text-center">
          <Link to="/">
            <ServoLogo />
          </Link>
          <CardTitle className="text-xl lg:text-4xl font-bold text-white tracking-wide mb-2">
            Connectez-vous à votre compte
          </CardTitle>
          <CardDescription className="mb-5 text-sm lg:text-md text-gray-400 font-extralight max-w-2xl mx-auto">
            Sélectionnez le type de compte avec lequel vous souhaitez vous
            connecter. Votre expérience sera adaptée à votre profil.
          </CardDescription>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {roleOptions.map((role) => {
            const color = getColorClasses(role.color);
            return (
              <div
                key={role.id}
                className={`lg:m-0 m-4 relative border-2 ${color.border} rounded-xl p-8 hover:${color.hoverBorder} transition-all duration-500 cursor-pointer group bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-sm h-full flex flex-col shadow-xl border-opacity-20 hover:border-opacity-40`}
                onClick={() =>
                  handleRoleSelection(role.id as "particular" | "professional")
                }
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
                      handleRoleSelection(
                        role.id as "particular" | "professional"
                      );
                    }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {role.buttonText}
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </Button>
                </div>

                {/* Effet de bordure animée */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${color.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 -z-10`}
                ></div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className=" text-center mt-12 lg:mb-0 mb-4 space-y-4">
          <div className="text-md text-[#8B4513]">
            Pas encore de compte ?{" "}
            <a
              href="/register"
              className="text-[#556B2F] ml-4 hover:text-[#556B2F]/90 font-semibold transition-colors duration-200"
            >
              Créer un compte
            </a>
          </div>
        </div>
        <div className="lg:flex hidden items-center mt-16  justify-between px-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>100% sécurisé</span>
          </div>
          <div className="w-1 h-1 bg-[#D3D3D3] rounded-full"></div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Communauté vérifiée</span>
          </div>
          <div className="w-1 h-1 bg-[#D3D3D3] rounded-full"></div>
          <div>© 2025 OLIPLUS . Tous droits réservés.</div>
        </div>
      </div>
    </div>
  );
};

export default LoginRoleSelectionPage;
