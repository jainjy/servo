// src/hooks/useFinancementStats.ts
import { useState, useEffect } from "react";
import { financementAPI } from "@/lib/api";

export function useFinancementStats() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await financementAPI.getAllDemandes();
        const demandes = response.data.demandes || [];

        setStats({
          total: demandes.length,
          pending: demandes.filter((d) => d.status === "pending").length,
          processing: demandes.filter((d) => d.status === "processing").length,
          approved: demandes.filter((d) => d.status === "approved").length,
          rejected: demandes.filter((d) => d.status === "rejected").length,
        });
      } catch (error) {
        console.error("Erreur lors du chargement des stats:", error);
      }
    };

    fetchStats();
  }, []);

  return stats;
}
