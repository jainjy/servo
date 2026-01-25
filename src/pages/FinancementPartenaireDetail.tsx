import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Star,
  Phone,
  Mail,
  MapPin,
  Globe,
  ArrowLeft,
  CheckCircle,
  TrendingUp,
  Clock,
  DollarSign,
  FileText,
  Users,
  Shield,
  Calculator,
  AlertCircle,
  Loader,
  X,
} from "lucide-react";
import { financementAPI } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";

interface Partenaire {
  id: number;
  nom: string;
  description: string;
  rating: number;
  type: string;
  avantages: string[];
  icon?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  conditions?: string;
  tauxMin?: number;
  tauxMax?: number;
  dureeMin?: number;
  dureeMax?: number;
  montantMin?: number;
  montantMax?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ServiceFinancier {
  id: string;
  nom: string;
  description: string;
  type: string;
  categorie: string;
  conditions?: string;
  avantages: string[];
  taux?: number;
  dureeMin?: number;
  dureeMax?: number;
  montantMin?: number;
  montantMax?: number;
  fraisDossier?: number;
  assuranceObligatoire: boolean;
  documentsRequises: string[];
  delaiTraitement?: string;
  isActive: boolean;
  ordreAffichage: number;
}

export default function FinancementPartenaireDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [partenaire, setPartenaire] = useState<Partenaire | null>(null);
  const [services, setServices] = useState<ServiceFinancier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] =
    useState<ServiceFinancier | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      // console.log("🔍 ID du partenaire:", id); // ✅ Debug
      const partenairesResponse = await financementAPI.getPartenairesDetails(
        id
      );
      // console.log("✅ Réponse API:", partenairesResponse.data); // ✅ Debug complet
      if (!partenairesResponse.data) {
        setError("Partenaire non trouvé");
        return;
      }
      setPartenaire(partenairesResponse.data);
      // ✅ Vérifiez la structure des données retournées
      const services = partenairesResponse.data.ServiceFinancier || [];
      // console.log("📊 Services reçus:", services); // ✅ Debug services
      setServices(services);
    } catch (error) {
      console.error("❌ Erreur lors du chargement:", error);
      setError("Impossible de charger les données du partenaire");
    } finally {
      setLoading(false);
    }
  };

  const handleContactPartner = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setShowContactForm(true);
  };

  const handleCloseContactForm = () => {
    setShowContactForm(false);
  };

  const handleContactSubmit = async (formData: any) => {
    try {
      const demandeData = {
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        message: formData.message,
        type: "contact_partenaire",
        partenaireId: partenaire?.id,
      };
      const response = await financementAPI.submitDemande(demandeData);
      if (response.data.success) {
        alert("Votre demande a été envoyée avec succès !");
        setShowContactForm(false);
      }
    } catch (error) {
      console.error("Erreur envoi demande:", error);
      alert("Erreur lors de l'envoi de la demande. Veuillez réessayer.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFFFFF] via-[#FFFFFF] to-[#D3D3D3] flex flex-col">
        {/* <Header /> */}
        <LoadingSpinner text="chargement des details " />
        {/* <Footer /> */}
      </div>
    );
  }

  if (error || !partenaire) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFFFFF] via-[#FFFFFF] to-[#D3D3D3] flex flex-col">
        {/* <Header /> */}
        <div className="flex-1 flex items-center justify-center">
          <Card className="p-8 max-w-md border-2 border-[#8B4513]/20 bg-[#8B4513]/10">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-[#8B4513] mr-3" />
              <h2 className="text-xl font-bold text-[#556B2F]">Erreur</h2>
            </div>
            <p className="text-[#556B2F] mb-6">{error}</p>
            <Button
              onClick={() => navigate("/financement")}
              className="w-full bg-[#556B2F] hover:bg-[#6B8E23] text-white rounded-xl"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour au financement
            </Button>
          </Card>
        </div>
        {/* <Footer /> */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFFFF] via-[#FFFFFF] to-[#D3D3D3] flex flex-col">
      {/* <Header /> */}
      {/* Bouton retour */}
      <section className="pt-6 px-4">
        <div className="container mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/financement")}
            className="text-[#8B4513] hover:text-[#556B2F] hover:bg-[#D3D3D3]/50 rounded-xl"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour aux partenaires
          </Button>
        </div>
      </section>
      {/* En-tête du partenaire */}
      <section className="py-12 px-4 border-b border-[#D3D3D3]">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row items-start gap-8">
              {/* Logo/Icon */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#6B8E23]/20 to-[#556B2F]/20 flex items-center justify-center flex-shrink-0 border-2 border-[#556B2F]/30">
                {partenaire.icon ? (
                  <img
                    src={partenaire.icon}
                    alt={partenaire.nom}
                    className="w-20 h-20"
                  />
                ) : (
                  <DollarSign className="w-12 h-12 text-[#556B2F]" />
                )}
              </div>
              {/* Informations principales */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-4xl font-bold text-[#556B2F] mb-2">
                      {partenaire.nom}
                    </h1>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(partenaire.rating)
                                ? "text-[#6B8E23] fill-current"
                                : "text-[#D3D3D3]"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-lg font-semibold text-[#8B4513]">
                        {partenaire.rating}/5
                      </span>
                    </div>
                  </div>
                  {partenaire.isActive && (
                    <div className="px-4 py-2 bg-[#6B8E23]/20 text-[#556B2F] rounded-xl font-semibold flex items-center gap-2 w-fit">
                      <CheckCircle className="h-5 w-5" />
                      Partenaire Actif
                    </div>
                  )}
                </div>
                <p className="text-lg text-[#8B4513] leading-relaxed mb-6">
                  {partenaire.description}
                </p>
                {partenaire.conditions && (
                  <div className="p-4 bg-[#556B2F]/10 border border-[#556B2F]/30 rounded-xl mb-6">
                    <h3 className="font-semibold text-[#556B2F] mb-2 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Conditions importantes
                    </h3>
                    <p className="text-[#6B8E23]">{partenaire.conditions}</p>
                  </div>
                )}
                {/* Boutons d'action */}
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={handleContactPartner}
                    className="bg-[#556B2F] hover:bg-[#6B8E23] text-white rounded-xl px-8 py-3 font-semibold"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    Contacter le partenaire
                  </Button>
                  {partenaire.website && (
                    <Button
                      onClick={() => window.open(partenaire.website, "_blank")}
                      variant="outline"
                      className="border-[#D3D3D3] hover:bg-[#D3D3D3]/50 rounded-xl px-8 py-3 font-semibold"
                    >
                      <Globe className="h-5 w-5 mr-2" />
                      Visiter le site
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Informations de contact */}
      <section className="py-12 px-4 bg-[#D3D3D3]/20 border-b border-[#D3D3D3]">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-[#556B2F] mb-8">
            Informations de Contact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partenaire.phone && (
              <Card className="p-6 border border-[#D3D3D3] rounded-xl hover:shadow-lg transition-all">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[#6B8E23]/20 flex items-center justify-center mr-4">
                    <Phone className="h-6 w-6 text-[#556B2F]" />
                  </div>
                  <h3 className="font-semibold text-[#556B2F]">Téléphone</h3>
                </div>
                <p className="text-[#8B4513] break-all">{partenaire.phone}</p>
              </Card>
            )}
            {partenaire.email && (
              <Card className="p-6 border border-[#D3D3D3] rounded-xl hover:shadow-lg transition-all">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[#6B8E23]/20 flex items-center justify-center mr-4">
                    <Mail className="h-6 w-6 text-[#556B2F]" />
                  </div>
                  <h3 className="font-semibold text-[#556B2F]">Email</h3>
                </div>
                <p className="text-[#8B4513] break-all">{partenaire.email}</p>
              </Card>
            )}
            {partenaire.address && (
              <Card className="p-6 border border-[#D3D3D3] rounded-xl hover:shadow-lg transition-all">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[#6B8E23]/20 flex items-center justify-center mr-4">
                    <MapPin className="h-6 w-6 text-[#556B2F]" />
                  </div>
                  <h3 className="font-semibold text-[#556B2F]">Adresse</h3>
                </div>
                <p className="text-[#8B4513]">{partenaire.address}</p>
              </Card>
            )}
            {partenaire.website && (
              <Card className="p-6 border border-[#D3D3D3] rounded-xl hover:shadow-lg transition-all">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[#6B8E23]/20 flex items-center justify-center mr-4">
                    <Globe className="h-6 w-6 text-[#556B2F]" />
                  </div>
                  <h3 className="font-semibold text-[#556B2F]">Site Web</h3>
                </div>
                <a
                  href={partenaire.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6B8E23] hover:text-[#556B2F] break-all"
                >
                  {partenaire.website}
                </a>
              </Card>
            )}
          </div>
        </div>
      </section>
      {/* Avantages du partenaire */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-[#556B2F] mb-8">
            Nos Avantages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {partenaire.avantages &&
              partenaire.avantages.map((avantage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 border border-[#D3D3D3] rounded-xl hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-[#6B8E23] flex-shrink-0 mt-1" />
                      <p className="text-[#8B4513] font-medium">{avantage}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
          </div>
        </div>
      </section>
      {/* Conditions financières */}
      {(partenaire.tauxMin || partenaire.dureeMin || partenaire.montantMin) && (
        <section className="py-12 px-4 bg-[#D3D3D3]/20 border-b border-[#D3D3D3]">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-[#556B2F] mb-8">
              Conditions Financières
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {partenaire.tauxMin && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="p-6 border border-[#D3D3D3] rounded-xl bg-[#FFFFFF] hover:shadow-lg transition-all">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-lg bg-[#6B8E23]/20 flex items-center justify-center mr-4">
                        <TrendingUp className="h-6 w-6 text-[#6B8E23]" />
                      </div>
                      <h3 className="font-semibold text-[#556B2F]">Taux</h3>
                    </div>
                    <p className="text-3xl font-bold text-[#6B8E23] mb-2">
                      {partenaire.tauxMin}% - {partenaire.tauxMax}%
                    </p>
                    <p className="text-sm text-[#8B4513]">
                      Taux d'intérêt annuel
                    </p>
                  </Card>
                </motion.div>
              )}
              {partenaire.dureeMin && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="p-6 border border-[#D3D3D3] rounded-xl bg-[#FFFFFF] hover:shadow-lg transition-all">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-lg bg-[#6B8E23]/20 flex items-center justify-center mr-4">
                        <Clock className="h-6 w-6 text-[#6B8E23]" />
                      </div>
                      <h3 className="font-semibold text-[#556B2F]">Durée</h3>
                    </div>
                    <p className="text-3xl font-bold text-[#6B8E23] mb-2">
                      {partenaire.dureeMin} - {partenaire.dureeMax}
                    </p>
                    <p className="text-sm text-[#8B4513]">Mois</p>
                  </Card>
                </motion.div>
              )}
              {partenaire.montantMin && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="p-6 border border-[#D3D3D3] rounded-xl bg-[#FFFFFF] hover:shadow-lg transition-all">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-lg bg-[#6B8E23]/20 flex items-center justify-center mr-4">
                        <DollarSign className="h-6 w-6 text-[#6B8E23]" />
                      </div>
                      <h3 className="font-semibold text-[#556B2F]">Montant</h3>
                    </div>
                    <p className="text-3xl font-bold text-[#6B8E23] mb-2">
                      {partenaire.montantMin?.toLocaleString()}€ -{" "}
                      {partenaire.montantMax?.toLocaleString()}€
                    </p>
                    <p className="text-sm text-[#8B4513]">Montant du prêt</p>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}
      {/* Services financiers */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-[#556B2F] mb-8">
            Nos Services Financiers
          </h2>
          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services
                .sort((a, b) => a.ordreAffichage - b.ordreAffichage)
                .map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ServiceCard
                      service={service}
                      onSelect={() => setSelectedService(service)}
                    />
                  </motion.div>
                ))}
            </div>
          ) : (
            <Card className="p-12 text-center border-2 border-dashed border-[#D3D3D3] rounded-xl">
              <AlertCircle className="h-12 w-12 text-[#D3D3D3] mx-auto mb-4" />
              <p className="text-[#8B4513] text-lg">
                Aucun service financier disponible pour ce partenaire
              </p>
            </Card>
          )}
        </div>
      </section>
      {/* Modal détails service */}
      {selectedService && (
        <ServiceDetailsModal
          service={selectedService}
          partenaire={partenaire}
          onClose={() => setSelectedService(null)}
          onContact={handleContactPartner}
        />
      )}
      {/* Modal de contact partenaire */}
      {showContactForm && partenaire && (
        <ContactPartnerModal
          partenaire={partenaire}
          onClose={handleCloseContactForm}
          onSubmit={handleContactSubmit}
        />
      )}
    </div>
  );
}

// Composant ServiceCard
function ServiceCard({
  service,
  onSelect,
}: {
  service: ServiceFinancier;
  onSelect: () => void;
}) {
  return (
    <Card
      className="p-8 border border-[#D3D3D3] rounded-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group bg-[#FFFFFF]"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-[#556B2F] mb-2 group-hover:text-[#6B8E23] transition-colors">
            {service.nom}
          </h3>
          <p className="text-sm text-[#8B4513]">
            Catégorie:{" "}
            <span className="font-semibold">{service.categorie}</span>
          </p>
        </div>
        {service.assuranceObligatoire && (
          <Shield className="h-6 w-6 text-[#8B4513]" />
        )}
      </div>
      <p className="text-[#8B4513] mb-6 leading-relaxed">
        {service.description}
      </p>
      {/* Avantages */}
      {service.avantages && service.avantages.length > 0 && (
        <div className="mb-6 space-y-2">
          {service.avantages.slice(0, 3).map((avantage, idx) => (
            <div key={idx} className="flex items-center text-sm text-[#8B4513]">
              <CheckCircle className="h-4 w-4 text-[#6B8E23] mr-2 flex-shrink-0" />
              {avantage}
            </div>
          ))}
          {service.avantages.length > 3 && (
            <p className="text-sm text-[#6B8E23] font-semibold">
              +{service.avantages.length - 3} avantages
            </p>
          )}
        </div>
      )}
      {/* Infos clés */}
      <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-t border-[#D3D3D3] pt-6">
        {service.taux && (
          <div>
            <p className="text-xs text-[#8B4513] uppercase font-semibold">
              Taux
            </p>
            <p className="text-lg font-bold text-[#6B8E23]">{service.taux}%</p>
          </div>
        )}
        {service.fraisDossier && (
          <div>
            <p className="text-xs text-[#8B4513] uppercase font-semibold">
              Frais
            </p>
            <p className="text-lg font-bold text-[#556B2F]">
              {service.fraisDossier}€
            </p>
          </div>
        )}
        {service.dureeMin && (
          <div>
            <p className="text-xs text-[#8B4513] uppercase font-semibold">
              Durée
            </p>
            <p className="text-lg font-bold text-[#556B2F]">
              {service.dureeMin}-{service.dureeMax} mois
            </p>
          </div>
        )}
        {service.montantMin && (
          <div>
            <p className="text-xs text-[#8B4513] uppercase font-semibold">
              Montant
            </p>
            <p className="text-lg font-bold text-[#556B2F]">
              {service.montantMin?.toLocaleString()}€+
            </p>
          </div>
        )}
      </div>
      <Button className="w-full bg-[#556B2F] hover:bg-[#6B8E23] text-white rounded-lg group-hover:bg-[#6B8E23] transition-colors">
        Voir détails
      </Button>
    </Card>
  );
}

// Composant Modal Détails Service
function ServiceDetailsModal({
  service,
  partenaire,
  onClose,
  onContact,
}: {
  service: ServiceFinancier;
  partenaire: Partenaire;
  onClose: () => void;
  onContact: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#FFFFFF] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#D3D3D3]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          {/* En-tête */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-[#556B2F] mb-2">
                {service.nom}
              </h2>
              <p className="text-[#8B4513] flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-[#556B2F] rounded-full"></span>
                {partenaire.nom}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-[#D3D3D3] hover:text-[#8B4513] transition-colors"
            >
              ✕
            </button>
          </div>
          {/* Description */}
          <p className="text-[#8B4513] mb-6 leading-relaxed">
            {service.description}
          </p>
          {/* Détails financiers */}
          <div className="grid grid-cols-2 gap-6 mb-8 p-6 bg-[#D3D3D3]/20 rounded-xl">
            {service.taux && (
              <div>
                <p className="text-sm text-[#8B4513] font-semibold uppercase mb-2">
                  Taux d'intérêt
                </p>
                <p className="text-2xl font-bold text-[#6B8E23]">
                  {service.taux}%
                </p>
              </div>
            )}
            {service.dureeMin && (
              <div>
                <p className="text-sm text-[#8B4513] font-semibold uppercase mb-2">
                  Durée du prêt
                </p>
                <p className="text-2xl font-bold text-[#556B2F]">
                  {service.dureeMin} à {service.dureeMax} mois
                </p>
              </div>
            )}
            {service.montantMin && (
              <div>
                <p className="text-sm text-[#8B4513] font-semibold uppercase mb-2">
                  Montant du prêt
                </p>
                <p className="text-2xl font-bold text-[#556B2F]">
                  {service.montantMin?.toLocaleString()}€ à{" "}
                  {service.montantMax?.toLocaleString()}€
                </p>
              </div>
            )}
            {service.fraisDossier && (
              <div>
                <p className="text-sm text-[#8B4513] font-semibold uppercase mb-2">
                  Frais de dossier
                </p>
                <p className="text-2xl font-bold text-[#556B2F]">
                  {service.fraisDossier}€
                </p>
              </div>
            )}
          </div>
          {/* Conditions */}
          {service.conditions && (
            <div className="mb-8 p-6 bg-[#556B2F]/10 border border-[#556B2F]/30 rounded-xl">
              <h3 className="font-semibold text-[#556B2F] mb-2 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Conditions d'accès
              </h3>
              <p className="text-[#6B8E23]">{service.conditions}</p>
            </div>
          )}
          {/* Avantages */}
          {service.avantages && service.avantages.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-[#556B2F] mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#6B8E23]" />
                Avantages
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {service.avantages.map((avantage, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#6B8E23] flex-shrink-0 mt-0.5" />
                    <p className="text-[#8B4513]">{avantage}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Documents requis */}
          {service.documentsRequises &&
            service.documentsRequises.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-[#556B2F] mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#8B4513]" />
                  Documents requis
                </h3>
                <ul className="space-y-2">
                  {service.documentsRequises.map((doc, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-[#8B4513] p-3 bg-[#D3D3D3]/20 rounded-lg"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#6B8E23]/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[#6B8E23]">
                          ✓
                        </span>
                      </div>
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          {/* Délai traitement */}
          {service.delaiTraitement && (
            <div className="mb-8 p-4 bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-xl">
              <p className="text-[#6B8E23] flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="font-semibold">
                  Délai de traitement: {service.delaiTraitement}
                </span>
              </p>
            </div>
          )}
          {/* Assurance */}
          {service.assuranceObligatoire && (
            <div className="mb-8 p-4 bg-[#8B4513]/10 border border-[#8B4513]/30 rounded-xl">
              <p className="text-[#8B4513] flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span className="font-semibold">
                  Assurance emprunteur obligatoire
                </span>
              </p>
            </div>
          )}
          {/* Boutons d'action */}
          <div className="flex gap-4 pt-6 border-t border-[#D3D3D3]">
            <Button
              onClick={onContact}
              className="flex-1 bg-[#556B2F] hover:bg-[#6B8E23] text-white rounded-lg font-semibold py-3"
            >
              <Mail className="h-5 w-5 mr-2" />
              Demander un devis
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-[#D3D3D3] hover:bg-[#D3D3D3]/50 rounded-lg font-semibold py-3"
            >
              Fermer
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Composant Modal Contact Partenaire
interface ContactFormData {
  nom: string;
  email: string;
  telephone: string;
  message: string;
}

function ContactPartnerModal({
  partenaire,
  onClose,
  onSubmit,
}: {
  partenaire: Partenaire;
  onClose: () => void;
  onSubmit: (data: ContactFormData) => Promise<void>;
}) {
  const [formData, setFormData] = useState<ContactFormData>({
    nom: "",
    email: "",
    telephone: "",
    message: `Bonjour, je souhaite contacter ${partenaire.nom} pour discuter de financement.`,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({
        nom: "",
        email: "",
        telephone: "",
        message: `Bonjour, je souhaite contacter ${partenaire.nom} pour discuter de financement.`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#FFFFFF] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#D3D3D3]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          {/* En-tête avec bouton fermer */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[#556B2F]">
                Contacter {partenaire.nom}
              </h2>
              <p className="text-[#8B4513] mt-2">
                Remplissez le formulaire ci-dessous et nous vous recontacterons
                rapidement
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={submitting}
              className="text-[#D3D3D3] hover:text-[#8B4513] transition-colors disabled:opacity-50"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#8B4513] mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  name="nom"
                  placeholder="Votre nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-3 border border-[#D3D3D3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-[#6B8E23] disabled:bg-[#D3D3D3]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B4513] mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  name="telephone"
                  placeholder="Votre téléphone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-3 border border-[#D3D3D3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-[#6B8E23] disabled:bg-[#D3D3D3]/20"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#8B4513] mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                placeholder="Votre email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={submitting}
                className="w-full px-4 py-3 border border-[#D3D3D3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-[#6B8E23] disabled:bg-[#D3D3D3]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#8B4513] mb-2">
                Message *
              </label>
              <textarea
                name="message"
                placeholder="Votre message"
                rows={5}
                value={formData.message}
                onChange={handleInputChange}
                required
                disabled={submitting}
                className="w-full px-4 py-3 border border-[#D3D3D3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-[#6B8E23] resize-none disabled:bg-[#D3D3D3]/20"
              />
            </div>
            {/* Informations du partenaire */}
            <div className="p-4 bg-[#556B2F]/10 border border-[#556B2F]/30 rounded-xl">
              <p className="text-sm text-[#6B8E23]">
                <span className="font-semibold">Partenaire sélectionné:</span>{" "}
                {partenaire.nom}
              </p>
              {partenaire.email && (
                <p className="text-sm text-[#6B8E23] mt-1">
                  <span className="font-semibold">Nous transférerons:</span>{" "}
                  {partenaire.email}
                </p>
              )}
            </div>
            {/* Boutons d'action */}
            <div className="flex gap-4 pt-6 border-t border-[#D3D3D3]">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-[#556B2F] hover:bg-[#6B8E23] disabled:bg-[#556B2F]/50 text-white rounded-xl py-3 font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Mail className="h-5 w-5" />
                    Envoyer ma demande
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 border-2 border-[#D3D3D3] hover:border-[#8B4513] text-[#8B4513] hover:text-[#556B2F] rounded-xl py-3 font-semibold transition-all duration-300 disabled:opacity-50"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
