import React from "react";
import { useNavigate } from "react-router-dom";

interface TourismButton {
  id: number;
  title: string;
  path: string;
}

interface TourismNavigationProps {
  page?: string;
}

const TourismNavigation: React.FC<TourismNavigationProps> = ({
  page = "decouvrir",
}) => {
  const navigate = useNavigate();

  const DecouvrirButtons: TourismButton[] = [
    { id: 1, title: "Activités & loisirs", path: "/activiteLoisirs" },
    {
      id: 2,
      title: "Lieux historiques & culturels",
      path: "/lieux_historique",
    },
    { id: 3, title: "Événements & découvertes", path: "/evenement-decouverte" },
    { id: 4, title: "Nature & patrimoine", path: "/nature-patrimoine" },
  ];

  const SejournerButtons: TourismButton[] = [
    { id: 5, title: "Hébergements", path: "/tourisme" },
    { id: 6, title: "Voyages & billets", path: "/voyages" },
    { id: 7, title: "Transports & locations", path: "/location-voiture" },
    { id: 8, title: "Séjours & expériences", path: "/sejour-experience" },
  ];

  // Déterminer quelles sections afficher basé sur 'page'
  const showDecouvrir = !page || page === "decouvrir";
  const showSejourner = !page || page === "sejour";

  const filterButtons = (buttons: TourismButton[]) => {
    return buttons;
  };

  return (
    <div className="py-4 px-4" style={{ backgroundColor: "transparent" }}>
      <div className="max-w-6xl mx-auto">
        {/* Section Découvrir & Sortir */}
        {showDecouvrir && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-3">
              {filterButtons(DecouvrirButtons).map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => navigate(btn.path)}
                  className={`
                    px-6 py-2 
                    rounded-full 
                    bg-logo
                    text-sm font-medium text-white
                    transition
                    hover:border-[#556B2F]/50    
                    hover:text-white
                    hover:bg-logo/50   
                  `}
                >
                  {btn.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Section Séjourner & Voyager */}
        {showSejourner && (
          <div>

            <div className="flex flex-wrap gap-3">
              {filterButtons(SejournerButtons).map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => navigate(btn.path)}
                  className={`
                    px-6 py-2 
                    rounded-full 
                    bg-logo
                    text-sm font-medium text-white
                    transition
                    hover:border-[#556B2F]/50    
                    hover:text-white
                    hover:bg-logo/50   
                  `}
                >
                  {btn.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourismNavigation;
