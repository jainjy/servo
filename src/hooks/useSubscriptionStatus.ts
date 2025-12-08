// hooks/useSubscriptionStatus.ts
import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import api from "@/lib/api";

export const useSubscriptionStatus = () => {
  const { user, isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!isAuthenticated || user?.role !== "professional") {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/subscription/status");
        const data = response.data;
        setSubscription(data);
        setIsExpired(data?.status === "expired");
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();

    // Vérifier périodiquement (toutes les 5 minutes)
    const interval = setInterval(fetchSubscription, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  const refetch = async () => {
    setLoading(true);
    try {
      const response = await api.get("/auth/subscription/status");
      const data = response.data;
      setSubscription(data);
      setIsExpired(data?.status === "expired");
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    subscription,
    loading,
    isExpired,
    refetch,
    hasActiveSubscription: subscription?.status === "active",
    daysRemaining: subscription?.endDate
      ? Math.ceil(
          (new Date(subscription.endDate).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0,
  };
};
