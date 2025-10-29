import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Category {
  id: string;
  name: string;
}

interface Service {
  id: string;
  libelle: string;
  description: string;
  price?: number;
  images?: string[];
  category?: Category;
}

// Catégories principales
const mainCategoryNames = [
  "art",
  "commerce",
  "peinture",
  "sculptures",
  "artisanat",
  "boutique",
  
];

const ArtCommerce: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [services, setServices] = useState<Service[]>([]);

  // Charger les services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/oeuvre");
        const data = await res.json();
        setServices(data || []);
      } catch (err) {
        console.error("Erreur de chargement des services :", err);
      }
    };
    fetchServices();
  }, []);

  // 🔹 Filtrage frontend corrigé
  const filteredServices = services.filter((item) => {
    if (!item) return false;

    const libelleMatch = item.libelle
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const descriptionMatch = item.description
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const categoryName = item.category?.name?.toLowerCase() || "";

    if (selectedCategory === "all") {
      // Affiche uniquement les services dont la catégorie est dans mainCategoryNames
      return (
        mainCategoryNames.includes(categoryName) && (libelleMatch || descriptionMatch)
      );
    } else {
      // Filtre par catégorie sélectionnée
      return (
        categoryName === selectedCategory.toLowerCase() &&
        (libelleMatch || descriptionMatch)
      );
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Section de recherche */}
      <section
        className="relative py-24 text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(30, 58, 138, 0.8)), url('https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-2xl">
            Art & Commerces
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-blue-100 font-light">
            Découvrez l'art local et les petites boutiques de La Réunion et d'ailleurs
          </p>

          {/* Barre de recherche */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher un commerce, une œuvre d'art..."
              className="w-full pl-12 pr-4 py-4 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-2xl border-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Boutons catégories */}
      <div className="flex flex-wrap gap-3 justify-center mb-8 mt-6">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-6 py-3 rounded-xl ${
            selectedCategory === "all"
              ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
              : "bg-white text-slate-700 border border-gray-200"
          }`}
        >
          Tous
        </button>

        {mainCategoryNames.map((catName) => (
          <button
            key={catName}
            onClick={() => setSelectedCategory(catName)}
            className={`px-6 py-3 rounded-xl ${
              selectedCategory.toLowerCase() === catName.toLowerCase()
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                : "bg-white text-slate-700 border border-gray-200"
            }`}
          >
            {catName.charAt(0).toUpperCase() + catName.slice(1)}
          </button>
        ))}
      </div>

      {/* Grille des services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {filteredServices.length > 0 ? (
          filteredServices.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
            >
              <div
                className="h-48 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${item.images?.[0] || ""})`,
                }}
              ></div>
              <div className="p-4 flex flex-col flex-1 justify-between">
                <h3 className="font-bold text-lg">{item.libelle}</h3>
                <p className="text-sm text-slate-600 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex justify-between mt-3">
                  <span className="font-bold">
                    {item.price ? `${item.price}€` : "—"}
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                    {item.category?.name || "—"}
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/art-commerce/${item.id}`)}
                  className="mt-3 bg-slate-900 text-white py-2 rounded-xl hover:bg-slate-800 font-semibold transition"
                >
                  Voir les détails
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 text-gray-500">
            Aucun résultat trouvé
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtCommerce;
