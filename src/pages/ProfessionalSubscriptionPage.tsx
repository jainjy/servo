import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import "@/assets/styles/all.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Building, Users, Wrench, Sofa } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { subscriptionPlansAPI } from "@/lib/api/subscriptionPlans";

const ProfessionalSubscriptionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour récupérer les plans depuis l'API
  const fetchSubscriptionPlans = async () => {
    try {
      setLoading(true);
      const response = await subscriptionPlansAPI.getAllPlans();

      if (response.success) {
        // Mapper les données de l'API avec les icônes appropriées
        const plansWithIcons = response.data.map((plan) => {
          let icon;
          switch (plan.id) {
            case "real_estate":
              icon = <Building className="h-16 w-16" />;
              break;
            case "services":
              icon = <Wrench className="h-16 w-16" />;
              break;
            case "furniture":
              icon = <Sofa className="h-16 w-16" />;
              break;
            case "wellness":
              icon = <Users className="h-16 w-16" />;
              break;
            default:
              icon = <Building className="h-16 w-16" />;
          }

          return {
            ...plan,
            icon,
          };
        });

        setSubscriptionPlans(plansWithIcons);
      } else {
        toast.error("Erreur lors du chargement des plans d'abonnement");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Impossible de charger les plans d'abonnement");
      // Fallback vers les données statiques en cas d'erreur
      setSubscriptionPlans(getFallbackPlans());
    } finally {
      setLoading(false);
    }
  };

  // Données de fallback en cas d'erreur API
  const getFallbackPlans = () => [
    {
      id: "real_estate",
      title: "Pro Immobilier Complet",
      description: "Pour les agences immobilières",
      price: "139",
      period: "par mois",
      icon: <Building className="h-16 w-16" />,
      color: "blue",
      popular: true,
      features: [
        "Annonces illimitées",
        "Tableaux de bord avancés",
        "Gestion des clients",
        "Statistiques détaillées",
        "Support prioritaire 24/7",
        "Certification vérifiée",
        "Mise en avant des annonces",
      ],
      userTypes: ["VENDEUR", "LOUEUR"],
    },
    {
      id: "services",
      title: "Prestataires de Services",
      description: "Pour les artisans et prestataires",
      price: "39",
      period: "par mois",
      icon: <Wrench className="h-16 w-16" />,
      color: "emerald",
      popular: false,
      features: [
        "Profil professionnel",
        "Demandes de devis",
        "Gestion des réservations",
        "Avis et notations",
        "Zone d'intervention",
        "Support dédié",
        "Outils de planning",
      ],
      userTypes: ["PRESTATAIRE"],
    },
    {
      id: "furniture",
      title: "Espace Ameublement",
      description: "Commerçants meubles et déco",
      price: "49",
      period: "par mois",
      icon: <Sofa className="h-16 w-16" />,
      color: "purple",
      popular: false,
      features: [
        "Boutique en ligne",
        "Catalogue produits",
        "Gestion des stocks",
        "Commandes en ligne",
        "Livraison géolocalisée",
        "Promotions et soldes",
        "Analytics des ventes",
      ],
      userTypes: ["VENDEUR"],
    },
    {
      id: "wellness",
      title: "Bien-être",
      description: "Professionnels du bien-être",
      price: "19",
      period: "par mois",
      icon: <Users className="h-16 w-16" />,
      color: "pink",
      popular: false,
      features: [
        "Profil bien-être",
        "Réservations en ligne",
        "Gestion des créneaux",
        "Carte de fidélité",
        "Avis clients",
        "Promotions ciblées",
        "Outils de communication",
      ],
      userTypes: ["PRESTATAIRE"],
    },
  ];

  useEffect(() => {
    fetchSubscriptionPlans();
  }, []);

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: "bg-blue-50",
        hoverBg: "bg-blue-100",
        text: "text-blue-600",
        border: "border-blue-200",
        hoverBorder: "border-blue-500",
        button: "bg-blue-600 hover:bg-blue-700",
        gradient: "from-blue-500 to-blue-600",
      },
      emerald: {
        bg: "bg-emerald-50",
        hoverBg: "bg-emerald-100",
        text: "text-emerald-600",
        border: "border-emerald-200",
        hoverBorder: "border-emerald-500",
        button: "bg-emerald-600 hover:bg-emerald-700",
        gradient: "from-emerald-500 to-emerald-600",
      },
      purple: {
        bg: "bg-purple-50",
        hoverBg: "bg-purple-100",
        text: "text-purple-600",
        border: "border-purple-200",
        hoverBorder: "border-purple-500",
        button: "bg-purple-600 hover:bg-purple-700",
        gradient: "from-purple-500 to-purple-600",
      },
      pink: {
        bg: "bg-pink-50",
        hoverBg: "bg-pink-100",
        text: "text-pink-600",
        border: "border-pink-200",
        hoverBorder: "border-pink-500",
        button: "bg-pink-600 hover:bg-pink-700",
        gradient: "from-pink-500 to-pink-600",
      },
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const handleSubscriptionSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleContinue = async () => {
    if (!selectedPlan) {
      toast.warning("Veuillez sélectionner un abonnement");
      return;
    }

    const selectedPlanData = subscriptionPlans.find(
      (plan) => plan.id === selectedPlan
    );

    // Redirection vers la page d'inscription avec les données de l'abonnement
    navigate("/register/professional/form", {
      state: {
        subscriptionData: {
          planId: selectedPlan,
          planTitle: selectedPlanData?.title,
          price: selectedPlanData?.price,
          period: selectedPlanData?.period,
          userTypes: selectedPlanData?.userTypes,
        },
      },
    });
  };

  const handleBack = () => {
    navigate("/register");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex-col gap-4 flex items-center justify-center bg-gray-900">
        <img src="/loading.gif" alt="" className='w-24 h-24'/>
        <div className="text-white text-xl">Chargement des plans...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex overflow-hidden relative">
      {/* Votre JSX existant reste identique */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-lg -z-10"></div>
      <div className="absolute inset-0 -z-20">
        <img
          src="/nature.jpeg"
          alt="Login Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full"></div>

      <div className="w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full overflow-hidden my-4 flex items-center justify-center shadow-lg">
              <img
                src="/logo.png"
                className="h-full w-full rounded-lg"
                alt="Logo SERVO"
              />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold text-gray-200 mb-4 tracking-wide">
            Choisissez votre abonnement professionnel
          </CardTitle>
          <CardDescription className="text-md font-extralight text-gray-400 max-w-2xl mx-auto">
            Sélectionnez l'offre qui correspond le mieux à votre activité
            professionnelle. Tous nos abonnements incluent un essai gratuit de
            14 jours.
          </CardDescription>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {subscriptionPlans.map((plan) => {
            const color = getColorClasses(plan.color);
            const isSelected = selectedPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative border-2 ${
                  isSelected ? color.hoverBorder : color.border
                } rounded-2xl p-6 hover:${
                  color.hoverBorder
                } transition-all duration-500 cursor-pointer bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-sm h-full flex flex-col shadow-lg hover:shadow-2xl border-opacity-30 hover:border-opacity-60 group`}
                onClick={() => handleSubscriptionSelect(plan.id)}
              >
                {/* Le reste de votre JSX pour afficher les plans */}
                {plan.popular && (
                  <div className="absolute -top-4 left-2 z-10">
                    <div
                      className={`bg-gradient-to-r ${color.gradient} text-white px-2 py-1 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 backdrop-blur-sm border border-white/20 animate-pulse-slow relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shine"></div>
                      <img src="/fire.gif" alt="" className="w-5 h-5 z-10" />
                      <span className="z-10">Le plus populaire</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col items-center text-center space-y-6 flex-1">
                  <div
                    className={`${color.text} text-2xl filter drop-shadow-lg`}
                  >
                    {plan.icon}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white group-hover:scale-105 transition-transform duration-300 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {plan.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed font-light">
                      {plan.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-4xl flex font-semibold text-white">
                      {plan.price} € /
                      <div className="text-gray-400 text-sm self-end font-medium">
                        {plan.period}
                      </div>
                    </div>
                  </div>

                  <ul className="text-xs text-gray-300 gap-5 text-left grid grid-cols-1 lg:grid-cols-2 w-full">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 p-0 rounded-xl"
                      >
                        <CheckCircle
                          className={`h-5 w-5 ${color.text} shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform duration-300 filter drop-shadow-lg`}
                        />
                        <span className="leading-relaxed font-light flex-1">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full font-bold py-3 rounded-xl transition-all duration-500 transform hover:-translate-y-1 border ${
                      isSelected
                        ? `${color.button} bg-gradient-to-r ${color.gradient} text-white shadow-2xl hover:shadow-3xl border-white/20`
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border-gray-600 hover:border-gray-500"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubscriptionSelect(plan.id);
                    }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {isSelected ? (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Sélectionné
                        </>
                      ) : (
                        <>
                          Sélectionner
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
                        </>
                      )}
                    </span>
                  </Button>
                </div>

                {isSelected && (
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${color.gradient} opacity-10 -z-10`}
                  ></div>
                )}

                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${color.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500 -z-20`}
                ></div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center gap-4 mt-12">
          <Button
            variant="outline"
            className="px-8 py-3 border-gray-300"
            onClick={handleBack}
          >
            Retour
          </Button>
          <Button
            className="px-8 py-3 bg-blue-700 text-white font-semibold"
            onClick={handleContinue}
            disabled={!selectedPlan}
          >
            Continuer
          </Button>
        </div>

        <div className="text-end mt-8 mr-4 space-y-4">
          <div className="text-xs text-gray-500">
            © 2025 SERVO . Tous droits réservés.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalSubscriptionPage;
