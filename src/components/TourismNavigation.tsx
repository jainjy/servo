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
              style={{
                borderColor: "#D3D3D3", // Light gray
                color: "#8B4513", // Saddle brown
              }}
              className={`
                px-6 py-2 
                rounded-full 
                border 
                bg-white/50
                text-sm font-medium
                transition
                hover:border-[#556B2F]     /* olive */
                hover:text-[#556B2F]
                hover:bg-[#6B8E23]/10      /* yellow-green (light bg) */
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
