// SuccessPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Mail, User, Building } from "lucide-react";

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sessionDetails, setSessionDetails] = useState(null);

  const { user, plan, paymentStatus } = location.state || {};

  useEffect(() => {
    // Récupérer les détails de la session Stripe si nécessaire
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");

    if (sessionId) {
      // Vous pouvez récupérer les détails de la session depuis votre API
      fetchSessionDetails(sessionId);
    }
  }, []);

  const fetchSessionDetails = async (sessionId) => {
    try {
      const response = await fetch(`/api/payments/session/${sessionId}`);
      const session = await response.json();
      setSessionDetails(session);
    } catch (error) {
      console.error("Erreur récupération session:", error);
    }
  };

  const handleGoToDashboard = () => {
    navigate("/pro");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-100 to-blue-200">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Paiement Réussi !
            </CardTitle>
            <CardDescription className="text-gray-600">
              Votre inscription a été finalisée avec succès
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Résumé de l'inscription */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-gray-900 text-center">
                Bienvenue {user?.firstName} !
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{user?.email}</span>
                </div>

                {user?.companyName && (
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{user.companyName}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Abonnement:</span>
                    <span className="text-sm font-semibold">
                      {plan?.planTitle}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Période:</span>
                    <span className="text-sm font-semibold">
                      {plan?.period === "month" ? "Mensuel" : "Annuel"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Prochaines étapes */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">
                Prochaines étapes
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Vérifiez votre email pour confirmer votre compte</li>
                <li>• Complétez votre profil professionnel</li>
                <li>• Commencez à utiliser nos services</li>
              </ul>
            </div>

            <Button
              className="w-full h-11 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold"
              onClick={handleGoToDashboard}
            >
              Accéder à mon tableau de bord
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuccessPage;
