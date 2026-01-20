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
import AdvertisementPopup from "../AdvertisementPopup";

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
      {/* Hero */}
      {/* Advertisement Popup - Absolute Position */}
      <div className="absolute top-12 left-4 right-4 z-50">
        <AdvertisementPopup />
      </div>

      <div className="fixed w-1/2 bottom-0 right-4 z-50">
        <AdvertisementPopup />
      </div>
      <div className="relative rounded-2xl overflow-hidden mb-8">
        <div
          className="relative pt-20 pb-8 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/couple-together-kayaking-river.jpg")',
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 text-center text-white">
            <h1 className="text-xl md:text-4xl font-extrabold drop-shadow-2xl tracking-wide mb-4">
              Activités & Loisirs
            </h1>
            <p className="my-4 text-sm max-w-3xl mx-auto font-medium leading-relaxed">
              Découvrez nos expériences touristiques immersives et aventures
              nature au cœur des paysages exceptionnels.
            </p>
            <TourismNavigation />
          </div>
        </div>
      </div>
      {/* Fin Hero */}

      {/* SEARCH BAR */}
      <div className="max-w-3xl mx-auto px-4 -mt-10 mb-14 relative z-20">
        <div
          className={`relative bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl p-1 border-2 border-[${separatorColor}] transition-all hover:shadow-2xl`}
        >
          {/* Utilisation de la couleur d'accent pour l'icône */}
          <Search
            className={`absolute left-5 top-5 w-6 h-6 text-[${accentColor}]`}
          />
          <input
            type="text"
            placeholder="Rechercher une activité, une randonnée, une aventure..."
            // Utilisation de la couleur d'accent pour le focus
            className={`w-full pl-14 pr-4 py-4 text-lg rounded-2xl outline-none focus:ring-3 focus:ring-[${accentColor}]/50 transition bg-white/90`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* CATEGORY FILTERS */}
      <div className="flex flex-wrap justify-center gap-3 px-4 mb-16">
        <button
          onClick={() => setActiveCategory("all")}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all shadow-md border-2
            ${
              activeCategory === "all"
                ? // Utilisation du dégradé du thème pour l'état actif
                  `bg-gradient-to-r ${defaultGradient} text-white border-transparent shadow-lg`
                : // Utilisation de la couleur de bordure du thème pour l'état inactif
                  `bg-white text-gray-800 border-[${separatorColor}] hover:bg-gray-50`
            } hover:scale-105 hover:shadow-lg`}
        >
          <Compass className="w-5 h-5" />
          Toutes
          <span className="px-2.5 py-1 rounded-full text-xs bg-white/20 text-white">
            {categories.length}
          </span>
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.name)}
            className={`flex items-center gap-2 px-5 py-3 rounded-full font-medium text-sm transition-all shadow-md border-2
              ${
                activeCategory === cat.name
                  ? // Si cat.color est défini, on l'utilise, sinon le dégradé du thème
                    `bg-gradient-to-r ${
                      cat.color || defaultGradient
                    } text-white border-transparent shadow-lg`
                  : `bg-white text-gray-800 border-[${separatorColor}] hover:bg-gray-50`
              } hover:scale-105 hover:shadow-lg`}
          >
            {iconMap[cat.icon] ?? <Star className="w-5 h-5" />}
            {cat.name}
            <span className="px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
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
              className={`bg-white rounded-2xl shadow-lg border border-[${separatorColor}] overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl group`}
            >
              <div className="relative overflow-hidden">
                <img
                  src={faq.image}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  alt={faq.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4 px-4 py-2 bg-black/60 backdrop-blur-md text-white rounded-lg text-sm flex items-center gap-2 font-medium">
                  {iconMap[faq.icon] ?? <Star className="w-4 h-4" />} {faq.name}
                </div>
              </div>

              <div className="p-6">
                {faq.highlight && (
                  // Utilisation de la couleur secondary-text pour les faits saillants
                  <p
                    className={`text-sm text-[${secondaryAccentColor}] font-bold mb-3 uppercase tracking-wide`}
                  >
                    {faq.highlight}
                  </p>
                )}

                {faq.stats && (
                  <div className="flex flex-wrap gap-3 text-sm text-gray-700 mb-4 bg-gray-50 p-3 rounded-lg">
                    <span className="flex items-center gap-1">
                      👥 {faq.stats.participants}
                    </span>
                    <span className="flex items-center gap-1">
                      ⏱ {faq.stats.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      ⭐ {faq.stats.level}
                    </span>
                  </div>
                )}

                {openFAQ === faq.id && (
                  <div className="mb-4 transition-all duration-300 animate-fadeIn">
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {faq.description}
                    </p>

                    {faq.features && (
                      <ul className="grid grid-cols-2 gap-3 text-sm">
                        {faq.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2">
                            {/* Utilisation de la couleur d'accent pour les puces */}
                            <Star className={`w-4 h-4 text-[${accentColor}]`} />
                            <span className="text-gray-600">{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                <button
                  onClick={() => toggleFAQ(faq.id)}
                  // Utilisation de la couleur d'accent pour le bouton Voir plus/Réduire
                  className={`flex items-center gap-2 text-[${accentColor}] font-bold transition hover:text-[${THEME_COLORS["primary-dark"]}] hover:gap-3`}
                >
                  {openFAQ === faq.id ? (
                    <>
                      Réduire <ChevronUp className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      Voir plus de détails <ChevronDown className="w-5 h-5" />
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
