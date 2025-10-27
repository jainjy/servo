// src/pages/SuccessPage.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Mail, Download, Home } from "lucide-react";

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, plan, paymentStatus } = location.state || {};

  if (!user) {
    console.log("No user data found in state, redirecting to registration.");
    navigate("/register");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-100 to-blue-200">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl text-center">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Félicitations !
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              Votre compte professionnel a été créé avec succès
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Récapitulatif */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Abonnement:</span>
                <span className="font-semibold">{plan?.planTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Prix:</span>
                <span className="font-semibold">{plan?.amount}/mois</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Période d'essai:</span>
                <span className="font-semibold text-green-600">14 jours gratuits</span>
              </div>
            </div>

            {/* Prochaines étapes */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Prochaines étapes</h3>
              
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-blue-500" />
                <span>Vérifiez votre email pour confirmer votre compte</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Download className="h-4 w-4 text-green-500" />
                <span>Configurez votre profil professionnel</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-purple-500" />
                <span>Commencez à utiliser la plateforme</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                className="w-full h-11 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold"
                onClick={() => navigate("/pro")}
              >
                Accéder à mon tableau de bord
              </Button>
              
              <Button
                variant="outline"
                className="w-full h-11 border-gray-300"
                onClick={() => navigate("/")}
              >
                <Home className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Button>
            </div>

            {/* Support */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Besoin d'aide ?{" "}
                <a href="/support" className="text-blue-600 hover:text-blue-700">
                  Contactez notre support
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuccessPage;