import React from "react";
import { useNavigate } from "react-router-dom";

interface TourismButton {
  id: number;
  title: string;
  path: string;
}

const TourismNavigation: React.FC = () => {
  const navigate = useNavigate();

  const tourismButtons: TourismButton[] = [
    { id: 1, title: "Hôtels & Gîtes", path: "/tourisme" },
    { id: 2, title: "Activités & Loisirs", path: "/activiteLoisirs" },
    { id: 3, title: "Lieux Touristiques", path: "/lieux_historique" },
    { id: 4, title: "Voyages Aériens", path: "/voyages" },
  ];

  return (
    <div className="py-2 px-4" style={{ backgroundColor: "transparent" }}>
      <div className="max-w-4xl mx-auto">
        {/* Tabs */}
        <div className="flex flex-wrap gap-3 justify-center">
          {tourismButtons.map((btn) => (
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
    </div>
  );
};

export default TourismNavigation;
