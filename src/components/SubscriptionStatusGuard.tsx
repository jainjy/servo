// components/SubscriptionStatusGuard.tsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import SubscriptionExpiredModal from "@/components/SubscriptionExpiredModal";

export const SubscriptionStatusGuard = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState(null);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await api.get("/auth/subscription/status");
        const data = response.data;
        setSubscriptionData(data);

        // Vérifier si l'abonnement est expiré
        if (data?.status === "expired") {
          // Afficher le modal seulement si l'utilisateur n'est pas sur /pro
          const isDashboard = location.pathname === "/pro";
          if (!isDashboard) {
            setShowExpiredModal(true);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'abonnement:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSubscriptionStatus();
  }, [user, location.pathname, navigate]);

  const handleRenew = () => {
    setShowExpiredModal(false);
    navigate("/pro/subscription");
  };

  const handleGoToDashboard = () => {
    setShowExpiredModal(false);
    navigate("/pro");
  };

  const handleCloseModal = () => {
    setShowExpiredModal(false);
  };

  // Afficher le modal d'expiration
  const shouldShowModal =
    showExpiredModal && subscriptionData?.status === "expired";

  return (
    <>
      {children}

      {!loading && shouldShowModal && (
        <SubscriptionExpiredModal
          isOpen={showExpiredModal}
          onClose={handleCloseModal}
          onRenew={handleRenew}
          onGoToDashboard={handleGoToDashboard}
          canClose={false}
          showGif={true}
        />
      )}
    </>
  );
};
