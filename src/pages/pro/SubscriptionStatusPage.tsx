import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pdf } from "@react-pdf/renderer";
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
  Download,
  Eye,
  EyeOff,
  Sparkles,
  TrendingUp,
  Target,
  BarChart3,
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { subscriptionPlansAPI } from "@/lib/api/subscriptionPlans";
import SubscriptionExpiredModal from "@/components/SubscriptionExpiredModal";
import { ReceiptPDF } from "@/components/admin/payments/receipt-pdf";

const SubscriptionStatusPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [plansLoading, setPlansLoading] = useState(true);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [showAmounts, setShowAmounts] = useState(true);
  const [showOtherPlans, setShowOtherPlans] = useState(false);
  const [currentPlanDetails, setCurrentPlanDetails] = useState(null);

  // Constantes de couleur basées sur votre palette
  const COLORS = {
    logo: "#556B2F",           /* Olive green - logo/accent */
    primary: "#6B8E23",        /* Yellow-green - primary-dark */
    lightBg: "#FFFFFF",        /* White - light-bg */
    separator: "#D3D3D3",      /* Light gray - separator */
    secondaryText: "#8B4513",  /* Saddle brown - secondary-text */
  };

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
    if (activeTab === "payments") {
      fetchPaymentHistory();
    }
  }, [activeTab]);

  useEffect(() => {
    if (subscription?.status === 'expired') {
      setShowExpiredModal(true);
    }
    
    // Charger les détails complets du plan actuel
    if (subscription?.plan?.id) {
      fetchCurrentPlanDetails(subscription.plan.id);
    }
  }, [subscription]);

  const fetchCurrentPlanDetails = async (planId) => {
    try {
      const response = await api.get(`/subscription-payments/plan-details/${planId}`);
      if (response.data.success) {
        setCurrentPlanDetails(response.data.plan);
      }
    } catch (error) {
      console.error("Erreur chargement détails plan:", error);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      setPaymentsLoading(true);
      const response = await api.get("/transactions/history");
      const transactions = response.data.data || response.data || [];
      setPaymentHistory(Array.isArray(transactions) ? transactions : []);
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique:", error);
      setPaymentHistory([]);
      toast.error("Impossible de charger l'historique des paiements");
    } finally {
      setPaymentsLoading(false);
    }
  };

  const fetchSubscription = async () => {
    try {
      const response = await api.get("/auth/subscription/status");
      const subscriptionData = response.data;
      setSubscription(subscriptionData);

      if (subscriptionData?.endDate) {
        const endDate = new Date(subscriptionData.endDate);
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

  const handleUpgrade = (planId = null, visibilityOption = "standard") => {
    if (planId) {
      const selectedPlan = subscriptionPlans.find((plan) => plan.id == planId);
      if (selectedPlan) {
        navigate("/pro/subscription/payment", {
          state: {
            subscriptionData: {
              planId: selectedPlan.id,
              truePlanId: selectedPlan.id,
              planTitle: selectedPlan.title || selectedPlan.name,
              price: selectedPlan.price,
              enhancedVisibilityPrice: selectedPlan.enhancedVisibilityPrice,
              period: selectedPlan.period || (selectedPlan.interval === "year" ? "annuel" : "mensuel"),
              userTypes: selectedPlan.userTypes,
              features: selectedPlan.features,
              supportsEnhancedVisibility: !!selectedPlan.enhancedVisibilityPrice,
              visibilityOption: visibilityOption,
            },
          },
        });
      } else {
        toast.error("Plan non trouvé");
      }
    } else {
      toast.error("Veuillez sélectionner un plan");
    }
  };

  const handleRenew = async () => {
    try {
      if (subscription?.plan?.id) {
        const currentPlan = subscription.plan;
        
        if (currentPlan) {
          navigate("/pro/subscription/payment", {
            state: {
              subscriptionData: {
                planId: currentPlan.id,
                truePlanId: currentPlan.id,
                planTitle: currentPlan.name,
                price: currentPlan.price,
                enhancedVisibilityPrice: currentPlan.enhancedVisibilityPrice,
                period: currentPlan.interval === "year" ? "annuel" : "mensuel",
                userTypes: currentPlan.userTypes,
                features: currentPlan.features,
                isRenewal: true,
                visibilityOption: subscription.visibilityOption || "standard",
              },
            },
          });
          return;
        }
      }

      toast.error("Impossible de renouveler : plan non trouvé");
      
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
    if (planName?.toLowerCase().includes("enhanced")) return Sparkles;
    return Star;
  };

  // Mise à jour de la fonction pour utiliser la nouvelle palette
  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-200",
        button: `bg-[${COLORS.primary}] hover:bg-[${COLORS.logo}]`,
        iconBg: "bg-blue-100",
      },
      emerald: {
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        border: "border-emerald-200",
        button: `bg-[${COLORS.primary}] hover:bg-[${COLORS.logo}]`,
        iconBg: "bg-emerald-100",
      },
      purple: {
        bg: "bg-purple-50",
        text: "text-purple-600",
        border: "border-purple-200",
        button: `bg-[${COLORS.primary}] hover:bg-[${COLORS.logo}]`,
        iconBg: "bg-purple-100",
      },
      pink: {
        bg: "bg-pink-50",
        text: "text-pink-600",
        border: "border-pink-200",
        button: `bg-[${COLORS.primary}] hover:bg-[${COLORS.logo}]`,
        iconBg: "bg-pink-100",
      },
    };
    return colors[color] || colors.blue;
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      completed: { variant: "default", label: "Payé", color: "bg-green-100 text-green-800" },
      pending: { variant: "outline", label: "En attente", color: "bg-yellow-100 text-yellow-800" },
      failed: { variant: "destructive", label: "Échoué", color: "bg-red-100 text-red-800" },
      refunded: { variant: "secondary", label: "Remboursé", color: "bg-blue-100 text-blue-800" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatCurrency = (amount, currency = "EUR") => {
    if (!showAmounts) return "••••••";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const calculateTotalPaid = () => {
    const completedPayments = paymentHistory.filter((t) => t.status === "completed");
    return completedPayments.reduce((sum, t) => sum + (t.amount || 0), 0);
  };

  const handleDownloadInvoice = async (transaction) => {
    try {
      const formattedTransaction = {
        id: transaction.id,
        date: new Date(transaction.createdAt).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        customer: user?.firstName && user?.lastName 
          ? `${user.firstName} ${user.lastName}` 
          : user?.email || "Client",
        type: "Abonnement",
        amount: `${transaction.amount}€`,
        method: transaction.paymentMethod || "Carte bancaire",
        status: transaction.status || "completed",
        reference: transaction.reference || transaction.id,
        customerEmail: user?.email || "",
        customerPhone: user?.phone || "",
        billingAddress: user?.address || "",
        cardLast4: transaction.cardLast4 || "",
        cardBrand: transaction.cardBrand || "",
        serviceDetails: transaction.description || "Abonnement",
        duration: subscription?.plan?.period || "mensuel",
        taxAmount: transaction.taxAmount || "0€",
        subtotal: transaction.subtotal || `${transaction.amount}€`,
        fees: transaction.fees || "0€",
        paymentType: "subscription",
        visibilityOption: subscription?.visibilityOption || "standard",
      };

      const doc = <ReceiptPDF transaction={formattedTransaction} />;
      const blob = await pdf(doc).toBlob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `facture-${transaction.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Facture téléchargée avec succès");
    } catch (err) {
      console.error("Erreur lors du téléchargement de la facture:", err);
      toast.error("Erreur lors du téléchargement de la facture");
    }
  };

  const getCurrentPlanPrice = () => {
    if (!subscription?.plan) return 0;
    
    if (subscription?.visibilityOption === "enhanced" && 
        subscription.plan?.enhancedVisibilityPrice) {
      return subscription.plan.enhancedVisibilityPrice;
    }
    
    return subscription.plan.price || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.lightBg }}>
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: COLORS.primary }} />
          <p className="text-lg font-medium" style={{ color: COLORS.secondaryText }}>
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
  const isExpired = subscription?.status === 'expired';
  const isEnhanced = subscription?.visibilityOption === 'enhanced';
  const currentPrice = getCurrentPlanPrice();

  return (
    <div className="min-h-screen py-0" style={{ backgroundColor: COLORS.lightBg }}>
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-lg lg:text-3xl md:text-4xl font-bold mb-2" style={{ color: COLORS.secondaryText }}>
            Votre Abonnement
          </h1>
          <p className="text-md lg:text-lg max-w-2xl mx-auto" style={{ color: COLORS.logo }}>
            Gérez et suivez l'état de votre abonnement en temps réel
          </p>
        </div>

        {/* Onglets de navigation */}
        <div className="flex gap-2 mb-6" style={{ borderBottom: `1px solid ${COLORS.separator}` }}>
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "overview"
                ? `text-[${COLORS.primary}] border-[${COLORS.primary}]`
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
            style={{ borderBottomColor: activeTab === "overview" ? COLORS.primary : 'transparent' }}
          >
            Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`px-4 py-3 font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "payments"
                ? `text-[${COLORS.primary}] border-[${COLORS.primary}]`
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
            style={{ borderBottomColor: activeTab === "payments" ? COLORS.primary : 'transparent' }}
          >
            <CreditCard className="h-4 w-4" />
            Historique des paiements
          </button>
        </div>

        {/* Contenu de l'onglet "Paiements" */}
        {activeTab === "payments" && (
          <div>
            <Card className="border-0 shadow-xl mb-6" style={{ backgroundColor: COLORS.lightBg, borderColor: COLORS.separator }}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl" style={{ color: COLORS.secondaryText }}>Historique des paiements</CardTitle>
                  <p className="text-sm mt-1" style={{ color: COLORS.logo }}>
                    Consultez tous vos paiements d'abonnement
                  </p>
                </div>
                <button
                  onClick={() => setShowAmounts(!showAmounts)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title={showAmounts ? "Masquer les montants" : "Afficher les montants"}
                >
                  {showAmounts ? (
                    <Eye className="h-5 w-5" style={{ color: COLORS.secondaryText }} />
                  ) : (
                    <EyeOff className="h-5 w-5" style={{ color: COLORS.secondaryText }} />
                  )}
                </button>
              </CardHeader>
              <CardContent>
                {paymentsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin" style={{ color: COLORS.primary }} />
                    <span className="ml-2" style={{ color: COLORS.secondaryText }}>Chargement...</span>
                  </div>
                ) : paymentHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 mx-auto mb-3" style={{ color: COLORS.separator }} />
                    <p style={{ color: COLORS.secondaryText }}>Aucun paiement enregistré</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${COLORS.separator}` }}>
                          <th className="text-left py-3 px-4 font-semibold" style={{ color: COLORS.secondaryText }}>Date</th>
                          <th className="text-left py-3 px-4 font-semibold" style={{ color: COLORS.secondaryText }}>Description</th>
                          <th className="text-left py-3 px-4 font-semibold" style={{ color: COLORS.secondaryText }}>Type</th>
                          <th className="text-left py-3 px-4 font-semibold" style={{ color: COLORS.secondaryText }}>Montant</th>
                          <th className="text-left py-3 px-4 font-semibold" style={{ color: COLORS.secondaryText }}>Statut</th>
                          <th className="text-left py-3 px-4 font-semibold" style={{ color: COLORS.secondaryText }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentHistory.map((transaction) => {
                          const metadata = transaction.metadata || {};
                          const isEnhancedPayment = metadata.visibilityOption === "enhanced" || 
                                                    metadata.selectedVisibilityOption === "enhanced";
                          
                          return (
                            <tr 
                              key={transaction.id} 
                              className="hover:bg-gray-50 transition-colors"
                              style={{ borderBottom: `1px solid ${COLORS.separator}` }}
                            >
                              <td className="py-3 px-4">
                                <span className="text-sm">
                                  {new Date(transaction.createdAt).toLocaleDateString("fr-FR", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </span>
                                <p className="text-xs" style={{ color: COLORS.logo }}>
                                  {new Date(transaction.createdAt).toLocaleTimeString("fr-FR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </td>
                              <td className="py-3 px-4">
                                <div>
                                  <p className="text-sm font-medium" style={{ color: COLORS.secondaryText }}>
                                    {transaction.description || "Abonnement"}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    {isEnhancedPayment && (
                                      <Badge className="bg-purple-100 text-purple-700 text-xs">
                                        <Sparkles className="h-3 w-3 mr-1" />
                                        Visibilité renforcée
                                      </Badge>
                                    )}
                                    <p className="text-xs" style={{ color: COLORS.logo }}>
                                      {transaction.providerId?.substring(0, 8)}...
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-sm" style={{ color: COLORS.logo }}>
                                  {metadata.planName || "Abonnement"}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-sm font-semibold" style={{ color: COLORS.primary }}>
                                  {formatCurrency(transaction.amount, transaction.currency)}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                {getPaymentStatusBadge(transaction.status)}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleDownloadInvoice(transaction)}
                                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                                    title="Télécharger la facture"
                                  >
                                    <Download className="h-4 w-4" style={{ color: COLORS.secondaryText }} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Résumé des statistiques de paiement */}
            {paymentHistory.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-0 shadow-xl" style={{ backgroundColor: COLORS.lightBg, borderColor: COLORS.separator }}>
                  <CardContent className="pt-6">
                    <p className="text-sm mb-2" style={{ color: COLORS.logo }}>Total payé</p>
                    <p className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                      {formatCurrency(calculateTotalPaid())}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-xl" style={{ backgroundColor: COLORS.lightBg, borderColor: COLORS.separator }}>
                  <CardContent className="pt-6">
                    <p className="text-sm mb-2" style={{ color: COLORS.logo }}>Paiements réussis</p>
                    <p className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                      {paymentHistory.filter((t) => t.status === "completed").length}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-xl" style={{ backgroundColor: COLORS.lightBg, borderColor: COLORS.separator }}>
                  <CardContent className="pt-6">
                    <p className="text-sm mb-2" style={{ color: COLORS.logo }}>Paiements renforcés</p>
                    <p className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                      {paymentHistory.filter(t => 
                        (t.metadata?.visibilityOption === "enhanced" || 
                         t.metadata?.selectedVisibilityOption === "enhanced") &&
                        t.status === "completed"
                      ).length}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-xl" style={{ backgroundColor: COLORS.lightBg, borderColor: COLORS.separator }}>
                  <CardContent className="pt-6">
                    <p className="text-sm mb-2" style={{ color: COLORS.logo }}>Dernier paiement</p>
                    <p className="text-lg font-bold" style={{ color: COLORS.primary }}>
                      {paymentHistory.length > 0
                        ? new Date(paymentHistory[0].createdAt).toLocaleDateString("fr-FR")
                        : "-"}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Contenu de l'onglet "Vue d'ensemble" */}
        {activeTab === "overview" && (
          <>
            {/* Bannière d'alerte pour abonnement expiré */}
            {isExpired && (
              <div className="mb-6 rounded-lg p-4" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6" style={{ color: '#DC2626' }} />
                  <div className="flex-1">
                    <h3 className="font-semibold" style={{ color: '#991B1B' }}>
                      Abonnement Expiré
                    </h3>
                    <p className="text-sm" style={{ color: '#B91C1C' }}>
                      Votre abonnement a expiré. Renouvelez-le pour continuer à profiter de tous les avantages.
                    </p>
                  </div>
                  <Button 
                    onClick={handleRenew}
                    style={{ backgroundColor: COLORS.primary }}
                    className="hover:bg-[#556B2F]"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Renouveler
                  </Button>
                </div>
              </div>
            )}

            {/* Bannière pour visibilité renforcée */}
            {isEnhanced && !isExpired && (
              <div className="mb-6 rounded-lg p-4" style={{ backgroundColor: '#F5F3FF', border: '1px solid #C4B5FD' }}>
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6" style={{ color: '#7C3AED' }} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold" style={{ color: '#5B21B6' }}>
                        Visibilité Renforcée Active
                      </h3>
                      <Badge className="bg-purple-100 text-purple-700">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    </div>
                    <p className="text-sm" style={{ color: '#7C3AED' }}>
                      Votre profil bénéficie d'une visibilité prioritaire. Vous êtes positionné en haut des résultats de recherche.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Carte principale d'abonnement */}
              <div className="lg:col-span-2">
                <Card 
                  className={`border-0 shadow-xl ${
                    isExpired ? 'border-red-200 ring-1 ring-red-100' : ''
                  } ${
                    isEnhanced ? 'border-purple-200 ring-1 ring-purple-100' : ''
                  }`}
                  style={{ 
                    backgroundColor: COLORS.lightBg,
                    borderColor: isExpired ? '#FECACA' : isEnhanced ? '#C4B5FD' : COLORS.separator
                  }}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-md lg:text-2xl">
                        {isEnhanced ? (
                          <Sparkles className="h-6 w-6" style={{ color: '#8B5CF6' }} />
                        ) : (
                          <PlanIcon className="h-6 w-6" style={{ color: COLORS.primary }} />
                        )}
                        <span style={{ color: COLORS.secondaryText }}>
                          {subscription?.plan?.name || "Essai Gratuit"}
                          {isEnhanced && (
                            <span className="ml-2 text-sm font-normal" style={{ color: '#8B5CF6' }}>
                              (Visibilité Renforcée)
                            </span>
                          )}
                        </span>
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(subscription?.status)}
                        {isEnhanced && (
                          <Badge className="bg-purple-100 text-purple-700 border-0">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Renforcée
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Barre de progression pour l'essai gratuit */}
                    {(!subscription?.plan?.price ||
                      subscription.plan.price == 0) && (
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium" style={{ color: COLORS.secondaryText }}>Jours restants</span>
                          <span className="font-bold" style={{ color: COLORS.primary }}>
                            {daysRemaining} jours
                          </span>
                        </div>
                        <Progress
                          value={((30 - daysRemaining) / 30) * 100}
                          className="h-2"
                          style={{ backgroundColor: COLORS.separator }}
                        />
                        <p className="text-xs" style={{ color: COLORS.logo }}>
                          Votre période d'essai se termine dans {daysRemaining}{" "}
                          jours
                        </p>
                      </div>
                    )}

                    {/* Détails de l'abonnement */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#EFF6FF' }}>
                        <Calendar className="h-5 w-5" style={{ color: '#2563EB' }} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: COLORS.secondaryText }}>Début</p>
                          <p className="text-sm" style={{ color: COLORS.logo }}>
                            {subscription
                              ? new Date(subscription.startDate).toLocaleDateString(
                                  "fr-FR"
                                )
                              : "-"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#FFEDD5' }}>
                        <Calendar className="h-5 w-5" style={{ color: '#EA580C' }} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: COLORS.secondaryText }}>Fin</p>
                          <p className="text-sm" style={{ color: COLORS.logo }}>
                            {subscription
                              ? new Date(subscription.endDate).toLocaleDateString(
                                  "fr-FR"
                                )
                              : "-"}
                          </p>
                          <p className="text-xs" style={{ color: COLORS.primary }}>
                            {daysRemaining > 0 ? `${daysRemaining} jours restants` : "Expiré"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F0FDF4' }}>
                        <CreditCard className="h-5 w-5" style={{ color: '#16A34A' }} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: COLORS.secondaryText }}>
                            Auto-renouvellement
                          </p>
                          <p className="text-sm" style={{ color: COLORS.logo }}>
                            {subscription?.autoRenew ? "Activé" : "Désactivé"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: isEnhanced ? '#F5F3FF' : '#FAF5FF' }}>
                        {isEnhanced ? (
                          <Sparkles className="h-5 w-5" style={{ color: '#8B5CF6' }} />
                        ) : (
                          <Zap className="h-5 w-5" style={{ color: '#9333EA' }} />
                        )}
                        <div>
                          <p className="text-sm font-medium" style={{ color: COLORS.secondaryText }}>
                            {isEnhanced ? "Tarif renforcé" : "Tarif standard"}
                          </p>
                          <p className="text-sm" style={{ color: isEnhanced ? '#8B5CF6' : COLORS.logo }}>
                            {currentPrice}€
                            <span className="text-xs ml-1">
                              /{subscription?.plan?.interval === "year" ? "an" : "mois"}
                            </span>
                            {isEnhanced && subscription?.plan?.enhancedVisibilityPrice && (
                              <span className="text-xs ml-2 text-gray-500">
                                (standard: {subscription.plan.price}€)
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Section Visibilité */}
                    {subscription?.plan && (
                      <div className="border rounded-lg p-4" style={{ 
                        borderColor: isEnhanced ? '#C4B5FD' : COLORS.separator,
                        backgroundColor: isEnhanced ? '#F5F3FF' : '#F9FAFB'
                      }}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-lg ${isEnhanced ? 'bg-purple-100' : 'bg-gray-100'}`}>
                            {isEnhanced ? (
                              <Sparkles className="h-5 w-5" style={{ color: '#8B5CF6' }} />
                            ) : (
                              <Eye className="h-5 w-5" style={{ color: '#6B7280' }} />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold" style={{ color: COLORS.secondaryText }}>
                              Niveau de Visibilité
                            </h4>
                            <p className="text-sm" style={{ color: COLORS.logo }}>
                              {isEnhanced 
                                ? "Votre profil bénéficie d'une visibilité renforcée" 
                                : "Visibilité standard activée"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                          <div className={`p-3 rounded-lg border ${isEnhanced ? 'bg-purple-50 border-purple-200' : 'bg-white border-gray-200'}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-2 h-2 rounded-full ${isEnhanced ? 'bg-purple-500' : 'bg-gray-400'}`} />
                              <span className="text-sm font-medium" style={{ color: COLORS.secondaryText }}>
                                {isEnhanced ? "Visibilité Renforcée" : "Visibilité Standard"}
                              </span>
                            </div>
                            <ul className="space-y-1 text-xs" style={{ color: COLORS.logo }}>
                              {isEnhanced ? (
                                <>
                                  <li className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3 text-purple-500" />
                                    Position prioritaire
                                  </li>
                                  <li className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3 text-purple-500" />
                                    Badge "Recommandé"
                                  </li>
                                  <li className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3 text-purple-500" />
                                    3x plus de vues
                                  </li>
                                </>
                              ) : (
                                <>
                                  <li className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" style={{ color: COLORS.primary }} />
                                    Profil visible
                                  </li>
                                  <li className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" style={{ color: COLORS.primary }} />
                                    Recherche standard
                                  </li>
                                  <li className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" style={{ color: COLORS.primary }} />
                                    Contacts illimités
                                  </li>
                                </>
                              )}
                            </ul>
                          </div>
                          
                          {!isEnhanced && subscription?.plan?.enhancedVisibilityPrice && (
                            <div className="p-3 rounded-lg border border-purple-200 bg-purple-50">
                              <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="h-4 w-4 text-purple-500" />
                                <span className="text-sm font-medium" style={{ color: '#7C3AED' }}>
                                  Améliorez votre visibilité
                                </span>
                              </div>
                              <p className="text-xs mb-2" style={{ color: '#8B5CF6' }}>
                                Passez à la visibilité renforcée pour seulement
                              </p>
                              <p className="text-lg font-bold" style={{ color: '#7C3AED' }}>
                                +{(subscription.plan.enhancedVisibilityPrice - subscription.plan.price).toFixed(2)}€
                              </p>
                              <Button
                                size="sm"
                                className="w-full mt-2 bg-purple-600 hover:bg-purple-700"
                                onClick={() => handleUpgrade(subscription.plan.id, "enhanced")}
                              >
                                <Sparkles className="h-3 w-3 mr-2" />
                                Améliorer
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Avantages du plan actuel */}
                    {currentPlan && (
                      <div className="border-t pt-4" style={{ borderColor: COLORS.separator }}>
                        <h4 className="font-semibold mb-3" style={{ color: COLORS.secondaryText }}>
                          Avantages inclus :
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {currentPlan.features?.slice(0, 6).map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4" style={{ color: COLORS.primary }} />
                              <span style={{ color: COLORS.logo }}>{feature}</span>
                            </div>
                          ))}
                          {isEnhanced && (
                            <>
                              <div className="flex items-center gap-2 text-sm">
                                <Sparkles className="h-4 w-4 text-purple-500" />
                                <span className="text-purple-600 font-medium">Position prioritaire dans les résultats</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Sparkles className="h-4 w-4 text-purple-500" />
                                <span className="text-purple-600 font-medium">Badge "Recommandé" visible</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      {isExpired ? (
                        <>
                          <Button
                            onClick={handleRenew}
                            className="flex-1 shadow-lg"
                            style={{ backgroundColor: COLORS.primary }}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Renouveler mon abonnement
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={() => {
                              if (subscription?.plan?.id) {
                                handleUpgrade(subscription.plan.id, subscription.visibilityOption);
                              } else {
                                navigate("/pro/subscription/plans");
                              }
                            }}
                            className="flex-1 shadow-lg"
                            style={{ backgroundColor: COLORS.primary }}
                          >
                            <Crown className="h-4 w-4 mr-2" />
                            {subscription?.plan?.price
                              ? "Modifier l'abonnement"
                              : "Passer au Premium"}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>

                          {subscription?.autoRenew && (
                            <Button
                              variant="outline"
                              onClick={handleRenew}
                              className="flex-1"
                              style={{ borderColor: COLORS.separator, color: COLORS.secondaryText }}
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
                <Card className="border-0 shadow-xl" style={{ backgroundColor: COLORS.lightBg, borderColor: COLORS.separator }}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" style={{ color: '#CA8A04' }} />
                      <span style={{ color: COLORS.secondaryText }}>Impact de votre abonnement</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: COLORS.secondaryText }}>Visibilité du profil</span>
                        <span style={{ color: isEnhanced ? '#8B5CF6' : COLORS.primary }}>
                          {isEnhanced ? "Élevée" : "Standard"}
                        </span>
                      </div>
                      <Progress 
                        value={isEnhanced ? 90 : 60} 
                        className="h-2" 
                        style={{ backgroundColor: COLORS.separator }}
                      />
                      {isEnhanced && (
                        <p className="text-xs mt-1" style={{ color: '#8B5CF6' }}>
                          +50% de visibilité grâce à l'option renforcée
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: COLORS.secondaryText }}>Taux de conversion</span>
                        <span style={{ color: isEnhanced ? '#8B5CF6' : COLORS.primary }}>
                          {isEnhanced ? "+35%" : "+15%"}
                        </span>
                      </div>
                      <Progress 
                        value={isEnhanced ? 85 : 50} 
                        className="h-2" 
                        style={{ backgroundColor: COLORS.separator }}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: COLORS.secondaryText }}>Position dans les résultats</span>
                        <span style={{ color: isEnhanced ? '#8B5CF6' : COLORS.primary }}>
                          {isEnhanced ? "Top 3" : "Variable"}
                        </span>
                      </div>
                      <Progress 
                        value={isEnhanced ? 95 : 40} 
                        className="h-2" 
                        style={{ backgroundColor: COLORS.separator }}
                      />
                    </div>
                    
                    {isEnhanced && (
                      <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: '#F5F3FF' }}>
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium" style={{ color: '#7C3AED' }}>Avantage renforcé</span>
                        </div>
                        <p className="text-xs" style={{ color: '#8B5CF6' }}>
                          Votre profil reçoit en moyenne 3x plus de contacts grâce à la visibilité renforcée.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Carte d'information */}
                <Card className="border-0 shadow-xl" style={{ backgroundColor: COLORS.lightBg, borderColor: COLORS.separator }}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5" style={{ color: COLORS.primary }} />
                      <span style={{ color: COLORS.secondaryText }}>Optimisez votre présence</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {isEnhanced ? (
                      <>
                        <p style={{ color: COLORS.logo }}>
                          🎯 <strong>Votre profil est optimisé !</strong>
                        </p>
                        <p style={{ color: COLORS.logo }}>
                          Profitez au maximum de votre visibilité renforcée :
                        </p>
                        <ul className="space-y-1 pl-4" style={{ color: COLORS.logo }}>
                          <li>• Mettez à jour vos photos régulièrement</li>
                          <li>• Complétez toutes les sections de votre profil</li>
                          <li>• Répondez rapidement aux messages</li>
                        </ul>
                      </>
                    ) : (
                      <>
                        <p style={{ color: COLORS.logo }}>
                          <strong>Boostez votre visibilité :</strong>
                        </p>
                        <p style={{ color: COLORS.logo }}>
                          Passez à l'option renforcée pour augmenter votre visibilité de 50%.
                        </p>
                        {subscription?.plan?.enhancedVisibilityPrice && (
                          <Button 
                            variant="outline" 
                            className="w-full mt-2 bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                            onClick={() => handleUpgrade(subscription.plan.id, "enhanced")}
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Améliorer la visibilité
                          </Button>
                        )}
                      </>
                    )}
                    
                    <div className="pt-3 border-t" style={{ borderColor: COLORS.separator }}>
                      <p className="text-xs text-center" style={{ color: COLORS.logo }}>
                        Besoin d'aide ? Contactez le support
                      </p>
                      <Button 
                        variant="outline" 
                        className="w-full mt-2"
                        style={{ borderColor: COLORS.separator, color: COLORS.secondaryText }}
                      >
                        Contacter le support
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Section des autres plans */}
            {!plansLoading && subscriptionPlans.length > 0 && (
              <div className="mt-8">
                {!showOtherPlans ? (
                  <div className="text-center">
                    <Button
                      onClick={() => setShowOtherPlans(true)}
                      variant="outline"
                      size="lg"
                      className="gap-2"
                      style={{ borderColor: COLORS.separator, color: COLORS.secondaryText }}
                    >
                      Comparer les autres plans
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold" style={{ color: COLORS.secondaryText }}>Tous les Plans Disponibles</h2>
                        <p className="text-sm" style={{ color: COLORS.logo }}>
                          Comparez et choisissez le plan parfait pour votre activité
                        </p>
                      </div>
                      <Button
                        onClick={() => setShowOtherPlans(false)}
                        variant="ghost"
                        size="sm"
                        style={{ color: COLORS.secondaryText }}
                      >
                        Masquer
                      </Button>
                    </div>

                    <Card className="border-0 shadow-xl" style={{ backgroundColor: COLORS.lightBg, borderColor: COLORS.separator }}>
                      <CardHeader>
                        <CardTitle className="text-xl" style={{ color: COLORS.secondaryText }}>Découvrez nos offres</CardTitle>
                        <p style={{ color: COLORS.logo }}>
                          Choisissez le plan adapté à vos besoins avec option de visibilité renforcée
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {subscriptionPlans.map((plan) => {
                            const color = getColorClasses(plan.color);
                            const isCurrentPlan = subscription?.plan?.id == plan.id;
                            const currentIsEnhanced = isCurrentPlan && isEnhanced;
                            const supportsEnhanced = !!plan.enhancedVisibilityPrice;

                            return (
                              <div
                                key={plan.id}
                                className={`border rounded-xl p-5 relative transition-all duration-300 hover:shadow-lg ${
                                  isCurrentPlan
                                    ? `ring-2 ${currentIsEnhanced ? 'ring-purple-500' : 'ring-[#6B8E23]'}`
                                    : plan.popular
                                    ? "border-yellow-400 ring-2 ring-yellow-200 bg-yellow-50/50"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                                style={{ 
                                  backgroundColor: isCurrentPlan 
                                    ? currentIsEnhanced ? '#F5F3FF' : `${COLORS.primary}0D` 
                                    : COLORS.lightBg,
                                  borderColor: isCurrentPlan 
                                    ? currentIsEnhanced ? '#8B5CF6' : COLORS.primary
                                    : plan.popular ? '#FACC15' : COLORS.separator,
                                }}
                              >
                                {plan.popular && !isCurrentPlan && (
                                  <Badge className="mb-3 absolute -top-2 left-1/2 transform -translate-x-1/2" 
                                    style={{ backgroundColor: '#CA8A04', color: 'white' }}>
                                    Populaire
                                  </Badge>
                                )}

                                {isCurrentPlan && (
                                  <Badge className={`mb-3 absolute -top-2 left-1/2 transform -translate-x-1/2 ${currentIsEnhanced ? 'bg-purple-100 text-purple-700' : 'bg-[#6B8E23] text-white'}`}>
                                    {currentIsEnhanced ? (
                                      <>
                                        <Sparkles className="h-3 w-3 mr-1" />
                                        Actuel (Renforcé)
                                      </>
                                    ) : "Actuel"}
                                  </Badge>
                                )}

                                <div className="flex items-center gap-3 mb-4">
                                  <div className={`p-2 rounded-lg ${currentIsEnhanced ? 'bg-purple-100' : color.iconBg}`}>
                                    <div style={{ 
                                      color: currentIsEnhanced ? '#8B5CF6' : plan.color || COLORS.primary 
                                    }}>
                                      {plan.icon}
                                    </div>
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-lg" style={{ color: COLORS.secondaryText }}>
                                      {plan.title || plan.name}
                                    </h3>
                                    <p className="text-xs" style={{ color: COLORS.logo }}>
                                      {plan.description}
                                    </p>
                                  </div>
                                </div>

                                {/* Prix */}
                                <div className="mb-4">
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold" style={{ 
                                      color: currentIsEnhanced ? '#8B5CF6' : COLORS.primary 
                                    }}>
                                      {plan.price}€
                                    </span>
                                    <span className="text-sm" style={{ color: COLORS.logo }}>
                                      /{plan.period || (plan.interval === "year" ? "an" : "mois")}
                                    </span>
                                  </div>
                                  
                                  {supportsEnhanced && (
                                    <div className="mt-2">
                                      <div className="flex items-center gap-2">
                                        <Sparkles className="h-3 w-3 text-purple-500" />
                                        <span className="text-xs font-medium" style={{ color: '#7C3AED' }}>
                                          Option renforcée : {plan.enhancedVisibilityPrice}€
                                        </span>
                                      </div>
                                      <p className="text-xs" style={{ color: COLORS.logo }}>
                                        +{(plan.enhancedVisibilityPrice - plan.price).toFixed(2)}€ pour 3x plus de visibilité
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* Avantages */}
                                <ul className="space-y-2 text-sm mb-6">
                                  {plan.features?.slice(0, 3).map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                      <CheckCircle className="h-4 w-4 flex-shrink-0" 
                                        style={{ color: currentIsEnhanced ? '#8B5CF6' : COLORS.primary }} />
                                      <span style={{ color: COLORS.logo }}>{feature}</span>
                                    </li>
                                  ))}
                                  {supportsEnhanced && (
                                    <li className="flex items-center gap-2">
                                      <Sparkles className="h-4 w-4 text-purple-500 flex-shrink-0" />
                                      <span className="text-purple-600 font-medium">
                                        Visibilité renforcée disponible
                                      </span>
                                    </li>
                                  )}
                                  {plan.features?.length > 3 && (
                                    <li className="text-xs" style={{ color: COLORS.secondaryText }}>
                                      + {plan.features.length - 3} avantages
                                    </li>
                                  )}
                                </ul>

                                {/* Boutons d'action */}
                                <div className="space-y-2">
                                  <Button
                                    variant={
                                      isCurrentPlan && !currentIsEnhanced
                                        ? "outline"
                                        : "default"
                                    }
                                    className={`w-full ${
                                      plan.popular && !isCurrentPlan
                                        ? "bg-yellow-500 hover:bg-yellow-600"
                                        : ""
                                    } ${
                                      currentIsEnhanced
                                        ? "bg-purple-600 hover:bg-purple-700"
                                        : ""
                                    }`}
                                    style={{ 
                                      backgroundColor: isCurrentPlan && !currentIsEnhanced ? 'transparent' : 
                                      currentIsEnhanced ? '#8B5CF6' :
                                      plan.popular ? '#CA8A04' : COLORS.primary,
                                      borderColor: isCurrentPlan && !currentIsEnhanced ? COLORS.primary : 
                                      plan.popular ? '#CA8A04' : COLORS.separator,
                                      color: isCurrentPlan && !currentIsEnhanced ? COLORS.primary : 'white'
                                    }}
                                    onClick={() => handleUpgrade(plan.id, isCurrentPlan ? subscription.visibilityOption : "standard")}
                                    disabled={isCurrentPlan && !isExpired && !currentIsEnhanced}
                                  >
                                    {isCurrentPlan && !currentIsEnhanced && !isExpired
                                      ? "Plan actuel" 
                                      : isCurrentPlan && currentIsEnhanced
                                      ? "Déjà renforcé"
                                      : isCurrentPlan && isExpired
                                      ? "Renouveler"
                                      : supportsEnhanced && plan.popular
                                      ? "Choisir ce plan"
                                      : "Sélectionner"
                                    }
                                  </Button>
                                  
                                  {supportsEnhanced && !(isCurrentPlan && currentIsEnhanced) && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full"
                                      style={{ 
                                        borderColor: '#C4B5FD',
                                        color: '#7C3AED',
                                        backgroundColor: '#F5F3FF'
                                      }}
                                      onClick={() => handleUpgrade(plan.id, "enhanced")}
                                    >
                                      <Sparkles className="h-3 w-3 mr-2" />
                                      Choisir avec visibilité renforcée
                                    </Button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Légende des options */}
                        <div className="mt-8 pt-6 border-t" style={{ borderColor: COLORS.separator }}>
                          <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-[#6B8E23]" />
                              <span className="text-sm" style={{ color: COLORS.secondaryText }}>Plan actuel</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-purple-500" />
                              <span className="text-sm" style={{ color: COLORS.secondaryText }}>Visibilité renforcée</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-purple-500" />
                              <span className="text-sm" style={{ color: COLORS.secondaryText }}>Option disponible</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            )}

            {/* Loading state for plans */}
            {plansLoading && (
              <div className="mt-8">
                <Card className="border-0 shadow-xl" style={{ backgroundColor: COLORS.lightBg, borderColor: COLORS.separator }}>
                  <CardContent className="p-8 text-center">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: COLORS.primary }} />
                    <p style={{ color: COLORS.logo }}>Chargement des plans...</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionStatusPage;
