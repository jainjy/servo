import React, { useState } from "react";
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

const RegisterPage = () => {
  // Remplace le useRouter de Next.js par une fonction basique
  const redirect = (url: string) => {
    window.location.href = url;
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "particular",
    companyName: "",
    acceptTerms: false,
    newsletter: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      setStep(2);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    if (!formData.acceptTerms) {
      alert("Veuillez accepter les conditions d'utilisation");
      return;
    }

    setIsLoading(true);

    try {
      const registerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        userType: formData.userType,
        companyName: formData.userType === 'professional' ? formData.companyName : undefined
      };

      await register(registerData);
      // La redirection est gérée par le service d'authentification
    } catch (error: any) {
      console.error("Registration failed:", error);
      alert(error.message || "Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      <div className="w-screen h-screen bg-black/80 backdrop-blur-lg -z-10 top-0 absolute"></div>
      <div className="absolute w-screen h-screen top-0 left-0 -z-20 opacity-70">
        <img
          src="/nature.jpeg"
          alt="Login Illustration"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-[80vw] lg:w-[80vw] flex h-[90vh] m-auto rounded-3xl shadow-xl overflow-hidden">
        <div className="hidden lg:flex lg:flex-1  bg-gradient-to-r from-black via-gray-800 to-gray-900 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

          <div className="relative z-10 flex flex-col justify-center px-16 text-white">
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 overflow-hidden h-10 bg-black flex items-center justify-center">
                  <img src="/logo.png" className="h-10 w-10 rounded-full" alt="Logo" />
                </div>
                <h1 className="text-2xl font-bold">SERVO</h1>
              </div>
              <p className="text-xl font-semibold">
                Rejoignez la super-app de l'habitat
              </p>
              <p className="text-blue-100 text-lg">
                Une plateforme complète pour tous vos besoins immobiliers et
                services
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
                    <p className="text-blue-100 text-sm">{feature.description}</p>
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

        <div className="relative flex-1 flex bg-white place-items-center overflow-y-auto">
          <div className="w-full max-w-2xl ">
            <Card className="border-0 p-0 m-0 h-full  rounded-none">
              <CardHeader>
                <div className=" flex justify-between items-center">
                  <div className="flex flex-col items-start justify-center">
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      Créer un compte
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {step === 1 ? "Informations de base" : "Finalisez votre inscription"}
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
                      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="firstName"
                            className="text-sm font-medium text-gray-700"
                          >
                            Prénom *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="firstName"
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
                          <label
                            htmlFor="lastName"
                            className="text-sm font-medium text-gray-700"
                          >
                            Nom *
                          </label>
                          <Input
                            id="lastName"
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
                        <label
                          htmlFor="email"
                          className="text-sm font-medium text-gray-700"
                        >
                          Email professionnel *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
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
                        <label
                          htmlFor="phone"
                          className="text-sm font-medium text-gray-700"
                        >
                          Téléphone *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="phone"
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

                      <div className="space-y-3 ">
                        <label className="text-sm font-medium text-gray-700">
                          Vous êtes *
                        </label>
                        <div className=" grid lg:grid-cols-2 grid-cols-1 gap-4">
                          <div
                            className={`border-2 rounded-lg p-2 cursor-pointer transition-all ${
                              formData.userType === "particular"
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                            onClick={() =>
                              handleInputChange("userType", "particular")
                            }
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded-full border-2 ${
                                  formData.userType === "particular"
                                    ? "border-blue-500 bg-blue-500"
                                    : "border-gray-400"
                                }`}
                              ></div>
                              <div>
                                <p className="font-medium">Particulier</p>
                                <p className="text-xs text-gray-600">
                                  Propriétaire, locataire
                                </p>
                              </div>
                            </div>
                          </div>

                          <div
                            className={`border-2 rounded-lg p-2 cursor-pointer transition-all ${
                              formData.userType === "professional"
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                            onClick={() =>
                              handleInputChange("userType", "professional")
                            }
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded-full border-2 ${
                                  formData.userType === "professional"
                                    ? "border-blue-500 bg-blue-500"
                                    : "border-gray-400"
                                }`}
                              ></div>
                              <div>
                                <p className="font-medium">Professionnel</p>
                                <p className="text-xs text-gray-600">
                                  Agent, prestataire
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {formData.userType === "professional" && (
                        <div className="space-y-2">
                          <label
                            htmlFor="companyName"
                            className="text-sm font-medium text-gray-700"
                          >
                            Nom de l'entreprise *
                          </label>
                          <Input
                            id="companyName"
                            placeholder="Nom de votre société"
                            className="h-11 bg-white border-gray-300"
                            value={formData.companyName}
                            onChange={(e) =>
                              handleInputChange("companyName", e.target.value)
                            }
                            required
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="password"
                            className="text-sm font-medium text-gray-700"
                          >
                            Mot de passe *
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="password"
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
                          <p className="text-xs text-gray-500">
                            Minimum 8 caractères avec majuscules, minuscules et
                            chiffres
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor="confirmPassword"
                            className="text-sm font-medium text-gray-700"
                          >
                            Confirmer le mot de passe *
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirmez votre mot de passe"
                              className="pl-10 pr-10 h-11 bg-white border-gray-300"
                              value={formData.confirmPassword}
                              onChange={(e) =>
                                handleInputChange("confirmPassword", e.target.value)
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

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="acceptTerms"
                            checked={formData.acceptTerms}
                            onCheckedChange={(checked) =>
                              handleInputChange("acceptTerms", checked as boolean)
                            }
                            required
                          />
                          <label
                            htmlFor="acceptTerms"
                            className="text-sm text-gray-600 cursor-pointer"
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
                          </label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="newsletter"
                            checked={formData.newsletter}
                            onCheckedChange={(checked) =>
                              handleInputChange("newsletter", checked as boolean)
                            }
                          />
                          <label
                            htmlFor="newsletter"
                            className="text-sm text-gray-600 cursor-pointer"
                          >
                            Je souhaite recevoir les actualités et offres de SERVO
                          </label>
                        </div>
                      </div>
                    </>
                  )}

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
                          {step === 1 ? "Chargement..." : "Création du compte..."}
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
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Se connecter
                    </a>
                  </div>
                </form>

                <div>
                  <p className="text-center text-xs justify-end flex text-gray-600">
                    © 2025 SERVO . Tous droits réservés.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
