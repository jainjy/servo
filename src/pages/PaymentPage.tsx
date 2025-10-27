import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Lock, ArrowLeft } from "lucide-react";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { formData, subscriptionData } = location.state || {};
  const [isProcessing, setIsProcessing] = useState(false);

  if (!formData || !subscriptionData) {
    navigate("/register/professional/subscription");
    return null;
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simuler le traitement du paiement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirection vers la page de succès
      navigate("/register/success", {
        state: {
          user: formData,
          plan: subscriptionData,
          paymentStatus: "completed"
        }
      });
    } catch (error) {
      console.error("Payment error:", error);
      alert("Erreur lors du paiement. Veuillez réessayer.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    navigate("/register/professional/form", { state: { subscriptionData } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-blue-200">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Paiement sécurisé
            </CardTitle>
            <CardDescription className="text-gray-600">
              Finalisez votre inscription professionnelle
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Récapitulatif */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-gray-900">Récapitulatif</h3>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Abonnement:</span>
                <span className="font-semibold">{subscriptionData.planTitle}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Prix:</span>
                <span className="font-semibold">{subscriptionData.price}/{subscriptionData.period}</span>
              </div>
              
            </div>

            {/* Informations de paiement */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Informations de paiement</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Numéro de carte</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Date d'expiration</label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sécurité */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Lock className="h-4 w-4 text-green-500" />
              <span>Paiement 100% sécurisé et crypté</span>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                className="w-full h-11 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Traitement en cours...
                  </div>
                ) : (
                  `Payer ${subscriptionData.price}`
                )}
              </Button>
              
              <Button
                variant="outline"
                className="w-full h-11 border-gray-300"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentPage;