import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";

interface Stats {
  totalServices: number;
  totalCategories: number;
  totalMetiers: number;
  servicesByCategory: Array<{
    category: string;
    count: number;
  }>;
}

export function ServicesStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/services/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card 
            key={i} 
            className="border-l-4 border-l-transparent"
            style={{ 
              backgroundColor: '#FFFFFF0',
              borderColor: '#D3D3D3'
            }}
          >
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div 
                  className="h-4 rounded w-3/4 mb-2"
                  style={{ backgroundColor: '#D3D3D3' }}
                ></div>
                <div 
                  className="h-6 rounded w-1/2"
                  style={{ backgroundColor: '#D3D3D3' }}
                ></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }
  
  function setShowAddArtworkModal(arg0: boolean): void {
    throw new Error("Function not implemented.");
  }

  const statsData = [
    {
      title: "Services",
      value: stats.totalServices,
      description: "Services disponibles",
      color: "border-l-[#556B2F]"
    },
    {
      title: "Catégories",
      value: stats.totalCategories,
      description: "Catégories actives",
      color: "border-l-[#6B8E23]"
    },
    {
      title: "Métiers",
      value: stats.totalMetiers,
      description: "Métiers associés",
      color: "border-l-[#8B4513]"
    },
    {
      title: "Top Catégorie",
      value: stats.servicesByCategory[0]?.count || 0,
      description: stats.servicesByCategory[0]?.category || "Aucune",
      color: "border-l-[#556B2F]"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <Card 
          key={index} 
          className={`border-l-4 hover:shadow-lg transition-shadow ${stat.color}`}
          style={{ 
            backgroundColor: '#FFFFFF0',
            borderColor: '#D3D3D3'
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle 
              className="text-sm font-medium"
              style={{ color: '#556B2F' }}
            >
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="text-2xl font-bold"
              style={{ color: '#556B2F' }}
            >
              {stat.value}
            </div>
            <p className="text-xs text-gray-800">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}