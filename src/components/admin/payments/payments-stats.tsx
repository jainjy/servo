import { Card } from "@/components/ui/card";
import { CreditCard, TrendingUp, AlertCircle, CheckCircle, ArrowUp, ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/api";

interface StatsData {
  totalVolume: string;
  transactionsCount: string;
  successRate: string;
  pendingCount: string;
  volumeTrend?: number;
  transactionsTrend?: number;
}

export function PaymentsStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get("/admin/payments/stats");
        setStats(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement des statistiques:", err);
        setError("Impossible de charger les statistiques");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const colorTheme = {
    logo: "#556B2F",
    primaryDark: "#6B8E23",
    lightBg: "#FFFFFF",
    separator: "#D3D3D3",
    secondaryText: "#8B4513",
  };

  const statsConfig = [
    {
      label: "Volume Total (30j)",
      value: stats?.totalVolume || "€0",
      icon: CreditCard,
      color: "blue",
      trend: stats?.volumeTrend || 0,
    },
    {
      label: "Transactions",
      value: stats?.transactionsCount || "0",
      icon: TrendingUp,
      color: "green",
      trend: stats?.transactionsTrend || 0,
    },
    {
      label: "Taux de Réussite",
      value: stats?.successRate || "0%",
      icon: CheckCircle,
      color: "emerald",
    },
    {
      label: "En Attente",
      value: stats?.pendingCount || "0",
      icon: AlertCircle,
      color: "orange",
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string; accent: string }> = {
      green: {
        bg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
        text: "text-emerald-600",
        accent: "bg-emerald-50 text-emerald-700 border-emerald-200",
      },
      blue: {
        bg: "bg-gradient-to-br from-blue-500 to-blue-600",
        text: "text-blue-600",
        accent: "bg-blue-50 text-blue-700 border-blue-200",
      },
      emerald: {
        bg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
        text: "text-emerald-600",
        accent: "bg-emerald-50 text-emerald-700 border-emerald-200",
      },
      orange: {
        bg: "bg-gradient-to-br from-orange-500 to-orange-600",
        text: "text-orange-600",
        accent: "bg-orange-50 text-orange-700 border-orange-200",
      },
    };
    return colorMap[color] || colorMap.green;
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card 
            key={index} 
            className="p-6 border border-gray-100 bg-white rounded-xl shadow-sm"
          >
            <div className="animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                <div className="h-4 w-12 bg-gray-200 rounded"></div>
              </div>
              <div className="mt-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border border-gray-100 bg-white rounded-xl shadow-sm">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" style={{ color: colorTheme.logo }} />
          <p className="text-gray-600">{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((stat) => {
        const colors = getColorClasses(stat.color);
        const trend = stat.trend || 0;
        
        return (
          <Card 
            key={stat.label} 
            className="p-6 border border-gray-100 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 group"
          >
            {/* Effet de bordure élégant */}
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl" style={{ 
              background: `linear-gradient(90deg, ${colorTheme.primaryDark}, ${colorTheme.logo})`,
              opacity: 0.7 
            }}></div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="p-2.5 rounded-lg transition-transform group-hover:scale-110 duration-300"
                  style={{ backgroundColor: `${colorTheme.logo}15` }}
                >
                  <stat.icon className="h-4 w-4" style={{ color: colorTheme.logo }} />
                </div>
              </div>
              {trend !== undefined && trend !== 0 && (
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${trend > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  {trend > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {Math.abs(trend)}%
                </div>
              )}
            </div>
            <div className="mt-5">
              <div className="text-2xl font-bold" style={{ color: colorTheme.secondaryText }}>
                {stat.value}
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-gray-500">{stat.label}</p>
                {stat.trend !== undefined && stat.trend !== 0 && (
                  <span className={`text-xs ${stat.trend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {stat.trend > 0 ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}