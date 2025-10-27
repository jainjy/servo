import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { prestationsData, prestationTypesByCategory } from "./travauxData";
import {
  ChevronLeft,
  ChevronRight,
  Star,
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
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Modal pour les photos
const PhotosModal = ({ isOpen, onClose, prestation }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
    }
  }, [isOpen]);

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
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {prestation.title}
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

        {/* Content */}
        <div className="p-6">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img
              src={prestation.images[currentImageIndex]}
              alt={`${prestation.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-96 object-cover"
            />

            {/* Navigation */}
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

            {/* Indicateur */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {prestation.images.length}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {prestation.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                {feature}
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {prestation.location}
              </div>
              {prestation.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  {prestation.rating}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
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
const DevisModal = ({ isOpen, onClose, prestation }) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulaire devis envoyé:", {
      ...formData,
      prestation: prestation.title,
    });
    alert(
      "Votre demande de devis a été envoyée avec succès ! Nous vous répondrons dans les 48h."
    );
    onClose();
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
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Demande de Devis
              </h2>
              <p className="text-gray-600 text-sm">{prestation.title}</p>
            </div>
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

        {/* Form */}
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

          {/* Prestation Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              Prestation sélectionnée
            </h3>
            <p className="text-blue-800 text-sm">{prestation.title}</p>
            <p className="text-blue-600 text-xs">{prestation.description}</p>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <FileText className="h-4 w-4 mr-2" />
              Envoyer la demande
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TravauxPreview = ({ homeCards }: { homeCards?: boolean }) => {
  const navigate = useNavigate();
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const [photosModal, setPhotosModal] = useState({
    isOpen: false,
    prestation: null,
  });
  const [devisModal, setDevisModal] = useState({
    isOpen: false,
    prestation: null,
  });

  // Prendre les 4 premiers travaux toutes catégories confondues
  const allPrestations = Object.values(prestationsData).flat();
  const displayedPrestations = allPrestations.slice(0, 4);

  useEffect(() => {
    const indexes = {};
    displayedPrestations.forEach((prestation) => {
      indexes[prestation.id] = 0;
    });
    setCurrentImageIndexes(indexes);
  }, []);

  const nextImage = (prestationId, totalImages, e) => {
    e?.stopPropagation();
    setCurrentImageIndexes((prev) => ({
      ...prev,
      [prestationId]: (prev[prestationId] + 1) % totalImages,
    }));
  };

  const prevImage = (prestationId, totalImages, e) => {
    e?.stopPropagation();
    setCurrentImageIndexes((prev) => ({
      ...prev,
      [prestationId]: (prev[prestationId] - 1 + totalImages) % totalImages,
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
    <section className="container mx-auto -mt-6 px-4 py-8">
      <div className="bg-white shadow-lg px-8 py-5 rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Nos Travaux
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez un aperçu de nos travaux les plus récents
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {displayedPrestations.map((prestation) => {
            const currentImageIndex = currentImageIndexes[prestation.id] || 0;
            const totalImages = prestation.images.length;
            
            // Trouver la catégorie et le type de la prestation
            const category = Object.entries(prestationsData).find(([_, prestations]) =>
                    (prestations as any[]).some((p) => p.id === prestation.id)
            )?.[0];
            const prestationType = prestationTypesByCategory[category]?.find(
              (t) => t.value === prestation.type
            );

            return (
              <Card
                key={prestation.id}
                className={
                  homeCards
                    ? "home-card group cursor-pointer h-full"
                    : "group overflow-hidden border-0 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 rounded-3xl cursor-pointer transform hover:-translate-y-2"
                }
              >
                <div className="relative overflow-hidden">
                  <div className={homeCards ?"h-72 rounded-lg overflow-hidden":"relative h-56 overflow-hidden rounded-t-3xl"}>
                    <img
                      src={prestation.images[currentImageIndex]}
                      alt={prestation.title}
                      className={homeCards ? "h-full w-full" : "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"}
                    />

                    {/* Overlay gradient */}
                    <div 
                    className={homeCards ? "absolute inset-0 rounded-lg bg-gradient-to-t from-black to-transparent opacity-100" :"absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"} />

                    {/* Badge type */}
                    <div 
                    className={homeCards ? "absolute top-1/2 left-1/2 text-sm -translate-x-1/2 -translate-y-1/2 font-extralight font-mono text-white bg-black/50 px-4 py-2 rounded-full":"absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 text-xs font-bold text-gray-800 shadow-lg"}>
                      {prestationType?.label}
                    </div>

                    {/* Navigation images */}
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

                        {/* Indicateur d'images */}
                        <div 
                        className={homeCards ? "hidden":"absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm"}>
                          {currentImageIndex + 1}/{totalImages}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Contenu de la carte */}
                  <div className={homeCards ?"hidden":"p-6"}>
                    {/* Boutons d'action */}
                    <div className="flex gap-2">
                      <Button
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all duration-300 hover:shadow-md flex-1"
                        onClick={() => openPhotosModal(prestation)}
                      >
                        <Camera className="h-3.5 w-3.5 mr-1.5" />
                        Photos
                      </Button>
                      <Button
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2.5 px-4 rounded-xl text-xs font-semibold transition-all duration-300 hover:shadow-lg flex-1"
                        onClick={() => openDevisModal(prestation)}
                      >
                        <FileText className="h-3.5 w-3.5 mr-1.5" />
                        DEVIS
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

          <Button
            variant="outline"
            className="rounded-2xl border-1 bg-slate-950 border-gray-300 hover:border-blue-500 hover:bg-black text-lg py-4 font-semibold transition-all duration-300 hover:shadow-lg group"
            onClick={() => navigate("/travaux")}
          >
            <span className="text-white text-base font-mono">
              VOIR TOUS NOS TRAVAUX
            </span>
            <ArrowRight className=" h-5 w-5 text-blue-600 group-hover:text-purple-600 transition-transform group-hover:translate-x-1" />
          </Button>

      </div>

      {/* Modals */}
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
    </section>
  );
};

export default TravauxPreview;