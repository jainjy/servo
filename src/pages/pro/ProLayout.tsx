// pages/pro/layout.tsx
import type React from "react";
import { useState, useEffect } from "react";
import { ProRoute } from "@/components/protected-route";
import { ProSidebar } from "@/components/pro/pro-sidebar";
import { AuthHeader } from "@/components/layout/AuthHeader";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import SubscriptionExpiredModal from "@/components/SubscriptionExpiredModal";
import { useNavigate } from "react-router-dom";

export default function ProLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await api.get("/auth/subscription/status");
        setSubscriptionStatus(response.data);

        // Vérifier si l'abonnement est expiré
        if (response.data?.status === "expired") {
          setShowExpiredModal(true);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'abonnement:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();

    // Vérifier périodiquement (toutes les 5 minutes)
    const interval = setInterval(checkSubscription, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);

  // Vérifier si l'utilisateur est sur une page de subscription
  const isOnSubscriptionPage =
    location.pathname.startsWith("/pro/subscription") ;

  const handleRenewSubscription = () => {
    setShowExpiredModal(false);
    navigate("/pro/subscription");
  };

  const handleGoToDashboard = () => {
    setShowExpiredModal(false);
    navigate("/pro");
  };

  const handleCloseModal = () => {
    // Ne pas permettre la fermeture si ce n'est pas une page de subscription
    if (!isOnSubscriptionPage) {
      return;
    }
    setShowExpiredModal(false);
  };

  return (
    <ProRoute>
      <div className="flex h-screen bg-background">
        <ProSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AuthHeader />
          <main className="flex-1 overflow-y-auto p-0 lg:p-6">
            <Outlet />
          </main>

          {/* Modal d'expiration d'abonnement */}
          {!loading && (
            <SubscriptionExpiredModal
              isOpen={showExpiredModal}
              onClose={handleCloseModal}
              onRenew={handleRenewSubscription}
              onGoToDashboard={handleGoToDashboard}
              canClose={isOnSubscriptionPage} // Permettre la fermeture uniquement sur les pages subscription
              showGif={true}
            />
          )}
        </div>
      </div>
    </ProRoute>
  );
}
