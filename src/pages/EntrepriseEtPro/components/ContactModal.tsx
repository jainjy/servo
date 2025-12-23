import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send } from "lucide-react";
import { useState, useEffect, ChangeEvent, FormEvent, FocusEvent } from "react";
import { Partenaire } from "../data/partnersData";
import { Service } from "../data/servicesData";
import { Colors } from "../data/colors";

interface FormData {
  nom: string;
  email: string;
  telephone: string;
  message: string;
  service: string;
  typeAvis: string;
}

interface ContactModalProps {
  selectedPartenaire: Partenaire | null;
  selectedService: Service | null;
  formData: FormData;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  colors: Colors;
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
};

const ContactModal: React.FC<ContactModalProps> = ({
  selectedPartenaire,
  selectedService,
  formData,
  isLoading,
  onClose,
  onSubmit,
  onInputChange,
  colors
}) => {
  // États locaux pour éviter les undefined lors du premier rendu
  const [safeSelectedPartenaire, setSafeSelectedPartenaire] = useState<Partenaire | null>(null);
  const [safeSelectedService, setSafeSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    setSafeSelectedPartenaire(selectedPartenaire || null);
    setSafeSelectedService(selectedService || null);
  }, [selectedPartenaire, selectedService]);

  // Fonctions de sécurité
  const getModalTitle = (): string => {
    if (safeSelectedPartenaire?.nom) {
      return `Contacter ${safeSelectedPartenaire.nom}`;
    }
    if (safeSelectedService?.nom) {
      return `Demander ${safeSelectedService.nom}`;
    }
    return "Envoyer un message";
  };

  const getPlaceholder = (): string => {
    if (safeSelectedService?.nom) {
      return `Je souhaite en savoir plus sur ${safeSelectedService.nom}...`;
    }
    if (safeSelectedPartenaire?.nom) {
      return `Je souhaite rejoindre ${safeSelectedPartenaire.nom}...`;
    }
    return "Votre message...";
  };

  const getButtonText = (): string => {
    if (safeSelectedService?.nom) {
      return "DEMANDER LE SERVICE";
    }
    return "ENVOYER LE MESSAGE";
  };

  const handleFocus = (e: FocusEvent<HTMLTextAreaElement>) => {
    e.target.style.borderColor = colors.primaryDark;
    e.target.style.boxShadow = `0 0 0 2px ${colors.primaryDark}20`;
  };

  const handleBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
    e.target.style.borderColor = colors.separator;
    e.target.style.boxShadow = "none";
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = colors.primaryLight;
    e.currentTarget.style.borderColor = colors.primaryLight;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = colors.primaryDark;
    e.currentTarget.style.borderColor = colors.primaryDark;
  };

  const handleCloseMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = `${colors.primaryDark}15`;
  };

  const handleCloseMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = "transparent";
  };

  // Si les props sont undefined, on ne rend rien
  if (!formData) {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        variants={modalVariants}
        className="rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto"
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
            {getModalTitle()}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-10 w-10 p-0 rounded-xl transition-all duration-300"
            style={{
              color: colors.textSecondary,
            }}
            onMouseEnter={handleCloseMouseEnter}
            onMouseLeave={handleCloseMouseLeave}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label
              className="block text-sm font-medium mb-3"
              style={{ color: colors.textPrimary }}
            >
              Nom complet *
            </label>
            <Input
              name="nom"
              value={formData.nom}
              onChange={onInputChange}
              required
              className="w-full rounded-xl"
              style={{
                borderColor: colors.separator,
              }}
              placeholder="Votre nom"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-3"
              style={{ color: colors.textPrimary }}
            >
              Email *
            </label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={onInputChange}
              required
              className="w-full rounded-xl"
              style={{
                borderColor: colors.separator,
              }}
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-3"
              style={{ color: colors.textPrimary }}
            >
              Téléphone
            </label>
            <Input
              name="telephone"
              value={formData.telephone}
              onChange={onInputChange}
              className="w-full rounded-xl"
              style={{
                borderColor: colors.separator,
              }}
              placeholder="Votre numéro"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-3"
              style={{ color: colors.textPrimary }}
            >
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={onInputChange}
              required
              rows={5}
              className="w-full px-4 py-3 rounded-xl resize-none transition-all duration-300"
              style={{
                border: `1px solid ${colors.separator}`,
                outline: "none",
              }}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={getPlaceholder()}
            />
          </div>

          <Button
            type="submit"
            className="w-full font-semibold gap-2 border-2 transition-all duration-300 py-4 rounded-xl"
            style={{
              backgroundColor: colors.primaryDark,
              color: colors.lightBg,
              borderColor: colors.primaryDark,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            disabled={isLoading}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-4 h-4 border-2 rounded-full"
                style={{
                  borderColor: colors.lightBg,
                  borderTopColor: "transparent",
                }}
              />
            ) : (
              <>
                <Send className="h-4 w-4" />
                {getButtonText()}
              </>
            )}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ContactModal;