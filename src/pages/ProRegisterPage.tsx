import React, { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Building,
  Phone,
  Home,
  Car,
  Trees,
  CheckCircle,
  MapPin,
  Hash,
  Search,
  X,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LocationPickerModal } from "@/components/location-picker-modal";
import api from "@/lib/api";
import { formatDate } from "date-fns";

const ProRegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { subscriptionData } = location.state || {};
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [metiersList, setMetiersList] = useState([]);
  const [metiersLoading, setMetiersLoading] = useState(false);
  const [metiersSearchQuery, setMetiersSearchQuery] = useState("");
  const { signupPro } = useAuth();
  const [formData, setFormData] = useState({
    // Informations de base
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    // Type d'utilisateur
    userType: subscriptionData?.userTypes[0], // PRESTATAIRE | VENDEUR | ADMIN | AGENCE | BIEN_ETRE
    role: "professional", // particular ou professional
    demandType: "", // agence immobilier, particulier ou syndicat
    // Informations entreprise (si professionnel)
    companyName: "",
    commercialName: "",
    siret: "",
    // Adresse
    address: "",
    addressComplement: "",
    zipCode: "",
    city: "",
    // Coordonnées GPS
    latitude: "",
    longitude: "",
    // Métiers (si prestataire)
    metiers: [] as number[],
    acceptTerms: false,
    dataImported: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const bienEtreMetiers = [
    "BoutiqueNaturels",
    "Podcasteur",
    "Thérapeute",
    "Masseur",
    "Formateur",
  ];
  const espacementMetiers = ["espace ameublements"];

  useEffect(() => {
    // Charger les métiers depuis l'API
    const loadMetiers = async () => {
      try {
        setMetiersLoading(true);
        const response = await api.get("/metiers/all");
        setMetiersList(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des métiers:", error);
        toast.error("Impossible de charger les métiers");
      } finally {
        setMetiersLoading(false);
      }
    };
    loadMetiers();
  }, []);

  // Auto-sélectionner les métiers pour VENDEUR et BIEN_ETRE
  useEffect(() => {
    if (
      metiersList.length > 0 &&
      (formData.userType === "VENDEUR" || formData.userType === "BIEN_ETRE")
    ) {
      const filteredMetiers = getFilteredMetiers();
      const metierIds = filteredMetiers.map((m) => m.id);
      setFormData((prev) => ({
        ...prev,
        metiers: metierIds,
      }));
    }
  }, [formData.userType, metiersList]);

  const getFilteredMetiers = () => {
    return metiersList.filter((metier) => {
      if (formData.userType === "BIEN_ETRE") {
        return bienEtreMetiers.includes(metier.libelle);
      }
      if (formData.userType === "VENDEUR") {
        return espacementMetiers.includes(metier.libelle);
      }
      return true;
    });
  };

  const getSearchFilteredMetiers = () => {
    const filtered = getFilteredMetiers();
    return filtered.filter((metier) =>
      metier.libelle.toLowerCase().includes(metiersSearchQuery.toLowerCase())
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }

    // Validation des mots de passe
    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    if (!formData.acceptTerms) {
      toast.error("Veuillez accepter les conditions d'utilisation");
      return;
    }
    if (formData.metiers.length == 0) {
      toast.error("Veuillez accepter ajouters au moins un metiers");
      return;
    }

    // DÉTERMINER userType BASÉ SUR L'ABONNEMENT EXACT
    let finalUserType = "CLIENT"; // Valeur par défaut
    if (subscriptionData) {
      // Mapping exact basé sur les abonnements de vos images
      console.log(subscriptionData);
      const subscriptionToUserType: { [key: string]: string } = {
        "Pro Immobilier Complet": "AGENCE",
        "Prestataires de Services": "PRESTATAIRE",
        "Espace Annonceur": "VENDEUR",
        "Bien-être": "BIEN_ETRE",
      };
      finalUserType =
        subscriptionToUserType[subscriptionData.name] || "PRESTATAIRE";
    }

    // Créer le mapping metiersLabel
    const metiersLabel: { [key: number]: string } = {};
    formData.metiers.forEach((metierId) => {
      const metier = metiersList.find((m) => m.id === metierId);
      if (metier) {
        metiersLabel[metierId] = metier.libelle;
      }
    });

    // Appel à l'API d'inscription sans paiement
    setIsLoading(true);
    formData.userType = finalUserType;
    formData.metiers = formData.metiers || [];
    try {
      const response = await signupPro(formData, subscriptionData.truePlanId);
      toast.success("Inscription réussie ! Essai gratuit de 2 mois activé.");
      // Redirection vers la page de succès
      navigate("/register/success", {
        state: {
          user: response.user,
          metiersLabel: metiersLabel,
          plan: subscriptionData,
          metiers: formData.metiers,
        },
      });
    } catch (error) {
      toast.error("Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  // Afficher l'abonnement sélectionné dans le formulaire
  useEffect(() => {
    if (subscriptionData) {
      console.log("Subscription selected:", subscriptionData);
      // Pré-remplir userType basé sur l'abonnement exact
      const subscriptionToUserType: { [key: string]: string } = {
        "Pro Immobilier Complet": "AGENCE",
        "Prestataires de Services": "PRESTATAIRE",
        "Espace Annonceur": "VENDEUR",
        "Bien-être": "BIEN_ETRE",
      };
      const userTypeFromSubscription =
        subscriptionToUserType[subscriptionData.name];
      if (userTypeFromSubscription) {
        setFormData((prev) => ({
          ...prev,
          userType: userTypeFromSubscription,
        }));
      }
    }
  }, [subscriptionData]);

  const handleInputChange = (
    field: string,
    value: string | boolean | number[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMetierToggle = (metierId: number) => {
    setFormData((prev) => ({
      ...prev,
      metiers: prev.metiers.includes(metierId)
        ? prev.metiers.filter((id) => id !== metierId)
        : [...prev.metiers, metierId],
    }));
  };

  const features = [
    {
      icon: <Home className="h-6 w-6" />,
      title: "Immobilier Intelligent",
      description: "Recherche avancée avec IA et matching de propriétés",
    },
    {
      icon: <Car className="h-6 w-6" />,
      title: "Services Qualifiés",
      description: "Accédez à des prestataires vérifiés et notés",
    },
    {
      icon: <Trees className="h-6 w-6" />,
      title: "Réservations Faciles",
      description: "Réservez visites et activités en quelques clics",
    },
    {
      icon: <Building className="h-6 w-6" />,
      title: "Gestion Centralisée",
      description: "Tout votre habitat géré depuis une seule plateforme",
    },
  ];
  const handleBack = () => {
    navigate("/register/professional/subscription");
  };
  const [redirecting, setRedirecting] = useState(false);
  return (
    <div className="min-h-screen flex">
      {/* Background reste identique */}
      <div className="w-screen h-screen bg-black/80 backdrop-blur-lg -z-10 top-0 absolute"></div>

      <div className="absolute w-screen h-screen top-0 left-0 -z-20 opacity-70">
        <img
          src="/nature.jpeg"
          alt="Login Illustration"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-[80vw] lg:w-[80vw] flex h-[90vh] m-auto rounded-3xl shadow-xl overflow-hidden">
        {/* Sidebar reste identique */}
        <div className="hidden lg:flex lg:flex-1 bg-gradient-to-r from-black via-gray-800 to-gray-900 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
          <div className="relative z-10 flex flex-col justify-center px-16 text-white">
            {/* Bouton Retour stylé en haut à gauche */}
            <div className="absolute top-6 left-6 z-30">
              <Button
                variant="outline"
                className="px-6 py-3 border-white/30 bg-black/40 backdrop-blur-md text-white hover:bg-white/20 hover:text-white hover:border-white/50 transition-all duration-300 rounded-2xl shadow-2xl group"
                onClick={handleBack}
                disabled={redirecting}
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="font-semibold">Retour</span>
              </Button>
            </div>
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 overflow-hidden h-10 rounded-full bg-black flex items-center justify-center">
                  <img
                    src="/logo.png"
                    className="h-full w-full rounded-full"
                    alt="Logo"
                  />
                </div>
                <h1 className="text-2xl font-bold azonix tracking-wider">
                  SERVO
                </h1>
              </div>
              <p className="text-md font-semibold">
                REJOIGNEZ LA SUPER APP DE L'HABITAT
              </p>
              <p className="text-[#8B4513] text-sm mt-2">
                Des biens immobiliers, ses services additionnels, produits
                adaptés à vos besoins et vos locations au sein d’une seule
                plateforme
              </p>
            </div>
            <div className="space-y-6 ">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-[#8B4513] text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-8 border-t border-white/20">
              <div className="flex items-center gap-2 text-green-300 mb-2">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Déjà 5,000+ utilisateurs satisfaits
                </span>
              </div>
              <p className="text-[#8B4513] text-sm">
                "Rejoignez la communauté des professionnels et particulier qui
                révolutionnent l'habitat"
              </p>
            </div>
          </div>
        </div>
        <div className="relative flex-1 flex bg-[#FFFFFF] overflow-y-auto">
          <div className="w-full max-w-2xl">
            <Card className="border-0 p-0 m-0 h-full rounded-none">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col items-start justify-center">
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      Créer un compte
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {step === 1
                        ? "Informations de base"
                        : "Finalisez votre inscription"}
                    </CardDescription>
                  </div>
                  <div className="absolute right-4 top-4 flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        step === 1 ? "bg-[#556B2F]" : "bg-[#6B8E23]"
                      }`}
                    ></div>
                    <div
                      className={`w-3 h-3 rounded-full ${
                        step === 2 ? "bg-[#556B2F]" : "bg-[#D3D3D3]"
                      }`}
                    ></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-2">
                  {step === 1 ? (
                    <>
                      {/* Informations personnelles */}
                      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Prénom *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Votre prénom"
                              className="pl-10 h-11 bg-[#FFFFFF] border-[#D3D3D3]"
                              value={formData.firstName}
                              onChange={(e) =>
                                handleInputChange("firstName", e.target.value)
                              }
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Nom *
                          </label>
                          <Input
                            placeholder="Votre nom"
                            className="h-11 bg-[#FFFFFF] border-[#D3D3D3]"
                            value={formData.lastName}
                            onChange={(e) =>
                              handleInputChange("lastName", e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            type="email"
                            placeholder="votre@email.mg"
                            className="pl-10 h-11 bg-[#FFFFFF] border-[#D3D3D3]"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Téléphone *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="+261 34 12 345 67"
                            className="pl-10 h-11 bg-[#FFFFFF] border-[#D3D3D3]"
                            value={formData.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>
                      {/* Informations entreprise (si professionnel) */}
                      {formData.role === "professional" && (
                        <>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              Nom de l'entreprise *
                            </label>
                            <div className="relative">
                              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="Nom de votre société"
                                className="pl-10 h-11 bg-[#FFFFFF] border-[#D3D3D3]"
                                value={formData.companyName}
                                onChange={(e) =>
                                  handleInputChange(
                                    "companyName",
                                    e.target.value
                                  )
                                }
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              Nom commercial
                            </label>
                            <Input
                              placeholder="Nom commercial"
                              className="h-11 bg-[#FFFFFF] border-[#D3D3D3]"
                              value={formData.commercialName}
                              onChange={(e) =>
                                handleInputChange(
                                  "commercialName",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              Numéro SIRET
                            </label>
                            <div className="relative">
                              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="123 456 789 00012"
                                className="pl-10 h-11 bg-[#FFFFFF] border-[#D3D3D3]"
                                value={formData.siret}
                                onChange={(e) =>
                                  handleInputChange("siret", e.target.value)
                                }
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Étape 2 - Métiers avec recherche améliorée */}
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-3">
                            Sélectionnez vos métiers *
                            {(formData.userType === "VENDEUR" ||
                              formData.userType === "BIEN_ETRE") && (
                              <span className="ml-2 text-xs text-[#6B8E23] font-normal">
                                (Tous sélectionnés automatiquement)
                              </span>
                            )}
                          </label>

                          {/* Barre de recherche */}
                          {getFilteredMetiers().length > 2 && (
                            <div className="mb-4 relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                type="text"
                                placeholder="Rechercher un métier..."
                                className="pl-10 pr-8 h-10 bg-gray-50 border-[#D3D3D3] rounded-lg text-sm"
                                value={metiersSearchQuery}
                                onChange={(e) =>
                                  setMetiersSearchQuery(e.target.value)
                                }
                              />
                              {metiersSearchQuery && (
                                <button
                                  type="button"
                                  onClick={() => setMetiersSearchQuery("")}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          )}

                          {/* Liste des métiers */}
                          <div className="space-y-2">
                            {metiersLoading ? (
                              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                                <div className="w-5 h-5 border-2 border-gray-400 border-t-[#556B2F] rounded-full animate-spin mx-auto mb-2"></div>
                                Chargement des métiers...
                              </div>
                            ) : getSearchFilteredMetiers().length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
                                {getSearchFilteredMetiers().map((metier) => (
                                  <div
                                    key={metier.id}
                                    onClick={() =>
                                      handleMetierToggle(metier.id)
                                    }
                                    className={`group relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                      formData.metiers.includes(metier.id)
                                        ? "border-[#556B2F] bg-gradient-to-r from-[#556B2F]/10 to-[#556B2F]/20 shadow-md"
                                        : "border-[#D3D3D3] bg-[#FFFFFF] hover:border-[#556B2F]/50 hover:shadow-sm"
                                    }`}
                                  >
                                    {/* Checkbox personnalisé */}
                                    <div
                                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                        formData.metiers.includes(metier.id)
                                          ? "border-[#556B2F] bg-[#556B2F]"
                                          : "border-[#D3D3D3] group-hover:border-[#556B2F]/50"
                                      }`}
                                    >
                                      {formData.metiers.includes(metier.id) && (
                                        <CheckCircle className="h-4 w-4 text-white fill-current" />
                                      )}
                                    </div>

                                    {/* Texte du métier */}
                                    <span
                                      className={`text-sm font-medium transition-all ${
                                        formData.metiers.includes(metier.id)
                                          ? "text-[#556B2F]"
                                          : "text-gray-700 group-hover:text-gray-900"
                                      }`}
                                    >
                                      {metier.libelle}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                                <p className="text-sm">
                                  Aucun métier ne correspond à votre recherche
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Compteur de sélection */}
                          <div className="mt-4 p-3 bg-[#556B2F]/10 rounded-lg border border-[#556B2F]/20">
                            <p className="text-xs text-[#556B2F] font-medium">
                              {formData.metiers.length} métier
                              {formData.metiers.length > 1 ? "s" : ""}{" "}
                              sélectionné
                              {formData.metiers.length > 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Adresse */}
                      <div className="space-y-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Adresse *
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Votre adresse complète"
                              className="pl-10 h-11 bg-[#FFFFFF] border-[#D3D3D3]"
                              value={formData.address}
                              onChange={(e) =>
                                handleInputChange("address", e.target.value)
                              }
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Complément d'adresse
                          </label>
                          <Input
                            placeholder="Appartement, étage, etc."
                            className="h-11 bg-[#FFFFFF] border-[#D3D3D3]"
                            value={formData.addressComplement}
                            onChange={(e) =>
                              handleInputChange(
                                "addressComplement",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              Code postal *
                            </label>
                            <Input
                              placeholder="75001"
                              className="h-11 bg-[#FFFFFF] border-[#D3D3D3]"
                              value={formData.zipCode}
                              onChange={(e) =>
                                handleInputChange("zipCode", e.target.value)
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              Ville *
                            </label>
                            <Input
                              placeholder="Paris"
                              className="h-11 bg-[#FFFFFF] border-[#D3D3D3]"
                              value={formData.city}
                              onChange={(e) =>
                                handleInputChange("city", e.target.value)
                              }
                              required
                            />
                          </div>
                        </div>
                        {/* Coordonnées GPS (optionnelles) */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              Position géographique *
                            </label>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setLocationModalOpen(true)}
                              className="w-full justify-start h-11 border-[#D3D3D3]"
                            >
                              <MapPin className="h-4 w-4 mr-2" />
                              {formData.latitude && formData.longitude
                                ? `Position définie: ${parseFloat(
                                    formData.latitude
                                  ).toFixed(4)}, ${parseFloat(
                                    formData.longitude
                                  ).toFixed(4)}`
                                : "Cliquez pour sélectionner sur la carte"}
                            </Button>
                            <p className="text-xs text-gray-500">
                              Sélectionnez votre position précise sur la carte
                              pour être localisé par les clients
                            </p>
                          </div>
                          {/* Modal de sélection de position */}
                          <LocationPickerModal
                            open={locationModalOpen}
                            onOpenChange={setLocationModalOpen}
                            latitude={
                              formData.latitude
                                ? parseFloat(formData.latitude)
                                : null
                            }
                            longitude={
                              formData.longitude
                                ? parseFloat(formData.longitude)
                                : null
                            }
                            onLocationChange={(lat, lng) => {
                              handleInputChange("latitude", lat.toString());
                              handleInputChange("longitude", lng.toString());
                            }}
                          />
                        </div>
                      </div>
                      {/* Mot de passe */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Mot de passe *
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Créez un mot de passe sécurisé"
                              className="pl-10 pr-10 h-11 bg-[#FFFFFF] border-[#D3D3D3]"
                              value={formData.password}
                              onChange={(e) =>
                                handleInputChange("password", e.target.value)
                              }
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-11 w-11 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                          <p className="text-[10px] text-gray-500">
                            Minimum 8 caractères avec majuscules, minuscules et
                            chiffres
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Confirmer le mot de passe *
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirmez votre mot de passe"
                              className="pl-10 pr-10 h-11 bg-[#FFFFFF] border-[#D3D3D3]"
                              value={formData.confirmPassword}
                              onChange={(e) =>
                                handleInputChange(
                                  "confirmPassword",
                                  e.target.value
                                )
                              }
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-11 w-11 hover:bg-transparent"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                      {/* Conditions et importation de données */}
                      <div className="space-y-3">
                        {/* Conditions d'utilisation */}
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="acceptTerms"
                            checked={formData.acceptTerms}
                            onCheckedChange={(checked) =>
                              handleInputChange(
                                "acceptTerms",
                                checked as boolean
                              )
                            }
                            required
                          />
                          <label
                            htmlFor="acceptTerms"
                            className="text-xs text-gray-600 cursor-pointer leading-snug"
                          >
                            J'accepte les{" "}
                            <a
                              href="/terms"
                              className="text-[#556B2F] hover:text-[#556B2F]/90 font-medium"
                            >
                              conditions d'utilisation
                            </a>{" "}
                            et la{" "}
                            <a
                              href="/privacy"
                              className="text-[#556B2F] hover:text-[#556B2F]/90 font-medium"
                            >
                              politique de confidentialité
                            </a>
                            .
                          </label>
                        </div>
                        {/* Importation de données */}
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="dataImported"
                            checked={formData.dataImported}
                            onCheckedChange={(checked) =>
                              handleInputChange(
                                "dataImported",
                                checked as boolean
                              )
                            }
                          />
                          <label
                            htmlFor="dataImported"
                            className="text-xs text-gray-600 cursor-pointer leading-snug"
                          >
                            Les personnes qui utilisent notre service ont pu
                            importer vos coordonnées sur Servo.{" "}
                            <a
                              href="/import-info"
                              className="text-[#556B2F] hover:text-[#556B2F]/90 font-medium"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              En savoir plus
                            </a>
                            .
                          </label>
                        </div>
                      </div>
                    </>
                  )}
                  {/* Boutons de navigation */}
                  <div className="flex gap-4">
                    {step === 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 h-11 border-[#D3D3D3]"
                        onClick={() => setStep(1)}
                      >
                        Retour
                      </Button>
                    )}
                    <Button
                      type="submit"
                      className={`${
                        step === 2 ? "flex-1" : "w-full"
                      } h-11 bg-gradient-to-r from-[#6B8E23] to-[#556B2F] hover:from-[#6B8E23]/90 hover:to-[#556B2F]/90 text-white font-semibold`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {step === 1
                            ? "Chargement..."
                            : "Création du compte..."}
                        </div>
                      ) : step === 1 ? (
                        "Continuer"
                      ) : (
                        "Créer mon compte"
                      )}
                    </Button>
                  </div>
                  <div className="text-center text-sm text-gray-600 mb-4">
                    Déjà un compte ?{" "}
                    <a
                      href="/login"
                      className="text-[#556B2F] ml-2 hover:text-[#556B2F]/90 font-medium"
                    >
                      Se connecter
                    </a>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProRegisterPage;
