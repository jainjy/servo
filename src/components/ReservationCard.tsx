import React, { useEffect, useState } from "react";
import {
  Home,
  Calendar,
  MapPin,
  Euro,
  Users,
  Bed,
  Bath,
  Ruler,
  Star,
  CheckCircle,
  Clock,
  XCircle,
  Archive,
  Edit,
  Trash2,
  Eye,
  MessageCircle,
  Phone,
  Mail,
  User,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Check,
  FileText,
  DoorOpen,
  AlertCircle,
  Key,
  Download,
  Building2,
} from "lucide-react";

// Types pour les locations saisonnières
export interface LocationSaisonniere {
  id: number;
  propertyId: number;
  property?: Property;
  dateDebut: string;
  dateFin: string;
  prixTotal: number;
  statut: 'en_attente' | 'confirmee' | 'annulee' | 'terminee' | 'en_cours';
  nombreAdultes: number;
  nombreEnfants: number;
  remarques?: string;
  createdAt: string;
  updatedAt: string;
  client?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  paiements?: Paiement[];
}

interface Property {
  id: number;
  title: string;
  description: string;
  address: string;
  city: string;
  zipCode: string;
  surface: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  images: string[];
  type: string;
  listingType: 'sale' | 'rent' | 'both';
  locationType?: 'longue_duree' | 'saisonnier';
  ownerId: number;
  amenities: string[];
}

interface Paiement {
  id: number;
  montant: number;
  statut: 'en_attente' | 'paye' | 'partiel' | 'rembourse';
  methode: string;
  datePaiement?: string;
  reference: string;
}

