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
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const SubscriptionStatusPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await api.get("/auth/subscription/status");
        setSubscription(response.data);

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
      } finally {
        setLoading(false);
      }
    };
    fetchSubscription();
  }, []);

  const handleUpgrade = () => {
    navigate("/pro/subscription/payment", {
      state: {
        subscriptionData: {
          /* vos plans payants */
        },
      },
    });
  };

  const handleRenew = async () => {
    try {
      await api.post("/auth/subscription/renew");
      toast.success("Renouvellement initié avec succès");
      // Recharger les données
      const response = await api.get("/auth/subscription/status");
      setSubscription(response.data);
    } catch (error) {
      toast.error("Erreur lors du renouvellement");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { variant: "default", label: "Actif", icon: CheckCircle },
      inactive: { variant: "secondary", label: "Inactif", icon: XCircle },
      expired: { variant: "destructive", label: "Expiré", icon: Clock },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Votre Abonnement
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Gérez et suivez l'état de votre abonnement en temps réel
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Carte principale d'abonnement */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <PlanIcon className="h-6 w-6 text-primary" />
                    {subscription?.plan?.name || "Essai Gratuit"}
                  </CardTitle>
                  {getStatusBadge(subscription?.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Barre de progression pour l'essai gratuit */}
                {(!subscription?.plan?.price ||
                  subscription.plan.price === 0) && (
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

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={handleUpgrade}
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
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar avec informations supplémentaires */}
          <div className="space-y-6">
            {/* Carte des avantages */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Avantages inclus
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "✓ Support prioritaire",
                  "✓ Analytics avancés",
                  "✓ Stockage étendu",
                  "✓ Templates exclusifs",
                  "✓ Formation en ligne",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section des plans recommandés */}
        <div className="mt-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">Plans recommandés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    name: "Starter",
                    price: "9€",
                    features: ["5 projets", "2GB stockage", "Support de base"],
                  },
                  {
                    name: "Pro",
                    price: "29€",
                    features: [
                      "20 projets",
                      "10GB stockage",
                      "Support prioritaire",
                    ],
                    popular: true,
                  },
                  {
                    name: "Enterprise",
                    price: "99€",
                    features: [
                      "Projets illimités",
                      "50GB stockage",
                      "Support 24/7",
                    ],
                  },
                ].map((plan, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 ${
                      plan.popular
                        ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                        : "border-gray-200"
                    }`}
                  >
                    {plan.popular && (
                      <Badge className="mb-2 bg-primary">Populaire</Badge>
                    )}
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                    <p className="text-2xl font-bold my-2">
                      {plan.price}
                      <span className="text-sm font-normal text-gray-600">
                        /mois
                      </span>
                    </p>
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={plan.popular ? "default" : "outline"}
                      className="w-full mt-4"
                      onClick={handleUpgrade}
                    >
                      Choisir ce plan
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStatusPage;
