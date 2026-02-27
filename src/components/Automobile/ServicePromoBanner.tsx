// components/automobile/ServicePromoBanner.tsx

import { motion } from "framer-motion";
import { ClipboardCheck, Paintbrush } from "lucide-react";

interface Props {
  onBook: () => void;
}

export default function ServicePromoBanner({ onBook }: Props) {
  return (
    <section className="relative py-20 bg-gray-900 overflow-hidden">
      
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative container mx-auto px-4 z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-10"
        >

          {/* Contrôle Technique */}
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 hover:scale-105 transition duration-300">
            
            <div className="flex items-center mb-4">
              <ClipboardCheck 
                className="w-8 h-8 mr-3" 
                style={{ color: "#6B8E23" }}
              />
              <h3 className="text-2xl font-bold text-white">
                Contrôle Technique
              </h3>
            </div>

            <p className="text-gray-300 mb-6">
              Préparez votre véhicule avant le contrôle technique et évitez
              les mauvaises surprises. Inspection complète garantie.
            </p>

            <button
              onClick={onBook}
              className="px-6 py-3 rounded-xl font-semibold text-white transition"
              style={{ backgroundColor: "#6B8E23" }}
            >
              Réserver maintenant
            </button>
          </div>

          {/* Peinture Automobile */}
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 hover:scale-105 transition duration-300">
            
            <div className="flex items-center mb-4">
              <Paintbrush 
                className="w-8 h-8 mr-3" 
                style={{ color: "#6B8E23" }}
              />
              <h3 className="text-2xl font-bold text-white">
                Peinture Automobile
              </h3>
            </div>

            <p className="text-gray-300 mb-6">
              Offrez une nouvelle jeunesse à votre véhicule avec
              notre atelier peinture professionnel haute qualité.
            </p>

            <button
              onClick={onBook}
              className="px-6 py-3 rounded-xl font-semibold text-white transition"
              style={{ backgroundColor: "#6B8E23" }}
            >
              Demander un devis
            </button>
          </div>

        </motion.div>
      </div>
    </section>
  );
}