// components/OfflineFallback.tsx
import React from "react";
import { WifiOff, Home, RefreshCw, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const OfflineFallback: React.FC = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  const availableFeatures = [
    {
      icon: BookOpen,
      title: "Articles sauvegardés",
      desc: "Lisez les articles mis en cache",
    },
    {
      icon: Home,
      title: "Navigation basique",
      desc: "Accédez aux pages visitées récemment",
    },
    {
      icon: RefreshCw,
      title: "Réessayer",
      desc: "Tentez de rétablir la connexion",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <WifiOff className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Connexion perdue
          </h1>
          <p className="text-gray-600 mb-6">
            Il semble que vous soyez hors ligne. Vérifiez votre connexion
            Internet.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {availableFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            >
              <feature.icon className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
            Réessayer la connexion
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            <Home className="h-5 w-5" />
            Retour à l'accueil
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Astuce : Activez le Wi-Fi ou les données mobiles, puis réessayez.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfflineFallback;
