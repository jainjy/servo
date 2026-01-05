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

  const MangerButtons: TourismButton[] = [
    { id: 9, title: "Restaurants & snacks", path: "/alimentation" },
    { id: 10, title: "Produits locaux", path: "/produits-naturels" },
    { id: 11, title: "Marchés & artisans", path: "/explorer-vivre" },
    { id: 12, title: "Bien-être & alimentation", path: "/bien-etre-alimentation" },
  ];

  const MaisonButtons: TourismButton[] = [
    { id: 13, title: "Produits & équipements", path: "/domicile" },
    { id: 14, title: "Maison & jardin", path: "/service-maison" },
    { id: 15, title: "Services à domicile", path: "/utilities" },
    { id: 16, title: "Dépannage & entretien", path: "/depannage-entretien" },
  ];

  const ArtButtons: TourismButton[] = [
    { id: 17, title: "Artistes & créateurs", path: "/artistes-createurs" },
    { id: 18, title: "Galeries & expositions", path: "/galerie-exposition" },
    { id: 19, title: "Photographie", path: "/photographie" },
    { id: 20, title: "Vidéo & création visuelle", path: "/video-creation-visuelle" },
    { id: 21, title: "Peinture & illustration", path: "/peinture" },
    { id: 22, title: "Sculpture", path: "/sculpture" },
    { id: 23, title: "Œuvres & créations locales", path: "/oeuvre-creation-locales" },
  ];

  const InspirerButtons: TourismButton[] = [
    { id: 24, title: "Podcasts", path: "/podcasts/reunion" },
    // { id: 25, title: "Vidéos", path: "/videos-inspirer-eveiller" },
    { id: 26, title: "Portraits locaux", path: "/portraits-locaux" },
    { id: 27, title: "Bons plans & conseils", path: "/bon-plan-conseil" },
    { id: 28, title: "entrepreneuriat", path: "/entrepreneuriat" },
  ];

  // Déterminer quelles sections afficher basé sur 'page'
  const showDecouvrir = !page || page === "decouvrir" || page === "explorer";
  const showSejourner = !page || page === "sejour" || page === "explorer";
  const showManger = !page || page === "manger" || page === "explorer";
  const showMaison = !page || page === "maison" || page === "explorer";
  const showArt = !page || page === "art" || page === "explorer";
  const showInspirer = !page || page === "inspirer" || page === "explorer";

  const filterButtons = (buttons: TourismButton[]) => {
    return buttons;
  };

  const renderSection = (buttons: TourismButton[]) => (
    <div className="mb-6">
      <div className="flex flex-wrap gap-3">
        {filterButtons(buttons).map((btn) => (
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
  );

  return (
    <div className="py-4 px-4" style={{ backgroundColor: "transparent" }}>
      <div className="max-w-6xl mx-auto">
        {/* Section Découvrir & Sortir */}
        {showDecouvrir && renderSection( DecouvrirButtons)}

        {/* Section Séjourner & Voyager */}
        {showSejourner && renderSection( SejournerButtons)}

        {/* Section Manger & Consommer */}
        {showManger && renderSection( MangerButtons)}

        {/* Section Maison & Quotidien */}
        {showMaison && renderSection( MaisonButtons)}

        {/* Section Art & Création */}
        {showArt && renderSection( ArtButtons)}

        {/* Section Inspirer & Éveiller */}
        {showInspirer && renderSection( InspirerButtons)}
      </div>
    </div>
  );
};

export default TourismNavigation;
