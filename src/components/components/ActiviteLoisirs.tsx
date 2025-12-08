import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Mountain,
  Compass,
  Moon,
  Waves,
  Tent,
  Star,
  Search,
} from "lucide-react";
import { api } from "@/lib/axios";
import TourismNavigation from "../TourismNavigation";

interface ActivityCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  image: string;
  stats?: {
    participants: string;
    duration: string;
    level: string;
  };
  features?: string[];
  highlight?: string;
}

// Couleurs du Thème
const THEME_COLORS = {
  logo: "#556B2F" /* logo / accent - Olive green */,
  "primary-dark": "#6B8E23" /* Sruvol / fonds légers - Yellow-green */,
  "light-bg": "#FFFFFF" /* fond de page / bloc texte - White */,
  separator: "#D3D3D3" /* séparateurs / bordures, UI - Light gray */,
  "secondary-text":
    "#8B4513" /* touche premium / titres secondaires - Saddle brown */,
};

const iconMap: Record<string, JSX.Element> = {
  Mountain: <Mountain className="w-5 h-5" />,
  Compass: <Compass className="w-5 h-5" />,
  Moon: <Moon className="w-5 h-5" />,
  Waves: <Waves className="w-5 h-5" />,
  Tent: <Tent className="w-5 h-5" />,
};

