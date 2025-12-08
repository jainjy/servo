import React from "react";
import { useNavigate } from "react-router-dom";
import { Hotel, Mountain, Castle, Plane } from "lucide-react";

interface TourismButton {
  id: number;
  title: string;
  description: string;
  path: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  image: string;
}

const TourismNavigation: React.FC = () => {
  const navigate = useNavigate();

  const tourismButtons: TourismButton[] = [
    {
      id: 1,
      title: "Hôtels & Gîtes",
      description: "Réservez votre hébergement",
      path: "/tourisme",
      icon: Hotel,
      color: "text-blue-600",
      gradient: "from-blue-500 to-cyan-400",
      image:
        "https://i.pinimg.com/1200x/31/cf/76/31cf76206178401a11c24710c63e7c43.jpg",
    },
    {
      id: 2,
      title: "Activités & Loisirs",
      description: "Découvertes & aventures",
      path: "/activiteLoisirs",
      icon: Mountain,
      color: "text-green-600",
      gradient: "from-green-500 to-emerald-400",
      image:
        "https://i.pinimg.com/736x/62/9d/2e/629d2e7b375223b81bcfa104e1f40c43.jpg",
    },
    {
      id: 3,
      title: "Lieux Touristiques",
      description: "Explorez le patrimoine",
      path: "/lieux_historique",
      icon: Castle,
      color: "text-purple-600",
      gradient: "from-purple-500 to-pink-400",
      image:
        "https://i.pinimg.com/1200x/91/01/6a/91016ac95b54c8a72d47945497fc1ddc.jpg",
    },
    {
      id: 4,
      title: "Voyages Aériens",
      description: "Réservez vos vols",
      path: "/voyages",
      icon: Plane,
      color: "text-orange-600",
      gradient: "from-orange-500 to-amber-400",
      image:
        "https://i.pinimg.com/736x/d9/23/b0/d923b0be1d7ff9ca3e729cf83a4e3a60.jpg",
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="py-8 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Titre et description */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explorer le Tourisme
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez nos services touristiques complets pour votre prochain
            voyage
          </p>
        </div>

        {/* Grille des boutons de navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {tourismButtons.map((button) => {
            const Icon = button.icon;
            return (
              <div
                key={button.id}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                onClick={() => handleNavigation(button.path)}
              >
                {/* Image de fond avec overlay */}
                <div className="absolute inset-0 z-0">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${button.image})` }}
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${button.gradient} opacity-90`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Contenu */}
                <div className="relative z-10 h-64 flex flex-col justify-end p-6">
                  {/* Icône */}
                  <div className="mb-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className={`w-7 h-7 ${button.color}`} />
                    </div>
                  </div>

                  {/* Texte */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {button.title}
                    </h3>
                    <p className="text-white/90 text-sm mb-4">
                      {button.description}
                    </p>
                  </div>

                  {/* Bouton d'action */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="inline-flex items-center text-white font-medium text-sm">
                      <span className="mr-2">Découvrir</span>
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Effet de surbrillance */}
                <div className="absolute inset-0 border-2 border-white/20 rounded-2xl group-hover:border-white/40 transition-all duration-300" />
              </div>
            );
          })}
        </div>

        {/* Note informative */}
        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm">
            Cliquez sur une catégorie pour explorer nos services touristiques
          </p>
        </div>
      </div>
    </div>
  );
};

export default TourismNavigation;
