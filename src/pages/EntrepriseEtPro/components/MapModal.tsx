import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, MapPin, Building2, Navigation } from "lucide-react";
import { Partenaire } from "../data/partnersData";
import { Colors } from "../data/colors";

interface MapModalProps {
  selectedLocation: {
    lat: number;
    lng: number;
    address: string;
  } | null;
  partenaires: Partenaire[];
  handlePartnerLocation: (partenaire: Partenaire) => void;
  onClose: () => void;
  colors: Colors;
}

interface MapComponentProps {
  location: {
    lat: number;
    lng: number;
    address: string;
  } | null;
  colors: Colors;
}

const mapModalVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    y: 50,
    transition: {
      duration: 0.3,
    },
  },
};

const MapComponent: React.FC<MapComponentProps> = ({ location, colors }) => {
  const GOOGLE_MAPS_API_KEY = "AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8";
  
  const mapUrl = location
    ? `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${location.lat},${location.lng}&zoom=15&center=${location.lat},${location.lng}`
    : `https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_API_KEY}&center=46.603354,1.888334&zoom=6&maptype=roadmap`;

  return (
    <div
      className="w-full h-96 rounded-xl overflow-hidden border"
      style={{ borderColor: colors.separator }}
    >
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0 }}
        src={mapUrl}
        allowFullScreen
        title="Carte des partenaires"
      />
    </div>
  );
};

const MapModal: React.FC<MapModalProps> = ({
  selectedLocation,
  partenaires,
  handlePartnerLocation,
  onClose,
  colors
}) => {
  const getTitle = (): string => {
    if (selectedLocation) {
      return `Localisation - ${selectedLocation.address}`;
    }
    return "Carte des partenaires";
  };

  const getInstruction = (): string => {
    if (selectedLocation) {
      return "Cliquez sur les marqueurs pour voir les détails des partenaires";
    }
    return "Cliquez sur un partenaire pour voir sa localisation précise";
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        variants={mapModalVariants}
        className="rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: colors.cardBg,
          border: `1px solid ${colors.separator}`,
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2
            className="text-2xl font-bold"
            style={{ color: colors.textPrimary }}
          >
            {getTitle()}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-10 w-10 p-0 rounded-xl transition-all duration-300"
            style={{
              color: colors.textSecondary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${colors.primaryDark}15`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <MapComponent location={selectedLocation} colors={colors} />

        {!selectedLocation && (
          <div className="mt-6">
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: colors.textPrimary }}
            >
              Nos partenaires sur la carte
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {partenaires.map((partenaire) => (
                <motion.div
                  key={partenaire.id}
                  className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                  style={{
                    border: `1px solid ${colors.separator}`,
                    color: colors.textPrimary,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${colors.primaryDark}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handlePartnerLocation(partenaire)}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${colors.primaryDark}15` }}
                  >
                    <Building2
                      className="h-5 w-5"
                      style={{ color: colors.primaryDark }}
                    />
                  </div>
                  <div className="flex-1">
                    <p
                      className="font-medium"
                      style={{ color: colors.textPrimary }}
                    >
                      {partenaire.nom}
                    </p>
                    <p
                      className="text-sm flex items-center gap-1"
                      style={{ color: colors.textSecondary }}
                    >
                      <MapPin className="h-3 w-3" />
                      {partenaire.location.address}
                    </p>
                  </div>
                  <Navigation
                    className="h-4 w-4"
                    style={{ color: colors.textSecondary }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div
          className="mt-6 p-4 rounded-lg"
          style={{
            backgroundColor: `${colors.primaryDark}08`,
            border: `1px solid ${colors.separator}`,
          }}
        >
          <p
            className="text-sm flex items-center gap-2"
            style={{ color: colors.textSecondary }}
          >
            <MapPin
              className="h-4 w-4"
              style={{ color: colors.primaryDark }}
            />
            {getInstruction()}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MapModal;