interface ReservationCardProps {
  reservation: LocationSaisonniere;
  onStatusChange: (id: number, statut: LocationSaisonniere['statut']) => void;
  onRemove: (id: number) => void;
  onViewDetails: (reservation: LocationSaisonniere) => void;
  isOwner: boolean;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onStatusChange,
  onRemove,
  onViewDetails,
  isOwner,
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showStatusSelector, setShowStatusSelector] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    console.log(`🔄 ReservationCard mounted for reservation ${reservation.id}`);
    console.log(`📊 Reservation data:`, {
      id: reservation.id,
      statut: reservation.statut,
      propertyTitle: reservation.property?.title,
      isOwner,
    });
    
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      console.log(`📱 Window width: ${window.innerWidth}px, isMobile: ${mobile}`);
      setIsMobileView(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      console.log(`🧹 ReservationCard cleanup for reservation ${reservation.id}`);
      window.removeEventListener('resize', checkMobile);
    };
  }, [reservation.id, reservation.statut, isOwner]);

  const getStatusConfig = (statut: LocationSaisonniere['statut']) => {
    console.log(`🎨 Getting status config for: ${statut}`);
    switch (statut) {
      case 'en_attente':
        return {
          label: 'En attente',
          icon: <Clock className="w-4 h-4" />,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          badgeColor: 'bg-yellow-100 text-yellow-800'
        };
      case 'confirmee':
        return {
          label: 'Confirmée',
          icon: <CheckCircle className="w-4 h-4" />,
          color: 'bg-green-100 text-green-800 border-green-200',
          badgeColor: 'bg-green-100 text-green-800'
        };
      case 'annulee':
        return {
          label: 'Annulée',
          icon: <XCircle className="w-4 h-4" />,
          color: 'bg-red-100 text-red-800 border-red-200',
          badgeColor: 'bg-red-100 text-red-800'
        };
      case 'terminee':
        return {
          label: 'Terminée',
          icon: <Check className="w-4 h-4" />,
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          badgeColor: 'bg-blue-100 text-blue-800'
        };
      case 'en_cours':
        return {
          label: 'En cours',
          icon: <DoorOpen className="w-4 h-4" />,
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          badgeColor: 'bg-purple-100 text-purple-800'
        };
      default:
        return {
          label: 'Inconnu',
          icon: <AlertCircle className="w-4 h-4" />,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          badgeColor: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const statusConfig = getStatusConfig(reservation.statut);

  const statusOptions = [
    { value: 'en_attente', label: 'En attente', icon: <Clock className="w-4 h-4" /> },
    { value: 'confirmee', label: 'Confirmée', icon: <CheckCircle className="w-4 h-4" /> },
    { value: 'annulee', label: 'Annulée', icon: <XCircle className="w-4 h-4" /> },
    { value: 'terminee', label: 'Terminée', icon: <Check className="w-4 h-4" /> },
    { value: 'en_cours', label: 'En cours', icon: <DoorOpen className="w-4 h-4" /> },
  ];

  const handleStatusSelect = (statut: LocationSaisonniere['statut']) => {
    console.log(`🎯 Status selected: ${statut} for reservation ${reservation.id}`);
    console.log(`📤 Calling onStatusChange with:`, { id: reservation.id, statut });
    onStatusChange(reservation.id, statut);
    setShowStatusSelector(false);
  };

  const calculateNuits = (debut: string, fin: string) => {
    const start = new Date(debut);
    const end = new Date(fin);
    const diff = end.getTime() - start.getTime();
    const nuits = Math.ceil(diff / (1000 * 3600 * 24));
    console.log(`📅 Calculating nights: ${debut} to ${fin} = ${nuits} nights`);
    return nuits;
  };

  const renderDesktopView = () => {
    console.log(`🖥️ Rendering desktop view for reservation ${reservation.id}`);
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-blue-200 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-6">
          {/* Section gauche - Image et informations */}
          <div className="flex-1 flex flex-col md:flex-row gap-6">
            {/* Image */}
            {reservation.property?.images?.[0] ? (
              <div className="relative overflow-hidden rounded-xl min-w-[150px] h-32 md:h-36">
                <img
                  src={reservation.property.images[0]}
                  alt={reservation.property.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="min-w-[150px] h-32 md:h-36 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                <Home className="w-8 h-8" />
              </div>
            )}

            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-bold text-gray-900 text-lg md:text-xl group-hover:text-blue-700 transition-colors duration-300 leading-tight">
                  {reservation.property?.title}
                </h3>
                <p className="text-gray-600 text-sm flex items-center gap-2 mt-2">
                  <span className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                    <MapPin className="w-4 h-4" />
                    {reservation.property?.address}, {reservation.property?.city}
                  </span>
                </p>
              </div>

              {/* Informations de séjour */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{calculateNuits(reservation.dateDebut, reservation.dateFin)} nuits</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>{reservation.nombreAdultes + reservation.nombreEnfants} personnes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Euro className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold">{reservation.prixTotal.toLocaleString()} €</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DoorOpen className="w-4 h-4 text-gray-400" />
                  <span>
                    {new Date(reservation.dateDebut).toLocaleDateString('fr-FR')} → {new Date(reservation.dateFin).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section droite - Statut et actions */}
          <div className="flex flex-col items-start lg:items-end gap-4 min-w-[200px]">
            <div className="flex flex-col gap-3 w-full">
              {/* Sélecteur de statut */}
              <div className="relative">
                <button
                  onClick={() => {
                    console.log(`🎯 Status selector clicked for reservation ${reservation.id}`);
                    setShowStatusSelector(!showStatusSelector);
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg font-medium border-2 transition-all ${statusConfig.color} hover:shadow-md`}
                >
                  <div className="flex items-center gap-2">
                    {statusConfig.icon}
                    <span className="capitalize">{statusConfig.label}</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showStatusSelector && isOwner && (
                  <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-2xl border border-gray-200 z-50 py-2">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleStatusSelect(option.value as LocationSaisonniere['statut'])}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors hover:bg-gray-50 ${option.value === reservation.statut ? statusConfig.color : "text-gray-700"}`}
                      >
                        {option.icon}
                        {option.label}
                        {option.value === reservation.statut && <Check className="w-4 h-4 ml-auto" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-500 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  Réservé le {new Date(reservation.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>

              {/* Informations client pour propriétaire */}
              {isOwner && reservation.client && (
                <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{reservation.client.firstName} {reservation.client.lastName}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-6 border-t border-gray-100">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                console.log(`👁️ View details clicked for reservation ${reservation.id}`);
                onViewDetails(reservation);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Eye className="w-4 h-4" />
              Voir détails
            </button>

            <button
              onClick={() => {
                console.log(`📋 Toggle details clicked, current state: ${showDetails}`);
                setShowDetails(!showDetails);
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              {showDetails ? "Masquer détails" : "Voir détails"}
            </button>

            {isOwner && reservation.client && (
              <button
                onClick={() => {
                  console.log(`📧 Contact client clicked: ${reservation.client?.email}`);
                  window.location.href = `mailto:${reservation.client?.email}`;
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Contacter
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <button
                onClick={() => {
                  console.log(`⚙️ Actions menu clicked, current state: ${showActions}`);
                  setShowActions(!showActions);
                }}
                className="p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-300 hover:scale-105"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showActions && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 py-2">
                  {isOwner && (
                    <button
                      onClick={() => {
                        console.log(`🗑️ Delete clicked for reservation ${reservation.id}`);
                        onRemove(reservation.id);
                        setShowActions(false);
                      }}
                      className="w-full px-4 py-3 text-left flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  )}
                  {!isOwner && reservation.statut === 'en_attente' && (
                    <button
                      onClick={() => {
                        console.log(`❌ Cancel reservation clicked for ${reservation.id}`);
                        onStatusChange(reservation.id, 'annulee');
                        setShowActions(false);
                      }}
                      className="w-full px-4 py-3 text-left flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Annuler
                    </button>
                  )}
                  <button
                    onClick={() => {
                      console.log(`🏠 View property clicked for ${reservation.propertyId}`);
                      onViewDetails(reservation);
                      setShowActions(false);
                    }}
                    className="w-full px-4 py-3 text-left flex items-center gap-3 text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Voir bien
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Détails supplémentaires */}
        {showDetails && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informations du bien */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                  Informations du bien
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Ruler className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      <span className="font-medium text-gray-800">{reservation.property?.surface} m²</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bed className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {reservation.property?.bedrooms} chambres, {reservation.property?.bathrooms} salles de bain
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Home className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{reservation.property?.rooms} pièces</span>
                  </div>
                </div>
              </div>

              {/* Informations de réservation */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide flex items-center gap-2">
                  <div className="w-1 h-4 bg-green-500 rounded-full"></div>
                  Détails de la réservation
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Arrivée:</span>
                    <span className="font-medium text-gray-800">
                      {new Date(reservation.dateDebut).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Départ:</span>
                    <span className="font-medium text-gray-800">
                      {new Date(reservation.dateFin).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nombre de nuits:</span>
                    <span className="font-medium text-gray-800">
                      {calculateNuits(reservation.dateDebut, reservation.dateFin)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Voyageurs:</span>
                    <span className="font-medium text-gray-800">
                      {reservation.nombreAdultes} adultes, {reservation.nombreEnfants} enfants
                    </span>
                  </div>
                </div>
              </div>

              {/* Paiements */}
              {reservation.paiements && reservation.paiements.length > 0 && (
                <div className="md:col-span-2 space-y-4">
                  <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide flex items-center gap-2">
                    <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
                    État des paiements
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {reservation.paiements.map((paiement) => (
                      <div key={paiement.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">
                            {paiement.methode}
                          </span>
                          <span className={`text-sm font-semibold ${
                            paiement.statut === 'paye' ? 'text-green-600' :
                            paiement.statut === 'partiel' ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {paiement.montant} €
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Ref: {paiement.reference} • {paiement.statut}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Fermer les menus en cliquant ailleurs */}
        {(showActions || showStatusSelector) && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => {
              console.log(`🖱️ Click outside to close menus`);
              setShowActions(false);
              setShowStatusSelector(false);
            }}
          />
        )}
      </div>
    );
  };

  const renderMobileView = () => {
    console.log(`📱 Rendering mobile view for reservation ${reservation.id}`);
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-4 hover:border-blue-200 hover:shadow-lg transition-all duration-500">
        {/* En-tête mobile */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-base mb-2">
              {reservation.property?.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <MapPin className="w-4 h-4" />
              <span className="truncate">
                {reservation.property?.city}
              </span>
            </div>
          </div>
          
          <button
            onClick={() => {
              console.log(`📱 Mobile details toggle clicked, current state: ${showDetails}`);
              setShowDetails(!showDetails);
            }}
            className="p-2 text-gray-500"
          >
            {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {/* Informations principales */}
        <div className="space-y-3 mb-4">
          {/* Sélecteur de statut */}
          <div className="relative">
            <button
              onClick={() => {
                console.log(`📱 Mobile status selector clicked for reservation ${reservation.id}`);
                setShowStatusSelector(!showStatusSelector);
              }}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg font-medium border ${statusConfig.color}`}
            >
              <div className="flex items-center gap-2">
                {statusConfig.icon}
                <span className="text-sm capitalize">{statusConfig.label}</span>
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showStatusSelector && isOwner && (
              <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusSelect(option.value as LocationSaisonniere['statut'])}
                    className={`w-full px-3 py-2 text-left flex items-center gap-2 text-sm ${option.value === reservation.statut ? statusConfig.color : "text-gray-700"}`}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dates et prix */}
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-600">
              {new Date(reservation.dateDebut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} → 
              {new Date(reservation.dateFin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
            </div>
            <div className="font-bold text-blue-600">
              {reservation.prixTotal.toLocaleString()} €
            </div>
          </div>
        </div>

        {/* Boutons d'action mobile */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              console.log(`📱 Mobile view details clicked for reservation ${reservation.id}`);
              onViewDetails(reservation);
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Voir
          </button>

          {isOwner && reservation.client && (
            <button
              onClick={() => {
                console.log(`📱 Mobile contact client clicked: ${reservation.client?.email}`);
                window.location.href = `mailto:${reservation.client?.email}`;
              }}
              className="px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 border border-green-200 text-green-600 hover:bg-green-50"
            >
              <Mail className="w-4 h-4" />
            </button>
          )}

          {!isOwner && reservation.statut === 'en_attente' && (
            <button
              onClick={() => {
                console.log(`📱 Mobile cancel reservation clicked for ${reservation.id}`);
                onStatusChange(reservation.id, 'annulee');
              }}
              className="px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Détails dépliables */}
        {showDetails && (
          <div className="pt-4 border-t border-gray-100 space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-gray-800 uppercase tracking-wide mb-3">
                Informations
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Nuits:</span>
                  <span className="font-medium">
                    {calculateNuits(reservation.dateDebut, reservation.dateFin)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Personnes:</span>
                  <span className="font-medium">
                    {reservation.nombreAdultes + reservation.nombreEnfants}
                  </span>
                </div>
                {reservation.client && isOwner && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Client:</span>
                      <span className="font-medium">
                        {reservation.client.firstName} {reservation.client.lastName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Téléphone:</span>
                      <span className="font-medium">
                        {reservation.client.phone || 'Non renseigné'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return isMobileView ? renderMobileView() : renderDesktopView();
};

export default ReservationCard;