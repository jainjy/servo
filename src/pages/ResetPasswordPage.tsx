import React, { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Fonction de validation des mots de passe
const validatePassword = (password: string) => {
  return {
    minLength: password.length >= 8,
    maxLength: password.length <= 12,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;/]/.test(password),
  };
};

const isPasswordValid = (password: string) => {
  const validation = validatePassword(password);
  return Object.values(validation).every((v) => v === true);
};

const PasswordRequirement = ({
  met,
  text,
}: {
  met: boolean;
  text: string;
}) => (
  <div className="flex items-center gap-2 text-xs">
    <div
      className={`w-3 h-3 rounded-full ${
        met ? "bg-green-500" : "bg-gray-300"
      }`}
    />
    <span className={met ? "text-green-600" : "text-gray-600"}>{text}</span>
  </div>
);

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { verifyResetToken, resetPassword } = useAuth();

  const [loading, setLoading] = useState(true);
  const [validToken, setValidToken] = useState(false);
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false
  });
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    maxLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        toast.error("Token manquant");
        navigate("/forgot-password");
        return;
      }

      try {
        setLoading(true);
        const result = await verifyResetToken(token);
        
        if (result.valid) {
          setValidToken(true);
          setEmail(result.email);
          toast.success("Token valide. Vous pouvez maintenant réinitialiser votre mot de passe.");
        } else {
          setValidToken(false);
          toast.error("Token invalide ou expiré");
          navigate("/forgot-password");
        }
      } catch (error) {
        console.error("Erreur vérification token:", error);
        setValidToken(false);
        toast.error(error.message || "Token invalide ou expiré");
        navigate("/forgot-password");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Mettre à jour la validation du mot de passe en temps réel
    if (name === "newPassword") {
      setPasswordValidation(validatePassword(value));
    }
    
    // Effacer l'erreur quand l'utilisateur tape
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'Nouveau mot de passe requis';
    } else if (!isPasswordValid(formData.newPassword)) {
      newErrors.newPassword = 'Le mot de passe ne respecte pas les conditions requises (8-12 caractères, majuscule, minuscule, chiffre et caractère spécial)';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmation du mot de passe requise';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      await resetPassword(token, formData.newPassword);
      
      toast.success("Mot de passe réinitialisé avec succès !");
      
      // Redirection après 2 secondes
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Erreur réinitialisation:", error);
      toast.error(error.message || "Erreur lors de la réinitialisation du mot de passe");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="border-0 shadow-2xl bg-[#FFFFFF]/95 backdrop-blur-md w-full max-w-md">
          <CardHeader className="space-y-1 pb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#556B2F] to-[#6B8E23] rounded-2xl flex items-center justify-center">
                <img src="/logo.png" className="h-10 w-10" alt="Logo" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Vérification en cours...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-[#556B2F] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!validToken) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full space-y-8 text-center">
          <Card className="border-0 shadow-2xl bg-[#FFFFFF]/95 backdrop-blur-md">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#556B2F] to-[#6B8E23] rounded-2xl flex items-center justify-center">
                  <img src="/logo.png" className="h-10 w-10" alt="Logo" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Token invalide
              </CardTitle>
              <CardDescription className="text-gray-600">
                Le lien de réinitialisation est invalide ou a expiré.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/forgot-password">
                <Button className="w-full h-11 bg-gradient-to-r from-[#556B2F] to-[#6B8E23] hover:from-[#556B2F]/90 hover:to-[#6B8E23]/90 text-white font-semibold rounded-md">
                  Demander un nouveau lien
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex relative overflow-hidden">
      {/* Effet de fond */}
      <div className="absolute top-0 left-[-5rem] w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 right-[-5rem] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

      <div className="absolute inset-0 bg-black/80 backdrop-blur-lg -z-10"></div>
      <div className="absolute inset-0 -z-20">
        <img
          src="/nature.jpeg"
          alt="Login Illustration"
          className="opacity-70 w-full h-full object-cover"
        />
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto flex items-center justify-center px-6 py-16 lg:py-24 z-10">
        <div className="flex justify-center w-full max-w-md">
          <Card className="border-0 shadow-2xl bg-[#FFFFFF]/95 backdrop-blur-md w-full">
            <CardHeader className="pt-8 px-8 pb-4">
              {/* Retour */}
              <div className="flex items-center mb-1">
                <Link
                  to="/login"
                  className="inline-flex items-center text-sm text-[#556B2F] hover:text-[#556B2F]/90 font-medium"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour à la connexion
                </Link>
              </div>

              {/* Logo au-dessus du titre */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                  <img src="/logo.png" className="h-10 w-10" alt="Logo" />
                </div>
              </div>

              <CardTitle className="text-2xl font-bold text-center text-gray-900">
                Nouveau mot de passe
              </CardTitle>

              <CardDescription className="text-center text-gray-600">
                Pour l'email : <span className="font-medium">{email}</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nouveau mot de passe */}
                <div className="space-y-2">
                  <label
                    htmlFor="newPassword"
                    className="text-sm font-medium text-gray-700 block"
                  >
                    Nouveau mot de passe *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword.newPassword ? "text" : "password"}
                      placeholder="Créez un mot de passe sécurisé"
                      className={`pl-10 pr-10 h-11 bg-[#FFFFFF] ${
                        errors.newPassword 
                          ? "border-red-300 focus:border-red-500" 
                          : "border-[#D3D3D3] focus:border-[#556B2F]"
                      } rounded-md`}
                      value={formData.newPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => togglePasswordVisibility("newPassword")}
                    >
                      {showPassword.newPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2 mt-2">
                    <p className="text-xs font-medium text-gray-700">
                      Critères du mot de passe :
                    </p>
                    <PasswordRequirement
                      met={passwordValidation.minLength}
                      text="Au moins 8 caractères"
                    />
                    <PasswordRequirement
                      met={passwordValidation.maxLength}
                      text="Maximum 12 caractères"
                    />
                    <PasswordRequirement
                      met={passwordValidation.hasUpperCase}
                      text="Au moins une majuscule (A-Z)"
                    />
                    <PasswordRequirement
                      met={passwordValidation.hasLowerCase}
                      text="Au moins une minuscule (a-z)"
                    />
                    <PasswordRequirement
                      met={passwordValidation.hasNumber}
                      text="Au moins un chiffre (0-9)"
                    />
                    <PasswordRequirement
                      met={passwordValidation.hasSpecialChar}
                      text="Au moins un caractère spécial (!@#$%^&*...)"
                    />
                  </div>
                  {errors.newPassword && (
                    <p className="text-sm text-red-600 mt-1">{errors.newPassword}</p>
                  )}
                </div>

                {/* Confirmation mot de passe */}
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-700 block"
                  >
                    Confirmer le mot de passe *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword.confirmPassword ? "text" : "password"}
                      placeholder="Retapez votre mot de passe"
                      className={`pl-10 pr-10 h-11 bg-[#FFFFFF] ${
                        errors.confirmPassword 
                          ? "border-red-300 focus:border-red-500" 
                          : "border-[#D3D3D3] focus:border-[#556B2F]"
                      } rounded-md`}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => togglePasswordVisibility("confirmPassword")}
                    >
                      {showPassword.confirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Bouton de soumission */}
                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-[#556B2F] to-[#6B8E23] hover:from-[#556B2F]/90 hover:to-[#6B8E23]/90 text-white font-semibold rounded-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Réinitialisation en cours...
                    </div>
                  ) : (
                    "Réinitialiser le mot de passe"
                  )}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  Vous vous souvenez de votre mot de passe ?{" "}
                  <Link
                    to="/login"
                    className="text-[#556B2F] hover:text-[#556B2F]/90 font-medium"
                  >
                    Se connecter
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}