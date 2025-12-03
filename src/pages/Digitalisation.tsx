//pages/Digitalisation.jsx
import React from "react";
import {
  ShoppingCart,
  Globe,
  Smartphone,
  Cloud,
  Target,
  Zap,
  CheckCircle,
  ArrowRight,
  Palette,
  Lightbulb,
  LifeBuoy,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Digitalisation = () => {
  const services = [
    {
      title: "Site E-commerce",
      icon: <ShoppingCart />,
      desc: "Boutique en ligne complète avec paiement sécurisé",
    },
    {
      title: "Site Vitrine",
      icon: <Globe />,
      desc: "Site web professionnel pour présenter votre activité",
    },
    {
      title: "App Mobile",
      icon: <Smartphone />,
      desc: "Applications iOS et Android sur-mesure",
    },
    {
      title: "Solutions Cloud",
      icon: <Cloud />,
      desc: "Logiciels métier en ligne automatisés",
    },
    {
      title: "Marketing Digital",
      icon: <Target />,
      desc: "Stratégie digitale pour plus de visibilité",
    },
    {
      title: "Transformation Digitale",
      icon: <Zap />,
      desc: "Accompagnement complet pour digitaliser",
    },
    {
      title: "Design UI/UX",
      icon: <Palette />,
      desc: "Conception d'interfaces utilisateur et expérience utilisateur",
    },
    {
      title: "Consulting Digital",
      icon: <Lightbulb />,
      desc: "Conseil en stratégie digitale",
    },
    {
      title: "Maintenance & Support",
      icon: <LifeBuoy />,
      desc: "Maintenance et support technique",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-2 pt-2 pb-16 ">
        {/* Hero avec background image */}
        <div className="relative overflow-hidden rounded-2x">
          {/* Background image avec overlay */}
          <div className="absolute inset-0 z-0">
            {/* Option 1: Image avec overlay gradient */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  'url("/digital.jpg")',
              }}
            />
            {/* Overlay pour améliorer la lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-purple-900/30 to-indigo-900/40" />
          </div>

          {/* Contenu */}
          <div className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Solutions Digitales pour Entreprises
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10">
              Créez votre présence en ligne avec nos services de digitalisation
              sur-mesure
            </p>
          </div>

          {/* Éléments décoratifs */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -translate-x-12 -translate-y-12" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl translate-x-12 translate-y-12" />
        </div>
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              <div className="text-blue-600 mb-6">
                <div className="inline-block p-4 bg-blue-50 rounded-xl">
                  {React.cloneElement(service.icon, { className: "h-8 w-8" })}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-6">{service.desc}</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Design personnalisé</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Responsive design</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>SEO optimisé</span>
                </li>
              </ul>
              <Button className="w-full">
                Découvrir
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Digitalisation;