const ActivitesLoisirsFAQ: React.FC = () => {
  const [categories, setCategories] = useState<ActivityCategory[]>([]);
  const [filtered, setFiltered] = useState<ActivityCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get("/ActivityCategory");
        setCategories(res.data.data);
        setFiltered(res.data.data);
      } catch (err) {
        console.error("❌ Erreur :", err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const results = categories.filter((item) => {
      const matchText =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory =
        activeCategory === "all" ? true : item.name === activeCategory;
      return matchText && matchCategory;
    });
    setFiltered(results);
  }, [searchTerm, activeCategory, categories]);

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const getCategoryCount = (name: string) => {
    if (name === "all") return categories.length;
    return categories.filter((c) => c.name === name).length;
  };

  // Couleurs de dégradé par défaut (si cat.color n'est pas défini)
  const defaultGradient = `from-[${THEME_COLORS["primary-dark"]}] to-[${THEME_COLORS.logo}]`;
  // Couleur d'accent principale
  const accentColor = THEME_COLORS.logo;
  // Couleur d'accent secondaire (texte premium/titre)
  const secondaryAccentColor = THEME_COLORS["secondary-text"];
  // Couleur d'arrière-plan clair
  const lightBg = THEME_COLORS["light-bg"];
  // Couleur de bordure/séparateur
  const separatorColor = THEME_COLORS.separator;

  return (
    // Utilisation de la couleur de fond claire du thème
    <div className={`min-h-screen bg-[${lightBg}] text-gray-900`}>
      {/* HERO */}
      {/* Utilisation des couleurs du thème pour le dégradé de fond */}
      <div
        className={`relative py-24 md:py-32 bg-gradient-to-r from-[${THEME_COLORS["primary-dark"]}]/80 to-[${accentColor}]/80 overflow-hidden`}
      >
        {/* Navigation en premier plan avec z-index élevé */}
        <div className="relative z-50 px-4 max-w-7xl mx-auto pt-4">
          <TourismNavigation />
        </div>

        {/* Image de fond et overlay */}
        <img
          src="https://i.pinimg.com/736x/fa/05/b9/fa05b9dba51cec6eb5e7441b75d0c153.jpg"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          alt="Hero"
        />
        {/* Utilisation des couleurs du thème pour l'overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-r from-[${THEME_COLORS["primary-dark"]}]/40 to-[${accentColor}]/40`}
        ></div>

        {/* Contenu principal */}
        <div className="relative text-center px-4 pt-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg tracking-wide">
            Activités & Loisirs
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Découvrez nos expériences touristiques immersives et aventures
            nature.
          </p>
        </div>
      </div>
      {/* SEARCH BAR */}
      <div className="max-w-3xl mx-auto px-4 -mt-10 mb-14">
        <div
          className={`relative bg-white/95 backdrop-blur-md shadow-md rounded-3xl p-4 border border-[${separatorColor}] transition-all hover:shadow-lg`}
        >
          {/* Utilisation de la couleur d'accent pour l'icône */}
          <Search
            className={`absolute left-5 top-5 w-6 h-6 text-[${accentColor}]`}
          />
          <input
            type="text"
            placeholder="Rechercher une activité..."
            // Utilisation de la couleur d'accent pour le focus
            className={`w-full pl-14 pr-4 py-3 text-lg rounded-2xl outline-none focus:ring-2 focus:ring-[${accentColor}] transition`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {/* CATEGORY FILTERS */}
      <div className="flex flex-wrap justify-center gap-3 px-4 mb-16">
        <button
          onClick={() => setActiveCategory("all")}
          className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold text-sm transition-all shadow-sm border
            ${
              activeCategory === "all"
                ? // Utilisation du dégradé du thème pour l'état actif
                  `bg-gradient-to-r ${defaultGradient} text-white border-transparent shadow-lg`
                : // Utilisation de la couleur de bordure du thème pour l'état inactif
                  `bg-white text-gray-700 border-[${separatorColor}] hover:bg-gray-100`
            } hover:scale-105`}
        >
          <Compass className="w-5 h-5" />
          Toutes
          <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
            {categories.length}
          </span>
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.name)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium text-sm transition-all shadow-sm border
              ${
                activeCategory === cat.name
                  ? // Si cat.color est défini, on l'utilise, sinon le dégradé du thème
                    `bg-gradient-to-r ${
                      cat.color || defaultGradient
                    } text-white border-transparent shadow-lg`
                  : `bg-white text-gray-700 border-[${separatorColor}] hover:bg-gray-100`
              } hover:scale-105`}
          >
            {iconMap[cat.icon] ?? <Star className="w-5 h-5" />}
            {cat.name}
            <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
              {getCategoryCount(cat.name)}
            </span>
          </button>
        ))}
      </div>
      {/* LIST */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        {filtered.length === 0 && (
          <div className="text-center py-24">
            {/* Utilisation de la couleur d'accent pour l'icône */}
            <Search
              className={`mx-auto w-16 h-16 text-[${accentColor}] mb-4`}
            />
            <p className="text-xl font-bold text-gray-700">
              Aucune activité trouvée
            </p>
            <p className="text-gray-500">Essayez un autre mot-clé.</p>
          </div>
        )}

        <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {filtered.map((faq) => (
            <div
              key={faq.id}
              // Utilisation de la couleur de bordure du thème
              className={`bg-white rounded-2xl shadow-md border border-[${separatorColor}] overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl`}
            >
              <div className="relative">
                <img
                  src={faq.image}
                  className="w-full h-64 object-cover"
                  alt={faq.name}
                />
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-md text-white rounded-lg text-sm flex items-center gap-2">
                  {iconMap[faq.icon] ?? <Star className="w-4 h-4" />} {faq.name}
                </div>
              </div>

              <div className="p-5">
                {faq.highlight && (
                  // Utilisation de la couleur secondary-text pour les faits saillants
                  <p
                    className={`text-sm text-[${secondaryAccentColor}] font-semibold mb-2`}
                  >
                    {faq.highlight}
                  </p>
                )}

                {faq.stats && (
                  <div className="flex flex-wrap gap-3 text-sm text-gray-700 mb-4">
                    <span>👥 {faq.stats.participants}</span>
                    <span>⏱ {faq.stats.duration}</span>
                    <span>⭐ {faq.stats.level}</span>
                  </div>
                )}

                {openFAQ === faq.id && (
                  <div className="mb-4 transition-all duration-300">
                    <p className="text-gray-700 mb-3">{faq.description}</p>

                    {faq.features && (
                      <ul className="grid grid-cols-2 gap-2 text-sm">
                        {faq.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2">
                            {/* Utilisation de la couleur d'accent pour les puces */}
                            <Star className={`w-4 h-4 text-[${accentColor}]`} />{" "}
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                <button
                  onClick={() => toggleFAQ(faq.id)}
                  // Utilisation de la couleur d'accent pour le bouton Voir plus/Réduire
                  className={`flex items-center gap-2 text-[${accentColor}] font-semibold transition hover:text-[${THEME_COLORS["primary-dark"]}]`}
                >
                  {openFAQ === faq.id ? (
                    <>
                      Réduire <ChevronUp className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      Voir plus <ChevronDown className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivitesLoisirsFAQ;
