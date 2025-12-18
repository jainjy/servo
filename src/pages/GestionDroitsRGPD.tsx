import React, { useState } from "react";
import {
  Download,
  Trash2,
  Eye,
  Lock,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  Mail,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { toast } from "sonner";

export default function GestionDroitsRGPD() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [actionStatus, setActionStatus] = useState({});

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Button onClick={() => navigate("/login")}>Se connecter</Button>
      </div>
    );
  }

  const rights = [
    {
      id: "access",
      title: "Droit d'accès",
      icon: Eye,
      description: "Obtenez une copie de toutes vos données personnelles",
      details: [
        "Données de profil",
        "Historique des transactions",
        "Messages et communications",
        "Préférences utilisateur",
        "Logs d'activité",
      ],
      action: "Télécharger mes données",
      action_id: "export",
    },
    {
      id: "rectification",
      title: "Droit de rectification",
      icon: FileText,
      description: "Corrigez ou complétez vos données personnelles",
      details: [
        "Modifier votre profil",
        "Changer votre adresse email",
        "Mettre à jour votre téléphone",
        "Corriger vos informations",
      ],
      action: "Aller à mon profil",
      action_id: "edit",
    },
    {
      id: "oblivion",
      title: "Droit à l'oubli (Suppression)",
      icon: Trash2,
      description: "Demandez la suppression définitive de votre compte et données",
      details: [
        "Suppression complète du compte",
        "Suppression des données personnelles",
        "Suppression des contenus publiés",
        "Suppression après délai légal",
      ],
      action: "Supprimer mon compte",
      action_id: "delete",
      dangerous: true,
    },
    {
      id: "portability",
      title: "Droit à la portabilité",
      icon: Download,
      description: "Récupérez vos données en format structuré (JSON/CSV)",
      details: [
        "Format JSON structuré",
        "Format CSV tabulaire",
        "Toutes les informations",
        "Transfert vers autre plateforme",
      ],
      action: "Exporter mes données",
      action_id: "export",
    },
    {
      id: "opposition",
      title: "Droit d'opposition",
      icon: Shield,
      description: "Refusez le traitement de vos données pour certaines finalités",
      details: [
        "Refuser le marketing",
        "Refuser la personnalisation",
        "Refuser l'analyse de profil",
        "Gérer vos consentements",
      ],
      action: "Gérer mes consentements",
      action_id: "consent",
    },
    {
      id: "limitation",
      title: "Droit à la limitation",
      icon: Lock,
      description: "Limitez le traitement de vos données",
      details: [
        "Geler temporairement le traitement",
        "Conserver les données",
        "Arrêter certains usages",
        "Restreindre la portée",
      ],
      action: "Demander une limitation",
      action_id: "limit",
    },
  ];

  const handleExportData = async () => {
    try {
      setLoading(true);
      setActionStatus({ ...actionStatus, export: "loading" });
      
      const response = await api.get("/users/export-data");
      
      const blob = new Blob([JSON.stringify(response.data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `servo-donnees-personnelles-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setActionStatus({ ...actionStatus, export: "success" });
      toast.success("✅ Vos données ont été exportées avec succès");
      
      setTimeout(() => {
        setActionStatus({ ...actionStatus, export: "idle" });
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      setActionStatus({ ...actionStatus, export: "error" });
      toast.error("❌ Erreur lors de l'export des données");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    navigate("/mon-compte");
  };

  const handleDeleteAccount = () => {
    navigate("/delete-account");
  };

  const handleManageConsent = () => {
    const element = document.querySelector('[class*="cookie"]');
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      toast.info("Allez en bas de page pour gérer vos cookies");
    }
  };

  const handleLimitProcessing = async () => {
    try {
      setLoading(true);
      setActionStatus({ ...actionStatus, limit: "loading" });
      
      await api.post("/users/request-limitation");
      
      setActionStatus({ ...actionStatus, limit: "success" });
      toast.success("✅ Demande de limitation enregistrée");
      
      setTimeout(() => {
        setActionStatus({ ...actionStatus, limit: "idle" });
      }, 3000);
    } catch (error) {
      console.error("Erreur:", error);
      setActionStatus({ ...actionStatus, limit: "error" });
      toast.error("❌ Erreur lors de la demande");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (actionId) => {
    switch (actionId) {
      case "export":
        handleExportData();
        break;
      case "edit":
        handleEditProfile();
        break;
      case "delete":
        handleDeleteAccount();
        break;
      case "consent":
        handleManageConsent();
        break;
      case "limit":
        handleLimitProcessing();
        break;
      default:
        break;
    }
  };

  const getActionStatus = (actionId) => {
    return actionStatus[actionId] || "idle";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl pt-10 mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Gestion de vos Droits RGPD
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Contrôlez vos données personnelles
              </p>
            </div>
          </div>
        </div>

        {/* Info Alert */}
        <Alert className="mb-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            Conformément au RGPD, vous disposez de droits essentiels sur vos données personnelles. 
            Utilisez cette page pour les exercer.
          </AlertDescription>
        </Alert>

        {/* Rights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rights.map((right) => {
            const Icon = right.icon;
            const status = getActionStatus(right.action_id);
            const isLoading = status === "loading";
            const isSuccess = status === "success";

            return (
              <Card
                key={right.id}
                className={`flex flex-col transition-all ${
                  right.dangerous
                    ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10"
                    : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className={`p-2 rounded-lg ${
                        right.dangerous
                          ? "bg-red-100 dark:bg-red-900"
                          : "bg-blue-100 dark:bg-blue-900"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          right.dangerous
                            ? "text-red-600 dark:text-red-400"
                            : "text-blue-600 dark:text-blue-400"
                        }`}
                      />
                    </div>
                    {isSuccess && <CheckCircle className="w-5 h-5 text-green-500" />}
                  </div>
                  <CardTitle className="text-lg">{right.title}</CardTitle>
                  <CardDescription>{right.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-2 mb-6 flex-1">
                    {right.details.map((detail, idx) => (
                      <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleAction(right.action_id)}
                    disabled={isLoading || loading}
                    variant={right.dangerous ? "destructive" : "default"}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        En cours...
                      </>
                    ) : (
                      right.action
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* DPO Contact Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Contacter notre DPO
            </h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Si vous avez des questions concernant vos droits RGPD ou souhaitez exercer des droits 
            qui ne sont pas disponibles ci-dessus, veuillez contacter notre Délégué à la Protection 
            des Données :
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Email</p>
              <a
                href="mailto:dpo@servo.mg"
                className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                dpo@servo.mg
              </a>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Téléphone</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                +261 XX XX XX XX
              </p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <span className="font-semibold">Délai de réponse :</span> Nous nous engageons à répondre 
              à vos demandes dans un délai de 30 jours conformément au RGPD.
            </p>
          </div>
        </div>

        {/* Legal References */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="/politique-confidentialite"
            className="bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Politique de Confidentialité
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Découvrez comment nous traitons vos données
            </p>
          </a>
          <a
            href="/mentions-legales"
            className="bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Mentions Légales
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Informations juridiques de OLIPLUSPlatform
            </p>
          </a>
          <a
            href="/conditions-utilisation"
            className="bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Conditions d'Utilisation
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Lisez les conditions régissant l'utilisation
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
