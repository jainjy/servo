import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Camera,
  FileText,
  User,
  Phone,
  Mail,
  Home,
  MapPin,
  Calendar,
  Share2,
  Search,
  Clock,
  HomeIcon,
  TreePalm,
  Building,
  BookCheck,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "@/lib/api";

// Images de fond pour chaque catégorie
const backgroundImages = {
  interieurs:
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1916&q=80",
  exterieurs:
    "https://images.unsplash.com/photo-1586500036706-419638c4e6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  constructions:
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
};

const categories = {
  interieurs: {
    id: "interieurs",
    label: "PRESTATIONS INTÉRIEURES",
    description: "Transformez votre intérieur avec nos experts",
    sectionId: "Prestations intérieures",
  },
  exterieurs: {
    id: "exterieurs",
    label: "PRESTATIONS EXTÉRIEURES",
    description: "Aménagez vos espaces extérieurs",
    sectionId: "Prestations extérieures",
  },
  constructions: {
    id: "constructions",
    label: "CONSTRUCTIONS",
    description: "Bâtissez votre projet de A à Z",
    sectionId: "Constructions",
  },
};

// Modal pour les photos
export const PhotosModal = ({ isOpen, onClose, prestation }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen && prestation) {
      setCurrentImageIndex(0);
    }
  }, [isOpen, prestation]);

  if (!isOpen || !prestation) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % prestation.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + prestation.images.length) % prestation.images.length
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {prestation.libelle}
            </h2>
            <p className="text-gray-600 text-sm">{prestation.description}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img
              src={prestation.images[currentImageIndex]}
              alt={`${prestation.libelle} - Image ${currentImageIndex + 1}`}
              className="w-full h-96 object-cover"
            />

            {prestation.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {prestation.images.length}
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50">
          <div className="flex gap-3">
            <Button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800">
              <Share2 className="h-4 w-4 mr-2" />
              Partager
            </Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              <FileText className="h-4 w-4 mr-2" />
              Demander un devis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal pour le devis
export const DevisModal = ({ isOpen, onClose, prestation }) => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    message: "",
    dateSouhaitee: "",
    budget: "",
  });
  const {user}=useAuth();
  useEffect(() => {
    if (isOpen) {
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        adresse: "",
        message: "",
        dateSouhaitee: "",
        budget: "",
      });
    }
  }, [isOpen]);

  if (!isOpen || !prestation) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userId=user.id;

      const demandeData = {
        contactNom: formData.nom,
        contactPrenom: formData.prenom,
        contactEmail: formData.email,
        contactTel: formData.telephone,
        lieuAdresse: formData.adresse,
        lieuAdresseCp: "75000", // À adapter avec un système de géocodage
        lieuAdresseVille: "Paris", // À adapter avec un système de géocodage
        optionAssurance: false,
        description: formData.message,
        devis: `Budget estimé: ${formData.budget}, Date souhaitée: ${formData.dateSouhaitee}`, // Utilisation du nouveau champ
        serviceId: prestation.id,
        nombreArtisans: "UNIQUE",
        createdById: userId,
      };

      const response = await api.post("/demandes", demandeData);

      if (response.status === 201) {
        alert("Votre demande a été créée avec succès !");
        onClose();
      }
    } catch (error) {
      console.error("Erreur création demande:", error);
      alert("Erreur lors de la création de la demande");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Demande de Devis
              </h2>
              <p className="text-gray-600 text-xs lg:text-sm">
                {prestation.libelle}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute lg:relative right-2 top-2 h-8 w-8 bg-red-600 text-white font-bold rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Nom *
              </label>
              <Input
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Votre nom"
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Prénom *
              </label>
              <Input
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                placeholder="Votre prénom"
                required
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 inline mr-1" />
                Email *
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 inline mr-1" />
                Téléphone *
              </label>
              <Input
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="06 12 34 56 78"
                required
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Home className="h-4 w-4 inline mr-1" />
              Adresse du projet
            </label>
            <Input
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              placeholder="Adresse complète du projet"
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Date souhaitée
              </label>
              <Input
                name="dateSouhaitee"
                type="date"
                value={formData.dateSouhaitee}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget estimé
              </label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-3"
                required
              >
                <option value="">Sélectionnez un budget</option>
                <option value="0-5000">0 - 5 000 €</option>
                <option value="5000-15000">5 000 - 15 000 €</option>
                <option value="15000-30000">15 000 - 30 000 €</option>
                <option value="30000+">30 000 € et plus</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message supplémentaire
            </label>
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Décrivez votre projet en détail..."
              rows={4}
              className="w-full"
            />
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              Prestation sélectionnée
            </h3>
            <p className="text-blue-800 text-sm">{prestation.libelle}</p>
            <p className="text-blue-600 text-xs">{prestation.description}</p>
          </div>

          <div className="grid lg:flex gap-3 pt-4 border-t">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <FileText className="h-4 w-4 mr-2" />
              Envoyer la demande
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Composant principal combiné
const IntelligibleSection = ({ showAllPrestations }) => {
  const location = useLocation();
  const [categorie, setCategorie] = useState("interieurs");
  const [servicesCategorie, setServicesCategorie] = useState([]);
  const [displayedPrestations, setDisplayedPrestations] = useState([]);
  const [selectedType, setSelectedType] = useState("TOUS");
  const [searchFilter, setSearchFilter] = useState("");
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const [photosModal, setPhotosModal] = useState({
    isOpen: false,
    prestation: null,
  });
  const [devisModal, setDevisModal] = useState({
    isOpen: false,
    prestation: null,
  });

  const sections = [
    { id: "interieurs", label: "Intérieur", icon: HomeIcon },
    { id: "exterieurs", label: "Extérieur", icon: TreePalm },
    { id: "constructions", label: "Construction", icon: Building },
  ];

  const currentCategory = categories[categorie];

  const fetchServicesCategorie = async (cat) => {
    try {
      const response = await api.get(`/categories/name/${cat}/services`);
      console.log("Catégories de services:", response.data);
      setServicesCategorie(response.data);

      // Initialiser les index d'images pour chaque prestation
      const initialIndexes = {};
      response.data.services?.forEach((service) => {
        initialIndexes[service.id] = 0;
      });
      setCurrentImageIndexes(initialIndexes);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des catégories de services:",
        error
      );
    }
  };

  // Fonction de recherche corrigée
  const search = (e) => {
    const mot = e.target.value;
    setSearchFilter(mot);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("categorie");

    const validIds = sections.map((s) => s.id);
    const validCategorie = validIds.includes(cat) ? cat : "interieurs";

    setCategorie(validCategorie);
    fetchServicesCategorie(categories[validCategorie].sectionId);
  }, [location.search]);

  // Filtrage des prestations basé sur la recherche et le type sélectionné
  useEffect(() => {
    const currentPrestations = servicesCategorie?.services || [];

    let filtered = currentPrestations;

    // Filtre par type
    if (selectedType !== "TOUS") {
      filtered = filtered.filter(
        (prestation) => prestation.libelle === selectedType
      );
    }

    // Filtre par recherche
    if (searchFilter) {
      filtered = filtered.filter(
        (prestation) =>
          prestation.libelle
            .toLowerCase()
            .includes(searchFilter.toLowerCase()) ||
          prestation.description
            ?.toLowerCase()
            .includes(searchFilter.toLowerCase())
      );
    }

    setDisplayedPrestations(
      showAllPrestations ? filtered : filtered.slice(0, 8)
    );
  }, [selectedType, servicesCategorie, searchFilter, showAllPrestations]);

  const nextImage = (prestationId, totalImages, e) => {
    e?.stopPropagation();
    setCurrentImageIndexes((prev) => ({
      ...prev,
      [prestationId]: ((prev[prestationId] || 0) + 1) % totalImages,
    }));
  };

  const prevImage = (prestationId, totalImages, e) => {
    e?.stopPropagation();
    setCurrentImageIndexes((prev) => ({
      ...prev,
      [prestationId]:
        ((prev[prestationId] || 0) - 1 + totalImages) % totalImages,
    }));
  };

  const openPhotosModal = (prestation) => {
    setPhotosModal({ isOpen: true, prestation });
  };

  const openDevisModal = (prestation) => {
    setDevisModal({ isOpen: true, prestation });
  };

  const closePhotosModal = () => {
    setPhotosModal({ isOpen: false, prestation: null });
  };

  const closeDevisModal = () => {
    setDevisModal({ isOpen: false, prestation: null });
  };

  return (
    <>
      <section
        id={currentCategory.sectionId}
        className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.95)), url(${backgroundImages[categorie]})`,
          }}
        />

        <div className="relative container mx-auto px-4 pt-20 pb-16">
          <div className="text-center mb-0 lg:mb-12">
            <h1 className="text-4xl md:text-3xl font-bold text-gray-900 mb-6">
              {currentCategory.label}
            </h1>
            <p className="text-sm lg:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              {currentCategory.description}
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 mb-12 shadow-2xl border border-white/20">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
              <div className="lg:col-span-2">
                <label className="flex text-sm font-semibold text-gray-800 mb-3 items-center gap-2">
                  <Search className="h-4 w-4" />
                  Recherche avancée
                </label>
                <div className="grid lg:flex gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <Input
                        placeholder="Rechercher une prestation..."
                        className="pl-12 rounded-2xl border-2 text-center border-gray-200 focus:border-blue-500 transition-all duration-300 p-4 bg-white shadow-sm"
                        value={searchFilter}
                        onChange={search}
                      />
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 items-center h-28 overflow-y-auto">
              <span className="text-sm font-semibold text-gray-700 mr-2 flex items-center gap-2">
                <BookCheck className="h-4 w-4" />
                LISTES :
              </span>
              <button
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border-2 transition-all duration-300 ${
                  selectedType === "TOUS"
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent shadow-lg scale-105"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600 hover:shadow-md"
                }`}
                onClick={() => setSelectedType("TOUS")}
              >
                TOUS
              </button>
              {servicesCategorie?.services?.map((type) => (
                <button
                  key={type.id}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border-2 transition-all duration-300 ${
                    selectedType === type.libelle
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent shadow-lg scale-105"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600 hover:shadow-md"
                  }`}
                  onClick={() => setSelectedType(type.libelle)}
                >
                  {type.libelle}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {displayedPrestations.map((prestation) => {
              const currentImageIndex = currentImageIndexes[prestation.id] || 0;
              const totalImages = prestation.images?.length || 0;
              const currentImage =
                prestation.images?.[currentImageIndex] ||
                "/placeholder-image.jpg";

              return (
                <Card
                  key={prestation.id}
                  className="group overflow-hidden border-0 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 rounded-3xl cursor-pointer transform hover:-translate-y-2"
                >
                  <div className="relative">
                    <div
                      className="relative h-56 overflow-hidden rounded-t-3xl cursor-pointer"
                      onClick={() => openPhotosModal(prestation)}
                    >
                      <img
                        src={currentImage}
                        alt={prestation.libelle}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 text-xs font-bold text-gray-800 shadow-lg">
                        {prestation.libelle}
                      </div>

                      {totalImages > 1 && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-9 w-9 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                            onClick={(e) =>
                              prevImage(prestation.id, totalImages, e)
                            }
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-9 w-9 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                            onClick={(e) =>
                              nextImage(prestation.id, totalImages, e)
                            }
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>

                          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                            {currentImageIndex + 1}/{totalImages}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {prestation.libelle}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {prestation.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {totalImages > 0 && (
                            <Button
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all duration-300 hover:shadow-md"
                              onClick={() => openPhotosModal(prestation)}
                            >
                              <Camera className="h-3.5 w-3.5 mr-1.5" />
                              Photos ({totalImages})
                            </Button>
                          )}
                          <Button
                            className="text-white font-semibold bg-slate-900 py-2.5 px-4 rounded-xl text-xs hover:bg-black transition-all duration-300 hover:shadow-lg"
                            onClick={() => openDevisModal(prestation)}
                          >
                            <FileText className="h-3.5 w-3.5 mr-1.5" />
                            FAIRE UN DEVIS
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {displayedPrestations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Aucune prestation trouvée pour votre recherche.
              </p>
            </div>
          )}

          <div className="text-center">
            <div className="inline-flex items-center gap-4 bg-slate-950 px-8 py-4 rounded-2xl shadow-2xl">
              <div className="bg-white/20 p-2 rounded-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm lg:text-lg">
                  DEVIS ENVOYÉ DANS LES 48H
                </p>
                <p className="text-blue-100 text-xs lg:text-sm">
                  Réponse garantie sous 2 jours ouvrés
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PhotosModal
        isOpen={photosModal.isOpen}
        onClose={closePhotosModal}
        prestation={photosModal.prestation}
      />
      <DevisModal
        isOpen={devisModal.isOpen}
        onClose={closeDevisModal}
        prestation={devisModal.prestation}
      />
    </>
  );
};

export default IntelligibleSection;
