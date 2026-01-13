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
import {
  CheckCircle,
  Building,
  Users,
  Wrench,
  Sofa,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { subscriptionPlansAPI } from "@/lib/api/subscriptionPlans";
import ServoLogo from "@/components/components/ServoLogo";
const ProfessionalSubscriptionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  // Fonction pour trier les plans par prix décroissant
  const sortPlansByPrice = (plans) => {
    return plans.sort((a, b) => {
      const priceA = parseFloat(a.price);
      const priceB = parseFloat(b.price);
      return priceB - priceA; // Décroissant
    });
  };
  // Fonction pour récupérer les plans depuis l'API
  const fetchSubscriptionPlans = async () => {
    try {
      setLoading(true);
      const response = await subscriptionPlansAPI.getAllPlans();
      if (response.success) {
        // console.log("Plans récupérés:", response.data);
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
        // Trier les plans par prix décroissant
        const sortedPlans = sortPlansByPrice(plansWithIcons);
        setSubscriptionPlans(sortedPlans);
      } else {
        toast.error("Erreur lors du chargement des plans d'abonnement");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Impossible de charger les plans d'abonnement");
      // Fallback vers les données statiques en cas d'erreur
      const fallbackPlans = getFallbackPlans();
      const sortedFallbackPlans = sortPlansByPrice(fallbackPlans);
      setSubscriptionPlans(sortedFallbackPlans);
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
      color: "olive",
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
      userTypes: ["AGENCE"],
    },
    {
      id: "services",
      title: "Prestataires de Services",
      description: "Pour les artisans et prestataires",
      price: "39",
      period: "par mois",
      icon: <Wrench className="h-16 w-16" />,
      color: "yellowgreen",
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
      color: "brown",
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
      color: "lightgray",
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
      userTypes: ["BIEN_ETRE"],
    },
  ];
  useEffect(() => {
    fetchSubscriptionPlans();
  }, []);
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
      brown: {
        bg: "bg-[#8B4513]/10",
        hoverBg: "bg-[#8B4513]/20",
        text: "text-[#8B4513]",
        border: "border-[#8B4513]/20",
        hoverBorder: "border-[#8B4513]/50",
        button: "bg-[#8B4513] hover:bg-[#8B4513]/90",
        gradient: "from-[#8B4513] to-[#8B4513]/90",
      },
      lightgray: {
        bg: "bg-[#D3D3D3]/10",
        hoverBg: "bg-[#D3D3D3]/20",
        text: "text-[#D3D3D3]",
        border: "border-[#D3D3D3]/20",
        hoverBorder: "border-[#D3D3D3]/50",
        button: "bg-[#D3D3D3] hover:bg-[#D3D3D3]/90",
        gradient: "from-[#D3D3D3] to-[#D3D3D3]/90",
      },
    };
    return colors[color as keyof typeof colors] || colors.olive;
  };
  const handleSubscriptionSelect = async (planId: string) => {
    if (redirecting) return;

    setSelectedPlan(planId);
    setRedirecting(true);

    // Petit délai pour montrer le feedback visuel
    await new Promise((resolve) => setTimeout(resolve, 500));

    const selectedPlanData = subscriptionPlans.find(
      (plan) => plan.id === planId
    );
    if (selectedPlanData) {
      navigate("/register/professional/form", {
        state: {
          subscriptionData: {
            planId: planId,
            planTitle: selectedPlanData?.title,
            price: selectedPlanData?.price,
            period: selectedPlanData?.period,
            userTypes: selectedPlanData?.userTypes,
            truePlanId: selectedPlanData?.truePlanId,
          },
        },
      });
    } else {
      setRedirecting(false);
      toast.error("Erreur lors de la sélection du plan");
    }
  };
  const handleBack = () => {
    navigate(-1);
  };
  if (loading) {
    return (
      <div className="min-h-screen flex-col gap-4 flex items-center justify-center bg-gray-900">
        <img src="/loading.gif" alt="" className="w-24 h-24" />
        <div className="text-white text-xl">Chargement des plans...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex overflow-hidden relative">
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
      {/* Bouton Retour stylé en haut à gauche */}
      <div className="absolute top-6 left-6 z-30">
        <Button
          variant="outline"
          className="px-6 py-3 border-white/30 bg-black/40 backdrop-blur-md text-white hover:bg-white/20 hover:text-white hover:border-white/50 transition-all duration-300 rounded-2xl shadow-2xl group"
          onClick={handleBack}
          disabled={redirecting}
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-semibold">Retour</span>
        </Button>
      </div>
      <div className="w-full p-6 pt-24">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <ServoLogo />
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
          {subscriptionPlans.filter(plan => plan.id).map((plan) => {
            const color = getColorClasses(plan.color);
            const isSelected = selectedPlan === plan.id;
            const isRedirecting = isSelected && redirecting;
            return (
              <div
                key={plan.id}
                className={`relative border-2 ${
                  isSelected ? color.hoverBorder : color.border
                } rounded-2xl p-6 hover:${
                  color.hoverBorder
                } transition-all duration-500 cursor-pointer bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-sm h-full flex flex-col shadow-lg hover:shadow-2xl border-opacity-30 hover:border-opacity-60 group ${
                  redirecting && !isSelected
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
                onClick={() => handleSubscriptionSelect(plan.id)}
              >
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
                    } ${isRedirecting ? "animate-pulse" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubscriptionSelect(plan.id);
                    }}
                    disabled={redirecting}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {isRedirecting ? (
                        <>
                          <svg
                            className="w-4 h-4 animate-spin"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 2v4m0 12v4m8-10h-4M6 12H2"
                            />
                          </svg>
                          Redirection...
                        </>
                      ) : isSelected ? (
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
        <div className="text-center mt-12 space-y-4">
          <div className="text-xs text-gray-500">
            © 2025 OLIPLUS . Tous droits réservés.
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfessionalSubscriptionPage;
