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

  const defaultColor = "from-purple-500 to-pink-500";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      {/* HERO */}
      <div className="relative py-24 md:py-32 bg-gradient-to-r from-purple-600/50 to-pink-500/50 overflow-hidden">
        <img
          src="https://i.pinimg.com/736x/fa/05/b9/fa05b9dba51cec6eb5e7441b75d0c153.jpg"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          alt="Hero"
        />
        <div className="relative text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg tracking-wide">
            Activités & Loisirs
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Découvrez nos expériences touristiques immersives et aventures nature.
          </p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="max-w-3xl mx-auto px-4 -mt-10 mb-14">
        <div className="relative bg-white/95 backdrop-blur-md shadow-md rounded-3xl p-4 border border-gray-200 transition-all hover:shadow-lg">
          <Search className="absolute left-5 top-5 w-6 h-6 text-purple-600" />
          <input
            type="text"
            placeholder="Rechercher une activité..."
            className="w-full pl-14 pr-4 py-3 text-lg rounded-2xl outline-none focus:ring-2 focus:ring-purple-400 transition"
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
            ${activeCategory === "all"
              ? `bg-gradient-to-r ${defaultColor} text-white border-transparent shadow-lg`
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"} hover:scale-105`}
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
              ${activeCategory === cat.name
                ? `bg-gradient-to-r ${cat.color || defaultColor} text-white border-transparent shadow-lg`
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"} hover:scale-105`}
          >
            {iconMap[cat.icon] ?? <Star className="w-5 h-5" />}
            {cat.name}
            <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{getCategoryCount(cat.name)}</span>
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        {filtered.length === 0 && (
          <div className="text-center py-24">
            <Search className="mx-auto w-16 h-16 text-purple-500 mb-4" />
            <p className="text-xl font-bold text-gray-700">Aucune activité trouvée</p>
            <p className="text-gray-500">Essayez un autre mot-clé.</p>
          </div>
        )}

        <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {filtered.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
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
                  <p className="text-sm text-purple-600 font-semibold mb-2">{faq.highlight}</p>
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
                            <Star className="w-4 h-4 text-purple-500" /> {f}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="flex items-center gap-2 text-purple-600 font-semibold transition hover:text-purple-800"
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
