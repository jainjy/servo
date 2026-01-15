import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  Sparkles,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { subscriptionPlansAPI } from "@/lib/api/subscriptionPlans";
import ServoLogo from "@/components/components/ServoLogo";

const ProfessionalSubscriptionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [enhancedVisibility, setEnhancedVisibility] = useState<{
    [key: string]: boolean;
  }>({});
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  // Fonction pour trier les plans par prix décroissant
  const sortPlansByPrice = (plans: any[]) => {
    return plans.sort((a, b) => {
      const priceA = parseFloat(a.price);
      const priceB = parseFloat(b.price);
      return priceB - priceA;
    });
  };

  // Fonction pour récupérer les plans depuis l'API
  const fetchSubscriptionPlans = async () => {
    try {
      setLoading(true);
      const response = await subscriptionPlansAPI.getAllPlans();
      if (response.success) {
        const plansWithIcons = response.data.map((plan: any) => {
          let icon;
          switch (plan.id) {
            case "professional":
              icon = <Building className="h-16 w-16" />;
              break;
            case "artisan":
              icon = <Wrench className="h-16 w-16" />;
              break;
            case "tourism":
              icon = <Sofa className="h-16 w-16" />;
              break;
            case "sports":
              icon = <Users className="h-16 w-16" />;
              break;
            case "advertising":
              icon = <Sparkles className="h-16 w-16" />;
              break;
            default:
              icon = <Building className="h-16 w-16" />;
          }
          return {
            ...plan,
            icon,
          };
        });

        const sortedPlans = sortPlansByPrice(plansWithIcons);
        setSubscriptionPlans(sortedPlans);

        // Initialiser l'état de visibilité renforcée
        const initialVisibility: { [key: string]: boolean } = {};
        sortedPlans.forEach((plan: any) => {
          if (plan.enhancedVisibilityPrice) {
            initialVisibility[plan.id] = false;
          }
        });
        setEnhancedVisibility(initialVisibility);
      } else {
        toast.error("Erreur lors du chargement des plans d'abonnement");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Impossible de charger les plans d'abonnement");
      // Fallback vers les données statiques
      const fallbackPlans = getFallbackPlans();
      const sortedFallbackPlans = sortPlansByPrice(fallbackPlans);
      setSubscriptionPlans(sortedFallbackPlans);
    } finally {
      setLoading(false);
    }
  };

  // Données de fallback mises à jour avec les prix de visibilité renforcée
  const getFallbackPlans = () => [
    {
      id: "professional",
      title: "Immobilier & Commerces",
      description: "Pour agences immobilières, commerçants, banques",
      price: "99",
      enhancedVisibilityPrice: "149",
      period: "par mois",
      icon: <Building className="h-16 w-16" />,
      color: "olive",
      popular: true,
      features: [
        "Annonces professionnelles illimitées",
        "Profil entreprise vérifié",
        "Gestion des biens et clients",
        "Tableau de bord analytique",
        "Sans commission sur les prestations",
        "Support professionnel",
        "Certification OLIPLUS",
      ],
      userTypes: ["AGENCE", "PRESTATAIRE", "VENDEUR"],
      isVisibilityEnhanced: true,
    },
    {
      id: "artisan",
      title: "Artisans & Professions",
      description: "Pour artisans, constructeurs, courtiers, assureurs",
      price: "49",
      enhancedVisibilityPrice: "89",
      period: "par mois",
      icon: <Wrench className="h-16 w-16" />,
      color: "olive",
      popular: false,
      features: [
        "Profil professionnel complet",
        "Gestion des demandes de devis",
        "Portfolio de réalisations",
        "Disponibilité en temps réel",
        "Avis clients certifiés",
        "Zone d'intervention géolocalisée",
        "Outils de communication clients",
      ],
      userTypes: ["PRESTATAIRE", "ARTISAN", "EXPERT"],
      isVisibilityEnhanced: true,
    },
    {
      id: "tourism",
      title: "Tourisme & Loisirs",
      description: "Pour hébergements, activités touristiques, locations",
      price: "49",
      enhancedVisibilityPrice: "89",
      period: "par mois",
      icon: <Sofa className="h-16 w-16" />,
      color: "olive",
      popular: false,
      features: [
        "Fiche établissement détaillée",
        "Gestion des réservations en ligne",
        "Calendrier de disponibilités",
        "Photos et vidéos HD illimitées",
        "Avis voyageurs",
        "Promotions saisonnières",
        "Intégration avec plateformes externes",
      ],
      userTypes: ["TOURISME", "HEBERGEMENT", "ACTIVITE"],
      isVisibilityEnhanced: true,
    },
    {
      id: "sports",
      title: "Sport & Bien-être",
      description:
        "Pour professeurs de sport, coachs, professionnels du bien-être",
      price: "29",
      enhancedVisibilityPrice: "59",
      period: "par mois",
      icon: <Users className="h-16 w-16" />,
      color: "olive",
      popular: false,
      features: [
        "Profil coach certifié",
        "Gestion des séances et créneaux",
        "Réservations en ligne",
        "Carnet de suivi clients",
        "Programmes personnalisés",
        "Avis et recommandations",
        "Outils de planification",
      ],
      userTypes: ["BIEN_ETRE", "COACH", "SPORT"],
      isVisibilityEnhanced: true,
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
        border: "border-[#6B8E23]/20",
        hoverBorder: "border-[#6B8E23]/50",
        button: "bg-[#556B2F] hover:bg-[#6B8E23]",
        gradient: "from-[#556B2F] to-[#6B8E23]",
        checkbox: "border-[#556B2F] data-[state=checked]:bg-[#556B2F]",
      },
    };
    return colors[color as keyof typeof colors] || colors.olive;
  };

  const handleEnhancedVisibilityToggle = (planId: string, checked: boolean) => {
    setEnhancedVisibility((prev) => ({
      ...prev,
      [planId]: checked,
    }));
  };

  const calculateFinalPrice = (plan: any) => {
    const basePrice = parseFloat(plan.price);
    if (enhancedVisibility[plan.id] && plan.enhancedVisibilityPrice) {
      return parseFloat(plan.enhancedVisibilityPrice);
    }
    return basePrice;
  };

  const handleSubscriptionSelect = async (planId: string) => {
    if (redirecting) return;

    setSelectedPlan(planId);
    setRedirecting(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const selectedPlanData = subscriptionPlans.find(
      (plan) => plan.id === planId
    );

    if (selectedPlanData) {
      const finalPrice = calculateFinalPrice(selectedPlanData);
      const visibilityOption = enhancedVisibility[planId]
        ? "enhanced"
        : "standard";

      navigate("/register/professional/form", {
        state: {
          subscriptionData: {
            planId: planId,
            planTitle: selectedPlanData?.title,
            price: finalPrice.toString(),
            period: selectedPlanData?.period,
            userTypes: selectedPlanData?.userTypes,
            truePlanId: selectedPlanData?.truePlanId,
            visibilityOption: visibilityOption,
            enhancedVisibility: enhancedVisibility[planId],
            basePrice: selectedPlanData?.price,
            enhancedPrice: selectedPlanData?.enhancedVisibilityPrice,
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
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#556B2F]/15 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#6B8E23]/10 rounded-full blur-3xl"></div>

      <div className="absolute top-6 left-6 z-30">
        <Button
          variant="outline"
          className="px-6 py-3 border-[#6B8E23]/40 bg-black/40 backdrop-blur-md text-[#D3D3D3] hover:bg-[#556B2F]/20 hover:text-[#D3D3D3] hover:border-[#6B8E23]/60 transition-all duration-300 rounded-2xl shadow-2xl group"
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
          <CardTitle className="text-4xl font-bold text-[#D3D3D3] mb-4 tracking-wide">
            Choisissez votre abonnement professionnel
          </CardTitle>
          <CardDescription className="text-md font-extralight text-[#D3D3D3]/70 max-w-2xl mx-auto">
            Sélectionnez l'offre qui correspond le mieux à votre activité
            professionnelle. Tous nos abonnements incluent un essai gratuit de
            14 jours.{" "}
            <span className="text-[#6B8E23] font-semibold">
              Option "Meilleure Présence" disponible !
            </span>
          </CardDescription>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {subscriptionPlans
            .filter((plan) => plan.id && plan.planType !== "advertising")
            .map((plan) => {
              const color = getColorClasses(plan.color);
              const isSelected = selectedPlan === plan.id;
              const isRedirecting = isSelected && redirecting;
              const showEnhancedOption =
                plan.isVisibilityEnhanced && plan.enhancedVisibilityPrice;
              const finalPrice = calculateFinalPrice(plan);
              const priceDifference = showEnhancedOption
                ? parseFloat(plan.enhancedVisibilityPrice) -
                  parseFloat(plan.price)
                : 0;

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
                        className={`bg-gradient-to-r ${color.gradient} text-[#D3D3D3] px-2 py-1 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 backdrop-blur-sm border border-[#6B8E23]/40 animate-pulse-slow relative overflow-hidden`}
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
                      <h3 className="text-xl font-bold text-[#D3D3D3] group-hover:scale-105 transition-transform duration-300 bg-gradient-to-r from-[#D3D3D3] to-[#8B4513] bg-clip-text text-transparent">
                        {plan.title}
                      </h3>
                      <p className="text-[#D3D3D3]/70 text-sm leading-relaxed font-light">
                        {plan.description}
                      </p>
                    </div>

                    <div className="space-y-4 w-full">
                      <div className="space-y-2">
                        <div className="text-4xl flex items-center justify-center font-semibold text-[#D3D3D3]">
                          {finalPrice.toFixed(0)} €
                          <div className="text-[#D3D3D3]/50 text-sm font-medium ml-1">
                            /{plan.period}
                          </div>
                        </div>
                        {showEnhancedOption && (
                          <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-[#556B2F]/10 to-[#6B8E23]/10 border border-[#6B8E23]/30">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <Sparkles className={`h-4 w-4 ${color.text}`} />
                                <span className="text-sm font-medium text-[#D3D3D3]">
                                  Meilleure Présence
                                </span>
                              </div>
                              <Checkbox
                                checked={enhancedVisibility[plan.id] || false}
                                onCheckedChange={(checked) => {
                                  handleEnhancedVisibilityToggle(
                                    plan.id,
                                    checked === true
                                  );
                                }}
                                className={`${color.checkbox} border-2`}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>

                            <div className="text-xs text-[#D3D3D3]/70 space-y-1">
                              <div className="flex justify-between">
                                <span>Prix standard:</span>
                                <span className="line-through text-[#D3D3D3]/50">
                                  {plan.price} €
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Avec meilleure présence:</span>
                                <span className="font-bold text-[#D3D3D3]">
                                  {plan.enhancedVisibilityPrice} €
                                </span>
                              </div>
                              <div className="flex justify-between border-t border-[#6B8E23]/30 pt-1 mt-1">
                                <span>Supplément:</span>
                                <span className={`font-bold ${color.text}`}>
                                  +{priceDifference} €
                                </span>
                              </div>
                            </div>

                            <div className="mt-2 text-xs text-[#D3D3D3]/60 text-left">
                              • Mise en avant prioritaire
                              <br />
                              • Visibilité multipliée par 3
                              <br />• Apparition dans résultats premium
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <ul className="text-xs text-[#D3D3D3]/70 gap-5 text-left grid grid-cols-1 lg:grid-cols-2 w-full">
                      {plan.features.map((feature: string, index: number) => (
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
                          ? `${color.button} bg-gradient-to-r ${color.gradient} text-[#D3D3D3] shadow-2xl hover:shadow-3xl border-[#6B8E23]/40`
                          : "bg-gray-800 text-[#D3D3D3]/70 hover:bg-[#556B2F]/20 hover:text-[#D3D3D3] border-[#6B8E23]/30 hover:border-[#6B8E23]/50"
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
          <div className="text-xs text-[#D3D3D3]/40">
            © 2025 OLIPLUS . Tous droits réservés.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalSubscriptionPage;
