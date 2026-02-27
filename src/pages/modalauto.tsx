import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  X,
  CheckCircle,
  Clock,
  FileText,
  AlertCircle,
  Calendar,
  Phone,
  Mail,
  Shield,
  Wrench,
  ClipboardCheck,
  Paintbrush,
  Settings
} from "lucide-react";
import { useState } from "react";

interface ModalServiceProps {
  isOpen: boolean;
  onClose: () => void;
  data: any; // Catégorie sélectionnée
}

const ModalService = ({ isOpen, onClose, data }: ModalServiceProps) => {
  const [activeTab, setActiveTab] = useState('presentation');

  if (!isOpen || !data) return null;

  // Fonction pour rendre l'icône appropriée
  const renderIcon = (iconName: string) => {
    switch(iconName) {
      case 'Wrench': return <Wrench className="h-5 w-5" />;
      case 'ClipboardCheck': return <ClipboardCheck className="h-5 w-5" />;
      case 'Paintbrush': return <Paintbrush className="h-5 w-5" />;
      case 'Settings': return <Settings className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  // Fonction pour vérifier si c'est une URL d'image
  const isImageUrl = (icon: any): boolean => {
    if (typeof icon === 'string') {
      return icon.startsWith('/') || icon.startsWith('https://');
    }
    return false;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#D3D3D3]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête avec image de fond */}
        <div className="relative h-48 rounded-t-2xl overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${data.imageUrl || 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'})` 
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 h-10 w-10 p-0 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-xl text-white z-10"
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="absolute bottom-6 left-6 z-10">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30`}>
                {isImageUrl(data.icon) ? (
                  <img src={data.icon} alt={data.title} className="h-8 w-8 object-cover rounded-lg" />
                ) : data.icon && typeof data.icon !== 'string' ? (
                  <data.icon className="h-8 w-8 text-white" />
                ) : (
                  renderIcon(data.icon)
                )}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{data.title}</h2>
                <p className="text-white/90 text-sm max-w-2xl">{data.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Onglets de navigation */}
        <div className="border-b border-[#D3D3D3] px-8">
          <div className="flex gap-6">
            {[
              { id: 'presentation', label: 'Présentation', icon: FileText },
              { id: 'avantages', label: 'Avantages', icon: CheckCircle },
              { id: 'infos', label: 'Infos pratiques', icon: Clock },
              { id: 'documents', label: 'Documents', icon: AlertCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-[#6B8E23] text-[#6B8E23]'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Contenu principal */}
        <div className="p-8">
          {activeTab === 'presentation' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold text-[#8B4513] mb-4">À propos de ce service</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                {data.details?.description || data.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-[#FAFAFA] p-4 rounded-xl">
                  <h4 className="font-semibold text-[#556B2F] mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Niveau de couverture
                  </h4>
                  <p className="text-sm text-slate-600">{data.details?.niveauCouverture || 'Complet selon vos besoins'}</p>
                </div>
                <div className="bg-[#FAFAFA] p-4 rounded-xl">
                  <h4 className="font-semibold text-[#556B2F] mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Délai de traitement
                  </h4>
                  <p className="text-sm text-slate-600">{data.details?.délaiTraitement || 'Variable selon intervention'}</p>
                </div>
              </div>

              <h4 className="font-semibold text-[#556B2F] mb-3">Caractéristiques principales</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {data.features?.map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-center text-slate-600">
                    <CheckCircle className="h-4 w-4 text-[#6B8E23] mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'avantages' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold text-[#8B4513] mb-4">Avantages</h3>
              <div className="space-y-4">
                {data.details?.avantages?.map((avantage: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-[#FAFAFA] rounded-xl">
                    <CheckCircle className="h-5 w-5 text-[#6B8E23] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-slate-700">{avantage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'infos' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold text-[#8B4513] mb-4">Informations pratiques</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-[#556B2F] mb-3">Points importants</h4>
                  <ul className="space-y-2">
                    {data.details?.infosPratiques?.map((info: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-600">
                        <span className="text-[#6B8E23] font-bold mr-2">•</span>
                        {info}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-[#556B2F] mb-3">Exclusions</h4>
                  <ul className="space-y-2">
                    {data.details?.exclusions?.map((exclusion: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-600">
                        <span className="text-red-500 font-bold mr-2">✕</span>
                        {exclusion}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#6B8E23]/5 p-4 rounded-xl border border-[#6B8E23]/20">
                  <h4 className="font-semibold text-[#556B2F] mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Conseils
                  </h4>
                  <ul className="space-y-1">
                    {data.details?.conseils?.map((conseil: string, idx: number) => (
                      <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-[#6B8E23]">✓</span>
                        {conseil}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'documents' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold text-[#8B4513] mb-4">Documents requis</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-[#556B2F] mb-3">Pièces à fournir</h4>
                  <ul className="space-y-2">
                    {data.details?.documentsRequis?.map((doc: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-3 p-3 bg-[#FAFAFA] rounded-lg">
                        <FileText className="h-5 w-5 text-[#6B8E23]" />
                        <span className="text-slate-700">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Card className="p-4 bg-[#6B8E23]/5 border border-[#6B8E23]/20">
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold text-[#556B2F]">Bon à savoir :</span> Vous pouvez nous envoyer vos documents par email ou les apporter directement lors de votre rendez-vous.
                  </p>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-[#D3D3D3]">
            <Button
              className="flex-1 bg-[#556B2F] hover:bg-[#6B8E23] text-white rounded-xl py-4 text-base font-semibold border-2 border-[#556B2F] hover:border-[#6B8E23] transition-all duration-300"
              onClick={() => {
                // Ouvrir modal de rendez-vous
                onClose();
                // Ici vous pouvez appeler une fonction pour ouvrir le modal de contact
                // openModal('contact', { selectedCategorie: data });
              }}
            >
              <Calendar className="h-5 w-5 mr-3" />
              Prendre rendez-vous
            </Button>
            
            <Button
              className="flex-1 bg-white border-2 border-[#556B2F] text-[#556B2F] hover:bg-[#6B8E23] hover:text-white rounded-xl py-4 text-base font-semibold transition-all duration-300"
              onClick={() => {
                window.location.href = `tel:+33123456789`;
              }}
            >
              <Phone className="h-5 w-5 mr-3" />
              Nous appeler
            </Button>
            
            <Button
              className="flex-1 bg-white border-2 border-[#D3D3D3] text-slate-600 hover:bg-slate-50 rounded-xl py-4 text-base font-semibold transition-all duration-300"
              onClick={onClose}
            >
              Fermer
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ModalService;