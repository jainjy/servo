import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import axios from "axios";

interface Stats {
  activeServicesCount: number;
  userMetiersCount: number;
  availableServicesCount: number;
  demandesCount: number;
}

export function ArtProfessionalServicesStats() {
  const [stats, setStats] = useState<Stats>({
    activeServicesCount: 0,
    userMetiersCount: 0,
    availableServicesCount: 0,
    demandesCount: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:3001/stats", { // modifié pour /stats
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("Données reçues :", response.data);
        setStats(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des stats :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Chargement des données...</p>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      
      {/* Effectif Services */}
      <Card className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <CardHeader className="flex justify-between pb-2">
          <CardTitle className="text-sm font-semibold text-gray-700">Effectif Services</CardTitle>
          <Badge className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
            <CheckCircle className="h-3 w-3" />✓
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-800">{stats.activeServicesCount}</div>
          <p className="text-xs text-gray-400 mt-1">Services créés ou actifs</p>
        </CardContent>
      </Card>

      {/* Métiers */}
      <Card className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <CardHeader className="flex justify-between pb-2">
          <CardTitle className="text-sm font-semibold text-gray-700">Prices</CardTitle>
          <Badge className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">👔</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-800">{stats.userMetiersCount}</div>
     
        </CardContent>
      </Card>

      {/* Services Disponibles */}
  

    </div>
  );
}
