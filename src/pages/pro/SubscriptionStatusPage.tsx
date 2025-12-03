import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  CreditCard,
  Crown,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Star,
  Building,
  Wrench,
  Sofa,
  Users,
  AlertTriangle,
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { subscriptionPlansAPI } from "@/lib/api/subscriptionPlans";
import SubscriptionExpiredModal from "@/components/SubscriptionExpiredModal";

const SubscriptionStatusPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [plansLoading, setPlansLoading] = useState(true);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchSubscription(), fetchSubscriptionPlans()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Vérifier si l'abonnement est expiré au chargement
    if (subscription?.status == 'expired') {
      setShowExpiredModal(true);
    }
  }, [subscription]);

  const fetchSubscription = async () => {
    try {
      const response = await api.get("/auth/subscription/status");
      setSubscription(response.data);
      console.log("data:",response.data,"plan:", response.data.plan,"planId:", response.data.planId);

      // Calcul des jours restants
      if (response.data?.endDate) {
        const endDate = new Date(response.data.endDate);
        const today = new Date();
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysRemaining(diffDays > 0 ? diffDays : 0);
      }
    } catch (error) {
      toast.error("Erreur lors du chargement de l'abonnement");
    }
  };

  const fetchSubscriptionPlans = async () => {
    try {
      setPlansLoading(true);
      const response = await subscriptionPlansAPI.getAllPlans();

      if (response.success) {
        const plansWithIcons = response.data.map((plan) => {
          let icon;
          switch (plan.id) {
            case "real_estate":
              icon = <Building className="h-6 w-6" />;
              break;
            case "services":
              icon = <Wrench className="h-6 w-6" />;
              break;
            case "furniture":
              icon = <Sofa className="h-6 w-6" />;
              break;
            case "wellness":
              icon = <Users className="h-6 w-6" />;
              break;
            default:
              icon = <Star className="h-6 w-6" />;
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
    } finally {
      setPlansLoading(false);
    }
  };

  const handleUpgrade = (planId = null) => {
    if (planId) {
      const selectedPlan = subscriptionPlans.find((plan) => plan.id == planId);
      navigate("/pro/subscription/payment", {
        state: {
          subscriptionData: {
            planId: selectedPlan?.id,
            planTitle: selectedPlan?.title,
            price: selectedPlan?.price,
            period: selectedPlan?.period,
            userTypes: selectedPlan?.userTypes,
          },
        },
      });
    } else {
      navigate("/pro/subscription/payment");
    }
  };

  const handleRenew = async () => {
    try {
      // Option 1: Renouveler le même plan
      if (subscription?.plan?.id) {
        const currentPlan = subscriptionPlans.find(
          (plan) => plan.id == subscription.plan.id
        );
        
        if (currentPlan) {
          navigate("/pro/subscription/payment", {
            state: {
              subscriptionData: {
                planId: currentPlan.id,
                planTitle: currentPlan.title,
                price: currentPlan.price,
                period: currentPlan.period,
                userTypes: currentPlan.userTypes,
                isRenewal: true,
              },
            },
          });
          return;
        }
      }

      // Option 2: Rediriger vers la page de choix de plan
      navigate("/pro/subscription/payment");
      
    } catch (error) {
      console.error("Erreur lors du renouvellement:", error);
      toast.error("Erreur lors du renouvellement de l'abonnement");
    }
  };

  const handleRenewFromModal = () => {
    setShowExpiredModal(false);
    handleRenew();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { variant: "default", label: "Actif", icon: CheckCircle },
      inactive: { variant: "secondary", label: "Inactif", icon: XCircle },
      expired: { variant: "destructive", label: "Expiré", icon: AlertTriangle },
      pending: { variant: "outline", label: "En attente", icon: Clock },
    };

    const config = statusConfig[status] || statusConfig.inactive;
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPlanIcon = (planName) => {
    if (planName?.toLowerCase().includes("pro")) return Crown;
    if (planName?.toLowerCase().includes("premium")) return Zap;
    return Star;
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-200",
        button: "bg-blue-600 hover:bg-blue-700",
        gradient: "from-blue-500 to-blue-600",
      },
      emerald: {
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        border: "border-emerald-200",
        button: "bg-emerald-600 hover:bg-emerald-700",
        gradient: "from-emerald-500 to-emerald-600",
      },
      purple: {
        bg: "bg-purple-50",
        text: "text-purple-600",
        border: "border-purple-200",
        button: "bg-purple-600 hover:bg-purple-700",
        gradient: "from-purple-500 to-purple-600",
      },
      pink: {
        bg: "bg-pink-50",
        text: "text-pink-600",
        border: "border-pink-200",
        button: "bg-pink-600 hover:bg-pink-700",
        gradient: "from-pink-500 to-pink-600",
      },
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg font-medium text-gray-600">
            Chargement de votre abonnement...
          </p>
        </div>
      </div>
    );
  }

  const PlanIcon = getPlanIcon(subscription?.plan?.name);
  const currentPlan = subscriptionPlans.find(
    (plan) => plan.id == subscription?.plan?.id
  );
  const isExpired = subscription?.status == 'expired';

  return (
    <div className="min-h-screen py-0 ">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-lg lg:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Votre Abonnement
          </h1>
          <p className="text-md lg:text-lg text-gray-600 max-w-2xl mx-auto">
            Gérez et suivez l'état de votre abonnement en temps réel
          </p>
        </div>

        {/* Bannière d'alerte pour abonnement expiré */}
        {isExpired && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-800">
                  Abonnement Expiré
                </h3>
                <p className="text-red-700 text-sm">
                  Votre abonnement a expiré. Renouvelez-le pour continuer à profiter de tous les avantages.
                </p>
              </div>
              <Button 
                onClick={handleRenew}
                className="bg-red-600 hover:bg-red-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Renouveler
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Carte principale d'abonnement */}
          <div className="lg:col-span-2">
            <Card className={`bg-white/80 backdrop-blur-sm border-0 shadow-xl ${
              isExpired ? 'border-red-200 ring-1 ring-red-100' : ''
            }`}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-md lg:text-2xl">
                    <PlanIcon className="h-6 w-6 text-primary" />
                    {subscription?.plan?.name || "Essai Gratuit"}
                  </CardTitle>
                  {getStatusBadge(subscription?.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Barre de progression pour l'essai gratuit */}
                {(!subscription?.plan?.price ||
                  subscription.plan.price == 0) && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Jours restants</span>
                      <span className="text-primary font-bold">
                        {daysRemaining} jours
                      </span>
                    </div>
                    <Progress
                      value={((30 - daysRemaining) / 30) * 100}
                      className="h-2"
                    />
                    <p className="text-xs text-gray-500">
                      Votre période d'essai se termine dans {daysRemaining}{" "}
                      jours
                    </p>
                  </div>
                )}

                {/* Détails de l'abonnement */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Début</p>
                      <p className="text-sm text-gray-600">
                        {subscription
                          ? new Date(subscription.startDate).toLocaleDateString(
                              "fr-FR"
                            )
                          : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Fin</p>
                      <p className="text-sm text-gray-600">
                        {subscription
                          ? new Date(subscription.endDate).toLocaleDateString(
                              "fr-FR"
                            )
                          : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Auto-renouvellement
                      </p>
                      <p className="text-sm text-gray-600">
                        {subscription?.autoRenew ? "Activé" : "Désactivé"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <Zap className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Prix</p>
                      <p className="text-sm text-gray-600">
                        {subscription?.plan?.price
                          ? `${subscription.plan.price}€/${subscription.plan.interval}`
                          : "Gratuit"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Avantages du plan actuel */}
                {currentPlan && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Avantages inclus :
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {currentPlan.features
                        ?.slice(0, 6)
                        .map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  {isExpired ? (
                    <>
                      <Button
                        onClick={handleRenew}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Renouveler mon abonnement
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                      <Button
                        onClick={() => handleUpgrade()}
                        variant="outline"
                        className="flex-1"
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        Voir autres plans
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleUpgrade()}
                        className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        {subscription?.plan?.price
                          ? "Changer d'offre"
                          : "Passer au Premium"}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>

                      {subscription?.autoRenew && (
                        <Button
                          variant="outline"
                          onClick={handleRenew}
                          className="flex-1"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Renouveler maintenant
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar avec statistiques */}
          <div className="space-y-6">
            {/* Carte de statistiques d'utilisation */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Votre utilisation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Profil complété</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Annonces actives</span>
                    <span>3 / 10</span>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Clients ce mois</span>
                    <span>12 / 50</span>
                  </div>
                  <Progress value={24} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Carte d'information */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg">Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-gray-600">
                  Besoin d'aide avec votre abonnement ?
                </p>
                <Button variant="outline" className="w-full">
                  Contacter le support
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Réponse sous 24h
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section des autres plans*/}
        {!plansLoading && subscriptionPlans.length > 0 && (
          <div className="mt-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl">Autres Plans</CardTitle>
                <p className="text-gray-600">
                  Découvrez nos autres offres adaptées à vos besoins
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {subscriptionPlans.map((plan) => {
                    const color = getColorClasses(plan.color);
                    const isCurrentPlan = subscription?.plan?.id == plan.id;

                    return (
                      <div
                        key={plan.id}
                        className={`border rounded-lg p-4 relative transition-all duration-300 hover:shadow-lg ${
                          isCurrentPlan
                            ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                            : plan.popular
                            ? "border-yellow-400 ring-2 ring-yellow-200 bg-yellow-50/50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {plan.popular && !isCurrentPlan && (
                          <Badge className="mb-2 bg-yellow-500 text-white absolute -top-2 left-1/2 transform -translate-x-1/2">
                            Populaire
                          </Badge>
                        )}

                        {isCurrentPlan && (
                          <Badge className="mb-2 bg-primary text-white absolute -top-2 left-1/2 transform -translate-x-1/2">
                            Actuel
                          </Badge>
                        )}

                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-lg ${color.bg}`}>
                            <div className={color.text}>{plan.icon}</div>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">
                              {plan.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {plan.description}
                            </p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-2xl font-bold text-gray-900">
                            {plan.price}€
                            <span className="text-sm font-normal text-gray-600">
                              /{plan.period || "mois"}
                            </span>
                          </p>
                        </div>

                        <ul className="space-y-2 text-sm mb-4">
                          {plan.features?.slice(0, 4).map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                          {plan.features?.length > 4 && (
                            <li className="text-xs text-gray-500">
                              + {plan.features.length - 4} avantages
                              supplémentaires
                            </li>
                          )}
                        </ul>

                        <Button
                          variant={
                            isCurrentPlan
                              ? "outline"
                              : plan.popular
                              ? "default"
                              : "outline"
                          }
                          className={`w-full ${
                            plan.popular && !isCurrentPlan
                              ? "bg-yellow-500 hover:bg-yellow-600"
                              : ""
                          }`}
                          onClick={() => handleUpgrade(plan.id)}
                          disabled={isCurrentPlan && !isExpired}
                        >
                          {isCurrentPlan && !isExpired 
                            ? "Plan actuel" 
                            : isCurrentPlan && isExpired
                            ? "Renouveler"
                            : "Choisir ce plan"
                          }
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading state for plans */}
        {plansLoading && (
          <div className="mt-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-8 text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-gray-600">Chargement des plans...</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Modal d'abonnement expiré */}
      <SubscriptionExpiredModal
        isOpen={showExpiredModal}
        onClose={() => setShowExpiredModal(false)}
        onRenew={handleRenewFromModal}
      />
    </div>
  );
};

export default SubscriptionStatusPage;