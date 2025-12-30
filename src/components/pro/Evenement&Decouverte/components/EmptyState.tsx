import React from "react";
import { AlertCircle, Plus } from "lucide-react";
import { ActiveTab } from "../types";

interface EmptyStateProps {
  activeTab: ActiveTab;
  searchTerm: string;
  onCreate: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  activeTab,
  searchTerm,
  onCreate,
}) => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
        <AlertCircle className="text-gray-400" size={32} />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Aucun élément trouvé
      </h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        {searchTerm
          ? `Aucun résultat pour "${searchTerm}"`
          : `Vous n'avez pas encore de ${
              activeTab === "events" ? "événements" : "découvertes"
            }. Créez-en un !`}
      </p>
      <button
        onClick={onCreate}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6B8E23] to-[#556B2F] text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all"
      >
        <Plus size={20} />
        Créer le premier
      </button>
    </div>
  );
};

export default EmptyState;