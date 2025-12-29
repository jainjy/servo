import React from "react";
import { Calendar, MapPin, Users, Star, DollarSign, Eye, TrendingUp } from "lucide-react";
import { Stats, ActiveTab } from "../types";

interface StatsCardsProps {
  stats: Stats | undefined; // Ajout de undefined pour la sécurité
  activeTab: ActiveTab;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, activeTab }) => {
  // Validation des données
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Carte Événements */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Événements</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stats.totalEvents ?? 0}
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <Calendar className="text-blue-600" size={24} />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 text-sm">
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              (stats.upcomingEvents ?? 0) > 0
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {stats.upcomingEvents ?? 0} à venir
          </div>
          <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {stats.activeEvents ?? 0} actifs
          </div>
        </div>
      </div>

      {/* Carte Découvertes */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Découvertes</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stats.totalDiscoveries ?? 0}
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <MapPin className="text-green-600" size={24} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={`${
                    i < Math.floor(stats.avgRating ?? 0)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {(stats.avgRating ?? 0).toFixed(1)}/5
            </span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {stats.totalVisits ?? 0} visites
          </div>
        </div>
      </div>

      {/* Carte Revenu */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Revenu total</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {(stats.totalRevenue ?? 0).toLocaleString("fr-FR")}€
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <DollarSign className="text-purple-600" size={24} />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm">
          <TrendingUp size={16} className="text-green-600" />
          <span className="text-green-600 font-medium">+12.5%</span>
          <span className="text-gray-500">ce mois</span>
        </div>
      </div>

      {/* Carte Participants/Visites */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">
              {activeTab === "events" ? "Participants" : "Visites"}
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {activeTab === "events" 
                ? (stats.totalParticipants ?? 0)
                : (stats.totalVisits ?? 0)}
            </p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            {activeTab === "events" ? (
              <Users className="text-orange-600" size={24} />
            ) : (
              <Eye className="text-orange-600" size={24} />
            )}
          </div>
        </div>
        <div className="mt-3">
          {activeTab === "events" ? (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Taux de remplissage</span>
                <span className="font-medium text-gray-900">
                  {(stats.conversionRate ?? 0).toFixed(1)}%
                </span>
              </div>
              <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#6B8E23] rounded-full"
                  style={{ width: `${stats.conversionRate ?? 0}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Catégorie populaire</span>
                <span className="font-medium text-gray-900 capitalize">
                  {stats.popularCategory || "Aucune"}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCards;