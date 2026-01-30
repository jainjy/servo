import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin } from "lucide-react";
import { Colors } from "../data/colors";
import { MouseEvent } from "react";



interface HeroSectionProps {
  onServicesClick: () => void;
  onMapClick: () => void;
  trackBusinessInteraction: (
    id: string,
    name: string,
    action: string,
    metadata?: Record<string, any>
  ) => void;
  colors: Colors;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  onServicesClick, 
  onMapClick, 
  trackBusinessInteraction, 
  colors 
}) => {
  const handleServicesClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    trackBusinessInteraction(
      "services_section",
      "Services",
      "navigate"
    );
    
    // Déclencher le callback parent
    onServicesClick();
    
    // Scroll vers la section services
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ 
        behavior: "smooth",
        block: "start"
      });
    }
  };

  const handlePartnersClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    trackBusinessInteraction(
      "partners_map",
      "Carte partenaires",
      "open_from_hero"
    );
    
    // Déclencher le callback parent pour ouvrir la modal
    onMapClick();
  };

  const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = colors.primaryDark;
    e.currentTarget.style.borderColor = colors.primaryDark;
  };

  const handleMouseLeave = (e: MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = "#0f172a";
    e.currentTarget.style.borderColor = "#334155";
  };

  return (
    <section className="relative py-8 pt-24 lg:py-24 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.8)), url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80')`,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-xl lg:text-4xl md:text-6xl font-bold mb-6 text-white">
            Solutions{" "}
            <span style={{ color: colors.primaryDark }}>
              Entreprise & Pro
            </span>
          </h1>
          <p className="text-sm text-slate-200 mb-10 leading-relaxed">
            Tous les services essentiels pour créer, développer et gérer votre
            entreprise. Un accompagnement personnalisé de A à Z par nos
            experts.
          </p>

          <div className="flex flex-wrap gap-2 lg:gap-5 justify-center">
            <motion.div>
              <Button
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-8 py-5 text-lg font-semibold border-2 border-slate-700 hover:border-slate-600 transition-all duration-300"
                style={{
                  backgroundColor: "#0f172a",
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleServicesClick}
              >
                <Briefcase className="h-5 w-5 mr-3" />
                Découvrir nos services
              </Button>
            </motion.div>

            <motion.div>
              <Button
                className="bg-logo hover:bg-logo/80 text-white rounded-xl px-8 py-5 text-lg font-semibold border-2 border-logo hover:border-logo/80 transition-all duration-300"
                onClick={handlePartnersClick} // Utilise la nouvelle fonction
              >
                <MapPin className="h-5 w-5 mr-3" />
                Voir nos partenaires
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;