import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, Star, Clock, Wrench, FileText, User, Phone, Mail, Home, Calendar, Loader2, X } from "lucide-react";
import PartnersPage from "./ServicesPartnersPage/PartnersPage";
import ServicesPage from "./ServicesPartnersPage/ServicesPages";
import AidesPage from "./ServicesPartnersPage/AidesPage";

// Composant Modal pour afficher les détails des services avec devis

const ServicesPartnersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const section = params.get("section");

  const [view, setView] = useState("default");


  // Fonction utilitaire pour parser les données API
  const parseApiData = (data: any, defaultKey: string): any[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data[defaultKey] && Array.isArray(data[defaultKey])) return data[defaultKey];
    if (data.data && Array.isArray(data.data)) return data.data;
    if (data.items && Array.isArray(data.items)) return data.items;
    if (data.results && Array.isArray(data.results)) return data.results;
    return [data];
  };

 
  // Gestion de la section URL
  useEffect(() => {
    if (section) {
      if (section === "partenaires") setView("partenaires");
      if (section === "prestations") setView("services");
      if (section === "aides") setView("aides");
    } else {
      setView("default");
    }
  }, [section]);

  // Composant pour afficher seulement les services dans la vue "default"
  

  // Header titles
  const renderHeaderTitles = () => {
    return (
      <div className="text-center py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl lg:text-4xl md:text-5xl font-bold mb-2 lg:mb-6 text-gray-900">
            {view === "partenaires" ? "Nos Partenaires" :
             view === "services" ? "Demandes de Prestations" : "Aides"}
          </h1>
          <p className="text-lg text-gray-600">
            {view === "partenaires" ? "Trouvez les meilleurs experts pour votre projet" :
             view === "services" ? "Soumettez vos demandes de services" : "Obtenez de l'aide et des conseils"}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased mt-15">
      <header
        className="relative pt-12 px-8 pb-8 border-b border-gray-200 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6 relative z-10">
          <div className="flex flex-col gap-2">{renderHeaderTitles()}</div>

          <div className="flex flex-wrap gap-4 justify-center">
            
            <button
              className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all duration-300 ${
                view === "partenaires" ? "border-blue-500 bg-blue-500 text-white shadow-lg" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-md"
              } text-sm font-semibold transform hover:scale-105`}
              onClick={() => navigate('/services-partners?section=partenaires')}
            >
              PRÉSENTATION PARTENAIRES
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <button
              className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all duration-300 ${
                view === "services" ? "border-blue-500 bg-blue-500 text-white shadow-lg" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-md"
              } text-sm font-semibold transform hover:scale-105`}
              onClick={() => navigate('/services-partners?section=prestations')}
            >
              DEMANDES DE PRESTATIONS
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <button
              className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all duration-300 ${
                view === "aides" ? "border-blue-500 bg-blue-500 text-white shadow-lg" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-md"
              } text-sm font-semibold transform hover:scale-105`}
              onClick={() => navigate('/services-partners?section=aides')}
            >
              AIDES
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-8 pb-20 relative z-10">
        {view === "partenaires" && <PartnersPage />}
        {view === "services" && <ServicesPage />}
        {view === "aides" && <AidesPage />}
      </main>
    </div>
  );
};

export default ServicesPartnersPage