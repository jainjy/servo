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
  Briefcase,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const ProRegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { subscriptionData } = location.state || {};
  const [formData, setFormData] = useState({
    // Informations de base
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",

    // Type d'utilisateur
    userType: "CLIENT", // PRESTATAIRE | VENDEUR | CLIENT | ADMIN | AGENCE | BIEN ETRE
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
  const { register } = useAuth();

  // Types d'utilisateurs disponibles
  const userTypes = [
    { value: "CLIENT", label: "Client" },
    { value: "PRESTATAIRE", label: "Prestataire" },
    { value: "VENDEUR", label: "Vendeur" },
    { value: "LOUEUR", label: "Loueur" },
  ];

  // Types de demandes
  const demandTypes = [
    { value: "particulier", label: "Particulier" },
    { value: "agence immobilier", label: "Agence immobilière" },
    { value: "syndicat", label: "Syndicat" },
  ];

  // Liste des métiers (exemple)
  const metiersList = [
    { id: 1, libelle: "Plombier" },
    { id: 2, libelle: "Électricien" },
    { id: 3, libelle: "Peintre" },
    { id: 4, libelle: "Menuisier" },
    { id: 5, libelle: "Jardinier" },
  ];

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

    // DÉTERMINER userType BASÉ SUR L'ABONNEMENT EXACT
    let finalUserType = "CLIENT"; // Valeur par défaut

    if (subscriptionData) {
      // Mapping exact basé sur les abonnements de vos images
      const subscriptionToUserType: { [key: string]: string } = {
        "Pro Immobilier Complet": "AGENCE",
        "Prestataires de Services": "PRESTATAIRE",
        "Espace Annonceur": "VENDEUR",
        "Bien-être": "BIEN ETRE",
      };

      finalUserType =
        subscriptionToUserType[subscriptionData.name] || "PRESTATAIRE";
    }

    // Redirection vers la page de paiement avec TOUTES les données
    navigate("/register/professional/payment", {
      state: {
        formData: {
          ...formData,
          userType: finalUserType, // AJOUT: userType basé sur l'abonnement exact
        },
        subscriptionData,
      },
    });
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
        "Bien-être": "BIEN ETRE",
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
        <div className="hidden lg:flex lg:flex-1  bg-gradient-to-r from-black via-gray-800 to-gray-900 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

          <div className="relative z-10 flex flex-col justify-center px-16 text-white">
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
              <p className="text-blue-100 text-sm mt-2">
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
                    <p className="text-blue-100 text-sm">
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
              <p className="text-blue-100 text-sm">
                "Rejoignez la communauté des professionnels et particuliers qui
                révolutionnent l'habitat"
              </p>
            </div>
          </div>
        </div>

        <div className="relative flex-1 flex bg-white overflow-y-auto">
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
                        step === 1 ? "bg-blue-600" : "bg-green-500"
                      }`}
                    ></div>
                    <div
                      className={`w-3 h-3 rounded-full ${
                        step === 2 ? "bg-blue-600" : "bg-gray-300"
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
                              className="pl-10 h-11 bg-white border-gray-300"
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
                            className="h-11 bg-white border-gray-300"
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
                            className="pl-10 h-11 bg-white border-gray-300"
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
                            className="pl-10 h-11 bg-white border-gray-300"
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
                                className="pl-10 h-11 bg-white border-gray-300"
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
                              className="h-11 bg-white border-gray-300"
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
                                className="pl-10 h-11 bg-white border-gray-300"
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
                      {/* Étape 2 */}
                      {/* Métiers (si prestataire) */}
                      {formData.userType === "PRESTATAIRE" && (
                        <div className="space-y-4">
                          <label className="text-sm font-medium text-gray-700">
                            Sélectionnez vos métiers *
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {metiersList.map((metier) => (
                              <div
                                key={metier.id}
                                className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                                  formData.metiers.includes(metier.id)
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-300 hover:border-gray-400"
                                }`}
                                onClick={() => handleMetierToggle(metier.id)}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-5 h-5 rounded-full border-2 ${
                                      formData.metiers.includes(metier.id)
                                        ? "border-blue-500 bg-blue-500"
                                        : "border-gray-400"
                                    }`}
                                  ></div>
                                  <span className="text-sm font-medium">
                                    {metier.libelle}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

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
                              className="pl-10 h-11 bg-white border-gray-300"
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
                            className="h-11 bg-white border-gray-300"
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
                              className="h-11 bg-white border-gray-300"
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
                              className="h-11 bg-white border-gray-300"
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
                              Latitude
                            </label>
                            <Input
                              type="number"
                              step="any"
                              placeholder="48.8566"
                              className="h-11 bg-white border-gray-300"
                              value={formData.latitude}
                              onChange={(e) =>
                                handleInputChange("latitude", e.target.value)
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              Longitude
                            </label>
                            <Input
                              type="number"
                              step="any"
                              placeholder="2.3522"
                              className="h-11 bg-white border-gray-300"
                              value={formData.longitude}
                              onChange={(e) =>
                                handleInputChange("longitude", e.target.value)
                              }
                            />
                          </div>
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
                              className="pl-10 pr-10 h-11 bg-white border-gray-300"
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
                              className="pl-10 pr-10 h-11 bg-white border-gray-300"
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
                              className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                              conditions d'utilisation
                            </a>{" "}
                            et la{" "}
                            <a
                              href="/privacy"
                              className="text-blue-600 hover:text-blue-700 font-medium"
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
                              className="text-blue-600 hover:text-blue-700 font-medium"
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
                        className="flex-1 h-11 border-gray-300"
                        onClick={() => setStep(1)}
                      >
                        Retour
                      </Button>
                    )}
                    <Button
                      type="submit"
                      className={`${
                        step === 2 ? "flex-1" : "w-full"
                      } h-11 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold`}
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
                      className="text-blue-600 ml-2 hover:text-blue-700 font-medium"
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
