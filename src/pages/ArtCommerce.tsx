import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";

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
  // 1. Nouvel état pour gérer l'état de chargement
  const [loading, setLoading] = useState(true);

  // Charger les services
  useEffect(() => {
    const fetchServices = async () => {
      // Début du chargement
      setLoading(true);
      try {
        const res = await api.get("/oeuvre/all");
        const data = await res.data;
        setServices(data || []);
        // console.log(data);
      } catch (err) {
        console.error("Erreur de chargement des services :", err);
      } finally {
        // Fin du chargement, que ce soit un succès ou une erreur
        setLoading(false);
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
        mainCategoryNames.includes(categoryName) &&
        (libelleMatch || descriptionMatch)
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
    <div
      id="art_commerce"
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50"
    >
      {/* Section de recherche */}
      <section
        className="relative mt-16 py-8 text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-xl md:text-5xl font-bold mb-6 drop-shadow-2xl">
            Art & Commerces
          </h1>
          <p className="text-sm md:text-md mb-10 max-w-2xl mx-auto text-blue-100 font-light">
            Découvrez l'art local et les petites boutiques de La Réunion et
            d'ailleurs
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
              ? "bg-slate-900 text-white shadow-lg"
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
                ? "bg-slate-800 text-white shadow-lg"
                : "bg-white text-slate-700 border border-gray-200"
            }`}
          >
            {catName.charAt(0).toUpperCase() + catName.slice(1)}
          </button>
        ))}
      </div>

      {/* Grille des services */}
      <div className="flex justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 w-full max-w-6xl py-10">
          {/* 2. Affichage conditionnel : Spinner ou Contenu */}
          {loading ? (
            <div className="col-span-full">
              <LoadingSpinner text="Chargement des arts" />
            </div>
          ) : filteredServices.length > 0 ? (
            filteredServices.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 overflow-hidden"
              >
                {/* Image */}
                <div
                  className="h-52 bg-cover bg-center relative"
                  style={{
                    backgroundImage: `url(${item.images?.[0] || ""})`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                </div>

                {/* Contenu */}
                <div className="p-6 flex flex-col justify-between min-h-[190px]">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 group-hover:text-gray-900 transition">
                      {item.libelle}
                    </h3>

                    <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-800">
                      {item.price ? `${item.price}€` : "—"}
                    </span>
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {item.category?.name || "—"}
                    </span>
                  </div>

                  {/* Bouton gradient amélioré */}
                  <button
                    onClick={() => navigate(`/art-commerce/${item.id}`)}
                    className="mt-5 w-full bg-slate-900 text-white text-sm py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
                  >
                    Voir les détails
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-500">
              <p className="text-base font-medium">Aucun résultat trouvé</p>
              <p className="text-sm mt-2 text-gray-400">
                Essaie avec un autre mot-clé ou une autre catégorie.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtCommerce;
