import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

// Constantes de couleur
const COLORS = {
  logo: "#556B2F",
  primary: "#6B8E23",
  lightBg: "#FFFFFF",
  separator: "#D3D3D3",
  secondaryText: "#8B4513",
  smallText: "#000000",
};

const AirlineModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    country: "",
    website: "",
    logo: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Données compagnie aérienne:", formData);
    toast.success("Compagnie aérienne ajoutée avec succès");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full">
        <div className="p-6 border-b" style={{ borderColor: COLORS.separator }}>
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold" style={{ color: COLORS.secondaryText }}>
              Nouvelle compagnie aérienne
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.secondaryText }}>
                Nom *
              </label>
              <input
                type="text"
                required
                className="w-full p-3 border-2 rounded-xl focus:ring-2"
                style={{ 
                  borderColor: COLORS.separator,
                  color: COLORS.smallText
                }}
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.secondaryText }}>
                Code *
              </label>
              <input
                type="text"
                required
                className="w-full p-3 border-2 rounded-xl focus:ring-2"
                style={{ 
                  borderColor: COLORS.separator,
                  color: COLORS.smallText
                }}
                value={formData.code}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, code: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.secondaryText }}>
                Pays
              </label>
              <input
                type="text"
                className="w-full p-3 border-2 rounded-xl focus:ring-2"
                style={{ 
                  borderColor: COLORS.separator,
                  color: COLORS.smallText
                }}
                value={formData.country}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, country: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.secondaryText }}>
                Site web
              </label>
              <input
                type="url"
                className="w-full p-3 border-2 rounded-xl focus:ring-2"
                style={{ 
                  borderColor: COLORS.separator,
                  color: COLORS.smallText
                }}
                value={formData.website}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, website: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 px-6 border-2 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300"
              style={{ borderColor: COLORS.separator }}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300"
              style={{ backgroundColor: COLORS.primary }}
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AirlineModal; 