import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Crown,
  ArrowRight,
  X,
  Lock,
  Zap,
  Star,
  Target,
  Clock,
  TrendingDown,
  ShieldOff,
  Home, // Nouvelle icône importée
} from "lucide-react";

const SubscriptionExpiredModal = ({
  isOpen,
  onClose,
  onRenew,
  onGoToDashboard, // Nouveau prop pour la navigation
  canClose = true, // Pour que le modals puisse être fermé ou non
  showGif = true,
}) => {
  const [gifLoaded, setGifLoaded] = useState(false);

  const limitationsIcons = [ShieldOff, TrendingDown, Clock];
  const renewalIcons = [Zap, Star, Target];

  return (
    <Dialog open={isOpen} onOpenChange={canClose ? onClose : undefined}>
      <DialogContent
        className="max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-3xl w-[95%] sm:w-full h-auto max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader className="relative pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <Lock className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-red-700">
                Accès Restreint
              </DialogTitle>
              <DialogDescription>
                Votre abonnement a expiré et votre accès est limité
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {showGif && (
            <div className="flex justify-center">
              <div className="relative w-full max-w-xs sm:max-w-sm aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-red-300 bg-gradient-to-br from-red-50 to-orange-50">
                <img
                  src="/accessDenied.gif"
                  alt="Accès refusé - Abonnement expiré"
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    gifLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setGifLoaded(true)}
                  onError={(e) => {
                    console.error("Erreur de chargement du GIF");
                    e.target.style.display = "none";
                    setGifLoaded(false);
                    // Fallback visuel avec SVG Lucide
                    e.target.parentElement.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-100 to-orange-100">
                            <div class="text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-16 w-16 text-red-400 mx-auto mb-4"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                <p class="text-red-600 font-semibold">Accès Restreint</p>
                                <p class="text-red-500 text-sm mt-2">Abonnement expiré</p>
                            </div>
                        </div>
                    `;
                  }}
                />

                <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    ABONNEMENT EXPIRE
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Limitations actuelles
              </h4>
              <ul className="text-sm text-yellow-700 space-y-2">
                {[
                  "Fonctionnalités premium bloquées",
                  "Visibilité réduite",
                  "Support standard uniquement",
                ].map((text, index) => {
                  const Icon = limitationsIcons[index];
                  return (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-0.5 flex-shrink-0">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>{text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <Crown className="h-4 w-4" />
                Après renouvellement
              </h4>
              <ul className="text-sm text-green-700 space-y-2">
                {[
                  "Accès complet restauré",
                  "Visibilité maximale",
                  "Support prioritaire",
                ].map((text, index) => {
                  const Icon = renewalIcons[index];
                  return (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5 flex-shrink-0">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>{text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {!canClose && (
            <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-4 text-white text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-bold">ACTION IMMÉDIATE REQUISE</span>
              </div>
              <p className="text-sm opacity-90">
                Votre compte est en mode restreint. Renouvelez pour débloquer
                l'intégralité de la plateforme.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          {canClose ? (
            <Button variant="outline" onClick={onClose} className="flex-1">
              Rappeler plus tard
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={onGoToDashboard}
                className="flex-1"
              >
                <Home className="h-4 w-4 mr-2" />
                Retourner au tableau de bord
              </Button>
            </>
          )}

          <Button
            onClick={onRenew}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg text-white font-semibold py-3"
            size="lg"
          >
            <Crown className="h-5 w-5 mr-2" />
            Renouveler l'abonnement
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionExpiredModal;
