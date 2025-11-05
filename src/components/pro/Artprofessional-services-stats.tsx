import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, DollarSign, Euro } from "lucide-react";
import axios from "axios";
import { api } from "@/lib/axios";

interface Stats {
  totalGlobal: {
    totalOeuvres: number;
    totalPrix: number;
  };
}

export function ArtProfessionalServicesStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {

        const response = await api.get("/oeuvre/stats");
        console.log("Données reçues :", response.data);

        // Vérification que totalGlobal existe
        if (!response.data?.totalGlobal) {
          setError("Statistiques mal formatées");
          setStats(null);
        } else {
          setStats(response.data);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des stats :", err);
        setError("Impossible de récupérer les statistiques.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Chargement des données...</p>;
  if (error) return <p>{error}</p>;

  return (
<div className="flex flex-col sm:flex-row justify-center gap-6 mt-6 p-4">
  {/* Carte Effectif */}
  <Card
    className="
      w-full sm:w-[450px] lg:w-[500px] h-[160px] mb-4 sm:mb-0
      bg-white rounded-xl shadow-lg border border-gray-100 
      transition-all duration-300 hover:shadow-xl hover:scale-[1.01]
    "
  >
    <CardHeader className="p-5">
      <div className="flex justify-between items-start">
        <CardTitle className="text-sm font-medium text-gray-700 tracking-wide">
          Effectif
        </CardTitle>
        <CheckCircle className="h-6 w-6 text-emerald-500 opacity-80" />
      </div>
    </CardHeader>
    <CardContent className="flex flex-col items-center justify-center pt-2 pb-5">
      <div className="text-4xl font-bold text-emerald-600 tracking-tight">
        {stats?.totalGlobal?.totalOeuvres ?? 0}
      </div>
      <p className="text-sm font-light text-gray-500 mt-2">
        Services / Œuvres ajoutés
      </p>
    </CardContent>
  </Card>

  {/* Carte Total Prix */}
  <Card
    className="
      w-full sm:w-[450px] lg:w-[500px] h-[160px]
      bg-white rounded-xl shadow-lg border border-gray-100
      transition-all duration-300 hover:shadow-xl hover:scale-[1.01]
    "
  >
    <CardHeader className="p-5">
      <div className="flex justify-between items-start">
        <CardTitle className="text-sm font-medium text-gray-700 tracking-wide">
          Total Prix
        </CardTitle>
        {/* CORRECTION : Remplacement de DollarSign par Euro */}
        <Euro className="h-6 w-6 text-orange-500 opacity-80" /> 
      </div>
    </CardHeader>
    <CardContent className="flex flex-col items-center justify-center pt-2 pb-5">
      <div className="text-4xl font-bold text-orange-600 tracking-tight">
        {stats?.totalGlobal?.totalPrix?.toLocaleString("fr-FR", {
          style: "currency",
          currency: "EUR",
        }) ?? "0 EUR"}
      </div>
      <p className="text-sm font-light text-gray-500 mt-2">
        Total des prix
      </p>
    </CardContent>
  </Card>
</div>



  );
}
