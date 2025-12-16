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
        // console.log("Données reçues :", response.data);

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

  if (loading) return <div className="flex flex-col gap-4">
  <img src="/loading.gif" alt="" className='w-24 h-24'/>
    Chargement des données...</div>;
  if (error) return <p>{error}</p>;

//   return (
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-3 py-6">
//   {/* Carte Effectif total */}
//   {[1, 2].map((_, index) => (
//     <Card
//       key={index}
//       className="
//         relative w-full sm:w-[280px] lg:w-[320px] h-[120px]
//         bg-white/80 backdrop-blur-xl border border-gray-200/50
//         shadow-md hover:shadow-lg transition-all duration-300
//         hover:-translate-y-0.5 hover:scale-[1.01] rounded-2xl
//         flex flex-col justify-between overflow-hidden
//       "
//     >
//       <CardHeader className="px-3 pt-3 pb-2 flex justify-between items-center">
//         <CardTitle className="text-sm font-medium text-gray-700">
//           Effectif total
//         </CardTitle>
//         <div className="bg-emerald-100 p-1.5 rounded-full">
//           <CheckCircle className="h-4 w-4 text-emerald-600" />
//         </div>
//       </CardHeader>

//       <CardContent className="flex flex-col items-center justify-center px-2">
//         <h2 className="text-2xl font-normal text-emerald-600 tracking-tight">
//           {stats?.totalGlobal?.totalOeuvres ?? 0}
//         </h2>
//         <p className="text-xs text-gray-500 mt-1">
//           Services / Œuvres ajoutés
//         </p>
//       </CardContent>

//       {/* Effet lumineux */}
//       <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-200/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
//     </Card>
//   ))}

//   {/* Carte Total Prix */}
//   <Card
//     className="
//       relative w-full sm:w-[280px] lg:w-[320px] h-[120px]
//       bg-white/80 backdrop-blur-xl border border-gray-200/50
//       shadow-md hover:shadow-lg transition-all duration-300
//       hover:-translate-y-0.5 hover:scale-[1.01] rounded-2xl
//       flex flex-col justify-between overflow-hidden
//     "
//   >
//     <CardHeader className="px-3 pt-3 pb-2 flex justify-between items-center">
//       <CardTitle className="text-sm font-medium text-gray-700">
//         Total des Prix
//       </CardTitle>
//       <div className="bg-amber-100 p-1.5 rounded-full">
//         <Euro className="h-4 w-4 text-amber-500" />
//       </div>
//     </CardHeader>

//     <CardContent className="flex-grow flex items-center justify-center px-2">
//       <h2 className="text-2xl font-normal text-gray-800 tracking-tight">
//         {stats?.totalGlobal?.totalPrix?.toLocaleString("fr-FR", {
//           style: "currency",
//           currency: "EUR",
//         }) ?? "0 €"}
//       </h2>
//     </CardContent>

//     <div className="px-3 pb-3 pt-1 border-t border-gray-100/50">
//       <p className="text-xs text-gray-400 font-light">
//         Somme totale enregistrée à ce jour (Total Global)
//       </p>
//     </div>

//     {/* Effet lumineux */}
//     <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-200/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
//   </Card>
// </div>


  


  //);
}
