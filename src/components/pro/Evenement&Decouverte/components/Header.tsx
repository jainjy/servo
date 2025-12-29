import React from "react";
import { Plus, Download } from "lucide-react";
import { ActiveTab } from "../types";

interface HeaderProps {
  activeTab: ActiveTab;
  onCreateEvent: () => void;
  onCreateDiscovery: () => void;
  onExport: () => void;
}

const Header: React.FC<HeaderProps> = ({
  activeTab,
  onCreateEvent,
  onCreateDiscovery,
  onExport,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Événements & Découvertes
        </h1>
        <p className="text-gray-600 mt-1">
          Gérez vos événements et découvertes touristiques
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={activeTab === "events" ? onCreateEvent : onCreateDiscovery}
          className="flex items-center gap-2 bg-gradient-to-r from-[#6B8E23] to-[#556B2F] text-white font-semibold py-2.5 px-4 rounded-lg hover:opacity-90 transition-all"
        >
          <Plus size={20} />
          Nouveau {activeTab === "events" ? "événement" : "découverte"}
        </button>

        <button
          onClick={onExport}
          className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download size={20} />
          Exporter
        </button>
      </div>
    </div>
  );
};

export default Header;