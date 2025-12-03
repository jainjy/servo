// components/ConseilModal.tsx
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface ConseilsData {
  [key: string]: {
    titre: string;
    couleur: string;
  };
}

interface ConseilModalProps {
  isOpen: boolean;
  onClose: () => void;
  conseil: any;
  conseilsData: ConseilsData;
}

const ConseilModal = ({ isOpen, onClose, conseil, conseilsData }: ConseilModalProps) => {
  if (!isOpen || !conseil) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 lg:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl lg:rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Header */}
        <div className="relative h-48 lg:h-80 overflow-hidden">
          <img
            src={conseil.image}
            alt={conseil.titre}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 lg:top-6 right-3 lg:right-6 bg-white/90 hover:bg-white text-slate-900 rounded-full p-1.5 lg:p-2 transition-all duration-300 shadow-lg"
          >
            <X className="h-4 lg:h-6 w-4 lg:w-6" />
          </button>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-8 text-white">
            <h2 className="text-2xl lg:text-4xl font-bold mb-1 lg:mb-2">{conseil.titre}</h2>
            <p className="text-slate-200 text-sm lg:text-lg">{conseil.description}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-8">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-4 lg:mb-6">Points clés à retenir</h3>
            <div className="grid md:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-10">
              {conseil.tips.map((tip: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 lg:gap-4">
                  <div className={`w-6 lg:w-8 h-6 lg:h-8 rounded-full bg-gradient-to-br ${conseilsData[conseil.categorie]?.couleur} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <span className="text-white font-bold text-xs lg:text-sm">✓</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-sm lg:text-base">{tip}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-slate-50 to-white rounded-xl lg:rounded-2xl border border-slate-200 p-4 lg:p-8 text-center">
              <h4 className="text-lg lg:text-xl font-bold text-slate-900 mb-2 lg:mb-3">Prêt à passer à l'action ?</h4>
              <p className="text-slate-600 text-sm lg:text-base mb-4 lg:mb-6">Contactez nos experts pour une assistance personnalisée</p>
              <button className={`px-6 lg:px-8 py-2.5 lg:py-3 rounded-lg lg:rounded-xl font-semibold text-white transition-all duration-300 bg-gradient-to-r ${conseilsData[conseil.categorie]?.couleur} hover:shadow-lg hover:scale-105 text-sm lg:text-base`}>
                Demander un conseil personnalisé
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConseilModal;