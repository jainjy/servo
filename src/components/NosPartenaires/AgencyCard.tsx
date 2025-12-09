import React, { useState, useEffect, useCallback } from 'react';
import { 
  Building, 
  Home, 
  TrendingUp, 
  Phone, 
  Mail, 
  MapPin,
  Star,
  Users,
  Award,
  Shield,
  Plus,
  X
} from 'lucide-react';

// Types
interface Agency {
  id: number;
  name: string;
  description: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  link: string; 
}

interface ServiceIcon {
  [key: string]: React.ReactNode;
}

// Couleurs définies
const colors = {
  logo: "#556B2F",
  primaryDark: "#6B8E23",
  lightBg: "#FFFFFF",
  separator: "#D3D3D3",
  secondaryText: "#8B4513",
};

// Données des agences
const agenciesData: Agency[] = [
  {
    id: 1,
    name: "Olimmo réunion",
    description: "Votre partenaire de confiance pour des solutions immobilières sur mesure et un accompagnement personnalisé.",
    contact: {
      phone: "+33 1 23 45 67 89",
      email: "contact@prestige-immo.fr",
      address: "123 Avenue des Champs, 75008 Paris"
    },
    link: "https://www.olimmoreunion.re/"
  },
  {
    id: 2,
    name: "Élite Gestion & Conseil",
    description: "Expertise en gestion de patrimoine et conseil immobilier d'exception depuis 2005.",
    contact: {
      phone: "+33 1 98 76 54 32",
      email: "contact@elite-gestion.fr",
      address: "45 Rue de la Paix, 75002 Paris"
    },
    link: "https://elite-gestion.fr"
  },
  {
    id: 3,
    name: "Horizon Immobilier",
    description: "Votre vision, notre mission. Trouvez la propriété de vos rêves avec nos experts.",
    contact: {
      phone: "+33 1 34 56 78 90",
      email: "info@horizon-immo.fr",
      address: "78 Boulevard Saint-Germain, 75006 Paris"
    },
    link: "https://horizon-immo.fr"
  }
];

// Composant de carte d'agence individuelle - version optimisée
const AgencyCardComponent: React.FC<{ 
  agency: Agency;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}> = React.memo(({ agency, isHovered, onMouseEnter, onMouseLeave }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Icônes de services
  const serviceIcons: ServiceIcon = {
    'immobilier': <Home size={20} />,
    'gestion': <Building size={20} />,
    'conseil': <TrendingUp size={20} />,
  };

  // Gestion du modal avec useCallback pour éviter les re-renders inutiles
  const handleOpenDetails = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setShowDetails(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setShowDetails(false);
  }, []);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
    window.location.href = agency.link;
  }, [agency.link]);

  useEffect(() => {
    if (showDetails) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [showDetails]);

  return (
    <>
      <div 
        className="relative w-full bg-white rounded-xl shadow-lg transition-all duration-300 overflow-hidden cursor-pointer hover:shadow-xl"
        style={{ 
          border: `1px solid ${colors.separator}`,
          minHeight: '280px',
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)'
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.location.href = agency.link;
          }
        }}
        aria-label={`Voir les détails de ${agency.name}`}
      >
        <div className="p-6">
          <div className="flex items-start mb-4">
            <div 
              className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 mr-4"
              style={{ 
                backgroundColor: colors.logo,
                boxShadow: `0 4px 12px rgba(85, 107, 47, 0.2)`
              }}
            >
              <Building size={24} color={colors.lightBg} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 
                className="text-lg font-bold truncate hover:text-opacity-80 transition-colors duration-200"
                style={{ color: colors.secondaryText }}
              >
                {agency.name}
              </h3>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2 hover:text-gray-800 transition-colors duration-200">
            {agency.description}
          </p>

          <div className="absolute bottom-6 right-6">
            <button
              onClick={(e) => handleOpenDetails(e)}
              className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-lg"
              style={{ 
                backgroundColor: colors.primaryDark,
                boxShadow: `0 4px 15px rgba(107, 142, 35, 0.3)`
              }}
              aria-label={`Plus d'infos sur ${agency.name}`}
            >
              <Plus 
                size={20} 
                color={colors.lightBg}
              />
            </button>
          </div>
        </div>

        <div 
          className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-300"
          style={{ 
            background: `linear-gradient(90deg, ${colors.logo}, ${colors.primaryDark})`,
            opacity: isHovered ? 1 : 0.8
          }}
        />
      </div>

      {showDetails && (
        <Modal agency={agency} onClose={handleCloseDetails} />
      )}
    </>
  );
});

// Composant Modal avec design amélioré
const Modal: React.FC<{ agency: Agency; onClose: () => void }> = React.memo(({ agency, onClose }) => {
  const serviceIcons: ServiceIcon = {
    'immobilier': <Home size={18} />,
    'gestion': <Building size={18} />,
    'conseil': <TrendingUp size={18} />,
  };

  const handleModalClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
        onClick={handleModalClick}
      >
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ 
                  backgroundColor: colors.logo,
                  boxShadow: `0 4px 12px ${colors.logo}40`
                }}
              >
                <Building size={28} color={colors.lightBg} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {agency.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Agence partenaire
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-0.5 bg-gray-300 mr-3"></div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Présentation
                </h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {agency.description}
              </p>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-0.5 bg-gray-300 mr-3"></div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Services
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {Object.entries(serviceIcons).map(([service, icon], index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50"
                  >
                    <div className="text-gray-600">
                      {icon}
                    </div>
                    <span className="text-sm text-gray-700 font-medium capitalize">
                      {service}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-0.5 bg-gray-300 mr-3"></div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Contact
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ 
                      backgroundColor: `${colors.logo}15`,
                      color: colors.logo
                    }}
                  >
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Téléphone</p>
                    <p className="text-sm font-medium text-gray-900">{agency.contact.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ 
                      backgroundColor: `${colors.logo}15`,
                      color: colors.logo
                    }}
                  >
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Email</p>
                    <p className="text-sm font-medium text-gray-900">{agency.contact.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ 
                      backgroundColor: `${colors.logo}15`,
                      color: colors.logo
                    }}
                  >
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Adresse</p>
                    <p className="text-sm font-medium text-gray-900">{agency.contact.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={() => window.location.href = agency.link}
              className="flex-1 px-4 py-3 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Visiter le site
            </button>
            <button
              onClick={() => window.location.href = `tel:${agency.contact.phone}`}
              className="flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
              style={{ 
                backgroundColor: colors.primaryDark,
                color: colors.lightBg
              }}
            >
              Appeler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// Page principale des agences
const AgencyCard: React.FC = () => {
  const [selectedAgency, setSelectedAgency] = useState<number | null>(null);

  const handleMouseEnter = useCallback((id: number) => {
    setSelectedAgency(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setSelectedAgency(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <style>{`
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        
        .modal-scroll::-webkit-scrollbar {
          width: 6px;
        }
        
        .modal-scroll::-webkit-scrollbar-track {
          background: #f8f9fa;
        }
        
        .modal-scroll::-webkit-scrollbar-thumb {
          background: #e0e0e0;
          border-radius: 3px;
        }
      `}</style>

      <div className="max-w-7xl mx-auto pt-16">
        <div className="text-center mb-12">
          <div 
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 mx-auto"
            style={{ 
              backgroundColor: colors.logo,
              boxShadow: `0 8px 25px rgba(85, 107, 35, 0.2)`
            }}
          >
            <Building size={32} color={colors.lightBg} />
          </div>
          
          <h1 
            className="text-3xl md:text-4xl font-bold mb-4 tracking-tight"
            style={{ color: colors.secondaryText }}
          >
            Nos Agences Partenaires
          </h1>
          
          <div 
            className="w-16 h-1 mx-auto mb-6 rounded-full"
            style={{ backgroundColor: colors.primaryDark }}
          />
          
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez notre réseau d'agences partenaires d'excellence, sélectionnées pour leur expertise et leur engagement.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { icon: <Building size={24} />, label: "Agences", value: "25+", color: colors.logo },
            { icon: <Users size={24} />, label: "Clients", value: "5000+", color: colors.primaryDark },
            { icon: <Award size={24} />, label: "Années Exp.", value: "15+", color: colors.secondaryText },
            { icon: <Shield size={24} />, label: "Satisfaction", value: "98%", color: colors.primaryDark }
          ].map((stat, index) => (
            <div 
              key={index}
              className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 text-center"
              style={{ 
                border: `1px solid ${colors.separator}`,
                borderTop: `3px solid ${stat.color}`
              }}
            >
              <div 
                className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-3 mx-auto"
                style={{ 
                  backgroundColor: `${stat.color}15`,
                  color: stat.color
                }}
              >
                {stat.icon}
              </div>
              <div 
                className="text-2xl font-bold mb-1"
                style={{ color: colors.secondaryText }}
              >
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agenciesData.map((agency) => (
            <div key={agency.id}>
              <AgencyCardComponent 
                agency={agency}
                isHovered={selectedAgency === agency.id}
                onMouseEnter={() => handleMouseEnter(agency.id)}
                onMouseLeave={handleMouseLeave}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgencyCard;