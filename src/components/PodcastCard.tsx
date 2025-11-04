import { Headphones } from "lucide-react";

// components/PodcastCard.jsx ou dans ton fichier
const PodcastCard = ({ podcast }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          {podcast.title || podcast.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          {podcast.description || "Description non disponible"}
        </p>
        
        {/* Afficher d'autres infos selon ta structure de données */}
        {podcast.duration && (
          <p className="text-sm text-gray-500 mb-2">
            Durée: {podcast.duration}
          </p>
        )}
        
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full flex items-center justify-center gap-2">
          <Headphones className="w-4 h-4" />
          Écouter
        </button>
      </div>
    </div>
  );
};

export default PodcastCard;